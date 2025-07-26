"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  MapPin,
  Calendar,
  Globe,
  Award,
  Heart,
  ExternalLink,
  Download,
  Star,
  Filter,
  SortAsc,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePrograms } from "@/hooks/usePrograms"
import { useDestinations } from "@/hooks/useDestinations"
import { useToast } from "@/hooks/use-toast"
import { useGuestRestrictions } from "@/components/layout/GuestModeWrapper"
import type { UnifiedConsultationData } from "../UnifiedConsultationFlow"

interface UnifiedResultsStepProps {
  data: UnifiedConsultationData
  updateData: (data: Partial<UnifiedConsultationData>) => void
  onValidation: (isValid: boolean) => void
}

interface MatchedProgram {
  id: string
  name: string
  university: string
  country: string
  city: string
  study_level: string
  field: string
  duration_months: number
  tuition_min: number
  tuition_max: number
  living_cost_min: number
  living_cost_max: number
  program_language: string
  secondary_language?: string
  description?: string
  ranking?: number
  success_rate?: number
  scholarship_available: boolean
  scholarship_amount?: number
  scholarship_details?: string
  admission_requirements?: string
  gpa_requirement?: number
  language_test?: string
  language_test_score?: string
  application_fee?: number
  advantages?: string
  image_url?: string
  field_keywords?: string[]
  religious_facilities?: boolean
  halal_food_availability?: boolean
  matchScore: number
  matchReasons: string[]
}

interface MatchedDestination {
  id: string
  name: string
  country: string
  description?: string
  bachelor_tuition_min?: number
  bachelor_tuition_max?: number
  master_tuition_min?: number
  master_tuition_max?: number
  phd_tuition_min?: number
  phd_tuition_max?: number
  living_cost_min?: number
  living_cost_max?: number
  language_requirements?: string
  intake_periods?: string[]
  service_fee?: number
  application_fee?: number
  image_url?: string
  religious_facilities?: boolean
  halal_food_availability?: boolean
  matchScore: number
  matchReasons: string[]
}

// Safe array helper function
function safeArray<T>(arr: T[] | undefined | null): T[] {
  return Array.isArray(arr) ? arr : []
}

// Safe string helper function
function safeString(str: string | undefined | null): string {
  return typeof str === "string" ? str : ""
}

// Safe number helper function
function safeNumber(num: number | undefined | null): number {
  return typeof num === "number" && !isNaN(num) ? num : 0
}

// Enhanced program matching algorithm
function calculateProgramMatchScore(program: any, consultationData: UnifiedConsultationData): number {
  let score = 0
  const weights = {
    level: 25,
    field: 25,
    language: 15,
    budget: 20,
    country: 5,
    special: 10,
  }

  try {
    // Study level match (25 points)
    const programLevel = safeString(program.study_level).toLowerCase()
    const userLevel = safeString(consultationData.level).toLowerCase()

    if (programLevel === userLevel) {
      score += weights.level
    } else if (programLevel.includes(userLevel) || userLevel.includes(programLevel)) {
      score += weights.level * 0.8
    }

    // Field match (25 points) - Enhanced matching
    const programField = safeString(program.field).toLowerCase()
    const programName = safeString(program.name).toLowerCase()
    const userField = safeString(consultationData.field).toLowerCase()
    const fieldKeywords = safeArray(consultationData.fieldKeywords)
    const programKeywords = safeArray(program.field_keywords)

    if (userField) {
      // Direct field match
      if (programField.includes(userField) || userField.includes(programField)) {
        score += weights.field
      }
      // Program name contains field
      else if (programName.includes(userField)) {
        score += weights.field * 0.9
      }
      // Keyword matching
      else if (fieldKeywords.length > 0) {
        const keywordMatches = fieldKeywords.filter((keyword) => {
          const kw = safeString(keyword).toLowerCase()
          return (
            programField.includes(kw) ||
            programName.includes(kw) ||
            programKeywords.some((pk) => safeString(pk).toLowerCase().includes(kw))
          )
        })

        if (keywordMatches.length > 0) {
          const matchRatio = keywordMatches.length / fieldKeywords.length
          score += weights.field * matchRatio
        }
      }
      // Partial text matching
      else {
        const fieldWords = userField.split(/\s+/)
        const matchingWords = fieldWords.filter(
          (word) => word.length > 3 && (programField.includes(word) || programName.includes(word)),
        )
        if (matchingWords.length > 0) {
          score += weights.field * (matchingWords.length / fieldWords.length) * 0.7
        }
      }
    }

    // Language match (15 points)
    const programLanguage = safeString(program.program_language).toLowerCase()
    const secondaryLanguage = safeString(program.secondary_language).toLowerCase()
    const userLanguage = safeString(consultationData.language).toLowerCase()

    if (userLanguage) {
      if (programLanguage.includes(userLanguage) || userLanguage.includes(programLanguage)) {
        score += weights.language
      } else if (secondaryLanguage.includes(userLanguage) || userLanguage.includes(secondaryLanguage)) {
        score += weights.language * 0.8
      } else if (
        userLanguage === "english" &&
        (programLanguage.includes("english") || secondaryLanguage.includes("english"))
      ) {
        score += weights.language * 0.9
      }
    }

    // Budget match (20 points) - More flexible
    const totalBudget = safeNumber(consultationData.totalBudget)
    const tuitionMin = safeNumber(program.tuition_min)
    const tuitionMax = safeNumber(program.tuition_max)
    const livingCostMin = safeNumber(program.living_cost_min)
    const livingCostMax = safeNumber(program.living_cost_max)

    if (totalBudget > 0 && tuitionMin > 0) {
      const avgTuition = tuitionMax > tuitionMin ? (tuitionMin + tuitionMax) / 2 : tuitionMin
      const avgLivingCost = livingCostMax > livingCostMin ? (livingCostMin + livingCostMax) / 2 : livingCostMin
      const totalCost = avgTuition + avgLivingCost * 12

      const flexibility = consultationData.budgetFlexibility || "flexible"
      let budgetMultiplier = 1.0

      switch (flexibility) {
        case "strict":
          budgetMultiplier = 1.0
          break
        case "flexible":
          budgetMultiplier = 1.2
          break
        case "very_flexible":
          budgetMultiplier = 1.5
          break
      }

      const adjustedBudget = totalBudget * budgetMultiplier

      if (totalCost <= adjustedBudget) {
        const ratio = totalCost / adjustedBudget
        if (ratio <= 0.8) {
          score += weights.budget // Well within budget
        } else if (ratio <= 1.0) {
          score += weights.budget * 0.8 // Within budget
        } else {
          score += weights.budget * 0.5 // Slightly over but acceptable
        }
      }
    } else if (totalBudget === 0) {
      // No budget specified, give partial points
      score += weights.budget * 0.5
    }

    // Country preference (5 points)
    const countryPreference = safeArray(consultationData.countryPreference)
    const programCountry = safeString(program.country).toLowerCase()

    if (countryPreference.length === 0) {
      score += weights.country // No preference, full points
    } else {
      const countryMatch = countryPreference.some(
        (country) =>
          programCountry.includes(safeString(country).toLowerCase()) ||
          safeString(country).toLowerCase().includes(programCountry),
      )
      if (countryMatch) {
        score += weights.country
      }
    }

    // Special requirements (10 points)
    let specialScore = 0
    let specialRequirements = 0

    if (consultationData.scholarshipRequired) {
      specialRequirements++
      if (program.scholarship_available) {
        specialScore++
      }
    }

    if (consultationData.religiousFacilities) {
      specialRequirements++
      if (program.religious_facilities) {
        specialScore++
      }
    }

    if (consultationData.halalFood) {
      specialRequirements++
      if (program.halal_food_availability) {
        specialScore++
      }
    }

    if (specialRequirements > 0) {
      score += weights.special * (specialScore / specialRequirements)
    } else {
      score += weights.special * 0.5 // No special requirements, give partial points
    }
  } catch (error) {
    console.error("Error calculating match score:", error)
    return 0
  }

  return Math.min(100, Math.max(0, Math.round(score)))
}

// Generate detailed match reasons
function generateMatchReasons(program: any, consultationData: UnifiedConsultationData, score: number): string[] {
  const reasons: string[] = []

  try {
    // Level match
    const programLevel = safeString(program.study_level).toLowerCase()
    const userLevel = safeString(consultationData.level).toLowerCase()
    if (programLevel === userLevel) {
      reasons.push(`Perfect match for ${consultationData.level} level studies`)
    }

    // Field match
    const programField = safeString(program.field).toLowerCase()
    const userField = safeString(consultationData.field).toLowerCase()
    if (userField && (programField.includes(userField) || userField.includes(programField))) {
      reasons.push(`Specializes in ${consultationData.field}`)
    }

    // Budget match
    const totalBudget = safeNumber(consultationData.totalBudget)
    const tuitionMin = safeNumber(program.tuition_min)
    if (totalBudget > 0 && tuitionMin > 0) {
      const flexibility = consultationData.budgetFlexibility || "flexible"
      const multiplier = flexibility === "strict" ? 1.0 : flexibility === "flexible" ? 1.2 : 1.5
      if (tuitionMin <= totalBudget * multiplier) {
        reasons.push("Fits within your budget range")
      }
    }

    // Language match
    const programLanguage = safeString(program.program_language).toLowerCase()
    const userLanguage = safeString(consultationData.language).toLowerCase()
    if (userLanguage && programLanguage.includes(userLanguage)) {
      reasons.push(`Taught in ${consultationData.language}`)
    }

    // Special features
    if (program.scholarship_available && consultationData.scholarshipRequired) {
      reasons.push("Scholarship opportunities available")
    }

    if (program.religious_facilities && consultationData.religiousFacilities) {
      reasons.push("Religious facilities available")
    }

    if (program.halal_food_availability && consultationData.halalFood) {
      reasons.push("Halal food options available")
    }

    // University reputation
    if (program.ranking && program.ranking <= 100) {
      reasons.push(`Top-ranked university (#${program.ranking})`)
    }

    // High success rate
    if (program.success_rate && program.success_rate >= 80) {
      reasons.push(`High admission success rate (${program.success_rate}%)`)
    }

    // Default reason if no specific matches
    if (reasons.length === 0) {
      if (score >= 70) {
        reasons.push("Strong overall compatibility with your preferences")
      } else if (score >= 50) {
        reasons.push("Good match based on your criteria")
      } else {
        reasons.push("Meets some of your requirements")
      }
    }
  } catch (error) {
    console.error("Error generating match reasons:", error)
    reasons.push("Basic program compatibility")
  }

  return reasons
}

export function UnifiedResultsStep({ data, updateData, onValidation }: UnifiedResultsStepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("match")
  const [filterBy, setFilterBy] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [matchedPrograms, setMatchedPrograms] = useState<MatchedProgram[]>([])
  const [matchedDestinations, setMatchedDestinations] = useState<MatchedDestination[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const { programs = [], loading: programsLoading } = usePrograms()
  const { destinations = [], loading: destinationsLoading } = useDestinations()
  const { toast } = useToast()
  const { isRestricted, handleRestrictedAction } = useGuestRestrictions()

  useEffect(() => {
    onValidation(true)
  }, [onValidation])

  useEffect(() => {
    if (!programsLoading && !destinationsLoading) {
      if (data.consultationType === "programs" && safeArray(programs).length > 0) {
        processPrograms()
      } else if (data.consultationType === "destinations" && safeArray(destinations).length > 0) {
        processDestinations()
      } else {
        setIsLoading(false)
      }
    }
  }, [programs, destinations, data, programsLoading, destinationsLoading])

  const processPrograms = () => {
    setIsLoading(true)

    try {
      const safePrograms = safeArray(programs)
      console.log("Processing programs:", safePrograms.length, "programs available")
      console.log("Consultation data:", data)

      if (safePrograms.length === 0) {
        setMatchedPrograms([])
        setIsLoading(false)
        return
      }

      // Calculate match scores for all programs
      const scoredPrograms = safePrograms.map((program) => {
        const matchScore = calculateProgramMatchScore(program, data)
        const matchReasons = generateMatchReasons(program, data, matchScore)

        return {
          ...program,
          matchScore,
          matchReasons,
        } as MatchedProgram
      })

      console.log(
        "Scored programs sample:",
        scoredPrograms.slice(0, 3).map((p) => ({
          name: p.name,
          score: p.matchScore,
          reasons: p.matchReasons,
        })),
      )

      // Filter programs with minimum score and sort
      const filteredPrograms = scoredPrograms
        .filter((program) => {
          // More lenient minimum score
          if (program.matchScore < 15) return false

          // Additional filtering based on consultation data
          const levelMatch =
            !data.level ||
            safeString(program.study_level).toLowerCase().includes(safeString(data.level).toLowerCase()) ||
            safeString(data.level).toLowerCase().includes(safeString(program.study_level).toLowerCase())

          return levelMatch
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 50) // Increase limit to show more results

      console.log("Filtered programs:", filteredPrograms.length, "programs match criteria")

      setMatchedPrograms(filteredPrograms)

      // If still no matches, show some programs with basic matching
      if (filteredPrograms.length === 0) {
        console.log("No matches found, showing fallback programs")
        const fallbackPrograms = safePrograms.slice(0, 20).map(
          (program) =>
            ({
              ...program,
              matchScore: 30,
              matchReasons: ["Basic program match - consider reviewing your criteria"],
            }) as MatchedProgram,
        )

        setMatchedPrograms(fallbackPrograms)
      }
    } catch (error) {
      console.error("Error processing programs:", error)
      setMatchedPrograms([])
      toast({
        title: "Processing Error",
        description: "There was an error processing your consultation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const processDestinations = () => {
    setIsLoading(true)

    try {
      const safeDestinations = safeArray(destinations)

      if (safeDestinations.length === 0) {
        setMatchedDestinations([])
        setIsLoading(false)
        return
      }

      // Enhanced destination matching
      const matchedDests = safeDestinations
        .filter((dest) => dest && typeof dest === "object")
        .map((dest) => {
          let matchScore = 50 // Base score
          const matchReasons: string[] = ["Suitable destination for your studies"]

          // Level-specific tuition matching
          const level = safeString(data.level).toLowerCase()
          let tuitionMin = 0
          let tuitionMax = 0

          if (level === "bachelor") {
            tuitionMin = safeNumber(dest.bachelor_tuition_min)
            tuitionMax = safeNumber(dest.bachelor_tuition_max)
          } else if (level === "master") {
            tuitionMin = safeNumber(dest.master_tuition_min)
            tuitionMax = safeNumber(dest.master_tuition_max)
          } else if (level === "phd") {
            tuitionMin = safeNumber(dest.phd_tuition_min)
            tuitionMax = safeNumber(dest.phd_tuition_max)
          }

          // Budget matching
          const totalBudget = safeNumber(data.totalBudget)
          if (totalBudget > 0 && tuitionMin > 0) {
            const avgTuition = tuitionMax > tuitionMin ? (tuitionMin + tuitionMax) / 2 : tuitionMin
            if (avgTuition <= totalBudget) {
              matchScore += 20
              matchReasons.push("Fits within your budget")
            }
          }

          // Language matching
          const userLanguage = safeString(data.language).toLowerCase()
          const destLanguages = safeString(dest.language_requirements).toLowerCase()
          if (userLanguage && destLanguages.includes(userLanguage)) {
            matchScore += 15
            matchReasons.push(`Supports ${data.language} language`)
          }

          // Special requirements
          if (data.religiousFacilities && dest.religious_facilities) {
            matchScore += 10
            matchReasons.push("Religious facilities available")
          }

          if (data.halalFood && dest.halal_food_availability) {
            matchScore += 10
            matchReasons.push("Halal food options available")
          }

          return {
            ...dest,
            matchScore: Math.min(100, matchScore),
            matchReasons,
          } as MatchedDestination
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 20)

      setMatchedDestinations(matchedDests)
    } catch (error) {
      console.error("Error processing destinations:", error)
      setMatchedDestinations([])
      toast({
        title: "Processing Error",
        description: "There was an error processing your consultation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadBrochure = async (program: MatchedProgram) => {
    try {
      toast({
        title: "Brochure Generated",
        description: "Your program brochure is being prepared for download.",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate brochure. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleApply = (item: MatchedProgram | MatchedDestination) => {
    if (handleRestrictedAction("apply")) {
      toast({
        title: "Application Started",
        description: `Starting application process for ${safeString(item.name)}`,
      })
    }
  }

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
  }

  const filteredResults =
    data.consultationType === "programs"
      ? safeArray(matchedPrograms)
          .filter((program) => {
            const searchLower = safeString(searchTerm).toLowerCase()
            const matchesSearch =
              !searchLower ||
              safeString(program.name).toLowerCase().includes(searchLower) ||
              safeString(program.university).toLowerCase().includes(searchLower) ||
              safeString(program.country).toLowerCase().includes(searchLower) ||
              safeString(program.field).toLowerCase().includes(searchLower)

            const matchesFilter =
              filterBy === "all" ||
              (filterBy === "scholarship" && program.scholarship_available) ||
              (filterBy === "high_match" && program.matchScore >= 70) ||
              (filterBy === "budget_friendly" && safeNumber(program.tuition_min) <= safeNumber(data.totalBudget) * 0.8)

            return matchesSearch && matchesFilter
          })
          .sort((a, b) => {
            switch (sortBy) {
              case "match":
                return b.matchScore - a.matchScore
              case "cost":
                return safeNumber(a.tuition_min) - safeNumber(b.tuition_min)
              case "name":
                return safeString(a.name).localeCompare(safeString(b.name))
              case "country":
                return safeString(a.country).localeCompare(safeString(b.country))
              default:
                return b.matchScore - a.matchScore
            }
          })
      : safeArray(matchedDestinations)
          .filter((dest) => {
            const searchLower = safeString(searchTerm).toLowerCase()
            const matchesSearch =
              !searchLower ||
              safeString(dest.name).toLowerCase().includes(searchLower) ||
              safeString(dest.country).toLowerCase().includes(searchLower)

            return matchesSearch
          })
          .sort((a, b) => {
            switch (sortBy) {
              case "match":
                return b.matchScore - a.matchScore
              case "name":
                return safeString(a.name).localeCompare(safeString(b.name))
              case "country":
                return safeString(a.country).localeCompare(safeString(b.country))
              default:
                return b.matchScore - a.matchScore
            }
          })

  if (isLoading || programsLoading || destinationsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
          <div className="relative p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Analyzing Your Perfect Matches</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Our AI is processing thousands of {data.consultationType} to find your ideal matches...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Your Perfect Matches Found!
          </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Based on your preferences, we've found {safeArray(filteredResults).length} {data.consultationType} that match
          your criteria. Results are ranked by compatibility score.
        </p>
      </motion.div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder={`Search ${data.consultationType}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SortAsc className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  {data.consultationType === "programs" && <SelectItem value="cost">Cost</SelectItem>}
                </SelectContent>
              </Select>

              {data.consultationType === "programs" && (
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="high_match">High Match (70%+)</SelectItem>
                    <SelectItem value="scholarship">With Scholarship</SelectItem>
                    <SelectItem value="budget_friendly">Budget Friendly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {safeArray(filteredResults).length === 0 ? (
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="p-4 bg-orange-100 dark:bg-orange-900/20 rounded-full w-fit mx-auto">
                <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">No matches found</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Try adjusting your search criteria or filters to find more results. Consider being more flexible with
                your requirements.
              </p>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                <p>Suggestions:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Try a broader field of study</li>
                  <li>Increase your budget flexibility</li>
                  <li>Consider additional countries</li>
                  <li>Remove specific language requirements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence>
            {safeArray(filteredResults).map((item, index) => (
              <motion.div
                key={safeString(item.id) || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                {data.consultationType === "programs" ? (
                  <ProgramResultCard
                    program={item as MatchedProgram}
                    onApply={handleApply}
                    onDownload={handleDownloadBrochure}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.has(safeString(item.id))}
                    isRestricted={isRestricted}
                  />
                ) : (
                  <DestinationResultCard
                    destination={item as MatchedDestination}
                    onApply={handleApply}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.has(safeString(item.id))}
                    isRestricted={isRestricted}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// Program Result Card Component
function ProgramResultCard({
  program,
  onApply,
  onDownload,
  onToggleFavorite,
  isFavorite,
  isRestricted,
}: {
  program: MatchedProgram
  onApply: (program: MatchedProgram) => void
  onDownload: (program: MatchedProgram) => void
  onToggleFavorite: (id: string) => void
  isFavorite: boolean
  isRestricted: boolean
}) {
  const tuitionMin = safeNumber(program.tuition_min)
  const tuitionMax = safeNumber(program.tuition_max)
  const livingCostMin = safeNumber(program.living_cost_min)
  const livingCostMax = safeNumber(program.living_cost_max)

  return (
    <Card className="border-0 shadow-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="lg:w-80 h-48 lg:h-auto relative overflow-hidden">
            {program.image_url ? (
              <img
                src={program.image_url || "/placeholder.svg"}
                alt={safeString(program.name)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                <GraduationCap className="w-16 h-16 text-blue-500/40" />
              </div>
            )}

            {/* Overlay with match score */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge
                className={`backdrop-blur-sm ${
                  program.matchScore >= 80
                    ? "bg-green-500/90"
                    : program.matchScore >= 60
                      ? "bg-yellow-500/90"
                      : "bg-orange-500/90"
                } text-white`}
              >
                <Star className="w-3 h-3 mr-1 fill-current" />
                {safeNumber(program.matchScore)}% Match
              </Badge>
              {program.ranking && (
                <Badge className="bg-yellow-500/90 text-white backdrop-blur-sm">#{program.ranking}</Badge>
              )}
            </div>
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(safeString(program.id))}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 line-clamp-2">
                    {safeString(program.name)}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {safeString(program.university)} • {safeString(program.city)}, {safeString(program.country)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {safeString(program.study_level)}
                </Badge>
                <Badge variant="outline">{safeString(program.field)}</Badge>
                <Badge variant="outline">
                  <Globe className="w-3 h-3 mr-1" />
                  {safeString(program.program_language)}
                </Badge>
                <Badge variant="outline">
                  <Calendar className="w-3 h-3 mr-1" />
                  {safeNumber(program.duration_months)} months
                </Badge>
                {program.scholarship_available && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    <Award className="w-3 h-3 mr-1" />
                    Scholarship
                  </Badge>
                )}
              </div>
            </div>

            {/* Match Reasons */}
            <div className="space-y-2">
              <h4 className="font-medium text-slate-800 dark:text-slate-200 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                Why this matches you:
              </h4>
              <div className="space-y-1">
                {safeArray(program.matchReasons)
                  .slice(0, 3)
                  .map((reason, index) => (
                    <p key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {safeString(reason)}
                    </p>
                  ))}
              </div>
            </div>

            {/* Budget Info */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800 dark:text-slate-200">Annual Tuition</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  €{tuitionMin.toLocaleString()}
                  {tuitionMax > tuitionMin ? ` - €${tuitionMax.toLocaleString()}` : ""}
                </span>
              </div>
              {(livingCostMin > 0 || livingCostMax > 0) && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Total Cost (with living)</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    €{(tuitionMin + livingCostMin * 12).toLocaleString()} - €
                    {(tuitionMax + livingCostMax * 12).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={() => onApply(program)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                disabled={isRestricted}
              >
                {isRestricted ? "Sign Up to Apply" : "Apply Now"}
              </Button>
              <Button
                variant="outline"
                onClick={() => onDownload(program)}
                className="border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400"
              >
                <Download className="w-4 h-4 mr-2" />
                Brochure
              </Button>
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 bg-transparent"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Destination Result Card Component
function DestinationResultCard({
  destination,
  onApply,
  onToggleFavorite,
  isFavorite,
  isRestricted,
}: {
  destination: MatchedDestination
  onApply: (destination: MatchedDestination) => void
  onToggleFavorite: (id: string) => void
  isFavorite: boolean
  isRestricted: boolean
}) {
  return (
    <Card className="border-0 shadow-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="lg:w-80 h-48 lg:h-auto relative overflow-hidden">
            {destination.image_url ? (
              <img
                src={destination.image_url || "/placeholder.svg"}
                alt={safeString(destination.name)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-green-500/40" />
              </div>
            )}

            {/* Overlay with match score */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <Badge className="bg-green-500/90 text-white backdrop-blur-sm">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {safeNumber(destination.matchScore)}% Match
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(safeString(destination.id))}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    {safeString(destination.name)}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {safeString(destination.country)}
                  </p>
                </div>
              </div>

              {destination.description && (
                <p className="text-slate-600 dark:text-slate-400 line-clamp-2">{safeString(destination.description)}</p>
              )}
            </div>

            {/* Match Reasons */}
            <div className="space-y-2">
              <h4 className="font-medium text-slate-800 dark:text-slate-200 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                Why this destination suits you:
              </h4>
              <div className="space-y-1">
                {safeArray(destination.matchReasons)
                  .slice(0, 3)
                  .map((reason, index) => (
                    <p key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {safeString(reason)}
                    </p>
                  ))}
              </div>
            </div>

            {/* Cost Information */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {destination.bachelor_tuition_min && (
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Bachelor Tuition</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      €{safeNumber(destination.bachelor_tuition_min).toLocaleString()} - €
                      {safeNumber(destination.bachelor_tuition_max).toLocaleString()}
                    </p>
                  </div>
                )}
                {destination.master_tuition_min && (
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Master Tuition</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      €{safeNumber(destination.master_tuition_min).toLocaleString()} - €
                      {safeNumber(destination.master_tuition_max).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={() => onApply(destination)}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                disabled={isRestricted}
              >
                {isRestricted ? "Sign Up to Explore" : "Explore Programs"}
              </Button>
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-600 hover:border-green-500 dark:hover:border-green-400 bg-transparent"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}







