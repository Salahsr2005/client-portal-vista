
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProgramPreference {
  user_id: string;
  study_level: "Bachelor" | "Master" | "PhD" | "Certificate" | "Diploma";
  language_preference: string;
  budget: number;
  field_keywords: string[];
  destination_preference: string;
  religious_facilities_required: boolean;
  halal_food_required: boolean;
  scholarship_required: boolean;
}

export const useProgramPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Query to fetch user's program preferences
  const preferencesQuery = useQuery({
    queryKey: ['programPreferences', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('consultation_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        // If no record found, return null instead of throwing an error
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      
      return data;
    },
    enabled: !!user,
  });
  
  // Mutation to save/update preferences
  const saveMutation = useMutation({
    mutationFn: async (preferences: Partial<ProgramPreference>) => {
      if (!user) throw new Error('User not authenticated');
      
      // Check if user already has preferences
      const { data: existingData } = await supabase
        .from('consultation_results')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (existingData) {
        // Update existing preferences
        const { data, error } = await supabase
          .from('consultation_results')
          .update({
            study_level: preferences.study_level,
            language_preference: preferences.language_preference,
            budget: preferences.budget,
            field_keywords: preferences.field_keywords,
            destination_preference: preferences.destination_preference,
            religious_facilities_required: preferences.religious_facilities_required,
            halal_food_required: preferences.halal_food_required,
            scholarship_required: preferences.scholarship_required,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingData.id);
          
        if (error) throw error;
        return data;
      } else {
        // Create new preferences
        const { data, error } = await supabase
          .from('consultation_results')
          .insert({
            user_id: user.id,
            study_level: preferences.study_level,
            language_preference: preferences.language_preference,
            budget: preferences.budget,
            field_keywords: preferences.field_keywords,
            destination_preference: preferences.destination_preference,
            religious_facilities_required: preferences.religious_facilities_required,
            halal_food_required: preferences.halal_food_required,
            scholarship_required: preferences.scholarship_required,
          });
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      toast({
        title: "Preferences saved",
        description: "Your program preferences have been updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error saving preferences",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });
  
  return {
    preferences: preferencesQuery.data,
    isLoading: preferencesQuery.isLoading,
    isError: preferencesQuery.isError,
    savePreferences: saveMutation.mutate,
    isSaving: saveMutation.isPending,
  };
};
