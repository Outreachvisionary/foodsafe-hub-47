-- CRITICAL SECURITY FIXES - Phase 1: Emergency RLS Policy Fixes

-- 1. Remove dangerous "Allow public access" policies that bypass security
DROP POLICY IF EXISTS "Allow public access" ON audits;
DROP POLICY IF EXISTS "Allow public access" ON audit_findings;
DROP POLICY IF EXISTS "Allow public access" ON capa_actions;
DROP POLICY IF EXISTS "Allow public access" ON complaints;
DROP POLICY IF EXISTS "Allow public access" ON ccps;
DROP POLICY IF EXISTS "Allow public access" ON haccp_plans;
DROP POLICY IF EXISTS "Allow public access" ON documents;
DROP POLICY IF EXISTS "Allow public access" ON document_activities;
DROP POLICY IF EXISTS "Allow public access" ON document_versions;
DROP POLICY IF EXISTS "Allow public access" ON folders;
DROP POLICY IF EXISTS "Allow public access" ON module_relationships;

-- 2. Enable RLS on tables that don't have it enabled
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_production_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_quality_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_safety_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE nc_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE capa_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE capa_effectiveness_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE capa_related_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE capa_related_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_access ENABLE ROW LEVEL SECURITY;

-- 3. Create proper organization-scoped policies for organizations table
CREATE POLICY "Users can view organizations in their context"
ON organizations
FOR SELECT
USING (
  is_admin() OR 
  id = get_current_user_org_id() OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND organization_id = organizations.id
  )
);

CREATE POLICY "Admins can manage organizations"
ON organizations
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- 4. Create proper policies for regulatory_standards
CREATE POLICY "Users can view regulatory standards"
ON regulatory_standards
FOR SELECT
USING (status = 'active');

CREATE POLICY "Admins can manage regulatory standards"
ON regulatory_standards
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- 5. Fix KPI tables with proper organization scoping
CREATE POLICY "Users can view KPI metrics in their organization"
ON kpi_metrics
FOR SELECT
USING (
  is_admin() OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND organization_id = get_current_user_org_id()
  )
);

CREATE POLICY "Admins can manage KPI metrics"
ON kpi_metrics
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Apply similar policies to other KPI tables
CREATE POLICY "Users can view production data in their organization"
ON kpi_production_data
FOR SELECT
USING (
  is_admin() OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND organization_id = get_current_user_org_id()
  )
);

CREATE POLICY "Admins can manage production data"
ON kpi_production_data
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Users can view quality data in their organization"
ON kpi_quality_data
FOR SELECT
USING (
  is_admin() OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND organization_id = get_current_user_org_id()
  )
);

CREATE POLICY "Admins can manage quality data"
ON kpi_quality_data
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Users can view safety data in their organization"
ON kpi_safety_data
FOR SELECT
USING (
  is_admin() OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND organization_id = get_current_user_org_id()
  )
);

CREATE POLICY "Admins can manage safety data"
ON kpi_safety_data
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- 6. Fix NC and CAPA activity tables
CREATE POLICY "Users can view NC activities in their organization"
ON nc_activities
FOR SELECT
USING (
  is_admin() OR
  EXISTS (
    SELECT 1 FROM profiles p, non_conformances nc
    WHERE p.id = auth.uid() 
    AND nc.id = nc_activities.non_conformance_id
    AND (p.organization_id = get_current_user_org_id() OR nc.created_by = auth.uid()::text)
  )
);

CREATE POLICY "Users can create NC activities for accessible NCs"
ON nc_activities
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM non_conformances nc
    WHERE nc.id = non_conformance_id
    AND (is_admin() OR nc.created_by = auth.uid()::text OR nc.assigned_to = auth.uid()::text)
  )
);

CREATE POLICY "Users can view CAPA activities in their organization"
ON capa_activities
FOR SELECT
USING (
  is_admin() OR
  EXISTS (
    SELECT 1 FROM profiles p, capa_actions ca
    WHERE p.id = auth.uid() 
    AND ca.id = capa_activities.capa_id
    AND (p.organization_id = get_current_user_org_id() OR ca.created_by = auth.uid()::text)
  )
);

CREATE POLICY "Users can create CAPA activities for accessible CAPAs"
ON capa_activities
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM capa_actions ca
    WHERE ca.id = capa_id
    AND (is_admin() OR ca.created_by = auth.uid()::text OR ca.assigned_to = auth.uid()::text)
  )
);

-- 7. Fix CAPA effectiveness assessments
CREATE POLICY "Users can view CAPA effectiveness assessments in their organization"
ON capa_effectiveness_assessments
FOR SELECT
USING (
  is_admin() OR
  EXISTS (
    SELECT 1 FROM capa_actions ca
    WHERE ca.id = capa_effectiveness_assessments.capa_id
    AND (ca.created_by = auth.uid()::text OR ca.assigned_to = auth.uid()::text)
  )
);

CREATE POLICY "Users can create effectiveness assessments for their CAPAs"
ON capa_effectiveness_assessments
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  created_by = auth.uid()::text AND
  EXISTS (
    SELECT 1 FROM capa_actions ca
    WHERE ca.id = capa_id
    AND (ca.created_by = auth.uid()::text OR ca.assigned_to = auth.uid()::text)
  )
);

-- 8. Fix CAPA related documents and training
CREATE POLICY "Users can view CAPA related documents"
ON capa_related_documents
FOR SELECT
USING (
  is_admin() OR
  EXISTS (
    SELECT 1 FROM capa_actions ca
    WHERE ca.id = capa_related_documents.capa_id
    AND (ca.created_by = auth.uid()::text OR ca.assigned_to = auth.uid()::text)
  )
);

CREATE POLICY "Users can add documents to their CAPAs"
ON capa_related_documents
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  added_by = auth.uid()::text AND
  EXISTS (
    SELECT 1 FROM capa_actions ca
    WHERE ca.id = capa_id
    AND (ca.created_by = auth.uid()::text OR ca.assigned_to = auth.uid()::text)
  )
);

CREATE POLICY "Users can view CAPA related training"
ON capa_related_training
FOR SELECT
USING (
  is_admin() OR
  EXISTS (
    SELECT 1 FROM capa_actions ca
    WHERE ca.id = capa_related_training.capa_id
    AND (ca.created_by = auth.uid()::text OR ca.assigned_to = auth.uid()::text)
  )
);

CREATE POLICY "Users can add training to their CAPAs"
ON capa_related_training
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  added_by = auth.uid()::text AND
  EXISTS (
    SELECT 1 FROM capa_actions ca
    WHERE ca.id = capa_id
    AND (ca.created_by = auth.uid()::text OR ca.assigned_to = auth.uid()::text)
  )
);

-- 9. Fix document access table
CREATE POLICY "Users can view document access for their documents"
ON document_access
FOR SELECT
USING (
  is_admin() OR
  user_id = auth.uid()::text OR
  granted_by = auth.uid()::text OR
  EXISTS (
    SELECT 1 FROM documents d
    WHERE d.id = document_access.document_id
    AND d.created_by = auth.uid()::text
  )
);

CREATE POLICY "Document creators can grant access"
ON document_access
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  granted_by = auth.uid()::text AND
  EXISTS (
    SELECT 1 FROM documents d
    WHERE d.id = document_id
    AND (d.created_by = auth.uid()::text OR is_admin())
  )
);

-- 10. Replace overly permissive facilities policies with organization-scoped ones
DROP POLICY IF EXISTS "Authenticated users can manage facilities" ON facilities;
DROP POLICY IF EXISTS "Authenticated users can manage facility standards" ON facility_standards;

CREATE POLICY "Users can manage facilities in their organization"
ON facilities
FOR ALL
USING (
  is_admin() OR
  (auth.uid() IS NOT NULL AND organization_id = get_current_user_org_id())
)
WITH CHECK (
  is_admin() OR
  (auth.uid() IS NOT NULL AND organization_id = get_current_user_org_id())
);

CREATE POLICY "Users can manage facility standards in their organization"
ON facility_standards
FOR ALL
USING (
  is_admin() OR
  (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM facilities f
    WHERE f.id = facility_standards.facility_id
    AND f.organization_id = get_current_user_org_id()
  ))
)
WITH CHECK (
  is_admin() OR
  (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM facilities f
    WHERE f.id = facility_id
    AND f.organization_id = get_current_user_org_id()
  ))
);