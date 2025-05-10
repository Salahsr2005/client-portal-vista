
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalStorage } from './useLocalStorage';

export interface ProgramPreferences {
  studyLevel: string;
  language: string;
  budget: number;
  subjects: string[];
  religiousFacilities?: boolean;
  halalFood?: boolean;
  scholarshipRequired?: boolean;
  languageTestRequired?: boolean;
}

export const useProgramPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<ProgramPreferences>({
    studyLevel: "Undergraduate",
    language: "English",
    budget: 20000,
    subjects: ["Business"],
    religiousFacilities: false,
    halalFood: false,
    scholarshipRequired: false,
    languageTestRequired: false
  });
  const [loading, setLoading] = useState(true);
  
  // Use local storage as a fallback for non-authenticated users
  const [localPreferences, setLocalPreferences] = useLocalStorage<ProgramPreferences>("program_preferences", {
    studyLevel: "Undergraduate",
    language: "English",
    budget: 20000,
    subjects: ["Business"],
    religiousFacilities: false,
    halalFood: false,
    scholarshipRequired: false,
    languageTestRequired: false
  });
  
  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      // Use local preferences for non-authenticated users
      setPreferences(localPreferences);
      setLoading(false);
    }
  }, [user]);
  
  const fetchPreferences = async () => {
    try {
      setLoading(true);
      
      // First check if the user has a profile
      const { data, error } = await supabase
        .from('client_profiles')
        .select('profile_id, current_address, education_background, language_proficiency')
        .eq('client_id', user?.id)
        .maybeSingle();
        
      if (error) throw error;
      
      // Get user preferences from a separate table
      const { data: prefData, error: prefError } = await supabase
        .from('user_program_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (prefError && prefError.code !== 'PGRST116') throw prefError;
      
      if (prefData) {
        // Use the stored preferences
        setPreferences({
          studyLevel: prefData.study_level || preferences.studyLevel,
          language: prefData.language || preferences.language,
          budget: prefData.budget || preferences.budget,
          subjects: prefData.subjects || preferences.subjects,
          religiousFacilities: prefData.religious_facilities || preferences.religiousFacilities,
          halalFood: prefData.halal_food || preferences.halalFood,
          scholarshipRequired: prefData.scholarship_required || preferences.scholarshipRequired,
          languageTestRequired: prefData.language_test_required || preferences.languageTestRequired
        });
      }
      
      // If no profile exists, create one
      if (!data?.profile_id) {
        await supabase
          .from('client_profiles')
          .insert({
            client_id: user?.id,
          });
      }
    } catch (error) {
      console.error('Error fetching program preferences:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const savePreferences = async (newPreferences: ProgramPreferences) => {
    try {
      setLoading(true);
      
      // Save to local storage regardless of authentication status
      setLocalPreferences(newPreferences);
      
      if (!user) {
        setPreferences(newPreferences);
        return { success: true };
      }
      
      // Check if preferences exists
      const { data: existingPref } = await supabase
        .from('user_program_preferences')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existingPref) {
        // Update existing preferences
        const { error } = await supabase
          .from('user_program_preferences')
          .update({
            study_level: newPreferences.studyLevel,
            language: newPreferences.language,
            budget: newPreferences.budget,
            subjects: newPreferences.subjects,
            religious_facilities: newPreferences.religiousFacilities,
            halal_food: newPreferences.halalFood,
            scholarship_required: newPreferences.scholarshipRequired,
            language_test_required: newPreferences.languageTestRequired,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else {
        // Create new preferences
        const { error } = await supabase
          .from('user_program_preferences')
          .insert({
            user_id: user.id,
            study_level: newPreferences.studyLevel,
            language: newPreferences.language,
            budget: newPreferences.budget,
            subjects: newPreferences.subjects,
            religious_facilities: newPreferences.religiousFacilities,
            halal_food: newPreferences.halalFood,
            scholarship_required: newPreferences.scholarshipRequired,
            language_test_required: newPreferences.languageTestRequired
          });
          
        if (error) throw error;
      }
      
      setPreferences(newPreferences);
      return { success: true };
    } catch (error: any) {
      console.error('Error saving program preferences:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  const updatePreference = (field: keyof ProgramPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return {
    preferences,
    loading,
    savePreferences,
    updatePreference,
    setPreferences,
  };
};

export default useProgramPreferences;
