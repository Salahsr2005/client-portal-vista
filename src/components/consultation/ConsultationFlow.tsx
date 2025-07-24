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

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your Personalized Matches</h2>
              <p className="text-muted-foreground">
                We found {matchedDestinations.length} destinations ranked by compatibility
              </p>
            </div>
            
            <div className="space-y-4">
              {matchedDestinations.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No perfect matches found with your current criteria.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Try adjusting:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Increase your budget or flexibility</li>
                      <li>Consider different intake periods</li>
                      <li>Expand language or regional preferences</li>
                    </ul>
                  </div>
                </div>
              ) : (
                matchedDestinations.map((dest, index) => (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`hover:shadow-lg transition-shadow ${
                      dest.recommendation === 'highly_recommended' ? 'ring-2 ring-green-200 bg-green-50/30' :
                      dest.recommendation === 'recommended' ? 'ring-1 ring-blue-200 bg-blue-50/30' :
                      dest.recommendation === 'consider' ? 'ring-1 ring-yellow-200 bg-yellow-50/30' :
                      'ring-1 ring-gray-200'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div 
                              className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
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
                              <div className="flex items-center mt-1">
                                {dest.recommendation === 'highly_recommended' && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    <Trophy className="h-3 w-3 mr-1" />
                                    Top Choice
                                  </Badge>
                                )}
                                {dest.recommendation === 'recommended' && (
                                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Recommended
                                  </Badge>
                                )}
                                {dest.recommendation === 'consider' && (
                                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Consider
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`text-lg px-3 py-1 ${
                              dest.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                              dest.matchScore >= 60 ? 'bg-blue-100 text-blue-800' :
                              dest.matchScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {dest.matchScore}% Match
                            </Badge>
                            {dest.matchDetails?.successRates && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Success: {Math.round((dest.matchDetails.successRates.admission + dest.matchDetails.successRates.visa) / 2)}%
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{dest.description}</p>
                        
                        {/* Cost Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4 p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-700">Tuition Range:</span>
                            <p className="text-gray-900">
                              €{dest.matchDetails?.costs?.tuitionRange[0]?.toLocaleString()} - 
                              €{dest.matchDetails?.costs?.tuitionRange[1]?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Total Cost:</span>
                            <p className="text-gray-900">
                              €{dest.matchDetails?.costs?.totalRange[0]?.toLocaleString()} - 
                              €{dest.matchDetails?.costs?.totalRange[1]?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Processing:</span>
                            <p className="text-gray-900">{dest.processing_time || 'N/A'}</p>
                          </div>
                        </div>
                        
                        {/* Match Reasons */}
                        <div className="space-y-3">
                          {dest.matchReasons.length > 0 && (
                            <div>
                              <p className="font-medium text-sm text-green-700 mb-2 flex items-center">
                                <Check className="h-4 w-4 mr-1" />
                                Why this matches:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {dest.matchReasons.map((reason: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                    {reason}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {dest.matchWarnings.length > 0 && (
                            <div>
                              <p className="font-medium text-sm text-orange-700 mb-2 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Things to consider:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {dest.matchWarnings.map((warning: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                                    {warning}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Additional Information */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                            <div>
                              <span className="font-medium">Available Programs:</span>
                              <p>{dest.available_programs?.join(', ') || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="font-medium">Languages:</span>
                              <p>{dest.language_requirements || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="font-medium">Intake Periods:</span>
                              <p>{dest.intake_periods?.join(', ') || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="font-medium">Application Fee:</span>
                              <p>€{dest.application_fee || 0}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
              
              {matchedDestinations.length > 0 && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Review the detailed cost breakdowns and requirements</li>
                    <li>Check language certificate requirements if applicable</li>
                    <li>Contact our consultants for personalized application guidance</li>
                    <li>Start preparing required documents for your top choices</li>
                  </ul>
                </div>
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
      <div className="container max-w-5xl mx-auto px-4 py-8">
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
            AI-Powered Destination Matching
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced algorithm analyzing 25+ factors to find your perfect study destination
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
        {currentStep < 6 && (
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
                {isProcessing ? 'Analyzing Matches...' : 
                 currentStep === 5 ? 'Find My Perfect Matches' : 'Continue'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Restart Option for Results Page */}
        {currentStep === 6 && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(1);
                setConsultationData({
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
                setMatchedDestinations([]);
              }}
              className="flex items-center space-x-2"
            >
              <span>Start New Consultation</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
