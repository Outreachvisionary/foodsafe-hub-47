-- Align existing training tables by adding missing created_by columns if needed
ALTER TABLE public.training_courses ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE public.training_sessions ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE public.training_plans   ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE public.training_materials ADD COLUMN IF NOT EXISTS created_by TEXT;

-- Ensure updated_at exists where needed
ALTER TABLE public.training_courses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE public.training_modules ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE public.training_sessions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE public.training_records ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE public.training_plans ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE public.training_materials ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();