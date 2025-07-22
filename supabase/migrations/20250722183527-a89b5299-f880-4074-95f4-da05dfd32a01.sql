-- Create document storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Ensure RLS is enabled on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create upload policy for documents bucket
DROP POLICY IF EXISTS "Allow authenticated users to upload documents" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create access policy for documents bucket
DROP POLICY IF EXISTS "Allow authenticated users to access their documents" ON storage.objects;
CREATE POLICY "Allow authenticated users to access their documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own documents
DROP POLICY IF EXISTS "Allow users to update their documents" ON storage.objects;
CREATE POLICY "Allow users to update their documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own documents
DROP POLICY IF EXISTS "Allow users to delete their documents" ON storage.objects;
CREATE POLICY "Allow users to delete their documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);