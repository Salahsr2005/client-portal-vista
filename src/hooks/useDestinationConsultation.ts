import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useDestinations } from '@/hooks/useDestinations';
import { 
  DestinationMatchingService, 
  DestinationConsultationPreferences, 
  MatchedDestination 
} from '@/services/DestinationMatchingService';

export interface ConsultationStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export const useDestinationConsultation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: destinations, isLoading: destinationsLoading } = useDestinations();

  const [consultationData, setConsultationData] = useState<Partial<DestinationConsultationPreferences>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [matchedDestinations, setMatchedDestinations] = useState<MatchedDestination[]>([]);

  // Find matching destinations
  const findMatches = async (preferences: DestinationConsultationPreferences): Promise<MatchedDestination[]> => {
    if (!destinations || destinations.length === 0) {
      throw new Error('No destinations available');
    }

    const matches = DestinationMatchingService.findMatchingDestinations(
      destinations,
      preferences,
      10
    );

    setMatchedDestinations(matches);
    return matches;
  };

  // Save consultation result
  const saveConsultationMutation = useMutation({
    mutationFn: async (data: {
      preferences: DestinationConsultationPreferences;
      matches: MatchedDestination[];
    }) => {
      if (!user) throw new Error('User not authenticated');

      const consultationResult = {
        user_id: user.id,
        study_level: data.preferences.studyLevel,
        budget: data.preferences.budget,
        language_preference: data.preferences.language,
        language_test_required: data.preferences.languageTestRequired,
        language_test_score: data.preferences.languageTestScore,
        destination_preference: 'Any', // Will be refined based on matches
        field_preference: 'Any', // Not used for destinations
        living_costs_preference: Math.round(data.preferences.budget * 0.3),
        religious_facilities_required: data.preferences.religiousFacilities || false,
        halal_food_required: data.preferences.halalFood || false,
        scholarship_required: false, // Not applicable for destinations
        work_while_studying: data.preferences.workWhileStudying || false,
        accommodation_preference: data.preferences.accommodationPreference || 'Flexible',
        matched_programs: data.matches.map(match => ({
          destination_id: match.id,
          name: match.name,
          country: match.country,
          match_score: match.matchScore,
          match_reasons: match.matchReasons
        })),
        preferences_data: data.preferences as any,
        notes: `Destination consultation completed with ${data.matches.length} matches found.`,
        conversion_status: 'New',
        consultation_date: new Date().toISOString()
      };

      const { data: result, error } = await supabase
        .from('consultation_results')
        .insert(consultationResult)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Consultation Saved",
        description: "Your destination consultation has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['consultation-results'] });
    },
    onError: (error) => {
      console.error('Error saving consultation:', error);
      toast({
        title: "Error",
        description: "Failed to save consultation. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Get consultation history
  const { data: consultationHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['consultation-results', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('consultation_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const updateConsultationData = (updates: Partial<DestinationConsultationPreferences>) => {
    setConsultationData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const resetConsultation = () => {
    setConsultationData({});
    setCurrentStep(1);
    setMatchedDestinations([]);
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: // Study Level
        return !!consultationData.studyLevel;
      case 2: // Budget
        return !!consultationData.budget && consultationData.budget > 0;
      case 3: // Language
        return !!consultationData.language;
      case 4: // Intake & Academic Level
        return !!consultationData.intakePeriod && !!consultationData.academicLevel;
      case 5: // Additional Preferences (optional)
        return true;
      default:
        return false;
    }
  };

  const completeConsultation = async () => {
    if (!consultationData.studyLevel || !consultationData.budget || !consultationData.language || 
        !consultationData.intakePeriod || !consultationData.academicLevel) {
      throw new Error('Please complete all required fields');
    }

    const fullPreferences = consultationData as DestinationConsultationPreferences;
    const matches = await findMatches(fullPreferences);
    
    await saveConsultationMutation.mutateAsync({
      preferences: fullPreferences,
      matches
    });

    return matches;
  };

  return {
    // State
    consultationData,
    currentStep,
    matchedDestinations,
    
    // Loading states
    isLoading: destinationsLoading || saveConsultationMutation.isPending,
    historyLoading,
    
    // Data
    consultationHistory,
    destinations,
    
    // Actions
    updateConsultationData,
    nextStep,
    prevStep,
    resetConsultation,
    findMatches,
    completeConsultation,
    isStepValid,
    
    // Mutations
    saveConsultation: saveConsultationMutation.mutate,
    isSaving: saveConsultationMutation.isPending
  };
};