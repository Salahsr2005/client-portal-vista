"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle } from "lucide-react"

// Import steps
import { ConsultationTypeStep } from "./steps/ConsultationTypeStep"
import { LevelSelectionStep } from "./steps/LevelSelectionStep"
import { FieldSelectionStep } from "./steps/FieldSelectionStep"
import { LanguageSelectionStep } from "./steps/LanguageSelectionStep"
import { BudgetSelectionStep } from "./steps/BudgetSelectionStep"
import { PreferencesStep } from "./steps/PreferencesStep"
import { UnifiedResultsStep } from "./steps/UnifiedResultsStep"

export interface ConsultationData {
  type: "programs" | "destinations"
  level: string
  fields: string[]
  language: string
  budget: number
  specialRequirements: {
    religiousFacilities: boolean
    halalFood: boolean
    scholarshipRequired: boolean
  }
  destination?: string
  subjects?: string[]
}

const INITIAL_DATA: ConsultationData = {
  type: "programs",
  level: "",
  fields: [],
  language: "",
  budget: 0,
  specialRequirements: {
    religiousFacilities: false,
    halalFood: false,
    scholarshipRequired: false,
  },
}

export const UnifiedConsultationFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [consultationData, setConsultationData] = useState<ConsultationData>(INITIAL_DATA)
  const [isComplete, setIsComplete] = useState(false)

  // Define steps based on consultation type
  const getSteps = useCallback(() => {
    const baseSteps = [
      { id: "type", title: "Consultation Type", component: ConsultationTypeStep },
      { id: "level", title: "Study Level", component: LevelSelectionStep },
    ]

    // Add field selection only for programs
    if (consultationData.type === "programs") {
      baseSteps.push({ id: "field", title: "Field of Study", component: FieldSelectionStep })
    }

    baseSteps.push(
      { id: "language", title: "Language", component: LanguageSelectionStep },
      { id: "budget", title: "Budget", component: BudgetSelectionStep },
      { id: "preferences", title: "Preferences", component: PreferencesStep },
      { id: "results", title: "Results", component: UnifiedResultsStep },
    )

    return baseSteps
  }, [consultationData.type])

  const steps = getSteps()
  const totalSteps = steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const updateConsultationData = (updates: Partial<ConsultationData>) => {
    setConsultationData((prev) => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setConsultationData(INITIAL_DATA)
    setIsComplete(false)
  }

  // Handle consultation type change - reset to step 1 if type changes
  const handleTypeChange = (type: "programs" | "destinations") => {
    if (type !== consultationData.type) {
      setConsultationData({ ...INITIAL_DATA, type })
      setCurrentStep(1) // Move to level selection
    }
  }

  const renderCurrentStep = () => {
    const CurrentStepComponent = steps[currentStep].component
    const stepProps = {
      consultationData,
      onUpdate: updateConsultationData,
      onNext: handleNext,
      onBack: handleBack,
      onReset: handleReset,
    }

    switch (steps[currentStep].id) {
      case "type":
        return (
          <CurrentStepComponent
            selectedType={consultationData.type}
            onTypeChange={handleTypeChange}
            onNext={handleNext}
            {...stepProps}
          />
        )
      case "level":
        return (
          <CurrentStepComponent
            selectedLevel={consultationData.level}
            onLevelChange={(level: string) => updateConsultationData({ level })}
            onNext={handleNext}
            onBack={handleBack}
            consultationType={consultationData.type}
            {...stepProps}
          />
        )
      case "field":
        return (
          <CurrentStepComponent
            selectedFields={consultationData.fields}
            onFieldsChange={(fields: string[]) => updateConsultationData({ fields })}
            onNext={handleNext}
            onBack={handleBack}
            {...stepProps}
          />
        )
      case "language":
        return (
          <CurrentStepComponent
            selectedLanguage={consultationData.language}
            onLanguageChange={(language: string) => updateConsultationData({ language })}
            onNext={handleNext}
            onBack={handleBack}
            {...stepProps}
          />
        )
      case "budget":
        return (
          <CurrentStepComponent
            selectedBudget={consultationData.budget}
            onBudgetChange={(budget: number) => updateConsultationData({ budget })}
            onNext={handleNext}
            onBack={handleBack}
            consultationType={consultationData.type}
            level={consultationData.level}
            {...stepProps}
          />
        )
      case "preferences":
        return (
          <CurrentStepComponent
            specialRequirements={consultationData.specialRequirements}
            onRequirementsChange={(specialRequirements: any) => updateConsultationData({ specialRequirements })}
            onNext={handleNext}
            onBack={handleBack}
            {...stepProps}
          />
        )
      case "results":
        return (
          <CurrentStepComponent
            preferences={{
              type: consultationData.type,
              level: consultationData.level,
              field: consultationData.fields[0], // Use first field for compatibility
              subjects: consultationData.fields,
              language: consultationData.language,
              budget: consultationData.budget,
              specialRequirements: consultationData.specialRequirements,
            }}
            onReset={handleReset}
            {...stepProps}
          />
        )
      default:
        return null
    }
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Consultation Complete!</h2>
        <p className="text-muted-foreground">
          Thank you for using our consultation service. We hope you found the perfect match!
        </p>
        <Button
          onClick={handleReset}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
        >
          Start New Consultation
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Consultation
            </h1>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{steps[currentStep].title}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 ${
                  index <= currentStep ? "text-blue-600" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    index < currentStep
                      ? "bg-blue-600 text-white"
                      : index === currentStep
                        ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index < currentStep ? "✓" : index + 1}
                </div>
                <span className="hidden sm:block text-xs font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}


