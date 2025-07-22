-- Enable storage for document management
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create policy for document bucket
CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their organization's documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND EXISTS (
  SELECT 1 FROM public.profiles p
  WHERE p.id = auth.uid()
  AND (
    p.organization_id IS NULL 
    OR p.organization_id = (storage.foldername(name))[2]::uuid
  )
));

-- Create table for document previews
CREATE TABLE IF NOT EXISTS public.document_previews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version_id UUID REFERENCES public.document_versions(id) ON DELETE SET NULL,
  preview_type TEXT NOT NULL,
  content TEXT,
  thumbnail_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create table for document shares
CREATE TABLE IF NOT EXISTS public.document_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES auth.users(id),
  shared_with UUID REFERENCES auth.users(id),
  shared_email TEXT,
  access_level TEXT NOT NULL DEFAULT 'view',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  accessed_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  CHECK (shared_with IS NOT NULL OR shared_email IS NOT NULL)
);

-- Add RLS policies for document previews
ALTER TABLE public.document_previews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view document previews they have access to"
ON public.document_previews FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.documents d
    WHERE d.id = document_id
  )
);

-- Add RLS policies for document shares
ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create shares for documents they own"
ON public.document_shares FOR INSERT
TO authenticated
WITH CHECK (
  shared_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.documents d
    WHERE d.id = document_id AND d.created_by = auth.uid()::text
  )
);

CREATE POLICY "Users can see shares they created or received"
ON public.document_shares FOR SELECT
TO authenticated
USING (
  shared_by = auth.uid() OR 
  shared_with = auth.uid() OR
  shared_email = auth.email()
);