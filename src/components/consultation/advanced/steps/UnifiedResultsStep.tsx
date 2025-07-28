"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/integrations/supabase/client"
import {
  Trophy,
  MapPin,
  Globe,
  Heart,
  ChevronRight,
  Search,
  BookOpen,
  GraduationCap,
  AlertTriangle,
  Target,
  DollarSign,
  Clock,
  Star,
} from "lucide-react"

interface UnifiedResultsStepProps {
  data: any
  updateData: (data: any) => void
  onValidation: (isValid: boolean) => void
}

interface MatchedItem {
  id: string
  name: string
  type: "program" | "destination"
  university?: string
  country: string
  city?: string
  match_percentage: number
  tuition_min?: number
  tuition_max?: number
  living_cost_min?: number
  living_cost_max?: number
  service_fee?: number
  application_fee?: number
  visa_processing_fee?: number
  program_language?: string
  language_requirements?: string
  scholarship_available?: boolean
  religious_facilities?: boolean
  halal_food_availability?: boolean
  description?: string
  image_url?: string
  logo_url?: string
  cover_image_url?: string
  processing_time?: string
  available_programs?: string[]
  intake_periods?: string[]
  field?: string
  study_level?: string
  duration_months?: number
  admission_success_rate?: number
  visa_success_rate?: number
  bachelor_tuition_min?: number
  bachelor_tuition_max?: number
  master_tuition_min?: number
  master_tuition_max?: number
  phd_tuition_min?: number
  phd_tuition_max?: number
}

export function UnifiedResultsStep({ data, updateData, onValidation }: UnifiedResultsStepProps) {
  const [matchedItems, setMatchedItems] = useState<MatchedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "programs" | "destinations">("all")

  useEffect(() => {
    onValidation(true)
    fetchMatchedItems()
  }, [onValidation])

  const fetchMatchedItems = async () => {
    try {
      setLoading(true)
      setError(null)

      let allMatches: MatchedItem[] = []

      // Fetch Programs if consultation type is programs
      if (data.consultationType === "programs") {
        // Start with a base query - get all active programs first
        const query = supabase.from("programs").select("*").eq("status", "Active")

        console.log("Fetching programs with consultation data:", data)

        const { data: programs, error: programsError } = await query.limit(50)

        if (programsError) {
          console.error("Programs error:", programsError)
          setError("Failed to load programs: " + programsError.message)
        } else if (programs) {
          console.log(`Found ${programs.length} active programs`)

          // Calculate match for each program and filter client-side
          const programMatches = programs
            .map((program: any) => ({
              ...program,
              type: "program" as const,
              match_percentage: calculateProgramMatch(program, data),
            }))
            .filter((program) => {
              // Apply hard filters
              let passes = true

              // Study level filter (strict)
              if (data.level && program.study_level) {
                passes = passes && program.study_level.toLowerCase() === data.level.toLowerCase()
              }

              // Language filter (if specified)
              if (data.language && program.program_language) {
                passes = passes && program.program_language.toLowerCase().includes(data.language.toLowerCase())
              }

              // Budget filter (allow some flexibility)
              if (data.totalBudget > 0 && program.tuition_min) {
                const totalCost = program.tuition_min + (program.living_cost_min || 0) * 12
                const budgetMultiplier =
                  data.budgetFlexibility === "strict" ? 1 : data.budgetFlexibility === "flexible" ? 1.2 : 1.5
                passes = passes && totalCost <= data.totalBudget * budgetMultiplier
              }

              // Only include programs with minimum match percentage
              passes = passes && program.match_percentage >= 30

              return passes
            })
            .sort((a, b) => b.match_percentage - a.match_percentage)

          console.log(`After filtering: ${programMatches.length} programs match criteria`)
          allMatches = [...allMatches, ...programMatches]
        }
      }

      // Fetch Destinations if consultation type is destinations
      if (data.consultationType === "destinations") {
        console.log("Fetching destinations from Supabase...")
        const { data: destinations, error: destinationsError } = await supabase
          .from("destinations")
          .select("*")
          .eq("status", "Active")
          .limit(50)

        if (destinationsError) {
          console.error("Destinations error:", destinationsError)
          setError("Failed to load destinations: " + destinationsError.message)
        } else if (destinations) {
          console.log("Fetched destinations:", destinations)
          console.log("Starting destination analysis...")

          if (!destinations || destinations.length === 0) {
            console.log("No destinations data available for matching")
            setMatchedItems([])
            return
          }

          // Convert consultation data to preferences format for DestinationMatchingService
          const preferences = {
            studyLevel: data.level || "Bachelor",
            userLanguage: "fr" as const,
            tuitionBudgetRange: [0, data.totalBudget || 50000] as [number, number],
            livingCostsBudgetRange: [8000, 15000] as [number, number],
            serviceFeesBudgetRange: [0, 5000] as [number, number],
            budgetFlexibility: data.budgetFlexibility || ("flexible" as "strict" | "flexible" | "very_flexible"),
            currentGPA: "intermediate" as "low" | "intermediate" | "high",
            previousEducationCountry: "Morocco",
            preferredLanguages: data.language ? [data.language] : ["French", "English"],
            languageLevel: "intermediate" as "beginner" | "intermediate" | "advanced" | "native",
            hasLanguageCertificate: false,
            intakePeriods: data.intakePeriod ? [data.intakePeriod] : ["Any"],
            urgency: "flexible" as "asap" | "flexible" | "planning_ahead",
            workWhileStudying: false,
            scholarshipRequired: data.scholarshipRequired || false,
            religiousFacilities: data.religiousFacilities || false,
            halalFood: data.halalFood || false,
            priorityFactors: data.priorities || ["quality_education"],
            preferredRegions: data.countryPreference || [],
            avoidRegions: [],
          }

          console.log("Using preferences for matching:", preferences)

          // Use the enhanced DestinationMatchingService
          const { DestinationMatchingService } = await import("@/services/DestinationMatchingService")
          const matchResults = DestinationMatchingService.findBestDestinations(destinations, preferences)

          console.log("Found matches:", matchResults.length)

          // Convert match results to MatchedItem format
          const destinationMatches = matchResults.map((result) => ({
            ...result.destination,
            type: "destination" as const,
            match_percentage: result.score,
            reasons: result.reasons,
            warnings: result.warnings,
            budgetAnalysis: result.budgetAnalysis,
            requirements: result.requirements,
          }))

          console.log(`After processing: ${destinationMatches.length} destinations match criteria`)
          allMatches = [...allMatches, ...destinationMatches]
        }
      }

      setMatchedItems(allMatches)
    } catch (err) {
      console.error("Error fetching matches:", err)
      setError("Failed to load matches. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const calculateProgramMatch = (program: any, preferences: any): number => {
    let score = 0
    let maxPossibleScore = 0

    console.log(`Calculating match for program: ${program.name}`)
    console.log("Program data:", program)
    console.log("Preferences:", preferences)

    // Study level match (30 points - most important)
    maxPossibleScore += 30
    if (program.study_level && preferences.level) {
      if (program.study_level.toLowerCase() === preferences.level.toLowerCase()) {
        score += 30
        console.log("✓ Study level match: +30")
      } else {
        console.log("✗ Study level mismatch:", program.study_level, "vs", preferences.level)
      }
    }

    // Field/Program name match (25 points)
    maxPossibleScore += 25
    if (preferences.field && preferences.fieldKeywords) {
      const programName = (program.name || "").toLowerCase()
      const programField = (program.field || "").toLowerCase()
      const description = (program.description || "").toLowerCase()
      const searchText = `${programName} ${programField} ${description}`

      const fieldLower = preferences.field.toLowerCase()
      let fieldMatch = false

      // Direct field match
      if (programField.includes(fieldLower) || programName.includes(fieldLower)) {
        fieldMatch = true
        score += 25
        console.log("✓ Direct field match: +25")
      }
      // Keyword match
      else if (preferences.fieldKeywords.some((keyword: string) => searchText.includes(keyword.toLowerCase()))) {
        fieldMatch = true
        score += 20
        console.log("✓ Keyword field match: +20")
      }
      // Partial match
      else if (
        preferences.fieldKeywords.some(
          (keyword: string) => keyword.length > 4 && searchText.includes(keyword.toLowerCase()),
        )
      ) {
        fieldMatch = true
        score += 15
        console.log("✓ Partial field match: +15")
      }

      if (!fieldMatch) {
        console.log("✗ No field match found")
      }
    }

    // Language match (20 points)
    maxPossibleScore += 20
    if (preferences.language && program.program_language) {
      const programLang = program.program_language.toLowerCase()
      const prefLang = preferences.language.toLowerCase()

      if (programLang === prefLang || programLang.includes(prefLang)) {
        score += 20
        console.log("✓ Language match: +20")
      } else {
        console.log("✗ Language mismatch:", program.program_language, "vs", preferences.language)
      }
    }

    // Budget compatibility (15 points)
    maxPossibleScore += 15
    if (preferences.totalBudget > 0 && program.tuition_min) {
      const tuitionCost = program.tuition_min || 0
      const livingCost = (program.living_cost_min || 0) * 12
      const totalCost = tuitionCost + livingCost

      console.log("Budget check:", {
        totalBudget: preferences.totalBudget,
        tuitionCost,
        livingCost,
        totalCost,
        flexibility: preferences.budgetFlexibility,
      })

      if (preferences.totalBudget >= totalCost) {
        score += 15
        console.log("✓ Perfect budget fit: +15")
      } else if (preferences.totalBudget >= totalCost * 0.8) {
        score += 12
        console.log("✓ Good budget fit: +12")
      } else if (preferences.totalBudget >= totalCost * 0.6) {
        score += 8
        console.log("✓ Acceptable budget fit: +8")
      } else {
        console.log("✗ Budget too high")
      }
    }

    // Special requirements bonus (10 points total)
    let specialScore = 0
    const maxSpecialScore = 10

    // Scholarship requirement
    if (preferences.scholarshipRequired) {
      if (program.scholarship_available) {
        specialScore += 5
        console.log("✓ Scholarship available: +5")
      } else {
        console.log("✗ Scholarship required but not available")
      }
    } else {
      specialScore += 2 // Small bonus for not requiring scholarship
    }

    // Religious facilities
    if (preferences.religiousFacilities) {
      if (program.religious_facilities) {
        specialScore += 3
        console.log("✓ Religious facilities available: +3")
      }
    } else {
      specialScore += 1
    }

    // Halal food
    if (preferences.halalFood) {
      if (program.halal_food_availability) {
        specialScore += 2
        console.log("✓ Halal food available: +2")
      }
    } else {
      specialScore += 1
    }

    score += Math.min(specialScore, maxSpecialScore)
    maxPossibleScore += maxSpecialScore

    // Calculate final percentage
    const finalScore = maxPossibleScore > 0 ? Math.round((score / maxPossibleScore) * 100) : 0

    console.log(`Final score: ${score}/${maxPossibleScore} = ${finalScore}%`)
    console.log("---")

    return Math.min(100, Math.max(0, finalScore))
  }

  const calculateDestinationMatch = (destination: any, preferences: any): number => {
    let score = 0
    let maxPossibleScore = 0

    // Study level availability (25 points)
    maxPossibleScore += 25
    if (destination.available_programs && preferences.level) {
      const availablePrograms = Array.isArray(destination.available_programs)
        ? destination.available_programs
        : destination.available_programs.split(",").map((p: string) => p.trim())

      if (availablePrograms.some((prog: string) => prog.toLowerCase().includes(preferences.level.toLowerCase()))) {
        score += 25
      }
    }

    // Language compatibility (20 points)
    maxPossibleScore += 20
    if (destination.language_requirements && preferences.language) {
      if (destination.language_requirements.toLowerCase().includes(preferences.language.toLowerCase())) {
        score += 20
      }
    }

    // Budget compatibility (25 points)
    maxPossibleScore += 25
    if (preferences.totalBudget > 0 && preferences.level) {
      const levelKey = `${preferences.level.toLowerCase()}_tuition_min`
      const tuitionMin = destination[levelKey] || 0
      const totalCost =
        tuitionMin +
        (destination.service_fee || 0) +
        (destination.application_fee || 0) +
        (destination.visa_processing_fee || 0)

      if (preferences.totalBudget >= totalCost) {
        score += 25
      } else if (preferences.totalBudget >= totalCost * 0.8) {
        score += 20
      } else if (preferences.totalBudget >= totalCost * 0.6) {
        score += 15
      }
    }

    // Country preference (15 points)
    maxPossibleScore += 15
    if (!preferences.countryPreference || preferences.countryPreference.length === 0) {
      score += 10 // No specific preference
    } else if (preferences.countryPreference.includes(destination.country)) {
      score += 15
    }

    // Success rates (15 points)
    maxPossibleScore += 15
    const admissionRate = destination.admission_success_rate || 0
    const visaRate = destination.visa_success_rate || 0
    const avgSuccessRate = (admissionRate + visaRate) / 2
    score += Math.round((avgSuccessRate / 100) * 15)

    const finalScore = maxPossibleScore > 0 ? Math.round((score / maxPossibleScore) * 100) : 0
    return Math.min(100, Math.max(0, finalScore))
  }

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400"
    if (percentage >= 60) return "text-blue-600 dark:text-blue-400"
    if (percentage >= 40) return "text-yellow-600 dark:text-yellow-400"
    return "text-orange-600 dark:text-orange-400"
  }

  const getMatchBadgeColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200"
    if (percentage >= 60) return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200"
    if (percentage >= 40)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200"
    return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 border-orange-200"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const filteredItems = matchedItems.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "programs") return item.type === "program"
    if (activeTab === "destinations") return item.type === "destination"
    return true
  })

  const programsCount = matchedItems.filter((item) => item.type === "program").length
  const destinationsCount = matchedItems.filter((item) => item.type === "destination").length

  if (loading) {
    return (
      <div className="text-center py-12 sm:py-16 px-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </motion.div>
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          Finding Your Perfect Matches
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-md mx-auto">
          Our AI is analyzing{" "}
          {data.consultationType === "programs"
            ? "study programs"
            : data.consultationType === "destinations"
              ? "study destinations"
              : "programs and destinations"}{" "}
          to find the best fits for you...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 sm:py-16 px-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          Oops! Something went wrong
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">{error}</p>
        <Button onClick={fetchMatchedItems} className="bg-blue-600 hover:bg-blue-700">
          Try Again
        </Button>
      </div>
    )
  }

  if (matchedItems.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 px-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
          <Search className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          No Perfect Matches Found
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
          We couldn't find{" "}
          {data.consultationType === "programs"
            ? "programs"
            : data.consultationType === "destinations"
              ? "destinations"
              : "items"}{" "}
          that exactly match your requirements. Try adjusting your preferences for more results.
        </p>
        <div className="space-y-3">
          <Button variant="outline" onClick={() => window.history.back()}>
            Adjust Preferences
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              // Reset some filters and try again
              updateData({ budgetFlexibility: "very_flexible" })
              fetchMatchedItems()
            }}
          >
            Show More Flexible Results
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
        >
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Your Perfect Matches!
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          We found {matchedItems.length}{" "}
          {data.consultationType === "programs"
            ? "programs"
            : data.consultationType === "destinations"
              ? "destinations"
              : "options"}{" "}
          that match your preferences
        </p>
      </div>

      {/* Match Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 mx-4">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                {matchedItems.length}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Total Matches</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                {matchedItems.filter((item) => item.match_percentage >= 80).length}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Excellent Matches</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
                {matchedItems.filter((item) => item.scholarship_available).length}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">With Scholarships</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">
                {new Set(matchedItems.map((item) => item.country)).size}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Countries</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for filtering */}
      <div className="px-4">
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 h-auto p-1">
            <TabsTrigger
              value="all"
              className="flex items-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-4 text-xs sm:text-sm"
            >
              <Target className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>All ({matchedItems.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="programs"
              className="flex items-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-4 text-xs sm:text-sm"
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Programs ({programsCount})</span>
            </TabsTrigger>
            <TabsTrigger
              value="destinations"
              className="flex items-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-4 text-xs sm:text-sm"
            >
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Destinations ({destinationsCount})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 sm:space-y-6 mt-6 sm:mt-8">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-slate-200 dark:border-slate-700">
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 w-full sm:w-auto">
                          <div
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-cover bg-center flex-shrink-0 border-2 border-slate-200 dark:border-slate-700"
                            style={{
                              backgroundImage: `url(${item.logo_url || item.cover_image_url || item.image_url || "/placeholder.svg?height=80&width=80"})`,
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                                {item.name}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge className={`${getMatchBadgeColor(item.match_percentage)} border text-xs`}>
                                  {Math.round(item.match_percentage)}% Match
                                </Badge>
                                <Badge variant="outline" className="capitalize text-xs">
                                  {item.type}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-slate-600 dark:text-slate-400 text-sm">
                              {item.university && (
                                <div className="flex items-center space-x-1">
                                  <GraduationCap className="w-4 h-4 flex-shrink-0" />
                                  <span className="truncate">{item.university}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">
                                  {item.city ? `${item.city}, ` : ""}
                                  {item.country}
                                </span>
                              </div>
                              {(item.program_language || item.language_requirements) && (
                                <div className="flex items-center space-x-1">
                                  <Globe className="w-4 h-4 flex-shrink-0" />
                                  <span className="truncate">
                                    {item.program_language || item.language_requirements}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right w-full sm:w-auto">
                          <div
                            className={`text-2xl sm:text-3xl font-bold ${getMatchColor(item.match_percentage)} mb-2`}
                          >
                            {Math.round(item.match_percentage)}%
                          </div>
                          <Progress value={item.match_percentage} className="w-full sm:w-24 h-2 sm:h-3" />
                        </div>
                      </div>

                      {item.description && (
                        <p className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 line-clamp-2 text-sm sm:text-base">
                          {item.description}
                        </p>
                      )}

                      {/* Cost Information */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 text-sm mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        {item.type === "program" ? (
                          <>
                            <div>
                              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                Tuition:
                              </span>
                              <p className="text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                                {formatCurrency(item.tuition_min || 0)} - {formatCurrency(item.tuition_max || 0)}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                Living Costs:
                              </span>
                              <p className="text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                                {formatCurrency((item.living_cost_min || 0) * 12)} -{" "}
                                {formatCurrency((item.living_cost_max || 0) * 12)}/year
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Duration:
                              </span>
                              <p className="text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                                {item.duration_months ? `${Math.floor(item.duration_months / 12)} years` : "N/A"}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                Tuition Range:
                              </span>
                              <p className="text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                                {formatCurrency(item[`${data.level?.toLowerCase()}_tuition_min`] || 0)} -{" "}
                                {formatCurrency(item[`${data.level?.toLowerCase()}_tuition_max`] || 0)}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                                <Star className="w-4 h-4 mr-1" />
                                Service Fee:
                              </span>
                              <p className="text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                                {formatCurrency(item.service_fee || 0)}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Processing:
                              </span>
                              <p className="text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                                {item.processing_time || "N/A"}
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                        {item.scholarship_available && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 text-xs"
                          >
                            <Trophy className="w-3 h-3 mr-1" />
                            Scholarship
                          </Badge>
                        )}
                        {item.religious_facilities && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 text-xs"
                          >
                            Religious Facilities
                          </Badge>
                        )}
                        {item.halal_food_availability && (
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 text-xs"
                          >
                            Halal Food
                          </Badge>
                        )}
                        {item.type === "destination" && item.available_programs && (
                          <Badge
                            variant="outline"
                            className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 text-xs"
                          >
                            {Array.isArray(item.available_programs)
                              ? item.available_programs.join(", ")
                              : item.available_programs}
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row justify-between items-center pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700 space-y-3 sm:space-y-0">
                        <div className="flex space-x-3 w-full sm:w-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1 bg-transparent flex-1 sm:flex-none"
                          >
                            <Heart className="w-4 h-4" />
                            <span>Save</span>
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                            Compare
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-1 w-full sm:w-auto"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>

      <div className="text-center pt-6 sm:pt-8 px-4">
        <Button
          size="lg"
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
        >
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          Apply to Selected{" "}
          {data.consultationType === "programs"
            ? "Programs"
            : data.consultationType === "destinations"
              ? "Destinations"
              : "Options"}
        </Button>
      </div>
    </div>
  )
}


