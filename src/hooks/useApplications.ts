
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useApplications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["applications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) {
        return [];
      }

      const { data: applicationsData, error: applicationsError } = await supabase
        .from("applications")
        .select("*")
        .eq("client_id", user.id);
      
      if (applicationsError) {
        console.error("Error fetching applications:", applicationsError);
        throw new Error(applicationsError.message);
      }
      
      // Enrich applications with program data
      const enrichedApplications = await Promise.all(
        (applicationsData || []).map(async (application) => {
          let programName = "Unknown Program";
          let destination = "Unknown";
          
          if (application.program_id) {
            // Fetch program data
            const { data: programData, error: programError } = await supabase
              .from("programs")
              .select("program_name, destination_id")
              .eq("program_id", application.program_id)
              .maybeSingle();
            
            if (!programError && programData) {
              programName = programData.program_name;
              
              // If there's a destination ID, fetch the destination
              if (programData.destination_id) {
                const { data: destinationData, error: destinationError } = await supabase
                  .from("destinations")
                  .select("country_name")
                  .eq("destination_id", programData.destination_id)
                  .maybeSingle();
                
                if (!destinationError && destinationData) {
                  destination = destinationData.country_name;
                }
              }
            }
          }
          
          return {
            id: application.app_id,
            program: programName,
            destination: destination,
            status: application.status || "Draft",
            date: new Date(application.application_date).toLocaleDateString(),
            lastUpdated: new Date(application.last_updated).toLocaleDateString(),
          };
        })
      );
      
      return enrichedApplications;
    },
  });
};
