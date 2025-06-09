
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, GraduationCap, Globe, Clock } from 'lucide-react';
import { useConsultationResults, ConsultationPreferences, MatchedProgram } from '@/hooks/useConsultationResults';
import { Badge } from '@/components/ui/badge';

const STEPS = [
  { id: 1, title: 'Study Level & Field', icon: GraduationCap },
  { id: 2, title: 'Budget & Finances', icon: BookOpen },
  { id: 3, title: 'Location & Language', icon: Globe },
  { id: 4, title: 'Your Results', icon: Clock }
];

export default function EnhancedConsultationFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState<Partial<ConsultationPreferences>>({});
  const { isLoading, matchedPrograms, findMatchingPrograms, saveConsultationResult } = useConsultationResults();

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      // Find matching programs
      const fullPreferences = preferences as ConsultationPreferences;
      const programs = await findMatchingPrograms(fullPreferences);
      await saveConsultationResult(fullPreferences, programs);
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePreferences = (updates: Partial<ConsultationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return preferences.studyLevel && preferences.field;
      case 2:
        return preferences.budget && preferences.livingCosts !== undefined;
      case 3:
        return preferences.language && preferences.destination;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 preferences={preferences} onUpdate={updatePreferences} />;
      case 2:
        return <Step2 preferences={preferences} onUpdate={updatePreferences} />;
      case 3:
        return <Step3 preferences={preferences} onUpdate={updatePreferences} />;
      case 4:
        return <Step4 programs={matchedPrograms} preferences={preferences} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                  isActive ? 'border-blue-500 bg-blue-500 text-white' :
                  isCompleted ? 'border-green-500 bg-green-500 text-white' :
                  'border-gray-300 bg-white text-gray-400'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                {step.id < STEPS.length && (
                  <div className={`w-16 h-1 mx-2 transition-colors ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        <Progress value={(currentStep / STEPS.length) * 100} className="w-full" />
        <p className="text-center mt-2 text-sm text-muted-foreground">
          Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
        </p>
      </div>

      {/* Step Content */}
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

      {/* Navigation */}
      {currentStep < 4 && (
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isStepComplete() || isLoading}
            className="flex items-center"
          >
            {currentStep === 3 ? 'Find Programs' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Step Components
const Step1 = ({ preferences, onUpdate }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>What do you want to study?</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Study Level Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">Study Level</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['Bachelor', 'Master', 'PhD'].map((level) => (
            <Button
              key={level}
              variant={preferences.studyLevel === level ? 'default' : 'outline'}
              onClick={() => onUpdate({ studyLevel: level })}
              className="h-16"
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      {/* Field Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">Field of Study</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Engineering', 'Business', 'Computer Science', 'Medicine',
            'Arts', 'Sciences', 'Law', 'Education'
          ].map((field) => (
            <Button
              key={field}
              variant={preferences.field === field ? 'default' : 'outline'}
              onClick={() => onUpdate({ field })}
              className="h-12"
            >
              {field}
            </Button>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

const Step2 = ({ preferences, onUpdate }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>Budget & Financial Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Budget Range */}
      <div>
        <label className="block text-sm font-medium mb-3">Total Budget (EUR/year)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: '€5,000 - €15,000', value: 10000 },
            { label: '€15,000 - €25,000', value: 20000 },
            { label: '€25,000 - €35,000', value: 30000 },
            { label: '€35,000+', value: 40000 }
          ].map((budget) => (
            <Button
              key={budget.value}
              variant={preferences.budget === budget.value ? 'default' : 'outline'}
              onClick={() => onUpdate({ budget: budget.value })}
              className="h-12"
            >
              {budget.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Living Costs */}
      <div>
        <label className="block text-sm font-medium mb-3">Expected Living Costs (EUR/month)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: '€400 - €600', value: 500 },
            { label: '€600 - €800', value: 700 },
            { label: '€800 - €1,200', value: 1000 },
            { label: '€1,200+', value: 1400 }
          ].map((cost) => (
            <Button
              key={cost.value}
              variant={preferences.livingCosts === cost.value ? 'default' : 'outline'}
              onClick={() => onUpdate({ livingCosts: cost.value })}
              className="h-12"
            >
              {cost.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Scholarship */}
      <div>
        <label className="block text-sm font-medium mb-3">Do you need a scholarship?</label>
        <div className="flex space-x-3">
          <Button
            variant={preferences.scholarshipRequired === true ? 'default' : 'outline'}
            onClick={() => onUpdate({ scholarshipRequired: true })}
            className="flex-1"
          >
            Yes, I need scholarship support
          </Button>
          <Button
            variant={preferences.scholarshipRequired === false ? 'default' : 'outline'}
            onClick={() => onUpdate({ scholarshipRequired: false })}
            className="flex-1"
          >
            No, I can self-fund
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Step3 = ({ preferences, onUpdate }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>Location & Language Preferences</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Language */}
      <div>
        <label className="block text-sm font-medium mb-3">Preferred Language</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['English', 'French', 'German', 'Spanish', 'Italian', 'Any'].map((lang) => (
            <Button
              key={lang}
              variant={preferences.language === lang ? 'default' : 'outline'}
              onClick={() => onUpdate({ language: lang })}
              className="h-12"
            >
              {lang}
            </Button>
          ))}
        </div>
      </div>

      {/* Destination */}
      <div>
        <label className="block text-sm font-medium mb-3">Preferred Destination</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {['France', 'Germany', 'Spain', 'Italy', 'Belgium', 'Any European Country'].map((dest) => (
            <Button
              key={dest}
              variant={preferences.destination === dest ? 'default' : 'outline'}
              onClick={() => onUpdate({ destination: dest })}
              className="h-12"
            >
              {dest}
            </Button>
          ))}
        </div>
      </div>

      {/* Special Requirements */}
      <div>
        <label className="block text-sm font-medium mb-3">Special Requirements</label>
        <div className="space-y-3">
          <Button
            variant={preferences.religiousFacilities ? 'default' : 'outline'}
            onClick={() => onUpdate({ religiousFacilities: !preferences.religiousFacilities })}
            className="w-full justify-start"
          >
            Religious facilities needed
          </Button>
          <Button
            variant={preferences.halalFood ? 'default' : 'outline'}
            onClick={() => onUpdate({ halalFood: !preferences.halalFood })}
            className="w-full justify-start"
          >
            Halal food availability
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Step4 = ({ programs, preferences }: { programs: MatchedProgram[], preferences: any }) => (
  <Card>
    <CardHeader>
      <CardTitle>Your Personalized Program Recommendations</CardTitle>
      <p className="text-muted-foreground">
        Based on your preferences, here are the best matches for you:
      </p>
    </CardHeader>
    <CardContent>
      {programs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No programs found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {programs.slice(0, 5).map((program) => (
            <div key={program.program_id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{program.program_name}</h3>
                  <p className="text-sm text-muted-foreground">{program.university}</p>
                  <p className="text-sm text-muted-foreground">{program.city}, {program.country}</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {Math.round(program.match_percentage)}% Match
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Tuition:</span>
                  <p>€{program.tuition_min.toLocaleString()} - €{program.tuition_max.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium">Living Costs:</span>
                  <p>€{program.living_cost_min}/month</p>
                </div>
                <div>
                  <span className="font-medium">Language:</span>
                  <p>{program.program_language}</p>
                </div>
                <div>
                  <span className="font-medium">Scholarship:</span>
                  <p>{program.scholarship_available ? 'Available' : 'Not Available'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);
