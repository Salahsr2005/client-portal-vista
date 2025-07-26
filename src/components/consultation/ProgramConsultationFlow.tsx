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

const STEPS = [
  { id: 1, title: "Study Level & Field", icon: GraduationCap, description: "Choose your academic preferences" },
  { id: 2, title: "Budget Planning", icon: DollarSign, description: "Set your financial preferences" },
  { id: 3, title: "Academic Profile", icon: FileText, description: "Your academic background" },
  { id: 4, title: "Timeline & Preferences", icon: Settings, description: "Timeline and additional requirements" },
  { id: 5, title: "Your Matches", icon: Trophy, description: "Perfect programs for you" },
]

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
    livingCosts: "Living Costs",
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
    livingCosts: "Coûts de la Vie",
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
  },
}

export default function ProgramConsultationFlow() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { isRestricted, handleRestrictedAction } = useGuestRestrictions()

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
      const results = BilingualFieldService.searchFields(query, consultationData.userLanguage)
      setFieldSearchResults(results.slice(0, 8)) // Limit to 8 suggestions
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                {consultationData.userLanguage === "fr" ? "Que voulez-vous étudier?" : "What do you want to study?"}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {consultationData.userLanguage === "fr"
                  ? "Choisissez votre niveau académique et domaine d'intérêt"
                  : "Choose your academic level and field of interest"}
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              {/* Language Selection */}
              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">{t.searchLanguage}</Label>
                <div className="flex gap-2">
                  <Button
                    variant={consultationData.userLanguage === "en" ? "default" : "outline"}
                    onClick={() => updateData({ userLanguage: "en" })}
                    className="flex-1"
                  >
                    <Languages className="h-4 w-4 mr-2" />
                    English
                  </Button>
                  <Button
                    variant={consultationData.userLanguage === "fr" ? "default" : "outline"}
                    onClick={() => updateData({ userLanguage: "fr" })}
                    className="flex-1"
                  >
                    <Languages className="h-4 w-4 mr-2" />
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
                      className="h-16 text-lg justify-start"
                    >
                      <div className="flex items-center">
                        <GraduationCap className="h-6 w-6 mr-3" />
                        <div className="text-left">
                          <div className="font-semibold">{level}</div>
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
                    className="pl-10 h-14 text-lg"
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
                              <div className="text-xs text-muted-foreground">
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
                        <div className="text-sm text-blue-700 dark:text-blue-300">
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
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{t.planBudget}</h2>
              <p className="text-slate-600 dark:text-slate-400">{t.budgetSubtitle}</p>
            </div>

            {/* Budget Summary */}
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200/20 dark:border-blue-800/20">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Calculator className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t.totalBudgetOverview}</h3>
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
                    <div className="text-sm text-slate-600 dark:text-slate-400">{t.tuitionFees}</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <Home className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                    <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      {formatCurrency(consultationData.livingCostsBudget)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{t.livingCosts}</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                    <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      {formatCurrency(consultationData.serviceFeesBudget)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{t.serviceFees}</div>
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
                        {t.tuitionFees}
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
                        {t.livingCosts}
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
                        {t.serviceFees}
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
                      {t.budgetFlexibility}
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{t.academicProfile}</h2>
              <p className="text-slate-600 dark:text-slate-400">{t.academicSubtitle}</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">{t.currentGPA}</Label>
                <Select
                  value={consultationData.currentGPA}
                  onValueChange={(value) => updateData({ currentGPA: value })}
                >
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                  <SelectTrigger className="h-14 text-lg">
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
                  <SelectTrigger>
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
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{t.timelinePreferences}</h2>
              <p className="text-slate-600 dark:text-slate-400">{t.timelineSubtitle}</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <Label className="text-slate-800 dark:text-slate-200">{t.intakePeriod}</Label>
                <Select
                  value={consultationData.intakePeriod}
                  onValueChange={(value) => updateData({ intakePeriod: value })}
                >
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                <div className="grid grid-cols-2 gap-2">
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
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{t.yourMatches}</h2>
              <p className="text-slate-600 dark:text-slate-400">
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
                  <div className="space-y-2 text-sm text-slate-500 dark:text-slate-500">
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
                              <div className="flex items-center mt-1 space-x-2">
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
                              {program.matchScore}%{" "}
                              {consultationData.userLanguage === "fr" ? "Correspondance" : "Match"}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                          {program.description}
                        </p>

                        {/* Cost Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
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
                              <p className="font-medium text-sm text-green-700 dark:text-green-400 mb-2 flex items-center">
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
                              <p className="font-medium text-sm text-orange-700 dark:text-orange-400 mb-2 flex items-center">
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
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600 dark:text-slate-400">
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
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
            {t.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">{t.subtitle}</p>
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
                {consultationData.userLanguage === "fr" ? "Étape" : "Step"} {currentStep}{" "}
                {consultationData.userLanguage === "fr" ? "de" : "of"} {STEPS.length}
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
              <span>{consultationData.userLanguage === "fr" ? "Précédent" : "Previous"}</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isProcessing}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 dark:from-indigo-400 dark:to-purple-500 dark:hover:from-indigo-500 dark:hover:to-purple-600"
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
              className="flex items-center space-x-2"
            >
              <span>{t.startNew}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


