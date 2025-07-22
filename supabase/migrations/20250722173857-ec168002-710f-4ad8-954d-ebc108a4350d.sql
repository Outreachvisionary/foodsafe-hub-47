-- Fix Supplier (supply_chain_partners) table schema mismatches
-- Add missing columns to match TypeScript interface

ALTER TABLE supply_chain_partners 
ADD COLUMN IF NOT EXISTS contact_person text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS zip_code text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS supplier_type text DEFAULT 'Other',
ADD COLUMN IF NOT EXISTS certification_status text,
ADD COLUMN IF NOT EXISTS last_audit_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS next_audit_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS risk_level text DEFAULT 'Low',
ADD COLUMN IF NOT EXISTS notes text;

-- Update existing data to use new column names
UPDATE supply_chain_partners 
SET 
  contact_person = contact_name,
  email = contact_email,
  phone = contact_phone,
  supplier_type = partner_type
WHERE contact_person IS NULL;

-- Fix Training Sessions table schema mismatches
-- Add missing columns to match TypeScript interface

ALTER TABLE training_sessions
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'Draft',
ADD COLUMN IF NOT EXISTS instructor text,
ADD COLUMN IF NOT EXISTS duration_hours numeric DEFAULT 1,
ADD COLUMN IF NOT EXISTS max_participants integer,
ADD COLUMN IF NOT EXISTS current_participants integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS end_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS is_online boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS meeting_link text,
ADD COLUMN IF NOT EXISTS materials text[],
ADD COLUMN IF NOT EXISTS prerequisites text[],
ADD COLUMN IF NOT EXISTS learning_objectives text[],
ADD COLUMN IF NOT EXISTS assessment_required boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS passing_score numeric,
ADD COLUMN IF NOT EXISTS certificate_template text;

-- Update existing data
UPDATE training_sessions 
SET 
  category = training_category,
  status = CASE 
    WHEN completion_status = 'Completed' THEN 'Completed'
    WHEN completion_status = 'In Progress' THEN 'Active'
    ELSE 'Draft'
  END
WHERE category IS NULL;

-- Fix Training Records table schema mismatches
-- Add missing columns to match TypeScript interface

ALTER TABLE training_records
ADD COLUMN IF NOT EXISTS training_session_id uuid,
ADD COLUMN IF NOT EXISTS enrollment_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS passed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS certificate_issued boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS certificate_url text,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Update existing data
UPDATE training_records 
SET 
  training_session_id = session_id,
  enrollment_date = assigned_date,
  start_date = assigned_date,
  passed = CASE WHEN status::text = 'Completed' THEN true ELSE false END,
  created_at = COALESCE(created_at, now()),
  updated_at = COALESCE(updated_at, now())
WHERE training_session_id IS NULL;

-- Create enum types for consistent status handling
DO $$ 
BEGIN
  -- Create audit status enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_status_enum') THEN
    CREATE TYPE audit_status_enum AS ENUM ('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue');
  END IF;
  
  -- Create supplier status enum if it doesn't exist  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supplier_status_enum') THEN
    CREATE TYPE supplier_status_enum AS ENUM ('Active', 'Inactive', 'Pending', 'Suspended');
  END IF;
  
  -- Create training status enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'training_status_enum') THEN
    CREATE TYPE training_status_enum AS ENUM ('Draft', 'Active', 'Completed', 'Cancelled', 'Archived');
  END IF;
  
  -- Create training record status enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'training_record_status_enum') THEN
    CREATE TYPE training_record_status_enum AS ENUM ('Enrolled', 'In Progress', 'Completed', 'Failed', 'Cancelled');
  END IF;
END $$;

-- Add constraints for data integrity
ALTER TABLE supply_chain_partners
ADD CONSTRAINT IF NOT EXISTS chk_supplier_status 
CHECK (status IN ('Active', 'Inactive', 'Pending', 'Suspended'));

ALTER TABLE supply_chain_partners
ADD CONSTRAINT IF NOT EXISTS chk_risk_level 
CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical'));

ALTER TABLE training_sessions
ADD CONSTRAINT IF NOT EXISTS chk_training_status 
CHECK (status IN ('Draft', 'Active', 'Completed', 'Cancelled', 'Archived'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON supply_chain_partners(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_type ON supply_chain_partners(supplier_type);
CREATE INDEX IF NOT EXISTS idx_suppliers_risk ON supply_chain_partners(risk_level);
CREATE INDEX IF NOT EXISTS idx_training_sessions_status ON training_sessions(status);
CREATE INDEX IF NOT EXISTS idx_training_records_session_id ON training_records(training_session_id);
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits(status);

-- Update RLS policies to work with new schema
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

DROP POLICY IF EXISTS "Users can manage suppliers" ON supply_chain_partners;
CREATE POLICY "Users can manage suppliers" 
ON supply_chain_partners FOR ALL 
USING (
  is_admin() OR 
  (auth.uid() IS NOT NULL AND created_by = auth.uid()::text)
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

DROP POLICY IF EXISTS "Users can manage training sessions" ON training_sessions;
CREATE POLICY "Users can manage training sessions" 
ON training_sessions FOR ALL 
USING (
  is_admin() OR 
  (auth.uid() IS NOT NULL AND created_by = auth.uid()::text)
);

-- Training record policies
DROP POLICY IF EXISTS "Users can view training records" ON training_records;
CREATE POLICY "Users can view training records" 
ON training_records FOR SELECT 
USING (
  is_admin() OR 
  (auth.uid() IS NOT NULL AND employee_id = auth.uid()::text)
);

DROP POLICY IF EXISTS "Users can manage training records" ON training_records;
CREATE POLICY "Users can manage training records" 
ON training_records FOR ALL 
USING (
  is_admin() OR 
  (auth.uid() IS NOT NULL)
);