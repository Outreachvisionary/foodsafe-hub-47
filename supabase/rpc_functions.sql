
-- Function to get facilities by organization with proper filtering for user permissions
CREATE OR REPLACE FUNCTION public.get_facilities_by_organization(org_id UUID DEFAULT NULL)
RETURNS SETOF public.facilities
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID := auth.uid();
  user_role TEXT;
  user_org_id UUID;
  user_assigned_facilities UUID[];
BEGIN
  -- Get user information
  SELECT 
    role, 
    organization_id, 
    assigned_facility_ids 
  INTO 
    user_role, 
    user_org_id, 
    user_assigned_facilities
  FROM 
    public.profiles 
  WHERE 
    id = user_id;
  
  -- If organization ID is not provided, use the user's organization
  IF org_id IS NULL THEN
    org_id := user_org_id;
  END IF;
  
  -- Return all facilities for the organization if user is admin
  IF user_role = 'system_admin' OR user_role = 'org_admin' THEN
    RETURN QUERY 
      SELECT * FROM public.facilities
      WHERE organization_id = org_id AND status = 'active';
  ELSE
    -- Return only facilities the user is assigned to
    RETURN QUERY 
      SELECT * FROM public.facilities
      WHERE 
        organization_id = org_id 
        AND status = 'active'
        AND id = ANY(user_assigned_facilities);
  END IF;
END;
$$;

-- Function to get organizations the user has access to
CREATE OR REPLACE FUNCTION public.get_user_organizations()
RETURNS SETOF public.organizations
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID := auth.uid();
  user_role TEXT;
  user_org_id UUID;
BEGIN
  -- Get user information
  SELECT 
    role, 
    organization_id
  INTO 
    user_role, 
    user_org_id
  FROM 
    public.profiles 
  WHERE 
    id = user_id;
  
  -- Return all organizations if user is system admin
  IF user_role = 'system_admin' THEN
    RETURN QUERY 
      SELECT * FROM public.organizations
      WHERE status = 'active';
  ELSE
    -- Return only the user's organization
    RETURN QUERY 
      SELECT * FROM public.organizations
      WHERE 
        id = user_org_id 
        AND status = 'active';
  END IF;
END;
$$;

-- Function to get regulatory standards
CREATE OR REPLACE FUNCTION public.get_regulatory_standards()
RETURNS SETOF public.regulatory_standards
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.regulatory_standards
  WHERE status = 'active';
$$;

-- Function to get facility standards with regulatory standard info
CREATE OR REPLACE FUNCTION public.get_facility_standards(facility_id UUID)
RETURNS TABLE (
  id UUID,
  facility_id UUID,
  standard_id UUID,
  compliance_status TEXT,
  certification_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  standard_name TEXT,
  standard_code TEXT,
  standard_version TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    fs.id,
    fs.facility_id,
    fs.standard_id,
    fs.compliance_status,
    fs.certification_date,
    fs.expiry_date,
    fs.notes,
    fs.created_at,
    fs.updated_at,
    rs.name as standard_name,
    rs.code as standard_code,
    rs.version as standard_version
  FROM 
    public.facility_standards fs
    JOIN public.regulatory_standards rs ON fs.standard_id = rs.id
  WHERE 
    fs.facility_id = $1;
$$;

-- Organization management helper functions
CREATE OR REPLACE FUNCTION public.create_organization(
  name TEXT,
  description TEXT DEFAULT NULL,
  contact_email TEXT DEFAULT NULL,
  contact_phone TEXT DEFAULT NULL,
  status TEXT DEFAULT 'active'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.organizations(
    name, 
    description, 
    contact_email, 
    contact_phone, 
    status
  )
  VALUES (
    name, 
    description, 
    contact_email, 
    contact_phone, 
    status
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Facility management helper functions
CREATE OR REPLACE FUNCTION public.create_facility(
  name TEXT,
  description TEXT DEFAULT NULL,
  address TEXT DEFAULT NULL,
  facility_type TEXT DEFAULT NULL,
  organization_id UUID,
  status TEXT DEFAULT 'active'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.facilities(
    name, 
    description, 
    address, 
    facility_type, 
    organization_id,
    status
  )
  VALUES (
    name, 
    description, 
    address, 
    facility_type, 
    organization_id,
    status
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Create temporary views for development purposes
-- These would normally be replaced by real tables and proper RLS policies
CREATE OR REPLACE VIEW public.temp_facilities AS 
SELECT * FROM public.facilities;

CREATE OR REPLACE VIEW public.temp_organizations AS 
SELECT * FROM public.organizations;

CREATE OR REPLACE VIEW public.temp_regulatory_standards AS 
SELECT * FROM public.regulatory_standards;

CREATE OR REPLACE VIEW public.temp_facility_standards AS 
SELECT * FROM public.facility_standards;
