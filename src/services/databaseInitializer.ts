
import { supabase } from '@/integrations/supabase/client';

// Initialize required database tables if they don't exist
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Check if supplier_approval_workflows table exists
    const { data: workflowsData, error: workflowsError } = await supabase
      .from('supplier_approval_workflows')
      .select('id')
      .limit(1);
    
    if (workflowsError && workflowsError.code === '42P01') {
      console.log('Creating supplier_approval_workflows table');
      // Table doesn't exist, let's create it later
    }

    // Check if supplier_risk_assessments table exists
    const { data: assessmentsData, error: assessmentsError } = await supabase
      .from('supplier_risk_assessments')
      .select('id')
      .limit(1);
    
    if (assessmentsError && assessmentsError.code === '42P01') {
      console.log('Creating supplier_risk_assessments table');
      // Table doesn't exist, let's create it later
    }

    // Check if standard_requirements table exists
    const { data: requirementsData, error: requirementsError } = await supabase
      .from('standard_requirements')
      .select('id')
      .limit(1);
    
    if (requirementsError && requirementsError.code === '42P01') {
      console.log('Creating standard_requirements table');
      // Table doesn't exist, let's create it later
    }

    // If any of the checks failed because tables don't exist, console log the SQL that needs to be run
    if ((workflowsError && workflowsError.code === '42P01') || 
        (assessmentsError && assessmentsError.code === '42P01') ||
        (requirementsError && requirementsError.code === '42P01')) {
      
      console.log(`
SQL that needs to be run to create missing tables:

-- Create supplier_approval_workflows table if it doesn't exist
CREATE TABLE IF NOT EXISTS supplier_approval_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES suppliers(id) NOT NULL,
  status TEXT NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 1,
  initiated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  initiated_by TEXT NOT NULL,
  notes TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  approval_history JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create supplier_risk_assessments table if it doesn't exist
CREATE TABLE IF NOT EXISTS supplier_risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES suppliers(id) NOT NULL,
  assessed_by TEXT NOT NULL,
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  overall_score NUMERIC NOT NULL,
  risk_level TEXT NOT NULL,
  food_safety_score NUMERIC,
  quality_system_score NUMERIC,
  regulatory_score NUMERIC,
  delivery_score NUMERIC,
  traceability_score NUMERIC,
  notes TEXT,
  next_assessment_date TIMESTAMP WITH TIME ZONE,
  risk_factors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create standard_requirements table if it doesn't exist
CREATE TABLE IF NOT EXISTS standard_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  standard TEXT NOT NULL,
  name TEXT NOT NULL, 
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert some sample standard requirements
INSERT INTO standard_requirements (standard, name, description, category)
VALUES 
  ('SQF', 'Food Safety Plan', 'Comprehensive HACCP-based food safety plan', 'Documentation'),
  ('SQF', 'Management Responsibility', 'Commitment from senior management', 'Leadership'),
  ('SQF', 'Food Safety System', 'Documented system for food safety', 'System'),
  ('BRC GS2', 'Senior Management Commitment', 'Demonstrated commitment to standard', 'Leadership'),
  ('BRC GS2', 'Food Safety Plan', 'HACCP-based plan', 'Documentation'),
  ('BRC GS2', 'Site Standards', 'Physical standards for safety', 'Facilities'),
  ('FSSC 22000', 'Management System', 'Food safety management system', 'System'),
  ('FSSC 22000', 'PRPs', 'Prerequisite programs', 'Prerequisites'),
  ('FSSC 22000', 'HACCP', 'HACCP principles and critical control points', 'Documentation'),
  ('ISO 22000', 'Documentation Requirements', 'Documented procedures and records', 'Documentation'),
  ('ISO 22000', 'Management Responsibility', 'Leadership commitment to food safety', 'Leadership'),
  ('ISO 22000', 'Resource Management', 'Provision of resources for system', 'Resources'),
  ('HACCP', 'Hazard Analysis', 'Identification of hazards', 'Risk Assessment'),
  ('HACCP', 'Critical Control Points', 'Points to prevent/eliminate hazards', 'Controls'),
  ('HACCP', 'Monitoring Procedures', 'Procedures to monitor CCPs', 'Monitoring')
ON CONFLICT DO NOTHING;
      `);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Run initialization check
initializeDatabase();
