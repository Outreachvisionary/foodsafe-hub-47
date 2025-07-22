-- Make Supabase storage bucket public to fix access issues temporarily
UPDATE storage.buckets
SET public = true
WHERE id = 'documents';

-- Add a function to check document upload permissions
CREATE OR REPLACE FUNCTION public.can_upload_document(user_id UUID) 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;