
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePrograms = () => {
  return useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      // First, get all programs
      const { data: programsData, error: programsError } = await supabase
        .from("programs")
        .select("*")
        .order("name", { ascending: true });
      
      if (programsError) {
        throw new Error(programsError.message);
      }
      
      // Get the results with destination information
      const enrichedPrograms = await Promise.all(
        programsData.map(async (program) => {
          let location = "Unknown";
          
          if (program.destination_id) {
            // Fetch destination for this program separately
            const { data: destinationData, error: destinationError } = await supabase
              .from("destinations")
              .select("country")
              .eq("destination_id", program.destination_id)
              .maybeSingle();
            
            if (!destinationError && destinationData) {
              location = destinationData.country;
            }
          }
          
          return {
            id: program.program_id,
            name: program.name,
            university: program.university || "University",
            location: location,
            type: program.level ? String(program.level) : "Degree",
            duration: program.start_date || "Unknown",
            tuition: program.tuition ? `$${program.tuition}` : "Contact for details",
            rating: 4.5,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            subjects: program.requirements ? [program.requirements.split(' ')[0]] : ["General"],
            applicationFee: "$125",
            featured: program.status === "Active",
            requirements: program.requirements || "",
            description: program.requirements || ""
          };
        })
      );
      
      return enrichedPrograms;
    },
  });
};
