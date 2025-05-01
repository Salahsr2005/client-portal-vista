
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getMatchingPrograms, MatchedProgram } from "@/services/ProgramMatchingService";

export interface ProgramWithMatchScore extends Program {
  matchScore?: number;
  matchDetails?: {
    budgetMatch?: number;
    languageMatch?: number;
    levelMatch?: number;
    locationMatch?: number;
    durationMatch?: number;
    fieldMatch?: number;
    culturalMatch?: number;
    testRequirementsMatch?: number;
  };
}

export interface Program {
  id: string;
  name: string;
  university: string;
  location: string;
  type: string;
  duration: string;
  tuition: string;
  rating: number;
  deadline: string;
  subjects: string[];
  applicationFee: string;
  featured: boolean;
  requirements: string;
  description: string;
  image_url?: string;
  [key: string]: any;
}

export interface ProgramFilter {
  studyLevel?: "Bachelor" | "Master" | "PhD" | "Certificate" | "Diploma";
  subjects?: string[];
  location?: string;
  language?: string;
  duration?: string | "preparatory" | "full_degree";
  budget?: string;
  startDate?: string;
  scholarshipRequired?: boolean;
  religiousFacilities?: boolean;
  halalFood?: boolean;
  languageTestRequired?: boolean;
}

export const usePrograms = (filters?: ProgramFilter) => {
  const { toast } = useToast();
  const { user } = useAuth();

  return useQuery({
    queryKey: ["programs", filters],
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
        
        // Transform programs
        const programs: Program[] = programsData.map(program => {
          return {
            id: program.id,
            name: program.name || "Unnamed Program",
            university: program.university || "University",
            location: program.country || "International",
            type: program.study_level ? String(program.study_level) : "Degree",
            duration: program.duration_months ? `${program.duration_months} months` : "Unknown",
            tuition: program.tuition_min ? `€${program.tuition_min.toLocaleString()}` : "Contact for details",
            rating: 4.5, // Placeholder rating
            deadline: program.application_deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            subjects: program.field_keywords || ["General"],
            applicationFee: program.application_fee ? `€${program.application_fee}` : "€125",
            featured: program.status === "Active",
            requirements: program.admission_requirements || "",
            description: program.description || program.admission_requirements || "",
            image_url: program.image_url || "/placeholder.svg",
            // Include all original fields from the database
            ...program
          };
        });

        // If filters are provided, apply our advanced matching algorithm
        if (filters) {
          return getMatchingPrograms(programs, filters);
        }
        
        return programs;
      } catch (error) {
        console.error("Error in usePrograms hook:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Use this hook to fetch user's favorite programs
export const useFavoritePrograms = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  return useQuery({
    queryKey: ["favorite-programs", user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        const { data, error } = await supabase
          .from('favorite_programs')
          .select('program_id')
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error fetching favorite programs:', error);
          toast({
            title: "Error fetching favorites",
            description: "There was a problem loading your favorite programs.",
            variant: "destructive",
          });
          return [];
        }
        
        return data.map(item => item.program_id);
      } catch (err) {
        console.error('Error in useFavoritePrograms:', err);
        return [];
      }
    },
    enabled: !!user,
  });
};
