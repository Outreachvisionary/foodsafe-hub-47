-- CRITICAL SECURITY FIXES - Phase 1B: Comprehensive Policy Cleanup and Recreation

-- First, drop ALL existing policies on critical tables to avoid conflicts
DO $$
DECLARE
    rec RECORD;
BEGIN
    -- Drop all policies on profiles table
    FOR rec IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(rec.policyname) || ' ON profiles';
    END LOOP;
    
    -- Drop all policies on roles table
    FOR rec IN (SELECT policyname FROM pg_policies WHERE tablename = 'roles' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(rec.policyname) || ' ON roles';
    END LOOP;
    
    -- Drop all policies on user_roles table
    FOR rec IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_roles' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(rec.policyname) || ' ON user_roles';
    END LOOP;
    
    -- Drop all policies on non_conformances table
    FOR rec IN (SELECT policyname FROM pg_policies WHERE tablename = 'non_conformances' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(rec.policyname) || ' ON non_conformances';
    END LOOP;
    
    -- Drop all policies on training_records table
    FOR rec IN (SELECT policyname FROM pg_policies WHERE tablename = 'training_records' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(rec.policyname) || ' ON training_records';
    END LOOP;
    
    -- Drop all policies on training_sessions table
    FOR rec IN (SELECT policyname FROM pg_policies WHERE tablename = 'training_sessions' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(rec.policyname) || ' ON training_sessions';
    END LOOP;
END
$$;

-- Enable RLS on tables that need it
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE non_conformances ENABLE ROW LEVEL SECURITY;
ALTER TABLE nc_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE nc_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;

-- Create new restrictive policies for profiles
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
USING (is_admin());

-- Create policies for roles
CREATE POLICY "Authenticated users can view roles"
ON roles
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage roles"
ON roles
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Create policies for user_roles
CREATE POLICY "Users can view their own roles"
ON user_roles
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage user roles"
ON user_roles
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Create policies for non_conformances
CREATE POLICY "Users can view NCs in their organization"
ON non_conformances
FOR SELECT
USING (
  is_admin() OR
  created_by = auth.uid()::text OR
  assigned_to = auth.uid()::text
);

CREATE POLICY "Users can create NCs"
ON non_conformances
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  created_by = auth.uid()::text
);

CREATE POLICY "Users can update NCs they created or are assigned to"
ON non_conformances
FOR UPDATE
USING (
  is_admin() OR
  created_by = auth.uid()::text OR
  assigned_to = auth.uid()::text
)
WITH CHECK (
  is_admin() OR
  created_by = auth.uid()::text OR
  assigned_to = auth.uid()::text
);

-- Create policies for training records
CREATE POLICY "Users can view their own training records"
ON training_records
FOR SELECT
USING (
  is_admin() OR
  employee_id = auth.uid()::text
);

CREATE POLICY "Users can create training records"
ON training_records
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own training records"
ON training_records
FOR UPDATE
USING (
  is_admin() OR
  employee_id = auth.uid()::text
)
WITH CHECK (
  is_admin() OR
  employee_id = auth.uid()::text
);

-- Create policies for training sessions
CREATE POLICY "Users can view training sessions"
ON training_sessions
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage training sessions"
ON training_sessions
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);