"use client"

import type React from "react"
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
import { Input } from "@/components/ui/input"
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
  Search,
  Languages,
  Globe,
  BookOpen,
  Target,
  Calendar,
  User,
  Star,
  Award,
  Zap,
  Heart,
  Shield,
} from "lucide-react"
import { usePrograms } from "@/hooks/usePrograms"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useGuestRestrictions } from "@/components/layout/GuestModeWrapper"
import { BilingualFieldService, type FieldTranslation } from "@/services/BilingualFieldService"
import {
  EnhancedProgramMatchingService,
  type EnhancedConsultationData,
} from "@/services/EnhancedProgramMatchingService"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    id: 1,
    title: "Academic Preferences",
    icon: GraduationCap,
    description: "Study level and field selection",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Budget Planning",
    icon: DollarSign,
    description: "Financial planning and preferences",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 3,
    title: "Academic Profile",
    icon: FileText,
    description: "Your educational background",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    title: "Preferences & Timeline",
    icon: Settings,
    description: "Timeline and additional requirements",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 5,
    title: "Perfect Matches",
    icon: Trophy,
    description: "Your personalized program recommendations",
    color: "from-amber-500 to-yellow-500",
  },
]

// Budget intervals configuration
const BUDGET_INTERVALS = {
  tuition: {
    min: 0,
    max: 12000,
    step: 500,
    intervals: [
      { label: "Free", min: 0, max: 0 },
      { label: "€1,000 - €3,000", min: 1000, max: 3000 },
      { label: "€3,000 - €6,000", min: 3000, max: 6000 },
      { label: "€6,000 - €9,000", min: 6000, max: 9000 },
      { label: "€9,000 - €12,000", min: 9000, max: 12000 },
    ],
  },
  living: {
    min: 0,
    max: 2000,
    step: 100,
    intervals: [
      { label: "€300 - €600", min: 300, max: 600 },
      { label: "€600 - €1,000", min: 600, max: 1000 },
      { label: "€1,000 - €1,500", min: 1000, max: 1500 },
      { label: "€1,500 - €2,000", min: 1500, max: 2000 },
    ],
  },
  services: {
    min: 0,
    max: 1000,
    step: 50,
    intervals: [
      { label: "€100 - €300", min: 100, max: 300 },
      { label: "€300 - €500", min: 300, max: 500 },
      { label: "€500 - €750", min: 500, max: 750 },
      { label: "€750 - €1,000", min: 750, max: 1000 },
    ],
  },
}

// Translations
const translations = {
  en: {
    title: "Program Consultation",
    subtitle: "Advanced matching algorithm to find your perfect study program",
    searchLanguage: "Search Language",
    studyLevel: "Study Level",
    fieldOfStudy: "Field of Study",
    searchPlaceholder: "Search for a field of study...",
    selected: "Selected",
    specificSubjects: "Specific Subjects (Optional)",
    planBudget: "Plan your budget",
    budgetSubtitle: "Set your budget for different categories to find options that fit your financial plan",
    totalBudgetOverview: "Total Budget Overview",
    tuitionFees: "Tuition Fees",
    livingCosts: "Living Costs (Monthly)",
    serviceFees: "Service & Application Fees",
    budgetFlexibility: "Budget Flexibility",
    strict: "Strict",
    flexible: "Flexible",
    veryFlexible: "Very Flexible",
    stayWithinBudget: "Stay within budget",
    upTo20Over: "Up to 20% over",
    upTo50Over: "Up to 50% over",
    academicProfile: "Academic Profile",
    academicSubtitle: "Tell us about your academic background and language skills",
    currentGPA: "Current/Previous GPA Level",
    previousEducation: "Country of Previous Education",
    preferredLanguage: "Preferred Study Language",
    languageProficiency: "Your Language Proficiency Level",
    languageCertificates: "I have official language certificates",
    timelinePreferences: "Timeline & Final Preferences",
    timelineSubtitle: "When do you want to start and what's most important to you?",
    intakePeriod: "Preferred Intake Period",
    durationPreference: "Program Duration Preference",
    applicationUrgency: "Application Urgency",
    mostImportant: "What's Most Important to You? (Select all that apply)",
    workWhileStudying: "I want to work while studying",
    needScholarship: "I need scholarship opportunities",
    needReligious: "I need religious facilities",
    needHalal: "I need halal food options",
    yourMatches: "Your Personalized Program Matches",
    matchesFound: "We found {count} programs ranked by compatibility",
    nextSteps: "Next Steps:",
    continue: "Continue",
    findPrograms: "Find My Perfect Programs",
    analyzing: "Analyzing Matches...",
    startNew: "Start New Consultation",
    budgetRange: "Budget Range",
    selectBudgetRange: "Select your budget range",
    customAmount: "Custom Amount",
  },
  fr: {
    title: "Consultation de Programme",
    subtitle: "Algorithme de correspondance avancé pour trouver votre programme d'études parfait",
    searchLanguage: "Langue de Recherche",
    studyLevel: "Niveau d'Études",
    fieldOfStudy: "Domaine d'Études",
    searchPlaceholder: "Rechercher un domaine d'études...",
    selected: "Sélectionné",
    specificSubjects: "Matières Spécifiques (Optionnel)",
    planBudget: "Planifiez votre budget",
    budgetSubtitle:
      "Définissez votre budget pour différentes catégories pour trouver des options qui correspondent à votre plan financier",
    totalBudgetOverview: "Aperçu du Budget Total",
    tuitionFees: "Frais de Scolarité",
    livingCosts: "Coûts de la Vie (Mensuel)",
    serviceFees: "Frais de Service et de Candidature",
    budgetFlexibility: "Flexibilité du Budget",
    strict: "Strict",
    flexible: "Flexible",
    veryFlexible: "Très Flexible",
    stayWithinBudget: "Rester dans le budget",
    upTo20Over: "Jusqu'à 20% de plus",
    upTo50Over: "Jusqu'à 50% de plus",
    academicProfile: "Profil Académique",
    academicSubtitle: "Parlez-nous de votre parcours académique et de vos compétences linguistiques",
    currentGPA: "Niveau GPA Actuel/Précédent",
    previousEducation: "Pays d'Éducation Précédente",
    preferredLanguage: "Langue d'Études Préférée",
    languageProficiency: "Votre Niveau de Maîtrise Linguistique",
    languageCertificates: "J'ai des certificats de langue officiels",
    timelinePreferences: "Chronologie et Préférences Finales",
    timelineSubtitle: "Quand voulez-vous commencer et qu'est-ce qui est le plus important pour vous?",
    intakePeriod: "Période d'Admission Préférée",
    durationPreference: "Préférence de Durée du Programme",
    applicationUrgency: "Urgence de la Candidature",
    mostImportant: "Qu'est-ce qui est le Plus Important pour Vous? (Sélectionnez tout ce qui s'applique)",
    workWhileStudying: "Je veux travailler pendant mes études",
    needScholarship: "J'ai besoin d'opportunités de bourses",
    needReligious: "J'ai besoin d'installations religieuses",
    needHalal: "J'ai besoin d'options de nourriture halal",
    yourMatches: "Vos Correspondances de Programmes Personnalisées",
    matchesFound: "Nous avons trouvé {count} programmes classés par compatibilité",
    nextSteps: "Prochaines Étapes:",
    continue: "Continuer",
    findPrograms: "Trouvez Mes Programmes Parfaits",
    analyzing: "Analyse des Correspondances...",
    startNew: "Commencer une Nouvelle Consultation",
    budgetRange: "Gamme de Budget",
    selectBudgetRange: "Sélectionnez votre gamme de budget",
    customAmount: "Montant Personnalisé",
  },
}

export default function ProgramConsultationFlow() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { isRestricted, handleRestrictedAction } = useGuestRestrictions()
  const isMobile = useIsMobile()

  const [currentStep, setCurrentStep] = useState(1)
  const [consultationData, setConsultationData] = useState<EnhancedConsultationData>({
    studyLevel: "",
    fieldOfStudy: "",
    fieldSearchQuery: "",
    userLanguage: "en",
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

  const [fieldSearchResults, setFieldSearchResults] = useState<FieldTranslation[]>([])
  const [showFieldSuggestions, setShowFieldSuggestions] = useState(false)
  const [matchedPrograms, setMatchedPrograms] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Budget selection states
  const [tuitionBudgetType, setTuitionBudgetType] = useState<"interval" | "custom">("interval")
  const [livingBudgetType, setLivingBudgetType] = useState<"interval" | "custom">("interval")
  const [servicesBudgetType, setServicesBudgetType] = useState<"interval" | "custom">("interval")

  // Get translations based on user language
  const t = translations[consultationData.userLanguage]

  // Fetch programs for matching
  const { data: programsData } = usePrograms({
    limit: 100,
    calculateMatchScores: false,
  })

  const progress = (currentStep / STEPS.length) * 100
  const currentStepInfo = STEPS[currentStep - 1]

  const updateData = (updates: Partial<EnhancedConsultationData>) => {
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

  const handleFieldSearch = (query: string) => {
    updateData({ fieldSearchQuery: query })

    if (query.length >= 2) {
      // Enhanced search that matches exact words and keywords only
      const results = BilingualFieldService.searchFields(query, consultationData.userLanguage).filter((field) => {
        const searchTerm = query.toLowerCase()
        const englishMatch =
          field.english.toLowerCase().includes(searchTerm) ||
          field.keywords_en.some((keyword) => keyword.toLowerCase().includes(searchTerm))
        const frenchMatch =
          field.french.toLowerCase().includes(searchTerm) ||
          field.keywords_fr.some((keyword) => keyword.toLowerCase().includes(searchTerm))

        // Only exact word/keyword matches, no partial letter matching
        return (englishMatch || frenchMatch) && searchTerm.length >= 2
      })

      setFieldSearchResults(results.slice(0, 8))
      setShowFieldSuggestions(true)
    } else {
      setFieldSearchResults([])
      setShowFieldSuggestions(false)
    }
  }

  const selectFieldFromSuggestion = (field: FieldTranslation) => {
    const fieldName = consultationData.userLanguage === "fr" ? field.french : field.english
    updateData({
      fieldOfStudy: field.english, // Always store English for database consistency
      fieldSearchQuery: fieldName,
    })
    setShowFieldSuggestions(false)
    setFieldSearchResults([])
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!consultationData.studyLevel && (!!consultationData.fieldOfStudy || !!consultationData.fieldSearchQuery)
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

  // Enhanced matching algorithm with exact field matching only
  const findMatches = () => {
    if (!programsData?.programs) return []

    // First, filter programs by search query if provided
    let filteredPrograms = programsData.programs
    if (consultationData.fieldSearchQuery) {
      filteredPrograms = EnhancedProgramMatchingService.searchPrograms(
        programsData.programs,
        consultationData.fieldSearchQuery,
        consultationData.userLanguage,
      )
    }

    // Then sort by relevance using enhanced matching (exact matches only)
    const sortedPrograms = EnhancedProgramMatchingService.sortProgramsByRelevance(filteredPrograms, consultationData)

    // Filter programs with minimum score threshold
    const minScoreThreshold = consultationData.budgetFlexibility === "strict" ? 60 : 40

    return sortedPrograms
      .filter((program) => program.matchResult.score >= minScoreThreshold)
      .map((program) => ({
        ...program,
        matchScore: program.matchResult.score,
        matchReasons: program.matchResult.reasons,
        matchWarnings: program.matchResult.warnings,
        matchDetails: program.matchResult.details,
        fieldMatchDetails: program.matchResult.fieldMatchDetails,
        recommendation: program.matchResult.recommendation,
      }))
      .slice(0, 20) // Limit to top 20 matches
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
            field_keywords: consultationData.fieldSearchQuery
              ? [consultationData.fieldSearchQuery]
              : consultationData.subjects,
            matched_programs: matches.map((m) => ({
              program_id: m.id,
              name: m.name,
              university: m.university,
              country: m.country,
              match_score: m.matchScore,
              reasons: m.matchReasons,
              warnings: m.matchWarnings,
              recommendation: m.recommendation,
              field_match_details: m.fieldMatchDetails,
            })),
            preferences_data: consultationData as any,
            work_while_studying: consultationData.workWhileStudying,
            scholarship_required: consultationData.scholarshipRequired,
          })

          toast({
            title: "Consultation Complete",
            description: `Found ${matches.length} matching programs with exact field matching!`,
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

  const renderBudgetSelector = (
    type: "tuition" | "living" | "services",
    currentValue: number,
    budgetType: "interval" | "custom",
    setBudgetType: (type: "interval" | "custom") => void,
    onValueChange: (value: number) => void,
    icon: React.ComponentType<any>,
    title: string,
    color: string,
  ) => {
    const config = BUDGET_INTERVALS[type]
    const Icon = icon

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group"
      >
        <Card className="bg-gradient-to-br from-white to-gray-50/50 dark:from-slate-800 dark:to-slate-900/50 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
          <CardContent className={cn("p-6", isMobile && "p-4")}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${color.replace("text-", "from-").replace(" dark:text-", " to-")} shadow-lg`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3
                      className={cn("font-bold text-slate-800 dark:text-slate-200", isMobile ? "text-lg" : "text-xl")}
                    >
                      {title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Set your budget range</p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={cn("font-bold text-slate-800 dark:text-slate-200", isMobile ? "text-lg" : "text-2xl")}
                  >
                    {formatCurrency(currentValue)}
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {budgetType === "interval" ? "Range" : "Custom"}
                  </Badge>
                </div>
              </div>

              {/* Budget Type Toggle */}
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <Button
                  variant={budgetType === "interval" ? "default" : "ghost"}
                  size={isMobile ? "sm" : "default"}
                  onClick={() => setBudgetType("interval")}
                  className="flex-1 rounded-lg"
                >
                  <Target className="h-4 w-4 mr-2" />
                  {t.budgetRange}
                </Button>
                <Button
                  variant={budgetType === "custom" ? "default" : "ghost"}
                  size={isMobile ? "sm" : "default"}
                  onClick={() => setBudgetType("custom")}
                  className="flex-1 rounded-lg"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  {t.customAmount}
                </Button>
              </div>

              {budgetType === "interval" ? (
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {config.intervals.map((interval, index) => (
                      <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant={currentValue >= interval.min && currentValue <= interval.max ? "default" : "outline"}
                          onClick={() => onValueChange(interval.max)}
                          className={cn(
                            "w-full justify-between h-auto p-4 text-left",
                            currentValue >= interval.min &&
                              currentValue <= interval.max &&
                              "ring-2 ring-blue-500 shadow-lg",
                          )}
                        >
                          <div>
                            <div className="font-semibold">{interval.label}</div>
                            {interval.min === interval.max && interval.min === 0 && (
                              <div className="text-sm text-muted-foreground">No cost option</div>
                            )}
                          </div>
                          {currentValue >= interval.min && currentValue <= interval.max && (
                            <Check className="h-5 w-5 text-green-500" />
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <Slider
                      value={[currentValue]}
                      onValueChange={(value) => onValueChange(value[0])}
                      max={config.max}
                      min={config.min}
                      step={config.step}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                      <span>€{config.min}</span>
                      <span>€{config.max.toLocaleString()}</span>
                    </div>
                  </div>
                  <Input
                    type="number"
                    value={currentValue}
                    onChange={(e) => onValueChange(Number(e.target.value))}
                    min={config.min}
                    max={config.max}
                    className="text-center text-lg font-semibold"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl"
              >
                <GraduationCap className="h-10 w-10 text-white" />
              </motion.div>
              <h2
                className={cn(
                  "font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent",
                  isMobile ? "text-2xl" : "text-3xl",
                )}
              >
                {consultationData.userLanguage === "fr" ? "Que voulez-vous étudier?" : "What do you want to study?"}
              </h2>
              <p className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-base" : "text-lg")}>
                {consultationData.userLanguage === "fr"
                  ? "Choisissez votre niveau académique et domaine d'intérêt"
                  : "Choose your academic level and field of interest"}
              </p>
            </div>

            <div className={cn("mx-auto space-y-8", isMobile ? "max-w-full" : "max-w-2xl")}>
              {/* Language Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  {t.searchLanguage}
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant={consultationData.userLanguage === "en" ? "default" : "outline"}
                      onClick={() => updateData({ userLanguage: "en" })}
                      className="w-full h-16 text-lg font-semibold"
                      size="lg"
                    >
                      <Globe className="mr-3 h-6 w-6" />
                      English
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant={consultationData.userLanguage === "fr" ? "default" : "outline"}
                      onClick={() => updateData({ userLanguage: "fr" })}
                      className="w-full h-16 text-lg font-semibold"
                      size="lg"
                    >
                      <Globe className="mr-3 h-6 w-6" />
                      Français
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Study Level Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {t.studyLevel}
                </Label>
                <div className="grid grid-cols-1 gap-4">
                  {["Bachelor", "Master", "PhD"].map((level, index) => (
                    <motion.div
                      key={level}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={consultationData.studyLevel === level ? "default" : "outline"}
                        onClick={() => updateData({ studyLevel: level })}
                        className={cn(
                          "w-full justify-start h-20 text-left p-6",
                          consultationData.studyLevel === level && "ring-2 ring-blue-500 shadow-lg",
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-xl ${
                              level === "Bachelor"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                : level === "Master"
                                  ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                  : "bg-gradient-to-r from-purple-500 to-pink-500"
                            } shadow-lg`}
                          >
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-lg">{level}</div>
                            <div className="text-sm text-muted-foreground">
                              {level === "Bachelor" &&
                                (consultationData.userLanguage === "fr"
                                  ? "Diplôme de premier cycle (3-4 ans)"
                                  : "Undergraduate degree (3-4 years)")}
                              {level === "Master" &&
                                (consultationData.userLanguage === "fr"
                                  ? "Diplôme d'études supérieures (1-2 ans)"
                                  : "Graduate degree (1-2 years)")}
                              {level === "PhD" &&
                                (consultationData.userLanguage === "fr"
                                  ? "Diplôme de doctorat (3-5 ans)"
                                  : "Doctoral degree (3-5 years)")}
                            </div>
                          </div>
                        </div>
                        {consultationData.studyLevel === level && <Check className="h-6 w-6 text-green-500 ml-auto" />}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Field Search */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4 relative"
              >
                <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  {t.fieldOfStudy} {consultationData.userLanguage === "fr" ? "(Français)" : "(English)"}
                </Label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 h-5 w-5" />
                  <Input
                    placeholder={t.searchPlaceholder}
                    value={consultationData.fieldSearchQuery}
                    onChange={(e) => handleFieldSearch(e.target.value)}
                    className={cn(
                      "pl-12 h-16 text-lg border-2 focus:border-blue-500",
                      isMobile ? "text-base" : "text-lg",
                    )}
                    onFocus={() => {
                      if (fieldSearchResults.length > 0) {
                        setShowFieldSuggestions(true)
                      }
                    }}
                  />
                </div>

                {/* Field Suggestions */}
                <AnimatePresence>
                  {showFieldSuggestions && fieldSearchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full mt-2"
                    >
                      <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-2xl backdrop-blur-sm">
                        <CardContent className="p-2">
                          <div className="space-y-1">
                            {fieldSearchResults.map((field, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start h-auto p-4 text-left hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                  onClick={() => selectFieldFromSuggestion(field)}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                                      <BookOpen className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <div className="font-semibold">
                                        {consultationData.userLanguage === "fr" ? field.french : field.english}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {field.category} •{" "}
                                        {consultationData.userLanguage === "fr" ? field.english : field.french}
                                      </div>
                                    </div>
                                  </div>
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selected Field Display */}
                <AnimatePresence>
                  {consultationData.fieldOfStudy && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-blue-900 dark:text-blue-100">
                              {t.selected}: {consultationData.fieldSearchQuery || consultationData.fieldOfStudy}
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                              {BilingualFieldService.getFieldTranslation(consultationData.fieldOfStudy)?.category}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateData({ fieldOfStudy: "", fieldSearchQuery: "" })}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Additional Subjects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  {t.specificSubjects}
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                  ].map((subject, index) => (
                    <motion.div
                      key={subject}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={consultationData.subjects.includes(subject) ? "default" : "outline"}
                        onClick={() => {
                          const current = consultationData.subjects
                          if (current.includes(subject)) {
                            updateData({ subjects: current.filter((s) => s !== subject) })
                          } else {
                            updateData({ subjects: [...current, subject] })
                          }
                        }}
                        className={cn(
                          "w-full h-12 text-sm font-medium",
                          consultationData.subjects.includes(subject) && "ring-2 ring-blue-500 shadow-lg",
                        )}
                      >
                        {consultationData.subjects.includes(subject) && <Check className="h-4 w-4 mr-2" />}
                        {subject}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl"
              >
                <DollarSign className="h-10 w-10 text-white" />
              </motion.div>
              <h2
                className={cn(
                  "font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent",
                  isMobile ? "text-2xl" : "text-3xl",
                )}
              >
                {t.planBudget}
              </h2>
              <p className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-base" : "text-lg")}>
                {t.budgetSubtitle}
              </p>
            </div>

            {/* Budget Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={cn("mx-auto", isMobile ? "max-w-full" : "max-w-4xl")}
            >
              <Card className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200/20 dark:border-green-800/20 shadow-2xl">
                <CardContent className={cn(isMobile ? "p-6" : "p-8")}>
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-6">
                      <Calculator className="text-green-600 dark:text-green-400 h-8 w-8" />
                      <h3
                        className={cn(
                          "font-bold text-slate-800 dark:text-slate-100",
                          isMobile ? "text-xl" : "text-2xl",
                        )}
                      >
                        {t.totalBudgetOverview}
                      </h3>
                    </div>
                    <motion.div
                      key={consultationData.totalBudget}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={cn(
                        "font-bold mb-4 text-slate-800 dark:text-slate-100",
                        isMobile ? "text-3xl" : "text-5xl",
                      )}
                    >
                      {formatCurrency(consultationData.totalBudget)}
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        icon: PiggyBank,
                        amount: consultationData.tuitionBudget,
                        label: t.tuitionFees,
                        color: "from-blue-500 to-cyan-500",
                      },
                      {
                        icon: Home,
                        amount: consultationData.livingCostsBudget,
                        label: t.livingCosts,
                        color: "from-purple-500 to-pink-500",
                      },
                      {
                        icon: CreditCard,
                        amount: consultationData.serviceFeesBudget,
                        label: t.serviceFees,
                        color: "from-orange-500 to-red-500",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="text-center p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
                      >
                        <div
                          className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg`}
                        >
                          <item.icon className="h-8 w-8 text-white" />
                        </div>
                        <div
                          className={cn(
                            "font-bold text-slate-800 dark:text-slate-100 mb-2",
                            isMobile ? "text-lg" : "text-xl",
                          )}
                        >
                          {formatCurrency(item.amount)}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">{item.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Budget Selectors */}
            <div className={cn("mx-auto space-y-8", isMobile ? "max-w-full" : "max-w-4xl")}>
              {/* Tuition Budget */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                {renderBudgetSelector(
                  "tuition",
                  consultationData.tuitionBudget,
                  tuitionBudgetType,
                  setTuitionBudgetType,
                  (value) => updateData({ tuitionBudget: value }),
                  PiggyBank,
                  t.tuitionFees,
                  "text-blue-600 dark:text-blue-400",
                )}
              </motion.div>

              {/* Living Costs Budget */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                {renderBudgetSelector(
                  "living",
                  consultationData.livingCostsBudget,
                  livingBudgetType,
                  setLivingBudgetType,
                  (value) => updateData({ livingCostsBudget: value }),
                  Home,
                  t.livingCosts,
                  "text-purple-600 dark:text-purple-400",
                )}
              </motion.div>

              {/* Service Fees Budget */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                {renderBudgetSelector(
                  "services",
                  consultationData.serviceFeesBudget,
                  servicesBudgetType,
                  setServicesBudgetType,
                  (value) => updateData({ serviceFeesBudget: value }),
                  CreditCard,
                  t.serviceFees,
                  "text-green-600 dark:text-green-400",
                )}
              </motion.div>

              {/* Budget Flexibility */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Card className="bg-gradient-to-br from-white to-gray-50/50 dark:from-slate-800 dark:to-slate-900/50 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className={cn(isMobile ? "p-6" : "p-8")}>
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
                          <Zap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3
                            className={cn(
                              "font-bold text-slate-800 dark:text-slate-200",
                              isMobile ? "text-lg" : "text-xl",
                            )}
                          >
                            {t.budgetFlexibility}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">How strict is your budget?</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          {
                            id: "strict",
                            label: t.strict,
                            desc: t.stayWithinBudget,
                            icon: Shield,
                            color: "from-red-500 to-pink-500",
                          },
                          {
                            id: "flexible",
                            label: t.flexible,
                            desc: t.upTo20Over,
                            icon: Target,
                            color: "from-blue-500 to-cyan-500",
                          },
                          {
                            id: "very_flexible",
                            label: t.veryFlexible,
                            desc: t.upTo50Over,
                            icon: Heart,
                            color: "from-green-500 to-emerald-500",
                          },
                        ].map((option, index) => (
                          <motion.div
                            key={option.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant={consultationData.budgetFlexibility === option.id ? "default" : "outline"}
                              onClick={() => updateData({ budgetFlexibility: option.id as any })}
                              className={cn(
                                "h-auto p-6 flex flex-col items-center space-y-3 text-center w-full",
                                consultationData.budgetFlexibility === option.id && "ring-2 ring-blue-500 shadow-lg",
                              )}
                            >
                              <div className={`p-3 rounded-xl bg-gradient-to-r ${option.color} shadow-lg`}>
                                <option.icon className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <div className="font-bold text-lg">{option.label}</div>
                                <div className="text-sm opacity-75 mt-1">{option.desc}</div>
                              </div>
                              {consultationData.budgetFlexibility === option.id && (
                                <Check className="h-5 w-5 text-green-500" />
                              )}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl"
              >
                <FileText className="h-10 w-10 text-white" />
              </motion.div>
              <h2
                className={cn(
                  "font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent",
                  isMobile ? "text-2xl" : "text-3xl",
                )}
              >
                {t.academicProfile}
              </h2>
              <p className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-base" : "text-lg")}>
                {t.academicSubtitle}
              </p>
            </div>

            <div className={cn("mx-auto space-y-8", isMobile ? "max-w-full" : "max-w-2xl")}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  {t.currentGPA}
                </Label>
                <Select
                  value={consultationData.currentGPA}
                  onValueChange={(value) => updateData({ currentGPA: value })}
                >
                  <SelectTrigger className="h-16 text-lg border-2 focus:border-purple-500">
                    <SelectValue
                      placeholder={
                        consultationData.userLanguage === "fr"
                          ? "Sélectionnez votre performance académique"
                          : "Select your academic performance"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr" ? "Faible (10-12/20)" : "Low (10-12/20)"}
                          </div>
                          <div className="text-sm text-muted-foreground">Basic academic performance</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="intermediate">
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr"
                              ? "Intermédiaire (12-14/20)"
                              : "Intermediate (12-14/20)"}
                          </div>
                          <div className="text-sm text-muted-foreground">Good academic performance</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr" ? "Élevé (14-20/20)" : "High (14-20/20)"}
                          </div>
                          <div className="text-sm text-muted-foreground">Excellent academic performance</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t.previousEducation}
                </Label>
                <Select
                  value={consultationData.previousEducationCountry}
                  onValueChange={(value) => updateData({ previousEducationCountry: value })}
                >
                  <SelectTrigger className="h-16 text-lg border-2 focus:border-purple-500">
                    <SelectValue
                      placeholder={consultationData.userLanguage === "fr" ? "Sélectionnez le pays" : "Select country"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Algeria">
                      <div className="flex items-center gap-3 py-1">
                        <div className="w-6 h-4 bg-gradient-to-r from-green-500 via-white to-red-500 rounded-sm"></div>
                        {consultationData.userLanguage === "fr" ? "Algérie" : "Algeria"}
                      </div>
                    </SelectItem>
                    <SelectItem value="France">
                      <div className="flex items-center gap-3 py-1">
                        <div className="w-6 h-4 bg-gradient-to-r from-blue-500 via-white to-red-500 rounded-sm"></div>
                        France
                      </div>
                    </SelectItem>
                    <SelectItem value="UK">
                      <div className="flex items-center gap-3 py-1">
                        <div className="w-6 h-4 bg-gradient-to-r from-blue-600 via-white to-red-600 rounded-sm"></div>
                        {consultationData.userLanguage === "fr" ? "Royaume-Uni" : "United Kingdom"}
                      </div>
                    </SelectItem>
                    <SelectItem value="US">
                      <div className="flex items-center gap-3 py-1">
                        <div className="w-6 h-4 bg-gradient-to-r from-red-500 via-white to-blue-500 rounded-sm"></div>
                        {consultationData.userLanguage === "fr" ? "États-Unis" : "United States"}
                      </div>
                    </SelectItem>
                    <SelectItem value="Canada">
                      <div className="flex items-center gap-3 py-1">
                        <div className="w-6 h-4 bg-gradient-to-r from-red-500 via-white to-red-500 rounded-sm"></div>
                        Canada
                      </div>
                    </SelectItem>
                    <SelectItem value="Germany">
                      <div className="flex items-center gap-3 py-1">
                        <div className="w-6 h-4 bg-gradient-to-b from-black via-red-500 to-yellow-500 rounded-sm"></div>
                        {consultationData.userLanguage === "fr" ? "Allemagne" : "Germany"}
                      </div>
                    </SelectItem>
                    <SelectItem value="Other">
                      <div className="flex items-center gap-3 py-1">
                        <div className="w-6 h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-sm"></div>
                        {consultationData.userLanguage === "fr" ? "Autre" : "Other"}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  {t.preferredLanguage}
                </Label>
                <Select value={consultationData.language} onValueChange={(value) => updateData({ language: value })}>
                  <SelectTrigger className="h-16 text-lg border-2 focus:border-purple-500">
                    <SelectValue
                      placeholder={
                        consultationData.userLanguage === "fr" ? "Sélectionnez la langue" : "Select language"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">
                      <div className="flex items-center gap-3 py-1">
                        <Languages className="h-4 w-4" />
                        {consultationData.userLanguage === "fr" ? "Anglais" : "English"}
                      </div>
                    </SelectItem>
                    <SelectItem value="French">
                      <div className="flex items-center gap-3 py-1">
                        <Languages className="h-4 w-4" />
                        {consultationData.userLanguage === "fr" ? "Français" : "French"}
                      </div>
                    </SelectItem>
                    <SelectItem value="Dutch">
                      <div className="flex items-center gap-3 py-1">
                        <Languages className="h-4 w-4" />
                        {consultationData.userLanguage === "fr" ? "Néerlandais" : "Dutch"}
                      </div>
                    </SelectItem>
                    <SelectItem value="German">
                      <div className="flex items-center gap-3 py-1">
                        <Languages className="h-4 w-4" />
                        {consultationData.userLanguage === "fr" ? "Allemand" : "German"}
                      </div>
                    </SelectItem>
                    <SelectItem value="Spanish">
                      <div className="flex items-center gap-3 py-1">
                        <Languages className="h-4 w-4" />
                        {consultationData.userLanguage === "fr" ? "Espagnol" : "Spanish"}
                      </div>
                    </SelectItem>
                    <SelectItem value="Italian">
                      <div className="flex items-center gap-3 py-1">
                        <Languages className="h-4 w-4" />
                        {consultationData.userLanguage === "fr" ? "Italien" : "Italian"}
                      </div>
                    </SelectItem>
                    <SelectItem value="Any">
                      <div className="flex items-center gap-3 py-1">
                        <Globe className="h-4 w-4" />
                        {consultationData.userLanguage === "fr" ? "Toute langue" : "Any Language"}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t.languageProficiency}
                </Label>
                <Select
                  value={consultationData.languageLevel}
                  onValueChange={(value: any) => updateData({ languageLevel: value })}
                >
                  <SelectTrigger className="h-16 text-lg border-2 focus:border-purple-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr" ? "Débutant" : "Beginner"}
                          </div>
                          <div className="text-sm text-muted-foreground">Basic understanding</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="intermediate">
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr" ? "Intermédiaire" : "Intermediate"}
                          </div>
                          <div className="text-sm text-muted-foreground">Conversational level</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="advanced">
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr" ? "Avancé" : "Advanced"}
                          </div>
                          <div className="text-sm text-muted-foreground">Fluent communication</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="native">
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr" ? "Langue maternelle" : "Native Speaker"}
                          </div>
                          <div className="text-sm text-muted-foreground">Mother tongue</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200 dark:border-blue-800"
              >
                <Checkbox
                  id="language-cert"
                  checked={consultationData.hasLanguageCertificate}
                  onCheckedChange={(checked) => updateData({ hasLanguageCertificate: !!checked })}
                  className="w-5 h-5"
                />
                <Label
                  htmlFor="language-cert"
                  className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2"
                >
                  <Award className="h-4 w-4" />
                  {t.languageCertificates}
                </Label>
              </motion.div>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-2xl"
              >
                <Settings className="h-10 w-10 text-white" />
              </motion.div>
              <h2
                className={cn(
                  "font-bold mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent",
                  isMobile ? "text-2xl" : "text-3xl",
                )}
              >
                {t.timelinePreferences}
              </h2>
              <p className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-base" : "text-lg")}>
                {t.timelineSubtitle}
              </p>
            </div>

            <div className={cn("mx-auto space-y-8", isMobile ? "max-w-full" : "max-w-2xl")}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t.intakePeriod}
                </Label>
                <Select
                  value={consultationData.intakePeriod}
                  onValueChange={(value) => updateData({ intakePeriod: value })}
                >
                  <SelectTrigger className="h-16 text-lg border-2 focus:border-orange-500">
                    <SelectValue
                      placeholder={
                        consultationData.userLanguage === "fr"
                          ? "Sélectionnez la période d'admission"
                          : "Select intake period"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="September">
                      <div className="flex items-center gap-3 py-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr" ? "Septembre 2025" : "September 2025"}
                          </div>
                          <div className="text-sm text-muted-foreground">Fall semester start</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="January">
                      <div className="flex items-center gap-3 py-2">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr" ? "Janvier 2026" : "January 2026"}
                          </div>
                          <div className="text-sm text-muted-foreground">Spring semester start</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="February">
                      <div className="flex items-center gap-3 py-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr" ? "Février 2026" : "February 2026"}
                          </div>
                          <div className="text-sm text-muted-foreground">Mid-year intake</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="May">
                      <div className="flex items-center gap-3 py-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr" ? "Mai 2026" : "May 2026"}
                          </div>
                          <div className="text-sm text-muted-foreground">Summer intake</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="Fall">
                      <div className="flex items-center gap-3 py-2">
                        <Calendar className="h-4 w-4 text-amber-500" />
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr" ? "Automne 2025" : "Fall 2025"}
                          </div>
                          <div className="text-sm text-muted-foreground">Traditional fall start</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="Any">
                      <div className="flex items-center gap-3 py-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr"
                              ? "Flexible / N'importe quand"
                              : "Flexible / Any Time"}
                          </div>
                          <div className="text-sm text-muted-foreground">Open to all options</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t.durationPreference}
                </Label>
                <Select value={consultationData.duration} onValueChange={(value) => updateData({ duration: value })}>
                  <SelectTrigger className="h-16 text-lg border-2 focus:border-orange-500">
                    <SelectValue
                      placeholder={
                        consultationData.userLanguage === "fr"
                          ? "Sélectionnez la préférence de durée"
                          : "Select duration preference"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semester">
                      <div className="flex items-center gap-3 py-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr"
                              ? "Court terme (semestre)"
                              : "Short-term (semester)"}
                          </div>
                          <div className="text-sm text-muted-foreground">3-6 months</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="year">
                      <div className="flex items-center gap-3 py-2">
                        <Clock className="h-4 w-4 text-green-500" />
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr" ? "1 an" : "1 year"}
                          </div>
                          <div className="text-sm text-muted-foreground">12 months program</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="two_years">
                      <div className="flex items-center gap-3 py-2">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr" ? "2 ans" : "2 years"}
                          </div>
                          <div className="text-sm text-muted-foreground">Standard master's duration</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="full">
                      <div className="flex items-center gap-3 py-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr"
                              ? "Programme complet (3+ ans)"
                              : "Full program (3+ years)"}
                          </div>
                          <div className="text-sm text-muted-foreground">Complete degree program</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {t.applicationUrgency}
                </Label>
                <Select value={consultationData.urgency} onValueChange={(value: any) => updateData({ urgency: value })}>
                  <SelectTrigger className="h-16 text-lg border-2 focus:border-orange-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr"
                              ? "ASAP - Besoin de postuler dans 1-2 mois"
                              : "ASAP - Need to apply within 1-2 months"}
                          </div>
                          <div className="text-sm text-muted-foreground">Urgent application needed</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="flexible">
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr"
                              ? "Flexible - Délai de 3-6 mois"
                              : "Flexible - 3-6 months timeline"}
                          </div>
                          <div className="text-sm text-muted-foreground">Standard planning time</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="planning_ahead">
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div>
                          <div className="font-medium">
                            {consultationData.userLanguage === "fr"
                              ? "Planification à l'avance - 6+ mois"
                              : "Planning Ahead - 6+ months"}
                          </div>
                          <div className="text-sm text-muted-foreground">Long-term planning</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  {t.mostImportant}
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      id: "low_cost",
                      label: consultationData.userLanguage === "fr" ? "Coût faible" : "Low Cost",
                      icon: DollarSign,
                      color: "from-green-500 to-emerald-500",
                    },
                    {
                      id: "scholarship",
                      label: consultationData.userLanguage === "fr" ? "Bourse" : "Scholarship",
                      icon: Award,
                      color: "from-blue-500 to-cyan-500",
                    },
                    {
                      id: "quality_education",
                      label: consultationData.userLanguage === "fr" ? "Qualité de l'éducation" : "Education Quality",
                      icon: Trophy,
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      id: "location",
                      label: consultationData.userLanguage === "fr" ? "Lieu spécifique" : "Specific Location",
                      icon: MapPin,
                      color: "from-orange-500 to-red-500",
                    },
                    {
                      id: "religious_facilities",
                      label:
                        consultationData.userLanguage === "fr" ? "Installations religieuses" : "Religious Facilities",
                      icon: Heart,
                      color: "from-amber-500 to-yellow-500",
                    },
                    {
                      id: "halal_food",
                      label: consultationData.userLanguage === "fr" ? "Nourriture halal" : "Halal Food",
                      icon: Heart,
                      color: "from-teal-500 to-cyan-500",
                    },
                  ].map((factor, index) => (
                    <motion.div
                      key={factor.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={consultationData.priorityFactors.includes(factor.id) ? "default" : "outline"}
                        onClick={() => {
                          const current = consultationData.priorityFactors
                          if (current.includes(factor.id)) {
                            updateData({ priorityFactors: current.filter((f) => f !== factor.id) })
                          } else {
                            updateData({ priorityFactors: [...current, factor.id] })
                          }
                        }}
                        className={cn(
                          "w-full h-16 text-left p-4 justify-start",
                          consultationData.priorityFactors.includes(factor.id) && "ring-2 ring-blue-500 shadow-lg",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${factor.color} shadow-lg`}>
                            <factor.icon className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-medium">{factor.label}</span>
                          {consultationData.priorityFactors.includes(factor.id) && (
                            <Check className="h-5 w-5 text-green-500 ml-auto" />
                          )}
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <Checkbox
                      id="work"
                      checked={consultationData.workWhileStudying}
                      onCheckedChange={(checked) => updateData({ workWhileStudying: !!checked })}
                      className="w-5 h-5"
                    />
                    <Label
                      htmlFor="work"
                      className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      {t.workWhileStudying}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800">
                    <Checkbox
                      id="scholarship"
                      checked={consultationData.scholarshipRequired}
                      onCheckedChange={(checked) => updateData({ scholarshipRequired: !!checked })}
                      className="w-5 h-5"
                    />
                    <Label
                      htmlFor="scholarship"
                      className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2"
                    >
                      <Award className="h-4 w-4" />
                      {t.needScholarship}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <Checkbox
                      id="religious"
                      checked={consultationData.religiousFacilities}
                      onCheckedChange={(checked) => updateData({ religiousFacilities: !!checked })}
                      className="w-5 h-5"
                    />
                    <Label
                      htmlFor="religious"
                      className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      {t.needReligious}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl border border-amber-200 dark:border-amber-800">
                    <Checkbox
                      id="halal"
                      checked={consultationData.halalFood}
                      onCheckedChange={(checked) => updateData({ halalFood: !!checked })}
                      className="w-5 h-5"
                    />
                    <Label
                      htmlFor="halal"
                      className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      {t.needHalal}
                    </Label>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center shadow-2xl"
              >
                <Trophy className="h-12 w-12 text-white" />
              </motion.div>
              <h2
                className={cn(
                  "font-bold mb-3 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent",
                  isMobile ? "text-2xl" : "text-3xl",
                )}
              >
                {t.yourMatches}
              </h2>
              <p className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-base" : "text-lg")}>
                {t.matchesFound.replace("{count}", matchedPrograms.length.toString())}
              </p>
            </div>

            <div className="space-y-6">
              {matchedPrograms.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <AlertCircle className="h-16 w-16 text-slate-400 dark:text-slate-600 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold mb-4 text-slate-600 dark:text-slate-400">
                    {consultationData.userLanguage === "fr"
                      ? "Aucune correspondance trouvée avec vos critères actuels."
                      : "No matches found with your current criteria."}
                  </h3>
                  <div className="space-y-3 text-slate-500 dark:text-slate-500 max-w-md mx-auto">
                    <p className="font-medium">
                      {consultationData.userLanguage === "fr" ? "Essayez d'ajuster:" : "Try adjusting:"}
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-left">
                      <li>
                        {consultationData.userLanguage === "fr"
                          ? "Augmentez votre budget ou flexibilité"
                          : "Increase your budget or flexibility"}
                      </li>
                      <li>
                        {consultationData.userLanguage === "fr"
                          ? "Considérez différents domaines d'études"
                          : "Consider different fields of study"}
                      </li>
                      <li>
                        {consultationData.userLanguage === "fr"
                          ? "Élargissez les préférences linguistiques"
                          : "Expand language preferences"}
                      </li>
                    </ul>
                  </div>
                </motion.div>
              ) : (
                matchedPrograms.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.01 }}
                  >
                    <Card
                      className={`transition-all duration-300 hover:shadow-2xl ${
                        program.recommendation === "highly_recommended"
                          ? "ring-2 ring-green-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-green-100"
                          : program.recommendation === "recommended"
                            ? "ring-2 ring-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 shadow-blue-100"
                            : program.recommendation === "consider"
                              ? "ring-2 ring-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 shadow-yellow-100"
                              : "ring-1 ring-gray-200 dark:ring-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                      }`}
                    >
                      <CardContent className={cn(isMobile ? "p-6" : "p-8")}>
                        <div
                          className={cn("flex justify-between mb-6", isMobile ? "flex-col space-y-4" : "items-start")}
                        >
                          <div
                            className={cn("flex space-x-4", isMobile ? "flex-col space-y-4 space-x-0" : "items-center")}
                          >
                            <div
                              className={cn(
                                "rounded-2xl bg-cover bg-center flex-shrink-0 shadow-lg",
                                isMobile ? "w-full h-40" : "w-20 h-20",
                              )}
                              style={{
                                backgroundImage: `url(${program.image_url || "/placeholder.svg?height=80&width=80&text=" + program.name.charAt(0)})`,
                              }}
                            />
                            <div className="flex-1">
                              <h3
                                className={cn(
                                  "font-bold text-slate-900 dark:text-white mb-2",
                                  isMobile ? "text-xl" : "text-2xl",
                                )}
                              >
                                {program.name}
                              </h3>
                              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                                {program.university}
                              </p>
                              <p className="text-slate-600 dark:text-slate-400 flex items-center mt-1">
                                <MapPin className="h-4 w-4 mr-2" />
                                {program.city}, {program.country}
                              </p>
                              <div className={cn("flex flex-wrap gap-2 mt-3", isMobile ? "mt-3" : "")}>
                                {program.recommendation === "highly_recommended" && (
                                  <Badge className="bg-green-500 text-white flex items-center gap-1 px-3 py-1">
                                    <Trophy className="h-3 w-3" />
                                    {consultationData.userLanguage === "fr" ? "Premier Choix" : "Top Choice"}
                                  </Badge>
                                )}
                                {program.recommendation === "recommended" && (
                                  <Badge className="bg-blue-500 text-white flex items-center gap-1 px-3 py-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {consultationData.userLanguage === "fr" ? "Recommandé" : "Recommended"}
                                  </Badge>
                                )}
                                {program.recommendation === "consider" && (
                                  <Badge className="bg-yellow-500 text-white flex items-center gap-1 px-3 py-1">
                                    <Clock className="h-3 w-3" />
                                    {consultationData.userLanguage === "fr" ? "À Considérer" : "Consider"}
                                  </Badge>
                                )}
                                {program.fieldMatchDetails?.matchType === "exact" && (
                                  <Badge className="bg-purple-500 text-white flex items-center gap-1 px-3 py-1">
                                    <Target className="h-3 w-3" />
                                    {consultationData.userLanguage === "fr" ? "Correspondance Exacte" : "Exact Match"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className={cn("text-right", isMobile && "text-center")}>
                            <Badge
                              className={`text-xl px-4 py-2 font-bold ${
                                program.matchScore >= 80
                                  ? "bg-green-500 text-white shadow-green-200"
                                  : program.matchScore >= 60
                                    ? "bg-blue-500 text-white shadow-blue-200"
                                    : program.matchScore >= 40
                                      ? "bg-yellow-500 text-white shadow-yellow-200"
                                      : "bg-gray-500 text-white shadow-gray-200"
                              } shadow-lg`}
                            >
                              {program.matchScore}%
                            </Badge>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              {consultationData.userLanguage === "fr" ? "Correspondance" : "Match"}
                            </p>
                          </div>
                        </div>

                        <p
                          className={cn(
                            "text-slate-600 dark:text-slate-400 mb-6 leading-relaxed",
                            isMobile ? "text-base" : "text-lg",
                          )}
                        >
                          {program.description}
                        </p>

                        {/* Cost Breakdown */}
                        <div
                          className={cn(
                            "grid gap-6 mb-6 p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl",
                            isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3",
                          )}
                        >
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <PiggyBank className="h-5 w-5 text-blue-500" />
                              <span className="font-semibold text-gray-700 dark:text-gray-300">
                                {consultationData.userLanguage === "fr" ? "Frais de scolarité" : "Tuition"}
                              </span>
                            </div>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              €{program.tuition_min?.toLocaleString()} - €{program.tuition_max?.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <Clock className="h-5 w-5 text-purple-500" />
                              <span className="font-semibold text-gray-700 dark:text-gray-300">
                                {consultationData.userLanguage === "fr" ? "Durée" : "Duration"}
                              </span>
                            </div>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {program.duration_months} {consultationData.userLanguage === "fr" ? "mois" : "months"}
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <Languages className="h-5 w-5 text-green-500" />
                              <span className="font-semibold text-gray-700 dark:text-gray-300">
                                {consultationData.userLanguage === "fr" ? "Langue" : "Language"}
                              </span>
                            </div>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {program.program_language}
                            </p>
                          </div>
                        </div>

                        {/* Match Reasons */}
                        <div className="space-y-4">
                          {program.matchReasons.length > 0 && (
                            <div>
                              <p
                                className={cn(
                                  "font-bold text-green-700 dark:text-green-400 mb-3 flex items-center",
                                  isMobile ? "text-base" : "text-lg",
                                )}
                              >
                                <Check className="h-5 w-5 mr-2" />
                                {consultationData.userLanguage === "fr"
                                  ? "Pourquoi cela correspond:"
                                  : "Why this matches:"}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {program.matchReasons.map((reason: string, i: number) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 px-3 py-1"
                                  >
                                    {reason}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {program.matchWarnings.length > 0 && (
                            <div>
                              <p
                                className={cn(
                                  "font-bold text-orange-700 dark:text-orange-400 mb-3 flex items-center",
                                  isMobile ? "text-base" : "text-lg",
                                )}
                              >
                                <AlertCircle className="h-5 w-5 mr-2" />
                                {consultationData.userLanguage === "fr"
                                  ? "Points à considérer:"
                                  : "Things to consider:"}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {program.matchWarnings.map((warning: string, i: number) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800 px-3 py-1"
                                  >
                                    {warning}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Additional Information */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                          <div
                            className={cn(
                              "grid gap-4 text-slate-600 dark:text-slate-400",
                              isMobile ? "grid-cols-2 text-sm" : "grid-cols-2 md:grid-cols-4 text-sm",
                            )}
                          >
                            <div>
                              <span className="font-semibold">
                                {consultationData.userLanguage === "fr" ? "Niveau:" : "Level:"}
                              </span>
                              <p className="font-medium">{program.study_level}</p>
                            </div>
                            <div>
                              <span className="font-semibold">
                                {consultationData.userLanguage === "fr" ? "Domaine:" : "Field:"}
                              </span>
                              <p className="font-medium">{program.field}</p>
                            </div>
                            <div>
                              <span className="font-semibold">
                                {consultationData.userLanguage === "fr" ? "Bourse:" : "Scholarship:"}
                              </span>
                              <p className="font-medium">
                                {program.scholarship_available
                                  ? consultationData.userLanguage === "fr"
                                    ? "Disponible"
                                    : "Available"
                                  : consultationData.userLanguage === "fr"
                                    ? "Non disponible"
                                    : "Not Available"}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold">
                                {consultationData.userLanguage === "fr" ? "Frais de candidature:" : "Application Fee:"}
                              </span>
                              <p className="font-medium">€{program.application_fee || 0}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}

              {matchedPrograms.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl border border-blue-200 dark:border-blue-800"
                >
                  <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-4 text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    {t.nextSteps}
                  </h3>
                  <ul
                    className={cn(
                      "text-blue-800 dark:text-blue-200 space-y-3 list-disc list-inside",
                      isMobile ? "text-base" : "text-lg",
                    )}
                  >
                    <li>
                      {consultationData.userLanguage === "fr"
                        ? "Examinez les informations détaillées du programme et les exigences"
                        : "Review the detailed program information and requirements"}
                    </li>
                    <li>
                      {consultationData.userLanguage === "fr"
                        ? "Vérifiez les exigences de certificat de langue si applicable"
                        : "Check language certificate requirements if applicable"}
                    </li>
                    <li>
                      {consultationData.userLanguage === "fr"
                        ? "Contactez nos consultants pour des conseils personnalisés de candidature"
                        : "Contact our consultants for personalized application guidance"}
                    </li>
                    <li>
                      {consultationData.userLanguage === "fr"
                        ? "Commencez à préparer les documents requis pour vos meilleurs choix"
                        : "Start preparing required documents for your top choices"}
                    </li>
                    <li>
                      {consultationData.userLanguage === "fr"
                        ? "Les programmes avec 'Correspondance Exacte' sont priorisés basés sur votre recherche précise"
                        : "Programs with 'Exact Match' are prioritized based on your precise search criteria"}
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          </motion.div>
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

      <div className="relative z-10 container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 rounded-full shadow-2xl"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
          </div>
          <h1
            className={cn(
              "font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-3",
              isMobile ? "text-4xl" : "text-5xl",
            )}
          >
            {t.title}
          </h1>
          <p className={cn("text-slate-600 dark:text-slate-300 max-w-3xl mx-auto", isMobile ? "text-lg" : "text-xl")}>
            {t.subtitle}
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="mb-8 border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className={cn(isMobile ? "p-6" : "p-8")}>
              <div className={cn("flex justify-between mb-6", isMobile ? "flex-col space-y-4" : "items-center")}>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${currentStepInfo.color} shadow-lg`}>
                    <currentStepInfo.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className={cn("font-bold text-slate-900 dark:text-white", isMobile ? "text-lg" : "text-xl")}>
                      {currentStepInfo.title}
                    </h3>
                    <p className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-sm" : "text-base")}>
                      {currentStepInfo.description}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 px-4 py-2 text-lg font-semibold"
                >
                  {consultationData.userLanguage === "fr" ? "Étape" : "Step"} {currentStep}{" "}
                  {consultationData.userLanguage === "fr" ? "de" : "of"} {STEPS.length}
                </Badge>
              </div>
              <div className="relative">
                <Progress value={progress} className="h-3 rounded-full" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-sm" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm mb-8">
            <CardContent className={cn(isMobile ? "p-6" : "p-10")}>
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
        </motion.div>

        {/* Navigation */}
        {currentStep < 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={cn("flex justify-between", isMobile && "flex-col space-y-4")}
          >
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={cn(
                "flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 hover:shadow-lg transition-all duration-300",
                isMobile && "w-full h-14 text-lg",
              )}
              size={isMobile ? "lg" : "default"}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>{consultationData.userLanguage === "fr" ? "Précédent" : "Previous"}</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isProcessing}
              className={cn(
                "flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 dark:from-indigo-400 dark:to-purple-500 dark:hover:from-indigo-500 dark:hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300",
                isMobile && "w-full h-14 text-lg",
              )}
              size={isMobile ? "lg" : "default"}
            >
              <span>{isProcessing ? t.analyzing : currentStep === 4 ? t.findPrograms : t.continue}</span>
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </Button>
          </motion.div>
        )}

        {/* Restart Option for Results Page */}
        {currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(1)
                setConsultationData({
                  studyLevel: "",
                  fieldOfStudy: "",
                  fieldSearchQuery: "",
                  userLanguage: "en",
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
                setFieldSearchResults([])
                setShowFieldSuggestions(false)
              }}
              className={cn(
                "flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 hover:shadow-lg transition-all duration-300",
                isMobile && "w-full h-14 text-lg",
              )}
              size={isMobile ? "lg" : "default"}
            >
              <Sparkles className="w-5 h-5" />
              <span>{t.startNew}</span>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
