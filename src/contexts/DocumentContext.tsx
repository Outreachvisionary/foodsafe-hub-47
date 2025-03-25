
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Document, DocumentStatus } from '@/types/supabase';
import { 
  fetchDocuments, 
  fetchFolders, 
  fetchCategories,
  createDocument,
  updateDocument,
  deleteDocument,
  addDocumentActivity
} from '@/services/supabaseService';
import { useNotifications } from './NotificationContext';

interface DocumentContextType {
  documents: Document[];
  categories: { id: string; name: string }[];
  folders: { id: string; name: string; document_count: number }[];
  loading: boolean;
  selectedFolder: string | null;
  setSelectedFolder: (id: string | null) => void;
  addDocument: (doc: Partial<Document>) => Promise<Document | null>;
  updateDocumentStatus: (doc: Document, newStatus: DocumentStatus) => Promise<void>;
  approveDocument: (doc: Document, comment: string) => Promise<void>;
  rejectDocument: (doc: Document, reason: string) => Promise<void>;
  deleteDocumentById: (id: string) => Promise<void>;
  refreshDocuments: () => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType>({
  documents: [],
  categories: [],
  folders: [],
  loading: true,
  selectedFolder: null,
  setSelectedFolder: () => {},
  addDocument: async () => null,
  updateDocumentStatus: async () => {},
  approveDocument: async () => {},
  rejectDocument: async () => {},
  deleteDocumentById: async () => {},
  refreshDocuments: async () => {},
});

export const useDocuments = () => useContext(DocumentContext);

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [folders, setFolders] = useState<{ id: string; name: string; document_count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [docsData, foldersData, categoriesData] = await Promise.all([
        fetchDocuments(),
        fetchFolders(),
        fetchCategories()
      ]);
      
      setDocuments(docsData);
      setFolders(foldersData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading document data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshDocuments = async () => {
    await loadData();
  };

  const addDocument = async (doc: Partial<Document>): Promise<Document | null> => {
    try {
      const newDoc = await createDocument(doc);
      
      if (newDoc) {
        await addDocumentActivity({
          document_id: newDoc.id,
          action: 'Created',
          user_id: 'current-user', // Replace with actual user ID when auth is implemented
          user_name: newDoc.created_by,
          user_role: 'Document Owner',
          timestamp: new Date().toISOString(),
        });
        
        setDocuments(prev => [newDoc, ...prev]);
        
        // Update folder document count
        if (newDoc.folder_id) {
          setFolders(prev => 
            prev.map(folder => 
              folder.id === newDoc.folder_id 
                ? { ...folder, document_count: folder.document_count + 1 } 
                : folder
            )
          );
        }
        
        return newDoc;
      }
    } catch (error) {
      console.error("Error adding document:", error);
    }
    
    return null;
  };

  const updateDocumentStatus = async (doc: Document, newStatus: DocumentStatus) => {
    try {
      const updatedDoc = await updateDocument(doc.id, { 
        status: newStatus,
        updated_at: new Date().toISOString(),
        pending_since: newStatus === 'Pending Approval' ? new Date().toISOString() : null
      });
      
      if (updatedDoc) {
        await addDocumentActivity({
          document_id: doc.id,
          action: `Status changed to ${newStatus}`,
          user_id: 'current-user', // Replace with actual user ID when auth is implemented
          user_name: 'Current User', // Replace with actual username when auth is implemented
          user_role: 'Document Manager',
          timestamp: new Date().toISOString(),
        });
        
        setDocuments(prev => 
          prev.map(d => d.id === doc.id ? updatedDoc : d)
        );
        
        addNotification({
          id: Date.now().toString(),
          type: 'info',
          title: 'Document Status Updated',
          message: `"${doc.title}" status changed to ${newStatus}`,
          read: false,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("Error updating document status:", error);
    }
  };

  const approveDocument = async (doc: Document, comment: string) => {
    try {
      const updatedDoc = await updateDocument(doc.id, { 
        status: 'Approved',
        updated_at: new Date().toISOString(),
        last_action: 'Approved'
      });
      
      if (updatedDoc) {
        await addDocumentActivity({
          document_id: doc.id,
          action: 'Approved',
          user_id: 'current-user', // Replace with actual user ID when auth is implemented
          user_name: 'Current User', // Replace with actual username when auth is implemented
          user_role: 'Approver',
          timestamp: new Date().toISOString(),
          comments: comment || 'Document approved'
        });
        
        setDocuments(prev => 
          prev.map(d => d.id === doc.id ? updatedDoc : d)
        );
        
        addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Document Approved',
          message: `"${doc.title}" has been approved`,
          read: false,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("Error approving document:", error);
    }
  };

  const rejectDocument = async (doc: Document, reason: string) => {
    try {
      const updatedDoc = await updateDocument(doc.id, { 
        status: 'Draft',
        updated_at: new Date().toISOString(),
        last_action: 'Rejected',
        rejection_reason: reason
      });
      
      if (updatedDoc) {
        await addDocumentActivity({
          document_id: doc.id,
          action: 'Rejected',
          user_id: 'current-user', // Replace with actual user ID when auth is implemented
          user_name: 'Current User', // Replace with actual username when auth is implemented
          user_role: 'Approver',
          timestamp: new Date().toISOString(),
          comments: reason || 'Document rejected'
        });
        
        setDocuments(prev => 
          prev.map(d => d.id === doc.id ? updatedDoc : d)
        );
        
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Document Rejected',
          message: `"${doc.title}" was rejected: ${reason}`,
          read: false,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("Error rejecting document:", error);
    }
  };

  const deleteDocumentById = async (id: string) => {
    try {
      const success = await deleteDocument(id);
      
      if (success) {
        const docToDelete = documents.find(d => d.id === id);
        
        setDocuments(prev => prev.filter(d => d.id !== id));
        
        // Update folder document count
        if (docToDelete?.folder_id) {
          setFolders(prev => 
            prev.map(folder => 
              folder.id === docToDelete.folder_id 
                ? { ...folder, document_count: Math.max(0, folder.document_count - 1) } 
                : folder
            )
          );
        }
        
        addNotification({
          id: Date.now().toString(),
          type: 'info',
          title: 'Document Deleted',
          message: `Document has been deleted`,
          read: false,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        categories,
        folders,
        loading,
        selectedFolder,
        setSelectedFolder,
        addDocument,
        updateDocumentStatus,
        approveDocument,
        rejectDocument,
        deleteDocumentById,
        refreshDocuments
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
