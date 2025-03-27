
-- Function to get organizations with proper filtering
CREATE OR REPLACE FUNCTION get_organizations()
RETURNS SETOF organizations
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM organizations
  WHERE status = 'active'
  ORDER BY name;
END;
$$;

-- Function to get facilities with proper filtering based on organization and user permissions
CREATE OR REPLACE FUNCTION get_facilities(
  p_organization_id UUID DEFAULT NULL,
  p_only_assigned BOOLEAN DEFAULT FALSE
)
RETURNS SETOF facilities
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_user_org_id UUID;
  v_is_admin BOOLEAN;
BEGIN
  -- Get the current user ID
  v_user_id := auth.uid();
  
  -- Get user's organization ID and check if admin
  SELECT 
    organization_id,
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = v_user_id AND r.name IN ('system_admin', 'org_admin')
    )
  INTO v_user_org_id, v_is_admin
  FROM profiles
  WHERE id = v_user_id;
  
  -- Filter query based on parameters and permissions
  RETURN QUERY
  SELECT f.*
  FROM facilities f
  WHERE f.status = 'active'
  AND (
    -- Filter by specific organization if provided
    (p_organization_id IS NOT NULL AND f.organization_id = p_organization_id)
    -- Or use user's organization if no org ID provided
    OR (p_organization_id IS NULL AND v_user_org_id IS NOT NULL AND f.organization_id = v_user_org_id)
    -- Or return all if system admin
    OR (p_organization_id IS NULL AND v_is_admin)
  )
  -- Filter to only user's assigned facilities if requested
  AND (
    NOT p_only_assigned
    OR (
      p_only_assigned AND EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = v_user_id
        AND f.id = ANY(p.assigned_facility_ids)
      )
    )
  )
  ORDER BY f.name;
END;
$$;

-- Function to get regulatory standards
CREATE OR REPLACE FUNCTION get_regulatory_standards()
RETURNS SETOF regulatory_standards
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM regulatory_standards
  WHERE status = 'active'
  ORDER BY name;
END;
$$;

-- Function to get facility standards with their related regulatory standard info
CREATE OR REPLACE FUNCTION get_facility_standards(p_facility_id UUID)
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
  standard_description TEXT,
  standard_version TEXT,
  standard_authority TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
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
    rs.name AS standard_name,
    rs.code AS standard_code,
    rs.description AS standard_description,
    rs.version AS standard_version,
    rs.authority AS standard_authority
  FROM facility_standards fs
  JOIN regulatory_standards rs ON fs.standard_id = rs.id
  WHERE fs.facility_id = p_facility_id
  ORDER BY rs.name;
END;
$$;

-- Add temp views for use during development
-- These can be replaced with proper tables later
CREATE OR REPLACE VIEW temp_organizations AS
SELECT * FROM organizations;

CREATE OR REPLACE VIEW temp_facilities AS
SELECT * FROM facilities;

CREATE OR REPLACE VIEW temp_regulatory_standards AS
SELECT * FROM regulatory_standards;

CREATE OR REPLACE VIEW temp_facility_standards AS
SELECT 
  fs.*,
  rs.* AS regulatory_standards
FROM facility_standards fs
JOIN regulatory_standards rs ON fs.standard_id = rs.id;
