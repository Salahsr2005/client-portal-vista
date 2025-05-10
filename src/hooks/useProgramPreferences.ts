
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProgramPreference {
  id?: string;
  userId: string;
  studyLevel?: string;
  language?: string;
  budget?: number;
  subjects?: string[];
  religiousFacilities?: boolean;
  halalFood?: boolean;
  scholarshipRequired?: boolean;
  languageTestRequired?: boolean;
  destinations?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const useProgramPreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['programPreferences', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Instead of querying a non-existent table, let's use consultation_results
      // which exists in the schema and contains similar data
      const { data, error } = await supabase
        .from('consultation_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching program preferences:", error);
        return null;
      }
      
      // If we find data, return it in our expected format
      if (data) {
        return {
          id: data.id,
          userId: data.user_id,
          studyLevel: data.study_level || undefined,
          language: data.language_preference || undefined,
          budget: data.budget,
          subjects: data.field_keywords || [],
          religiousFacilities: data.religious_facilities_required || false,
          halalFood: data.halal_food_required || false,
          scholarshipRequired: data.scholarship_required || false,
          destinations: data.destination_preference ? [data.destination_preference] : [],
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
      
      return null;
    },
    enabled: !!user,
  });
  
  const mutation = useMutation({
    mutationFn: async (preferences: ProgramPreference) => {
      if (!user) throw new Error('User not authenticated');
      
      // Format for consultation_results table
      const formattedData = {
        user_id: user.id,
        study_level: preferences.studyLevel,
        language_preference: preferences.language,
        budget: preferences.budget || 0,
        field_keywords: preferences.subjects || [],
        destination_preference: preferences.destinations?.[0] || null,
        religious_facilities_required: preferences.religiousFacilities || false,
        halal_food_required: preferences.halalFood || false,
        scholarship_required: preferences.scholarshipRequired || false,
      };
      
      const { data, error } = await supabase
        .from('consultation_results')
        .upsert(formattedData)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programPreferences', user?.id] });
    },
  });
  
  return {
    preferences: query.data,
    isLoading: query.isLoading,
    error: query.error,
    savePreferences: mutation.mutate,
    isSaving: mutation.isPending,
  };
};
