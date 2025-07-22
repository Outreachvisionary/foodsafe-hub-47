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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON supply_chain_partners(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_type ON supply_chain_partners(supplier_type);
CREATE INDEX IF NOT EXISTS idx_suppliers_risk ON supply_chain_partners(risk_level);
CREATE INDEX IF NOT EXISTS idx_training_sessions_status ON training_sessions(status);
CREATE INDEX IF NOT EXISTS idx_training_records_session_id ON training_records(training_session_id);
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits(status);