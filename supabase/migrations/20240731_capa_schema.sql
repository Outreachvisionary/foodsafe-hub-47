
-- Create enum types for CAPA
DO $$
BEGIN
    -- Only create if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'capa_status') THEN
        CREATE TYPE public.capa_status AS ENUM (
            'Open',
            'In_Progress',
            'Under_Review',
            'Completed',
            'Closed',
            'Rejected',
            'On_Hold',
            'Overdue',
            'Pending_Verification',
            'Verified'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'capa_priority') THEN
        CREATE TYPE public.capa_priority AS ENUM (
            'Low',
            'Medium',
            'High',
            'Critical'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'capa_source') THEN
        CREATE TYPE public.capa_source AS ENUM (
            'Audit',
            'Customer_Complaint',
            'Internal_Issue',
            'Regulatory',
            'Supplier_Issue',
            'Non_Conformance',
            'Management_Review',
            'Other'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'effectiveness_rating') THEN
        CREATE TYPE public.effectiveness_rating AS ENUM (
            'Not_Effective',
            'Partially_Effective',
            'Effective',
            'Highly_Effective'
        );
    END IF;
END$$;

-- Create CAPA actions table
CREATE TABLE IF NOT EXISTS public.capa_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status capa_status DEFAULT 'Open',
    priority capa_priority NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by TEXT NOT NULL,
    assigned_to TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    source capa_source NOT NULL,
    source_reference TEXT NOT NULL,
    department TEXT,
    root_cause TEXT,
    corrective_action TEXT,
    preventive_action TEXT,
    effectiveness_criteria TEXT,
    completion_date TIMESTAMP WITH TIME ZONE,
    effectiveness_rating effectiveness_rating,
    effectiveness_verified BOOLEAN DEFAULT false,
    verification_date TIMESTAMP WITH TIME ZONE,
    verification_method TEXT,
    verified_by TEXT,
    fsma204_compliant BOOLEAN DEFAULT false,
    source_id UUID
);

-- Create CAPA activities table for audit trail
CREATE TABLE IF NOT EXISTS public.capa_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capa_id UUID REFERENCES public.capa_actions(id),
    action_type TEXT NOT NULL,
    action_description TEXT NOT NULL,
    performed_by TEXT NOT NULL,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    old_status capa_status,
    new_status capa_status,
    metadata JSONB
);

-- Create CAPA effectiveness assessments table
CREATE TABLE IF NOT EXISTS public.capa_effectiveness_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capa_id UUID REFERENCES public.capa_actions(id),
    assessment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by TEXT NOT NULL,
    root_cause_eliminated BOOLEAN,
    preventive_measures_implemented BOOLEAN,
    documentation_complete BOOLEAN,
    score INTEGER,
    rating effectiveness_rating,
    recurrence_check TEXT,
    notes TEXT
);

-- Create related document links table
CREATE TABLE IF NOT EXISTS public.capa_related_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capa_id UUID REFERENCES public.capa_actions(id),
    document_id UUID REFERENCES public.documents(id),
    added_by TEXT NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    document_type TEXT
);

-- Create related training links table
CREATE TABLE IF NOT EXISTS public.capa_related_training (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capa_id UUID REFERENCES public.capa_actions(id),
    training_id UUID,
    added_by TEXT NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
