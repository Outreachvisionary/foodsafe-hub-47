-- Ensure core training tables exist (no policies in this step)
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
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
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
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS public.training_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  description TEXT,
  courses UUID[] NOT NULL DEFAULT ARRAY[]::UUID[],
  target_roles TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  target_departments TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_by TEXT,
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

CREATE TABLE IF NOT EXISTS public.training_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.training_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL,
  content_url TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for created tables
ALTER TABLE public.training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;