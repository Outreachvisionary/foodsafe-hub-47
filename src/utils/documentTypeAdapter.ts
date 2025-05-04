
import { Document } from '@/types/document';
import { DocumentStatus } from '@/types/enums';

// Define a DocumentType enum that's used in this file
enum DocumentType {
  Procedure = 'Procedure',
  Policy = 'Policy',
  Form = 'Form',
  Record = 'Record',
  Manual = 'Manual',
  Other = 'Other'
}

// Function to adapt a document to the format expected by the database
export const adaptDocumentToDatabase = (document: Partial<Document>) => {
  return {
    ...document,
    status: document.status || DocumentStatus.Draft,
    // Remove the document_type property as it's not part of the Document type
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
    // Remove typeDisplay as document_type is not part of the Document interface
  };
};

// Helper function to format document status for display
export const formatDocumentStatus = (status: DocumentStatus | string) => {
  if (typeof status === 'string') {
    return status.replace(/_/g, ' ');
  }
  return String(status).replace(/_/g, ' ');
};

// Helper function to format document type for display
export const formatDocumentType = (type: DocumentType | string) => {
  if (typeof type === 'string') {
    return type.replace(/_/g, ' ');
  }
  return String(type).replace(/_/g, ' ');
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
