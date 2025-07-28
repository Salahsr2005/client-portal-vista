"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MapPin,
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
  GraduationCap,
  Languages,
  PiggyBank,
  CreditCard,
  Home,
  Calculator,
  Target,
  Globe,
  BookOpen,
  Calendar,
  Award,
  Zap,
  Star,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { useDestinations } from "@/hooks/useDestinations"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useGuestRestrictions } from "@/components/layout/GuestModeWrapper"
import { DestinationMatchingService, type ConsultationPreferences } from "@/services/DestinationMatchingService"

const CONSULTATION_STEPS = [
  {
    id: 1,
    title: "Study Goals",
    icon: Target,
    description: "Define your academic objectives and preferences",
  },
  {
    id: 2,
    title: "Budget Planning",
    icon: DollarSign,
    description: "Set your financial parameters and flexibility",
  },
  {
    id: 3,
    title: "Academic Profile",
    icon: BookOpen,
    description: "Your educational background and language skills",
  },
  {
    id: 4,
    title: "Timeline & Priorities",
    icon: Calendar,
    description: "When you want to start and what matters most",
  },
  {
    id: 5,
    title: "Your Perfect Matches",
    icon: Award,
    description: "Discover your ideal study destinations",
  },
]

const translations = {
  en: {
    title: "AI-Powered Destination Finder",
    subtitle: "Let our advanced algorithm find the perfect study destinations tailored to your unique profile",
    studyLevel: "Study Level",
    budgetPlanning: "Budget Planning",
    budgetSubtitle: "Set your budget ranges to find destinations that match your financial capacity",
    tuitionBudget: "Tuition Budget Range",
    livingCostsBudget: "Living Costs Budget Range",
    serviceFeesBudget: "Service Fees Budget Range",
    budgetFlexibility: "Budget Flexibility",
    strict: "Strict - Stay within budget",
    flexible: "Flexible - Up to 20% over",
    veryFlexible: "Very Flexible - Up to 50% over",
    academicProfile: "Academic Profile",
    academicSubtitle: "Help us understand your academic background and language capabilities",
    currentGPA: "Academic Performance Level",
    previousEducation: "Previous Education Country",
    preferredLanguages: "Preferred Study Languages",
    languageLevel: "Language Proficiency Level",
    hasLanguageCertificate: "I have official language certificates",
    timelinePreferences: "Timeline & Priorities",
    timelineSubtitle: "When do you want to start and what's most important to you?",
    intakePeriods: "Preferred Intake Periods",
    applicationUrgency: "Application Timeline",
    priorityFactors: "Priority Factors (Select all that apply)",
    specialRequirements: "Special Requirements",
    workWhileStudying: "I want to work while studying",
    scholarshipRequired: "I need scholarship opportunities",
    religiousFacilities: "I need religious facilities",
    halalFood: "I need halal food options",
    yourMatches: "Your AI-Recommended Destinations",
    matchesFound: "Found {count} destinations perfectly matched to your profile",
    analyzing: "Analyzing destinations...",
    findDestinations: "Find My Perfect Destinations",
    continue: "Continue",
    previous: "Previous",
    startNew: "Start New Consultation",
    nextSteps: "Recommended Next Steps",
    compatibility: "Compatibility",
    budgetAnalysis: "Budget Analysis",
    requirements: "Requirements",
    whyRecommended: "Why this destination matches you:",
    considerations: "Important considerations:",
    estimatedCosts: "Estimated Costs",
    tuitionRange: "Tuition Range",
    totalRange: "Total Cost Range",
  },
  fr: {
    title: "Recherche de Destination IA",
    subtitle:
      "Laissez notre algorithme avancé trouver les destinations d'études parfaites adaptées à votre profil unique",
    studyLevel: "Niveau d'Études",
    budgetPlanning: "Planification Budgétaire",
    budgetSubtitle:
      "Définissez vos fourchettes budgétaires pour trouver des destinations qui correspondent à votre capacité financière",
    tuitionBudget: "Fourchette Budget Frais de Scolarité",
    livingCostsBudget: "Fourchette Budget Coûts de Vie",
    serviceFeesBudget: "Fourchette Budget Frais de Service",
    budgetFlexibility: "Flexibilité Budgétaire",
    strict: "Strict - Rester dans le budget",
    flexible: "Flexible - Jusqu'à 20% de plus",
    veryFlexible: "Très Flexible - Jusqu'à 50% de plus",
    academicProfile: "Profil Académique",
    academicSubtitle: "Aidez-nous à comprendre votre parcours académique et vos capacités linguistiques",
    currentGPA: "Niveau de Performance Académique",
    previousEducation: "Pays d'Éducation Précédente",
    preferredLanguages: "Langues d'Études Préférées",
    languageLevel: "Niveau de Maîtrise Linguistique",
    hasLanguageCertificate: "J'ai des certificats de langue officiels",
    timelinePreferences: "Chronologie et Priorités",
    timelineSubtitle: "Quand voulez-vous commencer et qu'est-ce qui est le plus important pour vous?",
    intakePeriods: "Périodes d'Admission Préférées",
    applicationUrgency: "Chronologie de Candidature",
    priorityFactors: "Facteurs Prioritaires (Sélectionnez tout ce qui s'applique)",
    specialRequirements: "Exigences Spéciales",
    workWhileStudying: "Je veux travailler pendant mes études",
    scholarshipRequired: "J'ai besoin d'opportunités de bourses",
    religiousFacilities: "J'ai besoin d'installations religieuses",
    halalFood: "J'ai besoin d'options de nourriture halal",
    yourMatches: "Vos Destinations Recommandées par IA",
    matchesFound: "Trouvé {count} destinations parfaitement adaptées à votre profil",
    analyzing: "Analyse des destinations...",
    findDestinations: "Trouvez Mes Destinations Parfaites",
    continue: "Continuer",
    previous: "Précédent",
    startNew: "Commencer une Nouvelle Consultation",
    nextSteps: "Prochaines Étapes Recommandées",
    compatibility: "Compatibilité",
    budgetAnalysis: "Analyse Budgétaire",
    requirements: "Exigences",
    whyRecommended: "Pourquoi cette destination vous correspond:",
    considerations: "Considérations importantes:",
    estimatedCosts: "Coûts Estimés",
    tuitionRange: "Fourchette Frais de Scolarité",
    totalRange: "Fourchette Coût Total",
  },
}

export default function DestinationConsultationFlow() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { isRestricted } = useGuestRestrictions()

  const [currentStep, setCurrentStep] = useState(1)
  const [preferences, setPreferences] = useState<ConsultationPreferences>({
    studyLevel: "",
    userLanguage: "en",
    tuitionBudgetRange: [0, 6000],
    livingCostsBudgetRange: [800, 2500],
    serviceFeesBudgetRange: [200, 800],
    budgetFlexibility: "flexible",
    currentGPA: "intermediate",
    previousEducationCountry: "",
    preferredLanguages: [],
    languageLevel: "intermediate",
    hasLanguageCertificate: false,
    intakePeriods: [],
    urgency: "flexible",
    workWhileStudying: false,
    scholarshipRequired: false,
    religiousFacilities: false,
    halalFood: false,
    priorityFactors: [],
    preferredRegions: [],
    avoidRegions: [],
  })

  const [matchedDestinations, setMatchedDestinations] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const t = translations[preferences.userLanguage]

  const { data: destinationsData } = useDestinations({ limit: 100 })

  const progress = (currentStep / CONSULTATION_STEPS.length) * 100
  const currentStepInfo = CONSULTATION_STEPS[currentStep - 1]

  const updatePreferences = (updates: Partial<ConsultationPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }))
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!preferences.studyLevel
      case 2:
        return preferences.tuitionBudgetRange[1] > 0
      case 3:
        return preferences.preferredLanguages.length > 0
      case 4:
        return preferences.intakePeriods.length > 0
      default:
        return true
    }
  }

  const findMatches = () => {
    if (!destinationsData?.destinations) return []

    const results = DestinationMatchingService.findBestDestinations(destinationsData.destinations, preferences)

    return results.map((result, index) => ({
      ...destinationsData.destinations.find((d) => d.id === result.details.estimatedCosts),
      matchScore: result.score,
      matchReasons: result.reasons,
      matchWarnings: result.warnings,
      recommendation: result.recommendation,
      budgetAnalysis: result.budgetAnalysis,
      requirements: result.requirements,
      compatibilityBreakdown: result.compatibilityBreakdown,
      details: result.details,
      ...result,
    }))
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
            study_level: preferences.studyLevel as any,
            budget:
              preferences.tuitionBudgetRange[1] +
              preferences.livingCostsBudgetRange[1] +
              preferences.serviceFeesBudgetRange[1],
            language_preference: preferences.preferredLanguages.join(", "),
            destination_preference: "AI Recommended",
            matched_programs: matches.slice(0, 10).map((m) => ({
              destination_id: m.id,
              name: m.name,
              country: m.country,
              match_score: m.matchScore,
              reasons: m.matchReasons,
              warnings: m.matchWarnings,
              recommendation: m.recommendation,
            })),
            preferences_data: preferences as any,
            work_while_studying: preferences.workWhileStudying,
            scholarship_required: preferences.scholarshipRequired,
          })
        }

        toast({
          title: "Analysis Complete!",
          description: `Found ${matches.length} perfectly matched destinations for you!`,
        })

        setCurrentStep(5)
      } catch (error) {
        console.error("Error in consultation:", error)
        toast({
          title: "Analysis Error",
          description: "Please try again or contact support.",
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

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "highly_recommended":
        return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
      case "recommended":
        return "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
      case "consider":
        return "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
      default:
        return "bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800"
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "highly_recommended":
        return <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
      case "recommended":
        return <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case "consider":
        return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      default:
        return <Info className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">
                {preferences.userLanguage === "fr" ? "Définissez vos objectifs d'études" : "Define Your Study Goals"}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {preferences.userLanguage === "fr"
                  ? "Commençons par comprendre ce que vous recherchez dans votre parcours d'études à l'étranger"
                  : "Let's start by understanding what you're looking for in your study abroad journey"}
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
              {/* Language Selection */}
              <Card className="border-2 border-dashed border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    {preferences.userLanguage === "fr" ? "Langue de Consultation" : "Consultation Language"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={preferences.userLanguage === "en" ? "default" : "outline"}
                      onClick={() => updatePreferences({ userLanguage: "en" })}
                      className="h-14 text-lg"
                    >
                      <Languages className="h-5 w-5 mr-2" />
                      English
                    </Button>
                    <Button
                      variant={preferences.userLanguage === "fr" ? "default" : "outline"}
                      onClick={() => updatePreferences({ userLanguage: "fr" })}
                      className="h-14 text-lg"
                    >
                      <Languages className="h-5 w-5 mr-2" />
                      Français
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Study Level Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    {t.studyLevel}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {["Bachelor", "Master", "PhD"].map((level) => (
                      <Button
                        key={level}
                        variant={preferences.studyLevel === level ? "default" : "outline"}
                        onClick={() => updatePreferences({ studyLevel: level })}
                        className="h-20 text-left justify-start p-6"
                      >
                        <div className="flex items-center w-full">
                          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                            <GraduationCap className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-lg">{level}</div>
                            <div className="text-sm text-muted-foreground">
                              {level === "Bachelor" &&
                                (preferences.userLanguage === "fr"
                                  ? "Diplôme de premier cycle (3-4 ans)"
                                  : "Undergraduate degree (3-4 years)")}
                              {level === "Master" &&
                                (preferences.userLanguage === "fr"
                                  ? "Diplôme d'études supérieures (1-2 ans)"
                                  : "Graduate degree (1-2 years)")}
                              {level === "PhD" &&
                                (preferences.userLanguage === "fr"
                                  ? "Diplôme de doctorat (3-5 ans)"
                                  : "Doctoral degree (3-5 years)")}
                            </div>
                          </div>
                          {preferences.studyLevel === level && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">{t.budgetPlanning}</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t.budgetSubtitle}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {/* Budget Overview */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                      {preferences.userLanguage === "fr" ? "Aperçu Budgétaire Total" : "Total Budget Overview"}
                    </h3>
                    <div className="text-4xl font-bold text-slate-800 dark:text-slate-100">
                      {formatCurrency(
                        preferences.tuitionBudgetRange[1] +
                          preferences.livingCostsBudgetRange[1] +
                          preferences.serviceFeesBudgetRange[1],
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                      {preferences.userLanguage === "fr" ? "Budget maximum annuel" : "Maximum annual budget"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-white/80 dark:bg-slate-800/80 rounded-xl">
                      <PiggyBank className="w-10 h-10 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                      <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {formatCurrency(preferences.tuitionBudgetRange[0])} -{" "}
                        {formatCurrency(preferences.tuitionBudgetRange[1])}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{t.tuitionBudget}</div>
                    </div>
                    <div className="text-center p-6 bg-white/80 dark:bg-slate-800/80 rounded-xl">
                      <Home className="w-10 h-10 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                      <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {formatCurrency(preferences.livingCostsBudgetRange[0])} -{" "}
                        {formatCurrency(preferences.livingCostsBudgetRange[1])}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{t.livingCostsBudget}</div>
                    </div>
                    <div className="text-center p-6 bg-white/80 dark:bg-slate-800/80 rounded-xl">
                      <CreditCard className="w-10 h-10 mx-auto mb-3 text-green-600 dark:text-green-400" />
                      <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {formatCurrency(preferences.serviceFeesBudgetRange[0])} -{" "}
                        {formatCurrency(preferences.serviceFeesBudgetRange[1])}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{t.serviceFeesBudget}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Budget Sliders */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tuition Budget */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PiggyBank className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      {t.tuitionBudget}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>€0</span>
                        <span>€12,000</span>
                      </div>
                      <Slider
                        value={preferences.tuitionBudgetRange}
                        onValueChange={(value) => updatePreferences({ tuitionBudgetRange: value as [number, number] })}
                        max={12000}
                        min={0}
                        step={250}
                        className="w-full"
                      />
                      <div className="text-center">
                        <Badge variant="outline" className="text-lg px-4 py-2">
                          {formatCurrency(preferences.tuitionBudgetRange[0])} -{" "}
                          {formatCurrency(preferences.tuitionBudgetRange[1])}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Living Costs Budget */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      {t.livingCostsBudget}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>€500</span>
                        <span>€5,000</span>
                      </div>
                      <Slider
                        value={preferences.livingCostsBudgetRange}
                        onValueChange={(value) =>
                          updatePreferences({ livingCostsBudgetRange: value as [number, number] })
                        }
                        max={5000}
                        min={500}
                        step={100}
                        className="w-full"
                      />
                      <div className="text-center">
                        <Badge variant="outline" className="text-lg px-4 py-2">
                          {formatCurrency(preferences.livingCostsBudgetRange[0])} -{" "}
                          {formatCurrency(preferences.livingCostsBudgetRange[1])}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Fees Budget */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                      {t.serviceFeesBudget}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>€100</span>
                        <span>€1,000</span>
                      </div>
                      <Slider
                        value={preferences.serviceFeesBudgetRange}
                        onValueChange={(value) =>
                          updatePreferences({ serviceFeesBudgetRange: value as [number, number] })
                        }
                        max={1000}
                        min={100}
                        step={50}
                        className="w-full"
                      />
                      <div className="text-center">
                        <Badge variant="outline" className="text-lg px-4 py-2">
                          {formatCurrency(preferences.serviceFeesBudgetRange[0])} -{" "}
                          {formatCurrency(preferences.serviceFeesBudgetRange[1])}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Budget Flexibility */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {t.budgetFlexibility}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        id: "strict",
                        label: t.strict,
                        desc:
                          preferences.userLanguage === "fr"
                            ? "Respecter strictement le budget"
                            : "Stay strictly within budget",
                      },
                      {
                        id: "flexible",
                        label: t.flexible,
                        desc:
                          preferences.userLanguage === "fr"
                            ? "Jusqu'à 20% de dépassement acceptable"
                            : "Up to 20% over budget acceptable",
                      },
                      {
                        id: "very_flexible",
                        label: t.veryFlexible,
                        desc:
                          preferences.userLanguage === "fr"
                            ? "Jusqu'à 50% de dépassement acceptable"
                            : "Up to 50% over budget acceptable",
                      },
                    ].map((option) => (
                      <Button
                        key={option.id}
                        variant={preferences.budgetFlexibility === option.id ? "default" : "outline"}
                        onClick={() => updatePreferences({ budgetFlexibility: option.id as any })}
                        className="h-auto p-6 flex flex-col items-center space-y-3 text-center"
                      >
                        <div className="font-semibold text-lg">{option.label}</div>
                        <div className="text-sm opacity-75">{option.desc}</div>
                        {preferences.budgetFlexibility === option.id && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">{t.academicProfile}</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t.academicSubtitle}</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              {/* Academic Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {t.currentGPA}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        id: "low",
                        label: preferences.userLanguage === "fr" ? "Satisfaisant" : "Satisfactory",
                        desc: preferences.userLanguage === "fr" ? "10-12/20 ou équivalent" : "10-12/20 or equivalent",
                        color: "from-yellow-500 to-orange-500",
                      },
                      {
                        id: "intermediate",
                        label: preferences.userLanguage === "fr" ? "Bien" : "Good",
                        desc: preferences.userLanguage === "fr" ? "12-14/20 ou équivalent" : "12-14/20 or equivalent",
                        color: "from-blue-500 to-indigo-500",
                      },
                      {
                        id: "high",
                        label: preferences.userLanguage === "fr" ? "Très Bien" : "Excellent",
                        desc: preferences.userLanguage === "fr" ? "14-20/20 ou équivalent" : "14-20/20 or equivalent",
                        color: "from-green-500 to-emerald-500",
                      },
                    ].map((level) => (
                      <Button
                        key={level.id}
                        variant={preferences.currentGPA === level.id ? "default" : "outline"}
                        onClick={() => updatePreferences({ currentGPA: level.id as any })}
                        className="h-24 flex flex-col items-center justify-center space-y-2 text-center"
                      >
                        <div
                          className={`w-8 h-8 bg-gradient-to-r ${level.color} rounded-full flex items-center justify-center`}
                        >
                          <Star className="h-4 w-4 text-white" />
                        </div>
                        <div className="font-semibold">{level.label}</div>
                        <div className="text-xs opacity-75">{level.desc}</div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Previous Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {t.previousEducation}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={preferences.previousEducationCountry}
                    onValueChange={(value) => updatePreferences({ previousEducationCountry: value })}
                  >
                    <SelectTrigger className="h-14 text-lg">
                      <SelectValue
                        placeholder={
                          preferences.userLanguage === "fr"
                            ? "Sélectionnez votre pays d'éducation"
                            : "Select your education country"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Algeria">
                        {preferences.userLanguage === "fr" ? "Algérie" : "Algeria"}
                      </SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Morocco">{preferences.userLanguage === "fr" ? "Maroc" : "Morocco"}</SelectItem>
                      <SelectItem value="Tunisia">
                        {preferences.userLanguage === "fr" ? "Tunisie" : "Tunisia"}
                      </SelectItem>
                      <SelectItem value="UK">
                        {preferences.userLanguage === "fr" ? "Royaume-Uni" : "United Kingdom"}
                      </SelectItem>
                      <SelectItem value="US">
                        {preferences.userLanguage === "fr" ? "États-Unis" : "United States"}
                      </SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Germany">
                        {preferences.userLanguage === "fr" ? "Allemagne" : "Germany"}
                      </SelectItem>
                      <SelectItem value="Other">{preferences.userLanguage === "fr" ? "Autre" : "Other"}</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Language Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    {t.preferredLanguages}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { id: "English", label: preferences.userLanguage === "fr" ? "Anglais" : "English" },
                      { id: "French", label: preferences.userLanguage === "fr" ? "Français" : "French" },
                      { id: "German", label: preferences.userLanguage === "fr" ? "Allemand" : "German" },
                      { id: "Spanish", label: preferences.userLanguage === "fr" ? "Espagnol" : "Spanish" },
                      { id: "Italian", label: preferences.userLanguage === "fr" ? "Italien" : "Italian" },
                      { id: "Dutch", label: preferences.userLanguage === "fr" ? "Néerlandais" : "Dutch" },
                      { id: "Portuguese", label: preferences.userLanguage === "fr" ? "Portugais" : "Portuguese" },
                      { id: "Any", label: preferences.userLanguage === "fr" ? "Toute langue" : "Any Language" },
                    ].map((lang) => (
                      <Button
                        key={lang.id}
                        variant={preferences.preferredLanguages.includes(lang.id) ? "default" : "outline"}
                        onClick={() => {
                          const current = preferences.preferredLanguages
                          if (current.includes(lang.id)) {
                            updatePreferences({ preferredLanguages: current.filter((l) => l !== lang.id) })
                          } else {
                            updatePreferences({ preferredLanguages: [...current, lang.id] })
                          }
                        }}
                        className="h-12 text-sm"
                      >
                        {lang.label}
                        {preferences.preferredLanguages.includes(lang.id) && <CheckCircle2 className="h-4 w-4 ml-2" />}
                      </Button>
                    ))}
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">{t.languageLevel}</Label>
                      <Select
                        value={preferences.languageLevel}
                        onValueChange={(value: any) => updatePreferences({ languageLevel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">
                            {preferences.userLanguage === "fr" ? "Débutant" : "Beginner"}
                          </SelectItem>
                          <SelectItem value="intermediate">
                            {preferences.userLanguage === "fr" ? "Intermédiaire" : "Intermediate"}
                          </SelectItem>
                          <SelectItem value="advanced">
                            {preferences.userLanguage === "fr" ? "Avancé" : "Advanced"}
                          </SelectItem>
                          <SelectItem value="native">
                            {preferences.userLanguage === "fr" ? "Langue maternelle" : "Native Speaker"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-semibold">
                        {preferences.userLanguage === "fr" ? "Certifications" : "Certifications"}
                      </Label>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg">
                        <Checkbox
                          id="language-cert"
                          checked={preferences.hasLanguageCertificate}
                          onCheckedChange={(checked) => updatePreferences({ hasLanguageCertificate: !!checked })}
                        />
                        <Label htmlFor="language-cert" className="text-sm">
                          {t.hasLanguageCertificate}
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">{t.timelinePreferences}</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t.timelineSubtitle}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {/* Intake Periods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {t.intakePeriods}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { id: "September", label: preferences.userLanguage === "fr" ? "Septembre" : "September" },
                      { id: "January", label: preferences.userLanguage === "fr" ? "Janvier" : "January" },
                      { id: "February", label: preferences.userLanguage === "fr" ? "Février" : "February" },
                      { id: "March", label: preferences.userLanguage === "fr" ? "Mars" : "March" },
                      { id: "May", label: preferences.userLanguage === "fr" ? "Mai" : "May" },
                      { id: "Fall", label: preferences.userLanguage === "fr" ? "Automne" : "Fall" },
                      { id: "Spring", label: preferences.userLanguage === "fr" ? "Printemps" : "Spring" },
                      { id: "Any", label: preferences.userLanguage === "fr" ? "Flexible" : "Flexible" },
                    ].map((period) => (
                      <Button
                        key={period.id}
                        variant={preferences.intakePeriods.includes(period.id) ? "default" : "outline"}
                        onClick={() => {
                          const current = preferences.intakePeriods
                          if (current.includes(period.id)) {
                            updatePreferences({ intakePeriods: current.filter((p) => p !== period.id) })
                          } else {
                            updatePreferences({ intakePeriods: [...current, period.id] })
                          }
                        }}
                        className="h-14 text-sm"
                      >
                        {period.label}
                        {preferences.intakePeriods.includes(period.id) && <CheckCircle2 className="h-4 w-4 ml-2" />}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Application Urgency */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {t.applicationUrgency}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        id: "asap",
                        label: preferences.userLanguage === "fr" ? "Urgent" : "ASAP",
                        desc:
                          preferences.userLanguage === "fr"
                            ? "Besoin de postuler dans 1-2 mois"
                            : "Need to apply within 1-2 months",
                        icon: Zap,
                        color: "from-red-500 to-pink-500",
                      },
                      {
                        id: "flexible",
                        label: preferences.userLanguage === "fr" ? "Flexible" : "Flexible",
                        desc: preferences.userLanguage === "fr" ? "Délai de 3-6 mois" : "3-6 months timeline",
                        icon: Clock,
                        color: "from-blue-500 to-indigo-500",
                      },
                      {
                        id: "planning_ahead",
                        label: preferences.userLanguage === "fr" ? "Planification" : "Planning Ahead",
                        desc: preferences.userLanguage === "fr" ? "6+ mois à l'avance" : "6+ months ahead",
                        icon: Calendar,
                        color: "from-green-500 to-emerald-500",
                      },
                    ].map((urgency) => (
                      <Button
                        key={urgency.id}
                        variant={preferences.urgency === urgency.id ? "default" : "outline"}
                        onClick={() => updatePreferences({ urgency: urgency.id as any })}
                        className="h-24 flex flex-col items-center justify-center space-y-2 text-center"
                      >
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${urgency.color} rounded-full flex items-center justify-center`}
                        >
                          <urgency.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="font-semibold">{urgency.label}</div>
                        <div className="text-xs opacity-75">{urgency.desc}</div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Priority Factors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {t.priorityFactors}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: "low_cost", label: preferences.userLanguage === "fr" ? "Coût faible" : "Low Cost" },
                      { id: "scholarship", label: preferences.userLanguage === "fr" ? "Bourses" : "Scholarships" },
                      {
                        id: "quality_education",
                        label: preferences.userLanguage === "fr" ? "Qualité éducation" : "Education Quality",
                      },
                      {
                        id: "work_opportunities",
                        label: preferences.userLanguage === "fr" ? "Opportunités travail" : "Work Opportunities",
                      },
                      {
                        id: "cultural_diversity",
                        label: preferences.userLanguage === "fr" ? "Diversité culturelle" : "Cultural Diversity",
                      },
                      {
                        id: "research_opportunities",
                        label: preferences.userLanguage === "fr" ? "Recherche" : "Research",
                      },
                    ].map((factor) => (
                      <Button
                        key={factor.id}
                        variant={preferences.priorityFactors.includes(factor.id) ? "default" : "outline"}
                        onClick={() => {
                          const current = preferences.priorityFactors
                          if (current.includes(factor.id)) {
                            updatePreferences({ priorityFactors: current.filter((f) => f !== factor.id) })
                          } else {
                            updatePreferences({ priorityFactors: [...current, factor.id] })
                          }
                        }}
                        className="h-14 text-sm"
                      >
                        {factor.label}
                        {preferences.priorityFactors.includes(factor.id) && <CheckCircle2 className="h-4 w-4 ml-2" />}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Special Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {t.specialRequirements}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { id: "workWhileStudying", label: t.workWhileStudying, key: "workWhileStudying" },
                      { id: "scholarshipRequired", label: t.scholarshipRequired, key: "scholarshipRequired" },
                      { id: "religiousFacilities", label: t.religiousFacilities, key: "religiousFacilities" },
                      { id: "halalFood", label: t.halalFood, key: "halalFood" },
                    ].map((req) => (
                      <div key={req.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                        <Checkbox
                          id={req.id}
                          checked={preferences[req.key as keyof ConsultationPreferences] as boolean}
                          onCheckedChange={(checked) => updatePreferences({ [req.key]: !!checked })}
                        />
                        <Label htmlFor={req.id} className="text-sm font-medium">
                          {req.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">{t.yourMatches}</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                {t.matchesFound.replace("{count}", matchedDestinations.length.toString())}
              </p>
            </div>

            <div className="space-y-6">
              {matchedDestinations.length === 0 ? (
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="text-center py-12">
                    <AlertCircle className="h-16 w-16 text-slate-400 dark:text-slate-600 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                      {preferences.userLanguage === "fr" ? "Aucune correspondance trouvée" : "No matches found"}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      {preferences.userLanguage === "fr"
                        ? "Essayez d'ajuster vos préférences pour trouver plus d'options."
                        : "Try adjusting your preferences to find more options."}
                    </p>
                    <Button onClick={() => setCurrentStep(1)} variant="outline">
                      {preferences.userLanguage === "fr" ? "Modifier les préférences" : "Modify Preferences"}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {matchedDestinations.map((destination, index) => (
                    <motion.div
                      key={destination.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`${getRecommendationColor(destination.recommendation)} border-2`}>
                        <CardContent className="p-8">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-6">
                              <div
                                className="w-20 h-20 rounded-xl bg-cover bg-center flex-shrink-0 border-2 border-white dark:border-slate-700 shadow-lg"
                                style={{
                                  backgroundImage: `url(${destination.image_url || "/placeholder.svg?height=80&width=80&text=Flag"})`,
                                }}
                              />
                              <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                  {destination.name || `Destination ${index + 1}`}
                                </h3>
                                <p className="text-lg text-slate-600 dark:text-slate-400 flex items-center mb-3">
                                  <MapPin className="h-5 w-5 mr-2" />
                                  {destination.country || "Unknown Country"}
                                </p>
                                <div className="flex items-center space-x-3">
                                  <Badge className="flex items-center gap-2 px-3 py-1">
                                    {getRecommendationIcon(destination.recommendation)}
                                    {destination.recommendation === "highly_recommended" &&
                                      (preferences.userLanguage === "fr"
                                        ? "Fortement Recommandé"
                                        : "Highly Recommended")}
                                    {destination.recommendation === "recommended" &&
                                      (preferences.userLanguage === "fr" ? "Recommandé" : "Recommended")}
                                    {destination.recommendation === "consider" &&
                                      (preferences.userLanguage === "fr" ? "À Considérer" : "Consider")}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                                {destination.matchScore || 0}%
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">{t.compatibility}</div>
                            </div>
                          </div>

                          {/* Description */}
                          {destination.description && (
                            <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed">
                              {destination.description}
                            </p>
                          )}

                          {/* Compatibility Breakdown */}
                          {destination.compatibilityBreakdown && (
                            <div className="mb-6">
                              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                <TrendingUp className="h-5 w-5 mr-2" />
                                {preferences.userLanguage === "fr"
                                  ? "Analyse de Compatibilité"
                                  : "Compatibility Analysis"}
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(destination.compatibilityBreakdown).map(([key, value]) => (
                                  <div
                                    key={key}
                                    className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg"
                                  >
                                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                                      {Math.round(value as number)}%
                                    </div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                                      {key === "budget" && (preferences.userLanguage === "fr" ? "Budget" : "Budget")}
                                      {key === "academic" &&
                                        (preferences.userLanguage === "fr" ? "Académique" : "Academic")}
                                      {key === "language" &&
                                        (preferences.userLanguage === "fr" ? "Langue" : "Language")}
                                      {key === "timeline" &&
                                        (preferences.userLanguage === "fr" ? "Chronologie" : "Timeline")}
                                      {key === "requirements" &&
                                        (preferences.userLanguage === "fr" ? "Exigences" : "Requirements")}
                                      {key === "opportunities" &&
                                        (preferences.userLanguage === "fr" ? "Opportunités" : "Opportunities")}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Estimated Costs */}
                          {destination.details?.estimatedCosts && (
                            <div className="mb-6">
                              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                <Calculator className="h-5 w-5 mr-2" />
                                {t.estimatedCosts}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                  <PiggyBank className="h-6 w-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                                  <div className="font-semibold text-slate-900 dark:text-white">
                                    {formatCurrency(destination.details.estimatedCosts.tuitionRange[0])} -{" "}
                                    {formatCurrency(destination.details.estimatedCosts.tuitionRange[1])}
                                  </div>
                                  <div className="text-sm text-slate-600 dark:text-slate-400">{t.tuitionRange}</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                                  <Home className="h-6 w-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                                  <div className="font-semibold text-slate-900 dark:text-white">
                                    {formatCurrency(destination.details.estimatedCosts.livingCosts)}
                                  </div>
                                  <div className="text-sm text-slate-600 dark:text-slate-400">
                                    {preferences.userLanguage === "fr" ? "Coûts de Vie" : "Living Costs"}
                                  </div>
                                </div>
                                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                  <CreditCard className="h-6 w-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                                  <div className="font-semibold text-slate-900 dark:text-white">
                                    {formatCurrency(destination.details.estimatedCosts.serviceFees)}
                                  </div>
                                  <div className="text-sm text-slate-600 dark:text-slate-400">
                                    {preferences.userLanguage === "fr" ? "Frais de Service" : "Service Fees"}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 text-center p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-lg">
                                <div className="text-xl font-bold text-slate-900 dark:text-white">
                                  {formatCurrency(destination.details.estimatedCosts.totalRange[0])} -{" "}
                                  {formatCurrency(destination.details.estimatedCosts.totalRange[1])}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">{t.totalRange}</div>
                              </div>
                            </div>
                          )}

                          {/* Match Reasons and Warnings */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {destination.matchReasons && destination.matchReasons.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center">
                                  <CheckCircle2 className="h-5 w-5 mr-2" />
                                  {t.whyRecommended}
                                </h4>
                                <div className="space-y-2">
                                  {destination.matchReasons.map((reason: string, i: number) => (
                                    <div key={i} className="flex items-start space-x-2">
                                      <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                      <span className="text-sm text-slate-700 dark:text-slate-300">{reason}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {destination.matchWarnings && destination.matchWarnings.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-3 flex items-center">
                                  <AlertTriangle className="h-5 w-5 mr-2" />
                                  {t.considerations}
                                </h4>
                                <div className="space-y-2">
                                  {destination.matchWarnings.map((warning: string, i: number) => (
                                    <div key={i} className="flex items-start space-x-2">
                                      <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                                      <span className="text-sm text-slate-700 dark:text-slate-300">{warning}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  {/* Next Steps */}
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                        <Sparkles className="h-6 w-6 mr-2" />
                        {t.nextSteps}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              1
                            </div>
                            <span className="text-blue-800 dark:text-blue-200">
                              {preferences.userLanguage === "fr"
                                ? "Examinez les détails de chaque destination recommandée"
                                : "Review the details of each recommended destination"}
                            </span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              2
                            </div>
                            <span className="text-blue-800 dark:text-blue-200">
                              {preferences.userLanguage === "fr"
                                ? "Vérifiez les exigences spécifiques et les documents nécessaires"
                                : "Check specific requirements and necessary documents"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              3
                            </div>
                            <span className="text-blue-800 dark:text-blue-200">
                              {preferences.userLanguage === "fr"
                                ? "Contactez nos consultants pour un accompagnement personnalisé"
                                : "Contact our consultants for personalized guidance"}
                            </span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              4
                            </div>
                            <span className="text-blue-800 dark:text-blue-200">
                              {preferences.userLanguage === "fr"
                                ? "Commencez votre processus de candidature"
                                : "Begin your application process"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
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
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 dark:bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="relative z-10 container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 rounded-full shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">{t.subtitle}</p>
        </motion.div>

        {/* Progress */}
        <Card className="mb-12 border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
                  <currentStepInfo.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white">{currentStepInfo.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{currentStepInfo.description}</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 px-4 py-2 text-lg"
              >
                {preferences.userLanguage === "fr" ? "Étape" : "Step"} {currentStep}{" "}
                {preferences.userLanguage === "fr" ? "de" : "of"} {CONSULTATION_STEPS.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm mb-12">
          <CardContent className="p-12">
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
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-8 py-4 text-lg bg-transparent"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>{t.previous}</span>
            </Button>

            <div className="flex items-center space-x-4">
              {!isStepValid() && (
                <Alert className="max-w-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {preferences.userLanguage === "fr"
                      ? "Veuillez compléter tous les champs requis"
                      : "Please complete all required fields"}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleNext}
                disabled={!isStepValid() || isProcessing}
                className="flex items-center space-x-2 px-8 py-4 text-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 dark:from-indigo-400 dark:to-purple-500 dark:hover:from-indigo-500 dark:hover:to-purple-600"
              >
                {isProcessing && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{isProcessing ? t.analyzing : currentStep === 4 ? t.findDestinations : t.continue}</span>
                {!isProcessing && <ChevronRight className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        )}

        {/* Restart Option for Results Page */}
        {currentStep === 5 && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(1)
                setPreferences({
                  studyLevel: "",
                  userLanguage: "en",
                  tuitionBudgetRange: [0, 6000],
                  livingCostsBudgetRange: [800, 2500],
                  serviceFeesBudgetRange: [200, 800],
                  budgetFlexibility: "flexible",
                  currentGPA: "intermediate",
                  previousEducationCountry: "",
                  preferredLanguages: [],
                  languageLevel: "intermediate",
                  hasLanguageCertificate: false,
                  intakePeriods: [],
                  urgency: "flexible",
                  workWhileStudying: false,
                  scholarshipRequired: false,
                  religiousFacilities: false,
                  halalFood: false,
                  priorityFactors: [],
                  preferredRegions: [],
                  avoidRegions: [],
                })
                setMatchedDestinations([])
              }}
              className="flex items-center space-x-2 px-8 py-4 text-lg"
            >
              <span>{t.startNew}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


