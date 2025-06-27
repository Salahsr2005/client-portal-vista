
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Destination {
  id: string;
  name: string;
  country: string;
  procedure_type: string;
  description: string;
  logo_url?: string;
  cover_image_url?: string;
  
  // Tuition information
  bachelor_tuition_min?: number;
  bachelor_tuition_max?: number;
  master_tuition_min?: number;
  master_tuition_max?: number;
  phd_tuition_min?: number;
  phd_tuition_max?: number;
  
  // Academic requirements
  bachelor_academic_level?: 'High' | 'Medium' | 'Any';
  master_academic_level?: 'High' | 'Medium' | 'Any';
  phd_academic_level?: 'High' | 'Medium' | 'Any';
  
  // General requirements
  bachelor_requirements?: string;
  master_requirements?: string;
  phd_requirements?: string;
  
  // Required documents
  bachelor_documents?: string[];
  master_documents?: string[];
  phd_documents?: string[];
  
  // Success rates
  admission_success_rate?: number;
  visa_success_rate?: number;
  
  // Programs available
  available_programs?: string[];
  
  // Agency services and fees
  agency_services?: string[];
  application_fee?: number;
  service_fee?: number;
  visa_processing_fee?: number;
  
  // Additional info
  processing_time?: string;
  language_requirements?: string;
  intake_periods?: string[];
  
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export const useDestinations = () => {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      console.log("Fetching destinations from Supabase...");
      
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq('status', 'Active')
        .order("name", { ascending: true });
      
      if (error) {
        console.error("Error fetching destinations:", error);
        throw new Error(error.message);
      }
      
      console.log("Fetched destinations:", data);
      return data as Destination[];
    },
  });
};
