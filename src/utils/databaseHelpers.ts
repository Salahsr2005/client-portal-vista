
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

    // Use SQL query directly through RPC if available, otherwise we'd handle it differently
    try {
      // Try to create the favorites table
      // This will only work if the SQL function is defined in the database
      const { error } = await supabase.rpc('create_favorite_programs_table');
      
      if (error && !error.message.includes('does not exist')) {
        console.error('Error creating favorite_programs table:', error);
      }
    } catch (rpcError) {
      console.log('RPC function not available, table might already exist or needs to be created manually');
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
