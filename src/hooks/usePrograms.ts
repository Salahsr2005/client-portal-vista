
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
        .order("program_name", { ascending: true });
      
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
            university: program.program_name.includes("University") ? program.program_name.split(" ")[0] : "University",
            location: location,
            type: program.description?.includes("Masters") ? "Masters" : "Degree",
            duration: program.duration || "Unknown",
            tuition: program.fee ? `$${program.fee}` : "Contact for details",
            rating: 4.5,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            subjects: program.description ? [program.description.split(' ')[0]] : ["General"],
            applicationFee: "$125",
            featured: program.is_active,
            requirements: program.requirements || "",
            description: program.description || ""
          };
        })
      );
      
      return enrichedPrograms;
    },
  });
};
