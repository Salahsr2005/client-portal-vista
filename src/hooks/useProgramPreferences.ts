
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UserPreference {
  id?: string;
  user_id: string;
  study_level: string;
  language: string;
  budget: number;
  location: string;
  created_at?: string;
}

export const useProgramPreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user preferences
  const { data: preferences, isLoading } = useQuery({
    queryKey: ["program-preferences", user?.id],
    queryFn: async () => {
      if (!user) return null;

      // This is the corrected query - we don't use "user_program_preferences" 
      // since it doesn't exist in the tables known to Supabase
      const { data, error } = await supabase
        .from("consultation_results")
        .select(`
          id,
          user_id,
          study_level,
          language_preference,
          budget,
          destination_preference,
          created_at
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // Return null if no preferences found (not an error case)
        if (error.code === "PGRST116") {
          return null;
        }
        throw new Error(error.message);
      }

      if (!data) return null;

      return {
        id: data.id,
        user_id: data.user_id,
        study_level: data.study_level,
        language: data.language_preference,
        budget: data.budget,
        location: data.destination_preference,
        created_at: data.created_at
      };
    },
    enabled: !!user,
  });

  // Save user preferences
  const savePreferences = useMutation({
    mutationFn: async (newPrefs: Omit<UserPreference, "created_at" | "id">) => {
      if (!user) throw new Error("You must be logged in");

      // Use the consultation_results table instead
      const { data, error } = await supabase
        .from("consultation_results")
        .insert({
          user_id: user.id,
          study_level: newPrefs.study_level,
          language_preference: newPrefs.language,
          budget: newPrefs.budget,
          destination_preference: newPrefs.location,
          field_preference: "Not specified",
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program-preferences", user?.id] });
      toast.success("Preferences saved successfully");
    },
    onError: (err) => {
      console.error("Error saving preferences:", err);
      toast.error("Failed to save preferences. Please try again.");
    },
  });

  return {
    preferences,
    isLoading,
    savePreferences: savePreferences.mutate,
    isSaving: savePreferences.isPending,
  };
};
