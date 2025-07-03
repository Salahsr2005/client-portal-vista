
-- Fix the RLS policy for destination_application_timeline to allow system inserts
DROP POLICY IF EXISTS "Users can view timeline for their destination applications" ON destination_application_timeline;

-- Create a more permissive policy that allows both user viewing and system inserts
CREATE POLICY "Users can view timeline for their destination applications"
ON destination_application_timeline
FOR SELECT
USING (
  destination_application_id IN (
    SELECT id FROM destination_applications WHERE client_id = auth.uid()
  )
);

-- Allow system to insert timeline entries (for triggers)
CREATE POLICY "System can insert timeline entries"
ON destination_application_timeline
FOR INSERT
WITH CHECK (true);
