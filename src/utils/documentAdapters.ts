
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
    checkout_status: (dbDoc.checkout_status || 'Available') as CheckoutStatus,
    checkout_by: dbDoc.checkout_by,
    checkout_date: dbDoc.checkout_timestamp,
    pending_since: dbDoc.pending_since,
    department: dbDoc.department
  };
};

export const adaptDbVersionToModel = (dbVersion: any): DocumentVersion => {
  return {
    id: dbVersion.id,
    document_id: dbVersion.document_id,
    version: dbVersion.version,
    version_number: dbVersion.version_number,
    file_name: dbVersion.file_name,
    file_path: dbVersion.file_path || '',
    file_size: dbVersion.file_size,
    created_by: dbVersion.created_by,
    created_at: dbVersion.created_at,
    is_binary_file: dbVersion.is_binary_file,
    version_type: dbVersion.version_type as "major" | "minor",
    change_summary: dbVersion.change_summary,
    change_notes: dbVersion.change_notes,
    modified_by_name: dbVersion.modified_by_name
  };
};

export const adaptModelToDbDocument = (document: Partial<Document>): Record<string, any> => {
  // Map the Document model to match the database schema
  return {
    ...document,
    // Map any specific fields that need conversion here
  };
};

// Helper functions for document access control
export const getPermissionLabel = (permissionLevel: string): string => {
  const labels: Record<string, string> = {
    'view': 'View Only',
    'comment': 'Can Comment',
    'edit': 'Can Edit',
    'owner': 'Full Control'
  };
  
  return labels[permissionLevel] || permissionLevel;
};

export const getPermissionDescription = (permissionLevel: string): string => {
  const descriptions: Record<string, string> = {
    'view': 'Can view the document but cannot make changes',
    'comment': 'Can view and add comments to the document',
    'edit': 'Can view, comment on, and make changes to the document',
    'owner': 'Has full control over the document including managing access'
  };
  
  return descriptions[permissionLevel] || '';
};

// Function for document validation
export const validateDocument = (document: Partial<Document>): string[] => {
  const errors: string[] = [];
  
  if (!document.title || document.title.trim() === '') {
    errors.push('Document title is required');
  }
  
  if (!document.file_name || document.file_name.trim() === '') {
    errors.push('Document file name is required');
  }
  
  if (!document.category || document.category.trim() === '') {
    errors.push('Document category is required');
  }
  
  return errors;
};
