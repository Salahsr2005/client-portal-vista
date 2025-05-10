
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { usePrograms, ProgramFilter } from "@/hooks/usePrograms";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// Import steps components
import { StepOne } from './steps/StepOne';
import { StepTwo } from './steps/StepTwo';
import { StepThree } from './steps/StepThree';
import { StepFour } from './results/StepFour';

// Import types
import { FormData, Program } from './types';

export const ConsultationFlow = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<number>(1);
  const [progress, setProgress] = useState<number>(25);
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
  const filteredPrograms = programs as Array<Program & { matchScore?: number, matchDetails?: any }>;
  
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

        // Parse budget to a number or use 0 if empty
        const budgetValue = formData.budget ? parseInt(formData.budget) : 0;

        const { error } = await supabase.from('consultation_results').insert({
          user_id: user.id,
          study_level: formData.studyLevel as any, // Type cast to match the enum type
          field_preference: formData.subjects.join(', '),
          field_keywords: formData.subjects,
          budget: budgetValue,
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
        (program.location && program.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        program.country?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredPrograms;
  
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };
  
  const clearAllFilters = () => {
    setActiveFilters({
      level: false, 
      location: false, 
      duration: false, 
      budget: false
    });
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
      
      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <StepOne 
            formData={formData} 
            setFormData={setFormData} 
            itemVariants={{}}
          />
        )}
      
        {step === 2 && (
          <StepTwo
            formData={formData}
            handleSubjectToggle={handleSubjectToggle}
            subjectAreas={subjectAreas}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        )}
      
        {step === 3 && (
          <StepThree
            formData={formData}
            setFormData={setFormData}
            languageOptions={languageOptions}
            budgetOptions={budgetOptions}
            formatBudget={formatBudget}
          />
        )}
      
        {step === 4 && (
          <StepFour
            filteredPrograms={filteredPrograms}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilters={activeFilters}
            toggleFilter={toggleFilter}
            clearAllFilters={clearAllFilters}
            isGridView={isGridView}
            setIsGridView={setIsGridView}
            selectedPrograms={selectedPrograms}
            favoritePrograms={favoritePrograms}
            showMatchDetails={showMatchDetails}
            showBudgetBreakdown={showBudgetBreakdown}
            handleProgramSelect={handleProgramSelect}
            toggleFavorite={toggleFavorite}
            toggleMatchDetails={toggleMatchDetails}
            toggleBudgetBreakdown={toggleBudgetBreakdown}
            handleSubmit={handleSubmit}
            handlePrevious={handlePrevious}
            isLoading={isLoading}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
            searchFilteredPrograms={searchFilteredPrograms}
          />
        )}
      </AnimatePresence>
      
      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={step === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        {step < 4 && (
          <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
