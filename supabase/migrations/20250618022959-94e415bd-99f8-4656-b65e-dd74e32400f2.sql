
-- Create CAPA workflow steps table
CREATE TABLE IF NOT EXISTS public.capa_workflow_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capa_id UUID NOT NULL REFERENCES public.capa_actions(id) ON DELETE CASCADE,
    step_name TEXT NOT NULL,
    step_order INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    assigned_to TEXT NOT NULL,
    description TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by TEXT,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_capa_workflow_steps_capa_id ON public.capa_workflow_steps(capa_id);
CREATE INDEX IF NOT EXISTS idx_capa_workflow_steps_status ON public.capa_workflow_steps(status);

-- Enable RLS (Row Level Security)
ALTER TABLE public.capa_workflow_steps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view workflow steps" ON public.capa_workflow_steps
    FOR SELECT USING (true);

CREATE POLICY "Users can insert workflow steps" ON public.capa_workflow_steps
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update workflow steps" ON public.capa_workflow_steps
    FOR UPDATE USING (true);
