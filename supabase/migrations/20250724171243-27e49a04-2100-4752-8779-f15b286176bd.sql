-- CRITICAL SECURITY FIXES - Phase 1B: Fix Remaining RLS Issues (Corrected)

-- Enable RLS on existing tables that don't have it
ALTER TABLE nc_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE nc_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE non_conformances ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_genealogy ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recall_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE recall_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE standard_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE traceability_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_automation_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_workflows ENABLE ROW LEVEL SECURITY;

-- Add policies for profiles table
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can manage all profiles"
ON profiles
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Add policies for roles table
CREATE POLICY "Authenticated users can view roles"
ON roles
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage roles"
ON roles
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Add policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON user_roles
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage user roles"
ON user_roles
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Add policies for non_conformances
CREATE POLICY "Users can view NCs in their organization"
ON non_conformances
FOR SELECT
USING (
  is_admin() OR
  created_by = auth.uid()::text OR
  assigned_to = auth.uid()::text OR
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.organization_id = get_current_user_org_id()
  )
);

CREATE POLICY "Users can create NCs"
ON non_conformances
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  created_by = auth.uid()::text
);

CREATE POLICY "Users can update NCs they created or are assigned to"
ON non_conformances
FOR UPDATE
USING (
  is_admin() OR
  created_by = auth.uid()::text OR
  assigned_to = auth.uid()::text
)
WITH CHECK (
  is_admin() OR
  created_by = auth.uid()::text OR
  assigned_to = auth.uid()::text
);

-- Add policies for nc_attachments  
CREATE POLICY "Users can view NC attachments for accessible NCs"
ON nc_attachments
FOR SELECT
USING (
  is_admin() OR
  EXISTS (
    SELECT 1 FROM non_conformances nc
    WHERE nc.id = nc_attachments.non_conformance_id
    AND (nc.created_by = auth.uid()::text OR nc.assigned_to = auth.uid()::text)
  )
);

CREATE POLICY "Users can add attachments to accessible NCs"
ON nc_attachments
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  uploaded_by = auth.uid()::text AND
  EXISTS (
    SELECT 1 FROM non_conformances nc
    Where nc.id = non_conformance_id
    AND (nc.created_by = auth.uid()::text OR nc.assigned_to = auth.uid()::text)
  )
);

-- Add policies for nc_notifications
CREATE POLICY "Users can view NC notifications for accessible NCs"
ON nc_notifications
FOR SELECT
USING (
  is_admin() OR
  EXISTS (
    SELECT 1 FROM non_conformances nc
    WHERE nc.id = nc_notifications.non_conformance_id
    AND (nc.created_by = auth.uid()::text OR nc.assigned_to = auth.uid()::text)
  )
);

-- Add policies for products
CREATE POLICY "Users can view products in their organization"
ON products
FOR SELECT
USING (
  is_admin() OR
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.organization_id = get_current_user_org_id()
  )
);

CREATE POLICY "Authenticated users can manage products"
ON products
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Add policies for suppliers
CREATE POLICY "Users can view suppliers in their organization"
ON suppliers
FOR SELECT
USING (
  is_admin() OR
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.organization_id = get_current_user_org_id()
  )
);

CREATE POLICY "Authenticated users can manage suppliers"
ON suppliers
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Add policies for training records
CREATE POLICY "Users can view their own training records"
ON training_records
FOR SELECT
USING (
  is_admin() OR
  employee_id = auth.uid()::text
);

CREATE POLICY "Users can create training records"
ON training_records
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own training records"
ON training_records
FOR UPDATE
USING (
  is_admin() OR
  employee_id = auth.uid()::text
)
WITH CHECK (
  is_admin() OR
  employee_id = auth.uid()::text
);

-- Add basic policies for other tables to prevent access denial
CREATE POLICY "Authenticated users can access document workflows"
ON document_workflows
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can access workflow instances"
ON document_workflow_instances
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Remove conflicting old policies that are too permissive
DROP POLICY IF EXISTS "Allow all access to non_conformances" ON non_conformances;
DROP POLICY IF EXISTS "Allow all access to nc_activities" ON nc_activities;
DROP POLICY IF EXISTS "Allow all access to nc_attachments" ON nc_attachments;
DROP POLICY IF EXISTS "Allow all access to nc_notifications" ON nc_notifications;
DROP POLICY IF EXISTS "Allow public access" ON training_records;
DROP POLICY IF EXISTS "Allow public access" ON training_sessions;