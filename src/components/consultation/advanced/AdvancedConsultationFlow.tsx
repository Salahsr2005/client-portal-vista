
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  BookOpen, 
  Globe, 
  DollarSign, 
  Home,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Trophy,
  Users,
  Clock
} from 'lucide-react';
import { LevelSelectionStep } from './steps/LevelSelectionStep';
import { FieldSelectionStep } from './steps/FieldSelectionStep';
import { LanguageSelectionStep } from './steps/LanguageSelectionStep';
import { BudgetSelectionStep } from './steps/BudgetSelectionStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { ResultsStep } from './steps/ResultsStep';

interface ConsultationData {
  level: string;
  field: string;
  fieldKeywords: string[];
  language: string;
  languageTestRequired: boolean;
  languageTestScore: string;
  budget: number;
  livingCosts: number;
  religiousFacilities: boolean;
  halalFood: boolean;
  scholarshipRequired: boolean;
  accommodationPreference: string;
  workWhileStudying: boolean;
  startDatePreference: string;
}

const STEPS = [
  { id: 1, title: 'Study Level', icon: GraduationCap, description: 'Choose your academic level' },
  { id: 2, title: 'Field of Study', icon: BookOpen, description: 'Select your area of interest' },
  { id: 3, title: 'Language & Tests', icon: Globe, description: 'Language preferences' },
  { id: 4, title: 'Budget & Costs', icon: DollarSign, description: 'Financial planning' },
  { id: 5, title: 'Preferences', icon: Home, description: 'Additional requirements' },
  { id: 6, title: 'Perfect Match', icon: Trophy, description: 'Your ideal programs' }
];

export default function AdvancedConsultationFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [consultationData, setConsultationData] = useState<ConsultationData>({
    level: '',
    field: '',
    fieldKeywords: [],
    language: '',
    languageTestRequired: false,
    languageTestScore: '',
    budget: 0,
    livingCosts: 0,
    religiousFacilities: false,
    halalFood: false,
    scholarshipRequired: false,
    accommodationPreference: '',
    workWhileStudying: false,
    startDatePreference: ''
  });
  const [isValidStep, setIsValidStep] = useState(false);

  const progress = (currentStep / STEPS.length) * 100;

  const updateData = (newData: Partial<ConsultationData>) => {
    setConsultationData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length && isValidStep) {
      setCurrentStep(prev => prev + 1);
      setIsValidStep(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setIsValidStep(true);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <LevelSelectionStep
            data={consultationData}
            updateData={updateData}
            onValidation={setIsValidStep}
          />
        );
      case 2:
        return (
          <FieldSelectionStep
            data={consultationData}
            updateData={updateData}
            onValidation={setIsValidStep}
          />
        );
      case 3:
        return (
          <LanguageSelectionStep
            data={consultationData}
            updateData={updateData}
            onValidation={setIsValidStep}
          />
        );
      case 4:
        return (
          <BudgetSelectionStep
            data={consultationData}
            updateData={updateData}
            onValidation={setIsValidStep}
          />
        );
      case 5:
        return (
          <PreferencesStep
            data={consultationData}
            updateData={updateData}
            onValidation={setIsValidStep}
          />
        );
      case 6:
        return (
          <ResultsStep
            data={consultationData}
            updateData={updateData}
            onValidation={setIsValidStep}
          />
        );
      default:
        return null;
    }
  };

  const currentStepInfo = STEPS[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI-Powered Program Matcher
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover your perfect study abroad program with our advanced matching algorithm
          </p>
        </motion.div>

        {/* Progress Bar */}
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
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Steps Navigation */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`p-3 rounded-full transition-all duration-300 ${
                      step.id <= currentStep
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <div className={`text-xs font-medium ${
                        step.id <= currentStep ? 'text-indigo-600' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      step.id < currentStep ? 'bg-indigo-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
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
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              onClick={nextStep}
              disabled={!isValidStep}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              disabled={!isValidStep}
            >
              <Trophy className="w-4 h-4" />
              <span>View My Matches</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
