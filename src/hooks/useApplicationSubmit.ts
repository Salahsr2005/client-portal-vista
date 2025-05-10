
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ApplicationFormData {
  programId: string;
  notes: string;
  priority: string;
}

export const useApplicationSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const submitApplication = async (formData: ApplicationFormData) => {
    if (!user) {
      toast.error("You need to be logged in to submit an application");
      return { success: false, error: "Authentication required" };
    }
    
    setIsSubmitting(true);
    
    try {
      // Make sure priority is one of the allowed values
      const validPriority = ["Low", "Medium", "High", "Urgent"].includes(formData.priority) 
        ? formData.priority 
        : "Medium";
        
      // Insert application into the database
      const { data, error } = await supabase
        .from('applications')
        .insert({
          program_id: formData.programId,
          client_id: user.id,
          notes: formData.notes,
          priority: validPriority,
          status: 'Draft',
        })
        .select('application_id')
        .single();
        
      if (error) throw error;
      
      toast.success("Application submitted successfully");
      
      // Create initial timeline event
      await supabase
        .from('application_timeline')
        .insert({
          application_id: data.application_id,
          status: 'Draft',
          date: new Date().toISOString(),
          note: 'Application created'
        });
      
      return { success: true, applicationId: data.application_id };
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { submitApplication, isSubmitting };
};
