
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  
  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const fetchPreferences = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('client_profiles')
        .select('preferences')
        .eq('client_id', user?.id)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data?.preferences) {
        setPreferences({
          ...preferences, // Keep defaults for missing fields
          ...data.preferences // Override with stored preferences
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
      
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('client_profiles')
        .upsert({
          client_id: user.id,
          preferences: newPreferences,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
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
