import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Globe, 
  DollarSign, 
  Calendar,
  Settings,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { useDestinationConsultation } from '@/hooks/useDestinationConsultation';

const STEPS = [
  { id: 1, title: 'Study Level', icon: GraduationCap, description: 'Choose your academic level' },
  { id: 2, title: 'Budget & Costs', icon: DollarSign, description: 'Set your budget range' },
  { id: 3, title: 'Language', icon: Globe, description: 'Language preferences' },
  { id: 4, title: 'Intake & Level', icon: Calendar, description: 'Academic requirements' },
  { id: 5, title: 'Preferences', icon: Settings, description: 'Additional requirements' },
  { id: 6, title: 'Your Matches', icon: Trophy, description: 'Perfect destinations' }
];

export default function DestinationConsultationFlow() {
  const {
    consultationData,
    currentStep,
    matchedDestinations,
    isLoading,
    updateConsultationData,
    nextStep,
    prevStep,
    isStepValid,
    completeConsultation
  } = useDestinationConsultation();

  const progress = (currentStep / STEPS.length) * 100;
  const currentStepInfo = STEPS[currentStep - 1];

  const handleNext = async () => {
    if (currentStep < STEPS.length) {
      nextStep();
    } else {
      await completeConsultation();
    }
  };

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
            AI-Powered Destination Matcher
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find your perfect study destination with our intelligent matching system
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
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Destination Consultation Coming Soon</h2>
              <p className="text-muted-foreground mb-6">
                We're building an advanced AI-powered destination matching system
              </p>
              <Badge className="bg-purple-100 text-purple-800">Under Development</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isStepValid(currentStep) || isLoading}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            <span>{currentStep < STEPS.length ? 'Continue' : 'Find Matches'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}