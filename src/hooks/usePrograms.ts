
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePrograms = (programId?: string) => {
  return useQuery({
    queryKey: programId ? ["programs", programId] : ["programs"],
    queryFn: async () => {
      if (programId) {
        // Fetch a single program by ID
        const { data: programData, error: programError } = await supabase
          .from("programs")
          .select("*")
          .eq("id", programId)
          .single();
      
        if (programError) {
          throw new Error(programError.message);
        }
        
        // Return the enriched program
        return {
          id: programData.id,
          name: programData.name,
          university: programData.university || "University",
          location: programData.country || "International",
          type: programData.study_level ? String(programData.study_level) : "Degree",
          duration: programData.duration_months ? `${programData.duration_months} months` : "Unknown",
          tuition: programData.tuition_min ? `$${programData.tuition_min}` : "Contact for details",
          rating: 4.5, // Placeholder rating
          deadline: programData.application_deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          subjects: programData.field_keywords || ["General"],
          applicationFee: programData.application_fee ? `$${programData.application_fee}` : "$125",
          featured: programData.status === "Active",
          requirements: programData.admission_requirements || "",
          description: programData.description || programData.admission_requirements || "",
          // Pass through all original data
          ...programData
        };
      }
      
      // Get all programs
      const { data: programsData, error: programsError } = await supabase
        .from("programs")
        .select("*")
        .order("name", { ascending: true });
      
      if (programsError) {
        throw new Error(programsError.message);
      }
      
      // Return the enriched programs
      return programsData.map(program => ({
        id: program.id,
        name: program.name,
        university: program.university || "University",
        city: program.city || "",
        country: program.country || "",
        location: program.country || "International",
        type: program.study_level ? String(program.study_level) : "Degree",
        duration: program.duration_months ? `${program.duration_months} months` : "Unknown",
        tuition: program.tuition_min ? `$${program.tuition_min}` : "Contact for details",
        rating: 4.5, // Placeholder rating
        deadline: program.application_deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        subjects: program.field_keywords || ["General"],
        applicationFee: program.application_fee ? `$${program.application_fee}` : "$125",
        featured: program.status === "Active",
        requirements: program.admission_requirements || "",
        description: program.description || program.admission_requirements || "",
        image_url: program.image_url || null,
        // Pass through all original data
        ...program
      }));
    },
  });
};

export const useProgramById = (programId: string) => {
  return useQuery({
    queryKey: ["programs", programId],
    enabled: !!programId,
    queryFn: async () => {
      const { data: program, error } = await supabase
        .from("programs")
        .select("*")
        .eq("id", programId)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }

      // Return enriched program
      return {
        ...program,
        formattedTuition: program.tuition_min ? `$${program.tuition_min}` : "Contact for details",
        formattedDuration: program.duration_months ? `${program.duration_months} months` : "Unknown",
        rating: 4.5, // Placeholder rating
        subjects: program.field_keywords || ["General"],
        featured: program.status === "Active"
      };
    },
  });
};
