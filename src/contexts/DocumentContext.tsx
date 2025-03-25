
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Document, DocumentStatus } from '@/types/supabase';
import { Document as AppDocument, DocumentStatus as AppDocumentStatus } from '@/types/document';
import { 
  fetchDocuments, 
  fetchFolders, 
  fetchCategories,
  createDocument,
  updateDocument,
  deleteDocument,
  addDocumentActivity,
  fetchAppDocuments,
  fetchAppFolders,
  createAppDocument,
  updateAppDocument
} from '@/services/supabaseService';
import { useNotifications } from './NotificationContext';
import { supabaseToAppDocument, appToSupabaseDocument } from '@/utils/documentTypeConverter';

interface DocumentContextType {
  documents: Document[];
  appDocuments: AppDocument[];
  categories: { id: string; name: string }[];
  folders: { id: string; name: string; parent_id?: string; document_count: number; path: string }[];
  loading: boolean;
  selectedFolder: string | null;
  setSelectedFolder: (id: string | null) => void;
  addDocument: (doc: Partial<Document>) => Promise<Document | null>;
  updateDocumentStatus: (doc: Document, newStatus: DocumentStatus) => Promise<void>;
  approveDocument: (doc: Document, comment: string) => Promise<void>;
  rejectDocument: (doc: Document, reason: string) => Promise<void>;
  deleteDocumentById: (id: string) => Promise<void>;
  refreshDocuments: () => Promise<void>;
  // App document specific functions (using the app's document type)
  addAppDocument: (doc: Partial<AppDocument>) => Promise<AppDocument | null>;
  updateAppDocument: (doc: AppDocument) => Promise<AppDocument | null>;
  // Functions used by the UI
  selectedDocument: AppDocument | null;
  setSelectedDocument: (doc: AppDocument | null) => void;
  submitForApproval: (doc: AppDocument) => Promise<void>;
  updateDocument: (doc: AppDocument) => Promise<void>;
  notifications: any[];
  markNotificationAsRead: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType>({
  documents: [],
  appDocuments: [],
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
  // App document specific functions
  addAppDocument: async () => null,
  updateAppDocument: async () => null,
  // UI functions
  selectedDocument: null,
  setSelectedDocument: () => {},
  submitForApproval: async () => {},
  updateDocument: async () => {},
  notifications: [],
  markNotificationAsRead: async () => {},
  clearAllNotifications: async () => {},
});

export const useDocuments = () => useContext(DocumentContext);

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [appDocuments, setAppDocuments] = useState<AppDocument[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [folders, setFolders] = useState<{ id: string; name: string; parent_id?: string; document_count: number; path: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<AppDocument | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
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
      setAppDocuments(docsData.map(doc => supabaseToAppDocument(doc)));
      setFolders(foldersData);
      setCategories(categoriesData);
      
      // Simulate some notifications for the UI
      setNotifications([
        {
          id: "1",
          type: "approval_request",
          document_title: "Allergen Control Program",
          message: "Document is awaiting your approval",
          is_read: false
        },
        {
          id: "2",
          type: "expiry_reminder",
          document_title: "Food Safety Certificate ISO 22000",
          message: "Document will expire in 30 days",
          is_read: false
        }
      ]);
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
          user_id: 'current-user', 
          user_name: newDoc.created_by,
          user_role: 'Document Owner',
          timestamp: new Date().toISOString(),
        });
        
        setDocuments(prev => [newDoc, ...prev]);
        setAppDocuments(prev => [supabaseToAppDocument(newDoc), ...prev]);
        
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

  const addAppDocument = async (doc: Partial<AppDocument>): Promise<AppDocument | null> => {
    const supaDoc = appToSupabaseDocument(doc as AppDocument);
    const result = await addDocument(supaDoc as Partial<Document>);
    return result ? supabaseToAppDocument(result) : null;
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
          user_id: 'current-user',
          user_name: 'Current User',
          user_role: 'Document Manager',
          timestamp: new Date().toISOString(),
        });
        
        setDocuments(prev => 
          prev.map(d => d.id === doc.id ? updatedDoc : d)
        );
        
        setAppDocuments(prev =>
          prev.map(d => d.id === doc.id ? supabaseToAppDocument(updatedDoc) : d)
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
          user_id: 'current-user',
          user_name: 'Current User',
          user_role: 'Approver',
          timestamp: new Date().toISOString(),
          comments: comment || 'Document approved'
        });
        
        setDocuments(prev => 
          prev.map(d => d.id === doc.id ? updatedDoc : d)
        );
        
        setAppDocuments(prev =>
          prev.map(d => d.id === doc.id ? supabaseToAppDocument(updatedDoc) : d)
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
          user_id: 'current-user',
          user_name: 'Current User',
          user_role: 'Approver',
          timestamp: new Date().toISOString(),
          comments: reason || 'Document rejected'
        });
        
        setDocuments(prev => 
          prev.map(d => d.id === doc.id ? updatedDoc : d)
        );
        
        setAppDocuments(prev =>
          prev.map(d => d.id === doc.id ? supabaseToAppDocument(updatedDoc) : d)
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
        setAppDocuments(prev => prev.filter(d => d.id !== id));
        
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

  // UI and application specific functions
  const submitForApproval = async (doc: AppDocument) => {
    const supaDoc = documents.find(d => d.id === doc.id);
    if (supaDoc) {
      await updateDocumentStatus(supaDoc, 'Pending Approval');
    }
  };

  const updateDocument = async (doc: AppDocument) => {
    const supaDoc = appToSupabaseDocument(doc);
    const result = await updateAppDocument(doc.id, doc);
    if (result) {
      setAppDocuments(prev => prev.map(d => d.id === doc.id ? result : d));
    }
  };

  const markNotificationAsRead = async (id: string) => {
    // Simulate marking notification as read
    setNotifications(prev => prev.map(n => n.id === id ? {...n, is_read: true} : n));
  };

  const clearAllNotifications = async () => {
    // Simulate clearing all notifications
    setNotifications([]);
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        appDocuments,
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
        refreshDocuments,
        // App document specific functions
        addAppDocument,
        updateAppDocument,
        // UI Functions
        selectedDocument,
        setSelectedDocument,
        submitForApproval,
        updateDocument,
        notifications,
        markNotificationAsRead,
        clearAllNotifications
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
