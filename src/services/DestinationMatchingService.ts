// Advanced Destination Matching Service - Optimized for Real-World Usage
// High-performance automated consultation with comprehensive matching logic

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
  procedure_type: string

  // Dynamic tuition fields by level
  bachelor_tuition_min?: number
  bachelor_tuition_max?: number
  master_tuition_min?: number
  master_tuition_max?: number
  phd_tuition_min?: number
  phd_tuition_max?: number

  // Academic level requirements
  bachelor_academic_level?: "High" | "Medium" | "Any"
  master_academic_level?: "High" | "Medium" | "Any"
  phd_academic_level?: "High" | "Medium" | "Any"

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

  // Budget ranges
  tuitionBudgetRange: [number, number]
  livingCostsBudgetRange: [number, number]
  serviceFeesBudgetRange: [number, number]
  budgetFlexibility: "strict" | "flexible" | "very_flexible"

  // Academic profile
  currentGPA: "low" | "intermediate" | "high"
  previousEducationCountry: string

  // Language preferences
  preferredLanguages: string[]
  languageLevel: "beginner" | "intermediate" | "advanced" | "native"
  hasLanguageCertificate: boolean

  // Timeline and preferences
  intakePeriods: string[]
  urgency: "asap" | "flexible" | "planning_ahead"

  // Special requirements
  workWhileStudying: boolean
  scholarshipRequired: boolean
  religiousFacilities: boolean
  halalFood: boolean

  // Priority factors
  priorityFactors: string[]

  // Regional preferences (optional)
  preferredRegions: string[]
  avoidRegions: string[]
}

export interface MatchResult {
  destination: DestinationData
  score: number
  reasons: string[]
  warnings: string[]
  details: MatchDetails
  recommendation: "highly_recommended" | "recommended" | "consider" | "not_recommended"
  budgetAnalysis: BudgetAnalysis
  requirements: RequirementAnalysis
  compatibilityBreakdown: CompatibilityBreakdown
}

export interface MatchDetails {
  tuitionCompatibility: number
  budgetCompatibility: number
  academicCompatibility: number
  languageCompatibility: number
  intakeCompatibility: number
  documentsRequired: string[]
  estimatedCosts: {
    tuitionRange: [number, number]
    livingCosts: number
    serviceFees: number
    totalRange: [number, number]
  }
}

export interface BudgetAnalysis {
  tuitionFit: "excellent" | "good" | "acceptable" | "challenging"
  serviceFeesFit: "excellent" | "good" | "acceptable" | "challenging"
  totalFit: "excellent" | "good" | "acceptable" | "challenging"
  savingsOpportunity: number
  budgetUtilization: number
  flexibilityNeeded: boolean
}

export interface RequirementAnalysis {
  academicLevel: "exceeds" | "meets" | "challenging" | "insufficient"
  languageProficiency: "excellent" | "sufficient" | "needs_improvement" | "insufficient"
  documentsComplexity: "simple" | "moderate" | "complex" | "extensive"
  applicationDifficulty: "easy" | "moderate" | "challenging" | "difficult"
  timelineCompatibility: "perfect" | "good" | "tight" | "problematic"
}

export interface CompatibilityBreakdown {
  budget: number
  academic: number
  language: number
  timeline: number
  requirements: number
  opportunities: number
}

export class DestinationMatchingService {
  /**
   * Main method to find and rank destinations - Optimized for performance
   */
  static findBestDestinations(destinations: DestinationData[], preferences: ConsultationPreferences): MatchResult[] {
    console.log("Starting destination matching with:", {
      destinationsCount: destinations?.length || 0,
      studyLevel: preferences.studyLevel,
      budgetRange: preferences.tuitionBudgetRange,
      languages: preferences.preferredLanguages,
    })

    if (!destinations || destinations.length === 0) {
      console.warn("No destinations provided for matching")
      return []
    }

    // Pre-filter destinations for performance
    const eligibleDestinations = destinations.filter((destination) =>
      this.isDestinationEligible(destination, preferences),
    )

    console.log("Eligible destinations after filtering:", eligibleDestinations.length)

    if (eligibleDestinations.length === 0) {
      console.warn("No eligible destinations found after filtering")
      return []
    }

    // Calculate matches with performance optimization
    const results = eligibleDestinations
      .map((destination) => this.calculateDestinationMatch(destination, preferences))
      .filter((result) => result.score >= this.getMinimumScoreThreshold(preferences))
      .sort((a, b) => {
        // Primary sort: recommendation level
        const recommendationOrder = {
          highly_recommended: 4,
          recommended: 3,
          consider: 2,
          not_recommended: 1,
        }
        const aOrder = recommendationOrder[a.recommendation]
        const bOrder = recommendationOrder[b.recommendation]

        if (aOrder !== bOrder) return bOrder - aOrder

        // Secondary sort: match score
        return b.score - a.score
      })

    console.log("Final matched destinations:", results.length)
    return results.slice(0, 20) // Return top 20 matches
  }

  /**
   * Enhanced eligibility check with fallback logic
   */
  private static isDestinationEligible(destination: DestinationData, preferences: ConsultationPreferences): boolean {
    // Basic validation
    if (!destination || !destination.id) {
      return false
    }

    // Status check with fallback
    if (destination.status && destination.status.toLowerCase() !== "active") {
      return false
    }

    // Study level availability check with fallback
    const availablePrograms = destination.available_programs || []
    const studyLevel = preferences.studyLevel

    // If no programs specified, assume all levels are available
    if (availablePrograms.length === 0) {
      console.log(`No programs specified for ${destination.name}, assuming all levels available`)
      return true
    }

    // Check for exact match or partial match
    const hasExactMatch = availablePrograms.some((program) => program.toLowerCase() === studyLevel.toLowerCase())

    const hasPartialMatch = availablePrograms.some(
      (program) =>
        program.toLowerCase().includes(studyLevel.toLowerCase()) ||
        studyLevel.toLowerCase().includes(program.toLowerCase()),
    )

    if (!hasExactMatch && !hasPartialMatch) {
      console.log(
        `Study level ${studyLevel} not available at ${destination.name}. Available: ${availablePrograms.join(", ")}`,
      )
      return false
    }

    // Regional preferences check
    if (
      preferences.avoidRegions.length > 0 &&
      preferences.avoidRegions.includes(destination.region || destination.country)
    ) {
      return false
    }

    return true
  }

  /**
   * Enhanced match calculation with robust fallback logic
   */
  private static calculateDestinationMatch(
    destination: DestinationData,
    preferences: ConsultationPreferences,
  ): MatchResult {
    const studyLevel = preferences.studyLevel.toLowerCase()
    const levelData = this.getLevelSpecificData(destination, studyLevel)

    // Calculate individual compatibility scores with error handling
    const budgetScore = this.calculateBudgetCompatibility(destination, preferences, levelData)
    const academicScore = this.calculateAcademicCompatibility(destination, preferences, levelData)
    const languageScore = this.calculateLanguageCompatibility(destination, preferences)
    const timelineScore = this.calculateTimelineCompatibility(destination, preferences)
    const requirementsScore = this.calculateRequirementsCompatibility(destination, preferences, levelData)
    const opportunitiesScore = this.calculateOpportunitiesScore(destination, preferences, levelData)

    // Calculate weighted total score
    const weights = this.calculateDynamicWeights(preferences)
    const totalScore = Math.round(
      budgetScore.score * weights.budget +
        academicScore.score * weights.academic +
        languageScore.score * weights.language +
        timelineScore.score * weights.timeline +
        requirementsScore.score * weights.requirements +
        opportunitiesScore.score * weights.opportunities,
    )

    // Compile all feedback
    const reasons = [
      ...budgetScore.reasons,
      ...academicScore.reasons,
      ...languageScore.reasons,
      ...timelineScore.reasons,
      ...requirementsScore.reasons,
      ...opportunitiesScore.reasons,
    ].filter(Boolean)

    const warnings = [
      ...budgetScore.warnings,
      ...academicScore.warnings,
      ...languageScore.warnings,
      ...timelineScore.warnings,
      ...requirementsScore.warnings,
      ...opportunitiesScore.warnings,
    ].filter(Boolean)

    // Create detailed analyses
    const budgetAnalysis = this.createBudgetAnalysis(destination, preferences, levelData)
    const requirements = this.createRequirementAnalysis(destination, preferences, levelData)
    const compatibilityBreakdown: CompatibilityBreakdown = {
      budget: budgetScore.score,
      academic: academicScore.score,
      language: languageScore.score,
      timeline: timelineScore.score,
      requirements: requirementsScore.score,
      opportunities: opportunitiesScore.score,
    }

    const details: MatchDetails = {
      tuitionCompatibility: budgetScore.tuitionCompatibility,
      budgetCompatibility: budgetScore.budgetCompatibility,
      academicCompatibility: academicScore.compatibility,
      languageCompatibility: languageScore.compatibility,
      intakeCompatibility: timelineScore.intakeCompatibility,
      documentsRequired: levelData.documents || [],
      estimatedCosts: {
        tuitionRange: [levelData.tuitionMin || 0, levelData.tuitionMax || 0],
        livingCosts: Math.round((preferences.livingCostsBudgetRange[0] + preferences.livingCostsBudgetRange[1]) / 2),
        serviceFees: this.calculateTotalServiceFees(destination),
        totalRange: [
          (levelData.tuitionMin || 0) +
            preferences.livingCostsBudgetRange[0] +
            this.calculateTotalServiceFees(destination),
          (levelData.tuitionMax || 0) +
            preferences.livingCostsBudgetRange[1] +
            this.calculateTotalServiceFees(destination),
        ],
      },
    }

    const recommendation = this.determineRecommendation(totalScore, warnings, preferences)

    return {
      destination,
      score: Math.max(0, Math.min(100, totalScore)),
      reasons,
      warnings,
      details,
      recommendation,
      budgetAnalysis,
      requirements,
      compatibilityBreakdown,
    }
  }

  /**
   * Extract level-specific data with robust fallbacks
   */
  private static getLevelSpecificData(destination: DestinationData, level: string) {
    const levelKey = level.toLowerCase()

    // Get tuition data with fallbacks
    let tuitionMin = (destination[`${levelKey}_tuition_min` as keyof DestinationData] as number) || 0
    let tuitionMax = (destination[`${levelKey}_tuition_max` as keyof DestinationData] as number) || 0

    // Fallback to general fees if level-specific data not available
    if (tuitionMin === 0 && tuitionMax === 0 && destination.fees) {
      tuitionMin = destination.fees * 0.8 // Assume fees is roughly the average
      tuitionMax = destination.fees * 1.2
    }

    // Default reasonable ranges if no data available
    if (tuitionMin === 0 && tuitionMax === 0) {
      switch (levelKey) {
        case "bachelor":
          tuitionMin = 2000
          tuitionMax = 8000
          break
        case "master":
          tuitionMin = 3000
          tuitionMax = 10000
          break
        case "phd":
          tuitionMin = 1000
          tuitionMax = 6000
          break
        default:
          tuitionMin = 2000
          tuitionMax = 8000
      }
    }

    return {
      tuitionMin,
      tuitionMax,
      academicLevel: (destination[`${levelKey}_academic_level` as keyof DestinationData] as string) || "Any",
      requirements: (destination[`${levelKey}_requirements` as keyof DestinationData] as string) || "",
      documents: (destination[`${levelKey}_documents` as keyof DestinationData] as string[]) || [],
    }
  }

  /**
   * Enhanced budget compatibility with flexible matching
   */
  private static calculateBudgetCompatibility(
    destination: DestinationData,
    preferences: ConsultationPreferences,
    levelData: any,
  ) {
    const reasons: string[] = []
    const warnings: string[] = []

    const tuitionMin = levelData.tuitionMin
    const tuitionMax = levelData.tuitionMax
    const serviceFees = this.calculateTotalServiceFees(destination)

    const userTuitionMin = preferences.tuitionBudgetRange[0]
    const userTuitionMax = preferences.tuitionBudgetRange[1]
    const userServiceMin = preferences.serviceFeesBudgetRange[0]
    const userServiceMax = preferences.serviceFeesBudgetRange[1]

    let score = 0
    let tuitionCompatibility = 0
    let budgetCompatibility = 0

    // Enhanced tuition compatibility analysis
    if (tuitionMax === 0 || (tuitionMin === 0 && tuitionMax === 0)) {
      score += 50
      tuitionCompatibility = 100
      reasons.push(`Free or very low tuition - exceptional value`)
    } else if (tuitionMax <= userTuitionMin) {
      score += 45
      tuitionCompatibility = 95
      reasons.push(`Tuition (€${tuitionMin}-€${tuitionMax}) well below your budget`)
    } else if (tuitionMin <= userTuitionMax) {
      // Calculate overlap between ranges
      const overlapStart = Math.max(userTuitionMin, tuitionMin)
      const overlapEnd = Math.min(userTuitionMax, tuitionMax)
      const overlap = Math.max(0, overlapEnd - overlapStart)
      const userRange = userTuitionMax - userTuitionMin
      const compatibilityPct = userRange > 0 ? (overlap / userRange) * 100 : 0

      if (compatibilityPct >= 70) {
        score += 40
        tuitionCompatibility = 85
        reasons.push(`Tuition range fits well within your budget`)
      } else if (compatibilityPct >= 30) {
        score += 30
        tuitionCompatibility = 70
        reasons.push(`Tuition partially fits your budget range`)
      } else if (tuitionMin <= userTuitionMax * 1.2) {
        score += 20
        tuitionCompatibility = 55
        reasons.push(`Tuition slightly above budget but manageable`)
      } else {
        score += 10
        tuitionCompatibility = 30
        warnings.push(`Tuition range may stretch your budget`)
      }
    } else {
      // Tuition completely outside budget
      const flexibilityMultiplier = {
        strict: 1.0,
        flexible: 1.2,
        very_flexible: 1.5,
      }[preferences.budgetFlexibility]

      if (tuitionMin <= userTuitionMax * flexibilityMultiplier) {
        score += 15
        tuitionCompatibility = 40
        warnings.push(`Tuition exceeds budget but within ${preferences.budgetFlexibility} range`)
      } else {
        score += 5
        tuitionCompatibility = 20
        warnings.push(`Tuition significantly exceeds budget`)
      }
    }

    // Service fees compatibility with more lenient matching
    if (serviceFees <= userServiceMax) {
      score += 25
      reasons.push(`Service fees (€${serviceFees}) within budget`)
    } else if (serviceFees <= userServiceMax * 1.3) {
      score += 15
      warnings.push(`Service fees slightly over budget`)
    } else {
      score += 5
      warnings.push(`Service fees exceed budget`)
    }

    // Budget flexibility bonus
    if (preferences.budgetFlexibility === "very_flexible") {
      score += 10
      reasons.push(`High budget flexibility provides more options`)
    } else if (preferences.budgetFlexibility === "flexible") {
      score += 5
      reasons.push(`Budget flexibility helps with options`)
    }

    budgetCompatibility = Math.round((score / 90) * 100)

    return {
      score: Math.min(100, score),
      reasons,
      warnings,
      tuitionCompatibility,
      budgetCompatibility,
    }
  }

  /**
   * Enhanced academic compatibility with flexible requirements
   */
  private static calculateAcademicCompatibility(
    destination: DestinationData,
    preferences: ConsultationPreferences,
    levelData: any,
  ) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 40 // Higher base score for program availability
    let compatibility = 60

    reasons.push(`${preferences.studyLevel} program available`)

    const requiredLevel = levelData.academicLevel || "Any"
    const userGPA = preferences.currentGPA

    if (requiredLevel === "Any" || !requiredLevel) {
      score += 35
      compatibility = 90
      reasons.push(`Open admission - no specific academic requirements`)
    } else {
      const gpaMapping = { low: 1, intermediate: 2, high: 3 }
      const levelMapping = { Any: 0, Medium: 2, High: 3 }

      const requiredGPA = levelMapping[requiredLevel as keyof typeof levelMapping] || 1
      const userGPANum = gpaMapping[userGPA] || 2

      if (userGPANum > requiredGPA) {
        score += 35
        compatibility = 95
        reasons.push(`Your ${userGPA} academic level exceeds requirements`)
      } else if (userGPANum === requiredGPA) {
        score += 30
        compatibility = 85
        reasons.push(`Your ${userGPA} academic level meets requirements`)
      } else if (userGPANum >= requiredGPA - 1) {
        score += 20
        compatibility = 65
        warnings.push(`Academic requirements may be challenging but achievable`)
      } else {
        score += 10
        compatibility = 40
        warnings.push(`Academic requirements significantly challenging`)
      }
    }

    // Success rate bonus with more generous scoring
    const admissionRate = destination.admission_success_rate || 50 // Default assumption
    if (admissionRate >= 70) {
      score += 15
      compatibility += 5
      reasons.push(`High admission success rate (${admissionRate}%)`)
    } else if (admissionRate >= 50) {
      score += 10
      reasons.push(`Good admission success rate (${admissionRate}%)`)
    } else if (admissionRate >= 30) {
      score += 5
      warnings.push(`Moderate admission success rate (${admissionRate}%)`)
    }

    return { score: Math.min(100, score), reasons, warnings, compatibility }
  }

  /**
   * Enhanced language compatibility with flexible matching
   */
  private static calculateLanguageCompatibility(destination: DestinationData, preferences: ConsultationPreferences) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 20 // Base score
    let compatibility = 40

    const userLanguages = preferences.preferredLanguages
    const userLevel = preferences.languageLevel
    const hasCertificate = preferences.hasLanguageCertificate
    const langReq = (destination.language_requirements || "").toLowerCase()

    // If no language requirements specified, assume common languages are available
    if (!langReq || langReq.trim() === "") {
      score += 30
      compatibility = 70
      reasons.push(`Language requirements flexible`)
    }

    // Check language availability with flexible matching
    let languageMatch = false
    let partialMatch = false

    for (const userLang of userLanguages) {
      if (userLang.toLowerCase() === "any") {
        languageMatch = true
        break
      }

      // Exact match
      if (langReq.includes(userLang.toLowerCase())) {
        languageMatch = true
        break
      }

      // Partial/fuzzy matching
      if (userLang.toLowerCase() === "english" && (langReq.includes("eng") || langReq.includes("international"))) {
        partialMatch = true
      }
      if (userLang.toLowerCase() === "french" && (langReq.includes("fr") || langReq.includes("francais"))) {
        partialMatch = true
      }
    }

    if (languageMatch || userLanguages.includes("Any")) {
      score += 40
      compatibility = 80
      reasons.push(`Programs available in your preferred language(s)`)

      // Proficiency assessment with more generous scoring
      if (userLevel === "native") {
        score += 25
        compatibility = 95
        reasons.push(`Native speaker advantage`)
      } else if (userLevel === "advanced") {
        score += 20
        compatibility = 85
        reasons.push(`Advanced language skills`)
        if (hasCertificate) {
          score += 10
          reasons.push(`Official language certificate`)
        }
      } else if (userLevel === "intermediate") {
        score += 15
        compatibility = 75
        reasons.push(`Good language foundation`)
        if (hasCertificate) {
          score += 15
          reasons.push(`Language certificate strengthens application`)
        } else {
          warnings.push(`Language certificate recommended`)
        }
      } else {
        score += 10
        compatibility = 60
        warnings.push(`Language improvement recommended`)
      }
    } else if (partialMatch) {
      score += 25
      compatibility = 65
      reasons.push(`Programs likely available in your preferred language`)
    } else {
      score += 15
      compatibility = 45
      warnings.push(`Limited programs in your preferred language(s)`)

      // Check for English as alternative
      if (langReq.includes("english") && !userLanguages.includes("English")) {
        score += 10
        compatibility = 55
        reasons.push(`English programs available as alternative`)
      }
    }

    return { score: Math.min(100, score), reasons, warnings, compatibility }
  }

  /**
   * Enhanced timeline compatibility
   */
  private static calculateTimelineCompatibility(destination: DestinationData, preferences: ConsultationPreferences) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 50 // Higher base score
    let intakeCompatibility = 60

    const userIntakes = preferences.intakePeriods
    const availableIntakes = destination.intake_periods || []
    const urgency = preferences.urgency

    if (userIntakes.includes("Any") || userIntakes.includes("Flexible")) {
      score += 30
      intakeCompatibility = 85
      reasons.push(`Flexible with intake timing`)
    } else if (availableIntakes.length === 0) {
      // Assume common intakes are available
      score += 25
      intakeCompatibility = 70
      reasons.push(`Intake periods to be confirmed - likely available`)
    } else {
      let matchFound = false
      let partialMatch = false

      for (const userIntake of userIntakes) {
        for (const availableIntake of availableIntakes) {
          if (
            availableIntake.toLowerCase().includes(userIntake.toLowerCase()) ||
            userIntake.toLowerCase().includes(availableIntake.toLowerCase())
          ) {
            matchFound = true
            break
          }
          // Partial matching for common intake periods
          if (
            (userIntake.toLowerCase().includes("sept") && availableIntake.toLowerCase().includes("fall")) ||
            (userIntake.toLowerCase().includes("fall") && availableIntake.toLowerCase().includes("sept")) ||
            (userIntake.toLowerCase().includes("jan") && availableIntake.toLowerCase().includes("winter")) ||
            (userIntake.toLowerCase().includes("spring") && availableIntake.toLowerCase().includes("feb"))
          ) {
            partialMatch = true
          }
        }
        if (matchFound) break
      }

      if (matchFound) {
        score += 35
        intakeCompatibility = 90
        reasons.push(`Your preferred intake periods are available`)
      } else if (partialMatch) {
        score += 25
        intakeCompatibility = 75
        reasons.push(`Similar intake periods available`)
      } else {
        score += 15
        intakeCompatibility = 50
        warnings.push(`Your preferred intake periods may not be available`)
      }
    }

    // Urgency consideration with bonus scoring
    if (urgency === "asap") {
      if (availableIntakes.length > 2 || availableIntakes.length === 0) {
        score += 10
        reasons.push(`Multiple intake options for urgent timeline`)
      }
    } else if (urgency === "planning_ahead") {
      score += 5
      reasons.push(`Ample time for application preparation`)
    }

    return { score: Math.min(100, score), reasons, warnings, intakeCompatibility }
  }

  /**
   * Enhanced requirements compatibility
   */
  private static calculateRequirementsCompatibility(
    destination: DestinationData,
    preferences: ConsultationPreferences,
    levelData: any,
  ) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 60 // Higher base score

    const documents = levelData.documents || []
    const requirements = (levelData.requirements || "").toLowerCase()

    // Document complexity assessment with more generous scoring
    if (documents.length === 0) {
      score += 25
      reasons.push(`Minimal documentation requirements`)
    } else if (documents.length <= 4) {
      score += 20
      reasons.push(`Standard documentation requirements`)
    } else if (documents.length <= 7) {
      score += 15
      reasons.push(`Moderate documentation requirements`)
    } else {
      score += 10
      warnings.push(`Extensive documentation required`)
    }

    // Special requirements analysis with bonuses
    if (
      requirements.includes("no ielts") ||
      requirements.includes("no toefl") ||
      requirements.includes("no language test")
    ) {
      score += 15
      reasons.push(`No language test required`)
    }

    if (preferences.scholarshipRequired && (requirements.includes("scholarship") || requirements.includes("funding"))) {
      score += 15
      reasons.push(`Scholarship opportunities available`)
    }

    if (preferences.workWhileStudying && (requirements.includes("work") || requirements.includes("employment"))) {
      score += 10
      reasons.push(`Work opportunities mentioned`)
    }

    // Less penalty for complex requirements
    if (requirements.includes("interview")) {
      score -= 2
      warnings.push(`Interview may be required`)
    }

    if (requirements.includes("portfolio")) {
      score -= 3
      warnings.push(`Portfolio submission required`)
    }

    return { score: Math.min(100, score), reasons, warnings }
  }

  /**
   * Enhanced opportunities score
   */
  private static calculateOpportunitiesScore(
    destination: DestinationData,
    preferences: ConsultationPreferences,
    levelData: any,
  ) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 60 // Higher base score

    // Visa success rate with more generous scoring
    const visaRate = destination.visa_success_rate || 70 // Optimistic default
    if (visaRate >= 85) {
      score += 20
      reasons.push(`Excellent visa approval rate (${visaRate}%)`)
    } else if (visaRate >= 65) {
      score += 15
      reasons.push(`Good visa approval rate (${visaRate}%)`)
    } else if (visaRate >= 45) {
      score += 10
      reasons.push(`Moderate visa approval rate (${visaRate}%)`)
    } else if (visaRate > 0) {
      score += 5
      warnings.push(`Consider visa requirements carefully`)
    }

    // Agency services bonus
    const services = destination.agency_services || []
    if (services.length > 0) {
      score += 15
      reasons.push(`Comprehensive support services available`)
    }

    // Regional preferences bonus
    if (
      preferences.preferredRegions.length > 0 &&
      preferences.preferredRegions.includes(destination.region || destination.country)
    ) {
      score += 10
      reasons.push(`Located in your preferred region`)
    }

    // Country popularity bonus (common study destinations)
    const popularCountries = ["france", "germany", "spain", "italy", "netherlands", "belgium"]
    if (popularCountries.includes(destination.country.toLowerCase())) {
      score += 5
      reasons.push(`Popular study destination with good infrastructure`)
    }

    return { score: Math.min(100, score), reasons, warnings }
  }

  /**
   * Calculate dynamic weights based on user priorities
   */
  private static calculateDynamicWeights(preferences: ConsultationPreferences) {
    const priorities = preferences.priorityFactors
    const baseWeights = {
      budget: 0.25,
      academic: 0.2,
      language: 0.2,
      timeline: 0.15,
      requirements: 0.12,
      opportunities: 0.08,
    }

    // Adjust based on priorities
    if (priorities.includes("low_cost")) {
      baseWeights.budget += 0.15
      baseWeights.academic -= 0.05
      baseWeights.language -= 0.05
      baseWeights.timeline -= 0.05
    }

    if (priorities.includes("quality_education")) {
      baseWeights.academic += 0.15
      baseWeights.opportunities += 0.05
      baseWeights.budget -= 0.1
      baseWeights.requirements -= 0.05
      baseWeights.timeline -= 0.05
    }

    if (priorities.includes("scholarship")) {
      baseWeights.requirements += 0.1
      baseWeights.opportunities += 0.05
      baseWeights.budget -= 0.05
      baseWeights.academic -= 0.05
      baseWeights.language -= 0.05
    }

    if (preferences.urgency === "asap") {
      baseWeights.timeline += 0.1
      baseWeights.requirements += 0.05
      baseWeights.budget -= 0.05
      baseWeights.academic -= 0.05
      baseWeights.language -= 0.05
    }

    // Normalize weights to sum to 1
    const totalWeight = Object.values(baseWeights).reduce((sum, weight) => sum + weight, 0)
    Object.keys(baseWeights).forEach((key) => {
      baseWeights[key as keyof typeof baseWeights] /= totalWeight
    })

    return baseWeights
  }

  /**
   * Calculate total service fees with fallback
   */
  private static calculateTotalServiceFees(destination: DestinationData): number {
    const appFee = destination.application_fee || 0
    const serviceFee = destination.service_fee || 0
    const visaFee = destination.visa_processing_fee || 0

    const total = appFee + serviceFee + visaFee

    // If no fees specified, assume reasonable default
    return total > 0 ? total : 500
  }

  /**
   * Get minimum score threshold - more lenient for better results
   */
  private static getMinimumScoreThreshold(preferences: ConsultationPreferences): number {
    if (preferences.budgetFlexibility === "strict") return 35
    if (preferences.budgetFlexibility === "flexible") return 25
    return 20 // very_flexible
  }

  /**
   * Determine recommendation level with more generous criteria
   */
  private static determineRecommendation(
    score: number,
    warnings: string[],
    preferences: ConsultationPreferences,
  ): "highly_recommended" | "recommended" | "consider" | "not_recommended" {
    const warningCount = warnings.length
    const criticalWarnings = warnings.filter(
      (w) => w.includes("significantly") || w.includes("essential") || w.includes("insufficient"),
    ).length

    if (score >= 75 && criticalWarnings === 0) {
      return "highly_recommended"
    } else if (score >= 60 && criticalWarnings <= 1) {
      return "recommended"
    } else if (score >= 35 && criticalWarnings <= 2) {
      return "consider"
    } else {
      return "not_recommended"
    }
  }

  /**
   * Create detailed budget analysis
   */
  private static createBudgetAnalysis(
    destination: DestinationData,
    preferences: ConsultationPreferences,
    levelData: any,
  ): BudgetAnalysis {
    const tuitionMin = levelData.tuitionMin || 0
    const tuitionMax = levelData.tuitionMax || 0
    const serviceFees = this.calculateTotalServiceFees(destination)

    const userTuitionMax = preferences.tuitionBudgetRange[1]
    const userServiceMax = preferences.serviceFeesBudgetRange[1]

    const tuitionFit =
      tuitionMax <= userTuitionMax * 0.8
        ? "excellent"
        : tuitionMax <= userTuitionMax
          ? "good"
          : tuitionMax <= userTuitionMax * 1.3
            ? "acceptable"
            : "challenging"

    const serviceFeesFit =
      serviceFees <= userServiceMax * 0.8
        ? "excellent"
        : serviceFees <= userServiceMax
          ? "good"
          : serviceFees <= userServiceMax * 1.3
            ? "acceptable"
            : "challenging"

    const totalMax = tuitionMax + serviceFees + preferences.livingCostsBudgetRange[1]
    const userTotalMax = userTuitionMax + userServiceMax + preferences.livingCostsBudgetRange[1]

    const totalFit =
      totalMax <= userTotalMax * 0.9
        ? "excellent"
        : totalMax <= userTotalMax
          ? "good"
          : totalMax <= userTotalMax * 1.2
            ? "acceptable"
            : "challenging"

    const savingsOpportunity = Math.max(0, userTotalMax - totalMax)
    const budgetUtilization = Math.min(100, (totalMax / userTotalMax) * 100)
    const flexibilityNeeded = totalMax > userTotalMax

    return {
      tuitionFit,
      serviceFeesFit,
      totalFit,
      savingsOpportunity,
      budgetUtilization,
      flexibilityNeeded,
    }
  }

  /**
   * Create detailed requirement analysis
   */
  private static createRequirementAnalysis(
    destination: DestinationData,
    preferences: ConsultationPreferences,
    levelData: any,
  ): RequirementAnalysis {
    const requiredLevel = levelData.academicLevel || "Any"
    const userGPA = preferences.currentGPA
    const documents = levelData.documents || []
    const requirements = (levelData.requirements || "").toLowerCase()

    // Academic level assessment
    let academicLevel: RequirementAnalysis["academicLevel"] = "meets"
    if (requiredLevel === "Any" || !requiredLevel) {
      academicLevel = "exceeds"
    } else {
      const gpaMapping = { low: 1, intermediate: 2, high: 3 }
      const levelMapping = { Any: 0, Medium: 2, High: 3 }

      const requiredGPA = levelMapping[requiredLevel as keyof typeof levelMapping] || 1
      const userGPANum = gpaMapping[userGPA] || 2

      if (userGPANum > requiredGPA) academicLevel = "exceeds"
      else if (userGPANum < requiredGPA) academicLevel = userGPANum >= requiredGPA - 1 ? "challenging" : "insufficient"
    }

    // Language proficiency assessment
    const languageProficiency =
      preferences.languageLevel === "native"
        ? "excellent"
        : preferences.languageLevel === "advanced"
          ? "excellent"
          : preferences.languageLevel === "intermediate" && preferences.hasLanguageCertificate
            ? "sufficient"
            : preferences.languageLevel === "intermediate"
              ? "sufficient"
              : "needs_improvement"

    // Documents complexity
    const documentsComplexity =
      documents.length <= 4
        ? "simple"
        : documents.length <= 7
          ? "moderate"
          : documents.length <= 10
            ? "complex"
            : "extensive"

    // Application difficulty
    let applicationDifficulty: RequirementAnalysis["applicationDifficulty"] = "easy"
    if (
      requirements.includes("interview") ||
      requirements.includes("portfolio") ||
      requirements.includes("gmat") ||
      requirements.includes("gre")
    ) {
      applicationDifficulty = "difficult"
    } else if (documents.length > 7 || requirements.includes("essay")) {
      applicationDifficulty = "challenging"
    } else if (documents.length > 4) {
      applicationDifficulty = "moderate"
    }

    // Timeline compatibility
    const timelineCompatibility =
      preferences.urgency === "planning_ahead" ? "perfect" : preferences.urgency === "flexible" ? "good" : "tight"

    return {
      academicLevel,
      languageProficiency,
      documentsComplexity,
      applicationDifficulty,
      timelineCompatibility,
    }
  }
}



