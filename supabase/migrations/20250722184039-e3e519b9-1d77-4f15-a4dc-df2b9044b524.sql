-- Fix database schema for documents table
-- Add the document_count column to document_folders if it doesn't exist
ALTER TABLE public.document_folders
ADD COLUMN IF NOT EXISTS document_count INTEGER DEFAULT 0;

-- Update the trigger function to properly reference document_count
CREATE OR REPLACE FUNCTION public.update_folder_document_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Only update count if folder_id is not null
        IF NEW.folder_id IS NOT NULL THEN
            UPDATE public.document_folders 
            SET document_count = document_count + 1, updated_at = now()
            WHERE id = NEW.folder_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        -- Only update count if folder_id is not null
        IF OLD.folder_id IS NOT NULL THEN
            UPDATE public.document_folders 
            SET document_count = document_count - 1, updated_at = now()
            WHERE id = OLD.folder_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' AND OLD.folder_id IS DISTINCT FROM NEW.folder_id THEN
        -- Document moved between folders
        -- Decrement old folder count if not null
        IF OLD.folder_id IS NOT NULL THEN
            UPDATE public.document_folders 
            SET document_count = document_count - 1, updated_at = now()
            WHERE id = OLD.folder_id;
        END IF;
        
        -- Increment new folder count if not null
        IF NEW.folder_id IS NOT NULL THEN
            UPDATE public.document_folders 
            SET document_count = document_count + 1, updated_at = now()
            WHERE id = NEW.folder_id;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on documents table if it doesn't exist
DROP TRIGGER IF EXISTS trigger_update_folder_document_count ON public.documents;
CREATE TRIGGER trigger_update_folder_document_count
AFTER INSERT OR UPDATE OR DELETE ON public.documents
FOR EACH ROW EXECUTE FUNCTION public.update_folder_document_count();