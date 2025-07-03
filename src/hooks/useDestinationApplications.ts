import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface DestinationApplication {
  id: string;
  client_id: string;
  destination_id: string;
  program_level: 'Bachelor' | 'Master' | 'PhD';
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Cancelled';
  payment_status: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  application_data: any;
  notes?: string;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
  destinations?: {
    name: string;
    country: string;
    application_fee?: number;
    service_fee?: number;
  };
}

export interface DestinationApplicationFormData {
  destinationId: string;
  programLevel: 'Bachelor' | 'Master' | 'PhD';
  notes?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  applicationData?: any;
}

export const useDestinationApplications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["destination-applications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("destination_applications")
        .select(`
          *,
          destinations(name, country, application_fee, service_fee)
        `)
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching destination applications:", error);
        throw new Error(error.message);
      }

      return data as DestinationApplication[];
    },
  });
};

export const useDestinationApplicationSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const submitApplication = async (data: DestinationApplicationFormData) => {
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
        .from("destination_applications")
        .insert({
          client_id: user.id,
          destination_id: data.destinationId,
          program_level: data.programLevel,
          notes: data.notes || null,
          priority: data.priority,
          application_data: data.applicationData || {},
          status: "Draft",
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      // Invalidate and refetch applications
      queryClient.invalidateQueries({ queryKey: ["destination-applications"] });

      toast({
        title: "Application submitted",
        description: "Your destination application has been created successfully",
      });

      return { success: true, applicationId: result.id };
    } catch (error: any) {
      console.error("Error submitting destination application:", error);
      
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

export const useDestinationApplicationPayment = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const createPayment = async (applicationId: string, amount: number, destinationName: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to make a payment",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert({
          client_id: user.id,
          amount: amount,
          reference: "destination",
          method: "Credit Card",
          description: `Destination Application Fee - ${destinationName}`,
          date: new Date().toISOString(),
          status: "Pending",
        })
        .select("payment_id")
        .single();

      if (paymentError) {
        throw paymentError;
      }

      // Update application payment status
      const { error: updateError } = await supabase
        .from("destination_applications")
        .update({
          payment_status: "Paid",
          status: "Submitted",
          submitted_at: new Date().toISOString(),
        })
        .eq("id", applicationId);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Payment successful",
        description: "Your payment has been processed and application submitted",
      });

      return { success: true, paymentId: payment.payment_id };
    } catch (error: any) {
      console.error("Error processing payment:", error);
      
      toast({
        title: "Payment failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
      
      return { success: false };
    }
  };

  return {
    createPayment,
  };
};