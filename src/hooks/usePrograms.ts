
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePrograms = () => {
  return useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*, destinations(country_name)");
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data.map(program => ({
        id: program.program_id,
        name: program.program_name,
        university: "University", // This field seems to be missing in your schema
        location: program.destinations?.country_name || "Unknown",
        type: "Masters", // This field seems to be missing in your schema
        duration: program.duration || "Unknown",
        tuition: program.fee ? `$${program.fee}` : "Contact for details",
        rating: 4.5, // This field seems to be missing in your schema
        deadline: new Date().toISOString().split('T')[0], // This field seems to be missing in your schema
        subjects: program.description ? [program.description.split(' ')[0]] : ["General"], // This field seems to be missing in your schema
        applicationFee: "$125", // This field seems to be missing in your schema
        featured: program.is_active
      }));
    },
  });
};
