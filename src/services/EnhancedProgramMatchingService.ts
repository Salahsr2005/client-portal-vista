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

    // 2. Enhanced Field/Subject match with exact matching only (40% weight - increased priority)
    const fieldWeight = 40
    maxPossibleScore += fieldWeight

    let fieldScore = 0
    let fieldMatchFound = false
    let fieldMatchType = "none"

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
        fieldMatchType = "exact"
        reasons.push(`Exact field match: ${fieldMatch.matchedKeywords.join(", ")}`)
      }
    }

    // Priority 2: Subject keywords exact match only
    if (!fieldMatchFound && consultationData.subjects && consultationData.subjects.length > 0) {
      const userSubjects = consultationData.subjects.map((s) => s.toLowerCase())

      if (program.field_keywords && program.field_keywords.length > 0) {
        const programKeywords = program.field_keywords.map((k: string) => k.toLowerCase())

        // Exact keyword matching only - no partial matches
        const exactKeywordMatches = userSubjects.filter((subject) => {
          // Direct exact keyword match
          const directMatch = programKeywords.some((keyword) => keyword === subject || subject === keyword)

          // Bilingual exact keyword match
          const bilingualMatch = BilingualFieldService.searchFields(subject, consultationData.userLanguage).some(
            (field) => {
              const fieldKeywords = consultationData.userLanguage === "fr" ? field.keywords_fr : field.keywords_en
              return fieldKeywords.some((fk) =>
                programKeywords.some((pk) => pk === fk.toLowerCase() || fk.toLowerCase() === pk),
              )
            },
          )

          return directMatch || bilingualMatch
        })

        if (exactKeywordMatches.length > 0) {
          const matchRatio = exactKeywordMatches.length / userSubjects.length
          fieldScore = fieldWeight * 0.8 * matchRatio
          fieldMatchFound = true
          fieldMatchType = "exact"
          reasons.push(`Exact subject keywords match: ${exactKeywordMatches.join(", ")}`)
        }
      }
    }

    // Priority 3: General field category exact match only
    if (!fieldMatchFound && consultationData.fieldOfStudy && program.field) {
      const fieldTranslation = BilingualFieldService.getFieldTranslation(program.field)
      const searchField = consultationData.fieldOfStudy.toLowerCase()

      // Only exact field name matches
      const englishExactMatch =
        program.field.toLowerCase() === searchField || searchField === program.field.toLowerCase()
      const frenchExactMatch =
        fieldTranslation &&
        (fieldTranslation.french.toLowerCase() === searchField || searchField === fieldTranslation.french.toLowerCase())

      if (englishExactMatch || frenchExactMatch) {
        fieldScore = fieldWeight * 0.7
        fieldMatchFound = true
        fieldMatchType = "exact"
        reasons.push(`Exact field category match`)
      }
    }

    if (fieldMatchFound) {
      totalScore += fieldScore
    } else {
      warnings.push("No exact field match found")
    }

    // 3. Budget Analysis (25% weight)
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

    // 4. Language Requirements (10% weight)
    const languageWeight = 10
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

    // 5. Duration match (5% weight)
    const durationWeight = 5
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
            matchType: fieldMatchType,
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

  // Enhanced search functionality with exact matching only
  static searchPrograms(programs: any[], searchQuery: string, language: "en" | "fr" = "en") {
    if (!searchQuery.trim()) return programs

    const query = searchQuery.toLowerCase().trim()

    return programs.filter((program) => {
      // 1. Direct field name exact match
      if (program.field && program.field.toLowerCase() === query) {
        return true
      }

      // 2. Program name exact word match
      if (program.name && program.name.toLowerCase().includes(query)) {
        return true
      }

      // 3. University name exact word match
      if (program.university && program.university.toLowerCase().includes(query)) {
        return true
      }

      // 4. Field keywords exact match only
      if (program.field_keywords && Array.isArray(program.field_keywords)) {
        const exactKeywordMatch = program.field_keywords.some(
          (keyword: string) => keyword.toLowerCase() === query || query === keyword.toLowerCase(),
        )
        if (exactKeywordMatch) return true
      }

      // 5. Bilingual field exact search only
      const fieldMatch = BilingualFieldService.matchProgramField(program, query, language)
      if (fieldMatch.exactMatch) {
        return true
      }

      // 6. Country/City exact match
      if (program.country && program.country.toLowerCase() === query) {
        return true
      }
      if (program.city && program.city.toLowerCase() === query) {
        return true
      }

      return false
    })
  }

  // Sort programs by relevance with exact matching priority
  static sortProgramsByRelevance(programs: any[], consultationData: EnhancedConsultationData) {
    return programs
      .map((program) => ({
        ...program,
        matchResult: this.calculateEnhancedMatchScore(program, consultationData),
      }))
      .sort((a, b) => {
        // Primary sort: Exact field match type priority
        const fieldMatchOrder = { exact: 3, none: 1 }
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


