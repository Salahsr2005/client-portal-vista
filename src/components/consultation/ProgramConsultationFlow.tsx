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
  { id: 1, title: "Study Level & Field", icon: GraduationCap, description: "Choose your academic preferences" },
  { id: 2, title: "Budget Planning", icon: DollarSign, description: "Set your financial preferences" },
  { id: 3, title: "Academic Profile", icon: FileText, description: "Your academic background" },
  { id: 4, title: "Timeline & Preferences", icon: Settings, description: "Timeline and additional requirements" },
  { id: 5, title: "Your Matches", icon: Trophy, description: "Perfect programs for you" },
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
    subtitle: "Advanced bilingual algorithm analyzing your preferences to find your perfect study program",
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
    matchesFound: "We found {count} programs ranked by compatibility with bilingual field matching",
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
    subtitle: "Algorithme bilingue avancé analysant vos préférences pour trouver votre programme d'études parfait",
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
    matchesFound:
      "Nous avons trouvé {count} programmes classés par compatibilité avec correspondance de domaine bilingue",
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
      // Enhanced search that matches whole words, not individual letters
      const results = BilingualFieldService.searchFields(query, consultationData.userLanguage).filter((field) => {
        const searchTerm = query.toLowerCase()
        const englishMatch =
          field.english.toLowerCase().includes(searchTerm) ||
          field.keywords_en.some((keyword) => keyword.toLowerCase().includes(searchTerm))
        const frenchMatch =
          field.french.toLowerCase().includes(searchTerm) ||
          field.keywords_fr.some((keyword) => keyword.toLowerCase().includes(searchTerm))

        // Only return results where the search term matches whole words or significant parts
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

  // Enhanced matching algorithm with search and sorting
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

    // Then sort by relevance using enhanced matching
    const sortedPrograms = EnhancedProgramMatchingService.sortProgramsByRelevance(filteredPrograms, consultationData)

    // Filter programs with minimum score threshold
    const minScoreThreshold = consultationData.budgetFlexibility === "strict" ? 50 : 30

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
            description: `Found ${matches.length} matching programs with enhanced bilingual analysis!`,
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
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardContent className={cn("p-4", isMobile && "p-3")}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label
                className={cn(
                  "font-semibold flex items-center text-slate-800 dark:text-slate-200",
                  isMobile ? "text-sm" : "text-lg",
                )}
              >
                <Icon className={cn("mr-2", color, isMobile ? "w-4 h-4" : "w-5 h-5")} />
                {title}
              </Label>
              <Badge variant="outline" className={cn(isMobile ? "text-xs" : "text-sm")}>
                {formatCurrency(currentValue)}
              </Badge>
            </div>

            {/* Budget Type Toggle */}
            <div className="flex gap-2">
              <Button
                variant={budgetType === "interval" ? "default" : "outline"}
                size={isMobile ? "sm" : "default"}
                onClick={() => setBudgetType("interval")}
                className="flex-1"
              >
                {t.budgetRange}
              </Button>
              <Button
                variant={budgetType === "custom" ? "default" : "outline"}
                size={isMobile ? "sm" : "default"}
                onClick={() => setBudgetType("custom")}
                className="flex-1"
              >
                {t.customAmount}
              </Button>
            </div>

            {budgetType === "interval" ? (
              <div className="space-y-3">
                <Label className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-xs" : "text-sm")}>
                  {t.selectBudgetRange}
                </Label>
                <div className="grid gap-2">
                  {config.intervals.map((interval, index) => (
                    <Button
                      key={index}
                      variant={currentValue >= interval.min && currentValue <= interval.max ? "default" : "outline"}
                      onClick={() => onValueChange(interval.max)}
                      className={cn("justify-start h-auto p-3", isMobile && "p-2 text-sm")}
                    >
                      <div className="text-left">
                        <div className="font-medium">{interval.label}</div>
                        {interval.min === interval.max && interval.min === 0 && (
                          <div className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>No cost</div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Label className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-xs" : "text-sm")}>
                  Enter custom amount (€0 - €{config.max.toLocaleString()})
                </Label>
                <Slider
                  value={[currentValue]}
                  onValueChange={(value) => onValueChange(value[0])}
                  max={config.max}
                  min={config.min}
                  step={config.step}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>€{config.min}</span>
                  <span>€{config.max.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className={cn("font-bold mb-2 text-slate-900 dark:text-white", isMobile ? "text-xl" : "text-2xl")}>
                {consultationData.userLanguage === "fr" ? "Que voulez-vous étudier?" : "What do you want to study?"}
              </h2>
              <p className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-sm" : "text-base")}>
                {consultationData.userLanguage === "fr"
                  ? "Choisissez votre niveau académique et domaine d'intérêt"
                  : "Choose your academic level and field of interest"}
              </p>
            </div>

            <div className={cn("mx-auto space-y-6", isMobile ? "max-w-full" : "max-w-md")}>
              {/* Language Selection */}
              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">{t.searchLanguage}</Label>
                <div className="flex gap-2">
                  <Button
                    variant={consultationData.userLanguage === "en" ? "default" : "outline"}
                    onClick={() => updateData({ userLanguage: "en" })}
                    className="flex-1"
                    size={isMobile ? "sm" : "default"}
                  >
                    <Languages className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                    English
                  </Button>
                  <Button
                    variant={consultationData.userLanguage === "fr" ? "default" : "outline"}
                    onClick={() => updateData({ userLanguage: "fr" })}
                    className="flex-1"
                    size={isMobile ? "sm" : "default"}
                  >
                    <Languages className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                    Français
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">{t.studyLevel}</Label>
                <div className="grid grid-cols-1 gap-3">
                  {["Bachelor", "Master", "PhD"].map((level) => (
                    <Button
                      key={level}
                      variant={consultationData.studyLevel === level ? "default" : "outline"}
                      onClick={() => updateData({ studyLevel: level })}
                      className={cn("justify-start", isMobile ? "h-14 text-base" : "h-16 text-lg")}
                    >
                      <div className="flex items-center">
                        <GraduationCap className={cn("mr-3", isMobile ? "h-5 w-5" : "h-6 w-6")} />
                        <div className="text-left">
                          <div className="font-semibold">{level}</div>
                          <div className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
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
                    </Button>
                  ))}
                </div>
              </div>

              {/* Enhanced Field Search */}
              <div className="space-y-4 relative">
                <Label className="text-slate-800 dark:text-slate-200">
                  {t.fieldOfStudy} {consultationData.userLanguage === "fr" ? "(Français)" : "(English)"}
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 h-4 w-4" />
                  <Input
                    placeholder={t.searchPlaceholder}
                    value={consultationData.fieldSearchQuery}
                    onChange={(e) => handleFieldSearch(e.target.value)}
                    className={cn("pl-10", isMobile ? "h-12 text-base" : "h-14 text-lg")}
                    onFocus={() => {
                      if (fieldSearchResults.length > 0) {
                        setShowFieldSuggestions(true)
                      }
                    }}
                  />
                </div>

                {/* Field Suggestions */}
                {showFieldSuggestions && fieldSearchResults.length > 0 && (
                  <Card className="absolute z-10 w-full mt-1 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
                    <CardContent className="p-2">
                      <div className="space-y-1">
                        {fieldSearchResults.map((field, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            className="w-full justify-start h-auto p-3 text-left"
                            onClick={() => selectFieldFromSuggestion(field)}
                          >
                            <div>
                              <div className="font-medium">
                                {consultationData.userLanguage === "fr" ? field.french : field.english}
                              </div>
                              <div className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                                {field.category} •{" "}
                                {consultationData.userLanguage === "fr" ? field.english : field.french}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Selected Field Display */}
                {consultationData.fieldOfStudy && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-blue-900 dark:text-blue-100">
                          {t.selected}: {consultationData.fieldSearchQuery || consultationData.fieldOfStudy}
                        </div>
                        <div className={cn("text-blue-700 dark:text-blue-300", isMobile ? "text-xs" : "text-sm")}>
                          {BilingualFieldService.getFieldTranslation(consultationData.fieldOfStudy)?.category}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateData({ fieldOfStudy: "", fieldSearchQuery: "" })}
                      >
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Subjects */}
              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">{t.specificSubjects}</Label>
                <div className={cn("grid gap-2", isMobile ? "grid-cols-1" : "grid-cols-2")}>
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
                      className={cn(isMobile ? "h-10 text-sm" : "h-10 text-sm")}
                      size={isMobile ? "sm" : "default"}
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
              <h2 className={cn("font-bold mb-2 text-slate-900 dark:text-white", isMobile ? "text-xl" : "text-2xl")}>
                {t.planBudget}
              </h2>
              <p className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-sm" : "text-base")}>
                {t.budgetSubtitle}
              </p>
            </div>

            {/* Budget Summary */}
            <Card
              className={cn(
                "mx-auto bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200/20 dark:border-blue-800/20",
                isMobile ? "max-w-full" : "max-w-4xl",
              )}
            >
              <CardContent className={cn(isMobile ? "p-4" : "p-6")}>
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Calculator
                      className={cn("text-slate-600 dark:text-slate-400", isMobile ? "w-5 h-5" : "w-6 h-6")}
                    />
                    <h3
                      className={cn("font-bold text-slate-800 dark:text-slate-100", isMobile ? "text-lg" : "text-xl")}
                    >
                      {t.totalBudgetOverview}
                    </h3>
                  </div>
                  <div
                    className={cn(
                      "font-bold mb-2 text-slate-800 dark:text-slate-100",
                      isMobile ? "text-2xl" : "text-4xl",
                    )}
                  >
                    {formatCurrency(consultationData.totalBudget)}
                  </div>
                </div>

                <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3")}>
                  <div className="text-center p-4 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <PiggyBank
                      className={cn("mx-auto mb-2 text-blue-600 dark:text-blue-400", isMobile ? "w-6 h-6" : "w-8 h-8")}
                    />
                    <div
                      className={cn("font-bold text-slate-800 dark:text-slate-100", isMobile ? "text-base" : "text-lg")}
                    >
                      {formatCurrency(consultationData.tuitionBudget)}
                    </div>
                    <div className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-xs" : "text-sm")}>
                      {t.tuitionFees}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <Home
                      className={cn(
                        "mx-auto mb-2 text-purple-600 dark:text-purple-400",
                        isMobile ? "w-6 h-6" : "w-8 h-8",
                      )}
                    />
                    <div
                      className={cn("font-bold text-slate-800 dark:text-slate-100", isMobile ? "text-base" : "text-lg")}
                    >
                      {formatCurrency(consultationData.livingCostsBudget)}
                    </div>
                    <div className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-xs" : "text-sm")}>
                      {t.livingCosts}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <CreditCard
                      className={cn(
                        "mx-auto mb-2 text-green-600 dark:text-green-400",
                        isMobile ? "w-6 h-6" : "w-8 h-8",
                      )}
                    />
                    <div
                      className={cn("font-bold text-slate-800 dark:text-slate-100", isMobile ? "text-base" : "text-lg")}
                    >
                      {formatCurrency(consultationData.serviceFeesBudget)}
                    </div>
                    <div className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-xs" : "text-sm")}>
                      {t.serviceFees}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Selectors */}
            <div className={cn("mx-auto space-y-6", isMobile ? "max-w-full" : "max-w-4xl")}>
              {/* Tuition Budget */}
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

              {/* Living Costs Budget */}
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

              {/* Service Fees Budget */}
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

              {/* Budget Flexibility */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent className={cn(isMobile ? "p-4" : "p-6")}>
                  <div className="space-y-4">
                    <Label
                      className={cn(
                        "font-semibold text-slate-800 dark:text-slate-200",
                        isMobile ? "text-base" : "text-lg",
                      )}
                    >
                      {t.budgetFlexibility}
                    </Label>
                    <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3")}>
                      {[
                        { id: "strict", label: t.strict, desc: t.stayWithinBudget },
                        { id: "flexible", label: t.flexible, desc: t.upTo20Over },
                        { id: "very_flexible", label: t.veryFlexible, desc: t.upTo50Over },
                      ].map((option) => (
                        <Button
                          key={option.id}
                          variant={consultationData.budgetFlexibility === option.id ? "default" : "outline"}
                          onClick={() => updateData({ budgetFlexibility: option.id as any })}
                          className="h-auto p-4 flex flex-col items-center space-y-2 text-center"
                          size={isMobile ? "sm" : "default"}
                        >
                          <span className="font-semibold">{option.label}</span>
                          <span className={cn("opacity-75", isMobile ? "text-xs" : "text-sm")}>{option.desc}</span>
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
              <h2 className={cn("font-bold mb-2 text-slate-900 dark:text-white", isMobile ? "text-xl" : "text-2xl")}>
                {t.academicProfile}
              </h2>
              <p className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-sm" : "text-base")}>
                {t.academicSubtitle}
              </p>
            </div>
            <div className={cn("mx-auto space-y-6", isMobile ? "max-w-full" : "max-w-md")}>
              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">{t.currentGPA}</Label>
                <Select
                  value={consultationData.currentGPA}
                  onValueChange={(value) => updateData({ currentGPA: value })}
                >
                  <SelectTrigger className={cn(isMobile ? "h-12" : "h-14")}>
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
                      {consultationData.userLanguage === "fr" ? "Faible (10-12/20)" : "Low (10-12/20)"}
                    </SelectItem>
                    <SelectItem value="intermediate">
                      {consultationData.userLanguage === "fr" ? "Intermédiaire (12-14/20)" : "Intermediate (12-14/20)"}
                    </SelectItem>
                    <SelectItem value="high">
                      {consultationData.userLanguage === "fr" ? "Élevé (14-20/20)" : "High (14-20/20)"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">{t.previousEducation}</Label>
                <Select
                  value={consultationData.previousEducationCountry}
                  onValueChange={(value) => updateData({ previousEducationCountry: value })}
                >
                  <SelectTrigger className={cn(isMobile ? "h-12" : "h-14")}>
                    <SelectValue
                      placeholder={consultationData.userLanguage === "fr" ? "Sélectionnez le pays" : "Select country"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Algeria">
                      {consultationData.userLanguage === "fr" ? "Algérie" : "Algeria"}
                    </SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="UK">
                      {consultationData.userLanguage === "fr" ? "Royaume-Uni" : "United Kingdom"}
                    </SelectItem>
                    <SelectItem value="US">
                      {consultationData.userLanguage === "fr" ? "États-Unis" : "United States"}
                    </SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Germany">
                      {consultationData.userLanguage === "fr" ? "Allemagne" : "Germany"}
                    </SelectItem>
                    <SelectItem value="Other">{consultationData.userLanguage === "fr" ? "Autre" : "Other"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">{t.preferredLanguage}</Label>
                <Select value={consultationData.language} onValueChange={(value) => updateData({ language: value })}>
                  <SelectTrigger className={cn(isMobile ? "h-12 text-base" : "h-14 text-lg")}>
                    <SelectValue
                      placeholder={
                        consultationData.userLanguage === "fr" ? "Sélectionnez la langue" : "Select language"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">
                      {consultationData.userLanguage === "fr" ? "Anglais" : "English"}
                    </SelectItem>
                    <SelectItem value="French">
                      {consultationData.userLanguage === "fr" ? "Français" : "French"}
                    </SelectItem>
                    <SelectItem value="Dutch">
                      {consultationData.userLanguage === "fr" ? "Néerlandais" : "Dutch"}
                    </SelectItem>
                    <SelectItem value="German">
                      {consultationData.userLanguage === "fr" ? "Allemand" : "German"}
                    </SelectItem>
                    <SelectItem value="Spanish">
                      {consultationData.userLanguage === "fr" ? "Espagnol" : "Spanish"}
                    </SelectItem>
                    <SelectItem value="Italian">
                      {consultationData.userLanguage === "fr" ? "Italien" : "Italian"}
                    </SelectItem>
                    <SelectItem value="Any">
                      {consultationData.userLanguage === "fr" ? "Toute langue" : "Any Language"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">{t.languageProficiency}</Label>
                <Select
                  value={consultationData.languageLevel}
                  onValueChange={(value: any) => updateData({ languageLevel: value })}
                >
                  <SelectTrigger className={cn(isMobile ? "h-12" : "h-14")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">
                      {consultationData.userLanguage === "fr" ? "Débutant" : "Beginner"}
                    </SelectItem>
                    <SelectItem value="intermediate">
                      {consultationData.userLanguage === "fr" ? "Intermédiaire" : "Intermediate"}
                    </SelectItem>
                    <SelectItem value="advanced">
                      {consultationData.userLanguage === "fr" ? "Avancé" : "Advanced"}
                    </SelectItem>
                    <SelectItem value="native">
                      {consultationData.userLanguage === "fr" ? "Langue maternelle" : "Native Speaker"}
                    </SelectItem>
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
                  {t.languageCertificates}
                </Label>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className={cn("font-bold mb-2 text-slate-900 dark:text-white", isMobile ? "text-xl" : "text-2xl")}>
                {t.timelinePreferences}
              </h2>
              <p className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-sm" : "text-base")}>
                {t.timelineSubtitle}
              </p>
            </div>
            <div className={cn("mx-auto space-y-6", isMobile ? "max-w-full" : "max-w-md")}>
              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">{t.intakePeriod}</Label>
                <Select
                  value={consultationData.intakePeriod}
                  onValueChange={(value) => updateData({ intakePeriod: value })}
                >
                  <SelectTrigger className={cn(isMobile ? "h-12" : "h-14")}>
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
                      {consultationData.userLanguage === "fr" ? "Septembre 2025" : "September 2025"}
                    </SelectItem>
                    <SelectItem value="January">
                      {consultationData.userLanguage === "fr" ? "Janvier 2026" : "January 2026"}
                    </SelectItem>
                    <SelectItem value="February">
                      {consultationData.userLanguage === "fr" ? "Février 2026" : "February 2026"}
                    </SelectItem>
                    <SelectItem value="May">
                      {consultationData.userLanguage === "fr" ? "Mai 2026" : "May 2026"}
                    </SelectItem>
                    <SelectItem value="Fall">
                      {consultationData.userLanguage === "fr" ? "Automne 2025" : "Fall 2025"}
                    </SelectItem>
                    <SelectItem value="Any">
                      {consultationData.userLanguage === "fr" ? "Flexible / N'importe quand" : "Flexible / Any Time"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">{t.durationPreference}</Label>
                <Select value={consultationData.duration} onValueChange={(value) => updateData({ duration: value })}>
                  <SelectTrigger className={cn(isMobile ? "h-12" : "h-14")}>
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
                      {consultationData.userLanguage === "fr" ? "Court terme (semestre)" : "Short-term (semester)"}
                    </SelectItem>
                    <SelectItem value="year">{consultationData.userLanguage === "fr" ? "1 an" : "1 year"}</SelectItem>
                    <SelectItem value="two_years">
                      {consultationData.userLanguage === "fr" ? "2 ans" : "2 years"}
                    </SelectItem>
                    <SelectItem value="full">
                      {consultationData.userLanguage === "fr"
                        ? "Programme complet (3+ ans)"
                        : "Full program (3+ years)"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">{t.applicationUrgency}</Label>
                <Select value={consultationData.urgency} onValueChange={(value: any) => updateData({ urgency: value })}>
                  <SelectTrigger className={cn(isMobile ? "h-12" : "h-14")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">
                      {consultationData.userLanguage === "fr"
                        ? "ASAP - Besoin de postuler dans 1-2 mois"
                        : "ASAP - Need to apply within 1-2 months"}
                    </SelectItem>
                    <SelectItem value="flexible">
                      {consultationData.userLanguage === "fr"
                        ? "Flexible - Délai de 3-6 mois"
                        : "Flexible - 3-6 months timeline"}
                    </SelectItem>
                    <SelectItem value="planning_ahead">
                      {consultationData.userLanguage === "fr"
                        ? "Planification à l'avance - 6+ mois"
                        : "Planning Ahead - 6+ months"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">{t.mostImportant}</Label>
                <div className={cn("grid gap-2", isMobile ? "grid-cols-1" : "grid-cols-2")}>
                  {[
                    { id: "low_cost", label: consultationData.userLanguage === "fr" ? "Coût faible" : "Low Cost" },
                    { id: "scholarship", label: consultationData.userLanguage === "fr" ? "Bourse" : "Scholarship" },
                    {
                      id: "quality_education",
                      label: consultationData.userLanguage === "fr" ? "Qualité de l'éducation" : "Education Quality",
                    },
                    {
                      id: "location",
                      label: consultationData.userLanguage === "fr" ? "Lieu spécifique" : "Specific Location",
                    },
                    {
                      id: "religious_facilities",
                      label:
                        consultationData.userLanguage === "fr" ? "Installations religieuses" : "Religious Facilities",
                    },
                    {
                      id: "halal_food",
                      label: consultationData.userLanguage === "fr" ? "Nourriture halal" : "Halal Food",
                    },
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
                      className={cn(isMobile ? "h-10 text-sm" : "h-12 text-sm")}
                      size={isMobile ? "sm" : "default"}
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
                    {t.workWhileStudying}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="scholarship"
                    checked={consultationData.scholarshipRequired}
                    onCheckedChange={(checked) => updateData({ scholarshipRequired: !!checked })}
                  />
                  <Label htmlFor="scholarship" className="text-slate-800 dark:text-slate-200">
                    {t.needScholarship}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="religious"
                    checked={consultationData.religiousFacilities}
                    onCheckedChange={(checked) => updateData({ religiousFacilities: !!checked })}
                  />
                  <Label htmlFor="religious" className="text-slate-800 dark:text-slate-200">
                    {t.needReligious}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="halal"
                    checked={consultationData.halalFood}
                    onCheckedChange={(checked) => updateData({ halalFood: !!checked })}
                  />
                  <Label htmlFor="halal" className="text-slate-800 dark:text-slate-200">
                    {t.needHalal}
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
              <h2 className={cn("font-bold mb-2 text-slate-900 dark:text-white", isMobile ? "text-xl" : "text-2xl")}>
                {t.yourMatches}
              </h2>
              <p className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-sm" : "text-base")}>
                {t.matchesFound.replace("{count}", matchedPrograms.length.toString())}
              </p>
            </div>

            <div className="space-y-4">
              {matchedPrograms.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {consultationData.userLanguage === "fr"
                      ? "Aucune correspondance parfaite trouvée avec vos critères actuels."
                      : "No perfect matches found with your current criteria."}
                  </p>
                  <div
                    className={cn("space-y-2 text-slate-500 dark:text-slate-500", isMobile ? "text-sm" : "text-base")}
                  >
                    <p>{consultationData.userLanguage === "fr" ? "Essayez d'ajuster:" : "Try adjusting:"}</p>
                    <ul className="list-disc list-inside space-y-1">
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
                      <CardContent className={cn(isMobile ? "p-4" : "p-6")}>
                        <div
                          className={cn("flex justify-between mb-4", isMobile ? "flex-col space-y-3" : "items-start")}
                        >
                          <div
                            className={cn("flex space-x-4", isMobile ? "flex-col space-y-3 space-x-0" : "items-center")}
                          >
                            <div
                              className={cn(
                                "rounded-lg bg-cover bg-center flex-shrink-0",
                                isMobile ? "w-full h-32" : "w-16 h-16",
                              )}
                              style={{
                                backgroundImage: `url(${program.image_url || "/placeholder.svg"})`,
                              }}
                            />
                            <div>
                              <h3
                                className={cn(
                                  "font-semibold text-slate-900 dark:text-white",
                                  isMobile ? "text-lg" : "text-xl",
                                )}
                              >
                                {program.name}
                              </h3>
                              <p className="text-slate-600 dark:text-slate-400">{program.university}</p>
                              <p className="text-slate-600 dark:text-slate-400 flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {program.city}, {program.country}
                              </p>
                              <div className={cn("flex flex-wrap gap-2 mt-1", isMobile ? "mt-2" : "")}>
                                {program.recommendation === "highly_recommended" && (
                                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs">
                                    <Trophy className="h-3 w-3 mr-1" />
                                    {consultationData.userLanguage === "fr" ? "Premier Choix" : "Top Choice"}
                                  </Badge>
                                )}
                                {program.recommendation === "recommended" && (
                                  <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    {consultationData.userLanguage === "fr" ? "Recommandé" : "Recommended"}
                                  </Badge>
                                )}
                                {program.recommendation === "consider" && (
                                  <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {consultationData.userLanguage === "fr" ? "À Considérer" : "Consider"}
                                  </Badge>
                                )}
                                {program.fieldMatchDetails?.matchType === "exact" && (
                                  <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-xs">
                                    <Languages className="h-3 w-3 mr-1" />
                                    {consultationData.userLanguage === "fr"
                                      ? "Correspondance Exacte"
                                      : "Exact Field Match"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className={cn("text-right", isMobile && "text-center")}>
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
                              {program.matchScore}%{" "}
                              {consultationData.userLanguage === "fr" ? "Correspondance" : "Match"}
                            </Badge>
                          </div>
                        </div>

                        <p
                          className={cn(
                            "text-slate-600 dark:text-slate-400 mb-4 line-clamp-2",
                            isMobile ? "text-sm" : "text-base",
                          )}
                        >
                          {program.description}
                        </p>

                        {/* Cost Breakdown */}
                        <div
                          className={cn(
                            "grid gap-4 mb-4 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg",
                            isMobile ? "grid-cols-1 text-sm" : "grid-cols-1 md:grid-cols-3 text-sm",
                          )}
                        >
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {consultationData.userLanguage === "fr" ? "Frais de scolarité:" : "Tuition:"}
                            </span>
                            <p className="text-gray-900 dark:text-gray-100">
                              €{program.tuition_min?.toLocaleString()} - €{program.tuition_max?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {consultationData.userLanguage === "fr" ? "Durée:" : "Duration:"}
                            </span>
                            <p className="text-gray-900 dark:text-gray-100">
                              {program.duration_months} {consultationData.userLanguage === "fr" ? "mois" : "months"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {consultationData.userLanguage === "fr" ? "Langue:" : "Language:"}
                            </span>
                            <p className="text-gray-900 dark:text-gray-100">{program.program_language}</p>
                          </div>
                        </div>

                        {/* Match Reasons */}
                        <div className="space-y-3">
                          {program.matchReasons.length > 0 && (
                            <div>
                              <p
                                className={cn(
                                  "font-medium text-green-700 dark:text-green-400 mb-2 flex items-center",
                                  isMobile ? "text-sm" : "text-base",
                                )}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                {consultationData.userLanguage === "fr"
                                  ? "Pourquoi cela correspond:"
                                  : "Why this matches:"}
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
                              <p
                                className={cn(
                                  "font-medium text-orange-700 dark:text-orange-400 mb-2 flex items-center",
                                  isMobile ? "text-sm" : "text-base",
                                )}
                              >
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {consultationData.userLanguage === "fr"
                                  ? "Points à considérer:"
                                  : "Things to consider:"}
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
                          <div
                            className={cn(
                              "grid gap-4 text-slate-600 dark:text-slate-400",
                              isMobile ? "grid-cols-2 text-xs" : "grid-cols-2 md:grid-cols-4 text-xs",
                            )}
                          >
                            <div>
                              <span className="font-medium">
                                {consultationData.userLanguage === "fr" ? "Niveau:" : "Level:"}
                              </span>
                              <p>{program.study_level}</p>
                            </div>
                            <div>
                              <span className="font-medium">
                                {consultationData.userLanguage === "fr" ? "Domaine:" : "Field:"}
                              </span>
                              <p>{program.field}</p>
                            </div>
                            <div>
                              <span className="font-medium">
                                {consultationData.userLanguage === "fr" ? "Bourse:" : "Scholarship:"}
                              </span>
                              <p>
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
                              <span className="font-medium">
                                {consultationData.userLanguage === "fr" ? "Frais de candidature:" : "Application Fee:"}
                              </span>
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
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">{t.nextSteps}</h3>
                  <ul
                    className={cn(
                      "text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside",
                      isMobile ? "text-sm" : "text-base",
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
                        ? "Les programmes avec 'Correspondance Exacte' sont priorisés basés sur votre recherche bilingue"
                        : "Programs with 'Exact Field Match' are prioritized based on your bilingual search"}
                    </li>
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
          <h1
            className={cn(
              "font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2",
              isMobile ? "text-3xl" : "text-4xl",
            )}
          >
            {t.title}
          </h1>
          <p className={cn("text-slate-600 dark:text-slate-300 max-w-2xl mx-auto", isMobile ? "text-base" : "text-lg")}>
            {t.subtitle}
          </p>
        </motion.div>

        {/* Progress */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className={cn(isMobile ? "p-4" : "p-6")}>
            <div className={cn("flex justify-between mb-4", isMobile ? "flex-col space-y-3" : "items-center")}>
              <div className="flex items-center space-x-3">
                <currentStepInfo.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h3
                    className={cn("font-semibold text-slate-900 dark:text-white", isMobile ? "text-base" : "text-lg")}
                  >
                    {currentStepInfo.title}
                  </h3>
                  <p className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-xs" : "text-sm")}>
                    {currentStepInfo.description}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
              >
                {consultationData.userLanguage === "fr" ? "Étape" : "Step"} {currentStep}{" "}
                {consultationData.userLanguage === "fr" ? "de" : "of"} {STEPS.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm mb-8">
          <CardContent className={cn(isMobile ? "p-4" : "p-8")}>
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
          <div className={cn("flex justify-between", isMobile && "flex-col space-y-3")}>
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={cn("flex items-center space-x-2 bg-transparent", isMobile && "w-full")}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{consultationData.userLanguage === "fr" ? "Précédent" : "Previous"}</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isProcessing}
              className={cn(
                "flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 dark:from-indigo-400 dark:to-purple-500 dark:hover:from-indigo-500 dark:hover:to-purple-600",
                isMobile && "w-full",
              )}
            >
              <span>{isProcessing ? t.analyzing : currentStep === 4 ? t.findPrograms : t.continue}</span>
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
              className={cn("flex items-center space-x-2", isMobile && "w-full")}
            >
              <span>{t.startNew}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}






