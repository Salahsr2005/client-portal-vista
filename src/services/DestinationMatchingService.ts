// Enhanced Destination Matching Service - Fixed and Fully Functional
// Properly matches Supabase destination table structure

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
   * Main matching function - Fixed to work with actual data
   */
  static findMatchingDestinations(
    destinations: DestinationData[],
    preferences: ConsultationPreferences,
  ): MatchedDestination[] {
    console.log("🔍 Starting destination matching with enhanced logic...")
    console.log("📊 Destinations received:", destinations?.length || 0)
    console.log("⚙️ User preferences:", preferences)

    if (!destinations || destinations.length === 0) {
      console.warn("❌ No destinations available for matching")
      return []
    }

    // Filter active destinations first
    const activeDestinations = destinations.filter((dest) => !dest.status || dest.status.toLowerCase() === "active")

    console.log("✅ Active destinations:", activeDestinations.length)

    // Score each destination
    const matches = activeDestinations
      .map((destination) => this.scoreDestination(destination, preferences))
      .filter((match) => match.score >= 20) // Minimum threshold
      .sort((a, b) => b.score - a.score) // Sort by score descending

    console.log("🏆 Final matches found:", matches.length)
    console.log(
      "📈 Top 3 scores:",
      matches.slice(0, 3).map((m) => ({
        name: m.destination.name,
        score: m.score,
        country: m.destination.country,
      })),
    )

    return matches
  }

  /**
   * Enhanced scoring system
   */
  private static scoreDestination(
    destination: DestinationData,
    preferences: ConsultationPreferences,
  ): MatchedDestination {
    let totalScore = 0
    const reasons: string[] = []
    const warnings: string[] = []

    console.log(`🎯 Scoring destination: ${destination.name} (${destination.country})`)

    // 1. Study Level Availability (30 points)
    const levelScore = this.calculateLevelScore(destination, preferences)
    totalScore += levelScore.score
    reasons.push(...levelScore.reasons)
    warnings.push(...levelScore.warnings)

    // 2. Budget Compatibility (25 points)
    const budgetScore = this.calculateBudgetScore(destination, preferences)
    totalScore += budgetScore.score
    reasons.push(...budgetScore.reasons)
    warnings.push(...budgetScore.warnings)

    // 3. Language Compatibility (20 points)
    const languageScore = this.calculateLanguageScore(destination, preferences)
    totalScore += languageScore.score
    reasons.push(...languageScore.reasons)
    warnings.push(...languageScore.warnings)

    // 4. Timeline Compatibility (15 points)
    const timelineScore = this.calculateTimelineScore(destination, preferences)
    totalScore += timelineScore.score
    reasons.push(...timelineScore.reasons)
    warnings.push(...timelineScore.warnings)

    // 5. Special Requirements (10 points)
    const specialScore = this.calculateSpecialScore(destination, preferences)
    totalScore += specialScore.score
    reasons.push(...specialScore.reasons)
    warnings.push(...specialScore.warnings)

    // Calculate estimated costs
    const estimatedCosts = this.calculateEstimatedCosts(destination, preferences)

    // Determine recommendation and budget fit
    const recommendation = this.getRecommendationLevel(totalScore, warnings.length)
    const budgetFit = this.getBudgetFit(estimatedCosts, preferences)

    const finalScore = Math.round(Math.max(0, Math.min(100, totalScore)))

    console.log(`📊 ${destination.name} final score: ${finalScore}%`)

    return {
      destination,
      score: finalScore,
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
    const availablePrograms = destination.available_programs || []

    console.log(`  📚 Checking study level: ${studyLevel}`)
    console.log(`  📋 Available programs:`, availablePrograms)

    // If no programs specified, assume all levels available (common case)
    if (!availablePrograms || availablePrograms.length === 0) {
      score += 25
      reasons.push(`${preferences.studyLevel} programs available`)
      console.log(`  ✅ No specific programs listed - assuming available (+25)`)
    } else {
      // Check for exact or partial match
      const hasDirectMatch = availablePrograms.some(
        (program) => program.toLowerCase().includes(studyLevel) || studyLevel.includes(program.toLowerCase()),
      )

      if (hasDirectMatch) {
        score += 30
        reasons.push(`${preferences.studyLevel} programs confirmed available`)
        console.log(`  ✅ Direct program match found (+30)`)
      } else {
        // Check for general university programs
        const hasGeneralPrograms = availablePrograms.some(
          (program) =>
            program.toLowerCase().includes("university") ||
            program.toLowerCase().includes("degree") ||
            program.toLowerCase().includes("studies"),
        )

        if (hasGeneralPrograms) {
          score += 20
          reasons.push(`University programs available, ${preferences.studyLevel} likely offered`)
          console.log(`  ⚠️ General programs found (+20)`)
        } else {
          score += 10
          warnings.push(`${preferences.studyLevel} programs may not be available`)
          console.log(`  ❌ No matching programs found (+10)`)
        }
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

    console.log(`  💰 Checking budget compatibility for ${studyLevel}`)
    console.log(`  💵 User max budget: €${userMaxBudget}`)

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
    if (tuitionMin === 0 && tuitionMax === 0 && destination.fees) {
      tuitionMin = Math.round(destination.fees * 0.8)
      tuitionMax = Math.round(destination.fees * 1.2)
      console.log(`  📊 Using general fees as fallback: €${tuitionMin}-€${tuitionMax}`)
    }

    // Default reasonable ranges if still no data
    if (tuitionMin === 0 && tuitionMax === 0) {
      if (studyLevel === "bachelor") {
        tuitionMin = 2000
        tuitionMax = 8000
      } else if (studyLevel === "master") {
        tuitionMin = 3000
        tuitionMax = 10000
      } else if (studyLevel === "phd") {
        tuitionMin = 1000
        tuitionMax = 6000
      }
      console.log(`  🔧 Using default ranges: €${tuitionMin}-€${tuitionMax}`)
    }

    console.log(`  💸 Destination tuition: €${tuitionMin}-€${tuitionMax}`)

    // Score based on budget fit
    const flexibilityMultiplier = {
      strict: 1.0,
      flexible: 1.2,
      very_flexible: 1.5,
    }[preferences.budgetFlexibility]

    const adjustedBudget = userMaxBudget * flexibilityMultiplier

    if (tuitionMax <= userMaxBudget * 0.7) {
      score += 25
      reasons.push(`Tuition (€${tuitionMin}-€${tuitionMax}) well within budget`)
      console.log(`  ✅ Excellent budget fit (+25)`)
    } else if (tuitionMax <= userMaxBudget) {
      score += 22
      reasons.push(`Tuition fits within your budget range`)
      console.log(`  ✅ Good budget fit (+22)`)
    } else if (tuitionMax <= adjustedBudget) {
      score += 18
      reasons.push(`Tuition manageable with ${preferences.budgetFlexibility} budget`)
      console.log(`  ⚠️ Acceptable with flexibility (+18)`)
    } else if (tuitionMin <= userMaxBudget) {
      score += 12
      warnings.push(`Higher tuition options may exceed budget`)
      console.log(`  ⚠️ Partial budget fit (+12)`)
    } else {
      score += 5
      warnings.push(`Tuition may exceed your budget significantly`)
      console.log(`  ❌ Poor budget fit (+5)`)
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

    console.log(`  🗣️ Checking language compatibility`)
    console.log(`  👤 User languages:`, userLanguages)
    console.log(`  🏛️ Destination requirements:`, langReq || "Not specified")

    // If no language requirements specified, assume flexibility
    if (!langReq || langReq.trim() === "") {
      score += 15
      reasons.push("Language requirements flexible")
      console.log(`  ✅ No specific language requirements (+15)`)
    }

    // Check language compatibility
    let hasMatch = false
    for (const userLang of userLanguages) {
      if (userLang.toLowerCase() === "any") {
        hasMatch = true
        score += 20
        reasons.push("Flexible with any language")
        console.log(`  ✅ User accepts any language (+20)`)
        break
      }

      // Check for direct matches
      if (
        langReq.includes(userLang.toLowerCase()) ||
        (userLang.toLowerCase() === "english" && (langReq.includes("eng") || langReq.includes("international"))) ||
        (userLang.toLowerCase() === "french" && (langReq.includes("fr") || langReq.includes("français")))
      ) {
        hasMatch = true
        score += 20
        reasons.push(`Programs available in ${userLang}`)
        console.log(`  ✅ Language match found: ${userLang} (+20)`)
        break
      }
    }

    if (!hasMatch && langReq) {
      score += 8
      warnings.push("Limited programs in your preferred language(s)")
      console.log(`  ❌ No language match (+8)`)
    }

    // Bonus for language proficiency
    if (hasMatch) {
      if (preferences.languageLevel === "native" || preferences.languageLevel === "advanced") {
        score += 5
        reasons.push("Strong language skills advantage")
        console.log(`  🌟 Language proficiency bonus (+5)`)
      }

      if (preferences.hasLanguageCertificate) {
        score += 3
        reasons.push("Official language certificate")
        console.log(`  📜 Certificate bonus (+3)`)
      }
    }

    return { score, reasons, warnings }
  }

  /**
   * Calculate timeline compatibility
   */
  private static calculateTimelineScore(destination: DestinationData, preferences: ConsultationPreferences) {
    const reasons: string[] = []
    const warnings: string[] = []
    let score = 10 // Base score

    const userIntakes = preferences.intakePeriods
    const availableIntakes = destination.intake_periods || []

    console.log(`  📅 Checking timeline compatibility`)
    console.log(`  👤 User preferred intakes:`, userIntakes)
    console.log(`  🏛️ Available intakes:`, availableIntakes)

    if (userIntakes.includes("Any") || userIntakes.includes("Flexible")) {
      score += 15
      reasons.push("Flexible with intake timing")
      console.log(`  ✅ User is flexible with timing (+15)`)
    } else if (availableIntakes.length === 0) {
      score += 10
      reasons.push("Intake periods to be confirmed")
      console.log(`  ⚠️ No intake info available (+10)`)
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
        score += 15
        reasons.push("Your preferred intake periods are available")
        console.log(`  ✅ Intake match found (+15)`)
      } else {
        score += 5
        warnings.push("Your preferred intake periods may not be available")
        console.log(`  ❌ No intake match (+5)`)
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

    console.log(`  🎯 Checking special requirements`)

    // Work while studying (EU countries generally allow this)
    if (preferences.workWhileStudying) {
      const euCountries = ["france", "germany", "belgium", "netherlands", "spain", "italy", "luxembourg", "malta"]
      if (euCountries.includes(destination.country.toLowerCase())) {
        score += 3
        reasons.push("Work opportunities available in EU")
        console.log(`  💼 Work opportunities in EU (+3)`)
      }
    }

    // Scholarship requirements
    if (preferences.scholarshipRequired) {
      const description = (destination.description || "").toLowerCase()
      if (description.includes("scholarship") || description.includes("bourse") || description.includes("funding")) {
        score += 5
        reasons.push("Scholarship opportunities mentioned")
        console.log(`  🎓 Scholarships available (+5)`)
      }
    }

    // Success rate bonus
    const successRate = destination.admission_success_rate || destination.success_rate || 50
    if (successRate >= 70) {
      score += 3
      reasons.push(`High success rate (${successRate}%)`)
      console.log(`  📈 High success rate (+3)`)
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
    if (tuitionMin === 0 && tuitionMax === 0 && destination.fees) {
      tuitionMin = Math.round(destination.fees * 0.8)
      tuitionMax = Math.round(destination.fees * 1.2)
    }

    // Default ranges if no data
    if (tuitionMin === 0 && tuitionMax === 0) {
      if (studyLevel === "bachelor") {
        tuitionMin = 2000
        tuitionMax = 8000
      } else if (studyLevel === "master") {
        tuitionMin = 3000
        tuitionMax = 10000
      } else {
        tuitionMin = 1000
        tuitionMax = 6000
      }
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
   * Get recommendation level
   */
  private static getRecommendationLevel(
    score: number,
    warningCount: number,
  ): "highly_recommended" | "recommended" | "consider" | "not_recommended" {
    if (score >= 75 && warningCount <= 1) {
      return "highly_recommended"
    } else if (score >= 55 && warningCount <= 3) {
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





