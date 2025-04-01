
-- This function can be added to Supabase to increment counters
CREATE OR REPLACE FUNCTION increment_counter(row_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE folders
  SET document_count = document_count + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;
