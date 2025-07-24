"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  BookOpen,
  Globe,
  DollarSign,
  Home,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Target,
  Zap,
} from "lucide-react"
import { ConsultationTypeStep } from "./steps/ConsultationTypeStep"
import { LevelSelectionStep } from "./steps/LevelSelectionStep"
import { FieldSelectionStep } from "./steps/FieldSelectionStep"
import { LanguageSelectionStep } from "./steps/LanguageSelectionStep"
import { BudgetSelectionStep } from "./steps/BudgetSelectionStep"
import { PreferencesStep } from "./steps/PreferencesStep"
import { UnifiedResultsStep } from "./steps/UnifiedResultsStep"

export interface UnifiedConsultationData {
  consultationType: "programs" | "destinations" | ""
  level: string
  field: string
  fieldKeywords: string[]
  language: string
  languageTestRequired: boolean
  languageTestScore: string
  tuitionBudget: number
  serviceFeesBudget: number
  livingCostsBudget: number
  totalBudget: number
  budgetFlexibility: "strict" | "flexible" | "very_flexible"
  religiousFacilities: boolean
  halalFood: boolean
  scholarshipRequired: boolean
  accommodationPreference: string
  workWhileStudying: boolean
  startDatePreference: string
  countryPreference: string[]
  cityPreference: string
  durationPreference: string
  urgency: "asap" | "flexible" | "planning_ahead"
  priorityFactors: string[]
}

const STEPS = [
  { id: 1, title: "Consultation Type", icon: Target, description: "Choose what you're looking for" },
  { id: 2, title: "Study Level", icon: GraduationCap, description: "Your academic level" },
  { id: 3, title: "Field of Study", icon: BookOpen, description: "Your area of interest" },
  { id: 4, title: "Language & Tests", icon: Globe, description: "Language preferences" },
  { id: 5, title: "Budget Planning", icon: DollarSign, description: "Financial breakdown" },
  { id: 6, title: "Preferences", icon: Home, description: "Additional requirements" },
  { id: 7, title: "Perfect Matches", icon: Trophy, description: "Your personalized results" },
]

export default function UnifiedConsultationFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [consultationData, setConsultationData] = useState<UnifiedConsultationData>({
    consultationType: "",
    level: "",
    field: "",
    fieldKeywords: [],
    language: "",
    languageTestRequired: false,
    languageTestScore: "",
    tuitionBudget: 0,
    serviceFeesBudget: 0,
    livingCostsBudget: 0,
    totalBudget: 0,
    budgetFlexibility: "flexible",
    religiousFacilities: false,
    halalFood: false,
    scholarshipRequired: false,
    accommodationPreference: "",
    workWhileStudying: false,
    startDatePreference: "",
    countryPreference: [],
    cityPreference: "",
    durationPreference: "",
    urgency: "flexible",
    priorityFactors: [],
  })
  const [isValidStep, setIsValidStep] = useState(false)

  const progress = (currentStep / STEPS.length) * 100

  const updateData = (newData: Partial<UnifiedConsultationData>) => {
    setConsultationData((prev) => ({ ...prev, ...newData }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length && isValidStep) {
      setCurrentStep((prev) => prev + 1)
      setIsValidStep(false)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      setIsValidStep(true)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ConsultationTypeStep data={consultationData} updateData={updateData} onValidation={setIsValidStep} />
      case 2:
        return <LevelSelectionStep data={consultationData} updateData={updateData} onValidation={setIsValidStep} />
      case 3:
        return <FieldSelectionStep data={consultationData} updateData={updateData} onValidation={setIsValidStep} />
      case 4:
        return <LanguageSelectionStep data={consultationData} updateData={updateData} onValidation={setIsValidStep} />
      case 5:
        return <BudgetSelectionStep data={consultationData} updateData={updateData} onValidation={setIsValidStep} />
      case 6:
        return <PreferencesStep data={consultationData} updateData={updateData} onValidation={setIsValidStep} />
      case 7:
        return <UnifiedResultsStep data={consultationData} updateData={updateData} onValidation={setIsValidStep} />
      default:
        return null
    }
  }

  const currentStepInfo = STEPS[currentStep - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full">
                <Zap className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI-Powered Study Consultation
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Discover your perfect study path with our advanced matching algorithm that analyzes programs and
            destinations
          </p>
        </motion.div>

        {/* Progress Section */}
        <Card className="mb-8 border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                  <currentStepInfo.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">{currentStepInfo.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{currentStepInfo.description}</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 px-4 py-2 text-sm font-medium"
              >
                Step {currentStep} of {STEPS.length}
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-600 dark:text-slate-400">Progress</span>
                <span className="text-blue-600 dark:text-blue-400">{Math.round(progress)}%</span>
              </div>
              <div className="relative">
                <Progress value={progress} className="h-3 bg-slate-200 dark:bg-slate-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Steps Navigation */}
        <Card className="mb-8 border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between overflow-x-auto pb-2">
              {STEPS.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center space-y-3 min-w-0 flex-shrink-0">
                    <div
                      className={`relative p-3 rounded-xl transition-all duration-500 ${
                        step.id <= currentStep
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-110"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {step.id < currentStep && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <ChevronRight className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div className="text-center max-w-20">
                      <div
                        className={`text-xs font-semibold transition-colors duration-300 ${
                          step.id <= currentStep
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${
                        step.id < currentStep
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm"
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
          <CardContent className="p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 text-lg border-2 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 bg-transparent"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              onClick={nextStep}
              disabled={!isValidStep}
              className="flex items-center space-x-2 px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>Continue</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              className="flex items-center space-x-2 px-8 py-3 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              disabled={!isValidStep}
            >
              <Trophy className="w-5 h-5" />
              <span>View My Matches</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
