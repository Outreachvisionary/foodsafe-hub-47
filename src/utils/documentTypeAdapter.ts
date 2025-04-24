
import { Document as DocumentType, Folder as FolderType, DocumentStatus, DocumentCategory } from '@/types/document';
import { Document as DatabaseDocument, Folder as DatabaseFolder } from '@/types/database';

export const adaptDocumentToDatabase = (doc: DocumentType): DatabaseDocument => {
  // Create a new object with the required structure
  const dbDoc: any = {
    ...doc,
    // Ensure these fields have the expected types
    category: doc.category as any, // Cast to the database enum type
    status: doc.status as any, // Cast to the database enum type
  };
  
  return dbDoc as DatabaseDocument;
};

export const adaptDatabaseToDocument = (doc: DatabaseDocument): DocumentType => {
  return {
    ...doc,
    category: doc.category as DocumentCategory,
    status: doc.status as DocumentStatus,
    // Ensure all required fields are present
    created_by: doc.created_by || 'system',
    title: doc.title || '',
    description: doc.description || '',
    file_name: doc.file_name || '',
    file_size: doc.file_size || 0,
    file_type: doc.file_type || '',
    file_path: doc.file_path || '',
    is_locked: doc.is_locked === undefined ? false : doc.is_locked,
    version: doc.version || 1,
  } as DocumentType;
};

export const adaptDocumentArray = (docs: DocumentType[]): DatabaseDocument[] => {
  return docs.map(adaptDocumentToDatabase);
};

export const adaptDatabaseArray = (docs: DatabaseDocument[]): DocumentType[] => {
  return docs.map(adaptDatabaseToDocument);
};

// Folder adapter functions
export const adaptFolderToDatabase = (folder: FolderType): DatabaseFolder => {
  return {
    ...folder,
    name: folder.name,
    path: folder.path,
    created_by: folder.created_by,
    parent_id: folder.parent_id,
    created_at: folder.created_at || new Date().toISOString(),
    updated_at: folder.updated_at || new Date().toISOString(),
    document_count: folder.document_count || 0
  } as DatabaseFolder;
};

export const adaptDatabaseToFolder = (folder: DatabaseFolder): FolderType => {
  return {
    id: folder.id,
    name: folder.name,
    path: folder.path,
    created_by: folder.created_by,
    parent_id: folder.parent_id,
    created_at: folder.created_at || new Date().toISOString(),
    updated_at: folder.updated_at || new Date().toISOString(),
    document_count: folder.document_count || 0
  } as FolderType;
};

export const adaptFolderArray = (folders: FolderType[]): DatabaseFolder[] => {
  return folders.map(adaptFolderToDatabase);
};

export const adaptDatabaseFolderArray = (folders: DatabaseFolder[]): FolderType[] => {
  return folders.map(adaptDatabaseToFolder);
};
