
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLandingPageData = () => {
  // Fetch destinations
  const destinationsQuery = useQuery({
    queryKey: ["landingDestinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("is_active", true)
        .limit(6);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data.map(destination => ({
        id: destination.destination_id,
        name: destination.country_name,
        description: destination.description || "",
        image: destination.image_url || "/placeholder.svg",
        requirements: destination.visa_requirements || "",
      }));
    },
  });

  // Fetch programs
  const programsQuery = useQuery({
    queryKey: ["landingPrograms"],
    queryFn: async () => {
      // First fetch programs
      const { data: programsData, error: programsError } = await supabase
        .from("programs")
        .select("*")
        .eq("is_active", true)
        .limit(6);
      
      if (programsError) {
        throw new Error(programsError.message);
      }
      
      // Enrich programs with destination data
      const enrichedPrograms = await Promise.all(
        programsData.map(async (program) => {
          let location = "International";
          
          if (program.destination_id) {
            // Fetch destination for this program
            const { data: destinationData, error: destinationError } = await supabase
              .from("destinations")
              .select("country_name")
              .eq("destination_id", program.destination_id)
              .maybeSingle();
            
            if (!destinationError && destinationData) {
              location = destinationData.country_name;
            }
          }
          
          return {
            id: program.program_id,
            name: program.program_name,
            description: program.description || "",
            location: location,
            duration: program.duration || "Varies",
            fee: program.fee ? `$${program.fee}` : "Contact for details",
            requirements: program.requirements || "",
          };
        })
      );
      
      return enrichedPrograms;
    },
  });

  // Fetch services
  const servicesQuery = useQuery({
    queryKey: ["landingServices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .limit(6);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data.map(service => ({
        id: service.service_id,
        name: service.service_name,
        description: service.description || "",
        duration: service.estimated_duration || "Varies",
        fee: service.fee ? `$${service.fee}` : "Contact for details",
      }));
    },
  });

  return {
    destinations: {
      data: destinationsQuery.data || [],
      isLoading: destinationsQuery.isLoading,
      error: destinationsQuery.error,
    },
    programs: {
      data: programsQuery.data || [],
      isLoading: programsQuery.isLoading,
      error: programsQuery.error,
    },
    services: {
      data: servicesQuery.data || [],
      isLoading: servicesQuery.isLoading,
      error: servicesQuery.error,
    },
  };
};
