
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
      
      // First check if the user has preferences stored in their profile
      const { data, error } = await supabase
        .from('client_profiles')
        .select('profile_id, preferences')
        .eq('client_id', user?.id)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        // Create the profile entry if it doesn't exist
        if (!data.profile_id) {
          await supabase
            .from('client_profiles')
            .insert({
              client_id: user?.id,
              preferences: preferences
            });
        } else if (data.preferences) {
          // Use the stored preferences if available
          setPreferences({
            ...preferences, // Keep defaults for missing fields
            ...data.preferences // Override with stored preferences
          });
        }
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
      
      // Try to update an existing profile
      const { data: existingProfile } = await supabase
        .from('client_profiles')
        .select('profile_id')
        .eq('client_id', user.id)
        .maybeSingle();
      
      if (existingProfile) {
        const { error } = await supabase
          .from('client_profiles')
          .update({
            preferences: newPreferences,
            updated_at: new Date().toISOString()
          })
          .eq('client_id', user.id);
          
        if (error) throw error;
      } else {
        // Create a new profile if one doesn't exist
        const { error } = await supabase
          .from('client_profiles')
          .insert({
            client_id: user.id,
            preferences: newPreferences,
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
