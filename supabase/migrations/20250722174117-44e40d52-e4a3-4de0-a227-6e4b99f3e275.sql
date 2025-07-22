-- Fix critical security issues by enabling RLS on all tables that need it

-- Enable RLS on main application tables
ALTER TABLE supply_chain_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE facility_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_genealogy ENABLE ROW LEVEL SECURITY;
ALTER TABLE non_conformances ENABLE ROW LEVEL SECURITY;
ALTER TABLE nc_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE recall_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE recall_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE capa_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE capa_effectiveness_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE capa_related_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE capa_related_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_workflows ENABLE ROW LEVEL SECURITY;

-- Create proper RLS policies for tables that were just added columns
DROP POLICY IF EXISTS "Users can view suppliers in their organization" ON supply_chain_partners;
CREATE POLICY "Users can view suppliers in their organization" 
ON supply_chain_partners FOR SELECT 
USING (
  is_admin() OR 
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND (p.organization_id IS NULL OR p.organization_id = get_current_user_org_id())
  )
);

DROP POLICY IF EXISTS "Users can create suppliers" ON supply_chain_partners;
CREATE POLICY "Users can create suppliers" 
ON supply_chain_partners FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND created_by = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can update suppliers" ON supply_chain_partners;
CREATE POLICY "Users can update suppliers" 
ON supply_chain_partners FOR UPDATE 
USING (
  is_admin() OR created_by = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete suppliers" ON supply_chain_partners;
CREATE POLICY "Users can delete suppliers" 
ON supply_chain_partners FOR DELETE 
USING (
  is_admin() OR created_by = auth.uid()::text
);

-- Training session policies
DROP POLICY IF EXISTS "Users can view training sessions" ON training_sessions;
CREATE POLICY "Users can view training sessions" 
ON training_sessions FOR SELECT 
USING (
  is_admin() OR 
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND (p.organization_id IS NULL OR p.organization_id = get_current_user_org_id())
  )
);

DROP POLICY IF EXISTS "Users can create training sessions" ON training_sessions;
CREATE POLICY "Users can create training sessions" 
ON training_sessions FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND created_by = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can update training sessions" ON training_sessions;
CREATE POLICY "Users can update training sessions" 
ON training_sessions FOR UPDATE 
USING (
  is_admin() OR created_by = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete training sessions" ON training_sessions;
CREATE POLICY "Users can delete training sessions" 
ON training_sessions FOR DELETE 
USING (
  is_admin() OR created_by = auth.uid()::text
);

-- Training record policies
DROP POLICY IF EXISTS "Users can view training records" ON training_records;
CREATE POLICY "Users can view training records" 
ON training_records FOR SELECT 
USING (
  is_admin() OR 
  employee_id = auth.uid()::text OR
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND (p.organization_id IS NULL OR p.organization_id = get_current_user_org_id())
  )
);

DROP POLICY IF EXISTS "Users can create training records" ON training_records;
CREATE POLICY "Users can create training records" 
ON training_records FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL
);

DROP POLICY IF EXISTS "Users can update training records" ON training_records;
CREATE POLICY "Users can update training records" 
ON training_records FOR UPDATE 
USING (
  is_admin() OR employee_id = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete training records" ON training_records;
CREATE POLICY "Users can delete training records" 
ON training_records FOR DELETE 
USING (
  is_admin()
);

-- Add basic RLS policies for other essential tables that need them
CREATE POLICY IF NOT EXISTS "Users can view organizations" 
ON organizations FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Admins can manage organizations" 
ON organizations FOR ALL USING (is_admin());

CREATE POLICY IF NOT EXISTS "Users can view facilities" 
ON facilities FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Admins can manage facilities" 
ON facilities FOR ALL USING (is_admin());

CREATE POLICY IF NOT EXISTS "Users can view roles" 
ON roles FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Admins can manage roles" 
ON roles FOR ALL USING (is_admin());

CREATE POLICY IF NOT EXISTS "Users can view their own user roles" 
ON user_roles FOR SELECT USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Admins can manage user roles" 
ON user_roles FOR ALL USING (is_admin());