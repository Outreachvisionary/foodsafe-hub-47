-- Phase 1: Critical RLS and Database Security Fixes
-- Enable RLS on all unprotected tables and create proper policies

-- Enable RLS on core unprotected tables
ALTER TABLE public.audit_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.haccp_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ccps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_workflow_instances ENABLE ROW LEVEL SECURITY;

-- Create proper organization-scoped policies for audit_findings
CREATE POLICY "Users can view audit findings in their organization"
ON public.audit_findings
FOR SELECT
USING (
  is_admin() OR 
  EXISTS (
    SELECT 1 FROM audits a
    WHERE a.id = audit_findings.audit_id
    AND (a.created_by = auth.uid()::text OR a.assigned_to = auth.uid()::text)
  )
);

CREATE POLICY "Users can create audit findings for their audits"
ON public.audit_findings
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM audits a
    WHERE a.id = audit_findings.audit_id
    AND (a.created_by = auth.uid()::text OR a.assigned_to = auth.uid()::text)
  )
);

CREATE POLICY "Users can update audit findings they created"
ON public.audit_findings
FOR UPDATE
USING (
  is_admin() OR 
  assigned_to = auth.uid()::text OR
  EXISTS (
    SELECT 1 FROM audits a
    WHERE a.id = audit_findings.audit_id
    AND a.created_by = auth.uid()::text
  )
);

-- Create proper policies for complaints
CREATE POLICY "Users can view complaints in their organization"
ON public.complaints
FOR SELECT
USING (
  is_admin() OR 
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND (p.organization_id IS NULL OR p.organization_id = get_current_user_org_id())
  )
);

CREATE POLICY "Users can create complaints"
ON public.complaints
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  created_by = auth.uid()::text
);

CREATE POLICY "Users can update complaints they created or are assigned to"
ON public.complaints
FOR UPDATE
USING (
  is_admin() OR 
  created_by = auth.uid()::text OR 
  assigned_to = auth.uid()::text
);

-- Update components policies to be more restrictive
DROP POLICY IF EXISTS "Enable read access for all users" ON public.components;
CREATE POLICY "Users can view components in their organization"
ON public.components
FOR SELECT
USING (
  is_admin() OR 
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND (p.organization_id IS NULL OR p.organization_id = get_current_user_org_id())
  )
);

-- Create proper policies for HACCP plans
CREATE POLICY "Users can view HACCP plans in their organization"
ON public.haccp_plans
FOR SELECT
USING (
  is_admin() OR 
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND (p.organization_id IS NULL OR p.organization_id = get_current_user_org_id())
  )
);

CREATE POLICY "Users can create HACCP plans"
ON public.haccp_plans
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  created_by = auth.uid()::text
);

CREATE POLICY "Users can update HACCP plans they created"
ON public.haccp_plans
FOR UPDATE
USING (
  is_admin() OR 
  created_by = auth.uid()::text
);

-- Create proper policies for CCPs
CREATE POLICY "Users can view CCPs for accessible HACCP plans"
ON public.ccps
FOR SELECT
USING (
  is_admin() OR 
  EXISTS (
    SELECT 1 FROM haccp_plans hp
    WHERE hp.id = ccps.haccp_plan_id
    AND (hp.created_by = auth.uid()::text OR is_admin())
  )
);

CREATE POLICY "Users can create CCPs for their HACCP plans"
ON public.ccps
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM haccp_plans hp
    WHERE hp.id = ccps.haccp_plan_id
    AND hp.created_by = auth.uid()::text
  )
);

CREATE POLICY "Users can update CCPs for their HACCP plans"
ON public.ccps
FOR UPDATE
USING (
  is_admin() OR 
  EXISTS (
    SELECT 1 FROM haccp_plans hp
    WHERE hp.id = ccps.haccp_plan_id
    AND hp.created_by = auth.uid()::text
  )
);

-- Create proper policies for folders (legacy table)
CREATE POLICY "Users can view folders they created"
ON public.folders
FOR SELECT
USING (
  created_by = auth.uid()::text OR 
  is_admin()
);

CREATE POLICY "Users can create folders"
ON public.folders
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  created_by = auth.uid()::text
);

CREATE POLICY "Users can update their folders"
ON public.folders
FOR UPDATE
USING (
  created_by = auth.uid()::text OR 
  is_admin()
);

-- Create proper policies for document workflows
CREATE POLICY "Users can view document workflows in their organization"
ON public.document_workflows
FOR SELECT
USING (
  is_admin() OR 
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND (p.organization_id IS NULL OR p.organization_id = get_current_user_org_id())
  )
);

CREATE POLICY "Users can create document workflows"
ON public.document_workflows
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  created_by = auth.uid()::text
);

CREATE POLICY "Users can update workflows they created"
ON public.document_workflows
FOR UPDATE
USING (
  is_admin() OR 
  created_by = auth.uid()::text
);

-- Create proper policies for workflow instances
CREATE POLICY "Users can view workflow instances for accessible documents"
ON public.document_workflow_instances
FOR SELECT
USING (
  is_admin() OR 
  EXISTS (
    SELECT 1 FROM documents d
    WHERE d.id = document_workflow_instances.document_id
    AND (d.created_by = auth.uid()::text OR is_admin())
  )
);

CREATE POLICY "Users can create workflow instances for their documents"
ON public.document_workflow_instances
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  created_by = auth.uid()::text AND
  EXISTS (
    SELECT 1 FROM documents d
    WHERE d.id = document_workflow_instances.document_id
    AND d.created_by = auth.uid()::text
  )
);

CREATE POLICY "Users can update workflow instances they created"
ON public.document_workflow_instances
FOR UPDATE
USING (
  is_admin() OR 
  created_by = auth.uid()::text
);

-- Fix database functions with mutable search paths
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role_name text, _org_id uuid DEFAULT NULL, _facility_id uuid DEFAULT NULL, _department_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = _user_id
      AND r.name = _role_name
      AND (
        (_org_id IS NULL OR ur.organization_id = _org_id) AND
        (_facility_id IS NULL OR ur.facility_id = _facility_id) AND
        (_department_id IS NULL OR ur.department_id = _department_id)
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission text, _org_id uuid DEFAULT NULL, _facility_id uuid DEFAULT NULL, _department_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = _user_id
      AND (
        (_org_id IS NULL OR ur.organization_id = _org_id) AND
        (_facility_id IS NULL OR ur.facility_id = _facility_id) AND
        (_department_id IS NULL OR ur.department_id = _department_id)
      )
      AND (
        r.permissions @> concat('{"', _permission, '": true}')::jsonb
        OR r.permissions @> '{"admin": true}'::jsonb
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND (r.name = 'admin' OR r.permissions @> '{"admin": true}'::jsonb)
  );
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_org_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$;