-- Add training materials table for file uploads (PowerPoint, etc.)
CREATE TABLE IF NOT EXISTS public.training_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.training_courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    uploaded_by TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    content_type TEXT, -- PowerPoint, PDF, Video, etc.
    duration_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add training competencies table for GFSI compliance
CREATE TABLE IF NOT EXISTS public.training_competencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- Food Safety, Quality, HACCP, etc.
    required_for_roles TEXT[],
    assessment_criteria TEXT[],
    validity_period_months INTEGER DEFAULT 12,
    is_mandatory BOOLEAN DEFAULT false,
    gfsi_requirement TEXT, -- Reference to specific GFSI requirement
    created_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add training notifications table
CREATE TABLE IF NOT EXISTS public.training_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL, -- reminder, overdue, completion, etc.
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add training compliance tracking table
CREATE TABLE IF NOT EXISTS public.training_compliance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT NOT NULL,
    competency_id UUID REFERENCES public.training_competencies(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, compliant, overdue, expired
    last_training_date TIMESTAMP WITH TIME ZONE,
    next_required_date TIMESTAMP WITH TIME ZONE,
    compliance_score NUMERIC,
    notes TEXT,
    assessed_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add training analytics tracking
CREATE TABLE IF NOT EXISTS public.training_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- start, progress, complete, fail, etc.
    event_data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completion_percentage NUMERIC,
    time_spent_minutes INTEGER
);

-- Enable RLS on all new tables
ALTER TABLE public.training_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for training_materials
CREATE POLICY "Users can view training materials" ON public.training_materials
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create training materials" ON public.training_materials
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND uploaded_by = auth.uid()::text);

CREATE POLICY "Users can update their training materials" ON public.training_materials
    FOR UPDATE USING (auth.uid() IS NOT NULL AND uploaded_by = auth.uid()::text);

-- Create RLS policies for training_competencies
CREATE POLICY "Users can view training competencies" ON public.training_competencies
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin users can manage training competencies" ON public.training_competencies
    FOR ALL USING (is_admin() OR auth.uid()::text = created_by);

-- Create RLS policies for training_notifications
CREATE POLICY "Users can view their notifications" ON public.training_notifications
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their notifications" ON public.training_notifications
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "System can create notifications" ON public.training_notifications
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for training_compliance
CREATE POLICY "Users can view training compliance" ON public.training_compliance
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin users can manage training compliance" ON public.training_compliance
    FOR ALL USING (is_admin() OR auth.uid()::text = assessed_by);

-- Create RLS policies for training_analytics
CREATE POLICY "Users can view their training analytics" ON public.training_analytics
    FOR SELECT USING (auth.uid()::text = employee_id OR is_admin());

CREATE POLICY "System can insert training analytics" ON public.training_analytics
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_training_materials_session_id ON public.training_materials(session_id);
CREATE INDEX IF NOT EXISTS idx_training_materials_course_id ON public.training_materials(course_id);
CREATE INDEX IF NOT EXISTS idx_training_notifications_user_id ON public.training_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_training_notifications_session_id ON public.training_notifications(session_id);
CREATE INDEX IF NOT EXISTS idx_training_compliance_employee_id ON public.training_compliance(employee_id);
CREATE INDEX IF NOT EXISTS idx_training_compliance_competency_id ON public.training_compliance(competency_id);
CREATE INDEX IF NOT EXISTS idx_training_analytics_session_id ON public.training_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_training_analytics_employee_id ON public.training_analytics(employee_id);

-- Insert GFSI compliance competencies
INSERT INTO public.training_competencies (name, description, category, required_for_roles, assessment_criteria, validity_period_months, is_mandatory, gfsi_requirement, created_by) VALUES
('Food Safety Fundamentals', 'Basic food safety principles and hazard awareness', 'Food Safety', ARRAY['Production Worker', 'Quality Technician', 'Supervisor'], ARRAY['Understanding of basic food safety principles', 'Identification of common food hazards', 'Knowledge of personal hygiene requirements'], 12, true, 'GFSI Benchmark v2022.1 - Element A.1.1', 'system'),
('HACCP Principles', 'Hazard Analysis and Critical Control Points system understanding', 'HACCP', ARRAY['Quality Manager', 'Production Manager', 'HACCP Team Member'], ARRAY['Knowledge of 7 HACCP principles', 'Ability to conduct hazard analysis', 'Understanding of CCP monitoring'], 24, true, 'GFSI Benchmark v2022.1 - Element A.1.2', 'system'),
('Good Manufacturing Practices', 'GMP requirements and implementation', 'GMP', ARRAY['Production Worker', 'Maintenance', 'Quality Technician'], ARRAY['Understanding of GMP requirements', 'Knowledge of sanitation procedures', 'Equipment cleaning procedures'], 12, true, 'GFSI Benchmark v2022.1 - Element A.1.3', 'system'),
('Allergen Management', 'Allergen control and cross-contamination prevention', 'Allergen Control', ARRAY['Production Worker', 'Quality Technician', 'Supervisor'], ARRAY['Identification of major allergens', 'Cross-contamination prevention', 'Allergen cleaning procedures'], 12, true, 'GFSI Benchmark v2022.1 - Element A.1.4', 'system'),
('Traceability and Recall', 'Product traceability and recall procedures', 'Traceability', ARRAY['Quality Manager', 'Production Manager', 'Warehouse Supervisor'], ARRAY['Understanding of traceability requirements', 'Mock recall execution', 'Record keeping procedures'], 12, true, 'GFSI Benchmark v2022.1 - Element A.1.5', 'system'),
('Supplier Verification', 'Supplier assessment and verification procedures', 'Supply Chain', ARRAY['Quality Manager', 'Purchasing Manager'], ARRAY['Supplier approval process', 'Incoming inspection procedures', 'Certificate management'], 24, true, 'GFSI Benchmark v2022.1 - Element A.2.1', 'system'),
('Environmental Monitoring', 'Environmental monitoring programs and procedures', 'Environmental Control', ARRAY['Quality Technician', 'Production Supervisor'], ARRAY['Sampling procedures', 'Result interpretation', 'Corrective action implementation'], 12, true, 'GFSI Benchmark v2022.1 - Element A.3.1', 'system'),
('Personal Hygiene', 'Personal hygiene requirements and practices', 'Hygiene', ARRAY['Production Worker', 'Maintenance', 'Visitor'], ARRAY['Hand washing procedures', 'Protective clothing use', 'Health reporting requirements'], 6, true, 'GFSI Benchmark v2022.1 - Element A.4.1', 'system');

-- Create storage bucket for training materials if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('training-materials', 'training-materials', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for training materials
CREATE POLICY "Users can view training material files" ON storage.objects
    FOR SELECT USING (bucket_id = 'training-materials' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can upload training material files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'training-materials' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their training material files" ON storage.objects
    FOR UPDATE USING (bucket_id = 'training-materials' AND auth.uid() IS NOT NULL);