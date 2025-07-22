-- Create document storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create a storage upload function with security definer
CREATE OR REPLACE FUNCTION public.handle_document_storage()
RETURNS TRIGGER AS $$
BEGIN
  -- For audit purposes
  INSERT INTO public.document_activities (
    document_id,
    action,
    user_id,
    user_name,
    user_role
  ) VALUES (
    NEW.id,
    'Document created',
    auth.uid()::text,
    (SELECT email FROM auth.users WHERE id = auth.uid()),
    'user'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for document creation
DROP TRIGGER IF EXISTS on_document_created ON public.documents;
CREATE TRIGGER on_document_created
  AFTER INSERT ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_document_storage();