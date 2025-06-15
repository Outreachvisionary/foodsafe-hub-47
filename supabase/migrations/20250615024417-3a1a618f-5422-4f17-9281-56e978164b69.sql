
-- Ensure folders table exists and is properly structured
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    parent_id UUID REFERENCES public.folders(id),
    created_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    document_count INTEGER DEFAULT 0
);

-- Add missing columns to documents table if they don't exist
DO $$
BEGIN
    -- Add file_path column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'file_path') THEN
        ALTER TABLE public.documents ADD COLUMN file_path TEXT;
    END IF;
    
    -- Add workflow_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'workflow_status') THEN
        ALTER TABLE public.documents ADD COLUMN workflow_status TEXT;
    END IF;
END$$;

-- Create document_folders table for better folder management
CREATE TABLE IF NOT EXISTS public.document_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    parent_id UUID REFERENCES public.document_folders(id),
    path TEXT NOT NULL,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    organization_id UUID REFERENCES public.organizations(id),
    is_system_folder BOOLEAN DEFAULT false
);

-- Insert default system folders
INSERT INTO public.document_folders (name, path, created_by, is_system_folder) VALUES
('Quality Control', '/Quality Control', 'system', true),
('HACCP Plans', '/HACCP Plans', 'system', true),
('SOPs', '/SOPs', 'system', true),
('Training Materials', '/Training Materials', 'system', true)
ON CONFLICT DO NOTHING;

-- Enable RLS on document folders
ALTER TABLE public.document_folders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for document folders
CREATE POLICY "Users can view document folders" ON public.document_folders
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create folders" ON public.document_folders
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their folders" ON public.document_folders
    FOR UPDATE USING (created_by = auth.uid()::text OR is_system_folder = false);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_folder_id ON public.documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_by ON public.documents(created_by);
CREATE INDEX IF NOT EXISTS idx_document_folders_parent_id ON public.document_folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_document_folders_path ON public.document_folders(path);

-- Create a function to update folder document count
CREATE OR REPLACE FUNCTION update_folder_document_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.document_folders 
        SET document_count = document_count + 1, updated_at = now()
        WHERE id = NEW.folder_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.document_folders 
        SET document_count = document_count - 1, updated_at = now()
        WHERE id = OLD.folder_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.folder_id != NEW.folder_id THEN
        -- Document moved between folders
        UPDATE public.document_folders 
        SET document_count = document_count - 1, updated_at = now()
        WHERE id = OLD.folder_id;
        UPDATE public.document_folders 
        SET document_count = document_count + 1, updated_at = now()
        WHERE id = NEW.folder_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for folder document count
DROP TRIGGER IF EXISTS trigger_update_folder_document_count ON public.documents;
CREATE TRIGGER trigger_update_folder_document_count
    AFTER INSERT OR UPDATE OR DELETE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION update_folder_document_count();
