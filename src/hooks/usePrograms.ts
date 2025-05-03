import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { calculateProgramMatch } from '@/services/ProgramMatchingService';

export interface ProgramFilter {
  studyLevel?: string;
  subjects?: string[];
  location?: string;
  duration?: string;
  budget?: string;
  language?: string;
  scholarshipRequired?: boolean;
  religiousFacilities?: boolean;
  halalFood?: boolean;
  languageTestRequired?: boolean;
}

export const usePrograms = (filter?: ProgramFilter) => {
  const { user } = useAuth();
  const queryKey = ['programs', filter];
  
  // Function to calculate match scores
  const calculateMatchScores = (programs: any[], filter?: ProgramFilter) => {
    if (!filter) return programs;
    
    return programs.map(program => {
      // First filter by field of study - if no match, don't include it
      if (filter.subjects && filter.subjects.length > 0) {
        const programField = program.field?.toLowerCase();
        const fieldMatches = filter.subjects.some(subject => 
          subject.toLowerCase().includes(programField) || 
          programField?.includes(subject.toLowerCase())
        );
        
        if (!fieldMatches) return null;
      }
      
      // Calculate match score for programs that passed the field filter
      const matchResult = calculateProgramMatch(program, filter);
      return {
        ...program,
        matchScore: matchResult.score,
        matchDetails: matchResult.details
      };
    }).filter(Boolean);  // Remove null entries (non-matching fields)
  };
  
  // The main query
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        let { data: programs, error } = await supabase
          .from('programs')
          .select('*')
          .eq('status', 'Active');
          
        if (error) throw error;
        
        if (!programs) return [];
        
        // Apply scoring and filtering
        if (filter) {
          programs = calculateMatchScores(programs, filter);
          
          // Sort by match score if available
          programs.sort((a, b) => {
            if (a.matchScore && b.matchScore) {
              return b.matchScore - a.matchScore;
            }
            return 0;
          });
        }
        
        return programs;
      } catch (error: any) {
        console.error('Error fetching programs:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
