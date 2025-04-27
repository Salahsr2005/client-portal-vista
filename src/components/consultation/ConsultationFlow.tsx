
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
import { Badge } from "@/components/ui/badge";
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { consultationTypes } from './ConsultationTypes';
import { 
  BookOpen, 
  Building, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  CircleDollarSign, 
  Clock, 
  GraduationCap, 
  Languages, 
  ListChecks, 
  MapPin, 
  Sparkles, 
  Star 
} from 'lucide-react';
import { usePrograms } from '@/hooks/usePrograms';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Step flow for the consultation
const STEPS = {
  SELECT_TYPE: 0,
  BASIC_INFO: 1,
  PREFERENCES: 2,
  BUDGET: 3,
  RESULTS: 4,
};

// Define study levels
const STUDY_LEVELS = ['Bachelor', 'Master', 'PhD', 'Certificate', 'Diploma'];

// Define languages
const LANGUAGES = ['English', 'French', 'Spanish', 'German', 'Arabic', 'Any'];

// Define fields of study
const FIELDS = [
  'Business & Management',
  'Computer Science & IT',
  'Engineering',
  'Arts & Humanities',
  'Social Sciences',
  'Medicine & Health',
  'Natural Sciences',
  'Education',
  'Law',
  'Any'
];

// Define countries
const COUNTRIES = ['France', 'Spain', 'Germany', 'Italy', 'Belgium', 'Netherlands', 'Portugal', 'Sweden', 'Europe', 'Any'];

// Define durations
const DURATIONS = [
  { label: 'One semester', value: 'semester' },
  { label: 'One year', value: 'year' },
  { label: 'Two years', value: 'two_years' },
  { label: 'Full program', value: 'full_program' },
];

const ConsultationFlow = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: programsData, isLoading: programsLoading } = usePrograms();
  const [currentStep, setCurrentStep] = useState(STEPS.SELECT_TYPE);
  const [progress, setProgress] = useState(20);
  const [consultationType, setConsultationType] = useState<string | null>(null);
  
  // Form state
  const [selectedStudyLevel, setSelectedStudyLevel] = useState<string>(STUDY_LEVELS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(LANGUAGES[0]);
  const [selectedField, setSelectedField] = useState<string>(FIELDS[0]);
  const [selectedCountry, setSelectedCountry] = useState<string>(COUNTRIES[0]);
  const [selectedDuration, setSelectedDuration] = useState<string>(DURATIONS[0].value);
  const [scholarshipRequired, setScholarshipRequired] = useState<boolean>(false);
  const [religiousFacilities, setReligiousFacilities] = useState<boolean>(false);
  const [halalFood, setHalalFood] = useState<boolean>(false);
  const [budget, setBudget] = useState<number>(10000);
  
  // Results
  const [matchedPrograms, setMatchedPrograms] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingResults, setIsLoadingResults] = useState<boolean>(false);

  // Update progress when step changes
  useEffect(() => {
    const progressPercentages = [20, 40, 60, 80, 100];
    setProgress(progressPercentages[currentStep]);
  }, [currentStep]);

  // Handle next step
  const handleNext = () => {
    if (currentStep < Object.keys(STEPS).length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle consultation type selection
  const handleTypeSelection = (typeId: string) => {
    setConsultationType(typeId);
    handleNext();
  };

  // Handle budget change
  const handleBudgetChange = (value: number[]) => {
    setBudget(value[0]);
  };

  // Save consultation and get matched programs
  const handleSubmitConsultation = async () => {
    setIsSubmitting(true);
    setIsLoadingResults(true);
    
    try {
      // Calculate matched programs based on preferences
      if (programsData) {
        // Simulate matching algorithm with scoring system
        const scored = programsData.map(program => {
          // Calculate match score based on preferences
          let score = 0;
          
          // Study level match
          if (program.study_level === selectedStudyLevel) {
            score += 20;
          }
          
          // Language match
          if (program.program_language === selectedLanguage || selectedLanguage === 'Any') {
            score += 15;
          }
          
          // Field match
          if ((program.field_keywords && program.field_keywords.some(k => 
                k.toLowerCase().includes(selectedField.toLowerCase()))) || 
              selectedField === 'Any') {
            score += 15;
          }
          
          // Country match
          if (program.country === selectedCountry || 
              (selectedCountry === 'Europe' && 
               ['France', 'Spain', 'Germany', 'Italy', 'Belgium', 'Netherlands', 'Portugal', 'Sweden'].includes(program.country)) || 
              selectedCountry === 'Any') {
            score += 10;
          }
          
          // Budget match (tuition + living costs for one year)
          const yearlyRate = (program.tuition_min + (program.living_cost_min * 12));
          if (budget >= yearlyRate) {
            score += 20;
          } else if (budget >= yearlyRate * 0.8) {
            score += 10;
          }
          
          // Scholarship match
          if (!scholarshipRequired || (scholarshipRequired && program.scholarship_available)) {
            score += 10;
          }
          
          // Cultural needs match
          if ((!religiousFacilities && !halalFood) || 
              (religiousFacilities && program.religious_facilities) || 
              (halalFood && program.halal_food_availability)) {
            score += 10;
          }
          
          return {
            ...program,
            matchScore: score
          };
        });
        
        // Sort by match score
        const matched = scored
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 5);  // Get top 5 matches
          
        setMatchedPrograms(matched);
      }
      
      // Save consultation to database if user is logged in
      if (user) {
        const fieldKeywords = selectedField.split(' & ').map(f => f.toLowerCase());
        
        const { error } = await supabase
          .from('consultation_results')
          .insert({
            user_id: user.id,
            study_level: selectedStudyLevel,
            language_preference: selectedLanguage,
            field_preference: selectedField,
            field_keywords: fieldKeywords,
            destination_preference: selectedCountry,
            budget: budget,
            duration_preference: selectedDuration,
            scholarship_required: scholarshipRequired,
            religious_facilities_required: religiousFacilities,
            halal_food_required: halalFood,
            conversion_status: 'New',
          });
          
        if (error) {
          console.error('Error saving consultation:', error);
          toast({
            title: 'Error saving your consultation',
            description: 'Please try again later.',
            variant: 'destructive',
          });
        }
      }
      
      // Move to results step
      handleNext();
    } catch (error) {
      console.error('Error during consultation:', error);
      toast({
        title: 'Something went wrong',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setIsLoadingResults(false);
    }
  };

  // Handle viewing a program
  const handleViewProgram = (programId: string) => {
    navigate(`/program/${programId}`);
  };
  
  // Get badge variant based on score
  const getBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';  // Primary color
    if (score >= 60) return 'secondary';
    return 'outline';
  };
  
  // Render step based on current step
  const renderStep = () => {
    switch (currentStep) {
      case STEPS.SELECT_TYPE:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultationTypes.map(type => (
              <Card 
                key={type.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${consultationType === type.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => handleTypeSelection(type.id)}
              >
                <CardHeader>
                  <div className={`${type.color} p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                    {type.icon}
                  </div>
                  <CardTitle>{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        );
      
      case STEPS.BASIC_INFO:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Tell us about your academic goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="studyLevel">Study Level</Label>
                <Select value={selectedStudyLevel} onValueChange={setSelectedStudyLevel}>
                  <SelectTrigger id="studyLevel" className="w-full">
                    <SelectValue placeholder="Select study level" />
                  </SelectTrigger>
                  <SelectContent>
                    {STUDY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fieldStudy">Field of Study</Label>
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger id="fieldStudy" className="w-full">
                    <SelectValue placeholder="Select field of study" />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELDS.map((field) => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language of Instruction</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNext}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
      
      case STEPS.PREFERENCES:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Tell us about your destination preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="country">Preferred Destination</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger id="country" className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Program Duration</Label>
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger id="duration" className="w-full">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Preferences</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="scholarship">Scholarship Required</Label>
                    <p className="text-sm text-muted-foreground">
                      Do you need a scholarship for your studies?
                    </p>
                  </div>
                  <Switch
                    id="scholarship"
                    checked={scholarshipRequired}
                    onCheckedChange={setScholarshipRequired}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="religious">Religious Facilities</Label>
                    <p className="text-sm text-muted-foreground">
                      Do you need access to religious facilities?
                    </p>
                  </div>
                  <Switch
                    id="religious"
                    checked={religiousFacilities}
                    onCheckedChange={setReligiousFacilities}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="halal">Halal Food Options</Label>
                    <p className="text-sm text-muted-foreground">
                      Do you require halal food options?
                    </p>
                  </div>
                  <Switch
                    id="halal"
                    checked={halalFood}
                    onCheckedChange={setHalalFood}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNext}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
      
      case STEPS.BUDGET:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Budget Information</CardTitle>
              <CardDescription>
                What is your total budget for one year?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label htmlFor="budget">Annual Budget (in EUR)</Label>
                  <span className="font-semibold text-lg">€{budget.toLocaleString()}</span>
                </div>
                <Slider
                  id="budget"
                  min={5000}
                  max={50000}
                  step={1000}
                  defaultValue={[budget]}
                  onValueChange={handleBudgetChange}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div>€5,000</div>
                  <div>€50,000</div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-medium">What does this include?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CircleDollarSign className="h-5 w-5 text-primary" />
                      <span>Tuition fees</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" />
                      <span>Accommodation costs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>Living expenses</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button 
                onClick={handleSubmitConsultation} 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Get Recommendations'} {!isSubmitting && <Sparkles className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        );
      
      case STEPS.RESULTS:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Program Recommendations</CardTitle>
                <CardDescription>
                  Based on your preferences, here are our top recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingResults ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-medium">Finding your perfect matches...</p>
                  </div>
                ) : matchedPrograms.length > 0 ? (
                  <div className="space-y-6">
                    {matchedPrograms.map((program, index) => (
                      <Card key={program.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 bg-muted flex items-center justify-center p-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-primary mb-1">{program.matchScore}%</div>
                              <Badge variant={getBadgeVariant(program.matchScore)}>
                                Match Score
                              </Badge>
                            </div>
                          </div>
                          <div className="md:w-3/4 p-4">
                            <h3 className="text-xl font-semibold mb-2">{program.name}</h3>
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{program.university}, {program.country}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{program.study_level}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Languages className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Language: {program.program_language}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                  {program.field}
                                </Badge>
                                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                  {program.duration_months} months
                                </Badge>
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                  €{program.tuition_min.toLocaleString()} tuition
                                </Badge>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <Button variant="outline" size="sm" onClick={() => handleViewProgram(program.id)}>
                                View Details
                              </Button>
                              {program.scholarship_available && (
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                                  Scholarship Available
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    <div className="text-center mt-8">
                      <p className="text-muted-foreground mb-4">
                        Want more personalized guidance?
                      </p>
                      <Button onClick={() => navigate('/appointments')}>
                        Schedule a Consultation <Clock className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No matches found</h3>
                    <p className="text-muted-foreground mb-6">
                      We couldn't find programs matching your criteria. Try adjusting your preferences.
                    </p>
                    <Button variant="outline" onClick={() => setCurrentStep(STEPS.PREFERENCES)}>
                      Adjust Preferences
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {matchedPrograms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Why These Recommendations?</CardTitle>
                  <CardDescription>
                    Understanding how we matched these programs to your preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Our recommendation system uses multiple factors to match you with the best programs:
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Study Level Match</h4>
                          <p className="text-sm text-muted-foreground">
                            We matched programs with your selected study level: <span className="font-medium">{selectedStudyLevel}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Field of Study</h4>
                          <p className="text-sm text-muted-foreground">
                            Programs aligned with your field of interest: <span className="font-medium">{selectedField}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Budget Compatibility</h4>
                          <p className="text-sm text-muted-foreground">
                            Programs within your budget range of <span className="font-medium">€{budget.toLocaleString()}</span> per year
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Location Preference</h4>
                          <p className="text-sm text-muted-foreground">
                            Programs in your preferred destination: <span className="font-medium">{selectedCountry}</span>
                          </p>
                        </div>
                      </div>
                      
                      {scholarshipRequired && (
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <Check className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Scholarship Availability</h4>
                            <p className="text-sm text-muted-foreground">
                              Programs with scholarship opportunities
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(STEPS.SELECT_TYPE)}>
                    Start New Consultation
                  </Button>
                  <Button variant="default" onClick={() => navigate('/appointments')}>
                    Book Advisor Session
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Getting started</span>
          <span>Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {renderStep()}
    </div>
  );
};

export default ConsultationFlow;
