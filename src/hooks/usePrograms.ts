
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePrograms = () => {
  return useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      // First, get all programs
      const { data: programsData, error: programsError } = await supabase
        .from("programs")
        .select("*");
      
      if (programsError) {
        throw new Error(programsError.message);
      }
      
      // Get the results with destination information
      const enrichedPrograms = await Promise.all(
        programsData.map(async (program) => {
          let destination = null;
          
          if (program.destination_id) {
            // Fetch destination for this program
            const { data: destinationData, error: destinationError } = await supabase
              .from("destinations")
              .select("country_name")
              .eq("destination_id", program.destination_id)
              .maybeSingle();
            
            if (!destinationError && destinationData) {
              destination = destinationData;
            }
          }
          
          return {
            id: program.program_id,
            name: program.program_name,
            university: "University", // This field seems to be missing in your schema
            location: destination?.country_name || "Unknown",
            type: "Masters", // This field seems to be missing in your schema
            duration: program.duration || "Unknown",
            tuition: program.fee ? `$${program.fee}` : "Contact for details",
            rating: 4.5, // This field seems to be missing in your schema
            deadline: new Date().toISOString().split('T')[0], // This field seems to be missing in your schema
            subjects: program.description ? [program.description.split(' ')[0]] : ["General"], // This field seems to be missing in your schema
            applicationFee: "$125", // This field seems to be missing in your schema
            featured: program.is_active
          };
        })
      );
      
      return enrichedPrograms;
    },
  });
};
