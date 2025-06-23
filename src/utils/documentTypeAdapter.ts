
import { Document, DocumentStatus, CheckoutStatus } from '@/types/document';

// Function to adapt a document to the format expected by the database
export const adaptDocumentToDatabase = (document: Partial<Document>) => {
  return {
    ...document,
    status: document.status || 'Draft',
    checkout_status: document.checkout_status || 'Available',
  };
};

// Function to adapt a document from the database to the format expected by the application
export const adaptDocumentFromDatabase = (dbDocument: any): Document => {
  return {
    id: dbDocument.id,
    title: dbDocument.title,
    description: dbDocument.description,
    file_name: dbDocument.file_name,
    file_size: dbDocument.file_size,
    file_type: dbDocument.file_type,
    category: dbDocument.category,
    status: dbDocument.status,
    checkout_status: dbDocument.checkout_status || 'Available',
    created_at: dbDocument.created_at,
    updated_at: dbDocument.updated_at,
    created_by: dbDocument.created_by,
    version: dbDocument.version,
    folder_id: dbDocument.folder_id,
    file_path: dbDocument.file_path,
    expiry_date: dbDocument.expiry_date,
    // Include other fields from the Document interface as needed
  };
};

// Function to adapt a document for display in the UI
export const adaptDocumentForUI = (document: Document) => {
  return {
    ...document,
    statusDisplay: formatDocumentStatus(document.status),
  };
};

// Helper function to format document status for display
export const formatDocumentStatus = (status: DocumentStatus | string) => {
  if (typeof status === 'string') {
    return status.replace(/_/g, ' ');
  }
  return String(status).replace(/_/g, ' ');
};

// Function to generate a document number based on type, department, and date
export const generateDocumentNumber = (type: string, department: string): string => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(2, 2); // Get last 2 digits of year
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const typeCode = type.toString().substr(0, 3).toUpperCase();
  const deptCode = department.substr(0, 3).toUpperCase();
  
  // Generate a random 3-digit number for uniqueness
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${typeCode}-${deptCode}-${year}${month}-${randomNum}`;
};
