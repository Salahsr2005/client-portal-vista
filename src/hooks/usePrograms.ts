
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
  studyLevel?: string;
  subjects?: string[];
  location?: string;
  duration?: string;
  budget?: string;
  startDate?: string;
  scholarshipRequired?: boolean;
  religiousFacilities?: boolean;
  halalFood?: boolean;
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
        
        // Transform programs and calculate match scores if filters exist
        const programs = programsData.map(program => {
          const transformed: ProgramWithMatchScore = {
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
            image_url: program.image_url || "/placeholder.svg",
            // Include all original fields from the database
            ...program
          };
          
          // Calculate match score if filters are provided
          if (filters) {
            const matchDetails = calculateMatchScore(program, filters);
            transformed.matchScore = matchDetails.totalScore;
            transformed.matchDetails = {
              budgetMatch: matchDetails.budgetScore,
              languageMatch: matchDetails.languageScore,
              levelMatch: matchDetails.levelScore,
              locationMatch: matchDetails.locationScore,
              durationMatch: matchDetails.durationScore,
              fieldMatch: matchDetails.fieldScore,
              culturalMatch: matchDetails.culturalScore
            };
          }
          
          return transformed;
        });

        // If filters are provided, sort by match score
        if (filters) {
          programs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
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

// Function to calculate match score based on user preferences
function calculateMatchScore(program: any, filters: ProgramFilter) {
  let budgetScore = 0;
  let languageScore = 0;
  let levelScore = 0;
  let locationScore = 0;
  let durationScore = 0;
  let fieldScore = 0;
  let culturalScore = 0;
  
  // Budget match (max 30 points)
  if (filters.budget) {
    const userBudget = parseInt(filters.budget);
    const programCost = (program.tuition_min || 0) + ((program.living_cost_min || 0) * 12);
    
    if (userBudget >= programCost) {
      budgetScore = 30; // Full budget coverage
    } else if (userBudget >= programCost * 0.8) {
      budgetScore = 20; // 80% budget coverage
    } else if (userBudget >= programCost * 0.6) {
      budgetScore = 10; // 60% budget coverage
    } else {
      budgetScore = 5; // Less than 60% coverage
    }
  } else {
    budgetScore = 15; // Neutral score if no budget specified
  }
  
  // Study level match (max 25 points)
  if (filters.studyLevel) {
    if (program.study_level?.toLowerCase() === filters.studyLevel.toLowerCase()) {
      levelScore = 25; // Perfect match
    } else {
      levelScore = 5; // Different level
    }
  } else {
    levelScore = 15; // Neutral score if no level specified
  }
  
  // Location match (max 15 points)
  if (filters.location) {
    if (program.country?.toLowerCase() === filters.location.toLowerCase() ||
        program.city?.toLowerCase() === filters.location.toLowerCase()) {
      locationScore = 15; // Perfect match
    } else if (filters.location === "any") {
      locationScore = 10; // User doesn't care
    } else if (filters.location === "europe" && 
              ["France", "Spain", "Belgium", "Germany", "Italy", "Portugal", "Netherlands"].includes(program.country)) {
      locationScore = 12; // European country match
    } else {
      locationScore = 5; // Different location
    }
  } else {
    locationScore = 10; // Neutral score if no location specified
  }
  
  // Duration match (max 10 points)
  if (filters.duration) {
    const targetDuration = parseInt(filters.duration);
    const programDuration = program.duration_months || 0;
    
    if (Math.abs(programDuration - targetDuration) <= 6) {
      durationScore = 10; // Within 6 months of target
    } else if (Math.abs(programDuration - targetDuration) <= 12) {
      durationScore = 6; // Within a year of target
    } else {
      durationScore = 3; // More than a year off
    }
  } else {
    durationScore = 5; // Neutral score if no duration specified
  }
  
  // Field/subject match (max 15 points)
  if (filters.subjects && filters.subjects.length > 0) {
    let hasMatch = false;
    
    // Check if any subject matches field keywords
    if (program.field_keywords && Array.isArray(program.field_keywords)) {
      for (const subject of filters.subjects) {
        for (const keyword of program.field_keywords) {
          if (keyword.toLowerCase().includes(subject.toLowerCase())) {
            hasMatch = true;
            break;
          }
        }
        if (hasMatch) break;
      }
    }
    
    // Check program name and description as fallback
    if (!hasMatch) {
      for (const subject of filters.subjects) {
        if (program.name?.toLowerCase().includes(subject.toLowerCase()) || 
            program.description?.toLowerCase().includes(subject.toLowerCase()) ||
            program.field?.toLowerCase().includes(subject.toLowerCase())) {
          hasMatch = true;
          break;
        }
      }
    }
    
    fieldScore = hasMatch ? 15 : 5;
  } else {
    fieldScore = 8; // Neutral score if no subjects specified
  }
  
  // Cultural accommodations match (max 5 points)
  if ((filters.religiousFacilities && program.religious_facilities) || 
      (filters.halalFood && program.halal_food_availability)) {
    culturalScore = 5; // Perfect match
  } else if ((filters.religiousFacilities || filters.halalFood) && 
            (program.north_african_community_size === 'Large' || program.north_african_community_size === 'Medium')) {
    culturalScore = 3; // Community support but no specific facilities
  } else if (!filters.religiousFacilities && !filters.halalFood) {
    culturalScore = 5; // User doesn't care
  } else {
    culturalScore = 0; // No match
  }
  
  // Calculate total score (max 100)
  const totalScore = budgetScore + levelScore + locationScore + durationScore + fieldScore + culturalScore;
  
  // Convert to percentage
  const percentageScore = Math.round((totalScore / 100) * 100);
  
  return {
    totalScore: percentageScore,
    budgetScore,
    languageScore,
    levelScore,
    locationScore,
    durationScore,
    fieldScore,
    culturalScore
  };
}
