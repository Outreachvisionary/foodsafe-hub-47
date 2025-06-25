
-- Create comprehensive schema for certifications and related modules

-- Create certifications table
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  issuing_body TEXT NOT NULL,
  validity_period_months INTEGER NOT NULL DEFAULT 12,
  required_score NUMERIC,
  category TEXT NOT NULL DEFAULT 'General',
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by TEXT NOT NULL
);

-- Create employee certifications tracking table
CREATE TABLE IF NOT EXISTS public.employee_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  certification_id UUID REFERENCES public.certifications(id) ON DELETE CASCADE,
  certification_name TEXT NOT NULL,
  issued_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Expired', 'Revoked', 'Pending')),
  certificate_number TEXT,
  issuing_body TEXT NOT NULL,
  department TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create training plans table if not exists
CREATE TABLE IF NOT EXISTS public.training_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  target_roles TEXT[] DEFAULT '{}',
  target_departments TEXT[] DEFAULT '{}',
  courses_included TEXT[] DEFAULT '{}',
  duration_days INTEGER,
  is_required BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Active', 'Inactive', 'Archived')),
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create training sessions table if not exists
CREATE TABLE IF NOT EXISTS public.training_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  training_type TEXT DEFAULT 'Internal' CHECK (training_type IN ('Internal', 'External', 'Online', 'Certification')),
  training_category TEXT DEFAULT 'General' CHECK (training_category IN ('Safety', 'Quality', 'Compliance', 'Technical', 'General')),
  assigned_to TEXT[] DEFAULT '{}',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completion_status TEXT DEFAULT 'Not Started' CHECK (completion_status IN ('Not Started', 'In Progress', 'Completed', 'Overdue', 'Cancelled')),
  required_roles TEXT[] DEFAULT '{}',
  is_recurring BOOLEAN DEFAULT false,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for certifications
CREATE POLICY "Allow read access to certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users" ON public.certifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow update for authenticated users" ON public.certifications FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow delete for authenticated users" ON public.certifications FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create RLS policies for employee certifications
CREATE POLICY "Allow read access to employee certifications" ON public.employee_certifications FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users" ON public.employee_certifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow update for authenticated users" ON public.employee_certifications FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow delete for authenticated users" ON public.employee_certifications FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create RLS policies for training plans
CREATE POLICY "Allow read access to training plans" ON public.training_plans FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users" ON public.training_plans FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow update for authenticated users" ON public.training_plans FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow delete for authenticated users" ON public.training_plans FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create RLS policies for training sessions
CREATE POLICY "Allow read access to training sessions" ON public.training_sessions FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users" ON public.training_sessions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow update for authenticated users" ON public.training_sessions FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow delete for authenticated users" ON public.training_sessions FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employee_certifications_employee_id ON public.employee_certifications(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_certifications_certification_id ON public.employee_certifications(certification_id);
CREATE INDEX IF NOT EXISTS idx_employee_certifications_expiry_date ON public.employee_certifications(expiry_date);
CREATE INDEX IF NOT EXISTS idx_employee_certifications_status ON public.employee_certifications(status);
CREATE INDEX IF NOT EXISTS idx_training_sessions_assigned_to ON public.training_sessions USING GIN(assigned_to);
CREATE INDEX IF NOT EXISTS idx_training_plans_target_roles ON public.training_plans USING GIN(target_roles);

-- Create function to get certification statistics
CREATE OR REPLACE FUNCTION public.get_certification_statistics()
RETURNS TABLE(
  total_certifications BIGINT,
  active_certifications BIGINT,
  expiring_soon BIGINT,
  expired_certifications BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    COUNT(*) as total_certifications,
    COUNT(*) FILTER (WHERE status = 'Active') as active_certifications,
    COUNT(*) FILTER (WHERE status = 'Active' AND expiry_date <= (CURRENT_DATE + INTERVAL '30 days')) as expiring_soon,
    COUNT(*) FILTER (WHERE status = 'Expired' OR expiry_date < CURRENT_DATE) as expired_certifications
  FROM public.employee_certifications;
$$;

-- Create function to get employee certification status
CREATE OR REPLACE FUNCTION public.get_employee_certification_status(emp_id TEXT)
RETURNS TABLE(
  certification_name TEXT,
  status TEXT,
  expiry_date TIMESTAMP WITH TIME ZONE,
  days_until_expiry INTEGER
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    certification_name,
    status,
    expiry_date,
    EXTRACT(DAY FROM (expiry_date - CURRENT_DATE))::INTEGER as days_until_expiry
  FROM public.employee_certifications
  WHERE employee_id = emp_id
  ORDER BY expiry_date ASC;
$$;

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.certifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.employee_certifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.training_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.training_sessions;
