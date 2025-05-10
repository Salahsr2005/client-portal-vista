
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export type ApplicationFormData = {
  programId: string;
  notes?: string;
  priority: 'High' | 'Medium' | 'Low';
};

export const useApplicationSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const submitApplication = async (data: ApplicationFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit an application",
        variant: "destructive",
      });
      return { success: false };
    }

    setIsSubmitting(true);

    try {
      const { data: result, error } = await supabase
        .from("applications")
        .insert({
          client_id: user.id,
          program_id: data.programId,
          notes: data.notes || null,
          priority: data.priority,
          status: "Draft",
        })
        .select("application_id")
        .single();

      if (error) {
        throw error;
      }

      // Add first timeline event
      await supabase.from("application_timeline").insert({
        application_id: result.application_id,
        status: "Draft",
        date: new Date().toISOString(),
        note: "Application created",
      });

      toast({
        title: "Application submitted",
        description: "Your application has been created successfully",
      });

      return { success: true, applicationId: result.application_id };
    } catch (error: any) {
      console.error("Error submitting application:", error);
      
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
      
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitApplication,
    isSubmitting,
  };
};
