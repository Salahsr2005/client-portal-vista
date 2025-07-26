import { BilingualFieldService } from "./BilingualFieldService"

export interface EnhancedConsultationData {
  studyLevel: string
  fieldOfStudy: string
  fieldSearchQuery?: string
  userLanguage: "en" | "fr"
  subjects: string[]
  tuitionBudget: number
  livingCostsBudget: number
  serviceFeesBudget: number
  totalBudget: number
  budgetMin?: number
  budgetMax?: number
  budgetFlexibility: "strict" | "flexible" | "very_flexible"
  language: string
  languageLevel: "beginner" | "intermediate" | "advanced" | "native"
  currentGPA: string
  previousEducationCountry: string
  hasLanguageCertificate: boolean
  intakePeriod: string
  urgency: "asap" | "flexible" | "planning_ahead"
  workWhileStudying: boolean
  scholarshipRequired: boolean
  religiousFacilities: boolean
  halalFood: boolean
  priorityFactors: string[]
  duration: string
}

export class EnhancedProgramMatchingService {
  static calculateEnhancedMatchScore(program: any, consultationData: EnhancedConsultationData) {
    let totalScore = 0
    let maxPossibleScore = 0
    const reasons: string[] = []
    const warnings: string[] = []
    const details: any = {}

    // 1. Study Level match (20% weight)
    const levelWeight = 20
    maxPossibleScore += levelWeight

    if (program.study_level === consultationData.studyLevel) {
      totalScore += levelWeight
      reasons.push(`Perfect match for ${consultationData.studyLevel} level`)
    } else {
      warnings.push(`Program is for ${program.study_level}, you selected ${consultationData.studyLevel}`)
    }

    // 2. Enhanced Field/Subject match with bilingual support (35% weight - increased priority)
    const fieldWeight = 35
    maxPossibleScore += fieldWeight

    let fieldScore = 0
    let fieldMatchFound = false

    // Priority 1: Exact field match using bilingual service
    if (consultationData.fieldSearchQuery) {
      const fieldMatch = BilingualFieldService.matchProgramField(
        program,
        consultationData.fieldSearchQuery,
        consultationData.userLanguage,
      )

      if (fieldMatch.exactMatch) {
        fieldScore = fieldWeight
        fieldMatchFound = true
        reasons.push(`Exact field match: ${fieldMatch.matchedKeywords.join(", ")}`)
      } else if (fieldMatch.partialMatch) {
        fieldScore = fieldWeight * 0.85
        fieldMatchFound = true
        reasons.push(`Field partially matches: ${fieldMatch.matchedKeywords.join(", ")}`)
      }
    }

    // Priority 2: Subject keywords match with bilingual support
    if (!fieldMatchFound && consultationData.subjects && consultationData.subjects.length > 0) {
      const userSubjects = consultationData.subjects.map((s) => s.toLowerCase())

      if (program.field_keywords && program.field_keywords.length > 0) {
        const programKeywords = program.field_keywords.map((k: string) => k.toLowerCase())

        // Enhanced keyword matching with bilingual support
        const keywordMatches = userSubjects.filter((subject) => {
          // Direct keyword match
          const directMatch = programKeywords.some((keyword) => keyword.includes(subject) || subject.includes(keyword))

          // Bilingual keyword match
          const bilingualMatch = BilingualFieldService.searchFields(subject, consultationData.userLanguage).some(
            (field) => {
              const fieldKeywords = consultationData.userLanguage === "fr" ? field.keywords_fr : field.keywords_en
              return fieldKeywords.some((fk) =>
                programKeywords.some((pk) => pk.includes(fk.toLowerCase()) || fk.toLowerCase().includes(pk)),
              )
            },
          )

          return directMatch || bilingualMatch
        })

        if (keywordMatches.length > 0) {
          const matchRatio = keywordMatches.length / userSubjects.length
          fieldScore = fieldWeight * 0.75 * matchRatio
          fieldMatchFound = true
          reasons.push(`Subject keywords match: ${keywordMatches.join(", ")}`)
        }
      }
    }

    // Priority 3: General field category match
    if (!fieldMatchFound && consultationData.fieldOfStudy && program.field) {
      const fieldTranslation = BilingualFieldService.getFieldTranslation(program.field)
      const searchField = consultationData.fieldOfStudy.toLowerCase()

      const englishMatch =
        program.field.toLowerCase().includes(searchField) || searchField.includes(program.field.toLowerCase())
      const frenchMatch =
        fieldTranslation &&
        (fieldTranslation.french.toLowerCase().includes(searchField) ||
          searchField.includes(fieldTranslation.french.toLowerCase()))

      if (englishMatch || frenchMatch) {
        fieldScore = fieldWeight * 0.6
        fieldMatchFound = true
        reasons.push(`General field category match`)
      }
    }

    if (fieldMatchFound) {
      totalScore += fieldScore
    } else {
      warnings.push("Field may not match your interests")
    }

    // 3. Budget Analysis (25% weight - increased priority)
    const budgetWeight = 25
    maxPossibleScore += budgetWeight

    const tuitionMin = program.tuition_min || 0
    const tuitionMax = program.tuition_max || 0
    const livingCostAnnual = (program.living_cost_min || 0) * 12
    const totalMinCost = tuitionMin + livingCostAnnual
    const totalMaxCost = tuitionMax + (program.living_cost_max || program.living_cost_min || 0) * 12

    details.costs = {
      tuitionRange: [tuitionMin, tuitionMax],
      livingCostAnnual,
      totalRange: [totalMinCost, totalMaxCost],
    }

    // Enhanced budget matching with range consideration
    if (consultationData.budgetMin && consultationData.budgetMax) {
      const userBudgetRange = consultationData.budgetMax - consultationData.budgetMin
      const programCostRange = totalMaxCost - totalMinCost

      // Check for budget overlap
      const overlapStart = Math.max(consultationData.budgetMin, totalMinCost)
      const overlapEnd = Math.min(consultationData.budgetMax, totalMaxCost)
      const hasOverlap = overlapStart <= overlapEnd

      if (hasOverlap) {
        const overlapSize = overlapEnd - overlapStart
        const overlapRatio = overlapSize / Math.max(userBudgetRange, programCostRange)
        totalScore += budgetWeight * overlapRatio
        reasons.push(`Budget ranges overlap by ${Math.round(overlapRatio * 100)}%`)
      }
    } else {
      // Fallback to total budget comparison
      if (consultationData.totalBudget >= totalMaxCost) {
        totalScore += budgetWeight
        reasons.push(
          `Comfortably within budget (€${totalMaxCost.toLocaleString()} vs €${consultationData.totalBudget.toLocaleString()})`,
        )
      } else if (consultationData.totalBudget >= totalMinCost) {
        const budgetRatio = (consultationData.totalBudget - totalMinCost) / (totalMaxCost - totalMinCost)
        totalScore += budgetWeight * (0.5 + budgetRatio * 0.5)
        reasons.push(`Within budget range`)
        if (consultationData.budgetFlexibility === "strict") {
          warnings.push(
            `May exceed strict budget by €${(totalMaxCost - consultationData.totalBudget).toLocaleString()}`,
          )
        }
      } else {
        const shortfall = totalMinCost - consultationData.totalBudget
        const flexibilityMultiplier =
          {
            strict: 0,
            flexible: 0.2,
            very_flexible: 0.5,
          }[consultationData.budgetFlexibility] || 0.2

        if (shortfall <= consultationData.totalBudget * flexibilityMultiplier) {
          totalScore += budgetWeight * 0.3
          warnings.push(`Budget shortfall of €${shortfall.toLocaleString()}, but within flexibility range`)
        } else {
          warnings.push(`Exceeds budget by €${shortfall.toLocaleString()}`)
        }
      }
    }

    // 4. Language Requirements (12% weight)
    const languageWeight = 12
    maxPossibleScore += languageWeight

    const userLanguage = consultationData.language.toLowerCase()
    const programLanguage = program.program_language?.toLowerCase() || ""

    if (userLanguage === "any" || programLanguage.includes(userLanguage) || userLanguage.includes(programLanguage)) {
      const proficiencyMultiplier =
        {
          native: 1.0,
          advanced: 0.9,
          intermediate: 0.8,
          beginner: 0.6,
        }[consultationData.languageLevel] || 0.8

      totalScore += languageWeight * proficiencyMultiplier
      reasons.push(`Language compatible (${consultationData.languageLevel} level)`)

      if (consultationData.languageLevel === "beginner") {
        warnings.push("May require language preparation")
      }
    } else {
      warnings.push("Language requirements may not match")
    }

    // 5. Duration match (8% weight)
    const durationWeight = 8
    maxPossibleScore += durationWeight

    let preferredMonths = 0
    if (consultationData.duration === "semester") preferredMonths = 6
    else if (consultationData.duration === "year") preferredMonths = 12
    else if (consultationData.duration === "two_years") preferredMonths = 24
    else if (consultationData.duration === "full") preferredMonths = 36

    if (preferredMonths > 0 && program.duration_months) {
      const durationDiff = Math.abs(program.duration_months - preferredMonths)
      if (durationDiff <= 3) {
        totalScore += durationWeight
        reasons.push("Duration matches preference")
      } else if (durationDiff <= 6) {
        totalScore += durationWeight * 0.7
        reasons.push("Duration close to preference")
      }
    }

    const finalScore = Math.min(100, Math.round((totalScore / maxPossibleScore) * 100))

    return {
      score: finalScore,
      reasons,
      warnings,
      details,
      fieldMatchDetails: fieldMatchFound
        ? {
            matchType: fieldScore === fieldWeight ? "exact" : fieldScore >= fieldWeight * 0.7 ? "partial" : "category",
            matchScore: fieldScore,
            language: consultationData.userLanguage,
          }
        : null,
      recommendation:
        finalScore >= 85
          ? "highly_recommended"
          : finalScore >= 70
            ? "recommended"
            : finalScore >= 50
              ? "consider"
              : "not_recommended",
    }
  }

  // Enhanced search functionality with bilingual keyword support
  static searchPrograms(programs: any[], searchQuery: string, language: "en" | "fr" = "en") {
    if (!searchQuery.trim()) return programs

    const query = searchQuery.toLowerCase().trim()

    return programs.filter((program) => {
      // 1. Direct field name match
      if (program.field && program.field.toLowerCase().includes(query)) {
        return true
      }

      // 2. Program name match
      if (program.name && program.name.toLowerCase().includes(query)) {
        return true
      }

      // 3. University name match
      if (program.university && program.university.toLowerCase().includes(query)) {
        return true
      }

      // 4. Field keywords match
      if (program.field_keywords && Array.isArray(program.field_keywords)) {
        const keywordMatch = program.field_keywords.some(
          (keyword: string) => keyword.toLowerCase().includes(query) || query.includes(keyword.toLowerCase()),
        )
        if (keywordMatch) return true
      }

      // 5. Bilingual field search
      const fieldMatch = BilingualFieldService.matchProgramField(program, query, language)
      if (fieldMatch.exactMatch || fieldMatch.partialMatch) {
        return true
      }

      // 6. Country/City match
      if (program.country && program.country.toLowerCase().includes(query)) {
        return true
      }
      if (program.city && program.city.toLowerCase().includes(query)) {
        return true
      }

      return false
    })
  }

  // Sort programs by relevance
  static sortProgramsByRelevance(programs: any[], consultationData: EnhancedConsultationData) {
    return programs
      .map((program) => ({
        ...program,
        matchResult: this.calculateEnhancedMatchScore(program, consultationData),
      }))
      .sort((a, b) => {
        // Primary sort: Field match type (exact > partial > category > none)
        const fieldMatchOrder = { exact: 4, partial: 3, category: 2, none: 1 }
        const aFieldMatch = a.matchResult.fieldMatchDetails?.matchType || "none"
        const bFieldMatch = b.matchResult.fieldMatchDetails?.matchType || "none"

        if (fieldMatchOrder[aFieldMatch] !== fieldMatchOrder[bFieldMatch]) {
          return fieldMatchOrder[bFieldMatch] - fieldMatchOrder[aFieldMatch]
        }

        // Secondary sort: Overall match score
        if (a.matchResult.score !== b.matchResult.score) {
          return b.matchResult.score - a.matchResult.score
        }

        // Tertiary sort: Budget compatibility
        const aBudgetCompatible = a.matchResult.reasons.some((r: string) => r.includes("budget"))
        const bBudgetCompatible = b.matchResult.reasons.some((r: string) => r.includes("budget"))

        if (aBudgetCompatible !== bBudgetCompatible) {
          return bBudgetCompatible ? 1 : -1
        }

        // Final sort: Program ranking (if available)
        return (a.ranking || 999) - (b.ranking || 999)
      })
  }
}

