-- Phase 1B: Enable RLS on remaining tables with policies but RLS disabled
-- This fixes the critical "Policy Exists RLS Disabled" errors

-- Enable RLS on all remaining tables that have policies but RLS disabled
ALTER TABLE public.kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_production_data ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.kpi_quality_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_safety_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nc_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nc_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nc_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_genealogy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recall_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recall_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standard_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_chain_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_chain_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceability_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_automation_config ENABLE ROW LEVEL SECURITY;

-- Fix all remaining functions with mutable search paths
CREATE OR REPLACE FUNCTION public.generate_document_version_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.version := (
        SELECT COALESCE(MAX(version), 0) + 1
        FROM public.document_versions
        WHERE document_id = NEW.document_id
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.find_affected_products_by_component(component_batch_lot text)
RETURNS TABLE(product_id uuid, product_name text, product_batch_lot text, manufacturing_date timestamp with time zone, expiry_date timestamp with time zone)
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as product_id,
    p.name as product_name,
    p.batch_lot_number as product_batch_lot,
    p.manufacturing_date,
    p.expiry_date
  FROM 
    public.components c
    JOIN public.product_genealogy pg ON c.id = pg.component_id
    JOIN public.products p ON pg.product_id = p.id
  WHERE 
    c.batch_lot_number = component_batch_lot;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_related_items(p_source_id uuid, p_source_type text, p_target_type text)
RETURNS TABLE(target_id uuid, relationship_type text, created_at timestamp with time zone, created_by text)
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT mr.target_id, mr.relationship_type, mr.created_at, mr.created_by
  FROM public.module_relationships mr
  WHERE mr.source_id = p_source_id
    AND mr.source_type = p_source_type
    AND mr.target_type = p_target_type;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_facility_standards(p_facility_id uuid)
RETURNS TABLE(id uuid, facility_id uuid, standard_id uuid, compliance_status text, certification_date timestamp with time zone, expiry_date timestamp with time zone, notes text, created_at timestamp with time zone, updated_at timestamp with time zone, standard_name text, standard_code text, standard_description text, standard_version text, standard_authority text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.get_organizations()
RETURNS SETOF organizations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM organizations
  WHERE status = 'active'
  ORDER BY name;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS TABLE(role_id uuid, role_name text, role_level role_level, permissions jsonb, organization_id uuid, organization_name text, facility_id uuid, facility_name text, department_id uuid, department_name text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    r.id AS role_id,
    r.name AS role_name,
    r.level AS role_level,
    r.permissions,
    ur.organization_id,
    o.name AS organization_name,
    ur.facility_id,
    f.name AS facility_name,
    ur.department_id,
    d.name AS department_name
  FROM public.user_roles ur
  JOIN public.roles r ON ur.role_id = r.id
  LEFT JOIN public.organizations o ON ur.organization_id = o.id
  LEFT JOIN public.facilities f ON ur.facility_id = f.id
  LEFT JOIN public.departments d ON ur.department_id = d.id
  WHERE ur.user_id = _user_id;
$$;

CREATE OR REPLACE FUNCTION public.get_regulatory_standards()
RETURNS SETOF regulatory_standards
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM regulatory_standards
  WHERE status = 'active'
  ORDER BY name;
END;
$$;

CREATE OR REPLACE FUNCTION public.track_nc_changes()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    -- Only insert activity record if something meaningful changed
    IF (OLD.title != NEW.title) OR 
       (OLD.description != NEW.description) OR
       (OLD.quantity != NEW.quantity) OR
       (OLD.quantity_on_hold != NEW.quantity_on_hold) OR
       (OLD.assigned_to != NEW.assigned_to) THEN
      
      INSERT INTO public.nc_activities (
        non_conformance_id,
        action,
        performed_by
      ) VALUES (
        NEW.id,
        'Non-conformance details updated',
        COALESCE(NEW.assigned_to, 'System')
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.supabase_realtime(table_name text, action text)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF action = 'enable' THEN
    EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', table_name);
  ELSE
    EXECUTE format('ALTER PUBLICATION supabase_realtime DROP TABLE %I', table_name);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_folder_document_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Only update count if folder_id is not null
        IF NEW.folder_id IS NOT NULL THEN
            UPDATE public.document_folders 
            SET document_count = document_count + 1, updated_at = now()
            WHERE id = NEW.folder_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        -- Only update count if folder_id is not null
        IF OLD.folder_id IS NOT NULL THEN
            UPDATE public.document_folders 
            SET document_count = document_count - 1, updated_at = now()
            WHERE id = OLD.folder_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' AND OLD.folder_id IS DISTINCT FROM NEW.folder_id THEN
        -- Document moved between folders
        -- Decrement old folder count if not null
        IF OLD.folder_id IS NOT NULL THEN
            UPDATE public.document_folders 
            SET document_count = document_count - 1, updated_at = now()
            WHERE id = OLD.folder_id;
        END IF;
        
        -- Increment new folder count if not null
        IF NEW.folder_id IS NOT NULL THEN
            UPDATE public.document_folders 
            SET document_count = document_count + 1, updated_at = now()
            WHERE id = NEW.folder_id;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.find_product_components(product_batch_lot text)
RETURNS TABLE(component_id uuid, component_name text, component_batch_lot text, supplier text, received_date timestamp with time zone, expiry_date timestamp with time zone)
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as component_id,
    c.name as component_name,
    c.batch_lot_number as component_batch_lot,
    scp.name as supplier,
    c.received_date,
    c.expiry_date
  FROM 
    public.products p
    JOIN public.product_genealogy pg ON p.id = pg.product_id
    JOIN public.components c ON pg.component_id = c.id
    LEFT JOIN public.supply_chain_partners scp ON c.supplier_id = scp.id
  WHERE 
    p.batch_lot_number = product_batch_lot;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_certification_statistics()
RETURNS TABLE(total_certifications bigint, active_certifications bigint, expiring_soon bigint, expired_certifications bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COUNT(*) as total_certifications,
    COUNT(*) FILTER (WHERE status = 'Active') as active_certifications,
    COUNT(*) FILTER (WHERE status = 'Active' AND expiry_date <= (CURRENT_DATE + INTERVAL '30 days')) as expiring_soon,
    COUNT(*) FILTER (WHERE status = 'Expired' OR expiry_date < CURRENT_DATE) as expired_certifications
  FROM public.employee_certifications;
$$;

CREATE OR REPLACE FUNCTION public.get_employee_certification_status(emp_id text)
RETURNS TABLE(certification_name text, status text, expiry_date timestamp with time zone, days_until_expiry integer)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    certification_name,
    status,
    expiry_date,
    EXTRACT(DAY FROM (expiry_date - CURRENT_DATE))::INTEGER as days_until_expiry
  FROM public.employee_certifications
  WHERE employee_id = emp_id
  ORDER BY expiry_date ASC;
$$;

CREATE OR REPLACE FUNCTION public.get_facilities(p_organization_id uuid DEFAULT NULL::uuid, p_only_assigned boolean DEFAULT false)
RETURNS SETOF facilities
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
      SELECT 1 FROM profiles
      WHERE id = v_user_id AND role = 'admin'
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
    -- Or return all if admin
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

CREATE OR REPLACE FUNCTION public.update_nc_status(nc_id uuid, new_status text, user_id text, comment text DEFAULT ''::text, prev_status text DEFAULT NULL::text)
RETURNS json
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  current_status text;
  updated_nc json;
BEGIN
  -- Get the current status if not provided
  IF prev_status IS NULL THEN
    SELECT status INTO current_status FROM public.non_conformances WHERE id = nc_id;
  ELSE
    current_status := prev_status;
  END IF;
  
  -- Update the non-conformance record
  UPDATE public.non_conformances
  SET 
    status = new_status,
    updated_at = NOW(),
    review_date = CASE WHEN new_status = 'Under Review' THEN NOW() ELSE review_date END,
    resolution_date = CASE 
                       WHEN new_status IN ('Released', 'Disposed', 'Resolved', 'Closed') THEN NOW() 
                       ELSE resolution_date 
                      END
  WHERE id = nc_id
  RETURNING to_json(non_conformances.*) INTO updated_nc;
  
  -- Record the activity
  INSERT INTO public.nc_activities (
    non_conformance_id,
    action,
    comments,
    performed_by,
    previous_status,
    new_status
  ) VALUES (
    nc_id,
    'Status changed from ' || current_status || ' to ' || new_status,
    comment,
    user_id,
    current_status,
    new_status
  );
  
  -- Create a notification
  INSERT INTO public.nc_notifications (
    non_conformance_id,
    message,
    notification_type
  ) VALUES (
    nc_id,
    'Status changed from ' || current_status || ' to ' || new_status,
    'status_change'
  );
  
  RETURN updated_nc;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_recall_schedule_next_execution()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Set next_execution_at based on recurrence pattern if it's recurring
  IF NEW.is_recurring THEN
    CASE
      WHEN NEW.recurrence_pattern = 'daily' THEN
        NEW.next_execution_at := COALESCE(NEW.last_executed_at, CURRENT_TIMESTAMP) + (NEW.recurrence_interval || ' days')::INTERVAL;
      WHEN NEW.recurrence_pattern = 'weekly' THEN
        NEW.next_execution_at := COALESCE(NEW.last_executed_at, CURRENT_TIMESTAMP) + (NEW.recurrence_interval || ' weeks')::INTERVAL;
      WHEN NEW.recurrence_pattern = 'monthly' THEN
        NEW.next_execution_at := COALESCE(NEW.last_executed_at, CURRENT_TIMESTAMP) + (NEW.recurrence_interval || ' months')::INTERVAL;
      WHEN NEW.recurrence_pattern = 'quarterly' THEN
        NEW.next_execution_at := COALESCE(NEW.last_executed_at, CURRENT_TIMESTAMP) + (NEW.recurrence_interval * 3 || ' months')::INTERVAL;
      WHEN NEW.recurrence_pattern = 'yearly' THEN
        NEW.next_execution_at := COALESCE(NEW.last_executed_at, CURRENT_TIMESTAMP) + (NEW.recurrence_interval || ' years')::INTERVAL;
      ELSE
        NEW.next_execution_at := NULL;
    END CASE;
  ELSE
    -- For one-time schedules
    NEW.next_execution_at := NEW.one_time_date;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_document_storage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- For audit purposes
  INSERT INTO public.document_activities (
    document_id,
    action,
    user_id,
    user_name,
    user_role
  ) VALUES (
    NEW.id,
    'Document created',
    auth.uid()::text,
    (SELECT email FROM auth.users WHERE id = auth.uid()),
    'user'
  );
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.can_upload_document(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN user_id IS NOT NULL;
END;
$$;