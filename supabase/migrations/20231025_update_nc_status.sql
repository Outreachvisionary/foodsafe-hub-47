
-- Function to update non-conformance status with activity tracking
CREATE OR REPLACE FUNCTION public.update_nc_status(
  nc_id UUID,
  new_status text,
  user_id text,
  comment text DEFAULT '',
  prev_status text
)
RETURNS json AS $$
DECLARE
  updated_nc json;
BEGIN
  -- Update the non-conformance record
  UPDATE public.non_conformances
  SET 
    status = new_status::nc_status,
    updated_at = NOW(),
    review_date = CASE WHEN new_status = 'Under Review' THEN NOW() ELSE review_date END,
    resolution_date = CASE WHEN new_status IN ('Released', 'Disposed') THEN NOW() ELSE resolution_date END
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
    'Status changed from ' || prev_status || ' to ' || new_status,
    comment,
    user_id,
    prev_status::nc_status,
    new_status::nc_status
  );
  
  -- Create a notification
  INSERT INTO public.nc_notifications (
    non_conformance_id,
    message,
    notification_type
  ) VALUES (
    nc_id,
    'Status changed from ' || prev_status || ' to ' || new_status,
    'status_change'
  );
  
  RETURN updated_nc;
END;
$$ LANGUAGE plpgsql;
