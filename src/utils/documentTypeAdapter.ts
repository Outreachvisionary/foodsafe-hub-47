
import { DocumentStatus, DocumentCategory, Document as DocumentType, DocumentVersion as DocumentVersionType, DocumentActivity as DocumentActivityType, DocumentAccess as DocumentAccessType, Folder as FolderType } from '@/types/document';
import { Document as DatabaseDocument, DocumentVersion as DatabaseDocumentVersion, DocumentActivity as DatabaseDocumentActivity, DocumentAccess as DatabaseDocumentAccess, Folder as DatabaseFolder } from '@/types/database';

/**
 * Adapts between different document type formats in the system
 * This helps solve the type mismatches between different implementations
 */

export const adaptDocumentToDatabase = (doc: DocumentType): DatabaseDocument => {
  // Cast the document to the database format
  return {
    ...doc,
    // Ensure category is the correct type
    category: doc.category as DocumentCategory,
    // Ensure status is the correct type
    status: doc.status as DocumentStatus,
    // Handle any other necessary conversions
  };
};

export const adaptDatabaseToDocument = (doc: DatabaseDocument): DocumentType => {
  // Cast the database document to the document format
  return {
    ...doc,
    // Ensure category is the correct type
    category: doc.category as DocumentCategory,
    // Ensure status is the correct type
    status: doc.status as DocumentStatus,
    // Handle any other necessary conversions
  };
};

export const adaptDocumentArray = (docs: DocumentType[]): DatabaseDocument[] => {
  return docs.map(adaptDocumentToDatabase);
};

export const adaptDatabaseArray = (docs: DatabaseDocument[]): DocumentType[] => {
  return docs.map(adaptDatabaseToDocument);
};

// Additional adapters for version, activity, access and folder types

export const adaptFolderToDatabase = (folder: FolderType): DatabaseFolder => {
  return {
    ...folder,
    // Add any specific conversions if needed
  } as DatabaseFolder;
};

export const adaptDatabaseToFolder = (folder: DatabaseFolder): FolderType => {
  return {
    ...folder,
    created_at: folder.created_at || new Date().toISOString(), // Ensure created_at is never undefined
    // Add any specific conversions if needed
  } as FolderType;
};

export const adaptVersionToDatabase = (version: DocumentVersionType): DatabaseDocumentVersion => {
  return {
    ...version,
    // Add any specific conversions if needed
  } as DatabaseDocumentVersion;
};

export const adaptDatabaseToVersion = (version: DatabaseDocumentVersion): DocumentVersionType => {
  return {
    ...version,
    // Map version_number to version if it exists
    version: version.version_number || version.version,
    // Map change_summary to change_notes if it exists
    change_notes: version.change_summary || version.change_notes,
    // Add any specific conversions if needed
  } as DocumentVersionType;
};

export const adaptVersionArray = (versions: DocumentVersionType[]): DatabaseDocumentVersion[] => {
  return versions.map(adaptVersionToDatabase);
};

export const adaptDatabaseVersionArray = (versions: DatabaseDocumentVersion[]): DocumentVersionType[] => {
  return versions.map(adaptDatabaseToVersion);
};
