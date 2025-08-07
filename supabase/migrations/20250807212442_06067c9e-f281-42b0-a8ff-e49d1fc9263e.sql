-- Ensure created_by exists on training_materials for policy compatibility
ALTER TABLE IF EXISTS public.training_materials ADD COLUMN IF NOT EXISTS created_by TEXT;