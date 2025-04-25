
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, ArrowLeft, CheckCircle, Sparkles, GraduationCap, 
  Globe, Coins, Calendar, BookOpen, Languages, Award
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider"; 
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const STUDY_LEVELS = [
  { id: "Bachelor", label: "Undergraduate" },
  { id: "Master", label: "Graduate" }, 
  { id: "PhD", label: "PhD" }, 
  { id: "Certificate", label: "Language Course" }, 
  { id: "Diploma", label: "Professional Certificate" }
];

const LANGUAGES = ["English", "French", "Spanish", "German", "Italian", "Arabic", "Any"];
const COUNTRIES = ["France", "Germany", "Spain", "Italy", "Belgium", "Poland", "Portugal", "Any"];
const DURATIONS = ["semester", "year", "two_years", "full_program"];
const FIELDS = [
  "Computer Science", 
  "Business Administration", 
  "Engineering", 
  "Medicine", 
  "Law", 
  "Arts", 
  "Social Sciences", 
  "Natural Sciences",
  "Any"
];

export default function Consultation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

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

  const goToNextStep = () => setStep(step + 1);
  const goToPrevStep = () => setStep(step - 1);

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
      // Save the consultation to the database
      const { data, error } = await supabase
        .from('consultation_results')
        .insert({
          user_id: user.id,
          budget: budget,
          language_preference: language, 
          study_level: studyLevel,
          destination_preference: country,
          duration_preference: duration,
          field_preference: field,
          scholarship_required: scholarshipRequired,
          religious_facilities_required: religiousFacilities,
          halal_food_required: halalFood,
          field_keywords: field === "Any" ? null : field.split(" ")
        })
        .select();
      
      if (error) throw error;
      
      // Call the Supabase stored function to find matching programs
      const { data: matchResults, error: matchError } = await supabase
        .rpc('match_programs', { 
          p_budget: budget,
          p_language: language.toLowerCase(),
          p_study_level: studyLevel,
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

  const formatDuration = (dur) => {
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
            <h2 className="text-2xl font-bold text-center mb-8">What's your budget?</h2>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Your Annual Budget for Tuition and Living Costs</Label>
                  <span className="font-semibold text-lg">${budget.toLocaleString()}</span>
                </div>
                <Slider 
                  value={[budget]} 
                  onValueChange={(values) => setBudget(values[0])} 
                  max={50000} 
                  step={1000}
                  className="my-6"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>$5,000</span>
                  <span>$50,000</span>
                </div>
              </div>

              <div className="pt-4">
                <div className="text-sm text-muted-foreground mb-2">Scholarship required?</div>
                <RadioGroup value={scholarshipRequired.toString()} onValueChange={(v) => setScholarshipRequired(v === "true")}>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="scholarship-yes" />
                      <Label htmlFor="scholarship-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="scholarship-no" />
                      <Label htmlFor="scholarship-no">No</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button onClick={goToNextStep} className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-8">Academic Preferences</h2>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="block mb-2">Study Level</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {STUDY_LEVELS.map((level) => (
                    <Button
                      key={level.id}
                      variant={studyLevel === level.id ? "default" : "outline"}
                      onClick={() => setStudyLevel(level.id as "Bachelor" | "Master" | "PhD" | "Certificate" | "Diploma")}
                      className="justify-start"
                    >
                      <GraduationCap className="mr-2 h-4 w-4" />
                      {level.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="block mb-2">Field of Study</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {FIELDS.map((f) => (
                    <Button
                      key={f}
                      variant={field === f ? "default" : "outline"}
                      onClick={() => setField(f)}
                      className="justify-start"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      {f}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="block mb-2">Program Duration</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DURATIONS.map((d) => (
                    <Button
                      key={d}
                      variant={duration === d ? "default" : "outline"}
                      onClick={() => setDuration(d)}
                      className="justify-start"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDuration(d)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={goToPrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={goToNextStep} className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-8">Location & Language</h2>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="block mb-2">Destination Country</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {COUNTRIES.map((c) => (
                    <Button
                      key={c}
                      variant={country === c ? "default" : "outline"}
                      onClick={() => setCountry(c)}
                      className="justify-start"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      {c}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="block mb-2">Program Language</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {LANGUAGES.map((lang) => (
                    <Button
                      key={lang}
                      variant={language === lang ? "default" : "outline"}
                      onClick={() => setLanguage(lang)}
                      className="justify-start"
                    >
                      <Languages className="mr-2 h-4 w-4" />
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="block mb-2">Additional Requirements</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    variant={religiousFacilities ? "default" : "outline"}
                    onClick={() => setReligiousFacilities(!religiousFacilities)}
                    className="justify-start"
                  >
                    <CheckCircle className={`mr-2 h-4 w-4 ${religiousFacilities ? "" : "opacity-50"}`} />
                    Religious Facilities Needed
                  </Button>
                  <Button
                    variant={halalFood ? "default" : "outline"}
                    onClick={() => setHalalFood(!halalFood)}
                    className="justify-start"
                  >
                    <CheckCircle className={`mr-2 h-4 w-4 ${halalFood ? "" : "opacity-50"}`} />
                    Halal Food Availability
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={goToPrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={loading} 
                className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700"
              >
                {loading ? "Processing..." : "Find Programs"}
                {!loading && <Sparkles className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-2">Your Program Matches</h2>
            <p className="text-center text-muted-foreground mb-8">
              Based on your preferences, here are the programs that best match your profile.
            </p>
            
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Tabs defaultValue="match" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="match">Best Match</TabsTrigger>
                      <TabsTrigger value="price">Lowest Cost</TabsTrigger>
                    </TabsList>
                    <TabsContent value="match" className="space-y-4 pt-4">
                      {results
                        .sort((a, b) => b.match_score - a.match_score)
                        .slice(0, 5)
                        .map((program) => (
                          <ProgramCard 
                            key={program.id} 
                            program={program} 
                            matchScore={program.match_score}
                          />
                        ))}
                    </TabsContent>
                    <TabsContent value="price" className="space-y-4 pt-4">
                      {results
                        .sort((a, b) => a.tuition_min - b.tuition_min)
                        .slice(0, 5)
                        .map((program) => (
                          <ProgramCard 
                            key={program.id} 
                            program={program} 
                            matchScore={program.match_score}
                          />
                        ))}
                    </TabsContent>
                  </Tabs>

                  <Card className="overflow-hidden bg-gradient-to-br from-primary to-violet-600 text-primary-foreground">
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
                          onClick={() => navigate('/appointments/new')}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule a Consultation
                        </Button>
                        <Button 
                          variant="secondary" 
                          className="w-full justify-start"
                          onClick={() => navigate('/chat')}
                        >
                          <Globe className="mr-2 h-4 w-4" />
                          Chat with an Advisor
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Start New Search
                  </Button>
                  <Button 
                    onClick={() => navigate('/programs')}
                    className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700"
                  >
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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Program Finder</h1>
        <p className="text-muted-foreground">
          Find the perfect educational program based on your preferences and requirements.
        </p>
      </div>

      <div className="bg-card border rounded-xl p-6 shadow-sm">
        {/* Step indicators */}
        {step < 4 && (
          <div className="flex mb-8">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`flex-1 ${s !== 3 ? "border-b" : ""} pb-2 ${s === step ? "border-primary text-primary" : "border-muted text-muted-foreground"}`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 
                    ${s === step ? "bg-primary text-primary-foreground" : 
                      s < step ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    {s < step ? <CheckCircle className="h-4 w-4" /> : s}
                  </div>
                  <span className="text-sm font-medium">
                    {s === 1 ? "Budget" : s === 2 ? "Academic" : "Location"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step content */}
        {renderStepContent()}
      </div>
    </div>
  );
}

function ProgramCard({ program, matchScore }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{program.name}</h3>
              <p className="text-sm text-muted-foreground">{program.university}, {program.country}</p>
            </div>
            <div className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium flex items-center">
              {matchScore}% <CheckCircle className="h-3 w-3 ml-1" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
            <div className="flex items-center">
              <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{program.study_level}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{program.duration_months} months</span>
            </div>
            <div className="flex items-center">
              <Coins className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>${program.tuition_min?.toLocaleString()}/year</span>
            </div>
            <div className="flex items-center">
              <Languages className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{program.program_language}</span>
            </div>
          </div>
        </div>

        <div className="border-t p-3 flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/programs/${program.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
