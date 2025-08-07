-- Fix policy existence checks using correct column name policyname
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_courses' AND policyname='Courses are viewable by everyone'
  ) THEN
    CREATE POLICY "Courses are viewable by everyone" ON public.training_courses FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_courses' AND policyname='Users can create courses'
  ) THEN
    CREATE POLICY "Users can create courses" ON public.training_courses FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid()::text);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_courses' AND policyname='Users can update their own courses'
  ) THEN
    CREATE POLICY "Users can update their own courses" ON public.training_courses FOR UPDATE USING (is_admin() OR created_by = auth.uid()::text);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_modules' AND policyname='Modules are viewable by everyone'
  ) THEN
    CREATE POLICY "Modules are viewable by everyone" ON public.training_modules FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_modules' AND policyname='Users can manage modules via parent course ownership'
  ) THEN
    CREATE POLICY "Users can manage modules via parent course ownership" ON public.training_modules FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_modules' AND policyname='Users can update modules'
  ) THEN
    CREATE POLICY "Users can update modules" ON public.training_modules FOR UPDATE USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_sessions' AND policyname='Sessions are viewable by everyone'
  ) THEN
    CREATE POLICY "Sessions are viewable by everyone" ON public.training_sessions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_sessions' AND policyname='Users can create sessions'
  ) THEN
    CREATE POLICY "Users can create sessions" ON public.training_sessions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid()::text);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_sessions' AND policyname='Users can update their own sessions'
  ) THEN
    CREATE POLICY "Users can update their own sessions" ON public.training_sessions FOR UPDATE USING (is_admin() OR created_by = auth.uid()::text);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_records' AND policyname='Records are viewable by everyone'
  ) THEN
    CREATE POLICY "Records are viewable by everyone" ON public.training_records FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_records' AND policyname='Users can create training records'
  ) THEN
    CREATE POLICY "Users can create training records" ON public.training_records FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_records' AND policyname='Users can update their own records or admins'
  ) THEN
    CREATE POLICY "Users can update their own records or admins" ON public.training_records FOR UPDATE USING (is_admin() OR employee_id = auth.uid()::text);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_plans' AND policyname='Plans are viewable by everyone'
  ) THEN
    CREATE POLICY "Plans are viewable by everyone" ON public.training_plans FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_plans' AND policyname='Users can create plans'
  ) THEN
    CREATE POLICY "Users can create plans" ON public.training_plans FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid()::text);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_plans' AND policyname='Users can update their own plans'
  ) THEN
    CREATE POLICY "Users can update their own plans" ON public.training_plans FOR UPDATE USING (is_admin() OR created_by = auth.uid()::text);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_materials' AND policyname='Materials are viewable by everyone'
  ) THEN
    CREATE POLICY "Materials are viewable by everyone" ON public.training_materials FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_materials' AND policyname='Users can create materials'
  ) THEN
    CREATE POLICY "Users can create materials" ON public.training_materials FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid()::text);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='training_materials' AND policyname='Users can update their own materials'
  ) THEN
    CREATE POLICY "Users can update their own materials" ON public.training_materials FOR UPDATE USING (is_admin() OR created_by = auth.uid()::text);
  END IF;
END $$;