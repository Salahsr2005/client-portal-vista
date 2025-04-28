
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePrograms = () => {
  return useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      // Get all programs
      const { data: programsData, error: programsError } = await supabase
        .from("programs")
        .select("*")
        .eq("status", "Active")
        .order("name", { ascending: true });
      
      if (programsError) {
        console.error("Error fetching programs:", programsError);
        throw new Error(programsError.message);
      }
      
      if (!programsData) {
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
    },
  });
};
