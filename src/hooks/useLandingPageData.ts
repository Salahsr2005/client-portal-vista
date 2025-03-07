
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLandingPageData = () => {
  // Fetch programs for features section
  const programs = useQuery({
    queryKey: ["landing-programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("is_active", true)
        .limit(6);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
  });
  
  // Fetch destinations for testimonials or featured content
  const destinations = useQuery({
    queryKey: ["landing-destinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("is_active", true)
        .limit(3);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
  });
  
  // Fetch services for pricing section
  const services = useQuery({
    queryKey: ["landing-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .limit(3);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
  });
  
  return {
    programs,
    destinations,
    services,
    isLoading: programs.isLoading || destinations.isLoading || services.isLoading,
    isError: programs.isError || destinations.isError || services.isError,
  };
};
