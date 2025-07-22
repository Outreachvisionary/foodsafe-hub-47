-- Fix critical security issues by enabling RLS on core tables

-- Enable RLS on main application tables that exist
ALTER TABLE supply_chain_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;

-- Create proper RLS policies for supply_chain_partners
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