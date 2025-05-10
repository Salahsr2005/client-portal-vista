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
  limit?: number;
}

export const usePrograms = (filter?: ProgramFilter) => {
  const { user } = useAuth();
  const queryKey = ['programs', filter];
  
  // Function to check if a program deadline has passed
  const isPastDeadline = (deadline: string): boolean => {
    if (!deadline) return false;
    
    // Try to parse various deadline formats
    let deadlineDate: Date | null = null;
    
    // First, try to parse it as a full ISO date
    if (deadline.includes('-') && deadline.includes(':')) {
      deadlineDate = new Date(deadline);
    } 
    // Try to parse it as YYYY-MM-DD
    else if (deadline.match(/^\d{4}-\d{2}-\d{2}$/)) {
      deadlineDate = new Date(deadline);
    }
    // Try to parse it as MM/DD/YYYY or DD/MM/YYYY
    else if (deadline.includes('/')) {
      const parts = deadline.split('/');
      if (parts.length === 3) {
        // Assume MM/DD/YYYY format
        deadlineDate = new Date(`${parts[2]}-${parts[0]}-${parts[1]}`);
        
        // If that didn't work, try DD/MM/YYYY
        if (isNaN(deadlineDate.getTime())) {
          deadlineDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      }
    }
    // Try to parse named months (e.g., "January 15, 2023")
    else if (deadline.match(/[a-zA-Z]+/)) {
      deadlineDate = new Date(deadline);
    }
    
    // If we couldn't parse the date, return false
    if (!deadlineDate || isNaN(deadlineDate.getTime())) {
      return false;
    }
    
    const currentDate = new Date();
    return deadlineDate < currentDate;
  };
  
  // Function to calculate match scores
  const calculateMatchScores = (programs: any[], filter?: ProgramFilter): Program[] => {
    if (!filter) return programs.map(mapToProgram);
    
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
      
      // Check if the deadline has passed
      const deadlinePassed = isPastDeadline(program.application_deadline);
      
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
        featured: program.featured || false,
        // Add deadline information
        deadlinePassed: deadlinePassed
      };
      
      return enhancedProgram;
    }).filter(Boolean) as Program[];  // Remove null entries (non-matching fields)
  };
  
  // Helper function to map raw program data to Program interface
  const mapToProgram = (p: any): Program => {
    const deadlinePassed = isPastDeadline(p.application_deadline);
    
    return {
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
      featured: p.featured || false,
      // Add deadline information
      deadlinePassed: deadlinePassed
    }
  };
  
  // The main query - fetch all programs
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        let query = supabase
          .from('programs')
          .select('*')
          .eq('status', 'Active');
        
        // Add filters if provided
        if (filter) {
          // Study level filter
          if (filter.studyLevel) {
            query = query.eq('study_level', filter.studyLevel);
          }
          
          // Location filter
          if (filter.location) {
            query = query.eq('country', filter.location);
          }
          
          // Language filter
          if (filter.language) {
            query = query.or(`program_language.eq.${filter.language},secondary_language.eq.${filter.language}`);
          }
          
          // Scholarship filter
          if (filter.scholarshipRequired) {
            query = query.eq('scholarship_available', true);
          }
          
          // Religious facilities filter
          if (filter.religiousFacilities) {
            query = query.eq('religious_facilities', true);
          }
          
          // Halal food filter
          if (filter.halalFood) {
            query = query.eq('halal_food_availability', true);
          }
        }
        
        // Don't limit the number of programs by default
        // Only apply limit if specifically requested
        if (filter?.limit) {
          query = query.limit(filter.limit);
        }
          
        const { data: programs, error } = await query;
          
        if (error) throw error;
        
        if (!programs) return [] as Program[];
        
        // Apply scoring and filtering
        if (filter) {
          const scoredPrograms = calculateMatchScores(programs, filter);
          
          // Sort by match score if available
          scoredPrograms.sort((a: Program, b: Program) => {
            if (a.matchScore !== undefined && b.matchScore !== undefined) {
              return b.matchScore - a.matchScore;
            }
            return 0;
          });
          
          return scoredPrograms;
        } else {
          // Map to Program type for consistency even without filters
          const mappedPrograms = programs.map(mapToProgram);
          
          return mappedPrograms;
        }
      } catch (error: any) {
        console.error('Error fetching programs:', error);
        return [] as Program[];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
