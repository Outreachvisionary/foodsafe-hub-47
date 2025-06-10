
-- Enable replica identity for all tables to capture complete row data during updates
ALTER TABLE public.audits REPLICA IDENTITY FULL;
ALTER TABLE public.kpi_quality_data REPLICA IDENTITY FULL;
ALTER TABLE public.kpi_safety_data REPLICA IDENTITY FULL;
ALTER TABLE public.document_versions REPLICA IDENTITY FULL;
ALTER TABLE public.organizations REPLICA IDENTITY FULL;
ALTER TABLE public.module_relationships REPLICA IDENTITY FULL;
ALTER TABLE public.suppliers REPLICA IDENTITY FULL;
ALTER TABLE public.onboarding_invites REPLICA IDENTITY FULL;
ALTER TABLE public.folders REPLICA IDENTITY FULL;
ALTER TABLE public.training_automation_config REPLICA IDENTITY FULL;
ALTER TABLE public.standard_requirements REPLICA IDENTITY FULL;
ALTER TABLE public.traceability_notifications REPLICA IDENTITY FULL;
ALTER TABLE public.document_previews REPLICA IDENTITY FULL;
ALTER TABLE public.kpi_metrics REPLICA IDENTITY FULL;
ALTER TABLE public.document_workflows REPLICA IDENTITY FULL;
ALTER TABLE public.departments REPLICA IDENTITY FULL;
ALTER TABLE public.documents REPLICA IDENTITY FULL;
ALTER TABLE public.nc_attachments REPLICA IDENTITY FULL;
ALTER TABLE public.document_permission_types REPLICA IDENTITY FULL;
ALTER TABLE public.supplier_approval_workflows REPLICA IDENTITY FULL;
ALTER TABLE public.product_genealogy REPLICA IDENTITY FULL;
ALTER TABLE public.capa_related_documents REPLICA IDENTITY FULL;
ALTER TABLE public.supply_chain_links REPLICA IDENTITY FULL;
ALTER TABLE public.document_status_types REPLICA IDENTITY FULL;
ALTER TABLE public.recall_simulations REPLICA IDENTITY FULL;
ALTER TABLE public.recall_schedules REPLICA IDENTITY FULL;
ALTER TABLE public.facility_standards REPLICA IDENTITY FULL;
ALTER TABLE public.nc_activities REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.supplier_risk_assessments REPLICA IDENTITY FULL;
ALTER TABLE public.supplier_documents REPLICA IDENTITY FULL;
ALTER TABLE public.capa_activities REPLICA IDENTITY FULL;
ALTER TABLE public.capa_effectiveness_assessments REPLICA IDENTITY FULL;
ALTER TABLE public.training_records REPLICA IDENTITY FULL;
ALTER TABLE public.supply_chain_partners REPLICA IDENTITY FULL;
ALTER TABLE public.document_editor_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.document_comments REPLICA IDENTITY FULL;
ALTER TABLE public.regulatory_standards REPLICA IDENTITY FULL;
ALTER TABLE public.capa_actions REPLICA IDENTITY FULL;
ALTER TABLE public.document_activities REPLICA IDENTITY FULL;
ALTER TABLE public.complaints REPLICA IDENTITY FULL;
ALTER TABLE public.ccps REPLICA IDENTITY FULL;
ALTER TABLE public.capa_related_training REPLICA IDENTITY FULL;
ALTER TABLE public.roles REPLICA IDENTITY FULL;
ALTER TABLE public.non_conformances REPLICA IDENTITY FULL;
ALTER TABLE public.components REPLICA IDENTITY FULL;
ALTER TABLE public.document_access REPLICA IDENTITY FULL;
ALTER TABLE public.audit_findings REPLICA IDENTITY FULL;
ALTER TABLE public.user_roles REPLICA IDENTITY FULL;

-- Add tables to supabase_realtime publication only if they're not already there
DO $$
DECLARE
    tbl_name text;
    table_list text[] := ARRAY[
        'audits', 'document_versions', 'organizations', 'module_relationships', 
        'suppliers', 'onboarding_invites', 'folders', 'training_automation_config',
        'standard_requirements', 'traceability_notifications', 'document_previews',
        'document_workflows', 'departments', 'documents', 'nc_attachments',
        'document_permission_types', 'supplier_approval_workflows', 'product_genealogy',
        'capa_related_documents', 'supply_chain_links', 'document_status_types',
        'recall_simulations', 'recall_schedules', 'facility_standards', 'nc_activities',
        'profiles', 'supplier_risk_assessments', 'supplier_documents', 'capa_activities',
        'capa_effectiveness_assessments', 'training_records', 'supply_chain_partners',
        'document_editor_sessions', 'document_comments', 'regulatory_standards',
        'capa_actions', 'document_activities', 'complaints', 'ccps',
        'capa_related_training', 'roles', 'non_conformances', 'components',
        'document_access', 'audit_findings', 'user_roles'
    ];
BEGIN
    FOREACH tbl_name IN ARRAY table_list
    LOOP
        -- Check if table is already in the publication
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = tbl_name
        ) THEN
            EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', tbl_name);
            RAISE NOTICE 'Added table % to supabase_realtime publication', tbl_name;
        ELSE
            RAISE NOTICE 'Table % already in supabase_realtime publication', tbl_name;
        END IF;
    END LOOP;
END $$;
