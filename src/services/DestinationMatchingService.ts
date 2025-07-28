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
  bachelor_academic_level?: 'High' | 'Medium' | 'Any'
  master_academic_level?: 'High' | 'Medium' | 'Any'
  phd_academic_level?: 'High' | 'Medium' | 'Any'
  
  // Requirements by level
  bachelor_requirements?: string
  master_requirements?: string
  phd_requirements?: string
  
  // Documents by level
  bachelor_documents?: string[]
  master_documents?: string[]
  phd_documents?: string[]
  
  // Success rates
  admission_success_rate?: number
  visa_success_rate?: number
  
  // Available programs
  available_programs?: string[]
  
  // Services and fees
  agency_services?: string[]
  application_fee?: number
  service_fee?: number
  visa_processing_fee?: number
  
  // Language and intake
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
  recommendation: 'highly_recommended' | 'recommended' | 'consider' | 'not_recommended'
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
  tuitionFit: 'within' | 'slightly_over' | 'significantly_over'
  serviceFeesFit: 'within' | 'slightly_over' | 'significantly_over'
  totalFit: 'within' | 'slightly_over' | 'significantly_over'
  overagePct: number
  budgetUtilization: number
}

export interface RequirementCheck {
  academicLevel: 'meets' | 'exceeds' | 'below'
  languageProficiency: 'sufficient' | 'needs_improvement' | 'certificate_required'
  documentsStatus: 'standard' | 'additional_required'
  applicationComplexity: 'simple' | 'moderate' | 'complex'
}

export class EnhancedDestinationMatchingService {
  
  /**
   * Calculate comprehensive match score for a destination
   */
  static calculateMatchScore(destination: DestinationData, consultation: ConsultationData): MatchResult {
    const studyLevel = consultation.studyLevel.toLowerCase()
    
    // Get level-specific data
    const levelData = this.getLevelSpecificData(destination, studyLevel)
    
    // Calculate individual match components
    const budgetScore = this.calculateBudgetScore(destination, consultation, levelData)
    const academicScore = this.calculateAcademicScore(destination, consultation, levelData)
    const locationScore = this.calculateLocationScore(destination, consultation)
    const languageScore = this.calculateLanguageScore(destination, consultation)
    const intakeScore = this.calculateIntakeScore(destination, consultation)
    const requirementsScore = this.calculateRequirementsScore(destination, consultation, levelData)
    const successRateScore = this.calculateSuccessRateScore(destination, consultation)
    
    // Weight the scores based on user priorities
    const weights = this.calculateWeights(consultation)
    
    const totalScore = Math.round(
      budgetScore.score * weights.budget +
      academicScore.score * weights.academic +
      locationScore.score * weights.location +
      languageScore.score * weights.language +
      intakeScore.score * weights.intake +
      requirementsScore.score * weights.requirements +
      successRateScore.score * weights.successRate
    )
    
    // Compile reasons and warnings
    const reasons = [
      ...budgetScore.reasons,
      ...academicScore.reasons,
      ...locationScore.reasons,
      ...languageScore.reasons,
      ...intakeScore.reasons,
      ...requirementsScore.reasons,
      ...successRateScore.reasons
    ]
    
    const warnings = [
      ...budgetScore.warnings,
      ...academicScore.warnings,
      ...locationScore.warnings,
      ...languageScore.warnings,
      ...intakeScore.warnings,
      ...requirementsScore.warnings,
      ...successRateScore.warnings
    ]
    
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
        service: (destination.service_fee || 0) + (destination.application_fee || 0) + (destination.visa_processing_fee || 0),
        total: (levelData.tuitionAvg || 0) + consultation.livingCostsBudget + 
               (destination.service_fee || 0) + (destination.application_fee || 0) + (destination.visa_processing_fee || 0)
      }
    }
    
    return {
      score: Math.max(0, Math.min(100, totalScore)),
      reasons: reasons.filter(Boolean),
      warnings: warnings.filter(Boolean),
      details,
      recommendation,
      budgetBreakdown,
      requirements
    }
  }
  
  /**
   * Extract level-specific data from destination
   */
  private static getLevelSpecificData(destination: DestinationData, level: string) {
    const levelKey = level.toLowerCase()
    
    return {
      tuitionMin: destination[`${levelKey}_tuition_min` as keyof DestinationData] as number,
      tuitionMax: destination[`${levelKey}_tuition_max` as keyof DestinationData] as number,
      tuitionAvg: this.calculateTuitionAverage(
        destination[`${levelKey}_tuition_min` as keyof DestinationData] as number,
        destination[`${levelKey}_tuition_max` as keyof DestinationData] as number
      ),
      academicLevel: destination[`${levelKey}_academic_level` as keyof DestinationData] as string,
      requirements: destination[`${levelKey}_requirements` as keyof DestinationData] as string,
      documents: destination[`${levelKey}_documents` as keyof DestinationData] as string[]
    }
  }
  
  /**
   * Calculate average tuition from min/max
   */
  private static calculateTuitionAverage(min?: number, max?: number): number {
    if (!min && !max) return 0
    if (!min) return max || 0
    if (!max) return min || 0
    return (min + max) / 2
  }
  
  /**
   * Calculate budget compatibility score
   */
  private static calculateBudgetScore(destination: DestinationData, consultation: ConsultationData, levelData: any) {
    const reasons: string[] = []
    const warnings: string[] = []
    
    const tuitionCost = levelData.tuitionAvg || 0
    const serviceCosts = (destination.service_fee || 0) + (destination.application_fee || 0) + (destination.visa_processing_fee || 0)
    const totalCost = tuitionCost + serviceCosts
    
    // Calculate budget flexibility multiplier
    const flexibilityMultiplier = {
      'strict': 1.0,
      'flexible': 1.2,
      'very_flexible': 1.5
    }[consultation.budgetFlexibility]
    
    const adjustedTuitionBudget = consultation.tuitionBudget * flexibilityMultiplier
    const adjustedServiceBudget = consultation.serviceFeesBudget * flexibilityMultiplier
    const adjustedTotalBudget = consultation.totalBudget * flexibilityMultiplier
    
    let score = 0
    let tuitionMatch = false
    let budgetMatch = false
    
    // Tuition budget check
    if (tuitionCost <= consultation.tuitionBudget) {
      score += 40
      tuitionMatch = true
      reasons.push(`Tuition (€${tuitionCost.toLocaleString()}) fits your budget`)
    } else if (tuitionCost <= adjustedTuitionBudget) {
      score += 25
      tuitionMatch = true
      const overage = ((tuitionCost - consultation.tuitionBudget) / consultation.tuitionBudget * 100).toFixed(0)
      warnings.push(`Tuition is ${overage}% over budget but within flexibility range`)
    } else {
      const overage = ((tuitionCost - adjustedTuitionBudget) / adjustedTuitionBudget * 100).toFixed(0)
      warnings.push(`Tuition significantly exceeds budget by ${overage}%`)
    }
    
    // Service fees check
    if (serviceCosts <= consultation.serviceFeesBudget) {
      score += 20
      reasons.push(`Service fees (€${serviceCosts.toLocaleString()}) within budget`)
    } else if (serviceCosts <= adjustedServiceBudget) {
      score += 10
      warnings.push(`Service fees slightly over budget`)
    } else {
      warnings.push(`Service fees significantly over budget`)
    }
    
    // Total budget check
    if (totalCost <= consultation.totalBudget) {
      score += 30
      budgetMatch = true
      reasons.push(`Total cost fits your overall budget`)
    } else if (totalCost <= adjustedTotalBudget) {
      score += 15
      budgetMatch = true
      warnings.push(`Total cost within flexibility range`)
    } else {
      warnings.push(`Total cost exceeds budget even with flexibility`)
    }
    
    // Bonus for being significantly under budget
    if (totalCost < consultation.totalBudget * 0.8) {
      score += 10
      reasons.push(`Excellent value - well under budget`)
    }
    
    return { score, reasons, warnings, tuitionMatch, budgetMatch }
  }
  
  /**
   * Calculate academic level compatibility
   */
  private static calculateAcademicScore(destination: DestinationData, consultation: ConsultationData, levelData: any) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 0
    let levelMatch = false
    
    // Check if the program level is available
    const availablePrograms = destination.available_programs || []
    if (!availablePrograms.includes(consultation.studyLevel)) {
      warnings.push(`${consultation.studyLevel} program may not be available`)
      return { score: 0, reasons, warnings, levelMatch }
    }
    
    score += 30
    reasons.push(`${consultation.studyLevel} program available`)
    
    // Academic level requirement check
    const requiredLevel = levelData.academicLevel
    const userGPA = consultation.currentGPA
    
    if (requiredLevel === 'Any' || !requiredLevel) {
      score += 40
      levelMatch = true
      reasons.push(`No specific academic requirements`)
    } else {
      const gpaMapping = {
        'low': 1,
        'intermediate': 2,
        'high': 3
      }
      
      const requiredGPA = gpaMapping[requiredLevel.toLowerCase() as keyof typeof gpaMapping] || 1
      const userGPANum = gpaMapping[userGPA.toLowerCase() as keyof typeof gpaMapping] || 1
      
      if (userGPANum >= requiredGPA) {
        score += 40
        levelMatch = true
        reasons.push(`Your academic level meets requirements`)
        
        if (userGPANum > requiredGPA) {
          score += 10
          reasons.push(`Your academic level exceeds requirements`)
        }
      } else {
        warnings.push(`Academic requirements may be challenging`)
        score += 10
      }
    }
    
    // Success rate bonus
    const admissionRate = destination.admission_success_rate
    if (admissionRate && admissionRate > 70) {
      score += 15
      reasons.push(`High admission success rate (${admissionRate}%)`)
    } else if (admissionRate && admissionRate < 30) {
      warnings.push(`Lower admission success rate (${admissionRate}%)`)
    }
    
    return { score, reasons, warnings, levelMatch }
  }
  
  /**
   * Calculate location compatibility
   */
  private static calculateLocationScore(destination: DestinationData, consultation: ConsultationData) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 0
    let countryMatch = false
    
    // Country preference check
    if (consultation.preferredCountry === '' || consultation.preferredCountry === 'Any') {
      score += 50
      countryMatch = true
      reasons.push(`Open to studying in ${destination.country}`)
    } else if (destination.country.toLowerCase() === consultation.preferredCountry.toLowerCase()) {
      score += 80
      countryMatch = true
      reasons.push(`Perfect match for your preferred country`)
    } else {
      // Check for regional proximity or language similarity
      const countryGroups = {
        'Germanic': ['Germany', 'Austria', 'Switzerland'],
        'Romance': ['France', 'Spain', 'Italy'],
        'Nordic': ['Sweden', 'Norway', 'Denmark', 'Finland'],
        'Eastern': ['Poland', 'Czech Republic', 'Hungary']
      }
      
      let foundGroup = false
      for (const [group, countries] of Object.entries(countryGroups)) {
        if (countries.includes(destination.country) && countries.includes(consultation.preferredCountry)) {
          score += 30
          reasons.push(`Similar region to your preference (${group})`)
          foundGroup = true
          break
        }
      }
      
      if (!foundGroup) {
        warnings.push(`Different country from your preference`)
        score += 10
      }
    }
    
    // Visa processing considerations
    if (destination.visa_requirements) {
      const visaComplexity = destination.visa_requirements.toLowerCase()
      if (visaComplexity.includes('simple') || visaComplexity.includes('easy')) {
        score += 20
        reasons.push(`Straightforward visa process`)
      } else if (visaComplexity.includes('complex') || visaComplexity.includes('difficult')) {
        warnings.push(`Complex visa requirements`)
      }
    }
    
    return { score, reasons, warnings, countryMatch }
  }
  
  /**
   * Calculate language compatibility
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
    if (userLanguage === 'any' || !userLanguage) {
      score += 40
      languageMatch = true
      reasons.push(`Flexible with study language`)
    } else {
      // Check destination language requirements
      const langReq = destination.language_requirements?.toLowerCase() || ''
      
      if (langReq.includes(userLanguage) || langReq.includes('english') && userLanguage === 'english') {
        score += 50
        languageMatch = true
        reasons.push(`Programs available in your preferred language`)
        
        // Proficiency level check
        if (userLevel === 'native') {
          score += 25
          reasons.push(`Native speaker advantage`)
        } else if (userLevel === 'advanced') {
          score += 20
          reasons.push(`Advanced language skills`)
          if (hasCertificate) {
            score += 15
            reasons.push(`Official language certificate`)
          }
        } else if (userLevel === 'intermediate') {
          score += 10
          reasons.push(`Good language foundation`)
          if (hasCertificate) {
            score += 20
            reasons.push(`Language certificate helps`)
          } else {
            warnings.push(`Language certificate may be required`)
          }
        } else {
          warnings.push(`Language improvement recommended`)
          if (hasCertificate) {
            score += 15
          }
        }
      } else {
        warnings.push(`Limited programs in your preferred language`)
        score += 10
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
    
    if (preferredIntake === 'any' || preferredIntake === 'flexible') {
      score += 30
      intakeMatch = true
      reasons.push(`Flexible with intake timing`)
    } else if (availableIntakes.length === 0) {
      // No intake data available
      score += 20
      reasons.push(`Intake information to be confirmed`)
    } else {
      // Check if preferred intake is available
      const hasMatchingIntake = availableIntakes.some(intake => 
        intake.toLowerCase().includes(preferredIntake) ||
        preferredIntake.includes(intake.toLowerCase())
      )
      
      if (hasMatchingIntake) {
        score += 40
        intakeMatch = true
        reasons.push(`Your preferred intake period is available`)
      } else {
        warnings.push(`Your preferred intake may not be available`)
        score += 10
      }
    }
    
    // Urgency consideration
    if (consultation.urgency === 'asap') {
      if (availableIntakes.some(intake => 
        intake.toLowerCase().includes('september') || 
        intake.toLowerCase().includes('january') ||
        intake.toLowerCase().includes('fall') ||
        intake.toLowerCase().includes('spring')
      )) {
        score += 10
        reasons.push(`Multiple intake options for urgent application`)
      }
    }
    
    return { score, reasons, warnings, intakeMatch }
  }
  
  /**
   * Calculate requirements complexity score
   */
  private static calculateRequirementsScore(destination: DestinationData, consultation: ConsultationData, levelData: any) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 50 // Base score
    
    // Document requirements
    const documents = levelData.documents || []
    const documentCount = documents.length
    
    if (documentCount === 0) {
      score += 30
      reasons.push(`Standard documentation required`)
    } else if (documentCount <= 5) {
      score += 20
      reasons.push(`Moderate documentation requirements`)
    } else {
      score += 10
      warnings.push(`Extensive documentation required`)
    }
    
    // Requirements text analysis
    const requirements = levelData.requirements || ''
    if (requirements) {
      const reqLower = requirements.toLowerCase()
      
      // Positive indicators
      if (reqLower.includes('no ielts') || reqLower.includes('no toefl')) {
        score += 15
        reasons.push(`No language test required`)
      }
      
      if (reqLower.includes('scholarship') && consultation.scholarshipRequired) {
        score += 20
        reasons.push(`Scholarship opportunities available`)
      }
      
      if (reqLower.includes('work permit') && consultation.workWhileStudying) {
        score += 15
        reasons.push(`Work opportunities available`)
      }
      
      // Warning indicators
      if (reqLower.includes('interview')) {
        warnings.push(`Interview may be required`)
      }
      
      if (reqLower.includes('portfolio')) {
        warnings.push(`Portfolio submission required`)
      }
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
    
    // Admission success rate
    if (admissionRate >= 80) {
      score += 25
      reasons.push(`Excellent admission success rate`)
    } else if (admissionRate >= 60) {
      score += 15
      reasons.push(`Good admission success rate`)
    } else if (admissionRate >= 40) {
      score += 5
      warnings.push(`Moderate admission success rate`)
    } else if (admissionRate > 0) {
      warnings.push(`Lower admission success rate`)
    }
    
    // Visa success rate
    if (visaRate >= 90) {
      score += 20
      reasons.push(`Excellent visa approval rate`)
    } else if (visaRate >= 70) {
      score += 10
      reasons.push(`Good visa approval rate`)
    } else if (visaRate > 0) {
      warnings.push(`Consider visa requirements carefully`)
    }
    
    return { score, reasons, warnings }
  }
  
  /**
   * Calculate dynamic weights based on user priorities
   */
  private static calculateWeights(consultation: ConsultationData) {
    const priorities = consultation.priorityFactors
    const baseWeights = {
      budget: 0.25,
      academic: 0.20,
      location: 0.15,
      language: 0.15,
      intake: 0.10,
      requirements: 0.10,
      successRate: 0.05
    }
    
    // Adjust weights based on priorities
    if (priorities.includes('low_cost')) {
      baseWeights.budget += 0.15
    }
    
    if (priorities.includes('quality_education')) {
      baseWeights.academic += 0.10
      baseWeights.successRate += 0.05
    }
    
    if (priorities.includes('location')) {
      baseWeights.location += 0.10
    }
    
    if (priorities.includes('scholarship')) {
      baseWeights.requirements += 0.10
    }
    
    // Normalize weights to sum to 1
    const totalWeight = Object.values(baseWeights).reduce((sum, weight) => sum + weight, 0)
    Object.keys(baseWeights).forEach(key => {
      baseWeights[key as keyof typeof baseWeights] /= totalWeight
    })
    
    return baseWeights
  }
  
  /**
   * Determine recommendation level
   */
  private static determineRecommendation(
    score: number, 
    warnings: string[], 
    consultation: ConsultationData
  ): 'highly_recommended' | 'recommended' | 'consider' | 'not_recommended' {
    const warningCount = warnings.length
    
    if (score >= 80 && warningCount <= 1) {
      return 'highly_recommended'
    } else if (score >= 65 && warningCount <= 2) {
      return 'recommended'
    } else if (score >= 40 && warningCount <= 4) {
      return 'consider'
    } else {
      return 'not_recommended'
    }
  }
  
  /**
   * Create detailed budget breakdown
   */
  private static createBudgetBreakdown(
    destination: DestinationData, 
    consultation: ConsultationData, 
    levelData: any
  ): BudgetBreakdown {
    const tuitionCost = levelData.tuitionAvg || 0
    const serviceCosts = (destination.service_fee || 0) + (destination.application_fee || 0) + (destination.visa_processing_fee || 0)
    const totalCost = tuitionCost + serviceCosts
    
    const flexibilityMultiplier = {
      'strict': 1.0,
      'flexible': 1.2,
      'very_flexible': 1.5
    }[consultation.budgetFlexibility]
    
    const tuitionFit = tuitionCost <= consultation.tuitionBudget ? 'within' :
                      tuitionCost <= consultation.tuitionBudget * flexibilityMultiplier ? 'slightly_over' : 'significantly_over'
    
    const serviceFeesFit = serviceCosts <= consultation.serviceFeesBudget ? 'within' :
                          serviceCosts <= consultation.serviceFeesBudget * flexibilityMultiplier ? 'slightly_over' : 'significantly_over'
    
    const totalFit = totalCost <= consultation.totalBudget ? 'within' :
                     totalCost <= consultation.totalBudget * flexibilityMultiplier ? 'slightly_over' : 'significantly_over'
    
    const overagePct = Math.max(0, ((totalCost - consultation.totalBudget) / consultation.totalBudget) * 100)
    const budgetUtilization = Math.min(100, (totalCost / consultation.totalBudget) * 100)
    
    return {
      tuitionFit,
      serviceFeesFit,
      totalFit,
      overagePct,
      budgetUtilization
    }
  }
  
  /**
   * Create requirement check summary
   */
  private static createRequirementCheck(
    destination: DestinationData, 
    consultation: ConsultationData, 
    levelData: any
  ): RequirementCheck {
    const requiredLevel = levelData.academicLevel
    const userGPA = consultation.currentGPA
    
    // Academic level assessment
    let academicLevel: 'meets' | 'exceeds' | 'below' = 'meets'
    if (requiredLevel && requiredLevel !== 'Any') {
      const gpaMapping = { 'low': 1, 'intermediate': 2, 'high': 3 }
      const requiredGPA = gpaMapping[requiredLevel.toLowerCase() as keyof typeof gpaMapping] || 1
      const userGPANum = gpaMapping[userGPA.toLowerCase() as keyof typeof gpaMapping] || 1
      
      if (userGPANum > requiredGPA) academicLevel = 'exceeds'
      else if (userGPANum < requiredGPA) academicLevel = 'below'
    }
    
    // Language proficiency
    const languageProficiency = 
      consultation.languageLevel === 'native' ? 'sufficient' :
      consultation.languageLevel === 'advanced' ? 'sufficient' :
      consultation.hasLanguageCertificate ? 'sufficient' : 
      consultation.languageLevel === 'intermediate' ? 'certificate_required' : 'needs_improvement'
    
    // Documents status
    const documents = levelData.documents || []
    const documentsStatus = documents.length <= 5 ? 'standard' : 'additional_required'
    
    // Application complexity
    const requirements = (levelData.requirements || '').toLowerCase()
    let applicationComplexity: 'simple' | 'moderate' | 'complex' = 'simple'
    
    if (requirements.includes('interview') || requirements.includes('portfolio') || documents.length > 8) {
      applicationComplexity = 'complex'
    } else if (documents.length > 5 || requirements.includes('essay') || requirements.includes('recommendation')) {
      applicationComplexity = 'moderate'
    }
    
    return {
      academicLevel,
      languageProficiency,
      documentsStatus,
      applicationComplexity
    }
  }
}
