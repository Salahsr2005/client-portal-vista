import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { usePrograms, ProgramFilter } from "@/hooks/usePrograms";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ProgramCard from './ProgramCard';
import { getMatchExplanation, getBudgetBreakdown } from "@/services/ProgramMatchingService";
import { ArrowRight, ArrowLeft, X, Filter, Search, GraduationCap, FileText, Euro, Info, Grid, ListFilter, Map, Loader2, Building, BookOpen, Users, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define types
interface FormData {
  studyLevel: "Bachelor" | "Master" | "PhD" | "Certificate" | "Diploma";
  subjects: string[];
  location: string;
  duration: string;
  budget: string;
  startDate: string;
  language: string;
  specialRequirements: string;
  scholarshipRequired: boolean;
  religiousFacilities: boolean;
  halalFood: boolean;
  languageTestRequired: boolean;
}

export const ConsultationFlow = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [formData, setFormData] = useState<FormData>({
    studyLevel: "Bachelor",
    subjects: [],
    location: "",
    duration: "",
    budget: "",
    startDate: "",
    language: "",
    specialRequirements: "",
    scholarshipRequired: false,
    religiousFacilities: false,
    halalFood: false,
    languageTestRequired: false
  });
  
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [favoritePrograms, setFavoritePrograms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<{[key: string]: boolean}>({
    level: false,
    location: false,
    duration: false,
    budget: false,
  });
  const [showMatchDetails, setShowMatchDetails] = useState<{[key: string]: boolean}>({});
  const [showBudgetBreakdown, setShowBudgetBreakdown] = useState<{[key: string]: boolean}>({});
  const [isGridView, setIsGridView] = useState(true);
  
  // Create filter object based on form data
  const programFilter: ProgramFilter = {
    studyLevel: formData.studyLevel,
    subjects: formData.subjects,
    location: formData.location,
    duration: formData.duration,
    language: formData.language,
    budget: formData.budget,
    scholarshipRequired: formData.scholarshipRequired,
    religiousFacilities: formData.religiousFacilities,
    halalFood: formData.halalFood,
    languageTestRequired: formData.languageTestRequired
  };
  
  // Get programs with matching algorithm applied
  const { data: programs = [], isLoading } = usePrograms(step === 4 ? programFilter : undefined);
  // Type assertion to ensure programs have matchScore
  const filteredPrograms = programs as Array<typeof programs[0] & { matchScore?: number, matchDetails?: any }>;
  
  // Initialize favorites
  useEffect(() => {
    if (user) {
      fetchFavoritePrograms();
    }
  }, [user]);
  
  const fetchFavoritePrograms = async () => {
    if (!user) return;
    
    try {
      // Fetch user's favorite programs
      const { data, error } = await supabase
        .from('favorite_programs')
        .select('program_id')
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error fetching favorite programs:', error);
        return;
      }
      
      if (data) {
        const favoriteIds = data.map(item => item.program_id);
        setFavoritePrograms(favoriteIds);
      }
    } catch (err) {
      console.error('Error in fetchFavoritePrograms:', err);
    }
  };
  
  const toggleFavorite = async (programId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save favorite programs",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (favoritePrograms.includes(programId)) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorite_programs')
          .delete()
          .eq('user_id', user.id)
          .eq('program_id', programId);
          
        if (error) throw error;
        
        setFavoritePrograms(prev => prev.filter(id => id !== programId));
        toast({
          title: "Removed from favorites",
          description: "Program removed from your favorites",
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorite_programs')
          .insert({
            user_id: user.id,
            program_id: programId
          });
          
        if (error) throw error;
        
        setFavoritePrograms(prev => [...prev, programId]);
        toast({
          title: "Added to favorites",
          description: "Program added to your favorites",
        });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleNext = () => {
    if (step === 1) {
      if (!formData.studyLevel) {
        toast({
          title: "Required field",
          description: "Please select a study level to continue",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
      setProgress(50);
    } else if (step === 2) {
      if (formData.subjects.length === 0) {
        toast({
          title: "Required field",
          description: "Please select at least one subject area",
          variant: "destructive",
        });
        return;
      }
      setStep(3);
      setProgress(75);
    } else if (step === 3) {
      setStep(4);
      setProgress(100);
    }
  };
  
  const handlePrevious = () => {
    if (step === 2) {
      setStep(1);
      setProgress(25);
    } else if (step === 3) {
      setStep(2);
      setProgress(50);
    } else if (step === 4) {
      setStep(3);
      setProgress(75);
    }
  };
  
  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => {
      if (prev.subjects.includes(subject)) {
        return {
          ...prev,
          subjects: prev.subjects.filter(s => s !== subject)
        };
      } else {
        return {
          ...prev,
          subjects: [...prev.subjects, subject]
        };
      }
    });
  };
  
  const handleProgramSelect = (programId: string) => {
    setSelectedPrograms(prev => {
      if (prev.includes(programId)) {
        return prev.filter(id => id !== programId);
      } else {
        return [...prev, programId];
      }
    });
  };
  
  const handleSubmit = async () => {
    try {
      // Save consultation results to database if user is logged in
      if (user) {
        const selectedProgramObjects = filteredPrograms
          .filter(program => selectedPrograms.includes(program.id))
          .map(program => ({
            id: program.id,
            name: program.name,
            matchScore: program.matchScore || 0,
            university: program.university
          }));

        const { error } = await supabase.from('consultation_results').insert({
          user_id: user.id,
          study_level: formData.studyLevel,
          field_preference: formData.subjects.join(', '),
          field_keywords: formData.subjects,
          budget: parseInt(formData.budget || '0'),
          language_preference: formData.language,
          destination_preference: formData.location,
          duration_preference: formData.duration,
          scholarship_required: formData.scholarshipRequired,
          religious_facilities_required: formData.religiousFacilities,
          halal_food_required: formData.halalFood,
          recommended_programs: selectedProgramObjects,
          notes: formData.specialRequirements
        });
        
        if (error) {
          console.error("Error saving consultation results:", error);
          throw error;
        }
      }
      
      toast({
        title: "Consultation Complete",
        description: `You've selected ${selectedPrograms.length} programs. Our advisors will contact you soon.`,
      });
      
      // Here you would typically send the data to your backend
      console.log("Selected programs:", selectedPrograms);
      console.log("Form data:", formData);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      toast({
        title: "Error",
        description: "There was a problem submitting your consultation. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const toggleMatchDetails = (programId: string) => {
    setShowMatchDetails(prev => ({
      ...prev,
      [programId]: !prev[programId]
    }));
  };
  
  const toggleBudgetBreakdown = (programId: string) => {
    setShowBudgetBreakdown(prev => ({
      ...prev,
      [programId]: !prev[programId]
    }));
  };
  
  // Filter programs based on search query
  const searchFilteredPrograms = searchQuery 
    ? filteredPrograms.filter(program => 
        program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.university?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.country?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredPrograms;
  
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };
  
  // Subject areas
  const subjectAreas = [
    "Business & Management",
    "Computer Science & IT",
    "Engineering",
    "Arts & Humanities",
    "Social Sciences",
    "Natural Sciences",
    "Medicine & Health",
    "Law",
    "Education",
    "Architecture & Design"
  ];

  // Add language options
  const languageOptions = [
    { value: "english", label: "English" },
    { value: "french", label: "French" },
    { value: "arabic", label: "Arabic" },
    { value: "spanish", label: "Spanish" },
    { value: "german", label: "German" },
    { value: "italian", label: "Italian" },
    { value: "any", label: "Any language" }
  ];
  
  // Format budget display for user-friendly viewing
  const formatBudget = (budget: string) => {
    const value = parseInt(budget);
    return `€${value.toLocaleString()}`;
  };
  
  // Add budget options in euros
  const budgetOptions = [
    { value: "5000", label: "Under €5,000" },
    { value: "10000", label: "Under €10,000" },
    { value: "15000", label: "Under €15,000" },
    { value: "20000", label: "Under €20,000" },
    { value: "30000", label: "Under €30,000" },
    { value: "50000", label: "Under €50,000" },
    { value: "100000", label: "Any budget" }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="space-y-6 p-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step {step} of 4</span>
          <span>{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Step 1: Study Level */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">What level of study are you interested in?</h2>
            <p className="text-muted-foreground">Select the academic level you want to pursue</p>
            
            <RadioGroup 
              value={formData.studyLevel} 
              onValueChange={(value: "Bachelor" | "Master" | "PhD" | "Certificate" | "Diploma") => setFormData({...formData, studyLevel: value})}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4"
            >
              <motion.div variants={itemVariants} initial="hidden" animate="show">
                <RadioGroupItem value="Bachelor" id="bachelor" className="peer sr-only" />
                <Label
                  htmlFor="bachelor"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all duration-200 hover:shadow-md"
                >
                  <GraduationCap className="mb-3 h-6 w-6" />
                  <div className="space-y-1 text-center">
                    <h3 className="font-medium">Bachelor's Degree</h3>
                    <p className="text-sm text-muted-foreground">
                      Undergraduate programs (3-4 years)
                    </p>
                  </div>
                </Label>
              </motion.div>
              
              <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
                <RadioGroupItem value="Master" id="master" className="peer sr-only" />
                <Label
                  htmlFor="master"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all duration-200 hover:shadow-md"
                >
                  <GraduationCap className="mb-3 h-6 w-6" />
                  <div className="space-y-1 text-center">
                    <h3 className="font-medium">Master's Degree</h3>
                    <p className="text-sm text-muted-foreground">
                      Graduate programs (1-2 years)
                    </p>
                  </div>
                </Label>
              </motion.div>
              
              <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.2 }}>
                <RadioGroupItem value="PhD" id="phd" className="peer sr-only" />
                <Label
                  htmlFor="phd"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all duration-200 hover:shadow-md"
                >
                  <GraduationCap className="mb-3 h-6 w-6" />
                  <div className="space-y-1 text-center">
                    <h3 className="font-medium">PhD / Doctorate</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced research degrees (3+ years)
                    </p>
                  </div>
                </Label>
              </motion.div>
              
              <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.3 }}>
                <RadioGroupItem value="Certificate" id="certificate" className="peer sr-only" />
                <Label
                  htmlFor="certificate"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all duration-200 hover:shadow-md"
                >
                  <BookOpen className="mb-3 h-6 w-6" />
                  <div className="space-y-1 text-center">
                    <h3 className="font-medium">Certificate / Diploma</h3>
                    <p className="text-sm text-muted-foreground">
                      Short-term professional qualifications
                    </p>
                  </div>
                </Label>
              </motion.div>
            </RadioGroup>
          </motion.div>
        )}
      
        {/* Step 2: Subject Areas */}
        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">What subjects are you interested in studying?</h2>
            <p className="text-muted-foreground">Select all that apply</p>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {subjectAreas.map((subject, index) => (
                <motion.div 
                  key={subject} 
                  className="flex items-center space-x-2"
                  variants={itemVariants}
                  transition={{ delay: index * 0.05 }}
                >
                  <Checkbox 
                    id={subject.toLowerCase().replace(/\s+/g, '-')} 
                    checked={formData.subjects.includes(subject)}
                    onCheckedChange={() => handleSubjectToggle(subject)}
                  />
                  <label
                    htmlFor={subject.toLowerCase().replace(/\s+/g, '-')}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {subject}
                  </label>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      
        {/* Step 3: Additional Preferences */}
        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold">Additional Preferences</h2>
            <p className="text-muted-foreground">Help us narrow down programs that match your needs</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Label htmlFor="location">Preferred Location</Label>
                <Select 
                  value={formData.location} 
                  onValueChange={(value) => setFormData({...formData, location: value})}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Location</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="Italy">Italy</SelectItem>
                    <SelectItem value="Netherlands">Netherlands</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Label htmlFor="language">Preferred Language</Label>
                <Select 
                  value={formData.language} 
                  onValueChange={(value) => setFormData({...formData, language: value})}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Label htmlFor="duration">Program Duration</Label>
                <Select 
                  value={formData.duration} 
                  onValueChange={(value) => setFormData({...formData, duration: value})}
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preparatory">Preparatory Program (6-12 months)</SelectItem>
                    <SelectItem value="full_degree">Full Degree Program (2+ years)</SelectItem>
                    <SelectItem value="12">Up to 1 year</SelectItem>
                    <SelectItem value="24">1-2 years</SelectItem>
                    <SelectItem value="36">2-3 years</SelectItem>
                    <SelectItem value="48">3+ years</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Label htmlFor="budget">Budget (Annual in EUR)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2">
                        <Select
                          value={formData.budget}
                          onValueChange={(value) => setFormData({...formData, budget: value})}
                        >
                          <SelectTrigger id="budget" className="flex-1">
                            <SelectValue placeholder="Select budget range">
                              {formData.budget ? (
                                <div className="flex items-center">
                                  <Euro className="h-4 w-4 mr-1" />
                                  {formatBudget(formData.budget)}
                                </div>
                              ) : (
                                "Select budget range"
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {budgetOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <p>This budget should include tuition and estimated living expenses for one academic year.</p>
                      {formData.budget && (
                        <p className="mt-2">
                          Equivalent in DZD: {(parseInt(formData.budget) * 250).toLocaleString()} DZD
                          <br /><span className="text-xs text-muted-foreground">1 EUR = 250 DZD</span>
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Label htmlFor="startDate">Preferred Start Date</Label>
                <Select 
                  value={formData.startDate} 
                  onValueChange={(value) => setFormData({...formData, startDate: value})}
                >
                  <SelectTrigger id="startDate">
                    <SelectValue placeholder="Select start date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                    <SelectItem value="Spring 2026">Spring 2026</SelectItem>
                    <SelectItem value="Fall 2026">Fall 2026</SelectItem>
                    <SelectItem value="Spring 2027">Spring 2027</SelectItem>
                    <SelectItem value="Flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>
            
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Label>Additional Requirements</Label>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="scholarshipRequired" 
                    checked={formData.scholarshipRequired}
                    onCheckedChange={(checked) => setFormData({...formData, scholarshipRequired: !!checked})}
                  />
                  <label htmlFor="scholarshipRequired">
                    Scholarship available
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="religiousFacilities" 
                    checked={formData.religiousFacilities}
                    onCheckedChange={(checked) => setFormData({...formData, religiousFacilities: !!checked})}
                  />
                  <label htmlFor="religiousFacilities">
                    Religious facilities available
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="halalFood" 
                    checked={formData.halalFood}
                    onCheckedChange={(checked) => setFormData({...formData, halalFood: !!checked})}
                  />
                  <label htmlFor="halalFood">
                    Halal food options
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="languageTestRequired" 
                    checked={formData.languageTestRequired}
                    onCheckedChange={(checked) => setFormData({...formData, languageTestRequired: !!checked})}
                  />
                  <label htmlFor="languageTestRequired">
                    Language test required
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Check this if you prefer programs that require language tests like IELTS, TOEFL, etc.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <Label htmlFor="specialRequirements">Special Requirements or Notes</Label>
              <Textarea 
                id="specialRequirements" 
                placeholder="Any additional information that might help us find the right program for you"
                value={formData.specialRequirements}
                onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
                className="min-h-[100px]"
              />
            </motion.div>
          </motion.div>
        )}
      
        {/* Step 4: Results */}
        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Recommended Programs</h2>
                <p className="text-muted-foreground">
                  Based on your preferences, we found {filteredPrograms.length} matching programs
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search programs..."
                    className="pl-8 w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant={isGridView ? "default" : "outline"}
                    size="icon"
                    onClick={() => setIsGridView(true)}
                    className={`h-9 w-9 rounded-r-none ${isGridView ? '' : 'border-r-0'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={!isGridView ? "default" : "outline"}
                    size="icon"
                    onClick={() => setIsGridView(false)}
                    className={`h-9 w-9 rounded-l-none ${!isGridView ? '' : 'border-l-0'}`}
                  >
                    <ListFilter className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button variant="outline" size="icon" onClick={() => toggleFilter('all')}>
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Active filters */}
            {Object.values(activeFilters).some(Boolean) && (
              <motion.div 
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {Object.entries(activeFilters).map(([key, active]) => 
                  active && (
                    <Badge key={key} variant="secondary" className="px-3 py-1">
                      {key === 'level' ? 'Study Level' : 
                       key === 'location' ? 'Location' : 
                       key === 'duration' ? 'Duration' : 
                       key === 'budget' ? 'Budget' : key}
                      <X 
                        className="ml-1 h-3 w-3 cursor-pointer" 
                        onClick={() => toggleFilter(key)} 
                      />
                    </Badge>
                  )
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
