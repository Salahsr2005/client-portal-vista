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
  Check,
  AlertCircle,
  TrendingUp,
  Clock,
  Users,
  FileText
} from 'lucide-react';
import { useDestinations } from '@/hooks/useDestinations';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useGuestRestrictions } from '@/components/layout/GuestModeWrapper';

const STEPS = [
  { id: 1, title: 'Study Level', icon: GraduationCap, description: 'Choose your academic level' },
  { id: 2, title: 'Budget & Financial Info', icon: DollarSign, description: 'Set your financial preferences' },
  { id: 3, title: 'Language & Location', icon: Globe, description: 'Language and regional preferences' },
  { id: 4, title: 'Academic Profile', icon: FileText, description: 'Your academic background' },
  { id: 5, title: 'Timeline & Preferences', icon: Settings, description: 'Timeline and additional requirements' },
  { id: 6, title: 'Your Matches', icon: Trophy, description: 'Perfect destinations' }
];

interface ConsultationData {
  studyLevel: string;
  totalBudget: number;
  budgetFlexibility: 'strict' | 'flexible' | 'very_flexible';
  includeServiceFees: boolean;
  language: string;
  languageLevel: 'beginner' | 'intermediate' | 'advanced' | 'native';
  regionPreference: string[];
  currentGPA: string;
  previousEducationCountry: string;
  hasLanguageCertificate: boolean;
  intakePeriod: string;
  urgency: 'asap' | 'flexible' | 'planning_ahead';
  workWhileStudying: boolean;
  scholarshipRequired: boolean;
  priorityFactors: string[];
}

// Enhanced matching algorithm with detailed scoring
const calculateMatchScore = (destination: any, consultationData: ConsultationData) => {
  let totalScore = 0;
  let maxPossibleScore = 0;
  const reasons: string[] = [];
  const warnings: string[] = [];
  const details: any = {};

  // 1. Budget Analysis (30% weight)
  const budgetWeight = 30;
  maxPossibleScore += budgetWeight;
  
  const studyLevel = consultationData.studyLevel.toLowerCase();
  const tuitionMin = destination[`${studyLevel}_tuition_min`] || 0;
  const tuitionMax = destination[`${studyLevel}_tuition_max`] || tuitionMin;
  const serviceFee = consultationData.includeServiceFees ? (destination.service_fee || 0) : 0;
  const applicationFee = destination.application_fee || 0;
  const totalMinCost = tuitionMin + serviceFee + applicationFee;
  const totalMaxCost = tuitionMax + serviceFee + applicationFee;

  details.costs = {
    tuitionRange: [tuitionMin, tuitionMax],
    serviceFee,
    applicationFee,
    totalRange: [totalMinCost, totalMaxCost]
  };

  if (consultationData.totalBudget >= totalMaxCost) {
    totalScore += budgetWeight;
    reasons.push(`Comfortably within budget (€${totalMaxCost.toLocaleString()} vs €${consultationData.totalBudget.toLocaleString()})`);
  } else if (consultationData.totalBudget >= totalMinCost) {
    const budgetRatio = (consultationData.totalBudget - totalMinCost) / (totalMaxCost - totalMinCost);
    totalScore += budgetWeight * (0.5 + budgetRatio * 0.5);
    reasons.push(`Partially within budget range`);
    if (consultationData.budgetFlexibility === 'strict') {
      warnings.push(`May exceed strict budget by €${(totalMaxCost - consultationData.totalBudget).toLocaleString()}`);
    }
  } else {
    const shortfall = totalMinCost - consultationData.totalBudget;
    if (consultationData.budgetFlexibility === 'very_flexible' && shortfall <= consultationData.totalBudget * 0.2) {
      totalScore += budgetWeight * 0.3;
      warnings.push(`Budget shortfall of €${shortfall.toLocaleString()}, but marked as very flexible`);
    } else {
      warnings.push(`Exceeds budget by €${shortfall.toLocaleString()}`);
    }
  }

  // 2. Language Requirements (25% weight)
  const languageWeight = 25;
  maxPossibleScore += languageWeight;
  
  const destLanguages = destination.language_requirements?.toLowerCase() || '';
  const userLanguage = consultationData.language.toLowerCase();
  
  if (userLanguage === 'any' || destLanguages.includes('any') || destLanguages.includes(userLanguage)) {
    if (userLanguage === 'english' || destLanguages.includes('english')) {
      totalScore += languageWeight;
      reasons.push('Language fully compatible');
    } else {
      // Adjust score based on language proficiency level
      const proficiencyMultiplier = {
        'native': 1.0,
        'advanced': 0.9,
        'intermediate': 0.7,
        'beginner': 0.4
      }[consultationData.languageLevel] || 0.7;
      
      totalScore += languageWeight * proficiencyMultiplier;
      reasons.push(`Language compatible (${consultationData.languageLevel} level)`);
      
      if (consultationData.languageLevel === 'beginner') {
        warnings.push('May require language preparation');
      }
    }
  } else {
    warnings.push('Language requirements may not match');
  }

  // 3. Academic Level & Requirements (20% weight)
  const academicWeight = 20;
  maxPossibleScore += academicWeight;
  
  const availablePrograms = destination.available_programs || [];
  if (availablePrograms.includes(consultationData.studyLevel)) {
    totalScore += academicWeight * 0.7; // Base score for program availability
    
    // Additional scoring based on academic level requirements
    const academicLevelReq = destination[`${studyLevel}_academic_level`];
    const gpaMapping = { 'A': 'High', 'B': 'Medium', 'C': 'Medium', 'D': 'Any', 'F': 'Any' };
    const userAcademicLevel = gpaMapping[consultationData.currentGPA as keyof typeof gpaMapping] || 'Medium';
    
    if (academicLevelReq === 'Any' || academicLevelReq === userAcademicLevel || 
        (academicLevelReq === 'Medium' && userAcademicLevel === 'High')) {
      totalScore += academicWeight * 0.3;
      reasons.push('Academic requirements match');
    } else if (academicLevelReq === 'High' && userAcademicLevel !== 'High') {
      warnings.push('May require higher academic performance');
    }
    
    reasons.push(`Offers ${consultationData.studyLevel} program`);
  } else {
    warnings.push(`${consultationData.studyLevel} program not available`);
  }

  // 4. Intake Timing (15% weight)
  const intakeWeight = 15;
  maxPossibleScore += intakeWeight;
  
  const intakePeriods = destination.intake_periods || [];
  if (consultationData.intakePeriod === 'Any' || 
      intakePeriods.some((period: string) => 
        period.toLowerCase().includes(consultationData.intakePeriod.toLowerCase()) ||
        consultationData.intakePeriod.toLowerCase().includes(period.toLowerCase())
      )) {
    totalScore += intakeWeight;
    reasons.push('Available for preferred intake period');
  } else if (intakePeriods.length > 0) {
    // Partial score if other intakes available
    totalScore += intakeWeight * 0.4;
    warnings.push(`Preferred intake not available. Available: ${intakePeriods.join(', ')}`);
  }

  // 5. Success Rates (10% weight)
  const successWeight = 10;
  maxPossibleScore += successWeight;
  
  const admissionRate = destination.admission_success_rate || 0;
  const visaRate = destination.visa_success_rate || 0;
  const avgSuccessRate = (admissionRate + visaRate) / 2;
  
  if (avgSuccessRate > 0) {
    totalScore += successWeight * (avgSuccessRate / 100);
    if (avgSuccessRate >= 80) {
      reasons.push('High success rate');
    } else if (avgSuccessRate >= 60) {
      reasons.push('Good success rate');
    } else {
      warnings.push('Lower success rate');
    }
    details.successRates = { admission: admissionRate, visa: visaRate };
  }

  // Priority factors bonus (up to 10 extra points)
  consultationData.priorityFactors.forEach(factor => {
    switch (factor) {
      case 'low_cost':
        if (totalMinCost < consultationData.totalBudget * 0.8) {
          totalScore += 5;
          reasons.push('Excellent value for money');
        }
        break;
      case 'high_success_rate':
        if (avgSuccessRate >= 80) {
          totalScore += 5;
          reasons.push('Prioritized for high success rate');
        }
        break;
      case 'fast_processing':
        const processingTime = destination.processing_time?.toLowerCase() || '';
        if (processingTime.includes('week') || processingTime.includes('fast')) {
          totalScore += 5;
          reasons.push('Fast processing time');
        }
        break;
      case 'work_opportunities':
        if (consultationData.workWhileStudying) {
          // This would need additional data in the destination table
          totalScore += 3;
          reasons.push('Work opportunities available');
        }
        break;
    }
  });

  // Regional preference bonus
  if (consultationData.regionPreference.length > 0 && 
      !consultationData.regionPreference.includes('Any') &&
      consultationData.regionPreference.some(region => 
        destination.country?.toLowerCase().includes(region.toLowerCase()) ||
        destination.region?.toLowerCase().includes(region.toLowerCase())
      )) {
    totalScore += 5;
    reasons.push('Matches regional preference');
  }

  // Scholarship requirement check
  if (consultationData.scholarshipRequired) {
    // This would need scholarship data in the destination table
    // For now, we'll assume some destinations offer scholarships
    if (destination.name.toLowerCase().includes('scholarship') || 
        destination.description?.toLowerCase().includes('scholarship')) {
      totalScore += 5;
      reasons.push('Scholarship opportunities available');
    } else {
      warnings.push('Scholarship availability unclear');
    }
  }

  // Calculate final percentage score
  const finalScore = Math.min(100, Math.round((totalScore / maxPossibleScore) * 100));
  
  return {
    score: finalScore,
    reasons,
    warnings,
    details,
    recommendation: finalScore >= 80 ? 'highly_recommended' : 
                   finalScore >= 60 ? 'recommended' : 
                   finalScore >= 40 ? 'consider' : 'not_recommended'
  };
};

export default function DestinationConsultationFlow() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: destinations = [], isLoading: destinationsLoading } = useDestinations();
  const { isRestricted, handleRestrictedAction } = useGuestRestrictions();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [consultationData, setConsultationData] = useState<ConsultationData>({
    studyLevel: '',
    totalBudget: 0,
    budgetFlexibility: 'flexible',
    includeServiceFees: true,
    language: '',
    languageLevel: 'intermediate',
    regionPreference: [],
    currentGPA: '',
    previousEducationCountry: '',
    hasLanguageCertificate: false,
    intakePeriod: '',
    urgency: 'flexible',
    workWhileStudying: false,
    scholarshipRequired: false,
    priorityFactors: []
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
      case 2: return consultationData.totalBudget > 0;
      case 3: return !!consultationData.language;
      case 4: return !!consultationData.currentGPA;
      case 5: return !!consultationData.intakePeriod;
      default: return true;
    }
  };

  // Enhanced matching algorithm
  const findMatches = () => {
    if (!destinations.length) return [];

    const scoredDestinations = destinations.map(dest => {
      const matchResult = calculateMatchScore(dest, consultationData);
      return {
        ...dest,
        matchScore: matchResult.score,
        matchReasons: matchResult.reasons,
        matchWarnings: matchResult.warnings,
        matchDetails: matchResult.details,
        recommendation: matchResult.recommendation
      };
    });

    // Filter destinations with minimum score threshold
    const minScoreThreshold = consultationData.budgetFlexibility === 'strict' ? 50 : 30;
    
    return scoredDestinations
      .filter(dest => dest.matchScore >= minScoreThreshold)
      .sort((a, b) => {
        // Primary sort: recommendation level
        const recommendationOrder = { 'highly_recommended': 4, 'recommended': 3, 'consider': 2, 'not_recommended': 1 };
        const aOrder = recommendationOrder[a.recommendation as keyof typeof recommendationOrder] || 0;
        const bOrder = recommendationOrder[b.recommendation as keyof typeof recommendationOrder] || 0;
        
        if (aOrder !== bOrder) return bOrder - aOrder;
        
        // Secondary sort: match score
        return b.matchScore - a.matchScore;
      });
  };

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 5) {
      setIsProcessing(true);
      try {
        const matches = findMatches();
        setMatchedDestinations(matches);

        // Save to database with enhanced data
        if (user && !isRestricted) {
          await supabase.from('consultation_results').insert({
            user_id: user.id,
            study_level: consultationData.studyLevel as any,
            budget: consultationData.totalBudget,
            language_preference: consultationData.language,
            destination_preference: consultationData.regionPreference.join(', ') || 'Any',
            field_preference: 'Any',
            matched_programs: matches.map(m => ({
              destination_id: m.id,
              name: m.name,
              country: m.country,
              match_score: m.matchScore,
              reasons: m.matchReasons,
              warnings: m.matchWarnings,
              recommendation: m.recommendation
            })),
            preferences_data: consultationData as any,
            work_while_studying: consultationData.workWhileStudying,
            scholarship_required: consultationData.scholarshipRequired
          });

          toast({
            title: "Consultation Complete",
            description: `Found ${matches.length} matching destinations with detailed analysis!`
          });
        } else if (isRestricted) {
          toast({
            title: "Consultation Complete",
            description: `Found ${matches.length} matching destinations! Sign up to save your results.`
          });
        }

        setCurrentStep(6);
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
              <h2 className="text-2xl font-bold mb-2">Budget & Financial Information</h2>
              <p className="text-muted-foreground">Help us understand your financial situation</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <Label>Total Available Budget (EUR)</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: '€5,000 - €10,000', value: 10000 },
                    { label: '€10,000 - €20,000', value: 20000 },
                    { label: '€20,000 - €30,000', value: 30000 },
                    { label: '€30,000+', value: 50000 }
                  ].map(option => (
                    <Button
                      key={option.value}
                      variant={consultationData.totalBudget === option.value ? 'default' : 'outline'}
                      onClick={() => updateData({ totalBudget: option.value })}
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
                    value={consultationData.totalBudget || ''}
                    onChange={(e) => updateData({ totalBudget: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Budget Flexibility</Label>
                <Select value={consultationData.budgetFlexibility} onValueChange={(value: any) => updateData({ budgetFlexibility: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strict">Strict - Cannot exceed budget</SelectItem>
                    <SelectItem value="flexible">Flexible - Can exceed by 10-15%</SelectItem>
                    <SelectItem value="very_flexible">Very Flexible - Open to higher costs for quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="service-fees"
                  checked={consultationData.includeServiceFees}
                  onCheckedChange={(checked) => updateData({ includeServiceFees: !!checked })}
                />
                <Label htmlFor="service-fees">Include agency service fees in calculations</Label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Language & Location Preferences</h2>
              <p className="text-muted-foreground">Tell us about your language skills and location preferences</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <Label>Preferred Study Language</Label>
                <Select value={consultationData.language} onValueChange={(value) => updateData({ language: value })}>
                  <SelectTrigger className="h-14 text-lg">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="Dutch">Dutch</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="Any">Any Language</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Your Language Proficiency Level</Label>
                <Select value={consultationData.languageLevel} onValueChange={(value: any) => updateData({ languageLevel: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="native">Native Speaker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Regional Preferences (Optional)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Europe', 'North America', 'Asia', 'Oceania', 'Any'].map(region => (
                    <Button
                      key={region}
                      variant={consultationData.regionPreference.includes(region) ? 'default' : 'outline'}
                      onClick={() => {
                        const current = consultationData.regionPreference;
                        if (region === 'Any') {
                          updateData({ regionPreference: ['Any'] });
                        } else {
                          const filtered = current.filter(r => r !== 'Any');
                          if (current.includes(region)) {
                            updateData({ regionPreference: filtered.filter(r => r !== region) });
                          } else {
                            updateData({ regionPreference: [...filtered, region] });
                          }
                        }
                      }}
                      className="h-12 text-sm"
                    >
                      {region}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="language-cert"
                  checked={consultationData.hasLanguageCertificate}
                  onCheckedChange={(checked) => updateData({ hasLanguageCertificate: !!checked })}
                />
                <Label htmlFor="language-cert">I have official language certificates</Label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Academic Profile</h2>
              <p className="text-muted-foreground">Tell us about your academic background</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <Label>Current/Previous GPA Level</Label>
                <Select value={consultationData.currentGPA} onValueChange={(value) => updateData({ currentGPA: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your academic performance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Excellent (A/90%+/First Class)</SelectItem>
                    <SelectItem value="B">Very Good (B/80-89%/Upper Second)</SelectItem>
                    <SelectItem value="C">Good (C/70-79%/Lower Second)</SelectItem>
                    <SelectItem value="D">Satisfactory (D/60-69%/Third Class)</SelectItem>
                    <SelectItem value="F">Below Average (Below 60%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Country of Previous Education</Label>
                <Select value={consultationData.previousEducationCountry} onValueChange={(value) => updateData({ previousEducationCountry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Algeria">Algeria</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Timeline & Final Preferences</h2>
              <p className="text-muted-foreground">When do you want to start and what's most important to you?</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <Label>Preferred Intake Period</Label>
                <Select value={consultationData.intakePeriod} onValueChange={(value) => updateData({ intakePeriod: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select intake period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="September">September 2025</SelectItem>
                    <SelectItem value="January">January 2026</SelectItem>
                    <SelectItem value="February">February 2026</SelectItem>
                    <SelectItem value="May">May 2026</SelectItem>
                    <SelectItem value="Fall">Fall 2025</SelectItem>
                    <SelectItem value="Any">Flexible / Any Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Application Urgency</Label>
                <Select value={consultationData.urgency} onValueChange={(value: any) => updateData({ urgency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP - Need to apply within 1-2 months</SelectItem>
                    <SelectItem value="flexible">Flexible - 3-6 months timeline</SelectItem>
                    <SelectItem value="planning_ahead">Planning Ahead - 6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>What's Most Important to You? (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'low_cost', label: 'Low Cost' },
                    { id: 'high_success_rate', label: 'High Success Rate' },
                    { id: 'fast_processing', label: 'Fast Processing' },
                    { id: 'work_opportunities', label: 'Work Opportunities' },
                    { id: 'quality_education', label: 'Education Quality' },
                    { id: 'location', label: 'Specific Location' }
                  ].map(factor => (
                    <Button
                      key={factor.id}
                      variant={consultationData.priorityFactors.includes(factor.id) ? 'default' : 'outline'}
                      onClick={() => {
                        const current = consultationData.priorityFactors;
                        if (current.includes(factor.id)) {
                          updateData({ priorityFactors: current.filter(f => f !== factor.id) });
                        } else {
                          updateData({ priorityFactors: [...current, factor.id] });
                        }
                      }}
                      className="h-12 text-sm"
                    >
                      {factor.label}
                    </Button>
