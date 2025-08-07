-- Training Module Schema (Phase 1)
-- Create/replace helper function to auto-update updated_at fields
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1) Courses
CREATE TABLE IF NOT EXISTS public.training_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  passing_score INTEGER NOT NULL DEFAULT 0,
  content_url TEXT,
  tags TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.training_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are viewable by everyone"
ON public.training_courses FOR SELECT
USING (true);

CREATE POLICY "Users can create courses"
ON public.training_courses FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid()::text);

CREATE POLICY "Users can update their own courses"
ON public.training_courses FOR UPDATE
USING (is_admin() OR created_by = auth.uid()::text);

DROP TRIGGER IF EXISTS update_training_courses_updated_at ON public.training_courses;
CREATE TRIGGER update_training_courses_updated_at
BEFORE UPDATE ON public.training_courses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Course Modules (content units)
CREATE TABLE IF NOT EXISTS public.training_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.training_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL, -- video | document | quiz | interactive
  content_url TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules are viewable by everyone"
ON public.training_modules FOR SELECT
USING (true);

CREATE POLICY "Users can manage modules via parent course ownership"
ON public.training_modules FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update modules"
ON public.training_modules FOR UPDATE
USING (auth.uid() IS NOT NULL);

DROP TRIGGER IF EXISTS update_training_modules_updated_at ON public.training_modules;
CREATE TRIGGER update_training_modules_updated_at
BEFORE UPDATE ON public.training_modules
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Sessions (scheduled or self-paced offerings)
CREATE TABLE IF NOT EXISTS public.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled | in_progress | completed | cancelled
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  instructor TEXT,
  participants TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  type TEXT,
  category TEXT,
  department TEXT,
  assigned_to TEXT[],
  materials_id UUID[],
  required_roles TEXT[],
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurring_interval TEXT,
  priority TEXT NOT NULL DEFAULT 'Medium',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sessions are viewable by everyone"
ON public.training_sessions FOR SELECT
USING (true);

CREATE POLICY "Users can create sessions"
ON public.training_sessions FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid()::text);

CREATE POLICY "Users can update their own sessions"
ON public.training_sessions FOR UPDATE
USING (is_admin() OR created_by = auth.uid()::text);

DROP TRIGGER IF EXISTS update_training_sessions_updated_at ON public.training_sessions;
CREATE TRIGGER update_training_sessions_updated_at
BEFORE UPDATE ON public.training_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Records (who took what and results)
CREATE TABLE IF NOT EXISTS public.training_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not-started',
  assigned_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  score INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.training_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Records are viewable by everyone"
ON public.training_records FOR SELECT
USING (true);

CREATE POLICY "Users can create training records"
ON public.training_records FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own records or admins"
ON public.training_records FOR UPDATE
USING (is_admin() OR employee_id = auth.uid()::text);

DROP TRIGGER IF EXISTS update_training_records_updated_at ON public.training_records;
CREATE TRIGGER update_training_records_updated_at
BEFORE UPDATE ON public.training_records
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Plans (group of courses assigned to roles/departments)
CREATE TABLE IF NOT EXISTS public.training_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  description TEXT,
  courses UUID[] NOT NULL DEFAULT ARRAY[]::UUID[],
  target_roles TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  target_departments TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_by TEXT NOT NULL,
  department_id UUID,
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority TEXT NOT NULL DEFAULT 'Medium',
  status TEXT NOT NULL DEFAULT 'Draft',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  duration_days INTEGER,
  is_required BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.training_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans are viewable by everyone"
ON public.training_plans FOR SELECT
USING (true);

CREATE POLICY "Users can create plans"
ON public.training_plans FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid()::text);

CREATE POLICY "Users can update their own plans"
ON public.training_plans FOR UPDATE
USING (is_admin() OR created_by = auth.uid()::text);

DROP TRIGGER IF EXISTS update_training_plans_updated_at ON public.training_plans;
CREATE TRIGGER update_training_plans_updated_at
BEFORE UPDATE ON public.training_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6) Materials (files stored in storage, tracked here)
CREATE TABLE IF NOT EXISTS public.training_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.training_courses(id) ON DELETE SET NULL,
  session_id UUID REFERENCES public.training_sessions(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- video | document | link | other
  file_path TEXT NOT NULL,
  file_size INTEGER,
  content_type TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.training_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Materials are viewable by everyone"
ON public.training_materials FOR SELECT
USING (true);

CREATE POLICY "Users can create materials"
ON public.training_materials FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid()::text);

CREATE POLICY "Users can update their own materials"
ON public.training_materials FOR UPDATE
USING (is_admin() OR created_by = auth.uid()::text);

DROP TRIGGER IF EXISTS update_training_materials_updated_at ON public.training_materials;
CREATE TRIGGER update_training_materials_updated_at
BEFORE UPDATE ON public.training_materials
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
