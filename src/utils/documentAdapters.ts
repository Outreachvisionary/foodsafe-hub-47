
import { Document, DocumentVersion } from '@/types/document';
import { DocumentStatus, CheckoutStatus } from '@/types/enums';

export const adaptDbDocumentToModel = (dbDoc: any): Document => {
  return {
    id: dbDoc.id,
    title: dbDoc.title,
    description: dbDoc.description || '',
    file_name: dbDoc.file_name,
    file_path: dbDoc.file_path || '',
    file_type: dbDoc.file_type,
    file_size: dbDoc.file_size,
    category: dbDoc.category,
    status: dbDoc.status as DocumentStatus,
    version: dbDoc.version,
    created_by: dbDoc.created_by,
    created_at: dbDoc.created_at,
    updated_at: dbDoc.updated_at,
    expiry_date: dbDoc.expiry_date,
    folder_id: dbDoc.folder_id,
    tags: dbDoc.tags || [],
    approvers: dbDoc.approvers || [],
    linked_module: dbDoc.linked_module,
    linked_item_id: dbDoc.linked_item_id,
    rejection_reason: dbDoc.rejection_reason || '',
    is_locked: dbDoc.is_locked || false,
    last_action: dbDoc.last_action,
    last_review_date: dbDoc.last_review_date,
    next_review_date: dbDoc.next_review_date,
    pending_since: dbDoc.pending_since,
    current_version_id: dbDoc.current_version_id,
    is_template: dbDoc.is_template || false,
    checkout_status: (dbDoc.checkout_status || 'Available') as CheckoutStatus,
    checkout_timestamp: dbDoc.checkout_timestamp,
    checkout_user_id: dbDoc.checkout_user_id,
    checkout_user_name: dbDoc.checkout_user_name,
    workflow_status: dbDoc.workflow_status
  };
};

export const adaptDbVersionToModel = (dbVersion: any): DocumentVersion => {
  return {
    id: dbVersion.id,
    document_id: dbVersion.document_id,
    version: dbVersion.version,
    version_number: dbVersion.version_number,
    file_name: dbVersion.file_name,
    file_size: dbVersion.file_size,
    created_by: dbVersion.created_by,
    created_at: dbVersion.created_at,
    is_binary_file: dbVersion.is_binary_file,
    editor_metadata: dbVersion.editor_metadata,
    diff_data: dbVersion.diff_data,
    version_type: dbVersion.version_type as "major" | "minor",
    change_summary: dbVersion.change_summary,
    change_notes: dbVersion.change_notes,
    check_in_comment: dbVersion.check_in_comment,
    modified_by: dbVersion.modified_by,
    modified_by_name: dbVersion.modified_by_name
  };
};
