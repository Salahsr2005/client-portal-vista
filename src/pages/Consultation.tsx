
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, ArrowLeft, CheckCircle, Sparkles, GraduationCap, 
  Globe, Coins, Calendar, BookOpen, Languages, Award, 
  Map, Briefcase, School, Laptop, BadgePercent, Heart, PieChart,
  LibraryBig, Landmark, Brain, HardHat, User2, Clock, Info,
  CheckCircle2, Users, Clock3, Building, FileCheck, Ban, Gauge
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider"; 
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Study fields with icons and descriptions
interface StudyField {
  name: string;
  icon: React.ReactNode;
  description: string;
}

const studyFields: StudyField[] = [
  { name: "Computer Science", icon: <Laptop className="h-5 w-5" />, description: "Programming, AI, cybersecurity" },
  { name: "Business", icon: <Briefcase className="h-5 w-5" />, description: "Management, marketing, finance" },
  { name: "Engineering", icon: <HardHat className="h-5 w-5" />, description: "Civil, electrical, mechanical" },
  { name: "Arts", icon: <LibraryBig className="h-5 w-5" />, description: "Fine arts, design, performing arts" },
  { name: "Medicine", icon: <Heart className="h-5 w-5" />, description: "Medicine, pharmacy, nursing" },
  { name: "Law", icon: <Landmark className="h-5 w-5" />, description: "Legal studies, international law" },
  { name: "Social Sciences", icon: <User2 className="h-5 w-5" />, description: "Psychology, sociology, economics" },
  { name: "Natural Sciences", icon: <PieChart className="h-5 w-5" />, description: "Physics, chemistry, biology" },
  { name: "Any", icon: <Brain className="h-5 w-5" />, description: "Open to all fields of study" }
];

const STUDY_LEVELS = ["Bachelor", "Master", "PhD", "Certificate", "Diploma"];
const LANGUAGES = ["English", "French", "Spanish", "German", "Italian", "Arabic", "Any"];
const COUNTRIES = ["France", "Germany", "Spain", "Italy", "Belgium", "Poland", "Portugal", "Any"];
const DURATIONS = ["semester", "year", "two_years", "full_program"];
const HOUSING_PREFERENCES = ["university_housing", "private_apartment", "homestay", "shared_apartment", "any"];

export default function Consultation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [progress, setProgress] = useState(20);

  // Consultation parameters
  const [budget, setBudget] = useState(15000);
  const [language, setLanguage] = useState("English");
  const [studyLevel, setStudyLevel] = useState<"Bachelor" | "Master" | "PhD" | "Certificate" | "Diploma">("Bachelor");
  const [country, setCountry] = useState("Any");
  const [duration, setDuration] = useState("year");
  const [field, setField] = useState("Any");
  const [scholarshipRequired, setScholarshipRequired] = useState(false);
  const [religiousFacilities, setReligiousFacilities] = useState(false);
  const [halalFood, setHalalFood] = useState(false);
  const [housingPreference, setHousingPreference] = useState("any");
  const [internshipImportance, setInternshipImportance] = useState(3);
  const [careerProspects, setCareerProspects] = useState(4);
  const [currentGPA, setCurrentGPA] = useState<string>("");
  const [hasWorkExperience, setHasWorkExperience] = useState(false);
  const [employmentGoal, setEmploymentGoal] = useState<string>("both");
  const [expectedStartDate, setExpectedStartDate] = useState<string>("next_semester");
  const [degreeRecognition, setDegreeRecognition] = useState<boolean>(true);
  const [fundingMethod, setFundingMethod] = useState<string>("self");
  
  // Additional preference parameters
  const [citySize, setCitySize] = useState<string>("medium");
  const [climatePreference, setClimatePreference] = useState<string>("moderate");
  const [studyMethod, setStudyMethod] = useState<string>("on_campus");

  const goToNextStep = () => {
    setStep(step + 1);
    setProgress(Math.min(20 * step + 20, 100));
  };
  
  const goToPrevStep = () => {
    setStep(step - 1);
    setProgress(Math.max(20 * (step - 2) + 20, 20));
  };

  const formatHousingPreference = (pref: string): string => {
    switch(pref) {
      case 'university_housing': return 'University Housing';
      case 'private_apartment': return 'Private Apartment';
      case 'homestay': return 'Homestay';
      case 'shared_apartment': return 'Shared Apartment';
      case 'any': return 'Any';
      default: return pref;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your consultation results",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Convert study level to proper format for database
      const formattedStudyLevel = studyLevel.toUpperCase() as any;

      // Save the consultation to the database
      const { data, error } = await supabase
        .from('consultation_results')
        .insert({
          user_id: user.id,
          budget: budget,
          language_preference: language, 
          study_level: formattedStudyLevel,
          destination_preference: country,
          duration_preference: duration,
          field_preference: field,
          scholarship_required: scholarshipRequired,
          religious_facilities_required: religiousFacilities,
          halal_food_required: halalFood,
          field_keywords: field === "Any" ? null : field.split(" "),
          housing_preference: housingPreference
        })
        .select();
      
      if (error) throw error;
      
      // Call the Supabase stored function to find matching programs
      const { data: matchResults, error: matchError } = await supabase
        .rpc('match_programs', { 
          p_budget: budget,
          p_language: language.toLowerCase(),
          p_study_level: formattedStudyLevel,
          p_country: country.toLowerCase(),
          p_duration: duration,
          p_field: field.toLowerCase(),
          p_scholarship: scholarshipRequired,
          p_religious_facilities: religiousFacilities,
          p_halal_food: halalFood
        });
        
      if (matchError) throw matchError;

      // Get the full program details for each match
      const programPromises = matchResults.map(async match => {
        const { data: programData, error: programError } = await supabase
          .from('programs')
          .select('*')
          .eq('id', match.program_id)
          .single();
          
        if (programError) {
          console.error('Error fetching program details:', programError);
          return null;
        }
        
        return {
          ...programData,
          match_score: match.match_score,
          budget_score: match.budget_score,
          language_score: match.language_score,
          level_score: match.level_score,
          location_score: match.location_score,
          duration_score: match.duration_score,
          field_score: match.field_score,
          scholarship_score: match.scholarship_score,
          cultural_score: match.cultural_score
        };
      });
      
      const programsWithDetails = await Promise.all(programPromises);
      setResults(programsWithDetails.filter(Boolean));
      
      // Update the saved results with the program recommendations
      await supabase
        .from('consultation_results')
        .update({
          recommended_programs: programsWithDetails
            .filter(Boolean)
            .map(p => ({ id: p.id, name: p.name, match_score: p.match_score }))
        })
        .eq('id', data[0].id);
        
      setLoading(false);
      goToNextStep();
      
    } catch (error) {
      console.error("Error during consultation:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "There was a problem processing your consultation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDuration = (dur: string) => {
    switch (dur) {
      case 'semester': return '1 Semester';
      case 'year': return '1 Year';
      case 'two_years': return '2 Years';
      case 'full_program': return 'Full Program';
      default: return dur;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-2">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Academic Background</h2>
              <p className="text-muted-foreground">Tell us about your academic interests and background</p>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-base font-medium block mb-2">What level of study are you interested in?</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {STUDY_LEVELS.map((level) => (
                    <Button
                      key={level}
                      variant={studyLevel === level ? "default" : "outline"}
                      onClick={() => setStudyLevel(level as any)}
                      className="justify-start h-auto py-3"
                    >
                      <GraduationCap className="mr-2 h-5 w-5" />
                      <div className="text-left">
                        <div>{level.replace('_', ' ')}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="text-base font-medium block mb-2">What field are you interested in studying?</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {studyFields.map((f) => (
                    <Button
                      key={f.name}
                      variant={field === f.name ? "default" : "outline"}
                      onClick={() => setField(f.name)}
                      className="justify-start h-auto p-3"
                    >
                      <div className="mr-3 text-primary">{f.icon}</div>
                      <div className="text-left">
                        <div className="font-medium">{f.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{f.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="current-gpa">Current GPA (optional)</Label>
                  <Input
                    id="current-gpa"
                    type="text"
                    value={currentGPA}
                    onChange={(e) => setCurrentGPA(e.target.value)}
                    placeholder="e.g., 3.5/4.0"
                  />
                  <p className="text-xs text-muted-foreground">
                    This helps match you with programs that fit your academic profile
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="block">Work Experience</Label>
                  <RadioGroup 
                    value={hasWorkExperience.toString()} 
                    onValueChange={(v) => setHasWorkExperience(v === "true")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="work-yes" />
                      <Label htmlFor="work-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="work-no" />
                      <Label htmlFor="work-no">No</Label>
                    </div>
                  </RadioGroup>
                  <p className="text-xs text-muted-foreground">
                    Relevant work experience can improve admission chances for some programs
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="block text-base font-medium">When do you plan to start your studies?</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button 
                    variant={expectedStartDate === "next_semester" ? "default" : "outline"}
                    onClick={() => setExpectedStartDate("next_semester")}
                    className="justify-start h-auto"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Next Semester
                  </Button>
                  <Button 
                    variant={expectedStartDate === "next_year" ? "default" : "outline"}
                    onClick={() => setExpectedStartDate("next_year")}
                    className="justify-start h-auto"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Next Year
                  </Button>
                  <Button 
                    variant={expectedStartDate === "in_two_years" ? "default" : "outline"}
                    onClick={() => setExpectedStartDate("in_two_years")}
                    className="justify-start h-auto"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    In Two Years
                  </Button>
                  <Button 
                    variant={expectedStartDate === "undecided" ? "default" : "outline"}
                    onClick={() => setExpectedStartDate("undecided")}
                    className="justify-start h-auto"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Undecided
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button onClick={goToNextStep} className="bg-primary">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-2">
                <Coins className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Financial Planning</h2>
              <p className="text-muted-foreground">Let's plan for your education finances</p>
            </div>
            
            <div className="space-y-8">
              <Card className="shadow-md">
                <CardHeader className="bg-muted/50 pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Coins className="mr-2 h-5 w-5 text-primary" />
                    Budget Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="budget-slider">Your Annual Budget for Tuition and Living Costs</Label>
                      <span className="font-semibold text-lg">${budget.toLocaleString()}</span>
                    </div>
                    <Slider
                      id="budget-slider" 
                      value={[budget]} 
                      onValueChange={(values) => setBudget(values[0])} 
                      max={50000} 
                      step={1000}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>$5,000</span>
                      <span>$25,000</span>
                      <span>$50,000</span>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 p-4 text-sm">
                    <div className="flex">
                      <Info className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
                      <span>
                        Average annual costs for international students range from €8,000-€15,000 in most European countries,
                        with tuition fees varying by program type and prestige.
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div>
                    <Label className="text-lg font-medium mb-4 block">How will you fund your studies?</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        variant={fundingMethod === "self" ? "default" : "outline"}
                        onClick={() => setFundingMethod("self")}
                        className="justify-start h-auto py-3 px-4"
                      >
                        <div className="mr-3 bg-primary/20 p-2 rounded-full">
                          <User2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Self-funded</div>
                          <div className="text-xs text-muted-foreground">
                            Personal or family funding
                          </div>
                        </div>
                      </Button>
                      
                      <Button
                        variant={fundingMethod === "scholarship" ? "default" : "outline"}
                        onClick={() => { setFundingMethod("scholarship"); setScholarshipRequired(true); }}
                        className="justify-start h-auto py-3 px-4"
                      >
                        <div className="mr-3 bg-primary/20 p-2 rounded-full">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Scholarship</div>
                          <div className="text-xs text-muted-foreground">
                            Need scholarship support
                          </div>
                        </div>
                      </Button>
                      
                      <Button
                        variant={fundingMethod === "loan" ? "default" : "outline"}
                        onClick={() => setFundingMethod("loan")}
                        className="justify-start h-auto py-3 px-4"
                      >
                        <div className="mr-3 bg-primary/20 p-2 rounded-full">
                          <BadgePercent className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Student Loan</div>
                          <div className="text-xs text-muted-foreground">
                            Planning to use loans
                          </div>
                        </div>
                      </Button>
                      
                      <Button
                        variant={fundingMethod === "mixed" ? "default" : "outline"}
                        onClick={() => setFundingMethod("mixed")}
                        className="justify-start h-auto py-3 px-4"
                      >
                        <div className="mr-3 bg-primary/20 p-2 rounded-full">
                          <PieChart className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Mixed Sources</div>
                          <div className="text-xs text-muted-foreground">
                            Combination of methods
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="scholarship-required">Scholarship required?</Label>
                        <Badge variant={scholarshipRequired ? "default" : "outline"}>
                          {scholarshipRequired ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <RadioGroup 
                        id="scholarship-required"
                        value={scholarshipRequired.toString()} 
                        onValueChange={(v) => setScholarshipRequired(v === "true")}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="scholarship-yes" />
                          <Label htmlFor="scholarship-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="scholarship-no" />
                          <Label htmlFor="scholarship-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="pt-4">
                      <Label className="mb-3 block">Housing Preference</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {HOUSING_PREFERENCES.map(pref => (
                          <Button
                            key={pref}
                            variant={housingPreference === pref ? "default" : "outline"}
                            onClick={() => setHousingPreference(pref)}
                            className="justify-start text-sm"
                          >
                            <Home className="mr-2 h-4 w-4" />
                            {formatHousingPreference(pref)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={goToPrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={goToNextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-2">
                <Clock3 className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Program Duration & Career Goals</h2>
              <p className="text-muted-foreground">Define your timeline and professional objectives</p>
            </div>
            
            <div className="space-y-8">
              <Card className="shadow-md">
                <CardHeader className="bg-muted/50 pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Clock3 className="mr-2 h-5 w-5 text-primary" />
                    Program Duration
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Label className="block mb-4">How long would you like to study?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {DURATIONS.map((d) => (
                      <Button
                        key={d}
                        variant={duration === d ? "default" : "outline"}
                        onClick={() => setDuration(d)}
                        className="justify-start h-auto py-3"
                      >
                        <Calendar className="mr-3 h-5 w-5" />
                        <div className="text-left">
                          <div>{formatDuration(d)}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {d === 'semester' ? 'Up to 6 months' : 
                             d === 'year' ? '8-12 months' : 
                             d === 'two_years' ? '18-24 months' : 
                             'Regular full-time'}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="bg-muted/50 pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-primary" />
                    Career Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="block mb-2">Employment goal after graduation</Label>
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        variant={employmentGoal === "home_country" ? "default" : "outline"}
                        onClick={() => setEmploymentGoal("home_country")}
                        className="justify-start h-auto py-3"
                      >
                        <div className="mr-3 bg-primary/20 p-2 rounded-full">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Return to home country</div>
                          <div className="text-xs text-muted-foreground">
                            Work in your country after graduating
                          </div>
                        </div>
                      </Button>
                      
                      <Button
                        variant={employmentGoal === "study_country" ? "default" : "outline"}
                        onClick={() => setEmploymentGoal("study_country")}
                        className="justify-start h-auto py-3"
                      >
                        <div className="mr-3 bg-primary/20 p-2 rounded-full">
                          <Building className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Stay in country of study</div>
                          <div className="text-xs text-muted-foreground">
                            Work where you study after graduating
                          </div>
                        </div>
                      </Button>
                      
                      <Button
                        variant={employmentGoal === "both" ? "default" : "outline"}
                        onClick={() => setEmploymentGoal("both")}
                        className="justify-start h-auto py-3"
                      >
                        <div className="mr-3 bg-primary/20 p-2 rounded-full">
                          <FileCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Open to both options</div>
                          <div className="text-xs text-muted-foreground">
                            Flexible about work location
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Importance of degree recognition in home country</Label>
                    <div className="space-y-4 mt-2">
                      <div className="flex items-center justify-between">
                        <RadioGroup 
                          value={degreeRecognition.toString()} 
                          onValueChange={(v) => setDegreeRecognition(v === "true")}
                          className="flex flex-col space-y-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="recognition-yes" />
                            <Label htmlFor="recognition-yes" className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                              <span>Important</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="recognition-no" />
                            <Label htmlFor="recognition-no" className="flex items-center gap-2">
                              <Ban className="h-4 w-4 text-muted-foreground" />
                              <span>Not important</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-6">
                      <Label className="block">How important are internship opportunities?</Label>
                      <div className="space-y-5">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Not important</span>
                          <span>Very important</span>
                        </div>
                        <Slider
                          value={[internshipImportance]}
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(v) => setInternshipImportance(v[0])}
                        />
                        <div className="flex justify-between">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <Badge 
                              key={val} 
                              variant={val === internshipImportance ? "default" : "outline"} 
                              className="cursor-pointer"
                              onClick={() => setInternshipImportance(val)}
                            >
                              {val}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md">
                <CardHeader className="bg-muted/50 pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Gauge className="mr-2 h-5 w-5 text-primary" />
                    Career Prospects Priority
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Label className="block mb-2">How important are post-graduation job prospects?</Label>
                  <div className="space-y-5">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Not important</span>
                      <span>Very important</span>
                    </div>
                    <Slider
                      value={[careerProspects]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(v) => setCareerProspects(v[0])}
                    />
                    <div className="flex justify-between">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <Badge 
                          key={val} 
                          variant={val === careerProspects ? "default" : "outline"} 
                          className="cursor-pointer"
                          onClick={() => setCareerProspects(val)}
                        >
                          {val}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={goToPrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={goToNextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-2">
                <Globe className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Location & Preferences</h2>
              <p className="text-muted-foreground">Select your ideal study environment</p>
            </div>
            
            <div className="space-y-8">
              <Card className="shadow-md overflow-hidden">
                <CardHeader className="bg-muted/50 pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Globe className="mr-2 h-5 w-5 text-primary" />
                    Destination & Language
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <Label className="block mb-2">Destination Country</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {COUNTRIES.map((c) => (
                        <Button
                          key={c}
                          variant={country === c ? "default" : "outline"}
                          onClick={() => setCountry(c)}
                          className="justify-start h-auto py-2"
                        >
                          <Map className="mr-2 h-4 w-4" />
                          {c}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="block mb-2">Program Language</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {LANGUAGES.map((lang) => (
                        <Button
                          key={lang}
                          variant={language === lang ? "default" : "outline"}
                          onClick={() => setLanguage(lang)}
                          className="justify-start h-auto py-2"
                        >
                          <Languages className="mr-2 h-4 w-4" />
                          {lang}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="bg-muted/50 pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Building className="mr-2 h-5 w-5 text-primary" />
                    Living Environment
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label className="block">City Size Preference</Label>
                      <div className="grid grid-cols-3 gap-3">
                        <Button 
                          variant={citySize === "small" ? "default" : "outline"}
                          onClick={() => setCitySize("small")}
                          className="justify-start h-auto py-2 text-sm"
                        >
                          <Building className="mr-2 h-4 w-4" />
                          Small City
                        </Button>
                        <Button 
                          variant={citySize === "medium" ? "default" : "outline"}
                          onClick={() => setCitySize("medium")}
                          className="justify-start h-auto py-2 text-sm"
                        >
                          <Building className="mr-2 h-4 w-4" />
                          Medium City
                        </Button>
                        <Button 
                          variant={citySize === "large" ? "default" : "outline"}
                          onClick={() => setCitySize("large")}
                          className="justify-start h-auto py-2 text-sm"
                        >
                          <Building className="mr-2 h-4 w-4" />
                          Large City
                        </Button>
                      </div>
                      
                      <div className="mt-4">
                        <Label className="block">Climate Preference</Label>
                        <div className="grid grid-cols-3 gap-3 mt-2">
                          <Button 
                            variant={climatePreference === "warm" ? "default" : "outline"}
                            onClick={() => setClimatePreference("warm")}
                            className="justify-start h-auto py-2 text-sm"
                          >
                            <Sun className="mr-2 h-4 w-4" />
                            Warm
                          </Button>
                          <Button 
                            variant={climatePreference === "moderate" ? "default" : "outline"}
                            onClick={() => setClimatePreference("moderate")}
                            className="justify-start h-auto py-2 text-sm"
                          >
                            <Cloud className="mr-2 h-4 w-4" />
                            Moderate
                          </Button>
                          <Button 
                            variant={climatePreference === "cold" ? "default" : "outline"}
                            onClick={() => setClimatePreference("cold")}
                            className="justify-start h-auto py-2 text-sm"
                          >
                            <Snowflake className="mr-2 h-4 w-4" />
                            Cold
                          </Button>
                        </div>
                      </div>
                    </div>
                  
                    <div className="space-y-4">  
                      <Label className="block">Study Method</Label>
                      <div className="grid grid-cols-1 gap-3">
                        <Button
                          variant={studyMethod === "on_campus" ? "default" : "outline"}
                          onClick={() => setStudyMethod("on_campus")}
                          className="justify-start h-auto py-2"
                        >
                          <School className="mr-2 h-4 w-4" />
                          On-campus (Traditional)
                        </Button>
                        <Button
                          variant={studyMethod === "online" ? "default" : "outline"}
                          onClick={() => setStudyMethod("online")}
                          className="justify-start h-auto py-2"
                        >
                          <Laptop className="mr-2 h-4 w-4" />
                          Online / Distance Learning
                        </Button>
                        <Button
                          variant={studyMethod === "hybrid" ? "default" : "outline"}
                          onClick={() => setStudyMethod("hybrid")}
                          className="justify-start h-auto py-2"
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          Hybrid (Both)
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md">
                <CardHeader className="bg-muted/50 pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Heart className="mr-2 h-5 w-5 text-primary" />
                    Cultural & Religious Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      variant={religiousFacilities ? "default" : "outline"}
                      onClick={() => setReligiousFacilities(!religiousFacilities)}
                      className="justify-start h-auto py-3"
                    >
                      <div className="mr-3 bg-primary/20 p-2 rounded-full">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Religious Facilities</div>
                        <div className="text-xs text-muted-foreground">Prayer rooms, religious communities</div>
                      </div>
                    </Button>
                    <Button
                      variant={halalFood ? "default" : "outline"}
                      onClick={() => setHalalFood(!halalFood)}
                      className="justify-start h-auto py-3"
                    >
                      <div className="mr-3 bg-primary/20 p-2 rounded-full">
                        <Utensils className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Halal Food Availability</div>
                        <div className="text-xs text-muted-foreground">Dietary requirements accommodated</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={goToPrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Processing..." : "Find Programs"}
                {!loading && <Sparkles className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-2">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Your Program Matches</h2>
              <p className="text-muted-foreground">
                Based on your preferences, here are the programs that best match your profile.
              </p>
            </div>
            
            {results.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-muted inline-flex p-3 rounded-full mb-4">
                  <Award className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No matches found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your preferences to find more program options.
                </p>
                <Button className="mt-6" onClick={() => setStep(1)}>
                  Start New Search
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-7 space-y-4">
                    <Tabs defaultValue="match" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="match">Best Match</TabsTrigger>
                        <TabsTrigger value="price">Lowest Cost</TabsTrigger>
                      </TabsList>
                      <TabsContent value="match" className="space-y-4 pt-4">
                        <ScrollArea className="h-[500px] pr-4">
                          <div className="space-y-4">
                            {results
                              .sort((a, b) => b.match_score - a.match_score)
                              .slice(0, 5)
                              .map((program) => (
                                <ProgramCard 
                                  key={program.id} 
                                  program={program} 
                                  matchScore={program.match_score}
                                  navigate={navigate}
                                />
                              ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                      <TabsContent value="price" className="space-y-4 pt-4">
                        <ScrollArea className="h-[500px] pr-4">
                          <div className="space-y-4">
                            {results
                              .sort((a, b) => a.tuition_min - b.tuition_min)
                              .slice(0, 5)
                              .map((program) => (
                                <ProgramCard 
                                  key={program.id} 
                                  program={program} 
                                  matchScore={program.match_score}
                                  navigate={navigate}
                                />
                              ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="md:col-span-5 flex flex-col space-y-6">
                    {results.length > 0 && (
                      <Card className="bg-muted/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <PieChart className="h-4 w-4 mr-2 text-primary" />
                            Match Score Breakdown
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-3 text-sm">
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>Budget Compatibility</span>
                                <span className="font-medium">{results[0].budget_score}/30</span>
                              </div>
                              <Progress value={(results[0].budget_score / 30) * 100} className="h-1.5" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>Academic Match</span>
                                <span className="font-medium">{results[0].level_score + results[0].field_score}/35</span>
                              </div>
                              <Progress value={((results[0].level_score + results[0].field_score) / 35) * 100} className="h-1.5" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>Location & Language</span>
                                <span className="font-medium">{results[0].location_score + results[0].language_score}/40</span>
                              </div>
                              <Progress value={((results[0].location_score + results[0].language_score) / 40) * 100} className="h-1.5" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>Other Factors</span>
                                <span className="font-medium">{results[0].duration_score + results[0].scholarship_score + results[0].cultural_score}/15</span>
                              </div>
                              <Progress value={((results[0].duration_score + results[0].scholarship_score + results[0].cultural_score) / 15) * 100} className="h-1.5" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Card className="overflow-hidden bg-gradient-to-br from-primary to-primary-foreground/30 text-primary-foreground flex-1">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <Sparkles className="h-5 w-5 mr-2" />
                          <h3 className="text-xl font-semibold">Need Help?</h3>
                        </div>
                        <p className="mb-6">
                          Our education advisors can guide you through the application process and help you make the best choice for your future.
                        </p>
                        <div className="space-y-3">
                          <Button 
                            variant="secondary" 
                            className="w-full justify-start"
                            onClick={() => navigate('/appointments')}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule a Consultation
                          </Button>
                          <Button 
                            variant="secondary" 
                            className="w-full justify-start"
                            onClick={() => navigate('/chat')}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Chat with an Advisor
                          </Button>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-white/20">
                          <h4 className="font-medium mb-3">Why Apply with Us</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                              <span>Guidance throughout the entire application process</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                              <span>Higher acceptance rates with our support</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                              <span>Visa application assistance</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                              <span>Pre-departure support</span>
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Start New Search
                  </Button>
                  <Button onClick={() => navigate('/programs')}>
                    View All Programs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Program Finder</h1>
        <p className="text-muted-foreground">
          Find the perfect educational program based on your preferences and requirements.
        </p>
      </div>

      <div className="bg-card border rounded-xl p-6 shadow-sm">
        {/* Progress Indicator */}
        {step <= 5 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Getting Started</span>
              <span>Results</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Step {step} of 5</span>
              <span>{progress}% Complete</span>
            </div>
          </div>
        )}

        {/* Step content */}
        {renderStepContent()}
      </div>
    </div>
  );
}

function ProgramCard({ program, matchScore, navigate }: any) {
  return (
    <Card className="overflow-hidden border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: matchScore > 80 ? "var(--primary)" : "var(--muted)" }}>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold">{program.name}</h3>
              <p className="text-sm text-muted-foreground">{program.university}, {program.country}</p>
            </div>
            <div className={`px-2 py-1 rounded text-sm font-medium flex items-center ${
              matchScore > 80 ? "bg-primary/10 text-primary" :
              matchScore > 60 ? "bg-amber-500/10 text-amber-500" :
              "bg-muted text-muted-foreground"
            }`}>
              {matchScore}% <CheckCircle className="h-3 w-3 ml-1" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
            <div className="flex items-center">
              <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{program.study_level || program.type}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{program.duration_months} months</span>
            </div>
            <div className="flex items-center">
              <Coins className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>${program.tuition_min.toLocaleString()}/year</span>
            </div>
            <div className="flex items-center">
              <Languages className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{program.program_language}</span>
            </div>
          </div>
        </div>

        <div className="border-t p-3 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/programs/${program.id}`)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Additional missing components
function Sun({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
}

function Cloud({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
}

function Snowflake({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12h20"/><path d="M12 2v20"/><path d="m4.93 4.93 14.14 14.14"/><path d="m19.07 4.93-14.14 14.14"/></svg>
}

function Utensils({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
}

function Home({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
}
