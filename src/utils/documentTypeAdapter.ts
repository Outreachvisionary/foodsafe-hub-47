
import { DocumentStatus, DocumentCategory, Document as DocumentType } from '@/types/document';
import { Document as DatabaseDocument } from '@/types/database';

/**
 * Adapts between different document type formats in the system
 * This helps solve the type mismatches between different implementations
 */

export const adaptDocumentToDatabase = (doc: DocumentType): DatabaseDocument => {
  // Cast the document to the database format
  return {
    ...doc,
    // Ensure category is the correct type
    category: doc.category as unknown as DocumentCategory,
    // Ensure status is the correct type
    status: doc.status as unknown as DocumentStatus
  };
};

export const adaptDatabaseToDocument = (doc: DatabaseDocument): DocumentType => {
  // Cast the database document to the document format
  return {
    ...doc,
    // Ensure category is the correct type
    category: doc.category as unknown as DocumentCategory,
    // Ensure status is the correct type
    status: doc.status as unknown as DocumentStatus
  };
};

export const adaptDocumentArray = (docs: DocumentType[]): DatabaseDocument[] => {
  return docs.map(adaptDocumentToDatabase);
};

export const adaptDatabaseArray = (docs: DatabaseDocument[]): DocumentType[] => {
  return docs.map(adaptDatabaseToDocument);
};
