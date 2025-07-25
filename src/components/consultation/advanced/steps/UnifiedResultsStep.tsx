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
  matchScore: number
  matchReasons: string[]
}

// Safe array helper function - Fixed TypeScript generic syntax
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

// Calculate match score for programs
function calculateProgramMatchScore(program: any, consultationData: any): number {
  let score = 0
  const maxScore = 100

  try {
    // Study level match (25 points)
    if (safeString(program.study_level).toLowerCase() === safeString(consultationData.level).toLowerCase()) {
      score += 25
    }

    // Field match (20 points)
    const programField = safeString(program.field).toLowerCase()
    const userField = safeString(consultationData.field).toLowerCase()
    const fieldKeywords = safeArray(consultationData.fieldKeywords)

    if (userField && (programField.includes(userField) || userField.includes(programField))) {
      score += 20
    } else if (fieldKeywords.length > 0) {
      const keywordMatch = fieldKeywords.some(
        (keyword) =>
          programField.includes(safeString(keyword).toLowerCase()) ||
          safeString(keyword).toLowerCase().includes(programField),
      )
      if (keywordMatch) score += 15
    }

    // Language match (15 points)
    const programLanguage = safeString(program.program_language).toLowerCase()
    const userLanguage = safeString(consultationData.language).toLowerCase()
    if (userLanguage && programLanguage.includes(userLanguage)) {
      score += 15
    }

    // Budget match (20 points)
    const totalBudget = safeNumber(consultationData.totalBudget)
    const tuitionMin = safeNumber(program.tuition_min)
    const livingCostMin = safeNumber(program.living_cost_min)

    if (totalBudget > 0 && tuitionMin > 0) {
      const totalCost = tuitionMin + livingCostMin * 12
      if (totalBudget >= totalCost) {
        score += 20
      } else if (totalBudget >= totalCost * 0.8) {
        score += 15
      } else if (totalBudget >= totalCost * 0.6) {
        score += 10
      }
    }

    // Country preference (10 points)
    const countryPreference = safeArray(consultationData.countryPreference)
    const programCountry = safeString(program.country).toLowerCase()

    if (
      countryPreference.length === 0 ||
      countryPreference.some((country) => programCountry.includes(safeString(country).toLowerCase()))
    ) {
      score += 10
    }

    // Special requirements (10 points)
    if (consultationData.scholarshipRequired && program.scholarship_available) {
      score += 5
    }
    if (consultationData.religiousFacilities && program.religious_facilities) {
      score += 3
    }
    if (consultationData.halalFood && program.halal_food_availability) {
      score += 2
    }
  } catch (error) {
    console.error("Error calculating match score:", error)
    return 0
  }

  return Math.min(maxScore, Math.max(0, score))
}

// Generate match reasons
function generateMatchReasons(program: any, consultationData: any, score: number): string[] {
  const reasons: string[] = []

  try {
    if (safeString(program.study_level).toLowerCase() === safeString(consultationData.level).toLowerCase()) {
      reasons.push(`Perfect match for ${consultationData.level} level studies`)
    }

    const programField = safeString(program.field).toLowerCase()
    const userField = safeString(consultationData.field).toLowerCase()
    if (userField && programField.includes(userField)) {
      reasons.push(`Specializes in ${consultationData.field}`)
    }

    const totalBudget = safeNumber(consultationData.totalBudget)
    const tuitionMin = safeNumber(program.tuition_min)
    if (totalBudget > 0 && tuitionMin > 0 && totalBudget >= tuitionMin) {
      reasons.push("Fits within your budget range")
    }

    if (program.scholarship_available) {
      reasons.push("Scholarship opportunities available")
    }

    const programLanguage = safeString(program.program_language).toLowerCase()
    const userLanguage = safeString(consultationData.language).toLowerCase()
    if (userLanguage && programLanguage.includes(userLanguage)) {
      reasons.push(`Taught in ${consultationData.language}`)
    }

    if (reasons.length === 0) {
      reasons.push("General compatibility with your preferences")
    }
  } catch (error) {
    console.error("Error generating match reasons:", error)
    reasons.push("Basic program match")
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

      if (safePrograms.length === 0) {
        setMatchedPrograms([])
        setIsLoading(false)
        return
      }

      // Enhanced filtering logic with safe checks
      const filteredPrograms = safePrograms.filter((program) => {
        if (!program || typeof program !== "object") return false

        // Basic filters with safe checks
        const levelMatch =
          !data.level || safeString(program.study_level).toLowerCase() === safeString(data.level).toLowerCase()

        const languageMatch =
          !data.language ||
          safeString(program.program_language).toLowerCase().includes(safeString(data.language).toLowerCase()) ||
          safeString(program.secondary_language).toLowerCase().includes(safeString(data.language).toLowerCase())

        // Budget filter - more flexible with safe checks
        const totalBudget = safeNumber(data.totalBudget)
        const tuitionMin = safeNumber(program.tuition_min)
        const livingCostMin = safeNumber(program.living_cost_min)

        const budgetMatch =
          totalBudget === 0 ||
          (tuitionMin > 0 && livingCostMin >= 0 && tuitionMin + livingCostMin * 12 <= totalBudget * 1.2)

        // Field matching with safe checks
        let fieldMatch = true
        const userField = safeString(data.field)
        if (userField) {
          const programField = safeString(program.field).toLowerCase()
          const userFieldLower = userField.toLowerCase()

          fieldMatch = programField.includes(userFieldLower) || userFieldLower.includes(programField)

          if (!fieldMatch) {
            const programKeywords = safeArray(program.field_keywords)
            const userKeywords = safeArray(data.fieldKeywords)

            fieldMatch =
              programKeywords.some(
                (keyword) =>
                  safeString(keyword).toLowerCase().includes(userFieldLower) ||
                  userFieldLower.includes(safeString(keyword).toLowerCase()),
              ) ||
              userKeywords.some(
                (keyword) =>
                  programField.includes(safeString(keyword).toLowerCase()) ||
                  programKeywords.some((pk) =>
                    safeString(pk).toLowerCase().includes(safeString(keyword).toLowerCase()),
                  ),
              )
          }
        }

        // Country preference with safe checks
        const countryPreference = safeArray(data.countryPreference)
        const countryMatch =
          countryPreference.length === 0 ||
          countryPreference.some((country) =>
            safeString(program.country).toLowerCase().includes(safeString(country).toLowerCase()),
          )

        // Special requirements
        const scholarshipMatch = !data.scholarshipRequired || Boolean(program.scholarship_available)

        return levelMatch && languageMatch && budgetMatch && fieldMatch && countryMatch && scholarshipMatch
      })

      // Calculate match scores for filtered programs
      const scoredPrograms = filteredPrograms.map((program) => {
        const matchScore = calculateProgramMatchScore(program, data)
        const matchReasons = generateMatchReasons(program, data, matchScore)

        return {
          ...program,
          matchScore,
          matchReasons,
        } as MatchedProgram
      })

      // Sort by match score and take top results
      const sortedPrograms = scoredPrograms
        .filter((program) => program.matchScore >= 20) // Lower threshold for more results
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 20)

      setMatchedPrograms(sortedPrograms)

      // If no matches, show some programs with basic matching
      if (sortedPrograms.length === 0) {
        const fallbackPrograms = safePrograms
          .filter((program) => {
            const levelMatch =
              !data.level || safeString(program.study_level).toLowerCase() === safeString(data.level).toLowerCase()
            return levelMatch
          })
          .slice(0, 10)
          .map(
            (program) =>
              ({
                ...program,
                matchScore: 25,
                matchReasons: ["Basic match based on study level"],
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

      // Simple destination matching with safe checks
      const matchedDests = safeDestinations
        .filter((dest) => dest && typeof dest === "object")
        .map(
          (dest) =>
            ({
              ...dest,
              matchScore: 50, // Default score for destinations
              matchReasons: ["Suitable destination for your studies"],
            }) as MatchedDestination,
        )
        .slice(0, 15)

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
      // Simple download simulation
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
              safeString(program.country).toLowerCase().includes(searchLower)

            const matchesFilter =
              filterBy === "all" ||
              (filterBy === "scholarship" && program.scholarship_available) ||
              (filterBy === "high_match" && program.matchScore >= 80) ||
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
                    <SelectItem value="high_match">High Match (80%+)</SelectItem>
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
                Try adjusting your search criteria or filters to find more results.
              </p>
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
              <Badge className="bg-green-500/90 text-white backdrop-blur-sm">
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
                  €{tuitionMin.toLocaleString()} - €{tuitionMax.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Total Cost (with living)</span>
                <span className="text-slate-600 dark:text-slate-400">
                  €{(tuitionMin + livingCostMin * 12).toLocaleString()} - €
                  {(tuitionMax + livingCostMax * 12).toLocaleString()}
                </span>
              </div>
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






