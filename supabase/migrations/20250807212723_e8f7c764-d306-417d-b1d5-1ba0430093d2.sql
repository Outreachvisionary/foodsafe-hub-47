-- Add minimal RLS policies for training tables (auth users only)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_courses' AND policyname='Auth users can view courses') THEN
    CREATE POLICY "Auth users can view courses" ON public.training_courses FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_courses' AND policyname='Users can create courses') THEN
    CREATE POLICY "Users can create courses" ON public.training_courses FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid()::text);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_courses' AND policyname='Users can update their own courses') THEN
    CREATE POLICY "Users can update their own courses" ON public.training_courses FOR UPDATE USING (is_admin() OR created_by = auth.uid()::text);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_modules' AND policyname='Auth users can view modules') THEN
    CREATE POLICY "Auth users can view modules" ON public.training_modules FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_modules' AND policyname='Auth users can create modules') THEN
    CREATE POLICY "Auth users can create modules" ON public.training_modules FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_modules' AND policyname='Auth users can update modules') THEN
    CREATE POLICY "Auth users can update modules" ON public.training_modules FOR UPDATE USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_sessions' AND policyname='Auth users can view sessions') THEN
    CREATE POLICY "Auth users can view sessions" ON public.training_sessions FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_sessions' AND policyname='Users can create sessions') THEN
    CREATE POLICY "Users can create sessions" ON public.training_sessions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid()::text);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_sessions' AND policyname='Users can update their own sessions') THEN
    CREATE POLICY "Users can update their own sessions" ON public.training_sessions FOR UPDATE USING (is_admin() OR created_by = auth.uid()::text);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_records' AND policyname='Auth users can view records') THEN
    CREATE POLICY "Auth users can view records" ON public.training_records FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_records' AND policyname='Auth users can create records') THEN
    CREATE POLICY "Auth users can create records" ON public.training_records FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_records' AND policyname='Users can update own records or admins') THEN
    CREATE POLICY "Users can update own records or admins" ON public.training_records FOR UPDATE USING (is_admin() OR employee_id = auth.uid()::text);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_plans' AND policyname='Auth users can view plans') THEN
    CREATE POLICY "Auth users can view plans" ON public.training_plans FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_plans' AND policyname='Users can create plans') THEN
    CREATE POLICY "Users can create plans" ON public.training_plans FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid()::text);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_plans' AND policyname='Users can update their own plans') THEN
    CREATE POLICY "Users can update their own plans" ON public.training_plans FOR UPDATE USING (is_admin() OR created_by = auth.uid()::text);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_materials' AND policyname='Auth users can view materials') THEN
    CREATE POLICY "Auth users can view materials" ON public.training_materials FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_materials' AND policyname='Users can create materials') THEN
    CREATE POLICY "Users can create materials" ON public.training_materials FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid()::text);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_materials' AND policyname='Users can update their own materials') THEN
    CREATE POLICY "Users can update their own materials" ON public.training_materials FOR UPDATE USING (is_admin() OR created_by = auth.uid()::text);
  END IF;
END $$;