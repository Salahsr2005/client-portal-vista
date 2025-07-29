"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { useDestinationConsultation } from "@/hooks/useDestinationConsultation"
import { useTranslation } from "@/i18n"
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  DollarSign,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Home,
  Utensils,
  Building2,
  Languages,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Target,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Step 1: Study Level Selection
const StudyLevelStep = ({
  selectedLevel,
  onSelect,
  onNext,
  t,
}: {
  selectedLevel: string
  onSelect: (level: string) => void
  onNext: () => void
  t: any
}) => {
  const levels = [
    {
      id: "Bachelor",
      title: t.consultation.levels.bachelor,
      description: t.consultation.levels.bachelorDesc,
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      id: "Master",
      title: t.consultation.levels.master,
      description: t.consultation.levels.masterDesc,
      icon: GraduationCap,
      color: "bg-purple-500",
    },
    {
      id: "PhD",
      title: t.consultation.levels.phd,
      description: t.consultation.levels.phdDesc,
      icon: Award,
      color: "bg-green-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t.consultation.steps.studyLevel.title}</h2>
        <p className="text-muted-foreground">{t.consultation.steps.studyLevel.description}</p>
      </div>

      <div className="grid gap-4">
        {levels.map((level) => {
          const Icon = level.icon
          return (
            <motion.div key={level.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  selectedLevel === level.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50",
                )}
                onClick={() => onSelect(level.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={cn("p-3 rounded-full text-white", level.color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{level.title}</h3>
                      <p className="text-muted-foreground">{level.description}</p>
                    </div>
                    {selectedLevel === level.id && <CheckCircle className="h-6 w-6 text-primary" />}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selectedLevel} className="min-w-32">
          {t.common.next} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Step 2: Budget Selection with Sliders
const BudgetStep = ({
  budgetData,
  onUpdate,
  onNext,
  onBack,
  t,
}: {
  budgetData: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
  t: any
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const flexibilityOptions = [
    { id: "strict", label: t.consultation.budget.strict, description: t.consultation.budget.strictDesc },
    { id: "flexible", label: t.consultation.budget.flexible, description: t.consultation.budget.flexibleDesc },
    {
      id: "very_flexible",
      label: t.consultation.budget.veryFlexible,
      description: t.consultation.budget.veryFlexibleDesc,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t.consultation.steps.budget.title}</h2>
        <p className="text-muted-foreground">{t.consultation.steps.budget.description}</p>
      </div>

      <div className="space-y-8">
        {/* Tuition Budget Slider */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
            {t.consultation.budget.tuition}
          </h3>
          <div className="space-y-4">
            <div className="px-4">
              <Slider
                value={budgetData.tuitionBudgetRange || [0, 50000]}
                onValueChange={(value) => onUpdate({ ...budgetData, tuitionBudgetRange: value })}
                max={100000}
                min={0}
                step={1000}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatCurrency((budgetData.tuitionBudgetRange || [0, 50000])[0])}</span>
              <span>{formatCurrency((budgetData.tuitionBudgetRange || [0, 50000])[1])}</span>
            </div>
          </div>
        </div>

        {/* Living Costs Budget Slider */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center">
            <Home className="h-5 w-5 mr-2 text-green-600" />
            {t.consultation.budget.living}
          </h3>
          <div className="space-y-4">
            <div className="px-4">
              <Slider
                value={budgetData.livingCostsBudgetRange || [400, 1200]}
                onValueChange={(value) => onUpdate({ ...budgetData, livingCostsBudgetRange: value })}
                max={3000}
                min={200}
                step={50}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatCurrency((budgetData.livingCostsBudgetRange || [400, 1200])[0])}</span>
              <span>{formatCurrency((budgetData.livingCostsBudgetRange || [400, 1200])[1])}</span>
            </div>
          </div>
        </div>

        {/* Service Fees Budget Slider */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-purple-600" />
            {t.consultation.budget.services}
          </h3>
          <div className="space-y-4">
            <div className="px-4">
              <Slider
                value={budgetData.serviceFeesBudgetRange || [100, 1000]}
                onValueChange={(value) => onUpdate({ ...budgetData, serviceFeesBudgetRange: value })}
                max={5000}
                min={50}
                step={50}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatCurrency((budgetData.serviceFeesBudgetRange || [100, 1000])[0])}</span>
              <span>{formatCurrency((budgetData.serviceFeesBudgetRange || [100, 1000])[1])}</span>
            </div>
          </div>
        </div>

        {/* Budget Flexibility */}
        <div>
          <h3 className="font-semibold mb-3">{t.consultation.budget.flexibility}</h3>
          <div className="space-y-2">
            {flexibilityOptions.map((option) => (
              <Card
                key={option.id}
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  budgetData.budgetFlexibility === option.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50",
                )}
                onClick={() => onUpdate({ ...budgetData, budgetFlexibility: option.id })}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{option.label}</h4>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    {budgetData.budgetFlexibility === option.id && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.common.back}
        </Button>
        <Button
          onClick={onNext}
          disabled={
            !budgetData.tuitionBudgetRange ||
            !budgetData.livingCostsBudgetRange ||
            !budgetData.serviceFeesBudgetRange ||
            !budgetData.budgetFlexibility
          }
        >
          {t.common.next} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Step 3: Language & Timeline with Multi-language Support
const LanguageTimelineStep = ({
  preferences,
  onUpdate,
  onNext,
  onBack,
  t,
}: {
  preferences: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
  t: any
}) => {
  const languages = [
    { id: "English", label: t.consultation.languages.english, flag: "🇬🇧" },
    { id: "French", label: t.consultation.languages.french, flag: "🇫🇷" },
    { id: "German", label: t.consultation.languages.german, flag: "🇩🇪" },
    { id: "Spanish", label: t.consultation.languages.spanish, flag: "🇪🇸" },
    { id: "Italian", label: t.consultation.languages.italian, flag: "🇮🇹" },
    { id: "Dutch", label: t.consultation.languages.dutch, flag: "🇳🇱" },
  ]

  const languageLevels = [
    { id: "beginner", label: t.consultation.levels.beginner, description: t.consultation.levels.beginnerDesc },
    {
      id: "intermediate",
      label: t.consultation.levels.intermediate,
      description: t.consultation.levels.intermediateDesc,
    },
    { id: "advanced", label: t.consultation.levels.advanced, description: t.consultation.levels.advancedDesc },
  ]

  const intakePeriods = [
    { id: "September", label: t.consultation.intakes.september, description: t.consultation.intakes.septemberDesc },
    { id: "January", label: t.consultation.intakes.january, description: t.consultation.intakes.januaryDesc },
    { id: "May", label: t.consultation.intakes.may, description: t.consultation.intakes.mayDesc },
    { id: "Any", label: t.consultation.intakes.any, description: t.consultation.intakes.anyDesc },
  ]

  const urgencyOptions = [
    { id: "urgent", label: t.consultation.urgency.urgent, description: t.consultation.urgency.urgentDesc },
    { id: "moderate", label: t.consultation.urgency.moderate, description: t.consultation.urgency.moderateDesc },
    { id: "flexible", label: t.consultation.urgency.flexible, description: t.consultation.urgency.flexibleDesc },
  ]

  const toggleLanguage = (langId: string) => {
    const current = preferences.preferredLanguages || []
    const updated = current.includes(langId) ? current.filter((l: string) => l !== langId) : [...current, langId]
    onUpdate({ ...preferences, preferredLanguages: updated })
  }

  const toggleIntake = (intakeId: string) => {
    const current = preferences.intakePeriods || []
    const updated = current.includes(intakeId) ? current.filter((i: string) => i !== intakeId) : [...current, intakeId]
    onUpdate({ ...preferences, intakePeriods: updated })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t.consultation.steps.language.title}</h2>
        <p className="text-muted-foreground">{t.consultation.steps.language.description}</p>
      </div>

      <div className="space-y-6">
        {/* Preferred Languages */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <Languages className="h-5 w-5 mr-2 text-blue-600" />
            {t.consultation.language.preferred}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <Button
                key={lang.id}
                variant={preferences.preferredLanguages?.includes(lang.id) ? "default" : "outline"}
                onClick={() => toggleLanguage(lang.id)}
                className="h-auto p-4 text-left justify-start"
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Language Level */}
        <div>
          <h3 className="font-semibold mb-3">{t.consultation.language.level}</h3>
          <div className="space-y-2">
            {languageLevels.map((level) => (
              <Card
                key={level.id}
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  preferences.languageLevel === level.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50",
                )}
                onClick={() => onUpdate({ ...preferences, languageLevel: level.id })}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{level.label}</h4>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                    {preferences.languageLevel === level.id && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Language Certificate */}
        <div>
          <h3 className="font-semibold mb-3">{t.consultation.language.certificate}</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={preferences.hasLanguageCertificate === true ? "default" : "outline"}
              onClick={() => onUpdate({ ...preferences, hasLanguageCertificate: true })}
              className="h-auto p-4"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              {t.consultation.language.hasCertificate}
            </Button>
            <Button
              variant={preferences.hasLanguageCertificate === false ? "default" : "outline"}
              onClick={() => onUpdate({ ...preferences, hasLanguageCertificate: false })}
              className="h-auto p-4"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              {t.consultation.language.noCertificate}
            </Button>
          </div>
        </div>

        {/* Intake Periods */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            {t.consultation.timeline.intakes}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {intakePeriods.map((intake) => (
              <Button
                key={intake.id}
                variant={preferences.intakePeriods?.includes(intake.id) ? "default" : "outline"}
                onClick={() => toggleIntake(intake.id)}
                className="h-auto p-4 text-left justify-start"
              >
                <div>
                  <div className="font-medium">{intake.label}</div>
                  <div className="text-xs text-muted-foreground">{intake.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Timeline Urgency */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-orange-600" />
            {t.consultation.timeline.urgency}
          </h3>
          <div className="space-y-2">
            {urgencyOptions.map((option) => (
              <Card
                key={option.id}
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  preferences.urgency === option.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50",
                )}
                onClick={() => onUpdate({ ...preferences, urgency: option.id })}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{option.label}</h4>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    {preferences.urgency === option.id && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.common.back}
        </Button>
        <Button
          onClick={onNext}
          disabled={
            !preferences.preferredLanguages?.length ||
            !preferences.languageLevel ||
            !preferences.intakePeriods?.length ||
            !preferences.urgency
          }
        >
          {t.common.next} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Step 4: Additional Preferences
const AdditionalPreferencesStep = ({
  preferences,
  onUpdate,
  onAnalyze,
  onBack,
  isAnalyzing,
  t,
}: {
  preferences: any
  onUpdate: (data: any) => void
  onAnalyze: () => void
  onBack: () => void
  isAnalyzing: boolean
  t: any
}) => {
  const specialRequirements = [
    {
      id: "scholarshipRequired",
      label: t.consultation.requirements.scholarship,
      description: t.consultation.requirements.scholarshipDesc,
      icon: Award,
      color: "text-yellow-600",
    },
    {
      id: "religiousFacilities",
      label: t.consultation.requirements.religious,
      description: t.consultation.requirements.religiousDesc,
      icon: Building2,
      color: "text-purple-600",
    },
    {
      id: "halalFood",
      label: t.consultation.requirements.halal,
      description: t.consultation.requirements.halalDesc,
      icon: Utensils,
      color: "text-green-600",
    },
    {
      id: "workWhileStudying",
      label: t.consultation.requirements.work,
      description: t.consultation.requirements.workDesc,
      icon: Users,
      color: "text-blue-600",
    },
  ]

  const gpaLevels = [
    { id: "excellent", label: t.consultation.gpa.excellent, description: t.consultation.gpa.excellentDesc },
    { id: "good", label: t.consultation.gpa.good, description: t.consultation.gpa.goodDesc },
    { id: "intermediate", label: t.consultation.gpa.intermediate, description: t.consultation.gpa.intermediateDesc },
    { id: "improving", label: t.consultation.gpa.improving, description: t.consultation.gpa.improvingDesc },
  ]

  const toggleRequirement = (reqId: string) => {
    onUpdate({ ...preferences, [reqId]: !preferences[reqId] })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t.consultation.steps.preferences.title}</h2>
        <p className="text-muted-foreground">{t.consultation.steps.preferences.description}</p>
      </div>

      <div className="space-y-6">
        {/* Academic Performance */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            {t.consultation.academic.performance}
          </h3>
          <div className="space-y-2">
            {gpaLevels.map((level) => (
              <Card
                key={level.id}
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  preferences.currentGPA === level.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50",
                )}
                onClick={() => onUpdate({ ...preferences, currentGPA: level.id })}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{level.label}</h4>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                    {preferences.currentGPA === level.id && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Special Requirements */}
        <div>
          <h3 className="font-semibold mb-3">{t.consultation.requirements.title}</h3>
          <div className="grid grid-cols-1 gap-3">
            {specialRequirements.map((req) => {
              const Icon = req.icon
              return (
                <Card
                  key={req.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    preferences[req.id] ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50",
                  )}
                  onClick={() => toggleRequirement(req.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className={cn("h-5 w-5", req.color)} />
                        <div>
                          <h4 className="font-medium">{req.label}</h4>
                          <p className="text-sm text-muted-foreground">{req.description}</p>
                        </div>
                      </div>
                      {preferences[req.id] && <CheckCircle className="h-5 w-5 text-primary" />}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.common.back}
        </Button>
        <Button onClick={onAnalyze} disabled={!preferences.currentGPA || isAnalyzing} className="min-w-40">
          {isAnalyzing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              {t.consultation.analyzing}
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {t.consultation.findDestinations}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Results Step
const ResultsStep = ({
  matches,
  onRestart,
  onBack,
  isLoading,
  t,
}: {
  matches: any[]
  onRestart: () => void
  onBack: () => void
  isLoading: boolean
  t: any
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-semibold mb-2">{t.consultation.analyzing}</h3>
        <p className="text-muted-foreground">{t.consultation.analyzingDesc}</p>
      </div>
    )
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
        <h3 className="text-xl font-semibold mb-2">{t.consultation.noMatches}</h3>
        <p className="text-muted-foreground mb-6">{t.consultation.noMatchesDesc}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.consultation.adjustPreferences}
          </Button>
          <Button onClick={onRestart}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t.consultation.startOver}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t.consultation.results.title}</h2>
        <p className="text-muted-foreground">
          {t.consultation.results.found.replace("{count}", matches.length.toString())}
        </p>
      </div>

      <div className="space-y-4">
        {matches.map((match, index) => {
          const destination = match.destination
          return (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{destination.name}</h3>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {match.score}% {t.consultation.results.match}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{destination.country}</span>
                        </div>
                        {destination.success_rate && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            <span>
                              {destination.success_rate}% {t.consultation.results.successRate}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-muted-foreground mb-4 line-clamp-2">{destination.description}</p>

                      {/* Match Reasons */}
                      {match.reasons && match.reasons.length > 0 && (
                        <div className="mb-3">
                          <h4 className="font-medium text-green-700 dark:text-green-300 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {t.consultation.results.whyMatches}
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {match.reasons.slice(0, 3).map((reason: string, idx: number) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300"
                              >
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Warnings */}
                      {match.warnings && match.warnings.length > 0 && (
                        <div className="mb-3">
                          <h4 className="font-medium text-orange-700 dark:text-orange-300 mb-2 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {t.consultation.results.consider}
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {match.warnings.slice(0, 2).map((warning: string, idx: number) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300"
                              >
                                {warning}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary mb-1">{match.score}%</div>
                      <div className="text-sm text-muted-foreground">{t.consultation.results.matchScore}</div>
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">
                        {match.estimatedCosts?.tuitionRange?.[0]
                          ? formatCurrency(match.estimatedCosts.tuitionRange[0])
                          : "N/A"}
                      </div>
                      <div className="text-xs text-muted-foreground">{t.consultation.results.minTuition}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">
                        {match.estimatedCosts?.livingCosts ? formatCurrency(match.estimatedCosts.livingCosts) : "N/A"}
                      </div>
                      <div className="text-xs text-muted-foreground">{t.consultation.results.livingCost}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-600">
                        {destination.language_requirements || "Multiple"}
                      </div>
                      <div className="text-xs text-muted-foreground">{t.consultation.results.languages}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-orange-600">{destination.processing_time || "4-6 weeks"}</div>
                      <div className="text-xs text-muted-foreground">{t.consultation.results.processing}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.consultation.adjustPreferences}
        </Button>
        <Button onClick={onRestart}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t.consultation.startOver}
        </Button>
      </div>
    </div>
  )
}

// Main Component
export default function DestinationConsultationFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [studyLevel, setStudyLevel] = useState("")
  const [budgetData, setBudgetData] = useState({
    tuitionBudgetRange: null,
    livingCostsBudgetRange: null,
    serviceFeesBudgetRange: null,
    budgetFlexibility: "",
  })
  const [preferences, setPreferences] = useState({
    preferredLanguages: [],
    languageLevel: "",
    hasLanguageCertificate: null,
    intakePeriods: [],
    urgency: "",
    currentGPA: "",
    scholarshipRequired: false,
    religiousFacilities: false,
    halalFood: false,
    workWhileStudying: false,
    preferredRegions: [],
    avoidRegions: [],
    priorityFactors: [],
  })

  const { analyzeDestinations, matches, isLoading } = useDestinationConsultation()
  const { toast } = useToast()
  const { t } = useTranslation()

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleAnalyze = async () => {
    const fullPreferences = {
      studyLevel,
      userLanguage: "en" as const, // Default to English for now
      ...budgetData,
      ...preferences,
    }

    console.log("🚀 Starting destination consultation analysis...")
    console.log("📋 User preferences:", fullPreferences)

    try {
      await analyzeDestinations(fullPreferences)
      setCurrentStep(5) // Move to results step
    } catch (error) {
      console.error("❌ Error during analysis:", error)
      toast({
        title: t.consultation.error.title,
        description: t.consultation.error.description,
        variant: "destructive",
      })
    }
  }

  const handleRestart = () => {
    setCurrentStep(1)
    setStudyLevel("")
    setBudgetData({
      tuitionBudgetRange: null,
      livingCostsBudgetRange: null,
      serviceFeesBudgetRange: null,
      budgetFlexibility: "",
    })
    setPreferences({
      preferredLanguages: [],
      languageLevel: "",
      hasLanguageCertificate: null,
      intakePeriods: [],
      urgency: "",
      currentGPA: "",
      scholarshipRequired: false,
      religiousFacilities: false,
      halalFood: false,
      workWhileStudying: false,
      preferredRegions: [],
      avoidRegions: [],
      priorityFactors: [],
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl flex items-center">
              <Target className="h-6 w-6 mr-2 text-primary" />
              {t.consultation.title}
            </CardTitle>
            {currentStep <= totalSteps && (
              <Badge variant="outline">
                {t.consultation.step} {currentStep} {t.consultation.of} {totalSteps}
              </Badge>
            )}
          </div>
          {currentStep <= totalSteps && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t.consultation.progress}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StudyLevelStep
                  selectedLevel={studyLevel}
                  onSelect={setStudyLevel}
                  onNext={() => setCurrentStep(2)}
                  t={t}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BudgetStep
                  budgetData={budgetData}
                  onUpdate={setBudgetData}
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                  t={t}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <LanguageTimelineStep
                  preferences={preferences}
                  onUpdate={setPreferences}
                  onNext={() => setCurrentStep(4)}
                  onBack={() => setCurrentStep(2)}
                  t={t}
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AdditionalPreferencesStep
                  preferences={preferences}
                  onUpdate={setPreferences}
                  onAnalyze={handleAnalyze}
                  onBack={() => setCurrentStep(3)}
                  isAnalyzing={isLoading}
                  t={t}
                />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ResultsStep
                  matches={matches}
                  onRestart={handleRestart}
                  onBack={() => setCurrentStep(4)}
                  isLoading={isLoading}
                  t={t}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}







