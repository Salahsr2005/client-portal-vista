"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  GraduationCap,
  DollarSign,
  Settings,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MapPin,
  Check,
  AlertCircle,
  TrendingUp,
  Clock,
  FileText,
  Globe,
} from "lucide-react"
import { usePrograms } from "@/hooks/usePrograms"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useGuestRestrictions } from "@/components/layout/GuestModeWrapper"

const STEPS = [
  { id: 1, title: "Study Level & Field", icon: GraduationCap, description: "Choose your academic preferences" },
  { id: 2, title: "Budget & Financial Info", icon: DollarSign, description: "Set your financial preferences" },
  { id: 3, title: "Language & Location", icon: Globe, description: "Language and regional preferences" },
  { id: 4, title: "Academic Profile", icon: FileText, description: "Your academic background" },
  { id: 5, title: "Timeline & Preferences", icon: Settings, description: "Timeline and additional requirements" },
  { id: 6, title: "Your Matches", icon: Trophy, description: "Perfect programs for you" },
]

interface ConsultationData {
  studyLevel: string
  fieldOfStudy: string
  subjects: string[]
  totalBudget: number
  budgetFlexibility: "strict" | "flexible" | "very_flexible"
  includeServiceFees: boolean
  language: string
  languageLevel: "beginner" | "intermediate" | "advanced" | "native"
  regionPreference: string[]
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

  // 5. Location match (10% weight)
  const locationWeight = 10
  maxPossibleScore += locationWeight

  if (
    consultationData.regionPreference.length > 0 &&
    !consultationData.regionPreference.includes("Any") &&
    consultationData.regionPreference.some((region) => program.country?.toLowerCase().includes(region.toLowerCase()))
  ) {
    totalScore += locationWeight
    reasons.push("Matches regional preference")
  } else if (consultationData.regionPreference.includes("Any")) {
    totalScore += locationWeight
  }

  // 6. Duration match (5% weight)
  const durationWeight = 5
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
    totalBudget: 0,
    budgetFlexibility: "flexible",
    includeServiceFees: true,
    language: "",
    languageLevel: "intermediate",
    regionPreference: [],
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
    setConsultationData((prev) => ({ ...prev, ...updates }))
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!consultationData.studyLevel && !!consultationData.fieldOfStudy
      case 2:
        return consultationData.totalBudget > 0
      case 3:
        return !!consultationData.language
      case 4:
        return !!consultationData.currentGPA
      case 5:
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
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1)
    } else if (currentStep === 5) {
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
            destination_preference: consultationData.regionPreference.join(", ") || "Any",
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

        setCurrentStep(6)
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">What do you want to study?</h2>
              <p className="text-muted-foreground">Choose your academic level and field of interest</p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <Label>Study Level</Label>
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
                <Label>Field of Study</Label>
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
                <Label>Specific Subjects (Optional)</Label>
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
              <h2 className="text-2xl font-bold mb-2">Budget & Financial Information</h2>
              <p className="text-muted-foreground">Help us understand your financial situation</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <Label>Total Available Budget (EUR per year)</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "€5,000 - €10,000", value: 10000 },
                    { label: "€10,000 - €15,000", value: 15000 },
                    { label: "€15,000 - €25,000", value: 25000 },
                    { label: "€25,000+", value: 30000 },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={consultationData.totalBudget === option.value ? "default" : "outline"}
                      onClick={() => updateData({ totalBudget: option.value })}
                      className="h-16 text-sm"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-budget">Or enter custom amount:</Label>
                  <Input
                    id="custom-budget"
                    type="number"
                    placeholder="Enter amount in EUR"
                    value={consultationData.totalBudget || ""}
                    onChange={(e) => updateData({ totalBudget: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Budget Flexibility</Label>
                <Select
                  value={consultationData.budgetFlexibility}
                  onValueChange={(value: any) => updateData({ budgetFlexibility: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strict">Strict - Cannot exceed budget</SelectItem>
                    <SelectItem value="flexible">Flexible - Can exceed by 10-15%</SelectItem>
                    <SelectItem value="very_flexible">Very Flexible - Open to higher costs for quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="service-fees"
                  checked={consultationData.includeServiceFees}
                  onCheckedChange={(checked) => updateData({ includeServiceFees: !!checked })}
                />
                <Label htmlFor="service-fees">Include agency service fees in calculations</Label>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Language & Location Preferences</h2>
              <p className="text-muted-foreground">Tell us about your language skills and location preferences</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <Label>Preferred Study Language</Label>
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
                <Label>Your Language Proficiency Level</Label>
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
                <Label>Regional Preferences (Optional)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Europe", "North America", "Asia", "Oceania", "Any"].map((region) => (
                    <Button
                      key={region}
                      variant={consultationData.regionPreference.includes(region) ? "default" : "outline"}
                      onClick={() => {
                        const current = consultationData.regionPreference
                        if (region === "Any") {
                          updateData({ regionPreference: ["Any"] })
                        } else {
                          const filtered = current.filter((r) => r !== "Any")
                          if (current.includes(region)) {
                            updateData({ regionPreference: filtered.filter((r) => r !== region) })
                          } else {
                            updateData({ regionPreference: [...filtered, region] })
                          }
                        }
                      }}
                      className="h-12 text-sm"
                    >
                      {region}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="language-cert"
                  checked={consultationData.hasLanguageCertificate}
                  onCheckedChange={(checked) => updateData({ hasLanguageCertificate: !!checked })}
                />
                <Label htmlFor="language-cert">I have official language certificates</Label>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Academic Profile</h2>
              <p className="text-muted-foreground">Tell us about your academic background</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <Label>Current/Previous GPA Level</Label>
                <Select
                  value={consultationData.currentGPA}
                  onValueChange={(value) => updateData({ currentGPA: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your academic performance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Excellent (A/90%+/First Class)</SelectItem>
                    <SelectItem value="B">Very Good (B/80-89%/Upper Second)</SelectItem>
                    <SelectItem value="C">Good (C/70-79%/Lower Second)</SelectItem>
                    <SelectItem value="D">Satisfactory (D/60-69%/Third Class)</SelectItem>
                    <SelectItem value="F">Below Average (Below 60%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Country of Previous Education</Label>
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
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Timeline & Final Preferences</h2>
              <p className="text-muted-foreground">When do you want to start and what's most important to you?</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <Label>Preferred Intake Period</Label>
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
                <Label>Program Duration Preference</Label>
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
                <Label>Application Urgency</Label>
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
                <Label>What's Most Important to You? (Select all that apply)</Label>
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
                  <Label htmlFor="work">I want to work while studying</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="scholarship"
                    checked={consultationData.scholarshipRequired}
                    onCheckedChange={(checked) => updateData({ scholarshipRequired: !!checked })}
                  />
                  <Label htmlFor="scholarship">I need scholarship opportunities</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="religious"
                    checked={consultationData.religiousFacilities}
                    onCheckedChange={(checked) => updateData({ religiousFacilities: !!checked })}
                  />
                  <Label htmlFor="religious">I need religious facilities</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="halal"
                    checked={consultationData.halalFood}
                    onCheckedChange={(checked) => updateData({ halalFood: !!checked })}
                  />
                  <Label htmlFor="halal">I need halal food options</Label>
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your Personalized Program Matches</h2>
              <p className="text-muted-foreground">
                We found {matchedPrograms.length} programs ranked by compatibility
              </p>
            </div>

            <div className="space-y-4">
              {matchedPrograms.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No perfect matches found with your current criteria.</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Try adjusting:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Increase your budget or flexibility</li>
                      <li>Consider different fields of study</li>
                      <li>Expand language or regional preferences</li>
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
                          ? "ring-2 ring-green-200 bg-green-50/30"
                          : program.recommendation === "recommended"
                            ? "ring-1 ring-blue-200 bg-blue-50/30"
                            : program.recommendation === "consider"
                              ? "ring-1 ring-yellow-200 bg-yellow-50/30"
                              : "ring-1 ring-gray-200"
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
                              <h3 className="text-xl font-semibold">{program.name}</h3>
                              <p className="text-muted-foreground">{program.university}</p>
                              <p className="text-muted-foreground flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {program.city}, {program.country}
                              </p>
                              <div className="flex items-center mt-1">
                                {program.recommendation === "highly_recommended" && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    <Trophy className="h-3 w-3 mr-1" />
                                    Top Choice
                                  </Badge>
                                )}
                                {program.recommendation === "recommended" && (
                                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Recommended
                                  </Badge>
                                )}
                                {program.recommendation === "consider" && (
                                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
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
                                  ? "bg-green-100 text-green-800"
                                  : program.matchScore >= 60
                                    ? "bg-blue-100 text-blue-800"
                                    : program.matchScore >= 40
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {program.matchScore}% Match
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{program.description}</p>

                        {/* Cost Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4 p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-700">Tuition:</span>
                            <p className="text-gray-900">
                              €{program.tuition_min?.toLocaleString()} - €{program.tuition_max?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Duration:</span>
                            <p className="text-gray-900">{program.duration_months} months</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Language:</span>
                            <p className="text-gray-900">{program.program_language}</p>
                          </div>
                        </div>

                        {/* Match Reasons */}
                        <div className="space-y-3">
                          {program.matchReasons.length > 0 && (
                            <div>
                              <p className="font-medium text-sm text-green-700 mb-2 flex items-center">
                                <Check className="h-4 w-4 mr-1" />
                                Why this matches:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {program.matchReasons.map((reason: string, i: number) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs bg-green-50 text-green-700 border-green-200"
                                  >
                                    {reason}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {program.matchWarnings.length > 0 && (
                            <div>
                              <p className="font-medium text-sm text-orange-700 mb-2 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Things to consider:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {program.matchWarnings.map((warning: string, i: number) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                                  >
                                    {warning}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Additional Information */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
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
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI-Powered Program Matching
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced algorithm analyzing your preferences to find your perfect study program
          </p>
        </motion.div>

        {/* Progress */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <currentStepInfo.icon className="w-6 h-6 text-indigo-600" />
                <div>
                  <h3 className="font-semibold text-lg">{currentStepInfo.title}</h3>
                  <p className="text-sm text-muted-foreground">{currentStepInfo.description}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                Step {currentStep} of {STEPS.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-8">
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
        {currentStep < 6 && (
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
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <span>
                {isProcessing ? "Analyzing Matches..." : currentStep === 5 ? "Find My Perfect Programs" : "Continue"}
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Restart Option for Results Page */}
        {currentStep === 6 && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(1)
                setConsultationData({
                  studyLevel: "",
                  fieldOfStudy: "",
                  subjects: [],
                  totalBudget: 0,
                  budgetFlexibility: "flexible",
                  includeServiceFees: true,
                  language: "",
                  languageLevel: "intermediate",
                  regionPreference: [],
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
