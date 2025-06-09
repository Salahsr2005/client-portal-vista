
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ConsultationPreferences {
  budget: number;
  studyLevel: string;
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
      const { data, error } = await supabase.rpc('get_matched_programs', {
        p_study_level: preferences.studyLevel,
        p_field: preferences.field,
        p_language: preferences.language,
        p_budget: preferences.budget,
        p_living_costs: preferences.livingCosts,
        p_language_test_required: preferences.languageTestRequired,
        p_religious_facilities: preferences.religiousFacilities,
        p_halal_food: preferences.halalFood,
        p_scholarship_required: preferences.scholarshipRequired,
        p_limit: 10
      });

      if (error) throw error;

      const formattedPrograms: MatchedProgram[] = data?.map((program: any) => ({
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
      })) || [];

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
        matched_programs: programs,
        match_percentage: programs.length > 0 ? programs[0].match_percentage : 0,
        step_completed: 4,
        conversion_status: 'Completed'
      });

      if (error) throw error;
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
