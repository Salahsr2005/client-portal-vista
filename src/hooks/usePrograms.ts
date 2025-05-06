
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { calculateProgramMatch } from '@/services/ProgramMatchingService';
import { Program } from '@/components/consultation/types';

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
      
      // Map database fields to our Program interface
      const enhancedProgram: Program = {
        ...program,
        matchScore: matchResult.score,
        matchDetails: matchResult.details,
        // Add compatibility fields
        location: program.city ? `${program.city}, ${program.country}` : program.country || 'Not specified',
        duration: program.duration_months ? `${program.duration_months} months` : 'Not specified',
        tuition: program.tuition_min || 0,
        type: program.study_level || 'Not specified',
        deadline: program.application_deadline || 'Not specified',
        // Map property names for compatibility
        hasScholarship: program.scholarship_available,
        hasReligiousFacilities: program.religious_facilities,
        hasHalalFood: program.halal_food_availability,
        // Keep original properties for backward compatibility
        scholarship_available: program.scholarship_available,
        religious_facilities: program.religious_facilities,
        halal_food_availability: program.halal_food_availability,
        // Ensure image_url is included
        image_url: program.image_url || '/placeholder.svg',
        featured: program.featured || false
      };
      
      return enhancedProgram;
    }).filter(Boolean) as Program[];  // Remove null entries (non-matching fields)
  };
  
  // The main query - fetch all programs
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        let { data: programs, error } = await supabase
          .from('programs')
          .select('*')
          .eq('status', 'Active');
          
        if (error) throw error;
        
        if (!programs) return [] as Program[];
        
        // Apply scoring and filtering
        if (filter) {
          programs = calculateMatchScores(programs, filter);
          
          // Sort by match score if available
          programs.sort((a: any, b: any) => {
            if (a.matchScore !== undefined && b.matchScore !== undefined) {
              return b.matchScore - a.matchScore;
            }
            return 0;
          });
        } else {
          // Map to Program type for consistency even without filters
          programs = programs.map((p: any): Program => ({
            ...p,
            location: p.city ? `${p.city}, ${p.country}` : p.country || 'Not specified',
            duration: p.duration_months ? `${p.duration_months} months` : 'Not specified',
            tuition: p.tuition_min || 0,
            type: p.study_level || 'Not specified',
            deadline: p.application_deadline || 'Not specified',
            // Map property names for compatibility
            hasScholarship: p.scholarship_available,
            hasReligiousFacilities: p.religious_facilities,
            hasHalalFood: p.halal_food_availability,
            // Keep original properties for backward compatibility
            scholarship_available: p.scholarship_available,
            religious_facilities: p.religious_facilities,
            halal_food_availability: p.halal_food_availability,
            // Ensure image_url is included
            image_url: p.image_url || '/placeholder.svg',
            featured: p.featured || false
          }));
        }
        
        return programs as Program[];
      } catch (error: any) {
        console.error('Error fetching programs:', error);
        return [] as Program[];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
