
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

      try {
        const { data: applicationsData, error: applicationsError } = await supabase
          .from("applications")
          .select("*, programs(*)")
          .eq("client_id", user.id)
          .order('created_at', { ascending: false });
        
        if (applicationsError) {
          console.error("Error fetching applications:", applicationsError);
          throw new Error(applicationsError.message);
        }
        
        console.log("Applications data:", applicationsData);
        
        // Map applications data to the expected format
        return (applicationsData || []).map(application => ({
          id: application.application_id,
          program: application.programs?.name || "Unknown Program",
          destination: application.programs?.country || "Unknown",
          status: application.status || "Draft",
          date: new Date(application.created_at).toLocaleDateString(),
          lastUpdated: new Date(application.updated_at).toLocaleDateString(),
        })) as ProgramApplication[];
      } catch (error) {
        console.error("Error in applications query:", error);
        return [];
      }
    },
  });
};

export const useApplicationDetails = (applicationId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["application", applicationId],
    enabled: !!user && !!applicationId,
    queryFn: async () => {
      if (!user || !applicationId) {
        return null;
      }

      try {
        // Fetch application data
        const { data: application, error: applicationError } = await supabase
          .from("applications")
          .select(`
            *,
            programs(*),
            application_timeline(*)
          `)
          .eq("application_id", applicationId)
          .eq("client_id", user.id)
          .single();

        if (applicationError) {
          throw applicationError;
        }

        // Fetch application documents if needed
        const { data: documents, error: documentsError } = await supabase
          .from("application_documents")
          .select("*")
          .eq("application_id", applicationId);

        if (documentsError) {
          console.error("Error fetching application documents:", documentsError);
        }

        // Format the application data
        return {
          id: application.application_id,
          status: application.status,
          priority: application.priority,
          createdAt: new Date(application.created_at).toLocaleDateString(),
          updatedAt: new Date(application.updated_at).toLocaleDateString(),
          submittedAt: application.submitted_at ? new Date(application.submitted_at).toLocaleDateString() : null,
          notes: application.notes,
          program: {
            id: application.program_id,
            name: application.programs?.name || "Unknown Program",
            university: application.programs?.university || "Unknown University",
            location: application.programs?.country || "Unknown Location",
            type: application.programs?.study_level || "Unknown Level",
            duration: application.programs?.duration_months ? `${application.programs.duration_months} months` : "Not specified",
            tuition: application.programs?.tuition_min || 0,
            image: application.programs?.image_url || "/placeholder.svg"
          },
          paymentStatus: application.payment_status,
          timeline: (application.application_timeline || []).map(event => ({
            id: event.event_id,
            status: event.status,
            date: new Date(event.date).toLocaleDateString(),
            note: event.note
          })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          documents: documents || []
        };
      } catch (error) {
        console.error("Error fetching application details:", error);
        throw error;
      }
    }
  });
};
