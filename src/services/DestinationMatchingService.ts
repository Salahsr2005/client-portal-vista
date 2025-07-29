import { supabase } from "@/integrations/supabase/client"

export interface DestinationPreferences {
  studyLevel: string
  userLanguage: "en" | "fr" | "ar"
  tuitionBudgetRange: [number, number]
  livingCostsBudgetRange: [number, number]
  serviceFeesBudgetRange: [number, number]
  budgetFlexibility: "strict" | "flexible" | "very_flexible"
  preferredLanguages: string[]
  languageLevel: "beginner" | "intermediate" | "advanced"
  hasLanguageCertificate: boolean
  intakePeriods: string[]
  urgency: "urgent" | "moderate" | "flexible"
  currentGPA: "excellent" | "good" | "intermediate" | "improving"
  scholarshipRequired: boolean
  religiousFacilities: boolean
  halalFood: boolean
  workWhileStudying: boolean
  preferredRegions?: string[]
  avoidRegions?: string[]
  priorityFactors?: string[]
}

export interface DestinationMatch {
  destination: any
  score: number
  reasons: string[]
  warnings: string[]
  estimatedCosts: {
    tuitionRange: [number, number]
    livingCosts: number
    serviceFees: number
    totalEstimate: number
  }
}

export class DestinationMatchingService {
  private static parseJsonField(field: any, fallback: any = []): any {
    if (!field) return fallback
    if (typeof field === "string") {
      try {
        return JSON.parse(field)
      } catch {
        // If JSON parsing fails, try to split by comma
        return field
          .split(",")
          .map((item: string) => item.trim())
          .filter(Boolean)
      }
    }
    return Array.isArray(field) ? field : fallback
  }

  private static safeParseNumber(value: any, fallback = 0): number {
    if (typeof value === "number") return value
    if (typeof value === "string") {
      const parsed = Number.parseFloat(value)
      return isNaN(parsed) ? fallback : parsed
    }
    return fallback
  }

  static async findMatches(preferences: DestinationPreferences): Promise<DestinationMatch[]> {
    try {
      console.log("🔍 Fetching destinations from database...")

      // Fetch all destinations from Supabase
      const { data: destinations, error } = await supabase.from("destinations").select("*").order("name")

      if (error) {
        console.error("❌ Error fetching destinations:", error)
        throw error
      }

      if (!destinations || destinations.length === 0) {
        console.warn("⚠️ No destinations found in database")
        return []
      }

      console.log(`📊 Found ${destinations.length} destinations, analyzing matches...`)

      const matches: DestinationMatch[] = []

      for (const destination of destinations) {
        try {
          const match = this.analyzeDestination(destination, preferences)
          if (match.score > 0) {
            matches.push(match)
          }
        } catch (error) {
          console.error(`❌ Error analyzing destination ${destination.name}:`, error)
          // Continue with other destinations
        }
      }

      // Sort by score (highest first)
      matches.sort((a, b) => b.score - a.score)

      console.log(`✅ Found ${matches.length} matching destinations`)
      return matches.slice(0, 10) // Return top 10 matches
    } catch (error) {
      console.error("❌ Error in findMatches:", error)
      throw error
    }
  }

  private static analyzeDestination(destination: any, preferences: DestinationPreferences): DestinationMatch {
    let score = 0
    const reasons: string[] = []
    const warnings: string[] = []
    const maxScore = 100

    // Parse destination data safely
    const availablePrograms = this.parseJsonField(destination.available_programs, [])
    const programLanguages = this.parseJsonField(destination.program_languages, [])
    const intakePeriods = this.parseJsonField(destination.intake_periods, [])
    const specialFeatures = this.parseJsonField(destination.special_features, [])

    // Study Level Match (20 points)
    if (
      availablePrograms.some((program: string) => program.toLowerCase().includes(preferences.studyLevel.toLowerCase()))
    ) {
      score += 20
      reasons.push(`Offers ${preferences.studyLevel} programs`)
    } else if (availablePrograms.length > 0) {
      score += 5
      warnings.push(`Limited ${preferences.studyLevel} program options`)
    }

    // Budget Analysis (25 points)
    const budgetScore = this.analyzeBudget(destination, preferences)
    score += budgetScore.score
    reasons.push(...budgetScore.reasons)
    warnings.push(...budgetScore.warnings)

    // Language Match (20 points)
    const languageScore = this.analyzeLanguages(programLanguages, preferences)
    score += languageScore.score
    reasons.push(...languageScore.reasons)
    warnings.push(...languageScore.warnings)

    // Timeline Match (15 points)
    const timelineScore = this.analyzeTimeline(intakePeriods, preferences)
    score += timelineScore.score
    reasons.push(...timelineScore.reasons)
    warnings.push(...timelineScore.warnings)

    // Special Requirements (10 points)
    const specialScore = this.analyzeSpecialRequirements(specialFeatures, destination, preferences)
    score += specialScore.score
    reasons.push(...specialScore.reasons)
    warnings.push(...specialScore.warnings)

    // Academic Requirements (10 points)
    const academicScore = this.analyzeAcademicRequirements(destination, preferences)
    score += academicScore.score
    reasons.push(...academicScore.reasons)
    warnings.push(...academicScore.warnings)

    // Calculate estimated costs
    const estimatedCosts = this.calculateEstimatedCosts(destination, preferences)

    return {
      destination,
      score: Math.min(Math.round(score), maxScore),
      reasons: reasons.filter(Boolean),
      warnings: warnings.filter(Boolean),
      estimatedCosts,
    }
  }

  private static analyzeBudget(destination: any, preferences: DestinationPreferences) {
    let score = 0
    const reasons: string[] = []
    const warnings: string[] = []

    // Get budget ranges with safe parsing
    const tuitionMin = this.safeParseNumber(destination.bachelor_tuition_min, 0)
    const tuitionMax = this.safeParseNumber(destination.bachelor_tuition_max, 50000)
    const livingMin = this.safeParseNumber(destination.living_cost_min, 400)
    const livingMax = this.safeParseNumber(destination.living_cost_max, 1200)

    // Tuition budget analysis
    const [userTuitionMin, userTuitionMax] = preferences.tuitionBudgetRange
    if (tuitionMin <= userTuitionMax && tuitionMax >= userTuitionMin) {
      if (tuitionMax <= userTuitionMax) {
        score += 10
        reasons.push("Tuition within budget")
      } else {
        score += 5
        if (preferences.budgetFlexibility === "strict") {
          warnings.push("Tuition may exceed budget")
        }
      }
    } else if (preferences.budgetFlexibility !== "strict") {
      score += 2
      warnings.push("Tuition above preferred range")
    }

    // Living costs analysis
    const [userLivingMin, userLivingMax] = preferences.livingCostsBudgetRange
    if (livingMin <= userLivingMax && livingMax >= userLivingMin) {
      if (livingMax <= userLivingMax) {
        score += 10
        reasons.push("Living costs affordable")
      } else {
        score += 5
        warnings.push("Living costs may be higher than expected")
      }
    } else if (preferences.budgetFlexibility !== "strict") {
      score += 2
      warnings.push("Living costs above preferred range")
    }

    // Service fees analysis
    const serviceFees = this.safeParseNumber(destination.service_fees, 500)
    const [userServiceMin, userServiceMax] = preferences.serviceFeesBudgetRange
    if (serviceFees <= userServiceMax) {
      score += 5
      reasons.push("Service fees reasonable")
    } else if (preferences.budgetFlexibility !== "strict") {
      score += 2
      warnings.push("Service fees above preferred range")
    }

    return { score, reasons, warnings }
  }

  private static analyzeLanguages(programLanguages: string[], preferences: DestinationPreferences) {
    let score = 0
    const reasons: string[] = []
    const warnings: string[] = []

    // Check if destination offers programs in preferred languages
    const matchingLanguages = programLanguages.filter((lang) =>
      preferences.preferredLanguages.some((prefLang) => lang.toLowerCase().includes(prefLang.toLowerCase())),
    )

    if (matchingLanguages.length > 0) {
      score += 15
      reasons.push(`Programs available in ${matchingLanguages.join(", ")}`)

      // Bonus for language proficiency level
      if (preferences.languageLevel === "advanced") {
        score += 5
        reasons.push("Advanced language skills advantage")
      } else if (preferences.languageLevel === "intermediate") {
        score += 3
      } else {
        warnings.push("May need language preparation")
      }
    } else if (programLanguages.includes("English") && !preferences.preferredLanguages.includes("English")) {
      score += 5
      warnings.push("Programs mainly in English")
    } else {
      warnings.push("Limited language options")
    }

    // Language certificate bonus
    if (preferences.hasLanguageCertificate && matchingLanguages.length > 0) {
      score += 2
      reasons.push("Language certification advantage")
    }

    return { score, reasons, warnings }
  }

  private static analyzeTimeline(intakePeriods: string[], preferences: DestinationPreferences) {
    let score = 0
    const reasons: string[] = []
    const warnings: string[] = []

    // Check intake period matches
    const matchingIntakes = intakePeriods.filter((intake) =>
      preferences.intakePeriods.some(
        (prefIntake) => intake.toLowerCase().includes(prefIntake.toLowerCase()) || prefIntake === "Any",
      ),
    )

    if (matchingIntakes.length > 0 || preferences.intakePeriods.includes("Any")) {
      score += 10
      reasons.push(`Suitable intake periods available`)

      // Urgency bonus/penalty
      if (preferences.urgency === "urgent") {
        if (matchingIntakes.some((intake) => intake.includes("January") || intake.includes("September"))) {
          score += 5
          reasons.push("Quick start options available")
        } else {
          warnings.push("Limited immediate start options")
        }
      } else if (preferences.urgency === "flexible") {
        score += 3
        reasons.push("Flexible timeline advantage")
      }
    } else {
      score += 2
      warnings.push("Limited intake period options")
    }

    return { score, reasons, warnings }
  }

  private static analyzeSpecialRequirements(
    specialFeatures: string[],
    destination: any,
    preferences: DestinationPreferences,
  ) {
    let score = 0
    const reasons: string[] = []
    const warnings: string[] = []

    // Scholarship requirements
    if (preferences.scholarshipRequired) {
      if (
        specialFeatures.some((feature) => feature.toLowerCase().includes("scholarship")) ||
        destination.scholarship_available
      ) {
        score += 5
        reasons.push("Scholarships available")
      } else {
        warnings.push("Limited scholarship opportunities")
      }
    }

    // Religious facilities
    if (preferences.religiousFacilities) {
      if (
        specialFeatures.some(
          (feature) =>
            feature.toLowerCase().includes("religious") ||
            feature.toLowerCase().includes("prayer") ||
            feature.toLowerCase().includes("mosque") ||
            feature.toLowerCase().includes("islamic"),
        )
      ) {
        score += 3
        reasons.push("Religious facilities available")
      } else {
        warnings.push("Limited religious facilities")
      }
    }

    // Halal food
    if (preferences.halalFood) {
      if (
        specialFeatures.some(
          (feature) =>
            feature.toLowerCase().includes("halal") ||
            feature.toLowerCase().includes("muslim") ||
            feature.toLowerCase().includes("islamic"),
        )
      ) {
        score += 2
        reasons.push("Halal food options available")
      } else {
        warnings.push("Limited halal food options")
      }
    }

    // Work while studying
    if (preferences.workWhileStudying) {
      if (
        specialFeatures.some(
          (feature) =>
            feature.toLowerCase().includes("work") ||
            feature.toLowerCase().includes("employment") ||
            feature.toLowerCase().includes("part-time"),
        ) ||
        destination.work_permit_available
      ) {
        score += 3
        reasons.push("Work opportunities available")
      } else {
        warnings.push("Limited work opportunities")
      }
    }

    return { score, reasons, warnings }
  }

  private static analyzeAcademicRequirements(destination: any, preferences: DestinationPreferences) {
    let score = 0
    const reasons: string[] = []
    const warnings: string[] = []

    // GPA requirements analysis
    const minGPA = this.safeParseNumber(destination.min_gpa_requirement, 2.5)

    let userGPAEstimate = 2.0
    switch (preferences.currentGPA) {
      case "excellent":
        userGPAEstimate = 3.8
        break
      case "good":
        userGPAEstimate = 3.3
        break
      case "intermediate":
        userGPAEstimate = 2.7
        break
      case "improving":
        userGPAEstimate = 2.2
        break
    }

    if (userGPAEstimate >= minGPA) {
      score += 8
      reasons.push("Meets academic requirements")

      if (userGPAEstimate > minGPA + 0.5) {
        score += 2
        reasons.push("Strong academic profile")
      }
    } else {
      const gap = minGPA - userGPAEstimate
      if (gap <= 0.3) {
        score += 3
        warnings.push("Close to academic requirements")
      } else {
        warnings.push("May not meet academic requirements")
      }
    }

    return { score, reasons, warnings }
  }

  private static calculateEstimatedCosts(destination: any, preferences: DestinationPreferences) {
    const tuitionMin = this.safeParseNumber(destination.bachelor_tuition_min, 0)
    const tuitionMax = this.safeParseNumber(destination.bachelor_tuition_max, 50000)
    const livingMin = this.safeParseNumber(destination.living_cost_min, 400)
    const livingMax = this.safeParseNumber(destination.living_cost_max, 1200)
    const serviceFees = this.safeParseNumber(destination.service_fees, 500)

    // Adjust for study level
    let tuitionMultiplier = 1
    if (preferences.studyLevel === "Master") {
      tuitionMultiplier = 1.2
    } else if (preferences.studyLevel === "PhD") {
      tuitionMultiplier = 0.8 // Often funded
    }

    const adjustedTuitionMin = tuitionMin * tuitionMultiplier
    const adjustedTuitionMax = tuitionMax * tuitionMultiplier
    const estimatedLivingCosts = (livingMin + livingMax) / 2

    return {
      tuitionRange: [adjustedTuitionMin, adjustedTuitionMax] as [number, number],
      livingCosts: estimatedLivingCosts * 12, // Annual
      serviceFees,
      totalEstimate: adjustedTuitionMax + estimatedLivingCosts * 12 + serviceFees,
    }
  }
}








