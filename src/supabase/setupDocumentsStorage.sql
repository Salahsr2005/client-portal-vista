
-- Create storage bucket for user documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('user_documents', 'User Documents', false);

-- Set up access policy for authenticated users to upload their own documents
CREATE POLICY "Users can upload their own documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'user_documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Users can view their own documents
CREATE POLICY "Users can view their own documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'user_documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Users can update their own documents
CREATE POLICY "Users can update their own documents"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'user_documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Users can delete their own documents
CREATE POLICY "Users can delete their own documents"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'user_documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Admins can access all documents
CREATE POLICY "Admins can access all documents"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'user_documents' AND 
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
  );
