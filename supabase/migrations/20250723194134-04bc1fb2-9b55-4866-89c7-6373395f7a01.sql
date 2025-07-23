-- Create enums for standards module
CREATE TYPE compliance_status AS ENUM ('Not Started', 'In Progress', 'Compliant', 'Non-Compliant', 'Expired', 'Under Review');
CREATE TYPE requirement_category AS ENUM ('Documentation', 'Training', 'Process', 'Infrastructure', 'Monitoring', 'Verification');
CREATE TYPE requirement_criticality AS ENUM ('Critical', 'Major', 'Minor');
CREATE TYPE verification_method AS ENUM ('Document Review', 'Physical Inspection', 'Testing', 'Interview', 'Observation');
CREATE TYPE requirement_compliance_status AS ENUM ('Compliant', 'Non-Compliant', 'Partial', 'Not Applicable', 'Pending');
CREATE TYPE audit_type AS ENUM ('Internal', 'External', 'Certification', 'Surveillance', 'Follow-up');
CREATE TYPE finding_type AS ENUM ('Non-Conformity', 'Observation', 'Opportunity for Improvement');
CREATE TYPE finding_severity AS ENUM ('Critical', 'Major', 'Minor');
CREATE TYPE finding_status AS ENUM ('Open', 'In Progress', 'Closed', 'Verified');

-- Enhance regulatory_standards table
ALTER TABLE public.regulatory_standards 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General',
ADD COLUMN IF NOT EXISTS requirements_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_reviewed_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS review_frequency_months INTEGER DEFAULT 12,
ADD COLUMN IF NOT EXISTS is_mandatory BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS applicable_regions TEXT[],
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Enhance facility_standards table
ALTER TABLE public.facility_standards 
ADD COLUMN IF NOT EXISTS assigned_by TEXT,
ADD COLUMN IF NOT EXISTS assigned_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS last_assessment_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS next_assessment_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS compliance_score NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS requirements_met INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_requirements INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS evidence_documents TEXT[],
ADD COLUMN IF NOT EXISTS responsible_person TEXT,
ADD COLUMN IF NOT EXISTS assessment_frequency_months INTEGER DEFAULT 12;

-- Create standard_requirements table
CREATE TABLE IF NOT EXISTS public.standard_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    standard_id UUID REFERENCES public.regulatory_standards(id) ON DELETE CASCADE,
    requirement_number TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category requirement_category NOT NULL DEFAULT 'Process',
    criticality requirement_criticality NOT NULL DEFAULT 'Major',
    verification_method verification_method NOT NULL DEFAULT 'Document Review',
    guidance_notes TEXT,
    applicable_to TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create facility_requirement_compliance table
CREATE TABLE IF NOT EXISTS public.facility_requirement_compliance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_standard_id UUID REFERENCES public.facility_standards(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES public.standard_requirements(id) ON DELETE CASCADE,
    compliance_status requirement_compliance_status NOT NULL DEFAULT 'Pending',
    evidence_provided TEXT,
    verification_date TIMESTAMP WITH TIME ZONE,
    verified_by TEXT,
    verification_notes TEXT,
    next_verification_date TIMESTAMP WITH TIME ZONE,
    non_compliance_reason TEXT,
    corrective_actions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(facility_standard_id, requirement_id)
);

-- Create standard_audits table
CREATE TABLE IF NOT EXISTS public.standard_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_standard_id UUID REFERENCES public.facility_standards(id) ON DELETE CASCADE,
    audit_type audit_type NOT NULL DEFAULT 'Internal',
    audit_date TIMESTAMP WITH TIME ZONE NOT NULL,
    auditor_name TEXT NOT NULL,
    audit_scope TEXT,
    findings_count INTEGER DEFAULT 0,
    compliance_score NUMERIC(5,2),
    certification_achieved BOOLEAN DEFAULT false,
    certificate_number TEXT,
    certificate_expiry_date TIMESTAMP WITH TIME ZONE,
    report_document_id UUID,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create audit_findings table (if not exists)
CREATE TABLE IF NOT EXISTS public.audit_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID REFERENCES public.standard_audits(id) ON DELETE CASCADE,
    finding_type finding_type NOT NULL DEFAULT 'Non-Conformity',
    severity finding_severity NOT NULL DEFAULT 'Major',
    description TEXT NOT NULL,
    requirement_reference TEXT,
    evidence TEXT,
    corrective_action_required TEXT,
    target_completion_date TIMESTAMP WITH TIME ZONE,
    status finding_status NOT NULL DEFAULT 'Open',
    assigned_to TEXT,
    capa_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create compliance_history table
CREATE TABLE IF NOT EXISTS public.compliance_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_standard_id UUID REFERENCES public.facility_standards(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    change_reason TEXT,
    changed_by TEXT NOT NULL,
    assessment_date TIMESTAMP WITH TIME ZONE,
    compliance_score NUMERIC(5,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_standard_requirements_standard_id ON public.standard_requirements(standard_id);
CREATE INDEX IF NOT EXISTS idx_facility_requirement_compliance_facility_standard_id ON public.facility_requirement_compliance(facility_standard_id);
CREATE INDEX IF NOT EXISTS idx_facility_requirement_compliance_requirement_id ON public.facility_requirement_compliance(requirement_id);
CREATE INDEX IF NOT EXISTS idx_standard_audits_facility_standard_id ON public.standard_audits(facility_standard_id);
CREATE INDEX IF NOT EXISTS idx_audit_findings_audit_id ON public.audit_findings(audit_id);
CREATE INDEX IF NOT EXISTS idx_compliance_history_facility_standard_id ON public.compliance_history(facility_standard_id);
CREATE INDEX IF NOT EXISTS idx_facility_standards_compliance_status ON public.facility_standards(compliance_status);
CREATE INDEX IF NOT EXISTS idx_regulatory_standards_category ON public.regulatory_standards(category);

-- Enable RLS on all tables
ALTER TABLE public.regulatory_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standard_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_requirement_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standard_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Regulatory Standards policies
CREATE POLICY "Users can view regulatory standards" ON public.regulatory_standards
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage regulatory standards" ON public.regulatory_standards
    FOR ALL USING (is_admin());

-- Facility Standards policies
CREATE POLICY "Users can view facility standards in their org" ON public.facility_standards
    FOR SELECT USING (
        is_admin() OR 
        EXISTS (
            SELECT 1 FROM facilities f 
            WHERE f.id = facility_standards.facility_id 
            AND (f.organization_id = get_current_user_org_id() OR get_current_user_org_id() IS NULL)
        )
    );

CREATE POLICY "Users can manage facility standards in their org" ON public.facility_standards
    FOR ALL USING (
        is_admin() OR 
        EXISTS (
            SELECT 1 FROM facilities f 
            WHERE f.id = facility_standards.facility_id 
            AND (f.organization_id = get_current_user_org_id() OR get_current_user_org_id() IS NULL)
        )
    );

-- Standard Requirements policies
CREATE POLICY "Users can view standard requirements" ON public.standard_requirements
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage standard requirements" ON public.standard_requirements
    FOR ALL USING (is_admin());

-- Facility Requirement Compliance policies
CREATE POLICY "Users can view facility requirement compliance in their org" ON public.facility_requirement_compliance
    FOR SELECT USING (
        is_admin() OR 
        EXISTS (
            SELECT 1 FROM facility_standards fs 
            JOIN facilities f ON fs.facility_id = f.id
            WHERE fs.id = facility_requirement_compliance.facility_standard_id 
            AND (f.organization_id = get_current_user_org_id() OR get_current_user_org_id() IS NULL)
        )
    );

CREATE POLICY "Users can manage facility requirement compliance in their org" ON public.facility_requirement_compliance
    FOR ALL USING (
        is_admin() OR 
        EXISTS (
            SELECT 1 FROM facility_standards fs 
            JOIN facilities f ON fs.facility_id = f.id
            WHERE fs.id = facility_requirement_compliance.facility_standard_id 
            AND (f.organization_id = get_current_user_org_id() OR get_current_user_org_id() IS NULL)
        )
    );

-- Standard Audits policies
CREATE POLICY "Users can view standard audits in their org" ON public.standard_audits
    FOR SELECT USING (
        is_admin() OR 
        EXISTS (
            SELECT 1 FROM facility_standards fs 
            JOIN facilities f ON fs.facility_id = f.id
            WHERE fs.id = standard_audits.facility_standard_id 
            AND (f.organization_id = get_current_user_org_id() OR get_current_user_org_id() IS NULL)
        )
    );

CREATE POLICY "Users can manage standard audits in their org" ON public.standard_audits
    FOR ALL USING (
        is_admin() OR 
        EXISTS (
            SELECT 1 FROM facility_standards fs 
            JOIN facilities f ON fs.facility_id = f.id
            WHERE fs.id = standard_audits.facility_standard_id 
            AND (f.organization_id = get_current_user_org_id() OR get_current_user_org_id() IS NULL)
        )
    );

-- Audit Findings policies (inherit from audits)
CREATE POLICY "Users can view audit findings in their org" ON public.audit_findings
    FOR SELECT USING (
        is_admin() OR 
        EXISTS (
            SELECT 1 FROM standard_audits sa
            JOIN facility_standards fs ON sa.facility_standard_id = fs.id
            JOIN facilities f ON fs.facility_id = f.id
            WHERE sa.id = audit_findings.audit_id 
            AND (f.organization_id = get_current_user_org_id() OR get_current_user_org_id() IS NULL)
        )
    );

CREATE POLICY "Users can manage audit findings in their org" ON public.audit_findings
    FOR ALL USING (
        is_admin() OR 
        EXISTS (
            SELECT 1 FROM standard_audits sa
            JOIN facility_standards fs ON sa.facility_standard_id = fs.id
            JOIN facilities f ON fs.facility_id = f.id
            WHERE sa.id = audit_findings.audit_id 
            AND (f.organization_id = get_current_user_org_id() OR get_current_user_org_id() IS NULL)
        )
    );

-- Compliance History policies
CREATE POLICY "Users can view compliance history in their org" ON public.compliance_history
    FOR SELECT USING (
        is_admin() OR 
        EXISTS (
            SELECT 1 FROM facility_standards fs 
            JOIN facilities f ON fs.facility_id = f.id
            WHERE fs.id = compliance_history.facility_standard_id 
            AND (f.organization_id = get_current_user_org_id() OR get_current_user_org_id() IS NULL)
        )
    );

CREATE POLICY "Users can insert compliance history in their org" ON public.compliance_history
    FOR INSERT WITH CHECK (
        is_admin() OR 
        EXISTS (
            SELECT 1 FROM facility_standards fs 
            JOIN facilities f ON fs.facility_id = f.id
            WHERE fs.id = compliance_history.facility_standard_id 
            AND (f.organization_id = get_current_user_org_id() OR get_current_user_org_id() IS NULL)
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_regulatory_standards_updated_at
    BEFORE UPDATE ON public.regulatory_standards
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_facility_standards_updated_at
    BEFORE UPDATE ON public.facility_standards
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_standard_requirements_updated_at
    BEFORE UPDATE ON public.standard_requirements
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_facility_requirement_compliance_updated_at
    BEFORE UPDATE ON public.facility_requirement_compliance
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_standard_audits_updated_at
    BEFORE UPDATE ON public.standard_audits
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_audit_findings_updated_at
    BEFORE UPDATE ON public.audit_findings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to track compliance status changes
CREATE OR REPLACE FUNCTION public.track_compliance_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only track if compliance_status actually changed
    IF OLD.compliance_status IS DISTINCT FROM NEW.compliance_status THEN
        INSERT INTO public.compliance_history (
            facility_standard_id,
            previous_status,
            new_status,
            change_reason,
            changed_by,
            assessment_date,
            compliance_score,
            notes
        ) VALUES (
            NEW.id,
            OLD.compliance_status,
            NEW.compliance_status,
            'Status updated',
            COALESCE(NEW.responsible_person, 'System'),
            NEW.last_assessment_date,
            NEW.compliance_score,
            NEW.notes
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for facility_standards status tracking
CREATE TRIGGER track_facility_standards_compliance_changes
    AFTER UPDATE ON public.facility_standards
    FOR EACH ROW EXECUTE FUNCTION public.track_compliance_status_change();

-- Insert seed data for common regulatory standards
INSERT INTO public.regulatory_standards (name, code, description, authority, category, version, is_mandatory, applicable_regions, documentation_url, status) VALUES
('Safe Quality Food (SQF)', 'SQF', 'Safe Quality Food standard for food safety and quality management', 'SQFI', 'Food Safety', '9.0', true, ARRAY['Global'], 'https://www.sqfi.com/', 'active'),
('British Retail Consortium (BRC)', 'BRC', 'Global standard for food safety in the retail industry', 'BRC', 'Food Safety', '8.0', true, ARRAY['Global'], 'https://www.brcgs.com/', 'active'),
('International Featured Standards (IFS)', 'IFS', 'International standard for food safety and quality', 'IFS', 'Food Safety', '7.0', true, ARRAY['Europe'], 'https://www.ifs-certification.com/', 'active'),
('FDA Food Safety Modernization Act', 'FSMA', 'US federal law for food safety prevention', 'FDA', 'Regulatory', '2011', true, ARRAY['United States'], 'https://www.fda.gov/food/food-safety-modernization-act-fsma', 'active'),
('Hazard Analysis Critical Control Points', 'HACCP', 'Systematic preventive approach to food safety', 'Codex Alimentarius', 'Food Safety', '2020', true, ARRAY['Global'], 'https://www.fao.org/3/y1579e/y1579e03.htm', 'active'),
('ISO 22000', 'ISO22000', 'International standard for food safety management systems', 'ISO', 'Food Safety', '2018', false, ARRAY['Global'], 'https://www.iso.org/iso-22000-food-safety-management.html', 'active'),
('Global Food Safety Initiative (GFSI)', 'GFSI', 'Benchmarking requirements for food safety schemes', 'GFSI', 'Food Safety', '2021', false, ARRAY['Global'], 'https://mygfsi.com/', 'active'),
('Organic Standards (USDA)', 'USDA-ORGANIC', 'USDA National Organic Program standards', 'USDA', 'Organic', '2020', false, ARRAY['United States'], 'https://www.ams.usda.gov/about-ams/programs-offices/national-organic-program', 'active'),
('GlobalGAP', 'GLOBALGAP', 'Good Agricultural Practices standard', 'GlobalGAP', 'Agriculture', '5.4', false, ARRAY['Global'], 'https://www.globalgap.org/', 'active'),
('Kosher Certification', 'KOSHER', 'Jewish dietary law compliance', 'Various Kosher Agencies', 'Religious/Dietary', '2023', false, ARRAY['Global'], 'https://www.ok.org/', 'active')
ON CONFLICT (code) DO NOTHING;