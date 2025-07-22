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

-- Create basic RLS policies for essential tables
DROP POLICY IF EXISTS "Users can view organizations" ON organizations;
CREATE POLICY "Users can view organizations" 
ON organizations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage organizations" ON organizations;
CREATE POLICY "Admins can manage organizations" 
ON organizations FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Users can view facilities" ON facilities;
CREATE POLICY "Users can view facilities" 
ON facilities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage facilities" ON facilities;
CREATE POLICY "Admins can manage facilities" 
ON facilities FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Users can view roles" ON roles;
CREATE POLICY "Users can view roles" 
ON roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage roles" ON roles;
CREATE POLICY "Admins can manage roles" 
ON roles FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Users can view their own user roles" ON user_roles;
CREATE POLICY "Users can view their own user roles" 
ON user_roles FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage user roles" ON user_roles;
CREATE POLICY "Admins can manage user roles" 
ON user_roles FOR ALL USING (is_admin());