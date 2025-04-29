
-- Function to create favorite_programs table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_favorite_programs_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.favorite_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, program_id)
  );

  -- Add RLS policies
  ALTER TABLE public.favorite_programs ENABLE ROW LEVEL SECURITY;
  
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorite_programs;
  DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.favorite_programs;
  DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorite_programs;

  -- Create policies
  CREATE POLICY "Users can view their own favorites"
    ON public.favorite_programs
    FOR SELECT
    USING (user_id = auth.uid());
    
  CREATE POLICY "Users can insert their own favorites"
    ON public.favorite_programs
    FOR INSERT
    WITH CHECK (user_id = auth.uid());
    
  CREATE POLICY "Users can delete their own favorites"
    ON public.favorite_programs
    FOR DELETE
    USING (user_id = auth.uid());
END;
$$;

-- Execute the function to ensure the table exists
SELECT create_favorite_programs_table();
