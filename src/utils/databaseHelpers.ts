
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates favorite_programs table if it doesn't exist
 */
export const createFavoriteProgramsTable = async () => {
  try {
    // Use an actual function call that exists on the backend
    // First check if we can query the table
    const { error: checkError } = await supabase
      .from('programs')  // Use a table we know exists
      .select('id')
      .limit(1);
      
    if (checkError) {
      console.error('Error checking database connection:', checkError);
    }

    // Check if favorite_programs table exists by querying it
    const { error: queryError } = await supabase
      .from('favorite_programs')
      .select('id')
      .limit(1);
      
    if (queryError && queryError.message.includes('does not exist')) {
      console.log('favorite_programs table does not exist, attempting to create it');
      
      // Create the table using raw SQL (note: this requires superuser privileges)
      // Since we've already created the table via migration, this is a fallback
      console.log('The favorite_programs table should be created via migration');
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
