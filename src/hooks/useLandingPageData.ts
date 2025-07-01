
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  requirements: string;
  country?: string;
}

interface Program {
  id: string;
  name: string;
  description: string;
  location: string;
  duration: string;
  fee: string;
  requirements: string;
  country?: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  fee: string;
}

export const useLandingPageData = () => {
  // Fetch destinations
  const destinationsQuery = useQuery({
    queryKey: ["landingDestinations"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("destinations")
          .select("*")
          .eq("status", "Active");
        
        if (error) {
          console.error("Error fetching destinations:", error);
          toast({
            title: "Error fetching destinations",
            description: "Please refresh the page or try again later.",
            variant: "destructive"
          });
          return [];
        }
        
        return data?.map(destination => ({
          id: destination.id, // Updated from destination_id to id
          name: destination.country || destination.name,
          description: destination.description || "",
          image: destination.image_url || `/images/flags/${destination.country?.toLowerCase() || 'generic'}.svg`,
          requirements: destination.visa_requirements || "",
          country: destination.country,
        })) || [];
      } catch (error) {
        console.error("Unexpected error fetching destinations:", error);
        return [];
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch programs with better error handling
  const programsQuery = useQuery({
    queryKey: ["landingPrograms"],
    queryFn: async () => {
      try {
        // Fetch programs
        const { data: programsData, error: programsError } = await supabase
          .from("programs")
          .select("*")
          .eq("status", "Active")
          .limit(8); // Limit to 8 programs for landing page
        
        if (programsError) {
          console.error("Error fetching programs:", programsError);
          toast({
            title: "Error fetching programs",
            description: "Please refresh the page or try again later.",
            variant: "destructive"
          });
          return [];
        }
        
        // Map programs to the format we need
        return (programsData || []).map(program => ({
          id: program.id,
          name: program.name,
          description: program.admission_requirements || "",
          location: program.country || "International",
          duration: program.duration_months ? `${program.duration_months} months` : "Varies",
          fee: program.tuition_min ? `$${program.tuition_min}` : "Contact for details",
          requirements: program.admission_requirements || "",
          country: program.country,
          image_url: program.image_url || `/images/flags/${program.country?.toLowerCase() || 'generic'}.svg`,
        }));
        
      } catch (error) {
        console.error("Unexpected error in programs query:", error);
        return [];
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch services with better error handling
  const servicesQuery = useQuery({
    queryKey: ["landingServices"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("status", "Active");
        
        if (error) {
          console.error("Error fetching services:", error);
          toast({
            title: "Error fetching services",
            description: "Please refresh the page or try again later.",
            variant: "destructive"
          });
          return [];
        }
        
        return data?.map(service => ({
          id: service.service_id,
          name: service.name,
          description: service.description || "",
          duration: service.estimated_completion || service.duration + " min",
          fee: service.price ? `$${service.price}` : "Contact for details",
        })) || [];
      } catch (error) {
        console.error("Unexpected error fetching services:", error);
        return [];
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    destinations: {
      data: destinationsQuery.data || [],
      isLoading: destinationsQuery.isLoading,
      error: destinationsQuery.error,
      refetch: destinationsQuery.refetch
    },
    programs: {
      data: programsQuery.data || [],
      isLoading: programsQuery.isLoading,
      error: programsQuery.error,
      refetch: programsQuery.refetch
    },
    services: {
      data: servicesQuery.data || [],
      isLoading: servicesQuery.isLoading,
      error: servicesQuery.error,
      refetch: servicesQuery.refetch
    },
  };
};
