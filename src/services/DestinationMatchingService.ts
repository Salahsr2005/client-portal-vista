// Rebuilt Destination Matching Service - Fully Functional
// Matches the actual Supabase destination table structure

export interface DestinationData {
  id: string
  name: string
  country: string
  region?: string
  fees: number
  visa_requirements?: string
  processing_time?: string
  success_rate?: number
  description?: string
  image_url?: string
  status?: string
  procedure_type?: string

  // Dynamic tuition fields by level
  bachelor_tuition_min?: number
  bachelor_tuition_max?: number
  master_tuition_min?: number
  master_tuition_max?: number
  phd_tuition_min?: number
  phd_tuition_max?: number

  // Academic level requirements
  bachelor_academic_level?: string
  master_academic_level?: string
  phd_academic_level?: string

  // Requirements by level
  bachelor_requirements?: string
  master_requirements?: string
  phd_requirements?: string

  // Documents by level (JSONB arrays)
  bachelor_documents?: string[]
  master_documents?: string[]
  phd_documents?: string[]

  // Success rates
  admission_success_rate?: number
  visa_success_rate?: number

  // Available programs (JSONB array)
  available_programs?: string[]

  // Services and fees
  agency_services?: string[]
  application_fee?: number
  service_fee?: number
  visa_processing_fee?: number

  // Language and intake (JSONB arrays)
  language_requirements?: string
  intake_periods?: string[]

  // Media
  logo_url?: string
  cover_image_url?: string
}

export interface ConsultationPreferences {
  studyLevel: string
  userLanguage: "en" | "fr"
  tuitionBudgetRange: [number, number]
  livingCostsBudgetRange: [number, number]
  serviceFeesBudgetRange: [number, number]
  budgetFlexibility: "strict" | "flexible" | "very_flexible"
  currentGPA: "low" | "intermediate" | "high"
  previousEducationCountry: string
  preferredLanguages: string[]
  languageLevel: "beginner" | "intermediate" | "advanced" | "native"
  hasLanguageCertificate: boolean
  intakePeriods: string[]
  urgency: "asap" | "flexible" | "planning_ahead"
  workWhileStudying: boolean
  scholarshipRequired: boolean
  religiousFacilities: boolean
  halalFood: boolean
  priorityFactors: string[]
  preferredRegions: string[]
  avoidRegions: string[]
}

export interface MatchedDestination {
  destination: DestinationData
  score: number
  reasons: string[]
  warnings: string[]
  recommendation: "highly_recommended" | "recommended" | "consider" | "not_recommended"
  budgetFit: "excellent" | "good" | "acceptable" | "challenging"
  estimatedCosts: {
    tuitionRange: [number, number]
    livingCosts: number
    serviceFees: number
    totalRange: [number, number]
  }
}

export class DestinationMatchingService {
  /**
   * Main matching function - rebuilt from scratch
   */
  static findMatchingDestinations(
    destinations: DestinationData[],
    preferences: ConsultationPreferences,
  ): MatchedDestination[] {
    console.log("🔍 Starting destination matching...")
    console.log("📊 Available destinations:", destinations?.length || 0)
    console.log("⚙️ User preferences:", preferences)

    if (!destinations || destinations.length === 0) {
      console.warn("❌ No destinations available for matching")
      return []
    }

    // Filter and score destinations
    const matches = destinations
      .map((destination) => this.scoreDestination(destination, preferences))
      .filter((match) => match.score > 0) // Only include destinations with positive scores
      .sort((a, b) => b.score - a.score) // Sort by score descending

    console.log("✅ Found matches:", matches.length)
    console.log(
      "🏆 Top matches:",
      matches.slice(0, 3).map((m) => ({ name: m.destination.name, score: m.score })),
    )

    return matches
  }

  /**
   * Score individual destination against preferences
   */
  private static scoreDestination(
    destination: DestinationData,
    preferences: ConsultationPreferences,
  ): MatchedDestination {
    let totalScore = 0
    const reasons: string[] = []
    const warnings: string[] = []

    // 1. Study Level Compatibility (25 points)
    const levelScore = this.calculateLevelScore(destination, preferences)
    totalScore += levelScore.score
    reasons.push(...levelScore.reasons)
    warnings.push(...levelScore.warnings)

    // 2. Budget Compatibility (30 points)
    const budgetScore = this.calculateBudgetScore(destination, preferences)
    totalScore += budgetScore.score
    reasons.push(...budgetScore.reasons)
    warnings.push(...budgetScore.warnings)

    // 3. Language Compatibility (20 points)
    const languageScore = this.calculateLanguageScore(destination, preferences)
    totalScore += languageScore.score
    reasons.push(...languageScore.reasons)
    warnings.push(...languageScore.warnings)

    // 4. Regional Preferences (15 points)
    const regionScore = this.calculateRegionScore(destination, preferences)
    totalScore += regionScore.score
    reasons.push(...regionScore.reasons)
    warnings.push(...regionScore.warnings)

    // 5. Special Requirements (10 points)
    const specialScore = this.calculateSpecialScore(destination, preferences)
    totalScore += specialScore.score
    reasons.push(...specialScore.reasons)
    warnings.push(...specialScore.warnings)

    // Calculate estimated costs
    const estimatedCosts = this.calculateEstimatedCosts(destination, preferences)

    // Determine recommendation level
    const recommendation = this.getRecommendationLevel(totalScore, warnings.length)

    // Determine budget fit
    const budgetFit = this.getBudgetFit(estimatedCosts, preferences)

    return {
      destination,
      score: Math.round(totalScore),
      reasons: reasons.filter(Boolean),
      warnings: warnings.filter(Boolean),
      recommendation,
      budgetFit,
      estimatedCosts,
    }
  }

  /**
   * Calculate study level compatibility
   */
  private static calculateLevelScore(destination: DestinationData, preferences: ConsultationPreferences) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 0

    const studyLevel = preferences.studyLevel.toLowerCase()

    // Check if study level is available
    const availablePrograms = destination.available_programs || []

    // If no programs specified, assume all levels available
    if (availablePrograms.length === 0) {
      score += 20
      reasons.push(`${preferences.studyLevel} programs likely available`)
    } else {
      // Check for exact or partial match
      const hasMatch = availablePrograms.some(
        (program) => program.toLowerCase().includes(studyLevel) || studyLevel.includes(program.toLowerCase()),
      )

      if (hasMatch) {
        score += 25
        reasons.push(`${preferences.studyLevel} programs confirmed available`)
      } else {
        score += 5
        warnings.push(`${preferences.studyLevel} programs may not be available`)
      }
    }

    return { score, reasons, warnings }
  }

  /**
   * Calculate budget compatibility
   */
  private static calculateBudgetScore(destination: DestinationData, preferences: ConsultationPreferences) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 0

    const studyLevel = preferences.studyLevel.toLowerCase()
    const userMaxBudget = preferences.tuitionBudgetRange[1]

    // Get tuition for study level
    let tuitionMin = 0
    let tuitionMax = 0

    if (studyLevel === "bachelor") {
      tuitionMin = destination.bachelor_tuition_min || 0
      tuitionMax = destination.bachelor_tuition_max || 0
    } else if (studyLevel === "master") {
      tuitionMin = destination.master_tuition_min || 0
      tuitionMax = destination.master_tuition_max || 0
    } else if (studyLevel === "phd") {
      tuitionMin = destination.phd_tuition_min || 0
      tuitionMax = destination.phd_tuition_max || 0
    }

    // Fallback to general fees if no specific tuition data
    if (tuitionMin === 0 && tuitionMax === 0) {
      tuitionMin = destination.fees * 0.8
      tuitionMax = destination.fees * 1.2
    }

    // Score based on budget fit
    if (tuitionMax <= userMaxBudget * 0.7) {
      score += 30
      reasons.push(`Tuition (€${tuitionMin}-€${tuitionMax}) well within budget`)
    } else if (tuitionMax <= userMaxBudget) {
      score += 25
      reasons.push(`Tuition fits within your budget range`)
    } else if (tuitionMax <= userMaxBudget * 1.2 && preferences.budgetFlexibility !== "strict") {
      score += 15
      warnings.push(`Tuition slightly above budget but manageable`)
    } else {
      score += 5
      warnings.push(`Tuition may exceed your budget`)
    }

    return { score, reasons, warnings }
  }

  /**
   * Calculate language compatibility
   */
  private static calculateLanguageScore(destination: DestinationData, preferences: ConsultationPreferences) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 0

    const userLanguages = preferences.preferredLanguages
    const langReq = (destination.language_requirements || "").toLowerCase()

    // If user selected "Any" language
    if (userLanguages.includes("Any")) {
      score += 20
      reasons.push("Flexible with language requirements")
      return { score, reasons, warnings }
    }

    // Check language compatibility
    let hasMatch = false
    for (const userLang of userLanguages) {
      if (langReq.includes(userLang.toLowerCase()) || langReq === "") {
        hasMatch = true
        break
      }
    }

    if (hasMatch || langReq === "") {
      score += 20
      reasons.push("Programs available in your preferred language(s)")

      // Bonus for language proficiency
      if (preferences.languageLevel === "native" || preferences.languageLevel === "advanced") {
        score += 5
        reasons.push("Strong language skills advantage")
      }
    } else {
      score += 5
      warnings.push("Limited programs in your preferred language(s)")
    }

    return { score, reasons, warnings }
  }

  /**
   * Calculate regional preferences
   */
  private static calculateRegionScore(destination: DestinationData, preferences: ConsultationPreferences) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 10 // Base score for any destination

    // Check preferred regions
    if (preferences.preferredRegions.length > 0) {
      if (preferences.preferredRegions.includes(destination.region || destination.country)) {
        score += 15
        reasons.push(`Located in your preferred region: ${destination.region || destination.country}`)
      }
    } else {
      score += 5 // Neutral if no preference
    }

    // Check avoided regions
    if (preferences.avoidRegions.length > 0) {
      if (preferences.avoidRegions.includes(destination.region || destination.country)) {
        score -= 10
        warnings.push(`Located in region you prefer to avoid`)
      }
    }

    return { score, reasons, warnings }
  }

  /**
   * Calculate special requirements score
   */
  private static calculateSpecialScore(destination: DestinationData, preferences: ConsultationPreferences) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 5 // Base score

    // Work while studying
    if (preferences.workWhileStudying) {
      // Assume EU countries allow work
      const euCountries = ["france", "germany", "belgium", "luxembourg", "malta"]
      if (euCountries.includes(destination.country.toLowerCase())) {
        score += 3
        reasons.push("Work opportunities available while studying")
      }
    }

    // Scholarship requirements
    if (preferences.scholarshipRequired) {
      // Check if destination mentions scholarships
      const hasScholarship =
        destination.description?.toLowerCase().includes("scholarship") ||
        destination.description?.toLowerCase().includes("bourse")
      if (hasScholarship) {
        score += 5
        reasons.push("Scholarship opportunities mentioned")
      }
    }

    return { score, reasons, warnings }
  }

  /**
   * Calculate estimated costs
   */
  private static calculateEstimatedCosts(destination: DestinationData, preferences: ConsultationPreferences) {
    const studyLevel = preferences.studyLevel.toLowerCase()

    let tuitionMin = 0
    let tuitionMax = 0

    if (studyLevel === "bachelor") {
      tuitionMin = destination.bachelor_tuition_min || 0
      tuitionMax = destination.bachelor_tuition_max || 0
    } else if (studyLevel === "master") {
      tuitionMin = destination.master_tuition_min || 0
      tuitionMax = destination.master_tuition_max || 0
    } else if (studyLevel === "phd") {
      tuitionMin = destination.phd_tuition_min || 0
      tuitionMax = destination.phd_tuition_max || 0
    }

    // Fallback to general fees
    if (tuitionMin === 0 && tuitionMax === 0) {
      tuitionMin = destination.fees * 0.8
      tuitionMax = destination.fees * 1.2
    }

    const livingCosts = Math.round((preferences.livingCostsBudgetRange[0] + preferences.livingCostsBudgetRange[1]) / 2)
    const serviceFees =
      (destination.application_fee || 0) + (destination.service_fee || 0) + (destination.visa_processing_fee || 0) ||
      500

    return {
      tuitionRange: [tuitionMin, tuitionMax] as [number, number],
      livingCosts,
      serviceFees,
      totalRange: [tuitionMin + livingCosts + serviceFees, tuitionMax + livingCosts + serviceFees] as [number, number],
    }
  }

  /**
   * Get recommendation level based on score
   */
  private static getRecommendationLevel(
    score: number,
    warningCount: number,
  ): "highly_recommended" | "recommended" | "consider" | "not_recommended" {
    if (score >= 80 && warningCount <= 1) {
      return "highly_recommended"
    } else if (score >= 60 && warningCount <= 3) {
      return "recommended"
    } else if (score >= 30) {
      return "consider"
    } else {
      return "not_recommended"
    }
  }

  /**
   * Get budget fit assessment
   */
  private static getBudgetFit(
    estimatedCosts: any,
    preferences: ConsultationPreferences,
  ): "excellent" | "good" | "acceptable" | "challenging" {
    const userMaxBudget =
      preferences.tuitionBudgetRange[1] + preferences.livingCostsBudgetRange[1] + preferences.serviceFeesBudgetRange[1]
    const destinationMaxCost = estimatedCosts.totalRange[1]

    if (destinationMaxCost <= userMaxBudget * 0.8) {
      return "excellent"
    } else if (destinationMaxCost <= userMaxBudget) {
      return "good"
    } else if (destinationMaxCost <= userMaxBudget * 1.2) {
      return "acceptable"
    } else {
      return "challenging"
    }
  }
}




