
import { DocumentStatus, DocumentCategory, Document as DocumentType } from '@/types/document';
import { Document as DatabaseDocument } from '@/types/database';

export const adaptDocumentToDatabase = (doc: DocumentType): DatabaseDocument => {
  return {
    ...doc,
    category: doc.category as DocumentCategory,
    status: doc.status as DocumentStatus,
  } as DatabaseDocument;
};

export const adaptDatabaseToDocument = (doc: DatabaseDocument): DocumentType => {
  return {
    ...doc,
    category: doc.category,
    status: doc.status,
    // Ensure all required fields are present
    created_by: doc.created_by || 'system',
    title: doc.title || '',
    description: doc.description || '',
    file_name: doc.file_name || '',
    file_size: doc.file_size || 0,
    file_type: doc.file_type || '',
  } as DocumentType;
};

export const adaptDocumentArray = (docs: DocumentType[]): DatabaseDocument[] => {
  return docs.map(adaptDocumentToDatabase);
};

export const adaptDatabaseArray = (docs: DatabaseDocument[]): DocumentType[] => {
  return docs.map(adaptDatabaseToDocument);
};
