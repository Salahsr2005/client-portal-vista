
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ProgramApplication {
  id: string;
  program: string;
  destination: string;
  status: string;
  date: string;
  lastUpdated: string;
}

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
        .select("*, programs(*)")
        .eq("client_id", user.id);
      
      if (applicationsError) {
        console.error("Error fetching applications:", applicationsError);
        throw new Error(applicationsError.message);
      }
      
      // Map applications data to the expected format
      return (applicationsData || []).map(application => ({
        id: application.application_id,
        program: application.programs?.name || "Unknown Program",
        destination: application.programs?.country || "Unknown",
        status: application.status || "Draft",
        date: new Date(application.created_at).toLocaleDateString(),
        lastUpdated: new Date(application.updated_at).toLocaleDateString(),
      })) as ProgramApplication[];
    },
  });
};
