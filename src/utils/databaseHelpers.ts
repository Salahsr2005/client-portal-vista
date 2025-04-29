
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates favorite_programs table if it doesn't exist
 */
export const createFavoriteProgramsTable = async () => {
  try {
    const { error } = await supabase.rpc('create_favorite_programs_table');
    
    if (error && !error.message.includes('function "create_favorite_programs_table" does not exist')) {
      console.error('Error creating favorite_programs table:', error);
    }
  } catch (err) {
    console.error('Error in createFavoriteProgramsTable:', err);
  }
};

/**
 * Handles errors from Supabase queries
 */
export const handleSupabaseError = (error: any, toast: any, customMessage?: string) => {
  console.error('Supabase error:', error);
  toast({
    title: "Error",
    description: customMessage || "An error occurred. Please try again.",
    variant: "destructive",
  });
};
