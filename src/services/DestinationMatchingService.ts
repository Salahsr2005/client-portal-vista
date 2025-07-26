export interface DestinationConsultationData {
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

export class DestinationMatchingService {
  static calculateMatchScore(destination: any, consultationData: DestinationConsultationData) {
    let totalScore = 0
    let maxPossibleScore = 0
    const reasons: string[] = []
    const warnings: string[] = []
    const details: any = {}

    // 1. Study Level match (25% weight)
    const levelWeight = 25
    maxPossibleScore += levelWeight

    const levelPrefix = consultationData.studyLevel?.toLowerCase() || "bachelor"
    const tuitionMinKey = `${levelPrefix}_tuition_min`
    const tuitionMaxKey = `${levelPrefix}_tuition_max`

    if (destination[tuitionMinKey] && destination[tuitionMaxKey]) {
      totalScore += levelWeight
      reasons.push(`${consultationData.studyLevel} programs available`)
    } else {
      warnings.push(`Limited ${consultationData.studyLevel} program information`)
    }

    // 2. Country Preference match (20% weight)
    const countryWeight = 20
    maxPossibleScore += countryWeight

    if (!consultationData.preferredCountry || consultationData.preferredCountry === "") {
      // No preference specified, give partial score
      totalScore += countryWeight * 0.8
      reasons.push("Open to any destination")
    } else if (destination.country === consultationData.preferredCountry) {
      totalScore += countryWeight
      reasons.push(`Perfect match for ${consultationData.preferredCountry}`)
    } else {
      warnings.push(`Located in ${destination.country}, you preferred ${consultationData.preferredCountry}`)
    }

    // 3. Budget Analysis (30% weight)
    const budgetWeight = 30
    maxPossibleScore += budgetWeight

    const tuitionMin = destination[tuitionMinKey] || 0
    const tuitionMax = destination[tuitionMaxKey] || 0
    const serviceFee = destination.service_fee || 0
    const applicationFee = destination.application_fee || 0
    const visaFee = destination.visa_processing_fee || 0
    const totalFees = serviceFee + applicationFee + visaFee

    const totalMinCost = tuitionMin + (consultationData.livingCostsBudget || 0) + totalFees
    const totalMaxCost = tuitionMax + (consultationData.livingCostsBudget || 0) + totalFees

    details.costs = {
      tuitionRange: [tuitionMin, tuitionMax],
      totalFees,
      totalRange: [totalMinCost, totalMaxCost],
    }

    if (consultationData.totalBudget >= totalMaxCost) {
      totalScore += budgetWeight
      reasons.push(`Comfortably within budget`)
    } else if (consultationData.totalBudget >= totalMinCost) {
      const budgetRatio = (consultationData.totalBudget - totalMinCost) / (totalMaxCost - totalMinCost)
      totalScore += budgetWeight * (0.5 + budgetRatio * 0.5)
      reasons.push(`Within budget range`)
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
        warnings.push(`Budget shortfall but within flexibility range`)
      } else {
        warnings.push(`May exceed budget`)
      }
    }

    // 4. Language Requirements (15% weight)
    const languageWeight = 15
    maxPossibleScore += languageWeight

    const userLanguage = consultationData.language?.toLowerCase() || ""
    const destinationLanguages = destination.languages_spoken?.map((l: string) => l.toLowerCase()) || []

    if (
      userLanguage === "any" ||
      destinationLanguages.includes(userLanguage) ||
      destinationLanguages.includes("english")
    ) {
      const proficiencyMultiplier =
        {
          native: 1.0,
          advanced: 0.9,
          intermediate: 0.8,
          beginner: 0.6,
        }[consultationData.languageLevel] || 0.8

      totalScore += languageWeight * proficiencyMultiplier
      reasons.push(`Language compatible`)
    } else {
      warnings.push("Language requirements may not match")
    }

    // 5. Special Requirements (10% weight)
    const specialWeight = 10
    maxPossibleScore += specialWeight

    let specialScore = 0
    if (consultationData.scholarshipRequired && destination.scholarship_opportunities) {
      specialScore += 4
      reasons.push("Scholarship opportunities available")
    }
    if (consultationData.religiousFacilities && destination.religious_facilities) {
      specialScore += 3
      reasons.push("Religious facilities available")
    }
    if (consultationData.halalFood && destination.halal_food_availability) {
      specialScore += 3
      reasons.push("Halal food available")
    }

    totalScore += Math.min(specialWeight, specialScore)

    // Calculate final percentage score
    const finalScore = Math.min(100, Math.round((totalScore / maxPossibleScore) * 100))

    return {
      score: finalScore,
      reasons,
      warnings,
      details,
      recommendation:
        finalScore >= 80
          ? "highly_recommended"
          : finalScore >= 65
            ? "recommended"
            : finalScore >= 45
              ? "consider"
              : "not_recommended",
    }
  }

  // Enhanced search functionality for destinations
  static searchDestinations(destinations: any[], searchQuery: string, language: "en" | "fr" = "en") {
    if (!searchQuery.trim()) return destinations

    const query = searchQuery.toLowerCase().trim()

    return destinations.filter((destination) => {
      // 1. Country name match
      if (destination.country && destination.country.toLowerCase().includes(query)) {
        return true
      }

      // 2. Destination name match
      if (destination.name && destination.name.toLowerCase().includes(query)) {
        return true
      }

      // 3. City match
      if (destination.city && destination.city.toLowerCase().includes(query)) {
        return true
      }

      // 4. Languages spoken match
      if (destination.languages_spoken && Array.isArray(destination.languages_spoken)) {
        const languageMatch = destination.languages_spoken.some(
          (lang: string) => lang.toLowerCase().includes(query) || query.includes(lang.toLowerCase()),
        )
        if (languageMatch) return true
      }

      return false
    })
  }

  // Sort destinations by relevance
  static sortDestinationsByRelevance(destinations: any[], consultationData: DestinationConsultationData) {
    return destinations
      .map((destination) => ({
        ...destination,
        matchResult: this.calculateMatchScore(destination, consultationData),
      }))
      .sort((a, b) => {
        // Primary sort: Country preference match
        const aCountryMatch = !consultationData.preferredCountry || a.country === consultationData.preferredCountry
        const bCountryMatch = !consultationData.preferredCountry || b.country === consultationData.preferredCountry

        if (aCountryMatch !== bCountryMatch) {
          return bCountryMatch ? 1 : -1
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

        // Final sort: Alphabetical by country name
        return a.country.localeCompare(b.country)
      })
  }
}
