
-- Create products table for traceability
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    sku TEXT,
    batch_lot_number TEXT NOT NULL UNIQUE,
    manufacturing_date TIMESTAMP WITH TIME ZONE NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE,
    attributes JSONB DEFAULT '{}',
    status TEXT DEFAULT 'active',
    quantity NUMERIC,
    units TEXT,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update components table to ensure it has all necessary fields
ALTER TABLE public.components 
ADD COLUMN IF NOT EXISTS quantity NUMERIC,
ADD COLUMN IF NOT EXISTS units TEXT;

-- Create recalls table
CREATE TABLE IF NOT EXISTS public.recalls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    recall_type recall_type NOT NULL DEFAULT 'Mock',
    recall_reason TEXT NOT NULL,
    status recall_status NOT NULL DEFAULT 'Scheduled',
    initiated_by TEXT NOT NULL,
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    affected_products JSONB DEFAULT '{}',
    corrective_actions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recalls ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products
CREATE POLICY "Users can view all products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Users can insert products" ON public.products
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update products" ON public.products
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete products" ON public.products
    FOR DELETE USING (true);

-- Create RLS policies for recalls
CREATE POLICY "Users can view all recalls" ON public.recalls
    FOR SELECT USING (true);

CREATE POLICY "Users can insert recalls" ON public.recalls
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update recalls" ON public.recalls
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete recalls" ON public.recalls
    FOR DELETE USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_batch_lot ON public.products(batch_lot_number);
CREATE INDEX IF NOT EXISTS idx_products_manufacturing_date ON public.products(manufacturing_date);
CREATE INDEX IF NOT EXISTS idx_components_batch_lot ON public.components(batch_lot_number);
CREATE INDEX IF NOT EXISTS idx_recalls_status ON public.recalls(status);
CREATE INDEX IF NOT EXISTS idx_recalls_initiated_at ON public.recalls(initiated_at);
