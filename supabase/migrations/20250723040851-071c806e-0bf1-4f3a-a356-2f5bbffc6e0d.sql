-- Fix RLS policies and enable proper access for non-conformance module

-- Enable RLS on all related tables
ALTER TABLE public.non_conformances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nc_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nc_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nc_notifications ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for non_conformances
CREATE POLICY "Allow authenticated users to view all non-conformances" 
ON public.non_conformances 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to insert non-conformances" 
ON public.non_conformances 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update non-conformances" 
ON public.non_conformances 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to delete non-conformances" 
ON public.non_conformances 
FOR DELETE 
TO authenticated 
USING (true);

-- Create policies for nc_activities
CREATE POLICY "Allow authenticated users to view nc activities" 
ON public.nc_activities 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to insert nc activities" 
ON public.nc_activities 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create policies for nc_attachments
CREATE POLICY "Allow authenticated users to view nc attachments" 
ON public.nc_attachments 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to insert nc attachments" 
ON public.nc_attachments 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete nc attachments" 
ON public.nc_attachments 
FOR DELETE 
TO authenticated 
USING (true);

-- Create policies for nc_notifications
CREATE POLICY "Allow authenticated users to view nc notifications" 
ON public.nc_notifications 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to insert nc notifications" 
ON public.nc_notifications 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Enable RLS on other related tables that might be missing it
DO $$ 
BEGIN
    -- Check and enable RLS on profiles table if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Create basic profile policies if they don't exist
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Allow users to view all profiles') THEN
            CREATE POLICY "Allow users to view all profiles" 
            ON public.profiles 
            FOR SELECT 
            TO authenticated 
            USING (true);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Allow users to update own profile') THEN
            CREATE POLICY "Allow users to update own profile" 
            ON public.profiles 
            FOR UPDATE 
            TO authenticated 
            USING (auth.uid() = id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Allow users to insert own profile') THEN
            CREATE POLICY "Allow users to insert own profile" 
            ON public.profiles 
            FOR INSERT 
            TO authenticated 
            WITH CHECK (auth.uid() = id);
        END IF;
    END IF;

    -- Check and enable RLS on capa_actions table if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'capa_actions' AND table_schema = 'public') THEN
        ALTER TABLE public.capa_actions ENABLE ROW LEVEL SECURITY;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'capa_actions' AND policyname = 'Allow authenticated users to view all capa actions') THEN
            CREATE POLICY "Allow authenticated users to view all capa actions" 
            ON public.capa_actions 
            FOR SELECT 
            TO authenticated 
            USING (true);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'capa_actions' AND policyname = 'Allow authenticated users to insert capa actions') THEN
            CREATE POLICY "Allow authenticated users to insert capa actions" 
            ON public.capa_actions 
            FOR INSERT 
            TO authenticated 
            WITH CHECK (true);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'capa_actions' AND policyname = 'Allow authenticated users to update capa actions') THEN
            CREATE POLICY "Allow authenticated users to update capa actions" 
            ON public.capa_actions 
            FOR UPDATE 
            TO authenticated 
            USING (true);
        END IF;
    END IF;

    -- Check and enable RLS on module_relationships table if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'module_relationships' AND table_schema = 'public') THEN
        ALTER TABLE public.module_relationships ENABLE ROW LEVEL SECURITY;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'module_relationships' AND policyname = 'Allow authenticated users to view module relationships') THEN
            CREATE POLICY "Allow authenticated users to view module relationships" 
            ON public.module_relationships 
            FOR SELECT 
            TO authenticated 
            USING (true);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'module_relationships' AND policyname = 'Allow authenticated users to insert module relationships') THEN
            CREATE POLICY "Allow authenticated users to insert module relationships" 
            ON public.module_relationships 
            FOR INSERT 
            TO authenticated 
            WITH CHECK (true);
        END IF;
    END IF;
END $$;

-- Insert some sample data for testing
INSERT INTO public.non_conformances (
    title, 
    description, 
    item_name, 
    item_category, 
    reason_category, 
    status, 
    created_by, 
    department, 
    location, 
    priority, 
    risk_level, 
    quantity, 
    quantity_on_hold, 
    reported_date
) VALUES 
(
    'Raw Material Quality Issue', 
    'Batch of raw materials received with contamination', 
    'Wheat Flour Batch #2024-001', 
    'Raw Products', 
    'Quality Issues', 
    'On Hold', 
    'Quality Inspector', 
    'Quality Control', 
    'Warehouse A', 
    'High', 
    'Medium', 
    1000, 
    1000, 
    NOW()
),
(
    'Equipment Malfunction', 
    'Packaging machine producing irregular seal patterns', 
    'Packaging Line 2', 
    'Processing Equipment', 
    'Equipment Malfunction', 
    'Under Review', 
    'Production Manager', 
    'Production', 
    'Production Floor', 
    'Medium', 
    'High', 
    NULL, 
    NULL, 
    NOW() - INTERVAL '2 days'
),
(
    'Finished Product Contamination', 
    'Foreign material detected in finished product batch', 
    'Product Batch ABC-123', 
    'Finished Products', 
    'Contamination', 
    'Under Review', 
    'QA Manager', 
    'Quality Assurance', 
    'Production Line 1', 
    'Critical', 
    'Critical', 
    500, 
    500, 
    NOW() - INTERVAL '1 day'
);

-- Create some activity logs for the sample data
INSERT INTO public.nc_activities (
    non_conformance_id,
    action,
    comments,
    performed_by,
    performed_at,
    new_status
) 
SELECT 
    id,
    'Non-conformance created',
    'Initial reporting and assessment',
    created_by,
    created_at,
    status
FROM public.non_conformances
WHERE title IN ('Raw Material Quality Issue', 'Equipment Malfunction', 'Finished Product Contamination');