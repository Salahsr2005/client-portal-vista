
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

    // Check if favorite_programs table already exists
    const { error: queryError } = await supabase
      .from('favorite_programs')
      .select('id')
      .limit(1);
      
    if (queryError && queryError.message.includes('does not exist')) {
      console.log('favorite_programs table does not exist, attempting to create it');
      // If the table doesn't exist, create it using SQL
      const { error: createError } = await supabase
        .rpc('execute_sql', {
          sql_query: `
            CREATE TABLE IF NOT EXISTS favorite_programs (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
              program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              UNIQUE(user_id, program_id)
            );
          `
        });
        
      if (createError) {
        console.error('Error creating favorite_programs table:', createError);
      } else {
        console.log('favorite_programs table created successfully');
      }
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
