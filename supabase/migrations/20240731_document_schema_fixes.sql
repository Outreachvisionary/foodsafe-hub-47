
-- Create enum type for document statuses and categories
DO $$
BEGIN
    -- Only create if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_status') THEN
        CREATE TYPE public.document_status AS ENUM (
            'Draft',
            'Pending_Approval',
            'Approved',
            'Published',
            'Archived',
            'Expired',
            'Active',
            'In_Review',
            'Pending_Review',
            'Rejected',
            'Obsolete'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_category') THEN
        CREATE TYPE public.document_category AS ENUM (
            'SOP',
            'Policy',
            'Form',
            'Certificate',
            'Audit Report',
            'HACCP Plan',
            'Training Material',
            'Supplier Documentation',
            'Risk Assessment',
            'Other'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'checkout_status') THEN
        CREATE TYPE public.checkout_status AS ENUM (
            'Available',
            'Checked_Out'
        );
    END IF;
END$$;

-- Ensure documents table has the right schema
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    category document_category NOT NULL,
    status document_status NOT NULL DEFAULT 'Draft',
    version INTEGER NOT NULL DEFAULT 1,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expiry_date TIMESTAMP WITH TIME ZONE,
    linked_module TEXT,
    tags TEXT[],
    is_locked BOOLEAN DEFAULT false,
    pending_since TIMESTAMP WITH TIME ZONE,
    custom_notification_days INTEGER[],
    rejection_reason TEXT,
    current_version_id UUID,
    last_review_date TIMESTAMP WITH TIME ZONE,
    next_review_date TIMESTAMP WITH TIME ZONE,
    folder_id UUID,
    linked_item_id UUID,
    checkout_user_id TEXT,
    checkout_timestamp TIMESTAMP WITH TIME ZONE,
    checkout_status checkout_status DEFAULT 'Available',
    workflow_status TEXT,
    is_template BOOLEAN DEFAULT false,
    checkout_user_name TEXT,
    file_path TEXT,
    last_action TEXT,
    approvers TEXT[]
);

-- Ensure document_versions table has the right schema
CREATE TABLE IF NOT EXISTS public.document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id),
    version INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    change_notes TEXT
);

-- Ensure document_activities table has the right schema
CREATE TABLE IF NOT EXISTS public.document_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id),
    action TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    comments TEXT,
    version_id UUID,
    checkout_action TEXT
);

-- Ensure document_workflows table has the right schema
CREATE TABLE IF NOT EXISTS public.document_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    steps JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by TEXT NOT NULL
);

-- Ensure document_workflow_instances table has the right schema
CREATE TABLE IF NOT EXISTS public.document_workflow_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id),
    workflow_id UUID NOT NULL REFERENCES public.document_workflows(id),
    current_step INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'in_progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by TEXT NOT NULL
);

-- Ensure document_access table has the right schema
CREATE TABLE IF NOT EXISTS public.document_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id),
    folder_id UUID,
    user_id TEXT,
    user_role TEXT,
    permission_level TEXT NOT NULL,
    granted_by TEXT NOT NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a trigger for auto-incrementing version numbers for document_versions
CREATE OR REPLACE FUNCTION public.generate_document_version_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.version := (
        SELECT COALESCE(MAX(version), 0) + 1
        FROM public.document_versions
        WHERE document_id = NEW.document_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_document_version_number ON public.document_versions;

CREATE TRIGGER set_document_version_number
BEFORE INSERT ON public.document_versions
FOR EACH ROW
EXECUTE FUNCTION public.generate_document_version_number();
