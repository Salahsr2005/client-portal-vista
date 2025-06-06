
import { supabase } from "@/integrations/supabase/client";
import { calculateMatchScore, getCountryFlagUrl } from './ProgramMatchingService';
import { Program } from '@/hooks/usePrograms';

export class ProgramDataProcessor {
  static async getFavorites(userId: string): Promise<string[]> {
    const { data: favoritesData } = await supabase
      .from('favorite_programs')
      .select('program_id')
      .eq('user_id', userId);
    
    return favoritesData ? favoritesData.map((fav) => fav.program_id) : [];
  }

  static processProgram(program: any, favorites: string[], preferences?: any, calculateMatchScores?: boolean): Program {
    // Check if application deadline has passed
    let deadlinePassed = false;
    if (program.application_deadline) {
      const deadlineDate = new Date(program.application_deadline);
      deadlinePassed = deadlineDate < new Date();
    }
    
    // Calculate match score if preferences are provided
    let matchScore = preferences && calculateMatchScores 
      ? calculateMatchScore(program, preferences) 
      : undefined;
    
    // Get country flag if image is missing
    const imageUrl = program.image_url || getCountryFlagUrl(program.country);
    
    return {
      ...program,
      isFavorite: favorites.includes(program.id),
      location: `${program.city}, ${program.country}`,
      duration: program.duration_months ? `${program.duration_months} months` : 'Not specified',
      deadlinePassed,
      hasScholarship: program.scholarship_available,
      hasReligiousFacilities: program.religious_facilities,
      hasHalalFood: program.halal_food_availability,
      matchScore,
      image_url: imageUrl,
      bgColorClass: program.status === 'Active' ? 'bg-green-100 dark:bg-green-900/10' : 
                   program.status === 'Inactive' || program.status === 'Full' ? 'bg-red-100 dark:bg-red-900/10' : 
                   'bg-amber-100 dark:bg-amber-900/10'
    };
  }

  static sortPrograms(programs: Program[], calculateMatchScores: boolean, preferences?: any): Program[] {
    return calculateMatchScores && preferences
      ? programs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      : programs;
  }
}
