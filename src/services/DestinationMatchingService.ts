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
    let totalScore = 0
    const reasons: string[] = []
    const warnings: string[] = []
    const maxScore = 100

    console.log(`🎯 Analyzing destination: ${destination.name}`)

    // Parse destination data safely
    const availablePrograms = this.parseJsonField(destination.available_programs, [])
    const programLanguages = this.parseJsonField(destination.program_languages, [])
    const intakePeriods = this.parseJsonField(destination.intake_periods, [])
    const specialFeatures = this.parseJsonField(destination.special_features, [])

    // 1. Study Level Match (25 points) - More weight for exact matches
    const levelScore = this.analyzeLevelMatch(availablePrograms, preferences.studyLevel)
    totalScore += levelScore.score
    reasons.push(...levelScore.reasons)
    warnings.push(...levelScore.warnings)

    // 2. Budget Compatibility (30 points) - Most important factor
    const budgetScore = this.analyzeBudgetCompatibility(destination, preferences)
    totalScore += budgetScore.score
    reasons.push(...budgetScore.reasons)
    warnings.push(...budgetScore.warnings)

    // 3. Language Match (20 points) - Critical for success
    const languageScore = this.analyzeLanguageCompatibility(programLanguages, preferences)
    totalScore += languageScore.score
    reasons.push(...languageScore.reasons)
    warnings.push(...languageScore.warnings)

    // 4. Academic Requirements (15 points) - Updated for /20 scale
    const academicScore = this.analyzeAcademicFit(destination, preferences)
    totalScore += academicScore.score
    reasons.push(...academicScore.reasons)
    warnings.push(...academicScore.warnings)

    // 5. Timeline & Special Requirements (10 points)
    const timelineScore = this.analyzeTimelineAndSpecial(intakePeriods, specialFeatures, destination, preferences)
    totalScore += timelineScore.score
    reasons.push(...timelineScore.reasons)
    warnings.push(...timelineScore.warnings)

    // Calculate estimated costs
    const estimatedCosts = this.calculateEstimatedCosts(destination, preferences)

    const finalScore = Math.min(Math.round(totalScore), maxScore)

    console.log(`📊 ${destination.name} final score: ${finalScore}% (${totalScore} raw)`)
    console.log(`   Reasons: ${reasons.length}, Warnings: ${warnings.length}`)

    return {
      destination,
      score: finalScore,
      reasons: reasons.filter(Boolean),
      warnings: warnings.filter(Boolean),
      estimatedCosts,
    }
  }

  private static analyzeLevelMatch(availablePrograms: string[], studyLevel: string) {
    let score = 0
    const reasons: string[] = []
    const warnings: string[] = []

    const levelLower = studyLevel.toLowerCase()

    if (availablePrograms.length === 0) {
      // No specific program data - neutral score
      score = 15
      warnings.push("Program availability to be confirmed")
      return { score, reasons, warnings }
    }

    // Check for exact matches
    const exactMatch = availablePrograms.some(
      (program) => program.toLowerCase().includes(levelLower) || levelLower.includes(program.toLowerCase()),
    )

    if (exactMatch) {
      score = 25
      reasons.push(`${studyLevel} programs confirmed available`)
    } else {
      // Check for related programs
      const relatedMatch = availablePrograms.some((program) => {
        const programLower = program.toLowerCase()
        return (
          (levelLower === "bachelor" && (programLower.includes("undergraduate") || programLower.includes("licence"))) ||
          (levelLower === "master" && (programLower.includes("graduate") || programLower.includes("masters"))) ||
          (levelLower === "phd" && (programLower.includes("doctoral") || programLower.includes("doctorate")))
        )
      })

      if (relatedMatch) {
        score = 20
        reasons.push(`Related ${studyLevel} programs available`)
      } else {
        score = 5
        warnings.push(`Limited ${studyLevel} program options`)
      }
    }

    return { score, reasons, warnings }
  }

  private static analyzeBudgetCompatibility(destination: any, preferences: DestinationPreferences) {
    let score = 0
    const reasons: string[] = []
    const warnings: string[] = []

    const studyLevel = preferences.studyLevel.toLowerCase()
    const [userTuitionMin, userTuitionMax] = preferences.tuitionBudgetRange
    const [userLivingMin, userLivingMax] = preferences.livingCostsBudgetRange
    const [userServiceMin, userServiceMax] = preferences.serviceFeesBudgetRange

    // Get tuition costs based on study level
    let tuitionMin = 0
    let tuitionMax = 0

    switch (studyLevel) {
      case "bachelor":
        tuitionMin = this.safeParseNumber(destination.bachelor_tuition_min, 0)
        tuitionMax = this.safeParseNumber(destination.bachelor_tuition_max, 0)
        break
      case "master":
        tuitionMin = this.safeParseNumber(destination.master_tuition_min, 0)
        tuitionMax = this.safeParseNumber(destination.master_tuition_max, 0)
        break
      case "phd":
        tuitionMin = this.safeParseNumber(destination.phd_tuition_min, 0)
        tuitionMax = this.safeParseNumber(destination.phd_tuition_max, 0)
        break
    }

    // Fallback to general fees if no specific data
    if (tuitionMin === 0 && tuitionMax === 0) {
      const generalFees = this.safeParseNumber(destination.fees, 0)
      if (generalFees > 0) {
        tuitionMin = Math.round(generalFees * 0.8)
        tuitionMax = Math.round(generalFees * 1.2)
      }
    }

    // Tuition budget analysis (20 points)
    if (tuitionMin > 0 || tuitionMax > 0) {
      const flexibilityMultiplier = {
        strict: 1.0,
        flexible: 1.15,
        very_flexible: 1.3,
      }[preferences.budgetFlexibility]

      const adjustedUserMax = userTuitionMax * flexibilityMultiplier

      if (tuitionMax <= userTuitionMax) {
        score += 20
        reasons.push(`Tuition (€${tuitionMin}-€${tuitionMax}) fits your budget`)
      } else if (tuitionMax <= adjustedUserMax) {
        score += 15
        reasons.push(`Tuition manageable with ${preferences.budgetFlexibility} budget`)
      } else if (tuitionMin <= userTuitionMax) {
        score += 10
        warnings.push("Some programs may exceed tuition budget")
      } else {
        score += 3
        warnings.push("Tuition likely exceeds budget")
      }
    } else {
      score += 10
      warnings.push("Tuition information not available")
    }

    // Living costs analysis (7 points)
    const livingMin = this.safeParseNumber(destination.living_cost_min, 0)
    const livingMax = this.safeParseNumber(destination.living_cost_max, 0)

    if (livingMax > 0) {
      if (livingMax <= userLivingMax) {
        score += 7
        reasons.push("Living costs within budget")
      } else if (livingMin <= userLivingMax) {
        score += 4
        warnings.push("Living costs may be higher than expected")
      } else {
        score += 1
        warnings.push("Living costs above budget")
      }
    } else {
      score += 3
      warnings.push("Living cost information not available")
    }

    // Service fees analysis (3 points)
    const serviceFees = this.safeParseNumber(destination.service_fees, 500)
    if (serviceFees <= userServiceMax) {
      score += 3
      reasons.push("Service fees reasonable")
    } else {
      score += 1
      warnings.push("Service fees above preferred range")
    }

    return { score, reasons, warnings }
  }

  private static analyzeLanguageCompatibility(programLanguages: string[], preferences: DestinationPreferences) {
    let score = 0
    const reasons: string[] = []
    const warnings: string[] = []

    if (programLanguages.length === 0) {
      score = 10
      warnings.push("Language requirements to be confirmed")
      return { score, reasons, warnings }
    }

    // Check for direct language matches
    let hasMatch = false
    const matchingLanguages: string[] = []

    for (const userLang of preferences.preferredLanguages) {
      for (const progLang of programLanguages) {
        const userLangLower = userLang.toLowerCase()
        const progLangLower = progLang.toLowerCase()

        if (
          progLangLower.includes(userLangLower) ||
          userLangLower.includes(progLangLower) ||
          (userLangLower === "english" && progLangLower.includes("eng")) ||
          (userLangLower === "french" && (progLangLower.includes("français") || progLangLower.includes("french"))) ||
          (userLangLower === "dutch" && (progLangLower.includes("nederlands") || progLangLower.includes("dutch")))
        ) {
          hasMatch = true
          if (!matchingLanguages.includes(progLang)) {
            matchingLanguages.push(progLang)
          }
        }
      }
    }

    if (hasMatch) {
      score = 20
      reasons.push(`Programs available in ${matchingLanguages.join(", ")}`)

      // Language proficiency bonus
      if (preferences.languageLevel === "advanced") {
        score += 2
        reasons.push("Advanced language skills advantage")
      } else if (preferences.languageLevel === "intermediate") {
        score += 1
      } else {
        warnings.push("May need language preparation")
      }

      // Certificate bonus
      if (preferences.hasLanguageCertificate) {
        score += 1
        reasons.push("Language certification helps")
      }
    } else {
      // Check if English is available as fallback
      const hasEnglish = programLanguages.some(
        (lang) => lang.toLowerCase().includes("english") || lang.toLowerCase().includes("eng"),
      )

      if (hasEnglish && !preferences.preferredLanguages.includes("English")) {
        score = 8
        warnings.push("Programs mainly available in English")
      } else {
        score = 3
        warnings.push("Limited programs in your preferred languages")
      }
    }

    return { score, reasons, warnings }
  }

  private static analyzeAcademicFit(destination: any, preferences: DestinationPreferences) {
    let score = 0
    const reasons: string[] = []
    const warnings: string[] = []

    // Convert /20 GPA to approximate /4 scale for comparison
    let userGPAOn4Scale = 2.0
    switch (preferences.currentGPA) {
      case "excellent": // 16-20/20
        userGPAOn4Scale = 3.7
        break
      case "good": // 14-15/20
        userGPAOn4Scale = 3.2
        break
      case "intermediate": // 12-13/20
        userGPAOn4Scale = 2.8
        break
      case "improving": // 10-11/20
        userGPAOn4Scale = 2.3
        break
    }

    // Get minimum GPA requirement (assuming it's stored in /4 scale)
    const minGPA = this.safeParseNumber(destination.min_gpa_requirement, 2.5)

    if (minGPA > 0) {
      if (userGPAOn4Scale >= minGPA + 0.5) {
        score = 15
        reasons.push("Exceeds academic requirements")
      } else if (userGPAOn4Scale >= minGPA) {
        score = 12
        reasons.push("Meets academic requirements")
      } else if (userGPAOn4Scale >= minGPA - 0.3) {
        score = 8
        warnings.push("Close to minimum academic requirements")
      } else {
        score = 3
        warnings.push("May not meet minimum academic requirements")
      }
    } else {
      // No specific GPA requirement available
      if (preferences.currentGPA === "excellent") {
        score = 12
        reasons.push("Strong academic profile")
      } else if (preferences.currentGPA === "good") {
        score = 10
        reasons.push("Good academic standing")
      } else {
        score = 8
        reasons.push("Academic requirements to be confirmed")
      }
    }

    return { score, reasons, warnings }
  }

  private static analyzeTimelineAndSpecial(
    intakePeriods: string[],
    specialFeatures: string[],
    destination: any,
    preferences: DestinationPreferences,
  ) {
    let score = 0
    const reasons: string[] = []
    const warnings: string[] = []

    // Timeline analysis (5 points)
    if (preferences.intakePeriods.includes("Any")) {
      score += 5
      reasons.push("Flexible with intake timing")
    } else if (intakePeriods.length > 0) {
      const hasMatchingIntake = intakePeriods.some((intake) =>
        preferences.intakePeriods.some(
          (userIntake) =>
            intake.toLowerCase().includes(userIntake.toLowerCase()) ||
            userIntake.toLowerCase().includes(intake.toLowerCase()),
        ),
      )

      if (hasMatchingIntake) {
        score += 5
        reasons.push("Suitable intake periods available")
      } else {
        score += 2
        warnings.push("Limited intake period options")
      }
    } else {
      score += 3
      warnings.push("Intake periods to be confirmed")
    }

    // Special requirements (5 points total)
    let specialScore = 0

    if (preferences.scholarshipRequired) {
      const hasScholarships =
        specialFeatures.some(
          (feature) =>
            feature.toLowerCase().includes("scholarship") ||
            feature.toLowerCase().includes("bourse") ||
            feature.toLowerCase().includes("funding"),
        ) || destination.scholarship_available

      if (hasScholarships) {
        specialScore += 2
        reasons.push("Scholarship opportunities available")
      } else {
        warnings.push("Limited scholarship information")
      }
    }

    if (preferences.workWhileStudying) {
      // EU countries generally allow work
      const euCountries = ["france", "germany", "belgium", "netherlands", "spain", "italy"]
      if (euCountries.includes(destination.country?.toLowerCase())) {
        specialScore += 1
        reasons.push("Work opportunities in EU")
      }
    }

    if (preferences.religiousFacilities || preferences.halalFood) {
      const hasReligiousSupport = specialFeatures.some(
        (feature) =>
          feature.toLowerCase().includes("religious") ||
          feature.toLowerCase().includes("muslim") ||
          feature.toLowerCase().includes("halal") ||
          feature.toLowerCase().includes("islamic"),
      )

      if (hasReligiousSupport) {
        specialScore += 1
        reasons.push("Religious facilities available")
      }
    }

    // Success rate bonus (1 point)
    const successRate = this.safeParseNumber(destination.success_rate || destination.admission_success_rate, 0)
    if (successRate >= 70) {
      specialScore += 1
      reasons.push(`High success rate (${successRate}%)`)
    }

    score += Math.min(specialScore, 5) // Cap at 5 points

    return { score, reasons, warnings }
  }

  private static calculateEstimatedCosts(destination: any, preferences: DestinationPreferences) {
    const studyLevel = preferences.studyLevel.toLowerCase()

    let tuitionMin = 0
    let tuitionMax = 0

    switch (studyLevel) {
      case "bachelor":
        tuitionMin = this.safeParseNumber(destination.bachelor_tuition_min, 0)
        tuitionMax = this.safeParseNumber(destination.bachelor_tuition_max, 0)
        break
      case "master":
        tuitionMin = this.safeParseNumber(destination.master_tuition_min, 0)
        tuitionMax = this.safeParseNumber(destination.master_tuition_max, 0)
        break
      case "phd":
        tuitionMin = this.safeParseNumber(destination.phd_tuition_min, 0)
        tuitionMax = this.safeParseNumber(destination.phd_tuition_max, 0)
        break
    }

    // Fallback to general fees
    if (tuitionMin === 0 && tuitionMax === 0) {
      const generalFees = this.safeParseNumber(destination.fees, 0)
      if (generalFees > 0) {
        tuitionMin = Math.round(generalFees * 0.8)
        tuitionMax = Math.round(generalFees * 1.2)
      } else {
        // Default estimates based on European averages
        switch (studyLevel) {
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
            tuitionMax = 5000
            break
        }
      }
    }

    const livingMin = this.safeParseNumber(destination.living_cost_min, 400)
    const livingMax = this.safeParseNumber(destination.living_cost_max, 1200)
    const estimatedLivingCosts = Math.round((livingMin + livingMax) / 2)

    const serviceFees = this.safeParseNumber(destination.service_fees, 500)

    return {
      tuitionRange: [tuitionMin, tuitionMax] as [number, number],
      livingCosts: estimatedLivingCosts * 12, // Annual
      serviceFees,
      totalEstimate: tuitionMax + estimatedLivingCosts * 12 + serviceFees,
    }
  }
}









