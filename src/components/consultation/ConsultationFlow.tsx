import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertTriangle, School, Search, Building, MapPin, Languages, CircleDollarSign, Clock, Star } from "lucide-react";

import { studyAbroadQuestions } from "./ConsultationQuestions";

export function ConsultationFlow() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [existingConsultation, setExistingConsultation] = useState(null);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const ConsultationQuestions = studyAbroadQuestions;
  
  const [formData, setFormData] = useState({
    study_level: "",
    field_preference: "",
    destination_preference: "",
    language_preference: "",
    duration_preference: "",
    budget: 10000,
    scholarship_required: false,
    religious_facilities_required: false,
    halal_food_required: false,
    notes: ""
  });
  
  useEffect(() => {
    const checkExistingConsultation = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('consultation_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) {
          console.error('Error fetching existing consultation:', error);
          return;
        }
        
        if (data && data.length > 0) {
          setExistingConsultation(data[0]);
          
          if (data[0].recommended_programs) {
            setResults(data[0].recommended_programs as any[]);
          }
          
          setFormData({
            study_level: data[0].study_level || "",
            field_preference: data[0].field_preference || "",
            destination_preference: data[0].destination_preference || "",
            language_preference: data[0].language_preference || "",
            duration_preference: data[0].duration_preference || "",
            budget: data[0].budget || 10000,
            scholarship_required: data[0].scholarship_required || false,
            religious_facilities_required: data[0].religious_facilities_required || false,
            halal_food_required: data[0].halal_food_required || false,
            notes: data[0].notes || ""
          });
        }
      } catch (err) {
        console.error('Error in consultation check:', err);
      }
    };
    
    checkExistingConsultation();
  }, [user]);
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCheckboxChange = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const nextStep = () => {
    if (activeStep < ConsultationQuestions.length) {
      setActiveStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };
  
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to complete your consultation.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data: matchResults, error: matchError } = await supabase.rpc('match_programs', {
        p_study_level: formData.study_level as any,
        p_field: formData.field_preference,
        p_country: formData.destination_preference,
        p_language: formData.language_preference,
        p_duration: formData.duration_preference,
        p_budget: formData.budget,
        p_scholarship: formData.scholarship_required,
        p_religious_facilities: formData.religious_facilities_required,
        p_halal_food: formData.halal_food_required
      });
      
      if (matchError) throw matchError;
      
      const programIds = matchResults.map((result: any) => result.program_id);
      
      if (programIds.length === 0) {
        setResults([]);
        setShowResults(true);
        setIsLoading(false);
        return;
      }
      
      const { data: programs, error: programsError } = await supabase
        .from('programs')
        .select('*')
        .in('id', programIds);
      
      if (programsError) throw programsError;
      
      const combinedResults = programs.map((program: any) => {
        const matchInfo = matchResults.find((r: any) => r.program_id === program.id);
        return {
          ...program,
          match_score: matchInfo?.match_score || 0,
          budget_score: matchInfo?.budget_score || 0,
          language_score: matchInfo?.language_score || 0,
          level_score: matchInfo?.level_score || 0,
          location_score: matchInfo?.location_score || 0,
          duration_score: matchInfo?.duration_score || 0,
          field_score: matchInfo?.field_score || 0,
          scholarship_score: matchInfo?.scholarship_score || 0,
          cultural_score: matchInfo?.cultural_score || 0
        };
      });
      
      combinedResults.sort((a: any, b: any) => b.match_score - a.match_score);
      
      const consultationData = {
        user_id: user.id,
        study_level: formData.study_level as any,
        field_preference: formData.field_preference,
        destination_preference: formData.destination_preference,
        language_preference: formData.language_preference,
        duration_preference: formData.duration_preference,
        budget: formData.budget,
        scholarship_required: formData.scholarship_required,
        religious_facilities_required: formData.religious_facilities_required,
        halal_food_required: formData.halal_food_required,
        recommended_programs: combinedResults,
        notes: formData.notes
      };
      
      if (existingConsultation) {
        await supabase
          .from('consultation_results')
          .update(consultationData)
          .eq('id', existingConsultation.id);
      } else {
        await supabase
          .from('consultation_results')
          .insert([consultationData]);
      }
      
      setResults(combinedResults);
      setShowResults(true);
    } catch (err) {
      console.error('Error in consultation process:', err);
      toast({
        title: "Consultation Error",
        description: "There was a problem processing your consultation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStartOver = () => {
    setShowResults(false);
    setActiveStep(0);
  };
  
  const handleViewProgram = (programId: string) => {
    navigate(`/programs/${programId}`);
  };
  
  const handleApplyNow = (programId: string) => {
    navigate(`/applications/new?program=${programId}`);
  };
  
  const renderCurrentQuestion = () => {
    if (activeStep >= ConsultationQuestions.length) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Review Your Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Study Level</Label>
                  <div className="font-medium">{formData.study_level || "Not specified"}</div>
                </div>
                
                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <div className="font-medium">{formData.field_preference || "Not specified"}</div>
                </div>
                
                <div className="space-y-2">
                  <Label>Country Preference</Label>
                  <div className="font-medium">{formData.destination_preference || "Not specified"}</div>
                </div>
                
                <div className="space-y-2">
                  <Label>Language Preference</Label>
                  <div className="font-medium">{formData.language_preference || "Not specified"}</div>
                </div>
                
                <div className="space-y-2">
                  <Label>Program Duration</Label>
                  <div className="font-medium">{formData.duration_preference || "Not specified"}</div>
                </div>
                
                <div className="space-y-2">
                  <Label>Budget</Label>
                  <div className="font-medium">${formData.budget.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <Label>Additional Requirements</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.scholarship_required && (
                    <Badge variant="outline">Scholarship Required</Badge>
                  )}
                  {formData.religious_facilities_required && (
                    <Badge variant="outline">Religious Facilities</Badge>
                  )}
                  {formData.halal_food_required && (
                    <Badge variant="outline">Halal Food Options</Badge>
                  )}
                  {!formData.scholarship_required && !formData.religious_facilities_required && !formData.halal_food_required && (
                    <div className="text-muted-foreground">No additional requirements specified</div>
                  )}
                </div>
              </div>
              
              {formData.notes && (
                <div className="space-y-2 pt-2">
                  <Label>Additional Notes</Label>
                  <div className="bg-muted p-3 rounded-md">{formData.notes}</div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Find Programs"
              )}
            </Button>
          </CardFooter>
        </Card>
      );
    }
    
    const currentQuestion = ConsultationQuestions[activeStep];
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuestion.type === "radio" && (
            <RadioGroup 
              value={formData[currentQuestion.field] || ""} 
              onValueChange={(value) => handleChange(currentQuestion.field, value)}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
          
          {currentQuestion.type === "select" && (
            <Select 
              value={formData[currentQuestion.field] || ""} 
              onValueChange={(value) => handleChange(currentQuestion.field, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={currentQuestion.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {currentQuestion.type === "slider" && (
            <div className="space-y-6 py-4">
              <div className="text-center mb-2">
                <span className="text-2xl font-bold">${formData[currentQuestion.field].toLocaleString()}</span>
              </div>
              <Slider
                min={currentQuestion.min || 0}
                max={currentQuestion.max || 100000}
                step={currentQuestion.step || 1000}
                value={[formData[currentQuestion.field]]}
                onValueChange={(value) => handleChange(currentQuestion.field, value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <div>${(currentQuestion.min || 0).toLocaleString()}</div>
                <div>${(currentQuestion.max || 100000).toLocaleString()}</div>
              </div>
            </div>
          )}
          
          {currentQuestion.type === "checkbox" && (
            <div className="space-y-4 py-2">
              {currentQuestion.options.map((option) => (
                <div key={option.field} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option.field}
                    checked={formData[option.field] || false}
                    onCheckedChange={() => handleCheckboxChange(option.field)}
                  />
                  <Label htmlFor={option.field}>{option.label}</Label>
                </div>
              ))}
            </div>
          )}
          
          {currentQuestion.type === "textarea" && (
            <Textarea 
              placeholder={currentQuestion.placeholder || "Enter additional information..."}
              value={formData[currentQuestion.field] || ""}
              onChange={(e) => handleChange(currentQuestion.field, e.target.value)}
              className="min-h-[100px]"
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={activeStep === 0}>
            Back
          </Button>
          <Button onClick={nextStep}>
            {activeStep === ConsultationQuestions.length - 1 ? "Review" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  const renderResultsView = () => {
    if (results.length === 0) {
      return (
        <Card className="mb-6">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Matching Programs Found</h3>
            <p className="text-muted-foreground mb-6">We couldn't find programs that match your preferences exactly. Try adjusting your criteria.</p>
            <Button variant="outline" onClick={handleStartOver}>
              Start Again
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Consultation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertTitle className="flex items-center">
                <School className="h-4 w-4 mr-2" />
                We Found {results.length} Programs For You!
              </AlertTitle>
              <AlertDescription className="mt-2">
                Based on your preferences, we've identified these programs that match your criteria. 
                You can apply directly or schedule a consultation with our advisors for more guidance.
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                Showing {results.length} programs
              </div>
              <Select defaultValue="match">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Match Score</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  <SelectItem value="tuition-low">Tuition: Low to High</SelectItem>
                  <SelectItem value="tuition-high">Tuition: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-6">
              {results.map((program) => (
                <Card key={program.id} className="border-2 hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="h-32 w-32 md:w-48 md:h-32 bg-muted rounded-md flex-shrink-0 overflow-hidden">
                        <div 
                          className="w-full h-full bg-cover bg-center"
                          style={{ 
                            backgroundImage: program.image_url 
                              ? `url(${program.image_url})` 
                              : `url(/placeholder.svg?height=150&width=200&text=${encodeURIComponent(program.name)})`
                          }}
                        ></div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{program.name}</h3>
                            <div className="flex items-center text-muted-foreground mb-2">
                              <Building className="h-3.5 w-3.5 mr-1" />
                              <span>{program.university}</span>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                            <Star className="h-3 w-3 mr-1 fill-current" /> 
                            {program.match_score}% Match
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-4 text-sm mt-1">
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            <span>{program.country}</span>
                          </div>
                          <div className="flex items-center">
                            <School className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            <span>{program.study_level}</span>
                          </div>
                          <div className="flex items-center">
                            <Languages className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            <span>{program.program_language}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            <span>{program.duration_months} months</span>
                          </div>
                          <div className="flex items-center">
                            <CircleDollarSign className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            <span>${program.tuition_min.toLocaleString()} / year</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          {program.scholarship_available && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                              Scholarship Available
                            </Badge>
                          )}
                          {program.internship_opportunities && (
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
                              Internship Opportunities
                            </Badge>
                          )}
                          {program.religious_facilities && (
                            <Badge variant="outline" className="text-xs">
                              Religious Facilities
                            </Badge>
                          )}
                          {program.halal_food_availability && (
                            <Badge variant="outline" className="text-xs">
                              Halal Food
                            </Badge>
                          )}
                        </div>
                        
                        <div className="mt-4 flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewProgram(program.id)}>
                            View Details
                          </Button>
                          <Button size="sm" onClick={() => handleApplyNow(program.id)}>
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleStartOver}>
            Start New Consultation
          </Button>
          <Button onClick={() => navigate("/appointments")} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            Schedule Advisor Meeting
          </Button>
        </div>
      </>
    );
  };
  
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      {!showResults ? (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Program Finder</h1>
            <p className="text-muted-foreground">
              Answer a few questions to find the perfect educational program for you
            </p>
          </div>
          
          <div className="w-full bg-muted h-2 rounded-full mb-8">
            <div 
              className="h-2 bg-primary rounded-full transition-all"
              style={{ width: `${(activeStep / ConsultationQuestions.length) * 100}%` }}
            ></div>
          </div>
          
          {renderCurrentQuestion()}
        </>
      ) : (
        renderResultsView()
      )}
    </div>
  );
}
