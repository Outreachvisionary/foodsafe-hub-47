
import { Document, DocumentActionType, DocumentVersion, CheckoutStatus } from '@/types/document';
import { ensureRecord } from './jsonUtils';

/**
 * Adapts a Document object to the database schema format
 * @param document The document to adapt
 */
export const adaptDocumentToDatabase = (document: Document): any => {
  // Handle special status values with underscores
  let status = document.status;
  
  // Ensure the category is a string that the database accepts
  let category = document.category;
  
  // Map checkout status to match the DB schema
  let checkout_status: string = document.checkout_status === 'Checked Out' ? 'Checked Out' : 'Available';
  
  return {
    ...document,
    status,
    category,
    checkout_status
  };
};

/**
 * Maps string action to DocumentActionType
 * @param action The action string
 */
export const mapToDocumentActionType = (action: string): DocumentActionType => {
  // Check if the action is valid in our enum
  const validActions = [
    'created', 'updated', 'approved', 'rejected', 'published', 'archived', 'expired',
    'checked_out', 'checked_in', 'downloaded', 'viewed', 'create', 'update',
    'delete', 'view', 'download', 'approve', 'reject', 'review', 'comment',
    'checkout', 'checkin', 'restore', 'archive', 'edit'
  ];
  
  if (validActions.includes(action)) {
    return action as DocumentActionType;
  }
  
  // Default to 'view' if not found
  console.warn(`Unknown document action type: ${action}, defaulting to 'view'`);
  return 'view';
};

/**
 * Maps DB checkout status to application checkout status
 */
export const mapDbToAppCheckoutStatus = (dbStatus: string): CheckoutStatus => {
  return dbStatus === 'Checked Out' ? 'Checked Out' : 'Available';
};

/**
 * Maps application checkout status to DB checkout status
 */
export const mapAppToDbCheckoutStatus = (appStatus: CheckoutStatus): string => {
  return appStatus;
};

/**
 * Safely process document version data from the database
 */
export const adaptDocumentVersionFromDB = (version: any): DocumentVersion => {
  return {
    id: version.id,
    document_id: version.document_id,
    version: version.version || 1,
    version_number: version.version_number,
    file_name: version.file_name,
    file_size: version.file_size,
    created_by: version.created_by,
    created_at: version.created_at,
    is_binary_file: version.is_binary_file,
    editor_metadata: ensureRecord(version.editor_metadata),
    diff_data: version.diff_data ? ensureRecord(version.diff_data) : undefined,
    version_type: version.version_type === 'major' ? 'major' : 'minor',
    change_summary: version.change_summary,
    change_notes: version.change_notes,
    check_in_comment: version.check_in_comment,
    modified_by: version.modified_by,
    modified_by_name: version.modified_by_name,
  };
};

/**
 * Adapt document activity from DB to application format
 */
export const adaptDocumentActivityFromDB = (activity: any): DocumentActionType => {
  return mapToDocumentActionType(activity.action);
};

export default {
  adaptDocumentToDatabase,
  mapToDocumentActionType,
  adaptDocumentVersionFromDB,
  adaptDocumentActivityFromDB,
  mapDbToAppCheckoutStatus,
  mapAppToDbCheckoutStatus
};
