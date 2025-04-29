
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePrograms = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      try {
        // Get all active programs
        const { data: programsData, error: programsError } = await supabase
          .from("programs")
          .select("*")
          .eq("status", "Active")
          .order("name", { ascending: true });
        
        if (programsError) {
          console.error("Error fetching programs:", programsError);
          toast({
            title: "Error fetching programs",
            description: "There was a problem loading the programs. Please try again later.",
            variant: "destructive",
          });
          throw new Error(programsError.message);
        }
        
        if (!programsData || programsData.length === 0) {
          console.log("No programs found or empty result");
          return [];
        }
        
        // Return the enriched programs
        return programsData.map(program => ({
          id: program.id,
          name: program.name || "Unnamed Program",
          university: program.university || "University",
          location: program.country || "International",
          type: program.study_level ? String(program.study_level) : "Degree",
          duration: program.duration_months ? `${program.duration_months} months` : "Unknown",
          tuition: program.tuition_min ? `$${program.tuition_min.toLocaleString()}` : "Contact for details",
          rating: 4.5, // Placeholder rating
          deadline: program.application_deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          subjects: program.field_keywords || ["General"],
          applicationFee: program.application_fee ? `$${program.application_fee}` : "$125",
          featured: program.status === "Active",
          requirements: program.admission_requirements || "",
          description: program.description || program.admission_requirements || "",
          // Include all original fields from the database
          ...program
        }));
      } catch (error) {
        console.error("Error in usePrograms hook:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
