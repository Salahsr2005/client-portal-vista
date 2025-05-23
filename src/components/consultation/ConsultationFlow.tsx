
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { StepOne } from "./steps/StepOne";
import { StepTwo } from "./steps/StepTwo";
import { StepThree } from "./steps/StepThree";
import Results from "./results/Results";
import { FormData } from './types';

const ConsultationFlow: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    level: '',
    subject: '',
    subjects: [],
    budget: '',
    destination: '',
    location: '',
    duration: '',
    language: '',
    scholarshipRequired: false,
    religiousFacilities: false,
    halalFood: false,
    specialRequirements: {
      religiousFacilities: false,
      halalFood: false,
      scholarshipRequired: false,
    },
    startDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleNext = () => {
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleUpdateForm = (key: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Improved function to prepare field keywords from subjects
  const prepareFieldKeywords = () => {
    // If we have an array of subjects, use it directly
    if (formData.subjects && formData.subjects.length > 0) {
      return formData.subjects;
    }
    
    // If we only have a single subject string, split it by commas or convert to array
    if (formData.subject) {
      return formData.subject.includes(',') 
        ? formData.subject.split(',').map(s => s.trim()) 
        : [formData.subject.trim()];
    }
    
    return [];
  };

  const finalizeAndSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You need to be logged in to save your consultation",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Convert budget to number if it's a string
      const numericBudget = typeof formData.budget === 'string' 
        ? parseInt(formData.budget as string, 10) 
        : formData.budget || 0;
      
      // Prepare field keywords in a more robust way
      const fieldKeywords = prepareFieldKeywords();
      
      // Get study level in the format expected by the database
      const studyLevel = formData.level || formData.studyLevel || 'Master';
      
      // Prepare consultation data
      const consultationData = {
        user_id: user.id,
        study_level: studyLevel as "Bachelor" | "Master" | "PhD" | "Certificate" | "Diploma",
        language_preference: formData.language || 'English',
        budget: numericBudget,
        field_keywords: fieldKeywords,
        destination_preference: formData.destination || formData.location || '',
        religious_facilities_required: formData.specialRequirements?.religiousFacilities || formData.religiousFacilities || false,
        halal_food_required: formData.specialRequirements?.halalFood || formData.halalFood || false,
        scholarship_required: formData.specialRequirements?.scholarshipRequired || formData.scholarshipRequired || false,
        duration_preference: formData.duration || 'year'
      };

      const { data, error } = await supabase
        .from('consultation_results')
        .insert(consultationData);
      
      if (error) {
        console.error("Error saving consultation:", error);
        toast({
          title: "Error saving consultation",
          description: error.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Show success message
      toast({
        title: "Consultation saved",
        description: "Your preferences have been saved successfully",
        variant: "default",
      });
      
      // Move to results step
      setStep(4);
      setIsSubmitting(false);
      
      // Add a small delay before scrolling to ensure the component has rendered
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
      
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast({
        title: "Unexpected error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Render the appropriate step based on the current step state
  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepOne formData={formData} updateForm={handleUpdateForm} onNext={handleNext} />;
      case 2:
        return <StepTwo formData={formData} updateForm={handleUpdateForm} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return (
          <StepThree 
            formData={formData} 
            updateForm={handleUpdateForm} 
            onNext={finalizeAndSubmit} 
            onBack={handleBack} 
            isSubmitting={isSubmitting} 
          />
        );
      case 4:
        return <Results formData={formData} />;
      default:
        return <StepOne formData={formData} updateForm={handleUpdateForm} onNext={handleNext} />;
    }
  };

  return (
    <Card className="shadow-md bg-white dark:bg-slate-900">
      <CardContent className="p-0">
        {renderStep()}
      </CardContent>
    </Card>
  );
};

export { ConsultationFlow };
