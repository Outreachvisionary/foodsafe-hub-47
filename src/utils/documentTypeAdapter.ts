
import { Document, DocumentType } from '@/types/document';
import { DocumentStatus } from '@/types/enums';

// Function to adapt a document to the format expected by the database
export const adaptDocumentToDatabase = (document: Partial<Document>) => {
  return {
    ...document,
    status: document.status || DocumentStatus.Draft,
    document_type: document.document_type || DocumentType.Procedure,
    // Add any other transformations here
  };
};

// Function to adapt a document from the database to the format expected by the application
export const adaptDocumentFromDatabase = (dbDocument: any): Document => {
  return {
    id: dbDocument.id,
    title: dbDocument.title,
    description: dbDocument.description,
    content: dbDocument.content,
    document_type: dbDocument.document_type,
    status: dbDocument.status,
    created_at: dbDocument.created_at,
    updated_at: dbDocument.updated_at,
    created_by: dbDocument.created_by,
    last_modified_by: dbDocument.last_modified_by,
    version: dbDocument.version,
    document_number: dbDocument.document_number,
    effective_date: dbDocument.effective_date,
    expiry_date: dbDocument.expiry_date,
    review_cycle_months: dbDocument.review_cycle_months,
    next_review_date: dbDocument.next_review_date,
    department: dbDocument.department,
    category: dbDocument.category,
    tags: dbDocument.tags,
    related_documents: dbDocument.related_documents,
    attachments: dbDocument.attachments,
    approval_history: dbDocument.approval_history,
    revision_history: dbDocument.revision_history,
    current_approver: dbDocument.current_approver,
    access_level: dbDocument.access_level,
    meta: dbDocument.meta
  };
};

// Function to adapt a document for display in the UI
export const adaptDocumentForUI = (document: Document) => {
  return {
    ...document,
    statusDisplay: formatDocumentStatus(document.status),
    typeDisplay: formatDocumentType(document.document_type),
    // Add any other UI-specific transformations here
  };
};

// Helper function to format document status for display
export const formatDocumentStatus = (status: DocumentStatus | string) => {
  if (typeof status === 'string') {
    return status.replace(/_/g, ' ');
  }
  return status.toString();
};

// Helper function to format document type for display
export const formatDocumentType = (type: DocumentType | string) => {
  if (typeof type === 'string') {
    return type.replace(/_/g, ' ');
  }
  return type.toString();
};

// Function to generate a document number based on type, department, and date
export const generateDocumentNumber = (type: DocumentType, department: string): string => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(2, 2); // Get last 2 digits of year
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const typeCode = type.toString().substr(0, 3).toUpperCase();
  const deptCode = department.substr(0, 3).toUpperCase();
  
  // Generate a random 3-digit number for uniqueness
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${typeCode}-${deptCode}-${year}${month}-${randomNum}`;
};
