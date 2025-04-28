import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle, 
  ChevronRight, 
  GraduationCap, 
  MapPin, 
  School, 
  BookOpen, 
  Globe, 
  Building, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Clock, 
  Languages, 
  Award, 
  Heart, 
  AlertCircle 
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const studyLevels = [
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "phd", label: "PhD / Doctorate" },
  { value: "diploma", label: "Diploma / Certificate" },
  { value: "language", label: "Language Course" },
];

const studyFields = [
  { value: "business", label: "Business & Management" },
  { value: "engineering", label: "Engineering" },
  { value: "computer_science", label: "Computer Science & IT" },
  { value: "medicine", label: "Medicine & Health Sciences" },
  { value: "arts", label: "Arts & Humanities" },
  { value: "social_sciences", label: "Social Sciences" },
  { value: "natural_sciences", label: "Natural Sciences" },
  { value: "law", label: "Law" },
  { value: "education", label: "Education" },
  { value: "architecture", label: "Architecture & Design" },
  { value: "agriculture", label: "Agriculture & Forestry" },
  { value: "hospitality", label: "Hospitality & Tourism" },
  { value: "media", label: "Media & Communications" },
  { value: "other", label: "Other" },
];

const countries = [
  { value: "usa", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "spain", label: "Spain" },
  { value: "italy", label: "Italy" },
  { value: "netherlands", label: "Netherlands" },
  { value: "sweden", label: "Sweden" },
  { value: "switzerland", label: "Switzerland" },
  { value: "japan", label: "Japan" },
  { value: "china", label: "China" },
  { value: "singapore", label: "Singapore" },
  { value: "uae", label: "United Arab Emirates" },
  { value: "malaysia", label: "Malaysia" },
  { value: "turkey", label: "Turkey" },
  { value: "other", label: "Other" },
];

const languages = [
  { value: "english", label: "English" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "spanish", label: "Spanish" },
  { value: "italian", label: "Italian" },
  { value: "arabic", label: "Arabic" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "russian", label: "Russian" },
  { value: "other", label: "Other" },
];

const budgetRanges = [
  { value: "0-5000", label: "Under $5,000" },
  { value: "5000-10000", label: "$ 5,000 - $10,000" },
  { value: "10000-15000", label: "$ 10,000 - $15,000" },
  { value: "15000-20000", label: "$ 15,000 - $20,000" },
  { value: "20000-30000", label: "$ 20,000 - $30,000" },
  { value: "30000+", label: "Over $30,000" },
];

const durations = [
  { value: "1-3", label: "1-3 months" },
  { value: "3-6", label: "3-6 months" },
  { value: "6-12", label: "6-12 months" },
  { value: "1-2", label: "1-2 years" },
  { value: "2-3", label: "2-3 years" },
  { value: "3-4", label: "3-4 years" },
  { value: "4+", label: "4+ years" },
];

const startDates = [
  { value: "immediate", label: "As soon as possible" },
  { value: "1-3months", label: "In 1-3 months" },
  { value: "3-6months", label: "In 3-6 months" },
  { value: "6-12months", label: "In 6-12 months" },
  { value: "next-year", label: "Next year" },
  { value: "undecided", label: "Not decided yet" },
];

// Form schema for academic preferences
const academicFormSchema = z.object({
  studyLevel: z.string().min(1, "Please select a study level"),
  studyField: z.string().min(1, "Please select a field of study"),
  specificProgram: z.string().optional(),
  previousEducation: z.string().min(1, "Please provide your previous education"),
  gpa: z.string().optional(),
  workExperience: z.string().optional(),
});

// Form schema for location preferences
const locationFormSchema = z.object({
  preferredCountries: z.array(z.string()).min(1, "Please select at least one country"),
  preferredCities: z.string().optional(),
  languagePreference: z.string().min(1, "Please select a language preference"),
  accommodationNeeds: z.string().optional(),
  religiousRequirements: z.boolean().optional(),
  halalFood: z.boolean().optional(),
  communityPreference: z.boolean().optional(),
});

// Form schema for financial preferences
const financialFormSchema = z.object({
  budget: z.string().min(1, "Please select a budget range"),
  scholarshipInterest: z.boolean(),
  workStudyInterest: z.boolean(),
  financialAidNeeds: z.string().optional(),
});

// Form schema for timeline preferences
const timelineFormSchema = z.object({
  preferredDuration: z.string().min(1, "Please select a preferred duration"),
  startDate: z.string().min(1, "Please select a preferred start date"),
  urgency: z.number().min(1).max(5),
  flexibility: z.string().optional(),
});

// Form schema for personal preferences
const personalFormSchema = z.object({
  careerGoals: z.string().min(1, "Please describe your career goals"),
  specialRequirements: z.string().optional(),
  healthConsiderations: z.string().optional(),
  additionalInfo: z.string().optional(),
});

const ConsultationFlow = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    academic: null,
    location: null,
    financial: null,
    timeline: null,
    personal: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [recommendedPrograms, setRecommendedPrograms] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Academic form
  const academicForm = useForm<z.infer<typeof academicFormSchema>>({
    resolver: zodResolver(academicFormSchema),
    defaultValues: {
      studyLevel: "",
      studyField: "",
      specificProgram: "",
      previousEducation: "",
      gpa: "",
      workExperience: "",
    },
  });

  // Location form
  const locationForm = useForm<z.infer<typeof locationFormSchema>>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      preferredCountries: [],
      preferredCities: "",
      languagePreference: "",
      accommodationNeeds: "",
      religiousRequirements: false,
      halalFood: false,
      communityPreference: false,
    },
  });

  // Financial form
  const financialForm = useForm<z.infer<typeof financialFormSchema>>({
    resolver: zodResolver(financialFormSchema),
    defaultValues: {
      budget: "",
      scholarshipInterest: false,
      workStudyInterest: false,
      financialAidNeeds: "",
    },
  });

  // Timeline form
  const timelineForm = useForm<z.infer<typeof timelineFormSchema>>({
    resolver: zodResolver(timelineFormSchema),
    defaultValues: {
      preferredDuration: "",
      startDate: "",
      urgency: 3,
      flexibility: "",
    },
  });

  // Personal form
  const personalForm = useForm<z.infer<typeof personalFormSchema>>({
    resolver: zodResolver(personalFormSchema),
    defaultValues: {
      careerGoals: "",
      specialRequirements: "",
      healthConsiderations: "",
      additionalInfo: "",
    },
  });

  // Check if user has existing consultation
  useEffect(() => {
    const checkExistingConsultation = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("consultations")
          .select("*")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const consultation = data[0];
          setConsultationId(consultation.consultation_id);
          
          // If consultation is complete, show recommendations
          if (consultation.status === "Completed") {
            setIsComplete(true);
            fetchRecommendations(consultation.consultation_id);
          } 
          // If consultation is in progress, restore form data
          else if (consultation.form_data) {
            const savedData = consultation.form_data;
            
            if (savedData.academic) {
              academicForm.reset(savedData.academic);
            }
            if (savedData.location) {
              locationForm.reset(savedData.location);
            }
            if (savedData.financial) {
              financialForm.reset(savedData.financial);
            }
            if (savedData.timeline) {
              timelineForm.reset(savedData.timeline);
            }
            if (savedData.personal) {
              personalForm.reset(savedData.personal);
            }
            
            // Set active step based on progress
            if (savedData.personal) setActiveStep(5);
            else if (savedData.timeline) setActiveStep(4);
            else if (savedData.financial) setActiveStep(3);
            else if (savedData.location) setActiveStep(2);
            else setActiveStep(1);
            
            setFormData(savedData);
          }
        }
      } catch (error) {
        console.error("Error checking existing consultation:", error);
      }
    };

    checkExistingConsultation();
  }, [user]);

  const fetchRecommendations = async (consultId: string) => {
    setLoadingRecommendations(true);
    try {
      const { data, error } = await supabase
        .from("program_recommendations")
        .select(`
          recommendation_id,
          program_id,
          consultation_id,
          match_score,
          recommendation_notes,
          programs (
            id,
            name,
            university,
            study_level,
            field,
            city,
            country,
            duration_months,
            tuition_min,
            tuition_max,
            image_url
          )
        `)
        .eq("consultation_id", consultId)
        .order("match_score", { ascending: false });

      if (error) throw error;
      setRecommendedPrograms(data || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to load program recommendations",
        variant: "destructive",
      });
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const onAcademicSubmit = async (data: z.infer<typeof academicFormSchema>) => {
    const updatedFormData = { ...formData, academic: data };
    setFormData(updatedFormData);
    
    // Save progress to database
    await saveConsultationProgress(updatedFormData);
    
    setActiveStep(2);
  };

  const onLocationSubmit = async (data: z.infer<typeof locationFormSchema>) => {
    const updatedFormData = { ...formData, location: data };
    setFormData(updatedFormData);
    
    // Save progress to database
    await saveConsultationProgress(updatedFormData);
    
    setActiveStep(3);
  };

  const onFinancialSubmit = async (data: z.infer<typeof financialFormSchema>) => {
    const updatedFormData = { ...formData, financial: data };
    setFormData(updatedFormData);
    
    // Save progress to database
    await saveConsultationProgress(updatedFormData);
    
    setActiveStep(4);
  };

  const onTimelineSubmit = async (data: z.infer<typeof timelineFormSchema>) => {
    const updatedFormData = { ...formData, timeline: data };
    setFormData(updatedFormData);
    
    // Save progress to database
    await saveConsultationProgress(updatedFormData);
    
    setActiveStep(5);
  };

  const onPersonalSubmit = async (data: z.infer<typeof personalFormSchema>) => {
    setIsSubmitting(true);
    
    try {
      const updatedFormData = { ...formData, personal: data };
      setFormData(updatedFormData);
      
      // Save final submission
      await saveConsultationProgress(updatedFormData, true);
      
      toast({
        title: "Consultation Submitted",
        description: "Your consultation has been submitted successfully. We'll review your preferences and provide program recommendations soon.",
      });
      
      // In a real app, we would wait for admin to review and generate recommendations
      // For demo purposes, we'll simulate this by setting isComplete after a delay
      setTimeout(() => {
        setIsComplete(true);
        // Generate mock recommendations
        fetchRecommendations(consultationId || "");
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting consultation:", error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your consultation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveConsultationProgress = async (data: any, isComplete = false) => {
    if (!user) return;
    
    try {
      // If we already have a consultation ID, update it
      if (consultationId) {
        const { error } = await supabase
          .from("consultations")
          .update({
            form_data: data,
            status: isComplete ? "Completed" : "In Progress",
            updated_at: new Date().toISOString(),
          })
          .eq("consultation_id", consultationId);
          
        if (error) throw error;
      } 
      // Otherwise create a new consultation
      else {
        const { data: newConsultation, error } = await supabase
          .from("consultations")
          .insert({
            client_id: user.id,
            form_data: data,
            status: isComplete ? "Completed" : "In Progress",
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setConsultationId(newConsultation.consultation_id);
      }
    } catch (error) {
      console.error("Error saving consultation progress:", error);
      toast({
        title: "Error",
        description: "Failed to save your progress",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleViewProgram = (programId: string) => {
    navigate(`/programs/${programId}`);
  };

  const handleStartNewConsultation = () => {
    // Reset all forms
    academicForm.reset();
    locationForm.reset();
    financialForm.reset();
    timelineForm.reset();
    personalForm.reset();
    
    // Reset state
    setFormData({
      academic: null,
      location: null,
      financial: null,
      timeline: null,
      personal: null,
    });
    setActiveStep(1);
    setIsComplete(false);
    setConsultationId(null);
    setRecommendedPrograms([]);
  };

  const handleScheduleCall = () => {
    navigate('/appointments');
  };

  if (isComplete) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle>Consultation Complete</CardTitle>
                <CardDescription>
                  Based on your preferences, we've recommended the following programs
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {loadingRecommendations ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : recommendedPrograms.length > 0 ? (
                <div className="space-y-6">
                  {recommendedPrograms.map((recommendation: any) => (
                    <Card key={recommendation.recommendation_id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 h-48 md:h-auto relative">
                          <img 
                            src={recommendation.programs?.image_url || '/placeholder.svg'} 
                            alt={recommendation.programs?.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-primary hover:bg-primary">
                              {Math.round(recommendation.match_score)}% Match
                            </Badge>
                          </div>
                        </div>
                        <div className="p-6 md:w-3/4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">{recommendation.programs?.name}</h3>
                              <p className="text-muted-foreground">{recommendation.programs?.university}</p>
                              
                              <div className="flex flex-wrap gap-2 mt-3">
                                <Badge variant="outline" className="bg-muted">
                                  {recommendation.programs?.study_level}
                                </Badge>
                                <Badge variant="outline" className="bg-muted">
                                  {recommendation.programs?.field}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end">
                              <p className="font-medium">
                                ${recommendation.programs?.tuition_min.toLocaleString()} - ${recommendation.programs?.tuition_max.toLocaleString()}
                              </p>
                              <p className="text-sm text-muted-foreground">Tuition per year</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-sm">
                                {recommendation.programs?.city}, {recommendation.programs?.country}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-sm">
                                {recommendation.programs?.duration_months} months
                              </span>
                            </div>
                            <div className="flex items-center">
                              <GraduationCap className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-sm">
                                {recommendation.programs?.study_level}
                              </span>
                            </div>
                          </div>
                          
                          {recommendation.recommendation_notes && (
                            <div className="mt-4 p-3 bg-muted/50 rounded-md">
                              <p className="text-sm">
                                <span className="font-medium">Why this program: </span>
                                {recommendation.recommendation_notes}
                              </p>
                            </div>
                          )}
                          
                          <div className="mt-4 flex justify-end">
                            <Button 
                              onClick={() => handleViewProgram(recommendation.programs?.id)}
                              className="flex items-center"
                            >
                              View Program <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Recommendations Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Our team is reviewing your preferences and will provide personalized recommendations soon.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button variant="outline" onClick={handleStartNewConsultation}>
              Start New Consultation
            </Button>
            <Button onClick={handleScheduleCall}>
              Schedule a Call with Advisor
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="hidden md:flex justify-between mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <div 
            key={step} 
            className={`flex flex-col items-center ${step < activeStep ? 'text-primary' : step === activeStep ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <div 
              className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                step < activeStep 
                  ? 'bg-primary text-primary-foreground' 
                  : step === activeStep 
                  ? 'border-2 border-primary' 
                  : 'border-2 border-muted'
              }`}
            >
              {step < activeStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span>{step}</span>
              )}
            </div>
            <span className="text-sm">
              {step === 1 && "Academic"}
              {step === 2 && "Location"}
              {step === 3 && "Financial"}
              {step === 4 && "Timeline"}
              {step === 5 && "Personal"}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile Progress Indicator */}
      <div className="md:hidden">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">
            Step {activeStep} of 5: 
            {activeStep === 1 && " Academic Preferences"}
            {activeStep === 2 && " Location Preferences"}
            {activeStep === 3 && " Financial Information"}
            {activeStep === 4 && " Timeline Preferences"}
            {activeStep === 5 && " Personal Information"}
          </span>
          <span className="text-sm text-muted-foreground">{activeStep}/5</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${(activeStep / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Academic Preferences */}
      {activeStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Preferences
            </CardTitle>
            <CardDescription>
              Tell us about your academic background and what you want to study
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...academicForm}>
              <form onSubmit={academicForm.handleSubmit(onAcademicSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={academicForm.control}
                    name="studyLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Study Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select study level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {studyLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={academicForm.control}
                    name="studyField"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select field of study" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {studyFields.map((field) => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={academicForm.control}
                  name="specificProgram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specific Program (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. MBA, Computer Science, etc." {...field} />
                      </FormControl>
                      <FormDescription>
                        If you have a specific program in mind, please specify
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={academicForm.control}
                  name="previousEducation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Education</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your educational background, degrees, institutions, etc." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={academicForm.control}
                    name="gpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GPA (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g. 3.5/4.0" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your GPA on a 4.0 scale or equivalent
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={academicForm.control}
                    name="workExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Experience (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g. 2 years in marketing" {...field} />
                        </FormControl>
                        <FormDescription>
                          Relevant work experience if applicable
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    Next Step
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Location Preferences */}
      {activeStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Preferences
            </CardTitle>
            <CardDescription>
              Tell us where you'd like to study and your location preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...locationForm}>
              <form onSubmit={locationForm.handleSubmit(onLocationSubmit)} className="space-y-6">
                <FormField
                  control={locationForm.control}
                  name="preferredCountries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Countries</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {countries.map((country) => (
                          <FormItem
                            key={country.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(country.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, country.value])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== country.value
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {country.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={locationForm.control}
                  name="preferredCities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Cities (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. London, New York, Paris" {...field} />
                      </FormControl>
                      <FormDescription>
                        Specify any cities you're particularly interested in
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={locationForm.control}
                  name="languagePreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Language of Instruction</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language.value} value={language.value}>
                              {language.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={locationForm.control}
                  name="accommodationNeeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accommodation Needs (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your accommodation preferences or requirements" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Special Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={locationForm.control}
                      name="religiousRequirements"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Religious Facilities
                            </FormLabel>
                            <FormDescription>
                              Access to prayer rooms or religious facilities
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={locationForm.control}
                      name="halalFood"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Halal Food Options
                            </FormLabel>
                            <FormDescription>
                              Access to halal food on or near campus
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={locationForm.control}
                      name="communityPreference"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              North African Community
                            </FormLabel>
                            <FormDescription>
                              Prefer locations with North African community
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                  <Button type="submit">
                    Next Step
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Financial Information */}
      {activeStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Information
            </CardTitle>
            <CardDescription>
              Help us understand your budget and financial needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...financialForm}>
              <form onSubmit={financialForm.handleSubmit(onFinancialSubmit)} className="space-y-6">
                <FormField
                  control={financialForm.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Budget for Tuition and Living Expenses</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {budgetRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This helps us recommend programs within your budget
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={financialForm.control}
                    name="scholarshipInterest"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Interested in Scholarships
                          </FormLabel>
                          <FormDescription>
                            I want to apply for scholarships if available
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={financialForm.control}
                    name="workStudyInterest"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Interested in Work-Study
                          </FormLabel>
                          <FormDescription>
                            I want to work part-time while studying
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={financialForm.control}
                  name="financialAidNeeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Financial Information (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any other financial considerations or needs we should know about" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This information helps us better understand your financial situation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                  <Button type="submit">
                    Next Step
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Timeline Preferences */}
      {activeStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline Preferences
            </CardTitle>
            <CardDescription>
              Tell us about your preferred timeline for studying abroad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...timelineForm}>
              <form onSubmit={timelineForm.handleSubmit(onTimelineSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={timelineForm.control}
                    name="preferredDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Program Duration</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {durations.map((duration) => (
                              <SelectItem key={duration.value} value={duration.value}>
                                {duration.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={timelineForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Start Date</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select start date" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {startDates.map((date) => (
                              <SelectItem key={date.value} value={date.value}>
                                {date.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={timelineForm.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How urgent is your application?</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Not urgent</span>
                            <span>Somewhat urgent</span>
                            <span>Very urgent</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        This helps us prioritize your application
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={timelineForm.control}
                  name="flexibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeline Flexibility (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any additional information about your timeline flexibility" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Let us know if you have any specific timeline constraints or flexibility
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                  <Button type="submit">
                    Next Step
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Personal Information */}
      {activeStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Personal Preferences
            </CardTitle>
            <CardDescription>
              Tell us about your personal goals and any special requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...personalForm}>
              <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-6">
                <FormField
                  control={personalForm.control}
                  name="careerGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Career Goals</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your career goals and how studying abroad fits into your plans" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="specialRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requirements (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special requirements or preferences not covered in previous sections" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This could include cultural preferences, dietary needs, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="healthConsiderations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Health Considerations (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any health or accessibility considerations we should be aware of" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This information helps us recommend suitable programs and locations
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Anything else you'd like us to know about your study abroad plans" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Consultation"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsultationFlow;
