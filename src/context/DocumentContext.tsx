
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Document, Folder } from '@/types/document';

interface DocumentContextProps {
  documents: Document[];
  folders: Folder[];
  selectedDocument: Document | null;
  selectedFolder: Folder | null;
  isLoading: boolean;
  error: string | null;
  fetchDocuments: (folderId?: string) => Promise<void>;
  refreshDocuments: () => Promise<void>;
  createDocument: (document: Partial<Document>) => Promise<Document>;
  updateDocument: (id: string, document: Partial<Document>) => Promise<Document>;
  deleteDocument: (id: string) => Promise<void>;
  selectDocument: (document: Document | null) => void;
  selectFolder: (folder: Folder | null) => void;
  createFolder: (folder: Partial<Folder>) => Promise<Folder>;
  updateFolder: (id: string, folder: Partial<Folder>) => Promise<Folder>;
  deleteFolder: (id: string) => Promise<void>;
  uploadDocument: (file: File, document: Partial<Document>) => Promise<Document>;
  approveDocument: (documentId: string, userId: string, comments?: string) => Promise<void>;
  rejectDocument: (documentId: string, userId: string, reason: string) => Promise<void>;
}

const DocumentContext = createContext<DocumentContextProps | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async (folderId?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase.from('documents').select('*');
      if (folderId) {
        query = query.eq('folder_id', folderId);
      } else {
        query = query.is('folder_id', null);
      }

      const { data: documentsData, error: documentsError } = await query;

      if (documentsError) throw documentsError;

      const { data: foldersData, error: foldersError } = await supabase
        .from('folders')
        .select('*')
        .order('name');

      if (foldersError) throw foldersError;

      setDocuments(documentsData as Document[]);
      setFolders(foldersData as Folder[]);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching documents:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshDocuments = useCallback(async () => {
    const folderId = selectedFolder?.id;
    await fetchDocuments(folderId);
    
    // If we have a selected document, refresh it
    if (selectedDocument) {
      const { data: refreshedDoc } = await supabase
        .from('documents')
        .select('*')
        .eq('id', selectedDocument.id)
        .single();
      
      if (refreshedDoc) {
        setSelectedDocument(refreshedDoc as Document);
      }
    }
  }, [fetchDocuments, selectedFolder?.id, selectedDocument]);

  const createDocument = useCallback(async (document: Partial<Document>): Promise<Document> => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert(document)
        .select()
        .single();

      if (error) throw error;

      setDocuments(prev => [...prev, data as Document]);
      return data as Document;
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating document:', err);
      throw err;
    }
  }, []);

  const updateDocument = useCallback(async (id: string, document: Partial<Document>): Promise<Document> => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .update(document)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setDocuments(prev =>
        prev.map(doc => (doc.id === id ? { ...doc, ...data } : doc))
      );

      if (selectedDocument?.id === id) {
        setSelectedDocument({ ...selectedDocument, ...data });
      }

      return data as Document;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating document:', err);
      throw err;
    }
  }, [selectedDocument]);

  const deleteDocument = useCallback(async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.from('documents').delete().eq('id', id);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== id));

      if (selectedDocument?.id === id) {
        setSelectedDocument(null);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting document:', err);
      throw err;
    }
  }, [selectedDocument]);

  const selectDocument = useCallback((document: Document | null) => {
    setSelectedDocument(document);
  }, []);

  const selectFolder = useCallback((folder: Folder | null) => {
    setSelectedFolder(folder);
    setSelectedDocument(null);
  }, []);

  const createFolder = useCallback(async (folder: Partial<Folder>): Promise<Folder> => {
    try {
      const { data, error } = await supabase
        .from('folders')
        .insert(folder)
        .select()
        .single();

      if (error) throw error;

      setFolders(prev => [...prev, data as Folder]);
      return data as Folder;
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating folder:', err);
      throw err;
    }
  }, []);

  const updateFolder = useCallback(async (id: string, folder: Partial<Folder>): Promise<Folder> => {
    try {
      const { data, error } = await supabase
        .from('folders')
        .update(folder)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFolders(prev =>
        prev.map(f => (f.id === id ? { ...f, ...data } : f))
      );

      if (selectedFolder?.id === id) {
        setSelectedFolder({ ...selectedFolder, ...data });
      }

      return data as Folder;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating folder:', err);
      throw err;
    }
  }, [selectedFolder]);

  const deleteFolder = useCallback(async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.from('folders').delete().eq('id', id);

      if (error) throw error;

      setFolders(prev => prev.filter(folder => folder.id !== id));

      if (selectedFolder?.id === id) {
        setSelectedFolder(null);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting folder:', err);
      throw err;
    }
  }, [selectedFolder]);

  const uploadDocument = useCallback(async (file: File, document: Partial<Document>): Promise<Document> => {
    try {
      // Create document entry
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert({
          ...document,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (docError) throw docError;

      // Upload file to storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(`${docData.id}/${file.name}`, file);

      if (storageError) {
        // Rollback document creation if storage upload fails
        await supabase.from('documents').delete().eq('id', docData.id);
        throw storageError;
      }

      // Create initial version
      const { data: versionData, error: versionError } = await supabase
        .from('document_versions')
        .insert({
          document_id: docData.id,
          file_name: file.name,
          file_size: file.size,
          created_by: document.created_by,
          modified_by: document.created_by,
          modified_by_name: 'User', // This should be fetched from user profile
          version_type: 'major'
        })
        .select()
        .single();

      if (versionError) {
        // Log error but don't fail the operation
        console.error('Error creating initial version:', versionError);
      }

      // Update document with version ID
      if (versionData) {
        await supabase
          .from('documents')
          .update({
            current_version_id: versionData.id
          })
          .eq('id', docData.id);
      }

      // Update local state
      const newDoc = docData as Document;
      setDocuments(prev => [...prev, newDoc]);
      
      return newDoc;
    } catch (err: any) {
      setError(err.message);
      console.error('Error uploading document:', err);
      throw err;
    }
  }, []);

  const approveDocument = useCallback(async (documentId: string, userId: string, comments?: string) => {
    try {
      // Implementation for document approval
      console.log('Approving document', documentId);
    } catch (error: any) {
      setError(error.message);
      console.error('Error approving document:', error);
      throw error;
    }
  }, []);

  const rejectDocument = useCallback(async (documentId: string, userId: string, reason: string) => {
    try {
      // Implementation for document rejection
      console.log('Rejecting document', documentId, 'with reason:', reason);
    } catch (error: any) {
      setError(error.message);
      console.error('Error rejecting document:', error);
      throw error;
    }
  }, []);

  const value = {
    documents,
    folders,
    selectedDocument,
    selectedFolder,
    isLoading,
    error,
    fetchDocuments,
    refreshDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    selectDocument,
    selectFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    uploadDocument,
    approveDocument,
    rejectDocument
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = (): DocumentContextProps => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};
