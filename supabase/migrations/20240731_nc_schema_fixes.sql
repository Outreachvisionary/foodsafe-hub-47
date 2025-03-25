
-- Create enum types for NC statuses, item categories, and reason categories
DO $$
BEGIN
    -- Only create if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'nc_status') THEN
        CREATE TYPE public.nc_status AS ENUM (
            'On Hold',
            'Under Review',
            'Released',
            'Disposed'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'nc_item_category') THEN
        CREATE TYPE public.nc_item_category AS ENUM (
            'Processing Equipment',
            'Product Storage Tanks',
            'Finished Products',
            'Raw Products',
            'Packaging Materials',
            'Other'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'nc_reason_category') THEN
        CREATE TYPE public.nc_reason_category AS ENUM (
            'Contamination',
            'Quality Issues',
            'Regulatory Non-Compliance',
            'Equipment Malfunction',
            'Documentation Error',
            'Process Deviation',
            'Other'
        );
    END IF;
END$$;

-- Ensure non_conformances table has the right schema and columns
CREATE TABLE IF NOT EXISTS public.non_conformances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status nc_status NOT NULL DEFAULT 'On Hold',
    item_name TEXT NOT NULL,
    item_id TEXT,
    item_category nc_item_category NOT NULL,
    reason_category nc_reason_category NOT NULL,
    reason_details TEXT,
    quantity NUMERIC DEFAULT 0,
    quantity_on_hold NUMERIC DEFAULT 0,
    reported_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    reviewer TEXT,
    assigned_to TEXT,
    department TEXT,
    location TEXT,
    priority TEXT,
    risk_level TEXT,
    review_date TIMESTAMP WITH TIME ZONE,
    resolution_date TIMESTAMP WITH TIME ZONE,
    resolution_details TEXT,
    tags TEXT[],
    capa_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ensure nc_activities table has the right schema
CREATE TABLE IF NOT EXISTS public.nc_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    non_conformance_id UUID NOT NULL REFERENCES public.non_conformances(id),
    action TEXT NOT NULL,
    comments TEXT,
    performed_by TEXT NOT NULL,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    previous_status nc_status,
    new_status nc_status
);

-- Ensure nc_attachments table has the right schema
CREATE TABLE IF NOT EXISTS public.nc_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    non_conformance_id UUID NOT NULL REFERENCES public.non_conformances(id),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    description TEXT,
    uploaded_by TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ensure nc_notifications table has the right schema
CREATE TABLE IF NOT EXISTS public.nc_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    non_conformance_id UUID NOT NULL REFERENCES public.non_conformances(id),
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_read BOOLEAN DEFAULT false,
    target_users TEXT[]
);

-- Ensure storage bucket exists for attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Create a policy to allow authenticated users to upload to the attachments bucket
CREATE POLICY "Allow authenticated users to upload attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'attachments');

-- Create a policy to allow authenticated users to select from the attachments bucket
CREATE POLICY "Allow authenticated users to view attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'attachments');
