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
  GraduationCap,
  DollarSign,
  Settings,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Check,
  AlertCircle,
  TrendingUp,
  Clock,
  FileText,
  MapPin,
  PiggyBank,
  CreditCard,
  Home,
  Calculator,
} from "lucide-react"
import { usePrograms } from "@/hooks/usePrograms"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useGuestRestrictions } from "@/components/layout/GuestModeWrapper"

const STEPS = [
  { id: 1, title: "Study Level & Field", icon: GraduationCap, description: "Choose your academic preferences" },
  { id: 2, title: "Budget Planning", icon: DollarSign, description: "Set your financial preferences" },
  { id: 3, title: "Academic Profile", icon: FileText, description: "Your academic background" },
  { id: 4, title: "Timeline & Preferences", icon: Settings, description: "Timeline and additional requirements" },
  { id: 5, title: "Your Matches", icon: Trophy, description: "Perfect programs for you" },
]

interface ConsultationData {
  studyLevel: string
  fieldOfStudy: string
  subjects: string[]
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
  duration: string
}

// Enhanced matching algorithm with detailed scoring
const calculateMatchScore = (program: any, consultationData: ConsultationData) => {
  let totalScore = 0
  let maxPossibleScore = 0
  const reasons: string[] = []
  const warnings: string[] = []
  const details: any = {}

  // 1. Study Level match (25% weight)
  const levelWeight = 25
  maxPossibleScore += levelWeight

  if (program.study_level === consultationData.studyLevel) {
    totalScore += levelWeight
    reasons.push(`Perfect match for ${consultationData.studyLevel} level`)
  } else {
    warnings.push(`Program is for ${program.study_level}, you selected ${consultationData.studyLevel}`)
  }

  // 2. Field/Subject match (25% weight)
  const fieldWeight = 25
  maxPossibleScore += fieldWeight

  let fieldMatch = false
  if (consultationData.subjects && consultationData.subjects.length > 0) {
    const userSubjects = consultationData.subjects.map((s) => s.toLowerCase())

    if (program.field_keywords && program.field_keywords.length > 0) {
      const programKeywords = program.field_keywords.map((k: string) => k.toLowerCase())
      fieldMatch = userSubjects.some((subject: string) =>
        programKeywords.some((keyword) => keyword.includes(subject) || subject.includes(keyword)),
      )
    }

    if (!fieldMatch && program.field) {
      const programField = program.field.toLowerCase()
      fieldMatch = userSubjects.some(
        (subject: string) => programField.includes(subject) || subject.includes(programField),
      )
    }
  }

  if (fieldMatch) {
    totalScore += fieldWeight
    reasons.push("Field matches your interests")
  } else if (consultationData.fieldOfStudy && program.field) {
    if (
      program.field.toLowerCase().includes(consultationData.fieldOfStudy.toLowerCase()) ||
      consultationData.fieldOfStudy.toLowerCase().includes(program.field.toLowerCase())
    ) {
      totalScore += fieldWeight * 0.8
      reasons.push("Field partially matches your interests")
    } else {
      warnings.push("Field may not match your interests")
    }
  }

  // 3. Budget Analysis (20% weight)
  const budgetWeight = 20
  maxPossibleScore += budgetWeight

  const tuitionMin = program.tuition_min || 0
  const tuitionMax = program.tuition_max || 0
  const livingCostAnnual = (program.living_cost_min || 0) * 12
  const totalMinCost = tuitionMin + livingCostAnnual
  const totalMaxCost = tuitionMax + (program.living_cost_max || program.living_cost_min || 0) * 12

  details.costs = {
    tuitionRange: [tuitionMin, tuitionMax],
    livingCostAnnual,
    totalRange: [totalMinCost, totalMaxCost],
  }

  if (consultationData.totalBudget >= totalMaxCost) {
    totalScore += budgetWeight
    reasons.push(
      `Comfortably within budget (€${totalMaxCost.toLocaleString()} vs €${consultationData.totalBudget.toLocaleString()})`,
    )
  } else if (consultationData.totalBudget >= totalMinCost) {
    const budgetRatio = (consultationData.totalBudget - totalMinCost) / (totalMaxCost - totalMinCost)
    totalScore += budgetWeight * (0.5 + budgetRatio * 0.5)
    reasons.push(`Within budget range`)
    if (consultationData.budgetFlexibility === "strict") {
      warnings.push(`May exceed strict budget by €${(totalMaxCost - consultationData.totalBudget).toLocaleString()}`)
    }
  } else {
    const shortfall = totalMinCost - consultationData.totalBudget
    if (consultationData.budgetFlexibility === "very_flexible" && shortfall <= consultationData.totalBudget * 0.2) {
      totalScore += budgetWeight * 0.3
      warnings.push(`Budget shortfall of €${shortfall.toLocaleString()}, but marked as very flexible`)
    } else {
      warnings.push(`Exceeds budget by €${shortfall.toLocaleString()}`)
    }
  }

  // 4. Language Requirements (15% weight)
  const languageWeight = 15
  maxPossibleScore += languageWeight

  const userLanguage = consultationData.language.toLowerCase()
  const programLanguage = program.program_language?.toLowerCase() || ""

  if (userLanguage === "any" || programLanguage.includes(userLanguage) || userLanguage.includes(programLanguage)) {
    const proficiencyMultiplier =
      {
        native: 1.0,
        advanced: 0.9,
        intermediate: 0.8,
        beginner: 0.6,
      }[consultationData.languageLevel] || 0.8

    totalScore += languageWeight * proficiencyMultiplier
    reasons.push(`Language compatible (${consultationData.languageLevel} level)`)

    if (consultationData.languageLevel === "beginner") {
      warnings.push("May require language preparation")
    }
  } else {
    warnings.push("Language requirements may not match")
  }

  // 5. Duration match (10% weight)
  const durationWeight = 10
  maxPossibleScore += durationWeight

  let preferredMonths = 0
  if (consultationData.duration === "semester") preferredMonths = 6
  else if (consultationData.duration === "year") preferredMonths = 12
  else if (consultationData.duration === "two_years") preferredMonths = 24
  else if (consultationData.duration === "full") preferredMonths = 36

  if (preferredMonths > 0 && program.duration_months) {
    const durationDiff = Math.abs(program.duration_months - preferredMonths)
    if (durationDiff <= 3) {
      totalScore += durationWeight
      reasons.push("Duration matches preference")
    } else if (durationDiff <= 6) {
      totalScore += durationWeight * 0.7
      reasons.push("Duration close to preference")
    }
  }

  // 6. GPA Requirements (5% weight)
  const gpaWeight = 5
  maxPossibleScore += gpaWeight

  const gpaMapping = {
    low: 11, // 10-12 average
    intermediate: 13, // 12-14 average
    high: 17, // 14-20 average
  }

  const userGPA = gpaMapping[consultationData.currentGPA as keyof typeof gpaMapping] || 15
  const requiredGPA = program.minimum_gpa || 12

  if (userGPA >= requiredGPA) {
    totalScore += gpaWeight
    reasons.push("Meets GPA requirements")
  } else {
    warnings.push("May not meet GPA requirements")
  }

  // Special requirements bonus
  consultationData.priorityFactors.forEach((factor) => {
    switch (factor) {
      case "low_cost":
        if (totalMinCost < consultationData.totalBudget * 0.8) {
          totalScore += 3
          reasons.push("Excellent value for money")
        }
        break
      case "scholarship":
        if (program.scholarship_available) {
          totalScore += 5
          reasons.push("Scholarship available")
        }
        break
      case "religious_facilities":
        if (program.religious_facilities) {
          totalScore += 3
          reasons.push("Religious facilities available")
        }
        break
      case "halal_food":
        if (program.halal_food_availability) {
          totalScore += 3
          reasons.push("Halal food available")
        }
        break
    }
  })

  // Special requirements checks
  if (consultationData.scholarshipRequired && !program.scholarship_available) {
    warnings.push("Scholarship required but not available")
  }

  if (consultationData.religiousFacilities && !program.religious_facilities) {
    warnings.push("Religious facilities required but not confirmed")
  }

  if (consultationData.halalFood && !program.halal_food_availability) {
    warnings.push("Halal food required but not confirmed")
  }

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
        : finalScore >= 60
          ? "recommended"
          : finalScore >= 40
            ? "consider"
            : "not_recommended",
  }
}

export default function ProgramConsultationFlow() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { isRestricted, handleRestrictedAction } = useGuestRestrictions()

  const [currentStep, setCurrentStep] = useState(1)
  const [consultationData, setConsultationData] = useState<ConsultationData>({
    studyLevel: "",
    fieldOfStudy: "",
    subjects: [],
    tuitionBudget: 0,
    livingCostsBudget: 0,
    serviceFeesBudget: 0,
    totalBudget: 0,
    budgetFlexibility: "flexible",
    language: "",
    languageLevel: "intermediate",
    currentGPA: "",
    previousEducationCountry: "",
    hasLanguageCertificate: false,
    intakePeriod: "",
    urgency: "flexible",
    workWhileStudying: false,
    scholarshipRequired: false,
    religiousFacilities: false,
    halalFood: false,
    priorityFactors: [],
    duration: "",
  })
  const [matchedPrograms, setMatchedPrograms] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch programs for matching
  const { data: programsData } = usePrograms({
    limit: 50, // Get more programs for better matching
    calculateMatchScores: false,
  })

  const progress = (currentStep / STEPS.length) * 100
  const currentStepInfo = STEPS[currentStep - 1]

  const updateData = (updates: Partial<ConsultationData>) => {
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
        return !!consultationData.studyLevel && !!consultationData.fieldOfStudy
      case 2:
        return consultationData.totalBudget > 0
      case 3:
        return !!consultationData.currentGPA
      case 4:
        return !!consultationData.intakePeriod && !!consultationData.duration
      default:
        return true
    }
  }

  // Enhanced matching algorithm
  const findMatches = () => {
    if (!programsData?.programs) return []

    const scoredPrograms = programsData.programs.map((program) => {
      const matchResult = calculateMatchScore(program, consultationData)
      return {
        ...program,
        matchScore: matchResult.score,
        matchReasons: matchResult.reasons,
        matchWarnings: matchResult.warnings,
        matchDetails: matchResult.details,
        recommendation: matchResult.recommendation,
      }
    })

    // Filter programs with minimum score threshold
    const minScoreThreshold = consultationData.budgetFlexibility === "strict" ? 50 : 30

    return scoredPrograms
      .filter((program) => program.matchScore >= minScoreThreshold)
      .sort((a, b) => {
        // Primary sort: recommendation level
        const recommendationOrder = { highly_recommended: 4, recommended: 3, consider: 2, not_recommended: 1 }
        const aOrder = recommendationOrder[a.recommendation as keyof typeof recommendationOrder] || 0
        const bOrder = recommendationOrder[b.recommendation as keyof typeof recommendationOrder] || 0

        if (aOrder !== bOrder) return bOrder - aOrder

        // Secondary sort: match score
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
        setMatchedPrograms(matches)

        // Save to database with enhanced data
        if (user && !isRestricted) {
          await supabase.from("consultation_results").insert({
            user_id: user.id,
            study_level: consultationData.studyLevel as any,
            budget: consultationData.totalBudget,
            language_preference: consultationData.language,
            field_preference: consultationData.fieldOfStudy,
            matched_programs: matches.map((m) => ({
              program_id: m.id,
              name: m.name,
              university: m.university,
              country: m.country,
              match_score: m.matchScore,
              reasons: m.matchReasons,
              warnings: m.matchWarnings,
              recommendation: m.recommendation,
            })),
            preferences_data: consultationData as any,
            work_while_studying: consultationData.workWhileStudying,
            scholarship_required: consultationData.scholarshipRequired,
          })

          toast({
            title: "Consultation Complete",
            description: `Found ${matches.length} matching programs with detailed analysis!`,
          })
        } else if (isRestricted) {
          toast({
            title: "Consultation Complete",
            description: `Found ${matches.length} matching programs! Sign up to save your results.`,
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
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">What do you want to study?</h2>
              <p className="text-slate-600 dark:text-slate-400">Choose your academic level and field of interest</p>
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
                        <GraduationCap className="h-6 w-6 mr-3" />
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

              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">Field of Study</Label>
                <Select
                  value={consultationData.fieldOfStudy}
                  onValueChange={(value) => updateData({ fieldOfStudy: value })}
                >
                  <SelectTrigger className="h-14 text-lg">
                    <SelectValue placeholder="Select your field of interest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Business & Management">Business & Management</SelectItem>
                    <SelectItem value="Engineering & Technology">Engineering & Technology</SelectItem>
                    <SelectItem value="Medicine & Health Sciences">Medicine & Health Sciences</SelectItem>
                    <SelectItem value="Arts & Humanities">Arts & Humanities</SelectItem>
                    <SelectItem value="Natural Sciences">Natural Sciences</SelectItem>
                    <SelectItem value="Social Sciences">Social Sciences</SelectItem>
                    <SelectItem value="Law">Law</SelectItem>
                    <SelectItem value="Computer Science & IT">Computer Science & IT</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">Specific Subjects (Optional)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Marketing",
                    "Finance",
                    "Computer Science",
                    "Medicine",
                    "Psychology",
                    "Engineering",
                    "Art",
                    "Literature",
                    "Mathematics",
                    "Physics",
                    "Chemistry",
                    "Biology",
                  ].map((subject) => (
                    <Button
                      key={subject}
                      variant={consultationData.subjects.includes(subject) ? "default" : "outline"}
                      onClick={() => {
                        const current = consultationData.subjects
                        if (current.includes(subject)) {
                          updateData({ subjects: current.filter((s) => s !== subject) })
                        } else {
                          updateData({ subjects: [...current, subject] })
                        }
                      }}
                      className="h-10 text-sm"
                    >
                      {subject}
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
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Academic Profile</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Tell us about your academic background and language skills
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">Current/Previous GPA Level</Label>
                <Select
                  value={consultationData.currentGPA}
                  onValueChange={(value) => updateData({ currentGPA: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your academic performance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (10-12/20)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (12-14/20)</SelectItem>
                    <SelectItem value="high">High (14-20/20)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">Country of Previous Education</Label>
                <Select
                  value={consultationData.previousEducationCountry}
                  onValueChange={(value) => updateData({ previousEducationCountry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Algeria">Algeria</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="language-cert"
                  checked={consultationData.hasLanguageCertificate}
                  onCheckedChange={(checked) => updateData({ hasLanguageCertificate: !!checked })}
                />
                <Label htmlFor="language-cert" className="text-slate-800 dark:text-slate-200">
                  I have official language certificates
                </Label>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Timeline & Final Preferences</h2>
              <p className="text-slate-600 dark:text-slate-400">
                When do you want to start and what's most important to you?
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
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
                <Label className="text-slate-800 dark:text-slate-200">Program Duration Preference</Label>
                <Select value={consultationData.duration} onValueChange={(value) => updateData({ duration: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semester">Short-term (semester)</SelectItem>
                    <SelectItem value="year">1 year</SelectItem>
                    <SelectItem value="two_years">2 years</SelectItem>
                    <SelectItem value="full">Full program (3+ years)</SelectItem>
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
                Your Personalized Program Matches
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                We found {matchedPrograms.length} programs ranked by compatibility
              </p>
            </div>

            <div className="space-y-4">
              {matchedPrograms.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    No perfect matches found with your current criteria.
                  </p>
                  <div className="space-y-2 text-sm text-slate-500 dark:text-slate-500">
                    <p>Try adjusting:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Increase your budget or flexibility</li>
                      <li>Consider different fields of study</li>
                      <li>Expand language preferences</li>
                    </ul>
                  </div>
                </div>
              ) : (
                matchedPrograms.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`hover:shadow-lg transition-shadow ${
                        program.recommendation === "highly_recommended"
                          ? "ring-2 ring-green-200 dark:ring-green-800 bg-green-50/30 dark:bg-green-950/20"
                          : program.recommendation === "recommended"
                            ? "ring-1 ring-blue-200 dark:ring-blue-800 bg-blue-50/30 dark:bg-blue-950/20"
                            : program.recommendation === "consider"
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
                                backgroundImage: `url(${program.image_url || "/placeholder.svg"})`,
                              }}
                            />
                            <div>
                              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{program.name}</h3>
                              <p className="text-slate-600 dark:text-slate-400">{program.university}</p>
                              <p className="text-slate-600 dark:text-slate-400 flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {program.city}, {program.country}
                              </p>
                              <div className="flex items-center mt-1">
                                {program.recommendation === "highly_recommended" && (
                                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs">
                                    <Trophy className="h-3 w-3 mr-1" />
                                    Top Choice
                                  </Badge>
                                )}
                                {program.recommendation === "recommended" && (
                                  <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Recommended
                                  </Badge>
                                )}
                                {program.recommendation === "consider" && (
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
                                program.matchScore >= 80
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                  : program.matchScore >= 60
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                                    : program.matchScore >= 40
                                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400"
                              }`}
                            >
                              {program.matchScore}% Match
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                          {program.description}
                        </p>

                        {/* Cost Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Tuition:</span>
                            <p className="text-gray-900 dark:text-gray-100">
                              €{program.tuition_min?.toLocaleString()} - €{program.tuition_max?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Duration:</span>
                            <p className="text-gray-900 dark:text-gray-100">{program.duration_months} months</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Language:</span>
                            <p className="text-gray-900 dark:text-gray-100">{program.program_language}</p>
                          </div>
                        </div>

                        {/* Match Reasons */}
                        <div className="space-y-3">
                          {program.matchReasons.length > 0 && (
                            <div>
                              <p className="font-medium text-sm text-green-700 dark:text-green-400 mb-2 flex items-center">
                                <Check className="h-4 w-4 mr-1" />
                                Why this matches:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {program.matchReasons.map((reason: string, i: number) => (
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

                          {program.matchWarnings.length > 0 && (
                            <div>
                              <p className="font-medium text-sm text-orange-700 dark:text-orange-400 mb-2 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Things to consider:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {program.matchWarnings.map((warning: string, i: number) => (
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

                        {/* Additional Information */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600 dark:text-slate-400">
                            <div>
                              <span className="font-medium">Level:</span>
                              <p>{program.study_level}</p>
                            </div>
                            <div>
                              <span className="font-medium">Field:</span>
                              <p>{program.field}</p>
                            </div>
                            <div>
                              <span className="font-medium">Scholarship:</span>
                              <p>{program.scholarship_available ? "Available" : "Not Available"}</p>
                            </div>
                            <div>
                              <span className="font-medium">Application Fee:</span>
                              <p>€{program.application_fee || 0}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}

              {matchedPrograms.length > 0 && (
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Next Steps:</h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                    <li>Review the detailed program information and requirements</li>
                    <li>Check language certificate requirements if applicable</li>
                    <li>Contact our consultants for personalized application guidance</li>
                    <li>Start preparing required documents for your top choices</li>
                  </ul>
                </div>
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
            Program Consultation
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Advanced algorithm analyzing your preferences to find your perfect study program
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
                {isProcessing ? "Analyzing Matches..." : currentStep === 4 ? "Find My Perfect Programs" : "Continue"}
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
                  fieldOfStudy: "",
                  subjects: [],
                  tuitionBudget: 0,
                  livingCostsBudget: 0,
                  serviceFeesBudget: 0,
                  totalBudget: 0,
                  budgetFlexibility: "flexible",
                  language: "",
                  languageLevel: "intermediate",
                  currentGPA: "",
                  previousEducationCountry: "",
                  hasLanguageCertificate: false,
                  intakePeriod: "",
                  urgency: "flexible",
                  workWhileStudying: false,
                  scholarshipRequired: false,
                  religiousFacilities: false,
                  halalFood: false,
                  priorityFactors: [],
                  duration: "",
                })
                setMatchedPrograms([])
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
