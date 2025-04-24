
import { Document as DocumentType, Folder as FolderType, DocumentStatus, DocumentCategory } from '@/types/document';
import { Document as DatabaseDocument, Folder as DatabaseFolder } from '@/types/database';

export const adaptDocumentToDatabase = (doc: DocumentType): DatabaseDocument => {
  // Create a new object to avoid mutating the original
  const dbDoc: any = { ...doc };
  
  // Ensure category is properly cast to the database enum type
  if (typeof doc.category === 'string') {
    // Assuming the database expects specific enum values
    dbDoc.category = doc.category as DocumentCategory;
  }
  
  // Similarly for status
  if (typeof doc.status === 'string') {
    dbDoc.status = doc.status as DocumentStatus;
  }
  
  return dbDoc as DatabaseDocument;
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
    file_path: doc.file_path || '',
    is_locked: doc.is_locked === undefined ? false : doc.is_locked,
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
