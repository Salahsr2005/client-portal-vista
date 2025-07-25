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
import { calculateMatchScore, getMatchExplanation, getBudgetBreakdown } from "@/services/ProgramMatchingService"
import { DestinationMatchingService } from "@/services/DestinationMatchingService"
import { generateProgramPDF } from "@/utils/pdfGenerator"
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

export function UnifiedResultsStep({ data, updateData, onValidation }: UnifiedResultsStepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("match")
  const [filterBy, setFilterBy] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [matchedPrograms, setMatchedPrograms] = useState<MatchedProgram[]>([])
  const [matchedDestinations, setMatchedDestinations] = useState<MatchedDestination[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const { programs, loading: programsLoading } = usePrograms()
  const { destinations, loading: destinationsLoading } = useDestinations()
  const { toast } = useToast()
  const { isRestricted, handleRestrictedAction } = useGuestRestrictions()

  useEffect(() => {
    onValidation(true)
  }, [onValidation])

  useEffect(() => {
    if (data.consultationType === "programs" && programs.length > 0) {
      processPrograms()
    } else if (data.consultationType === "destinations" && destinations.length > 0) {
      processDestinations()
    }
  }, [programs, destinations, data])

  const processPrograms = () => {
    setIsLoading(true)

    try {
      // Ensure required arrays are initialized
      const safeFieldKeywords = data.fieldKeywords && Array.isArray(data.fieldKeywords) ? data.fieldKeywords : []
      const safeCountryPreference =
        data.countryPreference && Array.isArray(data.countryPreference) ? data.countryPreference : []

      // Enhanced filtering logic
      const filteredPrograms = programs.filter((program) => {
        // Basic filters
        const levelMatch = !data.level || program.study_level?.toLowerCase() === data.level.toLowerCase()
        const languageMatch =
          !data.language ||
          program.program_language?.toLowerCase().includes(data.language.toLowerCase()) ||
          program.secondary_language?.toLowerCase().includes(data.language.toLowerCase())

        // Budget filter - more flexible
        const budgetMatch =
          !data.totalBudget ||
          data.totalBudget === 0 ||
          (program.tuition_min &&
            program.living_cost_min &&
            program.tuition_min + program.living_cost_min * 12 <= data.totalBudget * 1.2) // 20% flexibility

        // Field matching - enhanced with keywords
        let fieldMatch = true
        if (data.field && data.field !== "") {
          const programField = program.field?.toLowerCase() || ""
          const userField = data.field.toLowerCase()

          // Direct field match
          fieldMatch = programField.includes(userField) || userField.includes(programField)

          // Keyword matching if available
          if (
            !fieldMatch &&
            program.field_keywords &&
            Array.isArray(program.field_keywords) &&
            program.field_keywords.length > 0
          ) {
            fieldMatch = program.field_keywords.some(
              (keyword) => keyword.toLowerCase().includes(userField) || userField.includes(keyword.toLowerCase()),
            )
          }

          // Additional field keywords from consultation data
          if (!fieldMatch && safeFieldKeywords.length > 0) {
            fieldMatch = safeFieldKeywords.some(
              (keyword) =>
                programField.includes(keyword.toLowerCase()) ||
                (program.field_keywords &&
                  Array.isArray(program.field_keywords) &&
                  program.field_keywords.some((pk) => pk.toLowerCase().includes(keyword.toLowerCase()))),
            )
          }
        }

        // Country preference
        const countryMatch =
          safeCountryPreference.length === 0 ||
          safeCountryPreference.some((country) => program.country?.toLowerCase().includes(country.toLowerCase()))

        // Special requirements
        const scholarshipMatch = !data.scholarshipRequired || program.scholarship_available

        return levelMatch && languageMatch && budgetMatch && fieldMatch && countryMatch && scholarshipMatch
      })

      // Calculate match scores for filtered programs
      const scoredPrograms = filteredPrograms.map((program) => {
        const matchScore = calculateMatchScore(program, {
          level: data.level,
          subjects: safeFieldKeywords.length > 0 ? safeFieldKeywords : [data.field].filter(Boolean),
          budget: data.totalBudget,
          language: data.language,
          destination: safeCountryPreference.join(", "),
          religiousFacilities: data.religiousFacilities,
          halalFood: data.halalFood,
          scholarshipRequired: data.scholarshipRequired,
          duration: data.durationPreference,
          specialRequirements: {
            religiousFacilities: data.religiousFacilities,
            halalFood: data.halalFood,
            scholarshipRequired: data.scholarshipRequired,
          },
        })

        const matchReasons = getMatchExplanation(program, matchScore)

        return {
          ...program,
          matchScore,
          matchReasons,
        } as MatchedProgram
      })

      // Sort by match score and take top results
      const sortedPrograms = scoredPrograms
        .filter((program) => program.matchScore >= 30) // Minimum threshold
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 20) // Limit results

      setMatchedPrograms(sortedPrograms)

      if (sortedPrograms.length === 0) {
        // If no matches, show some programs with lower threshold
        const fallbackPrograms = programs
          .filter((program) => {
            const levelMatch = !data.level || program.study_level?.toLowerCase() === data.level.toLowerCase()
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
      const preferences = {
        studyLevel: data.level as "Bachelor" | "Master" | "PhD",
        budget: data.totalBudget,
        language: data.language,
        languageTestRequired: data.languageTestRequired,
        languageTestScore: data.languageTestScore,
        intakePeriod: data.startDatePreference,
        academicLevel: "Any" as "High" | "Medium" | "Any",
        religiousFacilities: data.religiousFacilities,
        halalFood: data.halalFood,
        workWhileStudying: data.workWhileStudying,
        accommodationPreference: data.accommodationPreference,
      }

      const matchedDests = DestinationMatchingService.findMatchingDestinations(destinations, preferences, 15)

      setMatchedDestinations(matchedDests)

      if (matchedDests.length === 0) {
        // Fallback destinations
        const fallbackDestinations = destinations.slice(0, 8).map((dest) => ({
          ...dest,
          matchScore: 25,
          matchReasons: ["Basic destination match"],
        }))
        setMatchedDestinations(fallbackDestinations)
      }
    } catch (error) {
      console.error("Error processing destinations:", error)
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
      await generateProgramPDF(program)
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
        description: `Starting application process for ${item.name}`,
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
      ? matchedPrograms
          .filter((program) => {
            const matchesSearch =
              program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              program.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
              program.country.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesFilter =
              filterBy === "all" ||
              (filterBy === "scholarship" && program.scholarship_available) ||
              (filterBy === "high_match" && program.matchScore >= 80) ||
              (filterBy === "budget_friendly" && program.tuition_min <= data.totalBudget * 0.8)

            return matchesSearch && matchesFilter
          })
          .sort((a, b) => {
            switch (sortBy) {
              case "match":
                return b.matchScore - a.matchScore
              case "cost":
                return a.tuition_min - b.tuition_min
              case "name":
                return a.name.localeCompare(b.name)
              case "country":
                return a.country.localeCompare(b.country)
              default:
                return b.matchScore - a.matchScore
            }
          })
      : matchedDestinations
          .filter((dest) => {
            const matchesSearch =
              dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              dest.country.toLowerCase().includes(searchTerm.toLowerCase())

            return matchesSearch
          })
          .sort((a, b) => {
            switch (sortBy) {
              case "match":
                return b.matchScore - a.matchScore
              case "name":
                return a.name.localeCompare(b.name)
              case "country":
                return a.country.localeCompare(b.country)
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
          Based on your preferences, we've found {filteredResults.length} {data.consultationType} that match your
          criteria. Results are ranked by compatibility score.
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
      {filteredResults.length === 0 ? (
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
            {filteredResults.map((item, index) => (
              <motion.div
                key={item.id}
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
                    isFavorite={favorites.has(item.id)}
                    isRestricted={isRestricted}
                  />
                ) : (
                  <DestinationResultCard
                    destination={item as MatchedDestination}
                    onApply={handleApply}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.has(item.id)}
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
  const budget = getBudgetBreakdown(program)

  return (
    <Card className="border-0 shadow-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="lg:w-80 h-48 lg:h-auto relative overflow-hidden">
            {program.image_url ? (
              <img
                src={program.image_url || "/placeholder.svg"}
                alt={program.name}
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
                {program.matchScore}% Match
              </Badge>
              {program.ranking && (
                <Badge className="bg-yellow-500/90 text-white backdrop-blur-sm">#{program.ranking}</Badge>
              )}
            </div>
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(program.id)}
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
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 line-clamp-2">{program.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {program.university} • {program.city}, {program.country}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {program.study_level}
                </Badge>
                <Badge variant="outline">{program.field}</Badge>
                <Badge variant="outline">
                  <Globe className="w-3 h-3 mr-1" />
                  {program.program_language}
                </Badge>
                <Badge variant="outline">
                  <Calendar className="w-3 h-3 mr-1" />
                  {program.duration_months} months
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
                {program.matchReasons.slice(0, 3).map((reason, index) => (
                  <p key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {reason}
                  </p>
                ))}
              </div>
            </div>

            {/* Budget Info */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800 dark:text-slate-200">Annual Tuition</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  €{program.tuition_min.toLocaleString()} - €{program.tuition_max.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Total Cost (with living)</span>
                <span className="text-slate-600 dark:text-slate-400">
                  €{budget.total.min.toLocaleString()} - €{budget.total.max.toLocaleString()}
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
                alt={destination.name}
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
                {destination.matchScore}% Match
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(destination.id)}
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
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{destination.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {destination.country}
                  </p>
                </div>
              </div>

              {destination.description && (
                <p className="text-slate-600 dark:text-slate-400 line-clamp-2">{destination.description}</p>
              )}
            </div>

            {/* Match Reasons */}
            <div className="space-y-2">
              <h4 className="font-medium text-slate-800 dark:text-slate-200 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                Why this destination suits you:
              </h4>
              <div className="space-y-1">
                {destination.matchReasons.slice(0, 3).map((reason, index) => (
                  <p key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {reason}
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
                      €{destination.bachelor_tuition_min.toLocaleString()} - €
                      {destination.bachelor_tuition_max?.toLocaleString()}
                    </p>
                  </div>
                )}
                {destination.master_tuition_min && (
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Master Tuition</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      €{destination.master_tuition_min.toLocaleString()} - €
                      {destination.master_tuition_max?.toLocaleString()}
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




