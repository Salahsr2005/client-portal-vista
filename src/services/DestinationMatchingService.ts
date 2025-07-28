// Enhanced Destination Matching Service
// This service provides dynamic, schema-driven matching logic for destinations

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

export interface ConsultationData {
  studyLevel: string
  preferredCountry: string
  userLanguage: "en" | "fr"
  tuitionBudget: number
  livingCostsBudget: number
  serviceFeesBudget: number
  totalBudget: number
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
}

export interface MatchResult {
  score: number
  reasons: string[]
  warnings: string[]
  details: MatchDetails
  recommendation: "highly_recommended" | "recommended" | "consider" | "not_recommended"
  budgetBreakdown: BudgetBreakdown
  requirements: RequirementCheck
}

export interface MatchDetails {
  tuitionMatch: boolean
  budgetMatch: boolean
  academicLevelMatch: boolean
  languageMatch: boolean
  countryMatch: boolean
  intakeMatch: boolean
  documentsRequired: string[]
  estimatedCosts: {
    tuition: number
    living: number
    service: number
    total: number
  }
}

export interface BudgetBreakdown {
  tuitionFit: "within" | "slightly_over" | "significantly_over"
  serviceFeesFit: "within" | "slightly_over" | "significantly_over"
  totalFit: "within" | "slightly_over" | "significantly_over"
  overagePct: number
  budgetUtilization: number
}

export interface RequirementCheck {
  academicLevel: "meets" | "exceeds" | "below"
  languageProficiency: "sufficient" | "needs_improvement" | "certificate_required"
  documentsStatus: "standard" | "additional_required"
  applicationComplexity: "simple" | "moderate" | "complex"
}

export class DestinationMatchingService {
  /**
   * Calculate comprehensive match score for a destination
   */
  static calculateMatchScore(destination: DestinationData, consultation: ConsultationData): MatchResult {
    const studyLevel = consultation.studyLevel.toLowerCase()

    // Get level-specific data from the destination
    const levelData = this.getLevelSpecificData(destination, studyLevel)

    // Check if this study level is available at this destination
    if (!this.isStudyLevelAvailable(destination, consultation.studyLevel)) {
      return this.createNoMatchResult(destination, consultation, "Study level not available")
    }

    // Calculate individual match components
    const budgetScore = this.calculateBudgetScore(destination, consultation, levelData)
    const academicScore = this.calculateAcademicScore(destination, consultation, levelData)
    const locationScore = this.calculateLocationScore(destination, consultation)
    const languageScore = this.calculateLanguageScore(destination, consultation)
    const intakeScore = this.calculateIntakeScore(destination, consultation)
    const requirementsScore = this.calculateRequirementsScore(destination, consultation, levelData)
    const successRateScore = this.calculateSuccessRateScore(destination, consultation)

    // Weight the scores based on user priorities and consultation data
    const weights = this.calculateDynamicWeights(consultation)

    const totalScore = Math.round(
      budgetScore.score * weights.budget +
        academicScore.score * weights.academic +
        locationScore.score * weights.location +
        languageScore.score * weights.language +
        intakeScore.score * weights.intake +
        requirementsScore.score * weights.requirements +
        successRateScore.score * weights.successRate,
    )

    // Compile reasons and warnings
    const reasons = [
      ...budgetScore.reasons,
      ...academicScore.reasons,
      ...locationScore.reasons,
      ...languageScore.reasons,
      ...intakeScore.reasons,
      ...requirementsScore.reasons,
      ...successRateScore.reasons,
    ].filter(Boolean)

    const warnings = [
      ...budgetScore.warnings,
      ...academicScore.warnings,
      ...locationScore.warnings,
      ...languageScore.warnings,
      ...intakeScore.warnings,
      ...requirementsScore.warnings,
      ...successRateScore.warnings,
    ].filter(Boolean)

    // Determine recommendation level
    const recommendation = this.determineRecommendation(totalScore, warnings, consultation)

    // Create detailed breakdown
    const budgetBreakdown = this.createBudgetBreakdown(destination, consultation, levelData)
    const requirements = this.createRequirementCheck(destination, consultation, levelData)

    const details: MatchDetails = {
      tuitionMatch: budgetScore.tuitionMatch,
      budgetMatch: budgetScore.budgetMatch,
      academicLevelMatch: academicScore.levelMatch,
      languageMatch: languageScore.languageMatch,
      countryMatch: locationScore.countryMatch,
      intakeMatch: intakeScore.intakeMatch,
      documentsRequired: levelData.documents || [],
      estimatedCosts: {
        tuition: levelData.tuitionAvg || 0,
        living: consultation.livingCostsBudget,
        service: this.calculateTotalServiceFees(destination),
        total:
          (levelData.tuitionAvg || 0) + consultation.livingCostsBudget + this.calculateTotalServiceFees(destination),
      },
    }

    return {
      score: Math.max(0, Math.min(100, totalScore)),
      reasons,
      warnings,
      details,
      recommendation,
      budgetBreakdown,
      requirements,
    }
  }

  /**
   * Check if study level is available at destination
   */
  private static isStudyLevelAvailable(destination: DestinationData, studyLevel: string): boolean {
    const availablePrograms = destination.available_programs || []
    return availablePrograms.includes(studyLevel)
  }

  /**
   * Extract level-specific data from destination based on schema
   */
  private static getLevelSpecificData(destination: DestinationData, level: string) {
    const levelKey = level.toLowerCase()

    const tuitionMin = destination[`${levelKey}_tuition_min` as keyof DestinationData] as number
    const tuitionMax = destination[`${levelKey}_tuition_max` as keyof DestinationData] as number

    return {
      tuitionMin: tuitionMin || 0,
      tuitionMax: tuitionMax || 0,
      tuitionAvg: this.calculateTuitionAverage(tuitionMin, tuitionMax),
      academicLevel: destination[`${levelKey}_academic_level` as keyof DestinationData] as string,
      requirements: destination[`${levelKey}_requirements` as keyof DestinationData] as string,
      documents: (destination[`${levelKey}_documents` as keyof DestinationData] as string[]) || [],
    }
  }

  /**
   * Calculate average tuition from min/max
   */
  private static calculateTuitionAverage(min?: number, max?: number): number {
    if (!min && !max) return 0
    if (!min) return max || 0
    if (!max) return min || 0
    return Math.round((min + max) / 2)
  }

  /**
   * Calculate total service fees
   */
  private static calculateTotalServiceFees(destination: DestinationData): number {
    return (destination.application_fee || 0) + (destination.service_fee || 0) + (destination.visa_processing_fee || 0)
  }

  /**
   * Calculate budget compatibility score with enhanced logic
   */
  private static calculateBudgetScore(destination: DestinationData, consultation: ConsultationData, levelData: any) {
    const reasons: string[] = []
    const warnings: string[] = []

    const tuitionCost = levelData.tuitionAvg
    const serviceCosts = this.calculateTotalServiceFees(destination)
    const totalCost = tuitionCost + serviceCosts

    // Calculate budget flexibility multiplier
    const flexibilityMultiplier = {
      strict: 1.0,
      flexible: 1.2,
      very_flexible: 1.5,
    }[consultation.budgetFlexibility]

    const adjustedTuitionBudget = consultation.tuitionBudget * flexibilityMultiplier
    const adjustedServiceBudget = consultation.serviceFeesBudget * flexibilityMultiplier
    const adjustedTotalBudget = consultation.totalBudget * flexibilityMultiplier

    let score = 0
    let tuitionMatch = false
    let budgetMatch = false

    // Tuition budget analysis
    if (tuitionCost === 0) {
      score += 50
      tuitionMatch = true
      reasons.push(`Free tuition - excellent value`)
    } else if (tuitionCost <= consultation.tuitionBudget) {
      score += 40
      tuitionMatch = true
      const savings = consultation.tuitionBudget - tuitionCost
      reasons.push(`Tuition (€${tuitionCost.toLocaleString()}) fits budget with €${savings.toLocaleString()} to spare`)
    } else if (tuitionCost <= adjustedTuitionBudget) {
      score += 25
      tuitionMatch = true
      const overage = Math.round(((tuitionCost - consultation.tuitionBudget) / consultation.tuitionBudget) * 100)
      warnings.push(`Tuition ${overage}% over budget but within ${consultation.budgetFlexibility} range`)
    } else {
      const overage = Math.round(((tuitionCost - adjustedTuitionBudget) / adjustedTuitionBudget) * 100)
      warnings.push(`Tuition significantly exceeds budget by ${overage}%`)
    }

    // Service fees analysis
    if (serviceCosts === 0) {
      score += 25
      reasons.push(`No additional service fees`)
    } else if (serviceCosts <= consultation.serviceFeesBudget) {
      score += 20
      reasons.push(`Service fees (€${serviceCosts.toLocaleString()}) within budget`)
    } else if (serviceCosts <= adjustedServiceBudget) {
      score += 10
      warnings.push(`Service fees slightly over budget`)
    } else {
      warnings.push(`Service fees significantly over budget`)
    }

    // Total budget analysis
    if (totalCost <= consultation.totalBudget) {
      score += 30
      budgetMatch = true
      const utilization = Math.round((totalCost / consultation.totalBudget) * 100)
      reasons.push(`Total cost (€${totalCost.toLocaleString()}) uses ${utilization}% of budget`)
    } else if (totalCost <= adjustedTotalBudget) {
      score += 15
      budgetMatch = true
      warnings.push(`Total cost within flexibility range`)
    } else {
      warnings.push(`Total cost exceeds budget even with flexibility`)
    }

    // Value bonus
    if (totalCost < consultation.totalBudget * 0.7) {
      score += 10
      reasons.push(`Excellent value - significantly under budget`)
    }

    return { score, reasons, warnings, tuitionMatch, budgetMatch }
  }

  /**
   * Calculate academic level compatibility with enhanced logic
   */
  private static calculateAcademicScore(destination: DestinationData, consultation: ConsultationData, levelData: any) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 0
    let levelMatch = false

    // Base score for program availability (already checked)
    score += 30
    reasons.push(`${consultation.studyLevel} program available`)

    // Academic level requirement analysis
    const requiredLevel = levelData.academicLevel
    const userGPA = consultation.currentGPA

    if (!requiredLevel || requiredLevel === "Any") {
      score += 40
      levelMatch = true
      reasons.push(`No specific academic requirements - open admission`)
    } else {
      const gpaMapping = {
        low: 1,
        intermediate: 2,
        high: 3,
      }

      const levelMapping = {
        Any: 0,
        Medium: 2,
        High: 3,
      }

      const requiredGPA = levelMapping[requiredLevel as keyof typeof levelMapping] || 1
      const userGPANum = gpaMapping[userGPA.toLowerCase() as keyof typeof gpaMapping] || 1

      if (userGPANum >= requiredGPA) {
        score += 40
        levelMatch = true
        reasons.push(`Your ${userGPA} academic level meets ${requiredLevel} requirements`)

        if (userGPANum > requiredGPA) {
          score += 10
          reasons.push(`Your academic level exceeds minimum requirements`)
        }
      } else {
        score += 10
        warnings.push(`Academic requirements (${requiredLevel}) may be challenging for ${userGPA} level`)
      }
    }

    // Success rate consideration
    const admissionRate = destination.admission_success_rate
    if (admissionRate && admissionRate > 70) {
      score += 15
      reasons.push(`High admission success rate (${admissionRate}%)`)
    } else if (admissionRate && admissionRate < 30) {
      score -= 5
      warnings.push(`Lower admission success rate (${admissionRate}%)`)
    }

    return { score, reasons, warnings, levelMatch }
  }

  /**
   * Calculate location compatibility with regional analysis
   */
  private static calculateLocationScore(destination: DestinationData, consultation: ConsultationData) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 0
    let countryMatch = false

    // Country preference analysis
    if (!consultation.preferredCountry || consultation.preferredCountry === "Any") {
      score += 50
      countryMatch = true
      reasons.push(`Open to studying in ${destination.country}`)
    } else if (destination.country.toLowerCase() === consultation.preferredCountry.toLowerCase()) {
      score += 80
      countryMatch = true
      reasons.push(`Perfect match for your preferred country (${destination.country})`)
    } else {
      // Regional proximity analysis
      const countryGroups = {
        "Western Europe": ["France", "Germany", "Netherlands", "Belgium", "Switzerland", "Austria"],
        "Southern Europe": ["Spain", "Italy", "Portugal", "Greece"],
        "Northern Europe": ["Sweden", "Norway", "Denmark", "Finland"],
        "Eastern Europe": ["Poland", "Czech Republic", "Hungary", "Slovakia"],
      }

      let foundGroup = false
      for (const [group, countries] of Object.entries(countryGroups)) {
        if (countries.includes(destination.country) && countries.includes(consultation.preferredCountry)) {
          score += 30
          countryMatch = true
          reasons.push(`Same region (${group}) as your preference`)
          foundGroup = true
          break
        }
      }

      if (!foundGroup) {
        score += 10
        warnings.push(`Different country from your preference (${consultation.preferredCountry})`)
      }
    }

    // Visa processing analysis
    if (destination.visa_requirements) {
      const visaReq = destination.visa_requirements.toLowerCase()
      if (visaReq.includes("simple") || visaReq.includes("straightforward") || visaReq.includes("easy")) {
        score += 20
        reasons.push(`Straightforward visa process`)
      } else if (visaReq.includes("complex") || visaReq.includes("difficult") || visaReq.includes("challenging")) {
        score -= 5
        warnings.push(`Complex visa requirements`)
      }
    }

    // Processing time consideration
    if (destination.processing_time) {
      const processingTime = destination.processing_time.toLowerCase()
      if (consultation.urgency === "asap") {
        if (processingTime.includes("fast") || processingTime.includes("quick") || processingTime.includes("1-2")) {
          score += 15
          reasons.push(`Fast processing time suits urgent timeline`)
        } else if (processingTime.includes("slow") || processingTime.includes("6+")) {
          warnings.push(`Processing time may not suit urgent timeline`)
        }
      }
    }

    return { score, reasons, warnings, countryMatch }
  }

  /**
   * Calculate language compatibility with detailed analysis
   */
  private static calculateLanguageScore(destination: DestinationData, consultation: ConsultationData) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 0
    let languageMatch = false

    const userLanguage = consultation.language.toLowerCase()
    const userLevel = consultation.languageLevel
    const hasCertificate = consultation.hasLanguageCertificate

    // Language availability check
    if (userLanguage === "any" || !userLanguage) {
      score += 40
      languageMatch = true
      reasons.push(`Flexible with study language`)
    } else {
      const langReq = (destination.language_requirements || "").toLowerCase()

      // Check if user's preferred language is supported
      if (
        langReq.includes(userLanguage) ||
        (userLanguage === "english" && langReq.includes("english")) ||
        (userLanguage === "french" && langReq.includes("french"))
      ) {
        score += 50
        languageMatch = true
        reasons.push(`Programs available in ${consultation.language}`)

        // Proficiency level analysis
        if (userLevel === "native") {
          score += 25
          reasons.push(`Native speaker advantage`)
        } else if (userLevel === "advanced") {
          score += 20
          reasons.push(`Advanced language skills`)
          if (hasCertificate) {
            score += 15
            reasons.push(`Official language certificate`)
          } else {
            warnings.push(`Language certificate recommended for advanced level`)
          }
        } else if (userLevel === "intermediate") {
          score += 10
          reasons.push(`Good language foundation`)
          if (hasCertificate) {
            score += 20
            reasons.push(`Language certificate strengthens application`)
          } else {
            warnings.push(`Language certificate likely required`)
          }
        } else {
          // beginner
          score += 5
          warnings.push(`Language improvement strongly recommended`)
          if (hasCertificate) {
            score += 10
          } else {
            warnings.push(`Language certificate essential`)
          }
        }
      } else {
        score += 10
        warnings.push(`Limited programs in ${consultation.language}`)

        // Check if English is available as alternative
        if (langReq.includes("english") && userLanguage !== "english") {
          score += 15
          reasons.push(`English programs available as alternative`)
        }
      }
    }

    return { score, reasons, warnings, languageMatch }
  }

  /**
   * Calculate intake timing compatibility
   */
  private static calculateIntakeScore(destination: DestinationData, consultation: ConsultationData) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 50 // Base score
    let intakeMatch = false

    const preferredIntake = consultation.intakePeriod.toLowerCase()
    const availableIntakes = destination.intake_periods || []

    if (preferredIntake === "any" || preferredIntake === "flexible") {
      score += 30
      intakeMatch = true
      reasons.push(`Flexible with intake timing`)
    } else if (availableIntakes.length === 0) {
      score += 20
      reasons.push(`Intake information to be confirmed`)
    } else {
      // Check for exact or partial matches
      const hasExactMatch = availableIntakes.some((intake) => intake.toLowerCase() === preferredIntake)

      const hasPartialMatch = availableIntakes.some(
        (intake) => intake.toLowerCase().includes(preferredIntake) || preferredIntake.includes(intake.toLowerCase()),
      )

      if (hasExactMatch) {
        score += 40
        intakeMatch = true
        reasons.push(`${consultation.intakePeriod} intake available`)
      } else if (hasPartialMatch) {
        score += 25
        intakeMatch = true
        reasons.push(`Similar intake period available`)
      } else {
        score += 5
        warnings.push(`${consultation.intakePeriod} intake may not be available`)

        // Show available alternatives
        if (availableIntakes.length > 0) {
          warnings.push(`Available intakes: ${availableIntakes.join(", ")}`)
        }
      }
    }

    // Urgency consideration
    if (consultation.urgency === "asap" && availableIntakes.length > 2) {
      score += 10
      reasons.push(`Multiple intake options for urgent application`)
    }

    return { score, reasons, warnings, intakeMatch }
  }

  /**
   * Calculate requirements complexity score
   */
  private static calculateRequirementsScore(
    destination: DestinationData,
    consultation: ConsultationData,
    levelData: any,
  ) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 50 // Base score

    // Document requirements analysis
    const documents = levelData.documents || []
    const documentCount = documents.length

    if (documentCount === 0) {
      score += 30
      reasons.push(`Standard documentation required`)
    } else if (documentCount <= 3) {
      score += 25
      reasons.push(`Minimal documentation requirements`)
    } else if (documentCount <= 6) {
      score += 15
      reasons.push(`Moderate documentation requirements`)
    } else {
      score += 5
      warnings.push(`Extensive documentation required (${documentCount} documents)`)
    }

    // Requirements text analysis
    const requirements = (levelData.requirements || "").toLowerCase()
    if (requirements) {
      // Positive indicators
      if (
        requirements.includes("no ielts") ||
        requirements.includes("no toefl") ||
        requirements.includes("no language test")
      ) {
        score += 15
        reasons.push(`No language test required`)
      }

      if (requirements.includes("scholarship") && consultation.scholarshipRequired) {
        score += 20
        reasons.push(`Scholarship opportunities mentioned`)
      }

      if (requirements.includes("work") && consultation.workWhileStudying) {
        score += 15
        reasons.push(`Work opportunities available`)
      }

      // Warning indicators
      if (requirements.includes("interview")) {
        score -= 5
        warnings.push(`Interview may be required`)
      }

      if (requirements.includes("portfolio")) {
        score -= 5
        warnings.push(`Portfolio submission required`)
      }

      if (requirements.includes("gmat") || requirements.includes("gre")) {
        score -= 10
        warnings.push(`Standardized test (GMAT/GRE) may be required`)
      }
    }

    // Special requirements consideration
    if (consultation.religiousFacilities) {
      // This would need to be added to destination data in the future
      warnings.push(`Religious facilities availability to be confirmed`)
    }

    if (consultation.halalFood) {
      // This would need to be added to destination data in the future
      warnings.push(`Halal food availability to be confirmed`)
    }

    return { score, reasons, warnings }
  }

  /**
   * Calculate success rate score
   */
  private static calculateSuccessRateScore(destination: DestinationData, consultation: ConsultationData) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 50 // Base score

    const admissionRate = destination.admission_success_rate || 0
    const visaRate = destination.visa_success_rate || 0

    // Admission success rate analysis
    if (admissionRate >= 80) {
      score += 25
      reasons.push(`Excellent admission success rate (${admissionRate}%)`)
    } else if (admissionRate >= 60) {
      score += 15
      reasons.push(`Good admission success rate (${admissionRate}%)`)
    } else if (admissionRate >= 40) {
      score += 5
      warnings.push(`Moderate admission success rate (${admissionRate}%)`)
    } else if (admissionRate > 0) {
      score -= 5
      warnings.push(`Lower admission success rate (${admissionRate}%)`)
    }

    // Visa success rate analysis
    if (visaRate >= 90) {
      score += 20
      reasons.push(`Excellent visa approval rate (${visaRate}%)`)
    } else if (visaRate >= 70) {
      score += 10
      reasons.push(`Good visa approval rate (${visaRate}%)`)
    } else if (visaRate > 0 && visaRate < 70) {
      score -= 5
      warnings.push(`Consider visa requirements carefully (${visaRate}% success rate)`)
    }

    return { score, reasons, warnings }
  }

  /**
   * Calculate dynamic weights based on user priorities and consultation data
   */
  private static calculateDynamicWeights(consultation: ConsultationData) {
    const priorities = consultation.priorityFactors
    const baseWeights = {
      budget: 0.3, // Higher base weight for budget
      academic: 0.2,
      location: 0.15,
      language: 0.15,
      intake: 0.1,
      requirements: 0.07,
      successRate: 0.03,
    }

    // Adjust weights based on priorities
    if (priorities.includes("low_cost")) {
      baseWeights.budget += 0.15
      baseWeights.academic -= 0.05
      baseWeights.location -= 0.05
      baseWeights.language -= 0.05
    }

    if (priorities.includes("quality_education")) {
      baseWeights.academic += 0.1
      baseWeights.successRate += 0.05
      baseWeights.budget -= 0.1
      baseWeights.requirements += 0.05
    }

    if (priorities.includes("location")) {
      baseWeights.location += 0.15
      baseWeights.budget -= 0.05
      baseWeights.academic -= 0.05
      baseWeights.language -= 0.05
    }

    if (priorities.includes("scholarship")) {
      baseWeights.requirements += 0.1
      baseWeights.budget += 0.05
      baseWeights.academic -= 0.05
      baseWeights.location -= 0.05
      baseWeights.language -= 0.05
    }

    // Urgency adjustments
    if (consultation.urgency === "asap") {
      baseWeights.intake += 0.1
      baseWeights.requirements += 0.05
      baseWeights.budget -= 0.05
      baseWeights.academic -= 0.05
      baseWeights.location -= 0.05
    }

    // Budget flexibility adjustments
    if (consultation.budgetFlexibility === "strict") {
      baseWeights.budget += 0.1
      baseWeights.academic -= 0.05
      baseWeights.location -= 0.05
    }

    // Normalize weights to sum to 1
    const totalWeight = Object.values(baseWeights).reduce((sum, weight) => sum + weight, 0)
    Object.keys(baseWeights).forEach((key) => {
      baseWeights[key as keyof typeof baseWeights] /= totalWeight
    })

    return baseWeights
  }

  /**
   * Determine recommendation level based on score and warnings
   */
  private static determineRecommendation(
    score: number,
    warnings: string[],
    consultation: ConsultationData,
  ): "highly_recommended" | "recommended" | "consider" | "not_recommended" {
    const warningCount = warnings.length
    const criticalWarnings = warnings.filter(
      (w) => w.includes("significantly exceeds") || w.includes("not available") || w.includes("essential"),
    ).length

    if (score >= 80 && warningCount <= 1 && criticalWarnings === 0) {
      return "highly_recommended"
    } else if (score >= 65 && warningCount <= 3 && criticalWarnings <= 1) {
      return "recommended"
    } else if (score >= 40 && warningCount <= 5 && criticalWarnings <= 2) {
      return "consider"
    } else {
      return "not_recommended"
    }
  }

  /**
   * Create detailed budget breakdown
   */
  private static createBudgetBreakdown(
    destination: DestinationData,
    consultation: ConsultationData,
    levelData: any,
  ): BudgetBreakdown {
    const tuitionCost = levelData.tuitionAvg || 0
    const serviceCosts = this.calculateTotalServiceFees(destination)
    const totalCost = tuitionCost + serviceCosts

    const flexibilityMultiplier = {
      strict: 1.0,
      flexible: 1.2,
      very_flexible: 1.5,
    }[consultation.budgetFlexibility]

    const tuitionFit =
      tuitionCost <= consultation.tuitionBudget
        ? "within"
        : tuitionCost <= consultation.tuitionBudget * flexibilityMultiplier
          ? "slightly_over"
          : "significantly_over"

    const serviceFeesFit =
      serviceCosts <= consultation.serviceFeesBudget
        ? "within"
        : serviceCosts <= consultation.serviceFeesBudget * flexibilityMultiplier
          ? "slightly_over"
          : "significantly_over"

    const totalFit =
      totalCost <= consultation.totalBudget
        ? "within"
        : totalCost <= consultation.totalBudget * flexibilityMultiplier
          ? "slightly_over"
          : "significantly_over"

    const overagePct = Math.max(0, ((totalCost - consultation.totalBudget) / consultation.totalBudget) * 100)
    const budgetUtilization = Math.min(100, (totalCost / consultation.totalBudget) * 100)

    return {
      tuitionFit,
      serviceFeesFit,
      totalFit,
      overagePct,
      budgetUtilization,
    }
  }

  /**
   * Create requirement check summary
   */
  private static createRequirementCheck(
    destination: DestinationData,
    consultation: ConsultationData,
    levelData: any,
  ): RequirementCheck {
    const requiredLevel = levelData.academicLevel
    const userGPA = consultation.currentGPA

    // Academic level assessment
    let academicLevel: "meets" | "exceeds" | "below" = "meets"
    if (requiredLevel && requiredLevel !== "Any") {
      const gpaMapping = { low: 1, intermediate: 2, high: 3 }
      const levelMapping = { Any: 0, Medium: 2, High: 3 }

      const requiredGPA = levelMapping[requiredLevel as keyof typeof levelMapping] || 1
      const userGPANum = gpaMapping[userGPA.toLowerCase() as keyof typeof gpaMapping] || 1

      if (userGPANum > requiredGPA) academicLevel = "exceeds"
      else if (userGPANum < requiredGPA) academicLevel = "below"
    }

    // Language proficiency assessment
    const languageProficiency =
      consultation.languageLevel === "native"
        ? "sufficient"
        : consultation.languageLevel === "advanced" && consultation.hasLanguageCertificate
          ? "sufficient"
          : consultation.languageLevel === "advanced"
            ? "certificate_required"
            : consultation.languageLevel === "intermediate" && consultation.hasLanguageCertificate
              ? "sufficient"
              : consultation.languageLevel === "intermediate"
                ? "certificate_required"
                : "needs_improvement"

    // Documents status
    const documents = levelData.documents || []
    const documentsStatus = documents.length <= 5 ? "standard" : "additional_required"

    // Application complexity
    const requirements = (levelData.requirements || "").toLowerCase()
    let applicationComplexity: "simple" | "moderate" | "complex" = "simple"

    if (
      requirements.includes("interview") ||
      requirements.includes("portfolio") ||
      requirements.includes("gmat") ||
      requirements.includes("gre") ||
      documents.length > 8
    ) {
      applicationComplexity = "complex"
    } else if (
      documents.length > 5 ||
      requirements.includes("essay") ||
      requirements.includes("recommendation") ||
      requirements.includes("statement")
    ) {
      applicationComplexity = "moderate"
    }

    return {
      academicLevel,
      languageProficiency,
      documentsStatus,
      applicationComplexity,
    }
  }

  /**
   * Create a no-match result for unavailable study levels
   */
  private static createNoMatchResult(
    destination: DestinationData,
    consultation: ConsultationData,
    reason: string,
  ): MatchResult {
    return {
      score: 0,
      reasons: [],
      warnings: [reason],
      details: {
        tuitionMatch: false,
        budgetMatch: false,
        academicLevelMatch: false,
        languageMatch: false,
        countryMatch: false,
        intakeMatch: false,
        documentsRequired: [],
        estimatedCosts: { tuition: 0, living: 0, service: 0, total: 0 },
      },
      recommendation: "not_recommended",
      budgetBreakdown: {
        tuitionFit: "significantly_over",
        serviceFeesFit: "significantly_over",
        totalFit: "significantly_over",
        overagePct: 100,
        budgetUtilization: 0,
      },
      requirements: {
        academicLevel: "below",
        languageProficiency: "needs_improvement",
        documentsStatus: "additional_required",
        applicationComplexity: "complex",
      },
    }
  }
}

