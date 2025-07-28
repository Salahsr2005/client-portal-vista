// Advanced Destination Matching Service
// Automated consultation to find the best countries based on user preferences

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
   * Main method to find and rank destinations based on user preferences
   */
  static findBestDestinations(destinations: DestinationData[], preferences: ConsultationPreferences): MatchResult[] {
    const results = destinations
      .filter((destination) => this.isDestinationEligible(destination, preferences))
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

    return results.slice(0, 15) // Return top 15 matches
  }

  /**
   * Check if destination is eligible based on basic requirements
   */
  private static isDestinationEligible(destination: DestinationData, preferences: ConsultationPreferences): boolean {
    // Check if study level is available
    const availablePrograms = destination.available_programs || []
    if (!availablePrograms.includes(preferences.studyLevel)) {
      return false
    }

    // Check if destination is active
    if (destination.status !== "Active") {
      return false
    }

    // Check regional preferences
    if (preferences.avoidRegions.length > 0 && preferences.avoidRegions.includes(destination.region || "")) {
      return false
    }

    return true
  }

  /**
   * Calculate comprehensive match score for a destination
   */
  private static calculateDestinationMatch(
    destination: DestinationData,
    preferences: ConsultationPreferences,
  ): MatchResult {
    const studyLevel = preferences.studyLevel.toLowerCase()
    const levelData = this.getLevelSpecificData(destination, studyLevel)

    // Calculate individual compatibility scores
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
   * Extract level-specific data from destination
   */
  private static getLevelSpecificData(destination: DestinationData, level: string) {
    const levelKey = level.toLowerCase()

    return {
      tuitionMin: (destination[`${levelKey}_tuition_min` as keyof DestinationData] as number) || 0,
      tuitionMax: (destination[`${levelKey}_tuition_max` as keyof DestinationData] as number) || 0,
      academicLevel: destination[`${levelKey}_academic_level` as keyof DestinationData] as string,
      requirements: (destination[`${levelKey}_requirements` as keyof DestinationData] as string) || "",
      documents: (destination[`${levelKey}_documents` as keyof DestinationData] as string[]) || [],
    }
  }

  /**
   * Calculate budget compatibility with range-based analysis
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

    // Tuition compatibility analysis
    if (tuitionMax === 0) {
      score += 50
      tuitionCompatibility = 100
      reasons.push(`Free tuition - exceptional value`)
    } else if (tuitionMax <= userTuitionMin) {
      score += 45
      tuitionCompatibility = 95
      reasons.push(`Tuition (€${tuitionMin}-€${tuitionMax}) well below your budget`)
    } else if (tuitionMin <= userTuitionMax) {
      const overlap = Math.min(userTuitionMax, tuitionMax) - Math.max(userTuitionMin, tuitionMin)
      const userRange = userTuitionMax - userTuitionMin
      const compatibilityPct = Math.max(0, (overlap / userRange) * 100)

      if (compatibilityPct >= 80) {
        score += 40
        tuitionCompatibility = 85
        reasons.push(`Tuition range fits well within your budget`)
      } else if (compatibilityPct >= 50) {
        score += 30
        tuitionCompatibility = 70
        reasons.push(`Tuition partially fits your budget range`)
      } else {
        score += 15
        tuitionCompatibility = 50
        warnings.push(`Tuition range may stretch your budget`)
      }
    } else {
      tuitionCompatibility = 20
      warnings.push(`Tuition (€${tuitionMin}-€${tuitionMax}) exceeds your budget range`)
    }

    // Service fees compatibility
    if (serviceFees <= userServiceMin) {
      score += 25
      reasons.push(`Service fees (€${serviceFees}) well within budget`)
    } else if (serviceFees <= userServiceMax) {
      score += 20
      reasons.push(`Service fees acceptable within your range`)
    } else {
      score += 5
      warnings.push(`Service fees (€${serviceFees}) exceed your budget range`)
    }

    // Budget flexibility consideration
    if (preferences.budgetFlexibility === "very_flexible") {
      score += 10
      reasons.push(`High budget flexibility provides more options`)
    } else if (preferences.budgetFlexibility === "strict") {
      if (tuitionMax > userTuitionMax || serviceFees > userServiceMax) {
        score -= 10
        warnings.push(`Strict budget may limit options`)
      }
    }

    budgetCompatibility = Math.round((score / 85) * 100)

    return {
      score: Math.min(100, score),
      reasons,
      warnings,
      tuitionCompatibility,
      budgetCompatibility,
    }
  }

  /**
   * Calculate academic compatibility
   */
  private static calculateAcademicCompatibility(
    destination: DestinationData,
    preferences: ConsultationPreferences,
    levelData: any,
  ) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 30 // Base score for program availability
    let compatibility = 50

    reasons.push(`${preferences.studyLevel} program available`)

    const requiredLevel = levelData.academicLevel
    const userGPA = preferences.currentGPA

    if (!requiredLevel || requiredLevel === "Any") {
      score += 40
      compatibility = 90
      reasons.push(`Open admission - no specific academic requirements`)
    } else {
      const gpaMapping = { low: 1, intermediate: 2, high: 3 }
      const levelMapping = { Any: 0, Medium: 2, High: 3 }

      const requiredGPA = levelMapping[requiredLevel as keyof typeof levelMapping] || 1
      const userGPANum = gpaMapping[userGPA] || 1

      if (userGPANum > requiredGPA) {
        score += 45
        compatibility = 95
        reasons.push(`Your ${userGPA} academic level exceeds ${requiredLevel} requirements`)
      } else if (userGPANum === requiredGPA) {
        score += 35
        compatibility = 80
        reasons.push(`Your ${userGPA} academic level meets ${requiredLevel} requirements`)
      } else {
        score += 10
        compatibility = 40
        warnings.push(`${requiredLevel} academic requirements may be challenging`)
      }
    }

    // Success rate bonus
    const admissionRate = destination.admission_success_rate || 0
    if (admissionRate >= 80) {
      score += 15
      compatibility += 5
      reasons.push(`High admission success rate (${admissionRate}%)`)
    } else if (admissionRate >= 60) {
      score += 10
      reasons.push(`Good admission success rate (${admissionRate}%)`)
    } else if (admissionRate > 0 && admissionRate < 40) {
      warnings.push(`Lower admission success rate (${admissionRate}%)`)
    }

    return { score: Math.min(100, score), reasons, warnings, compatibility }
  }

  /**
   * Calculate language compatibility
   */
  private static calculateLanguageCompatibility(destination: DestinationData, preferences: ConsultationPreferences) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 0
    let compatibility = 0

    const userLanguages = preferences.preferredLanguages
    const userLevel = preferences.languageLevel
    const hasCertificate = preferences.hasLanguageCertificate
    const langReq = (destination.language_requirements || "").toLowerCase()

    // Check language availability
    let languageMatch = false
    for (const userLang of userLanguages) {
      if (userLang.toLowerCase() === "any" || langReq.includes(userLang.toLowerCase())) {
        languageMatch = true
        break
      }
    }

    if (languageMatch || userLanguages.includes("Any")) {
      score += 50
      compatibility = 70
      reasons.push(`Programs available in your preferred language(s)`)

      // Proficiency assessment
      if (userLevel === "native") {
        score += 30
        compatibility = 95
        reasons.push(`Native speaker advantage`)
      } else if (userLevel === "advanced") {
        score += 25
        compatibility = 85
        reasons.push(`Advanced language skills`)
        if (hasCertificate) {
          score += 10
          reasons.push(`Official language certificate`)
        }
      } else if (userLevel === "intermediate") {
        score += 15
        compatibility = 70
        reasons.push(`Good language foundation`)
        if (hasCertificate) {
          score += 15
          reasons.push(`Language certificate strengthens application`)
        } else {
          warnings.push(`Language certificate recommended`)
        }
      } else {
        score += 5
        compatibility = 50
        warnings.push(`Language improvement recommended`)
        if (!hasCertificate) {
          warnings.push(`Language certificate essential`)
        }
      }
    } else {
      score += 10
      compatibility = 30
      warnings.push(`Limited programs in your preferred language(s)`)

      // Check for English as alternative
      if (langReq.includes("english") && !userLanguages.includes("English")) {
        score += 15
        compatibility = 45
        reasons.push(`English programs available as alternative`)
      }
    }

    return { score: Math.min(100, score), reasons, warnings, compatibility }
  }

  /**
   * Calculate timeline compatibility
   */
  private static calculateTimelineCompatibility(destination: DestinationData, preferences: ConsultationPreferences) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 40 // Base score
    let intakeCompatibility = 50

    const userIntakes = preferences.intakePeriods
    const availableIntakes = destination.intake_periods || []
    const urgency = preferences.urgency

    if (userIntakes.includes("Any") || userIntakes.includes("Flexible")) {
      score += 30
      intakeCompatibility = 80
      reasons.push(`Flexible with intake timing`)
    } else if (availableIntakes.length === 0) {
      score += 20
      intakeCompatibility = 60
      reasons.push(`Intake information to be confirmed`)
    } else {
      let matchFound = false
      for (const userIntake of userIntakes) {
        for (const availableIntake of availableIntakes) {
          if (
            availableIntake.toLowerCase().includes(userIntake.toLowerCase()) ||
            userIntake.toLowerCase().includes(availableIntake.toLowerCase())
          ) {
            matchFound = true
            break
          }
        }
        if (matchFound) break
      }

      if (matchFound) {
        score += 35
        intakeCompatibility = 85
        reasons.push(`Your preferred intake periods are available`)
      } else {
        score += 10
        intakeCompatibility = 40
        warnings.push(`Your preferred intake periods may not be available`)
        warnings.push(`Available: ${availableIntakes.join(", ")}`)
      }
    }

    // Urgency consideration
    if (urgency === "asap") {
      if (availableIntakes.length > 2) {
        score += 15
        reasons.push(`Multiple intake options for urgent timeline`)
      } else if (availableIntakes.length === 0) {
        warnings.push(`Limited intake information for urgent application`)
      }
    }

    // Processing time consideration
    if (destination.processing_time) {
      const processingTime = destination.processing_time.toLowerCase()
      if (urgency === "asap" && processingTime.includes("fast")) {
        score += 10
        reasons.push(`Fast processing suits urgent timeline`)
      } else if (urgency === "asap" && processingTime.includes("slow")) {
        warnings.push(`Processing time may not suit urgent timeline`)
      }
    }

    return { score: Math.min(100, score), reasons, warnings, intakeCompatibility }
  }

  /**
   * Calculate requirements compatibility
   */
  private static calculateRequirementsCompatibility(
    destination: DestinationData,
    preferences: ConsultationPreferences,
    levelData: any,
  ) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 50 // Base score

    const documents = levelData.documents || []
    const requirements = levelData.requirements.toLowerCase()

    // Document complexity assessment
    if (documents.length <= 3) {
      score += 25
      reasons.push(`Minimal documentation required`)
    } else if (documents.length <= 6) {
      score += 15
      reasons.push(`Standard documentation requirements`)
    } else {
      score += 5
      warnings.push(`Extensive documentation required (${documents.length} documents)`)
    }

    // Special requirements analysis
    if (requirements.includes("no ielts") || requirements.includes("no toefl")) {
      score += 15
      reasons.push(`No language test required`)
    }

    if (preferences.scholarshipRequired && requirements.includes("scholarship")) {
      score += 20
      reasons.push(`Scholarship opportunities available`)
    }

    if (preferences.workWhileStudying && requirements.includes("work")) {
      score += 15
      reasons.push(`Work opportunities mentioned`)
    }

    // Warning indicators
    if (requirements.includes("interview")) {
      warnings.push(`Interview may be required`)
    }

    if (requirements.includes("portfolio")) {
      warnings.push(`Portfolio submission required`)
    }

    if (requirements.includes("gmat") || requirements.includes("gre")) {
      warnings.push(`Standardized test may be required`)
    }

    return { score: Math.min(100, score), reasons, warnings }
  }

  /**
   * Calculate opportunities score
   */
  private static calculateOpportunitiesScore(
    destination: DestinationData,
    preferences: ConsultationPreferences,
    levelData: any,
  ) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 50 // Base score

    // Visa success rate
    const visaRate = destination.visa_success_rate || 0
    if (visaRate >= 90) {
      score += 20
      reasons.push(`Excellent visa approval rate (${visaRate}%)`)
    } else if (visaRate >= 70) {
      score += 10
      reasons.push(`Good visa approval rate (${visaRate}%)`)
    } else if (visaRate > 0 && visaRate < 50) {
      warnings.push(`Consider visa requirements carefully (${visaRate}% success rate)`)
    }

    // Agency services
    const services = destination.agency_services || []
    if (services.length > 0) {
      score += 15
      reasons.push(`Comprehensive support services available`)
    }

    // Regional opportunities
    if (preferences.preferredRegions.length > 0 && preferences.preferredRegions.includes(destination.region || "")) {
      score += 15
      reasons.push(`Located in your preferred region`)
    }

    return { score: Math.min(100, score), reasons, warnings }
  }

  /**
   * Calculate dynamic weights based on user priorities
   */
  private static calculateDynamicWeights(preferences: ConsultationPreferences) {
    const priorities = preferences.priorityFactors
    const baseWeights = {
      budget: 0.3,
      academic: 0.2,
      language: 0.2,
      timeline: 0.15,
      requirements: 0.1,
      opportunities: 0.05,
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
      baseWeights.timeline -= 0.05
      baseWeights.requirements -= 0.05
    }

    if (priorities.includes("scholarship")) {
      baseWeights.requirements += 0.15
      baseWeights.opportunities += 0.05
      baseWeights.budget -= 0.1
      baseWeights.academic -= 0.05
      baseWeights.language -= 0.05
    }

    if (preferences.urgency === "asap") {
      baseWeights.timeline += 0.15
      baseWeights.requirements += 0.05
      baseWeights.budget -= 0.1
      baseWeights.academic -= 0.05
      baseWeights.language -= 0.05
    }

    // Normalize weights
    const totalWeight = Object.values(baseWeights).reduce((sum, weight) => sum + weight, 0)
    Object.keys(baseWeights).forEach((key) => {
      baseWeights[key as keyof typeof baseWeights] /= totalWeight
    })

    return baseWeights
  }

  /**
   * Calculate total service fees
   */
  private static calculateTotalServiceFees(destination: DestinationData): number {
    return (destination.application_fee || 0) + (destination.service_fee || 0) + (destination.visa_processing_fee || 0)
  }

  /**
   * Get minimum score threshold based on preferences
   */
  private static getMinimumScoreThreshold(preferences: ConsultationPreferences): number {
    if (preferences.budgetFlexibility === "strict") return 50
    if (preferences.budgetFlexibility === "flexible") return 35
    return 25 // very_flexible
  }

  /**
   * Determine recommendation level
   */
  private static determineRecommendation(
    score: number,
    warnings: string[],
    preferences: ConsultationPreferences,
  ): "highly_recommended" | "recommended" | "consider" | "not_recommended" {
    const warningCount = warnings.length
    const criticalWarnings = warnings.filter(
      (w) => w.includes("exceeds") || w.includes("insufficient") || w.includes("essential"),
    ).length

    if (score >= 80 && warningCount <= 2 && criticalWarnings === 0) {
      return "highly_recommended"
    } else if (score >= 65 && warningCount <= 4 && criticalWarnings <= 1) {
      return "recommended"
    } else if (score >= 40 && warningCount <= 6 && criticalWarnings <= 2) {
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
      tuitionMax <= userTuitionMax * 0.7
        ? "excellent"
        : tuitionMax <= userTuitionMax
          ? "good"
          : tuitionMax <= userTuitionMax * 1.2
            ? "acceptable"
            : "challenging"

    const serviceFeesFit =
      serviceFees <= userServiceMax * 0.7
        ? "excellent"
        : serviceFees <= userServiceMax
          ? "good"
          : serviceFees <= userServiceMax * 1.2
            ? "acceptable"
            : "challenging"

    const totalMax = tuitionMax + serviceFees + preferences.livingCostsBudgetRange[1]
    const userTotalMax = userTuitionMax + userServiceMax + preferences.livingCostsBudgetRange[1]

    const totalFit =
      totalMax <= userTotalMax * 0.8
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
    const requiredLevel = levelData.academicLevel
    const userGPA = preferences.currentGPA
    const documents = levelData.documents || []
    const requirements = levelData.requirements.toLowerCase()

    // Academic level assessment
    let academicLevel: RequirementAnalysis["academicLevel"] = "meets"
    if (requiredLevel && requiredLevel !== "Any") {
      const gpaMapping = { low: 1, intermediate: 2, high: 3 }
      const levelMapping = { Any: 0, Medium: 2, High: 3 }

      const requiredGPA = levelMapping[requiredLevel as keyof typeof levelMapping] || 1
      const userGPANum = gpaMapping[userGPA] || 1

      if (userGPANum > requiredGPA) academicLevel = "exceeds"
      else if (userGPANum < requiredGPA) academicLevel = userGPANum >= requiredGPA - 1 ? "challenging" : "insufficient"
    } else {
      academicLevel = "exceeds"
    }

    // Language proficiency
    const languageProficiency =
      preferences.languageLevel === "native"
        ? "excellent"
        : preferences.languageLevel === "advanced" && preferences.hasLanguageCertificate
          ? "excellent"
          : preferences.languageLevel === "advanced"
            ? "sufficient"
            : preferences.languageLevel === "intermediate" && preferences.hasLanguageCertificate
              ? "sufficient"
              : preferences.languageLevel === "intermediate"
                ? "needs_improvement"
                : "insufficient"

    // Documents complexity
    const documentsComplexity =
      documents.length <= 3
        ? "simple"
        : documents.length <= 6
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
    } else if (documents.length > 6 || requirements.includes("essay") || requirements.includes("recommendation")) {
      applicationDifficulty = "challenging"
    } else if (documents.length > 3) {
      applicationDifficulty = "moderate"
    }

    // Timeline compatibility
    const timelineCompatibility =
      preferences.urgency === "planning_ahead"
        ? "perfect"
        : preferences.urgency === "flexible"
          ? "good"
          : destination.processing_time?.toLowerCase().includes("fast")
            ? "good"
            : destination.processing_time?.toLowerCase().includes("slow")
              ? "problematic"
              : "tight"

    return {
      academicLevel,
      languageProficiency,
      documentsComplexity,
      applicationDifficulty,
      timelineCompatibility,
    }
  }
}


