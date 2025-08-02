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

    // 1. Study Field Match (60% weight - Primary focus on field matching)
    const fieldWeight = 60
    maxPossibleScore += fieldWeight

    let fieldScore = 0
    let fieldMatchFound = false
    let fieldMatchType = "none"

    // Priority 1: Direct field name exact match
    if (consultationData.fieldSearchQuery && program.field) {
      const searchField = consultationData.fieldSearchQuery.toLowerCase().trim()
      const programField = program.field.toLowerCase().trim()

      // Exact field name match
      if (programField === searchField || searchField === programField) {
        fieldScore = fieldWeight
        fieldMatchFound = true
        fieldMatchType = "exact"
        reasons.push(`Perfect field match: ${program.field}`)
      }
      // Field contains search term or vice versa (for compound field names)
      else if (programField.includes(searchField) || searchField.includes(programField)) {
        fieldScore = fieldWeight * 0.9
        fieldMatchFound = true
        fieldMatchType = "exact"
        reasons.push(`Direct field match: ${program.field}`)
      }
    }

    // Priority 2: Bilingual field matching
    if (!fieldMatchFound && consultationData.fieldSearchQuery) {
      const fieldMatch = BilingualFieldService.matchProgramField(
        program,
        consultationData.fieldSearchQuery,
        consultationData.userLanguage,
      )

      if (fieldMatch.exactMatch) {
        fieldScore = fieldWeight * 0.95
        fieldMatchFound = true
        fieldMatchType = "exact"
        reasons.push(`Bilingual field match: ${fieldMatch.matchedKeywords.join(", ")}`)
      }
    }

    // Priority 3: Field keywords exact matching
    if (!fieldMatchFound && consultationData.subjects && consultationData.subjects.length > 0) {
      const userSubjects = consultationData.subjects.map((s) => s.toLowerCase().trim())

      if (program.field_keywords && program.field_keywords.length > 0) {
        const programKeywords = program.field_keywords.map((k: string) => k.toLowerCase().trim())

        // Count exact keyword matches
        const exactMatches = userSubjects.filter((subject) =>
          programKeywords.some(
            (keyword) =>
              keyword === subject || subject === keyword || keyword.includes(subject) || subject.includes(keyword),
          ),
        )

        if (exactMatches.length > 0) {
          const matchRatio = exactMatches.length / userSubjects.length
          fieldScore = fieldWeight * 0.8 * matchRatio
          fieldMatchFound = true
          fieldMatchType = "exact"
          reasons.push(`Field keywords match: ${exactMatches.join(", ")}`)
        }
      }
    }

    // Priority 4: Program name field matching
    if (!fieldMatchFound && consultationData.fieldSearchQuery && program.name) {
      const searchField = consultationData.fieldSearchQuery.toLowerCase().trim()
      const programName = program.name.toLowerCase().trim()

      if (programName.includes(searchField) || searchField.includes(programName)) {
        fieldScore = fieldWeight * 0.7
        fieldMatchFound = true
        fieldMatchType = "exact"
        reasons.push(`Program name contains field: ${program.name}`)
      }
    }

    // Priority 5: Field category matching
    if (!fieldMatchFound && consultationData.fieldOfStudy && program.field) {
      const fieldTranslation = BilingualFieldService.getFieldTranslation(program.field)
      const searchField = consultationData.fieldOfStudy.toLowerCase().trim()
      const programField = program.field.toLowerCase().trim()

      const englishMatch = programField.includes(searchField) || searchField.includes(programField)
      const frenchMatch =
        fieldTranslation &&
        (fieldTranslation.french.toLowerCase().includes(searchField) ||
          searchField.includes(fieldTranslation.french.toLowerCase()))

      if (englishMatch || frenchMatch) {
        fieldScore = fieldWeight * 0.6
        fieldMatchFound = true
        fieldMatchType = "category"
        reasons.push(`Field category match: ${program.field}`)
      }
    }

    if (fieldMatchFound) {
      totalScore += fieldScore
    } else {
      warnings.push("No field match found - this program may not align with your study interests")
    }

    // 2. Study Level match (20% weight)
    const levelWeight = 20
    maxPossibleScore += levelWeight

    if (program.study_level === consultationData.studyLevel) {
      totalScore += levelWeight
      reasons.push(`Perfect match for ${consultationData.studyLevel} level`)
    } else {
      const levelScore = levelWeight * 0.3 // Partial credit for different levels
      totalScore += levelScore
      warnings.push(`Program is for ${program.study_level}, you selected ${consultationData.studyLevel}`)
    }

    // 3. Budget Analysis (15% weight - reduced to prioritize field matching)
    const budgetWeight = 15
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

    if (consultationData.totalBudget >= totalMaxCost) {
      totalScore += budgetWeight
      reasons.push(
        `Within budget (€${totalMaxCost.toLocaleString()} vs €${consultationData.totalBudget.toLocaleString()})`,
      )
    } else if (consultationData.totalBudget >= totalMinCost) {
      const budgetRatio = (consultationData.totalBudget - totalMinCost) / (totalMaxCost - totalMinCost)
      totalScore += budgetWeight * (0.5 + budgetRatio * 0.5)
      reasons.push(`Partially within budget range`)
    } else {
      const shortfall = totalMinCost - consultationData.totalBudget
      const flexibilityMultiplier =
        {
          strict: 0,
          flexible: 0.3,
          very_flexible: 0.6,
        }[consultationData.budgetFlexibility] || 0.3

      if (shortfall <= consultationData.totalBudget * flexibilityMultiplier) {
        totalScore += budgetWeight * 0.4
        warnings.push(`Budget shortfall of €${shortfall.toLocaleString()}, but within flexibility range`)
      } else {
        warnings.push(`Exceeds budget by €${shortfall.toLocaleString()}`)
      }
    }

    // 4. Language Requirements (5% weight)
    const languageWeight = 5
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
    } else {
      warnings.push("Language requirements may not match your preferences")
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
        finalScore >= 80 && fieldMatchFound
          ? "highly_recommended"
          : finalScore >= 60 && fieldMatchFound
            ? "recommended"
            : finalScore >= 40
              ? "consider"
              : "not_recommended",
    }
  }

  // Enhanced search functionality prioritizing field matching
  static searchPrograms(programs: any[], searchQuery: string, language: "en" | "fr" = "en") {
    if (!searchQuery.trim()) return programs

    const query = searchQuery.toLowerCase().trim()

    return programs.filter((program) => {
      // 1. Direct field name match (highest priority)
      if (
        program.field &&
        (program.field.toLowerCase().includes(query) || query.includes(program.field.toLowerCase()))
      ) {
        return true
      }

      // 2. Program name field match
      if (program.name && (program.name.toLowerCase().includes(query) || query.includes(program.name.toLowerCase()))) {
        return true
      }

      // 3. Field keywords match
      if (program.field_keywords && Array.isArray(program.field_keywords)) {
        const keywordMatch = program.field_keywords.some(
          (keyword: string) => keyword.toLowerCase().includes(query) || query.includes(keyword.toLowerCase()),
        )
        if (keywordMatch) return true
      }

      // 4. Bilingual field search
      const fieldMatch = BilingualFieldService.matchProgramField(program, query, language)
      if (fieldMatch.exactMatch) {
        return true
      }

      // 5. University name (lower priority)
      if (program.university && program.university.toLowerCase().includes(query)) {
        return true
      }

      return false
    })
  }

  // Sort programs by field relevance first
  static sortProgramsByRelevance(programs: any[], consultationData: EnhancedConsultationData) {
    return programs
      .map((program) => ({
        ...program,
        matchResult: this.calculateEnhancedMatchScore(program, consultationData),
      }))
      .sort((a, b) => {
        // Primary sort: Field match presence and type
        const aHasFieldMatch = a.matchResult.fieldMatchDetails !== null
        const bHasFieldMatch = b.matchResult.fieldMatchDetails !== null

        if (aHasFieldMatch !== bHasFieldMatch) {
          return bHasFieldMatch ? 1 : -1
        }

        // Secondary sort: Field match score
        const aFieldScore = a.matchResult.fieldMatchDetails?.matchScore || 0
        const bFieldScore = b.matchResult.fieldMatchDetails?.matchScore || 0

        if (aFieldScore !== bFieldScore) {
          return bFieldScore - aFieldScore
        }

        // Tertiary sort: Overall match score
        if (a.matchResult.score !== b.matchResult.score) {
          return b.matchResult.score - a.matchResult.score
        }

        // Final sort: Program ranking (if available)
        return (a.ranking || 999) - (b.ranking || 999)
      })
  }
}



