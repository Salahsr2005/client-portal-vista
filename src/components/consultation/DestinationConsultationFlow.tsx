import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  GraduationCap, 
  Globe, 
  DollarSign, 
  Calendar,
  Settings,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';
import { useDestinations } from '@/hooks/useDestinations';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useGuestRestrictions } from '@/components/layout/GuestModeWrapper';

const STEPS = [
  { id: 1, title: 'Study Level', icon: GraduationCap, description: 'Choose your academic level' },
  { id: 2, title: 'Budget', icon: DollarSign, description: 'Set your budget range' },
  { id: 3, title: 'Language', icon: Globe, description: 'Language preferences' },
  { id: 4, title: 'Preferences', icon: Settings, description: 'Additional requirements' },
  { id: 5, title: 'Your Matches', icon: Trophy, description: 'Perfect destinations' }
];

interface ConsultationData {
  studyLevel: string;
  budget: number;
  language: string;
  intakePeriod: string;
  workWhileStudying: boolean;
  scholarshipRequired: boolean;
}

export default function DestinationConsultationFlow() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: destinations = [], isLoading: destinationsLoading } = useDestinations();
  const { isRestricted, handleRestrictedAction } = useGuestRestrictions();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [consultationData, setConsultationData] = useState<ConsultationData>({
    studyLevel: '',
    budget: 0,
    language: '',
    intakePeriod: '',
    workWhileStudying: false,
    scholarshipRequired: false
  });
  const [matchedDestinations, setMatchedDestinations] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const progress = (currentStep / STEPS.length) * 100;
  const currentStepInfo = STEPS[currentStep - 1];

  const updateData = (updates: Partial<ConsultationData>) => {
    setConsultationData(prev => ({ ...prev, ...updates }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return !!consultationData.studyLevel;
      case 2: return consultationData.budget > 0;
      case 3: return !!consultationData.language;
      case 4: return !!consultationData.intakePeriod;
      default: return true;
    }
  };

  // Simple matching algorithm
  const findMatches = () => {
    if (!destinations.length) return [];

    return destinations.map(dest => {
      let score = 0;
      const reasons = [];

      // Budget matching
      const tuitionKey = `${consultationData.studyLevel.toLowerCase()}_tuition_min` as keyof typeof dest;
      const tuitionMin = dest[tuitionKey] as number || 0;
      if (consultationData.budget >= tuitionMin + (dest.service_fee || 0)) {
        score += 40;
        reasons.push('Fits your budget');
      }

      // Language matching
      if (dest.language_requirements?.toLowerCase().includes(consultationData.language.toLowerCase()) || 
          dest.language_requirements?.toLowerCase().includes('english') ||
          consultationData.language.toLowerCase() === 'english') {
        score += 30;
        reasons.push('Language compatible');
      }

      // Intake matching
      if (dest.intake_periods?.some(period => 
        period.toLowerCase().includes(consultationData.intakePeriod.toLowerCase())
      )) {
        score += 20;
        reasons.push('Available for your preferred intake');
      }

      // Program availability
      if (dest.available_programs?.includes(consultationData.studyLevel)) {
        score += 10;
        reasons.push('Offers your study level');
      }

      return {
        ...dest,
        matchScore: score,
        matchReasons: reasons
      };
    })
    .filter(dest => dest.matchScore >= 30)
    .sort((a, b) => b.matchScore - a.matchScore);
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 4) {
      setIsProcessing(true);
      try {
        const matches = findMatches();
        setMatchedDestinations(matches);

        // Save to database
        if (user && !isRestricted) {
          await supabase.from('consultation_results').insert({
            user_id: user.id,
            study_level: consultationData.studyLevel as any,
            budget: consultationData.budget,
            language_preference: consultationData.language,
            destination_preference: 'Any',
            field_preference: 'Any',
            matched_programs: matches.map(m => ({
              destination_id: m.id,
              name: m.name,
              country: m.country,
              match_score: m.matchScore,
              reasons: m.matchReasons
            })),
            preferences_data: consultationData as any,
            work_while_studying: consultationData.workWhileStudying,
            scholarship_required: consultationData.scholarshipRequired
          });

          toast({
            title: "Consultation Complete",
            description: `Found ${matches.length} matching destinations for you!`
          });
        } else if (isRestricted) {
          toast({
            title: "Consultation Complete",
            description: `Found ${matches.length} matching destinations! Sign up to save your results.`
          });
        }

        setCurrentStep(5);
      } catch (error) {
        console.error('Error saving consultation:', error);
        toast({
          title: "Error",
          description: "Failed to save consultation. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">What level do you want to study?</h2>
              <p className="text-muted-foreground">Choose your desired academic level</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Bachelor', 'Master', 'PhD'].map(level => (
                <Button
                  key={level}
                  variant={consultationData.studyLevel === level ? 'default' : 'outline'}
                  onClick={() => updateData({ studyLevel: level })}
                  className="h-20 text-lg"
                >
                  <div className="flex flex-col items-center">
                    <GraduationCap className="h-6 w-6 mb-2" />
                    {level}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">What's your budget?</h2>
              <p className="text-muted-foreground">Total budget for tuition and fees (EUR)</p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: '€5,000 - €10,000', value: 10000 },
                  { label: '€10,000 - €20,000', value: 20000 },
                  { label: '€20,000 - €30,000', value: 30000 },
                  { label: '€30,000+', value: 40000 }
                ].map(option => (
                  <Button
                    key={option.value}
                    variant={consultationData.budget === option.value ? 'default' : 'outline'}
                    onClick={() => updateData({ budget: option.value })}
                    className="h-16 text-sm"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-budget">Or enter custom amount:</Label>
                <Input
                  id="custom-budget"
                  type="number"
                  placeholder="Enter amount in EUR"
                  value={consultationData.budget || ''}
                  onChange={(e) => updateData({ budget: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">What language do you prefer?</h2>
              <p className="text-muted-foreground">Choose your preferred study language</p>
            </div>
            <div className="max-w-md mx-auto">
              <Select value={consultationData.language} onValueChange={(value) => updateData({ language: value })}>
                <SelectTrigger className="h-14 text-lg">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="Dutch">Dutch</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="Any">Any Language</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Additional Preferences</h2>
              <p className="text-muted-foreground">Tell us more about your preferences</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <Label htmlFor="intake">Preferred Intake Period</Label>
                <Select value={consultationData.intakePeriod} onValueChange={(value) => updateData({ intakePeriod: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select intake period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="September">September</SelectItem>
                    <SelectItem value="January">January</SelectItem>
                    <SelectItem value="February">February</SelectItem>
                    <SelectItem value="May">May</SelectItem>
                    <SelectItem value="Fall">Fall</SelectItem>
                    <SelectItem value="Any">Any Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="work"
                    checked={consultationData.workWhileStudying}
                    onCheckedChange={(checked) => updateData({ workWhileStudying: !!checked })}
                  />
                  <Label htmlFor="work">I want to work while studying</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="scholarship"
                    checked={consultationData.scholarshipRequired}
                    onCheckedChange={(checked) => updateData({ scholarshipRequired: !!checked })}
                  />
                  <Label htmlFor="scholarship">I need scholarship opportunities</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your Perfect Matches</h2>
              <p className="text-muted-foreground">
                We found {matchedDestinations.length} destinations that match your preferences
              </p>
            </div>
            
            <div className="space-y-4">
              {matchedDestinations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No matches found. Try adjusting your criteria.</p>
                </div>
              ) : (
                matchedDestinations.map((dest, index) => (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div 
                              className="w-16 h-16 rounded-lg bg-cover bg-center"
                              style={{ 
                                backgroundImage: `url(${dest.logo_url || dest.cover_image_url || '/placeholder.svg'})` 
                              }}
                            />
                            <div>
                              <h3 className="text-xl font-semibold">{dest.name}</h3>
                              <p className="text-muted-foreground flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {dest.country}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {dest.matchScore}% Match
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">{dest.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <span className="font-medium">Tuition:</span>
                            <p>€{dest[`${consultationData.studyLevel.toLowerCase()}_tuition_min`]?.toLocaleString()} - €{dest[`${consultationData.studyLevel.toLowerCase()}_tuition_max`]?.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Processing:</span>
                            <p>{dest.processing_time}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="font-medium text-sm">Why this matches:</p>
                          <div className="flex flex-wrap gap-2">
                            {dest.matchReasons.map((reason: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (destinationsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Loading destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-4xl mx-auto px-4 py-8">
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
            Find Your Perfect Destination
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Answer a few questions and we'll match you with the best study destinations
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
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isProcessing}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <span>
                {isProcessing ? 'Finding Matches...' : 
                 currentStep === 4 ? 'Find My Matches' : 'Continue'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}