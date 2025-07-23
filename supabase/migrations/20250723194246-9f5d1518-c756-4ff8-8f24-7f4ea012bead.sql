-- =============================================
-- STANDARDS MODULE DATABASE MIGRATION (FIXED)
-- =============================================

-- Create enums for standards (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE public.compliance_status AS ENUM (
      'Not Started',
      'In Progress', 
      'Compliant',
      'Certified',
      'Non-Compliant',
      'Expired',
      'Under Review',
      'Suspended'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.requirement_category AS ENUM (
      'Documentation',
      'Training',
      'Infrastructure',
      'Process Control',
      'Monitoring',
      'Verification',
      'Management System',
      'Legal Compliance'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.requirement_criticality AS ENUM (
      'Critical',
      'Major',
      'Minor',
      'Informational'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.verification_method AS ENUM (
      'Document Review',
      'Physical Inspection',
      'Testing',
      'Interview',
      'Record Review',
      'Observation',
      'Measurement'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.requirement_compliance_status AS ENUM (
      'Not Started',
      'In Progress',
      'Complete',
      'Non-Compliant',
      'Needs Review',
      'Approved'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.audit_type AS ENUM (
      'Internal',
      'External',
      'Certification',
      'Surveillance',
      'Follow-up'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.finding_type AS ENUM (
      'Non-Conformity',
      'Observation',
      'Opportunity for Improvement',
      'Positive Finding'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- finding_severity and finding_status already exist, so skip them

-- Update existing regulatory_standards table with enhanced fields
ALTER TABLE public.regulatory_standards 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Food Safety',
ADD COLUMN IF NOT EXISTS scope TEXT,
ADD COLUMN IF NOT EXISTS certification_body TEXT,
ADD COLUMN IF NOT EXISTS annual_fee NUMERIC,
ADD COLUMN IF NOT EXISTS renewal_period_months INTEGER DEFAULT 36,
ADD COLUMN IF NOT EXISTS is_mandatory BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS geographical_scope TEXT[],
ADD COLUMN IF NOT EXISTS industry_sectors TEXT[],
ADD COLUMN IF NOT EXISTS requirements_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS documentation_url TEXT;

-- Update existing facility_standards table (safely)
DO $$ BEGIN
    ALTER TABLE public.facility_standards 
    ALTER COLUMN compliance_status TYPE compliance_status USING compliance_status::compliance_status;
EXCEPTION
    WHEN others THEN 
        -- If the column doesn't exist or conversion fails, add it
        ALTER TABLE public.facility_standards 
        ADD COLUMN IF NOT EXISTS compliance_status compliance_status DEFAULT 'Not Started';
END $$;

ALTER TABLE public.facility_standards 
ADD COLUMN IF NOT EXISTS compliance_score INTEGER CHECK (compliance_score >= 0 AND compliance_score <= 100),
ADD COLUMN IF NOT EXISTS last_audit_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS next_audit_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS auditor_name TEXT,
ADD COLUMN IF NOT EXISTS certification_number TEXT,
ADD COLUMN IF NOT EXISTS non_conformities_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS capa_actions_count INTEGER DEFAULT 0;

-- Create standard_requirements table
CREATE TABLE IF NOT EXISTS public.standard_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_id UUID REFERENCES public.regulatory_standards(id) ON DELETE CASCADE,
  requirement_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category requirement_category NOT NULL,
  criticality requirement_criticality NOT NULL,
  verification_method verification_method NOT NULL,
  evidence_required TEXT[] DEFAULT '{}',
  is_mandatory BOOLEAN DEFAULT true,
  parent_requirement_id UUID REFERENCES public.standard_requirements(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add unique constraint if it doesn't exist
DO $$ BEGIN
    ALTER TABLE public.standard_requirements 
    ADD CONSTRAINT standard_requirements_standard_requirement_key UNIQUE(standard_id, requirement_number);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create facility_requirement_compliance table
CREATE TABLE IF NOT EXISTS public.facility_requirement_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_standard_id UUID REFERENCES public.facility_standards(id) ON DELETE CASCADE,
  requirement_id UUID REFERENCES public.standard_requirements(id) ON DELETE CASCADE,
  compliance_status requirement_compliance_status DEFAULT 'Not Started',
  evidence_provided TEXT[] DEFAULT '{}',
  evidence_urls TEXT[] DEFAULT '{}',
  notes TEXT,
  verified_by TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add unique constraint if it doesn't exist
DO $$ BEGIN
    ALTER TABLE public.facility_requirement_compliance 
    ADD CONSTRAINT facility_requirement_compliance_facility_requirement_key UNIQUE(facility_standard_id, requirement_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create standard_audits table
CREATE TABLE IF NOT EXISTS public.standard_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_standard_id UUID REFERENCES public.facility_standards(id) ON DELETE CASCADE,
  audit_type audit_type NOT NULL,
  auditor_name TEXT NOT NULL,
  audit_date TIMESTAMP WITH TIME ZONE NOT NULL,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  certification_granted BOOLEAN DEFAULT false,
  certification_expiry TIMESTAMP WITH TIME ZONE,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  report_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhance existing audit_findings table (safely add columns)
ALTER TABLE public.audit_findings 
ADD COLUMN IF NOT EXISTS standard_audit_id UUID REFERENCES public.standard_audits(id),
ADD COLUMN IF NOT EXISTS requirement_id UUID REFERENCES public.standard_requirements(id),
ADD COLUMN IF NOT EXISTS finding_type finding_type,
ADD COLUMN IF NOT EXISTS corrective_action_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS corrective_action_description TEXT,
ADD COLUMN IF NOT EXISTS corrective_action_due_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS evidence_urls TEXT[] DEFAULT '{}';

-- Create compliance_history table for tracking changes
CREATE TABLE IF NOT EXISTS public.compliance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_standard_id UUID REFERENCES public.facility_standards(id) ON DELETE CASCADE,
  previous_status compliance_status,
  new_status compliance_status NOT NULL,
  previous_score INTEGER,
  new_score INTEGER,
  changed_by TEXT NOT NULL,
  change_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_standard_requirements_standard_id ON public.standard_requirements(standard_id);
CREATE INDEX IF NOT EXISTS idx_facility_requirement_compliance_facility_standard_id ON public.facility_requirement_compliance(facility_standard_id);
CREATE INDEX IF NOT EXISTS idx_facility_requirement_compliance_requirement_id ON public.facility_requirement_compliance(requirement_id);
CREATE INDEX IF NOT EXISTS idx_standard_audits_facility_standard_id ON public.standard_audits(facility_standard_id);
CREATE INDEX IF NOT EXISTS idx_audit_findings_standard_audit_id ON public.audit_findings(standard_audit_id);
CREATE INDEX IF NOT EXISTS idx_compliance_history_facility_standard_id ON public.compliance_history(facility_standard_id);
CREATE INDEX IF NOT EXISTS idx_facility_standards_compliance_status ON public.facility_standards(compliance_status);
CREATE INDEX IF NOT EXISTS idx_facility_standards_expiry_date ON public.facility_standards(expiry_date);

-- Enable RLS on new tables
ALTER TABLE public.standard_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_requirement_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standard_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_history ENABLE ROW LEVEL SECURITY;

-- Create security definer functions
CREATE OR REPLACE FUNCTION public.get_current_user_facilities()
RETURNS UUID[] AS $$
  SELECT 
    CASE 
      WHEN is_admin() THEN ARRAY(SELECT id FROM public.facilities)
      ELSE COALESCE(assigned_facility_ids, '{}')
    END
  FROM public.profiles 
  WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for standard_requirements
CREATE POLICY "Anyone can view standard requirements"
  ON public.standard_requirements FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage standard requirements"
  ON public.standard_requirements FOR ALL
  USING (is_admin());

-- RLS Policies for facility_requirement_compliance
CREATE POLICY "Users can view facility requirement compliance for their facilities"
  ON public.facility_requirement_compliance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.facility_standards fs
      WHERE fs.id = facility_standard_id
      AND fs.facility_id = ANY(get_current_user_facilities())
    )
  );

CREATE POLICY "Users can manage facility requirement compliance for their facilities"
  ON public.facility_requirement_compliance FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.facility_standards fs
      WHERE fs.id = facility_standard_id
      AND fs.facility_id = ANY(get_current_user_facilities())
    )
  );

-- RLS Policies for standard_audits
CREATE POLICY "Users can view standard audits for their facilities"
  ON public.standard_audits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.facility_standards fs
      WHERE fs.id = facility_standard_id
      AND fs.facility_id = ANY(get_current_user_facilities())
    )
  );

CREATE POLICY "Users can manage standard audits for their facilities"
  ON public.standard_audits FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.facility_standards fs
      WHERE fs.id = facility_standard_id
      AND fs.facility_id = ANY(get_current_user_facilities())
    )
  );

-- RLS Policies for compliance_history
CREATE POLICY "Users can view compliance history for their facilities"
  ON public.compliance_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.facility_standards fs
      WHERE fs.id = facility_standard_id
      AND fs.facility_id = ANY(get_current_user_facilities())
    )
  );

CREATE POLICY "Users can insert compliance history for their facilities"
  ON public.compliance_history FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.facility_standards fs
      WHERE fs.id = facility_standard_id
      AND fs.facility_id = ANY(get_current_user_facilities())
    )
  );

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers (safely)
DO $$ BEGIN
    CREATE TRIGGER update_standard_requirements_updated_at
        BEFORE UPDATE ON public.standard_requirements
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_facility_requirement_compliance_updated_at
        BEFORE UPDATE ON public.facility_requirement_compliance
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_standard_audits_updated_at
        BEFORE UPDATE ON public.standard_audits
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create trigger to track compliance status changes
CREATE OR REPLACE FUNCTION public.track_compliance_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.compliance_status IS DISTINCT FROM NEW.compliance_status OR 
     OLD.compliance_score IS DISTINCT FROM NEW.compliance_score THEN
    INSERT INTO public.compliance_history (
      facility_standard_id,
      previous_status,
      new_status,
      previous_score,
      new_score,
      changed_by,
      change_reason
    ) VALUES (
      NEW.id,
      OLD.compliance_status,
      NEW.compliance_status,
      OLD.compliance_score,
      NEW.compliance_score,
      COALESCE(NEW.auditor_name, 'System'),
      'Status or score updated'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    CREATE TRIGGER track_facility_standards_changes
        AFTER UPDATE ON public.facility_standards
        FOR EACH ROW EXECUTE FUNCTION public.track_compliance_changes();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;