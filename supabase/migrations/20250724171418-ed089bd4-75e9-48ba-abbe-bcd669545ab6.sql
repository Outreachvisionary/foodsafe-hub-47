-- CRITICAL SECURITY FIXES - Phase 1B: Fix Remaining RLS Issues (Handle Existing Policies)

-- Enable RLS on existing tables that don't have it (safely handle already enabled)
DO $$
BEGIN
    -- Enable RLS on tables that don't have it
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles' AND rowsecurity = true) THEN
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'roles' AND rowsecurity = true) THEN
        ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_roles' AND rowsecurity = true) THEN
        ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'non_conformances' AND rowsecurity = true) THEN
        ALTER TABLE non_conformances ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'nc_attachments' AND rowsecurity = true) THEN
        ALTER TABLE nc_attachments ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'nc_notifications' AND rowsecurity = true) THEN
        ALTER TABLE nc_notifications ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products' AND rowsecurity = true) THEN
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'suppliers' AND rowsecurity = true) THEN
        ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'training_records' AND rowsecurity = true) THEN
        ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'training_sessions' AND rowsecurity = true) THEN
        ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- Remove conflicting old policies first
DROP POLICY IF EXISTS "Allow all access to non_conformances" ON non_conformances;
DROP POLICY IF EXISTS "Allow all access to nc_activities" ON nc_activities;
DROP POLICY IF EXISTS "Allow all access to nc_attachments" ON nc_attachments;
DROP POLICY IF EXISTS "Allow all access to nc_notifications" ON nc_notifications;
DROP POLICY IF EXISTS "Allow public access" ON training_records;
DROP POLICY IF EXISTS "Allow public access" ON training_sessions;

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to view all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;

-- Create proper restrictive policies for profiles
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

-- Drop and recreate roles policies
DROP POLICY IF EXISTS "Anyone can read roles" ON roles;
DROP POLICY IF EXISTS "Authenticated users can view roles" ON roles;

CREATE POLICY "Authenticated users can view roles"
ON roles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Drop and recreate user_roles policies  
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Org and facility admins can view invites" ON user_roles;

CREATE POLICY "Users can view their own roles"
ON user_roles
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage user roles"
ON user_roles
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Create proper policies for non_conformances
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
DROP POLICY IF EXISTS "Users can view their own training records or admins can view al" ON training_records;
DROP POLICY IF EXISTS "Users can update their own training records or admins can updat" ON training_records;

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