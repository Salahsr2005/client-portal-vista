"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  DollarSign,
  Settings,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Globe,
  Check,
  AlertCircle,
  TrendingUp,
  Clock,
  FileText,
  PiggyBank,
  CreditCard,
  Home,
  Calculator,
} from "lucide-react"
import { useDestinations } from "@/hooks/useDestinations"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useGuestRestrictions } from "@/components/layout/GuestModeWrapper"

const STEPS = [
  { id: 1, title: "Study Level", icon: Globe, description: "Choose your academic level" },
  { id: 2, title: "Budget Planning", icon: DollarSign, description: "Set your financial preferences" },
  { id: 3, title: "Language & Timeline", icon: FileText, description: "Language and timeline preferences" },
  { id: 4, title: "Personal Preferences", icon: Settings, description: "Additional requirements" },
  { id: 5, title: "Your Matches", icon: Trophy, description: "Perfect destinations for you" },
]

interface DestinationConsultationData {
  studyLevel: string
  tuitionBudget: number
  livingCostsBudget: number
  serviceFeesBudget: number
  totalBudget: number
  budgetFlexibility: "strict" | "flexible" | "very_flexible"
  language: string
  languageLevel: "beginner" | "intermediate" | "advanced" | "native"
  intakePeriod: string
  urgency: "asap" | "flexible" | "planning_ahead"
  workWhileStudying: boolean
  scholarshipRequired: boolean
  religiousFacilities: boolean
  halalFood: boolean
  priorityFactors: string[]
}

// Enhanced matching algorithm for destinations (removed field matching)
const calculateDestinationMatchScore = (destination: any, consultationData: DestinationConsultationData) => {
  let totalScore = 0
  let maxPossibleScore = 0
  const reasons: string[] = []
  const warnings: string[] = []

  // 1. Study Level match (30% weight - increased from 20%)
  const levelWeight = 30
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

  // 2. Budget Analysis (35% weight - increased from 30%)
  const budgetWeight = 35
  maxPossibleScore += budgetWeight

  const tuitionMin = destination[tuitionMinKey] || 0
  const tuitionMax = destination[tuitionMaxKey] || 0
  const serviceFee = destination.service_fee || 0
  const applicationFee = destination.application_fee || 0
  const visaFee = destination.visa_processing_fee || 0
  const totalFees = serviceFee + applicationFee + visaFee

  const totalMinCost = tuitionMin + (consultationData.livingCostsBudget || 0) + totalFees
  const totalMaxCost = tuitionMax + (consultationData.livingCostsBudget || 0) + totalFees

  if (consultationData.totalBudget >= totalMaxCost) {
    totalScore += budgetWeight
    reasons.push(`Comfortably within budget`)
  } else if (consultationData.totalBudget >= totalMinCost) {
    const budgetRatio = (consultationData.totalBudget - totalMinCost) / (totalMaxCost - totalMinCost)
    totalScore += budgetWeight * (0.5 + budgetRatio * 0.5)
    reasons.push(`Within budget range`)
  } else {
    const shortfall = totalMinCost - consultationData.totalBudget
    if (consultationData.budgetFlexibility === "very_flexible" && shortfall <= consultationData.totalBudget * 0.2) {
      totalScore += budgetWeight * 0.3
      warnings.push(`Budget shortfall but marked as flexible`)
    } else {
      warnings.push(`May exceed budget`)
    }
  }

  // 3. Language Requirements (20% weight - same as before)
  const languageWeight = 20
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

  // 4. Special Requirements (15% weight - same as before)
  const specialWeight = 15
  maxPossibleScore += specialWeight

  let specialScore = 0
  if (consultationData.scholarshipRequired && destination.scholarship_opportunities) {
    specialScore += 5
    reasons.push("Scholarship opportunities available")
  }
  if (consultationData.religiousFacilities && destination.religious_facilities) {
    specialScore += 5
    reasons.push("Religious facilities available")
  }
  if (consultationData.halalFood && destination.halal_food_availability) {
    specialScore += 5
    reasons.push("Halal food available")
  }

  totalScore += Math.min(specialWeight, specialScore)

  // Calculate final percentage score
  const finalScore = Math.min(100, Math.round((totalScore / maxPossibleScore) * 100))

  return {
    score: finalScore,
    reasons,
    warnings,
    recommendation:
      finalScore >= 80
        ? "highly_recommended"
        : finalScore >= 60
          ? "recommended"
          : finalScore >= 40
            ? "consider"
            : "not_recommended",
  }
}

export default function DestinationConsultationFlow() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { isRestricted, handleRestrictedAction } = useGuestRestrictions()

  const [currentStep, setCurrentStep] = useState(1)
  const [consultationData, setConsultationData] = useState<DestinationConsultationData>({
    studyLevel: "",
    tuitionBudget: 0,
    livingCostsBudget: 0,
    serviceFeesBudget: 0,
    totalBudget: 0,
    budgetFlexibility: "flexible",
    language: "",
    languageLevel: "intermediate",
    intakePeriod: "",
    urgency: "flexible",
    workWhileStudying: false,
    scholarshipRequired: false,
    religiousFacilities: false,
    halalFood: false,
    priorityFactors: [],
  })
  const [matchedDestinations, setMatchedDestinations] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch destinations for matching
  const { data: destinationsData } = useDestinations({
    limit: 50,
  })

  const progress = (currentStep / STEPS.length) * 100
  const currentStepInfo = STEPS[currentStep - 1]

  const updateData = (updates: Partial<DestinationConsultationData>) => {
    const newData = { ...consultationData, ...updates }

    // Calculate total budget when individual budgets change
    if (
      updates.tuitionBudget !== undefined ||
      updates.livingCostsBudget !== undefined ||
      updates.serviceFeesBudget !== undefined
    ) {
      newData.totalBudget =
        (newData.tuitionBudget || 0) + (newData.livingCostsBudget || 0) + (newData.serviceFeesBudget || 0)
    }

    setConsultationData(newData)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!consultationData.studyLevel
      case 2:
        return consultationData.totalBudget > 0
      case 3:
        return !!consultationData.language && !!consultationData.intakePeriod
      case 4:
        return true // Optional preferences
      default:
        return true
    }
  }

  const findMatches = () => {
    if (!destinationsData?.destinations) return []

    const scoredDestinations = destinationsData.destinations.map((destination) => {
      const matchResult = calculateDestinationMatchScore(destination, consultationData)
      return {
        ...destination,
        matchScore: matchResult.score,
        matchReasons: matchResult.reasons,
        matchWarnings: matchResult.warnings,
        recommendation: matchResult.recommendation,
      }
    })

    const minScoreThreshold = consultationData.budgetFlexibility === "strict" ? 50 : 30

    return scoredDestinations
      .filter((destination) => destination.matchScore >= minScoreThreshold)
      .sort((a, b) => {
        const recommendationOrder = { highly_recommended: 4, recommended: 3, consider: 2, not_recommended: 1 }
        const aOrder = recommendationOrder[a.recommendation as keyof typeof recommendationOrder] || 0
        const bOrder = recommendationOrder[b.recommendation as keyof typeof recommendationOrder] || 0

        if (aOrder !== bOrder) return bOrder - aOrder
        return b.matchScore - a.matchScore
      })
  }

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1)
    } else if (currentStep === 4) {
      setIsProcessing(true)
      try {
        const matches = findMatches()
        setMatchedDestinations(matches)

        if (user && !isRestricted) {
          await supabase.from("consultation_results").insert({
            user_id: user.id,
            study_level: consultationData.studyLevel as any,
            budget: consultationData.totalBudget,
            language_preference: consultationData.language,
            matched_programs: matches.map((m) => ({
              destination_id: m.id,
              name: m.name,
              country: m.country,
              match_score: m.matchScore,
              reasons: m.matchReasons,
              warnings: m.matchWarnings,
              recommendation: m.recommendation,
            })),
            preferences_data: consultationData as any,
          })

          toast({
            title: "Consultation Complete",
            description: `Found ${matches.length} matching destinations!`,
          })
        }

        setCurrentStep(5)
      } catch (error) {
        console.error("Error saving consultation:", error)
        toast({
          title: "Error",
          description: "Failed to save consultation. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                What level do you want to study?
              </h2>
              <p className="text-slate-600 dark:text-slate-400">Choose your academic level</p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">Study Level</Label>
                <div className="grid grid-cols-1 gap-3">
                  {["Bachelor", "Master", "PhD"].map((level) => (
                    <Button
                      key={level}
                      variant={consultationData.studyLevel === level ? "default" : "outline"}
                      onClick={() => updateData({ studyLevel: level })}
                      className="h-16 text-lg justify-start"
                    >
                      <div className="flex items-center">
                        <Globe className="h-6 w-6 mr-3" />
                        <div className="text-left">
                          <div className="font-semibold">{level}</div>
                          <div className="text-sm text-muted-foreground">
                            {level === "Bachelor" && "Undergraduate degree (3-4 years)"}
                            {level === "Master" && "Graduate degree (1-2 years)"}
                            {level === "PhD" && "Doctoral degree (3-5 years)"}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Plan your budget</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Set your budget for different categories to find options that fit your financial plan
              </p>
            </div>

            {/* Budget Summary */}
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200/20 dark:border-blue-800/20">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Calculator className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Total Budget Overview</h3>
                  </div>
                  <div className="text-4xl font-bold mb-2 text-slate-800 dark:text-slate-100">
                    {formatCurrency(consultationData.totalBudget)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <PiggyBank className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                    <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      {formatCurrency(consultationData.tuitionBudget)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Tuition Fees</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <Home className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                    <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      {formatCurrency(consultationData.livingCostsBudget)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Living Costs</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                    <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      {formatCurrency(consultationData.serviceFeesBudget)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Service Fees</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Sliders */}
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Tuition Budget */}
              <Card className="bg-white/80 dark:bg-slate-800/80">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold flex items-center text-slate-800 dark:text-slate-200">
                        <PiggyBank className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                        Tuition Budget
                      </Label>
                      <Badge variant="outline" className="text-sm">
                        {formatCurrency(consultationData.tuitionBudget)}
                      </Badge>
                    </div>
                    <Slider
                      value={[consultationData.tuitionBudget]}
                      onValueChange={(value) => updateData({ tuitionBudget: value[0] })}
                      max={50000}
                      min={0}
                      step={500}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                      <span>€0</span>
                      <span>€50,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Living Costs Budget */}
              <Card className="bg-white/80 dark:bg-slate-800/80">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold flex items-center text-slate-800 dark:text-slate-200">
                        <Home className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                        Living Costs Budget
                      </Label>
                      <Badge variant="outline" className="text-sm">
                        {formatCurrency(consultationData.livingCostsBudget)}
                      </Badge>
                    </div>
                    <Slider
                      value={[consultationData.livingCostsBudget]}
                      onValueChange={(value) => updateData({ livingCostsBudget: value[0] })}
                      max={30000}
                      min={0}
                      step={500}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                      <span>€0</span>
                      <span>€30,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Fees Budget */}
              <Card className="bg-white/80 dark:bg-slate-800/80">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold flex items-center text-slate-800 dark:text-slate-200">
                        <CreditCard className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                        Service Fees Budget
                      </Label>
                      <Badge variant="outline" className="text-sm">
                        {formatCurrency(consultationData.serviceFeesBudget)}
                      </Badge>
                    </div>
                    <Slider
                      value={[consultationData.serviceFeesBudget]}
                      onValueChange={(value) => updateData({ serviceFeesBudget: value[0] })}
                      max={10000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                      <span>€0</span>
                      <span>€10,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Budget Flexibility */}
              <Card className="bg-white/80 dark:bg-slate-800/80">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      Budget Flexibility
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "strict", label: "Strict", desc: "Stay within budget" },
                        { id: "flexible", label: "Flexible", desc: "Up to 20% over" },
                        { id: "very_flexible", label: "Very Flexible", desc: "Up to 50% over" },
                      ].map((option) => (
                        <Button
                          key={option.id}
                          variant={consultationData.budgetFlexibility === option.id ? "default" : "outline"}
                          onClick={() => updateData({ budgetFlexibility: option.id as any })}
                          className="h-auto p-4 flex flex-col items-center space-y-2 text-center"
                        >
                          <span className="font-semibold">{option.label}</span>
                          <span className="text-xs opacity-75">{option.desc}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Language & Timeline</h2>
              <p className="text-slate-600 dark:text-slate-400">Tell us about your language skills and timeline</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">Preferred Study Language</Label>
                <Select value={consultationData.language} onValueChange={(value) => updateData({ language: value })}>
                  <SelectTrigger className="h-14 text-lg">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="Dutch">Dutch</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                    <SelectItem value="Any">Any Language</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">Your Language Proficiency Level</Label>
                <Select
                  value={consultationData.languageLevel}
                  onValueChange={(value: any) => updateData({ languageLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="native">Native Speaker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">Preferred Intake Period</Label>
                <Select
                  value={consultationData.intakePeriod}
                  onValueChange={(value) => updateData({ intakePeriod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select intake period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="September">September 2025</SelectItem>
                    <SelectItem value="January">January 2026</SelectItem>
                    <SelectItem value="February">February 2026</SelectItem>
                    <SelectItem value="May">May 2026</SelectItem>
                    <SelectItem value="Fall">Fall 2025</SelectItem>
                    <SelectItem value="Any">Flexible / Any Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">Application Urgency</Label>
                <Select value={consultationData.urgency} onValueChange={(value: any) => updateData({ urgency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP - Need to apply within 1-2 months</SelectItem>
                    <SelectItem value="flexible">Flexible - 3-6 months timeline</SelectItem>
                    <SelectItem value="planning_ahead">Planning Ahead - 6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Personal Preferences</h2>
              <p className="text-slate-600 dark:text-slate-400">Tell us about your additional requirements</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">
                  What's Most Important to You? (Select all that apply)
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "low_cost", label: "Low Cost" },
                    { id: "scholarship", label: "Scholarship" },
                    { id: "quality_education", label: "Education Quality" },
                    { id: "location", label: "Specific Location" },
                    { id: "religious_facilities", label: "Religious Facilities" },
                    { id: "halal_food", label: "Halal Food" },
                  ].map((factor) => (
                    <Button
                      key={factor.id}
                      variant={consultationData.priorityFactors.includes(factor.id) ? "default" : "outline"}
                      onClick={() => {
                        const current = consultationData.priorityFactors
                        if (current.includes(factor.id)) {
                          updateData({ priorityFactors: current.filter((f) => f !== factor.id) })
                        } else {
                          updateData({ priorityFactors: [...current, factor.id] })
                        }
                      }}
                      className="h-12 text-sm"
                    >
                      {factor.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="work"
                    checked={consultationData.workWhileStudying}
                    onCheckedChange={(checked) => updateData({ workWhileStudying: !!checked })}
                  />
                  <Label htmlFor="work" className="text-slate-800 dark:text-slate-200">
                    I want to work while studying
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="scholarship"
                    checked={consultationData.scholarshipRequired}
                    onCheckedChange={(checked) => updateData({ scholarshipRequired: !!checked })}
                  />
                  <Label htmlFor="scholarship" className="text-slate-800 dark:text-slate-200">
                    I need scholarship opportunities
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="religious"
                    checked={consultationData.religiousFacilities}
                    onCheckedChange={(checked) => updateData({ religiousFacilities: !!checked })}
                  />
                  <Label htmlFor="religious" className="text-slate-800 dark:text-slate-200">
                    I need religious facilities
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="halal"
                    checked={consultationData.halalFood}
                    onCheckedChange={(checked) => updateData({ halalFood: !!checked })}
                  />
                  <Label htmlFor="halal" className="text-slate-800 dark:text-slate-200">
                    I need halal food options
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                Your Personalized Destination Matches
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                We found {matchedDestinations.length} destinations ranked by compatibility
              </p>
            </div>

            <div className="space-y-4">
              {matchedDestinations.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    No perfect matches found with your current criteria.
                  </p>
                  <div className="space-y-2 text-sm text-slate-500 dark:text-slate-500">
                    <p>Try adjusting:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Increase your budget or flexibility</li>
                      <li>Consider different study levels</li>
                      <li>Expand language preferences</li>
                    </ul>
                  </div>
                </div>
              ) : (
                matchedDestinations.map((destination, index) => (
                  <motion.div
                    key={destination.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`hover:shadow-lg transition-shadow ${
                        destination.recommendation === "highly_recommended"
                          ? "ring-2 ring-green-200 dark:ring-green-800 bg-green-50/30 dark:bg-green-950/20"
                          : destination.recommendation === "recommended"
                            ? "ring-1 ring-blue-200 dark:ring-blue-800 bg-blue-50/30 dark:bg-blue-950/20"
                            : destination.recommendation === "consider"
                              ? "ring-1 ring-yellow-200 dark:ring-yellow-800 bg-yellow-50/30 dark:bg-yellow-950/20"
                              : "ring-1 ring-gray-200 dark:ring-gray-700"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                              style={{
                                backgroundImage: `url(${destination.image_url || "/placeholder.svg"})`,
                              }}
                            />
                            <div>
                              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                {destination.name}
                              </h3>
                              <p className="text-slate-600 dark:text-slate-400">{destination.country}</p>
                              <div className="flex items-center mt-1">
                                {destination.recommendation === "highly_recommended" && (
                                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs">
                                    <Trophy className="h-3 w-3 mr-1" />
                                    Top Choice
                                  </Badge>
                                )}
                                {destination.recommendation === "recommended" && (
                                  <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Recommended
                                  </Badge>
                                )}
                                {destination.recommendation === "consider" && (
                                  <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Consider
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={`text-lg px-3 py-1 ${
                                destination.matchScore >= 80
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                  : destination.matchScore >= 60
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                                    : destination.matchScore >= 40
                                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400"
                              }`}
                            >
                              {destination.matchScore}% Match
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                          {destination.description}
                        </p>

                        {/* Match Reasons */}
                        <div className="space-y-3">
                          {destination.matchReasons.length > 0 && (
                            <div>
                              <p className="font-medium text-sm text-green-700 dark:text-green-400 mb-2 flex items-center">
                                <Check className="h-4 w-4 mr-1" />
                                Why this matches:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {destination.matchReasons.map((reason: string, i: number) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                                  >
                                    {reason}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {destination.matchWarnings.length > 0 && (
                            <div>
                              <p className="font-medium text-sm text-orange-700 dark:text-orange-400 mb-2 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Things to consider:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {destination.matchWarnings.map((warning: string, i: number) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800"
                                  >
                                    {warning}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 dark:bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="relative z-10 container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
            Destination Consultation
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Find your perfect study destination with AI-powered matching
          </p>
        </motion.div>

        {/* Progress */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <currentStepInfo.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{currentStepInfo.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{currentStepInfo.description}</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
              >
                Step {currentStep} of {STEPS.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isProcessing}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 dark:from-indigo-400 dark:to-purple-500 dark:hover:from-indigo-500 dark:hover:to-purple-600"
            >
              <span>
                {isProcessing ? "Finding Matches..." : currentStep === 4 ? "Find My Perfect Destinations" : "Continue"}
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Restart Option for Results Page */}
        {currentStep === 5 && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(1)
                setConsultationData({
                  studyLevel: "",
                  tuitionBudget: 0,
                  livingCostsBudget: 0,
                  serviceFeesBudget: 0,
                  totalBudget: 0,
                  budgetFlexibility: "flexible",
                  language: "",
                  languageLevel: "intermediate",
                  intakePeriod: "",
                  urgency: "flexible",
                  workWhileStudying: false,
                  scholarshipRequired: false,
                  religiousFacilities: false,
                  halalFood: false,
                  priorityFactors: [],
                })
                setMatchedDestinations([])
              }}
              className="flex items-center space-x-2"
            >
              <span>Start New Consultation</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

