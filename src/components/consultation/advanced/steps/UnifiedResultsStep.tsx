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

      // Fetch Programs if consultation type is programs or both
      if (data.consultationType === "programs" || data.consultationType === "") {
        const { data: programs, error: programsError } = await supabase.rpc("get_matched_programs", {
          p_study_level: data.level,
          p_field: data.field,
          p_language: data.language,
          p_budget: data.totalBudget,
          p_living_costs: data.livingCostsBudget,
          p_language_test_required: data.languageTestRequired,
          p_religious_facilities: data.religiousFacilities,
          p_halal_food: data.halalFood,
          p_scholarship_required: data.scholarshipRequired,
          p_limit: 10,
        })

        if (programsError) {
          console.error("Programs error:", programsError)
        } else if (programs) {
          const programMatches = programs.map((program: any) => ({
            ...program,
            type: "program" as const,
            match_percentage: calculateProgramMatch(program, data),
          }))
          allMatches = [...allMatches, ...programMatches]
        }
      }

      // Fetch Destinations if consultation type is destinations or both
      if (data.consultationType === "destinations" || data.consultationType === "") {
        const { data: destinations, error: destinationsError } = await supabase
          .from("destinations")
          .select("*")
          .eq("status", "Active")
          .limit(10)

        if (destinationsError) {
          console.error("Destinations error:", destinationsError)
        } else if (destinations) {
          const destinationMatches = destinations.map((destination: any) => ({
            ...destination,
            type: "destination" as const,
            match_percentage: calculateDestinationMatch(destination, data),
          }))
          allMatches = [...allMatches, ...destinationMatches]
        }
      }

      // Sort by match percentage
      allMatches.sort((a, b) => b.match_percentage - a.match_percentage)

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
    const maxScore = 100

    // Study level match (25%)
    if (program.study_level === preferences.level) score += 25

    // Field match (20%)
    if (program.field && preferences.field) {
      if (
        program.field.toLowerCase().includes(preferences.field.toLowerCase()) ||
        preferences.fieldKeywords.some((keyword: string) => program.field.toLowerCase().includes(keyword.toLowerCase()))
      ) {
        score += 20
      }
    }

    // Language match (20%)
    if (program.program_language === preferences.language) score += 20

    // Budget match (20%)
    const totalCost = (program.tuition_min || 0) + (program.living_cost_min || 0) * 12
    if (preferences.totalBudget >= totalCost) score += 20
    else if (preferences.totalBudget >= totalCost * 0.8) score += 15

    // Special requirements (15%)
    let specialScore = 15
    if (preferences.scholarshipRequired && !program.scholarship_available) specialScore -= 5
    if (preferences.religiousFacilities && !program.religious_facilities) specialScore -= 5
    if (preferences.halalFood && !program.halal_food_availability) specialScore -= 5
    score += Math.max(0, specialScore)

    return Math.min(100, Math.max(0, score))
  }

  const calculateDestinationMatch = (destination: any, preferences: any): number => {
    let score = 0
    const maxScore = 100

    // Study level availability (25%)
    if (destination.available_programs?.includes(preferences.level)) score += 25

    // Language match (20%)
    if (destination.language_requirements?.toLowerCase().includes(preferences.language.toLowerCase())) {
      score += 20
    }

    // Budget match (25%)
    const levelKey = `${preferences.level.toLowerCase()}_tuition_min`
    const tuitionMin = destination[levelKey] || 0
    const totalCost = tuitionMin + (destination.service_fee || 0) + (destination.application_fee || 0)

    if (preferences.totalBudget >= totalCost) score += 25
    else if (preferences.totalBudget >= totalCost * 0.8) score += 20

    // Country preference (15%)
    if (preferences.countryPreference.length === 0 || preferences.countryPreference.includes(destination.country)) {
      score += 15
    }

    // Success rates (15%)
    const avgSuccessRate = ((destination.admission_success_rate || 0) + (destination.visa_success_rate || 0)) / 2
    score += (avgSuccessRate / 100) * 15

    return Math.min(100, Math.max(0, score))
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
      <div className="text-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-6"
        >
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </motion.div>
        <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">Finding Your Perfect Matches</h3>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
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
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">Oops! Something went wrong</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
        <Button onClick={fetchMatchedItems} className="bg-blue-600 hover:bg-blue-700">
          Try Again
        </Button>
      </div>
    )
  }

  if (matchedItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
          <Search className="w-10 h-10 text-yellow-600" />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">No Perfect Matches Found</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          We couldn't find{" "}
          {data.consultationType === "programs"
            ? "programs"
            : data.consultationType === "destinations"
              ? "destinations"
              : "items"}{" "}
          that exactly match your requirements. Consider adjusting your preferences or exploring alternative options.
        </p>
        <div className="space-y-3">
          <Button variant="outline" onClick={() => window.history.back()}>
            Adjust Preferences
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Browse All Options</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
        >
          <Trophy className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Your Perfect Matches!
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
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
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{matchedItems.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Matches</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {matchedItems.filter((item) => item.match_percentage >= 80).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Excellent Matches</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {matchedItems.filter((item) => item.scholarship_available).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">With Scholarships</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {new Set(matchedItems.map((item) => item.country)).size}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Countries</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for filtering */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>All ({matchedItems.length})</span>
          </TabsTrigger>
          <TabsTrigger value="programs" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Programs ({programsCount})</span>
          </TabsTrigger>
          <TabsTrigger value="destinations" className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Destinations ({destinationsCount})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6 mt-8">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-slate-200 dark:border-slate-700">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4 flex-1">
                        <div
                          className="w-20 h-20 rounded-xl bg-cover bg-center flex-shrink-0 border-2 border-slate-200 dark:border-slate-700"
                          style={{
                            backgroundImage: `url(${item.logo_url || item.cover_image_url || item.image_url || "/placeholder.svg"})`,
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{item.name}</h3>
                            <Badge className={`${getMatchBadgeColor(item.match_percentage)} border`}>
                              {Math.round(item.match_percentage)}% Match
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {item.type}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-6 text-slate-600 dark:text-slate-400">
                            {item.university && (
                              <div className="flex items-center space-x-1">
                                <GraduationCap className="w-4 h-4" />
                                <span>{item.university}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {item.city ? `${item.city}, ` : ""}
                                {item.country}
                              </span>
                            </div>
                            {item.program_language && (
                              <div className="flex items-center space-x-1">
                                <Globe className="w-4 h-4" />
                                <span>{item.program_language}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getMatchColor(item.match_percentage)} mb-2`}>
                          {Math.round(item.match_percentage)}%
                        </div>
                        <Progress value={item.match_percentage} className="w-24 h-3" />
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-2">{item.description}</p>
                    )}

                    {/* Cost Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      {item.type === "program" ? (
                        <>
                          <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Tuition:</span>
                            <p className="text-slate-900 dark:text-slate-100">
                              €{item.tuition_min?.toLocaleString()} - €{item.tuition_max?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Living Costs:</span>
                            <p className="text-slate-900 dark:text-slate-100">
                              €{((item.living_cost_min || 0) * 12)?.toLocaleString()} - €
                              {((item.living_cost_max || 0) * 12)?.toLocaleString()}/year
                            </p>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Duration:</span>
                            <p className="text-slate-900 dark:text-slate-100">
                              {item.duration_months ? `${Math.floor(item.duration_months / 12)} years` : "N/A"}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Tuition Range:</span>
                            <p className="text-slate-900 dark:text-slate-100">
                              €{item[`${data.level?.toLowerCase()}_tuition_min`]?.toLocaleString()} - €
                              {item[`${data.level?.toLowerCase()}_tuition_max`]?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Service Fee:</span>
                            <p className="text-slate-900 dark:text-slate-100">
                              €{item.service_fee?.toLocaleString() || 0}
                            </p>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Processing:</span>
                            <p className="text-slate-900 dark:text-slate-100">{item.processing_time || "N/A"}</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.scholarship_available && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300"
                        >
                          <Trophy className="w-3 h-3 mr-1" />
                          Scholarship
                        </Badge>
                      )}
                      {item.religious_facilities && (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
                        >
                          Religious Facilities
                        </Badge>
                      )}
                      {item.halal_food_availability && (
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300"
                        >
                          Halal Food
                        </Badge>
                      )}
                      {item.type === "destination" && item.available_programs && (
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300"
                        >
                          {item.available_programs.join(", ")}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex space-x-3">
                        <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
                          <Heart className="w-4 h-4" />
                          <span>Save</span>
                        </Button>
                        <Button variant="outline" size="sm">
                          Compare
                        </Button>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-1">
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

      <div className="text-center pt-8">
        <Button
          size="lg"
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-4 text-lg"
        >
          <Trophy className="w-6 h-6 mr-2" />
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
