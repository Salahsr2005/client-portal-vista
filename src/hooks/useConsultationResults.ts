
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ConsultationPreferences {
  budget: number;
  studyLevel: 'Bachelor' | 'Master' | 'PhD' | 'Certificate' | 'Diploma';
  field: string;
  language: string;
  destination: string;
  duration: string;
  scholarshipRequired: boolean;
  religiousFacilities: boolean;
  halalFood: boolean;
  languageTestRequired: boolean;
  livingCosts: number;
}

export interface MatchedProgram {
  program_id: string;
  program_name: string;
  university: string;
  country: string;
  city: string;
  match_percentage: number;
  tuition_min: number;
  tuition_max: number;
  living_cost_min: number;
  living_cost_max: number;
  program_language: string;
  scholarship_available: boolean;
  religious_facilities: boolean;
  halal_food_availability: boolean;
}

export const useConsultationResults = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [matchedPrograms, setMatchedPrograms] = useState<MatchedProgram[]>([]);
  const { toast } = useToast();

  const findMatchingPrograms = useCallback(async (preferences: ConsultationPreferences) => {
    setIsLoading(true);
    try {
      // Query programs directly with filters
      let query = supabase
        .from('programs')
        .select(`
          id,
          name,
          university,
          country,
          city,
          tuition_min,
          tuition_max,
          living_cost_min,
          living_cost_max,
          program_language,
          scholarship_available,
          religious_facilities,
          halal_food_availability,
          study_level,
          field
        `)
        .eq('status', 'Active');

      // Apply filters based on preferences - fix the type comparison
      if (preferences.studyLevel && preferences.studyLevel !== '' as any) {
        query = query.eq('study_level', preferences.studyLevel);
      }

      if (preferences.field && preferences.field !== '' && preferences.field !== 'Any') {
        query = query.ilike('field', `%${preferences.field}%`);
      }

      if (preferences.language && preferences.language !== '' && preferences.language !== 'Any') {
        query = query.eq('program_language', preferences.language);
      }

      if (preferences.budget > 0) {
        query = query.lte('tuition_min', preferences.budget);
      }

      if (preferences.scholarshipRequired) {
        query = query.eq('scholarship_available', true);
      }

      if (preferences.religiousFacilities) {
        query = query.eq('religious_facilities', true);
      }

      if (preferences.halalFood) {
        query = query.eq('halal_food_availability', true);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;

      // Calculate match percentage and format data
      const formattedPrograms: MatchedProgram[] = (data || []).map((program: any) => {
        let matchScore = 0;
        let totalCriteria = 7;

        // Calculate match score based on preferences
        if (preferences.studyLevel === program.study_level) matchScore++;
        if (preferences.field && program.field && program.field.toLowerCase().includes(preferences.field.toLowerCase())) matchScore++;
        if (preferences.language === program.program_language) matchScore++;
        if (preferences.budget >= program.tuition_min) matchScore++;
        if (!preferences.scholarshipRequired || program.scholarship_available) matchScore++;
        if (!preferences.religiousFacilities || program.religious_facilities) matchScore++;
        if (!preferences.halalFood || program.halal_food_availability) matchScore++;

        const matchPercentage = Math.round((matchScore / totalCriteria) * 100);

        return {
          program_id: program.id,
          program_name: program.name,
          university: program.university,
          country: program.country,
          city: program.city,
          match_percentage: matchPercentage,
          tuition_min: program.tuition_min || 0,
          tuition_max: program.tuition_max || 0,
          living_cost_min: program.living_cost_min || 0,
          living_cost_max: program.living_cost_max || 0,
          program_language: program.program_language,
          scholarship_available: program.scholarship_available || false,
          religious_facilities: program.religious_facilities || false,
          halal_food_availability: program.halal_food_availability || false
        };
      });

      // Sort by match percentage
      formattedPrograms.sort((a, b) => b.match_percentage - a.match_percentage);
      
      setMatchedPrograms(formattedPrograms);
      return formattedPrograms;
    } catch (error) {
      console.error('Error finding matching programs:', error);
      toast({
        title: 'Error',
        description: 'Failed to find matching programs',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const saveConsultationResult = useCallback(async (
    preferences: ConsultationPreferences, 
    programs: MatchedProgram[]
  ) => {
    try {
      // Convert programs to plain JSON objects
      const programsData = programs.map(program => ({
        program_id: program.program_id,
        program_name: program.program_name,
        university: program.university,
        country: program.country,
        city: program.city,
        match_percentage: program.match_percentage,
        tuition_min: program.tuition_min,
        tuition_max: program.tuition_max,
        living_cost_min: program.living_cost_min,
        living_cost_max: program.living_cost_max,
        program_language: program.program_language,
        scholarship_available: program.scholarship_available,
        religious_facilities: program.religious_facilities,
        halal_food_availability: program.halal_food_availability
      }));

      const { error } = await supabase.from('consultation_results').insert({
        budget: preferences.budget,
        study_level: preferences.studyLevel,
        field_preference: preferences.field,
        language_preference: preferences.language,
        destination_preference: preferences.destination,
        duration_preference: preferences.duration,
        scholarship_required: preferences.scholarshipRequired,
        religious_facilities_required: preferences.religiousFacilities,
        halal_food_required: preferences.halalFood,
        language_test_required: preferences.languageTestRequired,
        living_costs_preference: preferences.livingCosts,
        matched_programs: programsData,
        match_percentage: programs.length > 0 ? programs[0].match_percentage : 0,
        step_completed: 4,
        conversion_status: 'Completed'
      });

      if (error) {
        console.error('Error saving consultation result:', error);
      }
    } catch (error) {
      console.error('Error saving consultation result:', error);
    }
  }, []);

  return {
    isLoading,
    matchedPrograms,
    findMatchingPrograms,
    saveConsultationResult
  };
};
