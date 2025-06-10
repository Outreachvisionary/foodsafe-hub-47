
-- First, let's create RLS policies for all major tables to ensure proper data access control

-- Enable RLS on all tables that don't have it enabled yet
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.non_conformances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nc_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nc_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capa_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capa_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capa_effectiveness_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_current_user_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND (r.name = 'admin' OR r.permissions @> '{"admin": true}'::jsonb)
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Documents RLS Policies
CREATE POLICY "Users can view documents in their organization" ON public.documents
FOR SELECT TO authenticated
USING (
  public.is_admin() OR 
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND (p.organization_id IS NULL OR p.organization_id = public.get_current_user_org_id())
  )
);

CREATE POLICY "Users can create documents" ON public.documents
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  created_by = auth.uid()::text
);

CREATE POLICY "Users can update documents they created or admins can update all" ON public.documents
FOR UPDATE TO authenticated
USING (
  public.is_admin() OR 
  created_by = auth.uid()::text
);

CREATE POLICY "Admins can delete documents" ON public.documents
FOR DELETE TO authenticated
USING (public.is_admin());

-- Document Versions RLS Policies
CREATE POLICY "Users can view document versions for accessible documents" ON public.document_versions
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.documents d 
    WHERE d.id = document_versions.document_id
    AND (
      public.is_admin() OR 
      EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() 
        AND (p.organization_id IS NULL OR p.organization_id = public.get_current_user_org_id())
      )
    )
  )
);

CREATE POLICY "Users can create document versions" ON public.document_versions
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  created_by = auth.uid()::text
);

-- Document Activities RLS Policies
CREATE POLICY "Users can view document activities for accessible documents" ON public.document_activities
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.documents d 
    WHERE d.id = document_activities.document_id
    AND (
      public.is_admin() OR 
      EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() 
        AND (p.organization_id IS NULL OR p.organization_id = public.get_current_user_org_id())
      )
    )
  )
);

CREATE POLICY "Users can create document activities" ON public.document_activities
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  user_id = auth.uid()::text
);

-- Non-Conformances RLS Policies
CREATE POLICY "Users can view non-conformances in their organization" ON public.non_conformances
FOR SELECT TO authenticated
USING (
  public.is_admin() OR 
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND (p.organization_id IS NULL OR p.organization_id = public.get_current_user_org_id())
  )
);

CREATE POLICY "Users can create non-conformances" ON public.non_conformances
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  created_by = auth.uid()::text
);

CREATE POLICY "Users can update non-conformances they created or are assigned to" ON public.non_conformances
FOR UPDATE TO authenticated
USING (
  public.is_admin() OR 
  created_by = auth.uid()::text OR
  assigned_to = auth.uid()::text
);

-- CAPA Actions RLS Policies
CREATE POLICY "Users can view CAPA actions in their organization" ON public.capa_actions
FOR SELECT TO authenticated
USING (
  public.is_admin() OR 
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND (p.organization_id IS NULL OR p.organization_id = public.get_current_user_org_id())
  )
);

CREATE POLICY "Users can create CAPA actions" ON public.capa_actions
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  created_by = auth.uid()::text
);

CREATE POLICY "Users can update CAPA actions they created or are assigned to" ON public.capa_actions
FOR UPDATE TO authenticated
USING (
  public.is_admin() OR 
  created_by = auth.uid()::text OR
  assigned_to = auth.uid()::text
);

-- Audits RLS Policies
CREATE POLICY "Users can view audits in their organization" ON public.audits
FOR SELECT TO authenticated
USING (
  public.is_admin() OR 
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND (p.organization_id IS NULL OR p.organization_id = public.get_current_user_org_id())
  )
);

CREATE POLICY "Users can create audits" ON public.audits
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  created_by = auth.uid()::text
);

CREATE POLICY "Users can update audits they created or are assigned to" ON public.audits
FOR UPDATE TO authenticated
USING (
  public.is_admin() OR 
  created_by = auth.uid()::text OR
  assigned_to = auth.uid()::text
);

-- Training Records RLS Policies
CREATE POLICY "Users can view their own training records or admins can view all" ON public.training_records
FOR SELECT TO authenticated
USING (
  public.is_admin() OR 
  employee_id = auth.uid()::text
);

CREATE POLICY "Admins can create training records" ON public.training_records
FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Users can update their own training records or admins can update all" ON public.training_records
FOR UPDATE TO authenticated
USING (
  public.is_admin() OR 
  employee_id = auth.uid()::text
);

-- Suppliers RLS Policies (organization-scoped)
CREATE POLICY "Users can view suppliers in their organization" ON public.suppliers
FOR SELECT TO authenticated
USING (
  public.is_admin() OR 
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND (p.organization_id IS NULL OR p.organization_id = public.get_current_user_org_id())
  )
);

CREATE POLICY "Admins can manage suppliers" ON public.suppliers
FOR ALL TO authenticated
USING (public.is_admin());

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('documents', 'documents', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png', 'image/gif']),
  ('attachments', 'attachments', false, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'application/zip', 'application/x-rar-compressed']),
  ('profiles', 'profiles', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies for documents bucket
CREATE POLICY "Users can view documents they have access to" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'documents' AND
  (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND (p.organization_id IS NULL OR p.organization_id = public.get_current_user_org_id())
    )
  )
);

CREATE POLICY "Authenticated users can upload documents" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update documents they uploaded or admins can update all" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'documents' AND
  (public.is_admin() OR owner = auth.uid())
);

CREATE POLICY "Admins can delete documents" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'documents' AND
  public.is_admin()
);

-- Storage RLS Policies for attachments bucket
CREATE POLICY "Users can view attachments they have access to" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'attachments' AND
  (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND (p.organization_id IS NULL OR p.organization_id = public.get_current_user_org_id())
    )
  )
);

CREATE POLICY "Authenticated users can upload attachments" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'attachments' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update attachments they uploaded or admins can update all" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'attachments' AND
  (public.is_admin() OR owner = auth.uid())
);

-- Storage RLS Policies for profiles bucket (public)
CREATE POLICY "Anyone can view profile images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'profiles');

CREATE POLICY "Users can upload their own profile images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'profiles' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own profile images" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'profiles' AND
  owner = auth.uid()
);

CREATE POLICY "Users can delete their own profile images" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'profiles' AND
  owner = auth.uid()
);
