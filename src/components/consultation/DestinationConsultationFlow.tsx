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
import { useTranslation } from "react-i18next"
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
      title: "Bachelor's Degree",
      description: "Undergraduate programs (3-4 years)",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      id: "Master",
      title: "Master's Degree",
      description: "Graduate programs (1-2 years)",
      icon: GraduationCap,
      color: "bg-purple-500",
    },
    {
      id: "PhD",
      title: "PhD / Doctorate",
      description: "Doctoral programs (3-5 years)",
      icon: Award,
      color: "bg-green-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">What level of study are you interested in?</h2>
        <p className="text-muted-foreground">Choose the academic level that matches your goals</p>
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
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Step 2: Budget Selection with Sliders - Updated with 12k max tuition
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
    { id: "strict", label: "Strict Budget", description: "Must stay within range" },
    { id: "flexible", label: "Somewhat Flexible", description: "Can go 10-20% over" },
    { id: "very_flexible", label: "Very Flexible", description: "Budget is just a guideline" },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">What's your budget?</h2>
        <p className="text-muted-foreground">Help us find destinations within your financial range</p>
      </div>

      <div className="space-y-8">
        {/* Tuition Budget Slider - Updated to max 12,000 EUR */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
            Annual Tuition Budget
          </h3>
          <div className="space-y-4">
            <div className="px-4">
              <Slider
                value={budgetData.tuitionBudgetRange || [0, 8000]}
                onValueChange={(value) => onUpdate({ ...budgetData, tuitionBudgetRange: value })}
                max={12000}
                min={0}
                step={500}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatCurrency((budgetData.tuitionBudgetRange || [0, 8000])[0])}</span>
              <span>{formatCurrency((budgetData.tuitionBudgetRange || [0, 8000])[1])}</span>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Most European programs range from €2,000 - €12,000 per year
            </div>
          </div>
        </div>

        {/* Living Costs Budget Slider */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center">
            <Home className="h-5 w-5 mr-2 text-green-600" />
            Monthly Living Costs Budget
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
            <div className="text-xs text-muted-foreground text-center">
              Includes accommodation, food, transport, and personal expenses
            </div>
          </div>
        </div>

        {/* Service Fees Budget Slider */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-purple-600" />
            Service Fees Budget
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
            <div className="text-xs text-muted-foreground text-center">
              Application fees, visa processing, and consultation services
            </div>
          </div>
        </div>

        {/* Budget Flexibility */}
        <div>
          <h3 className="font-semibold mb-3">Budget Flexibility</h3>
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
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
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Step 3: Language & Timeline - Updated to remove unavailable languages
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
  // Only available languages - removed Italian, Spanish, German
  const languages = [
    { id: "English", label: "English", flag: "🇬🇧", available: true },
    { id: "French", label: "French", flag: "🇫🇷", available: true },
    { id: "Dutch", label: "Dutch", flag: "🇳🇱", available: true },
    { id: "German", label: "German", flag: "🇩🇪", available: false, comingSoon: true },
    { id: "Spanish", label: "Spanish", flag: "🇪🇸", available: false, comingSoon: true },
    { id: "Italian", label: "Italian", flag: "🇮🇹", available: false, comingSoon: true },
  ]

  const languageLevels = [
    { id: "beginner", label: "Beginner (A1-A2)", description: "Basic understanding" },
    { id: "intermediate", label: "Intermediate (B1-B2)", description: "Conversational level" },
    { id: "advanced", label: "Advanced (C1-C2)", description: "Near-native fluency" },
  ]

  const intakePeriods = [
    { id: "September", label: "September", description: "Fall semester" },
    { id: "January", label: "January", description: "Spring semester" },
    { id: "May", label: "May", description: "Summer semester" },
    { id: "Any", label: "Any Time", description: "Flexible start date" },
  ]

  const urgencyOptions = [
    { id: "urgent", label: "Urgent", description: "Need to start within 6 months" },
    { id: "moderate", label: "Moderate", description: "Planning for next academic year" },
    { id: "flexible", label: "Flexible", description: "No specific timeline" },
  ]

  const toggleLanguage = (langId: string) => {
    const language = languages.find((l) => l.id === langId)
    if (!language?.available) return // Don't allow selection of unavailable languages

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
        <h2 className="text-2xl font-bold mb-2">Language & Timeline Preferences</h2>
        <p className="text-muted-foreground">Tell us about your language skills and timeline</p>
      </div>

      <div className="space-y-6">
        {/* Preferred Languages */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <Languages className="h-5 w-5 mr-2 text-blue-600" />
            Preferred Study Languages
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <Button
                key={lang.id}
                variant={preferences.preferredLanguages?.includes(lang.id) ? "default" : "outline"}
                onClick={() => toggleLanguage(lang.id)}
                disabled={!lang.available}
                className={cn(
                  "h-auto p-4 text-left justify-start relative",
                  !lang.available && "opacity-50 cursor-not-allowed",
                )}
              >
                <span className="mr-2">{lang.flag}</span>
                <div className="flex flex-col items-start">
                  <span>{lang.label}</span>
                  {lang.comingSoon && <span className="text-xs text-muted-foreground">Coming Soon</span>}
                </div>
              </Button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            More languages will be available soon. Currently supporting English, French, and Dutch programs.
          </div>
        </div>

        {/* Language Level */}
        <div>
          <h3 className="font-semibold mb-3">Your Language Level</h3>
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
          <h3 className="font-semibold mb-3">Language Certificate</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={preferences.hasLanguageCertificate === true ? "default" : "outline"}
              onClick={() => onUpdate({ ...preferences, hasLanguageCertificate: true })}
              className="h-auto p-4"
            >
              <CheckCircle className="h-5 w-5 mr-2" />I have certificates
            </Button>
            <Button
              variant={preferences.hasLanguageCertificate === false ? "default" : "outline"}
              onClick={() => onUpdate({ ...preferences, hasLanguageCertificate: false })}
              className="h-auto p-4"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              No certificates yet
            </Button>
          </div>
        </div>

        {/* Intake Periods */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            Preferred Start Times
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
            Timeline Urgency
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
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
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Step 4: Additional Preferences - Updated GPA scale to /20
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
      label: "Scholarship Required",
      description: "I need financial aid to study",
      icon: Award,
      color: "text-yellow-600",
    },
    {
      id: "religiousFacilities",
      label: "Religious Facilities",
      description: "Access to prayer rooms/religious services",
      icon: Building2,
      color: "text-purple-600",
    },
    {
      id: "halalFood",
      label: "Halal Food Options",
      description: "Halal dining options on campus",
      icon: Utensils,
      color: "text-green-600",
    },
    {
      id: "workWhileStudying",
      label: "Work While Studying",
      description: "Ability to work part-time during studies",
      icon: Users,
      color: "text-blue-600",
    },
  ]

  // Updated GPA levels for /20 scale
  const gpaLevels = [
    { id: "excellent", label: "Excellent (16-20/20)", description: "Top academic performance" },
    { id: "good", label: "Good (14-15/20)", description: "Above average performance" },
    { id: "intermediate", label: "Intermediate (12-13/20)", description: "Average performance" },
    { id: "improving", label: "Improving (10-11/20)", description: "Working to improve grades" },
  ]

  const toggleRequirement = (reqId: string) => {
    onUpdate({ ...preferences, [reqId]: !preferences[reqId] })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Additional Preferences</h2>
        <p className="text-muted-foreground">Help us personalize your destination recommendations</p>
      </div>

      <div className="space-y-6">
        {/* Academic Performance */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Current Academic Performance
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
          <div className="text-xs text-muted-foreground mt-2">
            Based on the French grading system (out of 20). We'll convert this for other countries' requirements.
          </div>
        </div>

        {/* Special Requirements */}
        <div>
          <h3 className="font-semibold mb-3">Special Requirements</h3>
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={onAnalyze} disabled={!preferences.currentGPA || isAnalyzing} className="min-w-40">
          {isAnalyzing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Find Destinations
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
        <h3 className="text-xl font-semibold mb-2">Analyzing Destinations...</h3>
        <p className="text-muted-foreground">Finding the best matches for your preferences</p>
      </div>
    )
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
        <h3 className="text-xl font-semibold mb-2">No Matches Found</h3>
        <p className="text-muted-foreground mb-6">
          We couldn't find destinations that match your current criteria. Try adjusting your preferences.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Adjust Preferences
          </Button>
          <Button onClick={onRestart}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Your Destination Matches</h2>
        <p className="text-muted-foreground">
          Found {matches.length} destination{matches.length !== 1 ? "s" : ""} that match your preferences
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
                          {match.score}% Match
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
                            <span>{destination.success_rate}% Success Rate</span>
                          </div>
                        )}
                      </div>

                      <p className="text-muted-foreground mb-4 line-clamp-2">{destination.description}</p>

                      {/* Match Reasons */}
                      {match.reasons && match.reasons.length > 0 && (
                        <div className="mb-3">
                          <h4 className="font-medium text-green-700 dark:text-green-300 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Why it matches:
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
                            Consider:
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
                      <div className="text-sm text-muted-foreground">Match Score</div>
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
                      <div className="text-xs text-muted-foreground">Min Tuition</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">
                        {match.estimatedCosts?.livingCosts ? formatCurrency(match.estimatedCosts.livingCosts) : "N/A"}
                      </div>
                      <div className="text-xs text-muted-foreground">Living Cost</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-600">
                        {destination.language_requirements || "Multiple"}
                      </div>
                      <div className="text-xs text-muted-foreground">Languages</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-orange-600">{destination.processing_time || "4-6 weeks"}</div>
                      <div className="text-xs text-muted-foreground">Processing</div>
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
          Adjust Preferences
        </Button>
        <Button onClick={onRestart}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Start New Search
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
      userLanguage: "en" as const,
      ...budgetData,
      ...preferences,
    }

    console.log("🚀 Starting destination consultation analysis...")
    console.log("📋 User preferences:", fullPreferences)

    try {
      await analyzeDestinations(fullPreferences)
      setCurrentStep(5)
    } catch (error) {
      console.error("❌ Error during analysis:", error)
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing destinations. Please try again.",
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
              Destination Consultation
            </CardTitle>
            {currentStep <= totalSteps && (
              <Badge variant="outline">
                Step {currentStep} of {totalSteps}
              </Badge>
            )}
          </div>
          {currentStep <= totalSteps && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
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









