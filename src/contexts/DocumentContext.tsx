import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Document, 
  DocumentNotification, 
  DocumentActivity, 
  DocumentStats 
} from '@/types/document';
import { documentWorkflowService } from '@/services/documentWorkflowService';
import documentService from '@/services/documentService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RealtimeChannel } from '@supabase/supabase-js';

// Sample documents for initial state - these will be replaced with data from Supabase
const initialDocuments: Document[] = [];

interface DocumentContextType {
  documents: Document[];
  selectedDocument: Document | null;
  notifications: DocumentNotification[];
  activities: DocumentActivity[];
  stats: DocumentStats;
  isLoading: boolean;
  setSelectedDocument: (doc: Document | null) => void;
  addDocument: (doc: Document) => void;
  updateDocument: (doc: Document) => void;
  deleteDocument: (id: string) => void;
  submitForApproval: (doc: Document) => void;
  approveDocument: (doc: Document, comment?: string) => void;
  rejectDocument: (doc: Document, reason: string) => void;
  publishDocument: (doc: Document) => void;
  archiveDocument: (doc: Document) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  refreshDocumentStats: () => void;
  fetchDocuments: () => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [notifications, setNotifications] = useState<DocumentNotification[]>([]);
  const [activities, setActivities] = useState<DocumentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DocumentStats>({
    totalDocuments: 0,
    pendingApproval: 0,
    expiringSoon: 0,
    expired: 0,
    published: 0,
    archived: 0,
    byCategory: {} as Record<string, number>
  });

  // Set up real-time subscriptions for documents
  useEffect(() => {
    let documentsChannel: RealtimeChannel;

    const setupRealtimeSubscription = () => {
      // Subscribe to changes on the documents table
      documentsChannel = supabase
        .channel('document-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'documents' },
          async (payload) => {
            console.log('Document change received:', payload);
            
            // Handle different types of changes
            if (payload.eventType === 'INSERT') {
              setDocuments(prev => [...prev, payload.new as Document]);
            } 
            else if (payload.eventType === 'UPDATE') {
              setDocuments(prev => 
                prev.map(doc => doc.id === payload.new.id ? (payload.new as Document) : doc)
              );
              
              // Update selected document if it was updated
              if (selectedDocument && selectedDocument.id === payload.new.id) {
                setSelectedDocument(payload.new as Document);
              }
            } 
            else if (payload.eventType === 'DELETE') {
              setDocuments(prev => prev.filter(doc => doc.id !== payload.old.id));
              
              // Clear selected document if it was deleted
              if (selectedDocument && selectedDocument.id === payload.old.id) {
                setSelectedDocument(null);
              }
            }
            
            // Refresh document stats since something changed
            refreshDocumentStats();
          }
        )
        .subscribe();
    };

    fetchDocuments().then(() => {
      setupRealtimeSubscription();
    });

    // Cleanup subscription on unmount
    return () => {
      if (documentsChannel) {
        supabase.removeChannel(documentsChannel);
      }
    };
  }, []);

  // Process documents to update expirations and generate notifications
  useEffect(() => {
    if (documents.length === 0) return;
    
    const updatedDocs = documentWorkflowService.updateDocumentStatusBasedOnExpiry(documents);
    if (JSON.stringify(updatedDocs) !== JSON.stringify(documents)) {
      setDocuments(updatedDocs);
    }
    
    const generatedNotifications = documentWorkflowService.generateNotifications(updatedDocs);
    setNotifications(generatedNotifications);
    
    refreshDocumentStats();
    
    // Set up interval to check for expiry updates regularly
    const interval = setInterval(() => {
      const freshUpdatedDocs = documentWorkflowService.updateDocumentStatusBasedOnExpiry(documents);
      if (JSON.stringify(freshUpdatedDocs) !== JSON.stringify(documents)) {
        setDocuments(freshUpdatedDocs);
      }
      
      const freshNotifications = documentWorkflowService.generateNotifications(freshUpdatedDocs);
      setNotifications(previousNotifications => {
        const existingNotificationMap = new Map(
          previousNotifications.map(n => [n.id, n.isRead])
        );
        
        return freshNotifications.map(n => ({
          ...n,
          isRead: existingNotificationMap.get(n.id) || false
        }));
      });
      
      refreshDocumentStats();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [documents]);

  const refreshDocumentStats = () => {
    const calculatedStats = documentWorkflowService.getDocumentStats(documents);
    setStats(calculatedStats);
  };

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const fetchedDocuments = await documentService.fetchDocuments();
      setDocuments(fetchedDocuments);
      refreshDocumentStats();
      return;
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error('Failed to load documents. Please try again later.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addDocument = async (doc: Document) => {
    try {
      const createdDoc = await documentService.createDocument(doc as Omit<Document, 'id'>);
      setDocuments(prev => [...prev, createdDoc]);
      toast.success('Document added successfully');
      refreshDocumentStats();
      return createdDoc;
    } catch (error) {
      console.error("Error adding document:", error);
      toast.error('Failed to add document. Please try again.');
      throw error;
    }
  };

  const updateDocument = async (doc: Document) => {
    try {
      const updatedDoc = await documentService.updateDocument(doc.id, doc);
      
      // The document will be updated automatically via the real-time subscription,
      // but we'll update it here as well for immediate UI response
      setDocuments(prev => 
        prev.map(d => d.id === doc.id ? updatedDoc : d)
      );
      
      if (selectedDocument && selectedDocument.id === doc.id) {
        setSelectedDocument(updatedDoc);
      }
      
      toast.success('Document updated successfully');
      return updatedDoc;
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error('Failed to update document. Please try again.');
      throw error;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await documentService.deleteDocument(id);
      
      // The document will be removed automatically via the real-time subscription,
      // but we'll remove it here as well for immediate UI response
      setDocuments(prev => prev.filter(d => d.id !== id));
      
      if (selectedDocument && selectedDocument.id === id) {
        setSelectedDocument(null);
      }
      
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error('Failed to delete document. Please try again.');
      throw error;
    }
  };

  const submitForApproval = (doc: Document) => {
    const updatedDoc = documentWorkflowService.submitForApproval(doc);
    updateDocument(updatedDoc);
    
    const newNotification: DocumentNotification = {
      id: `notification-${Math.random().toString(36).substring(2, 11)}`,
      documentId: doc.id,
      documentTitle: doc.title,
      type: 'approval_request',
      message: `New approval request for "${doc.title}"`,
      createdAt: new Date().toISOString(),
      isRead: false,
      targetUserIds: []
    };
    
    setNotifications(prev => [...prev, newNotification]);
    toast.success('Document submitted for approval');
  };

  const approveDocument = (doc: Document, comment?: string) => {
    const updatedDoc = documentWorkflowService.approveDocument(doc, comment);
    updateDocument(updatedDoc);
    
    const newNotification: DocumentNotification = {
      id: `notification-${Math.random().toString(36).substring(2, 11)}`,
      documentId: doc.id,
      documentTitle: doc.title,
      type: 'approval_complete',
      message: `"${doc.title}" has been approved`,
      createdAt: new Date().toISOString(),
      isRead: false,
      targetUserIds: []
    };
    
    setNotifications(prev => [...prev, newNotification]);
    toast.success('Document approved successfully');
  };

  const rejectDocument = (doc: Document, reason: string) => {
    const updatedDoc = documentWorkflowService.rejectDocument(doc, reason);
    updateDocument(updatedDoc);
    
    const newNotification: DocumentNotification = {
      id: `notification-${Math.random().toString(36).substring(2, 11)}`,
      documentId: doc.id,
      documentTitle: doc.title,
      type: 'document_rejected',
      message: `"${doc.title}" was rejected: ${reason}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      targetUserIds: []
    };
    
    setNotifications(prev => [...prev, newNotification]);
    toast.error('Document rejected');
  };

  const publishDocument = (doc: Document) => {
    if (doc.status !== 'Approved') {
      toast.error('Document must be approved before publishing');
      return;
    }
    
    const updatedDoc = documentWorkflowService.publishDocument(doc);
    updateDocument(updatedDoc);
    toast.success('Document published successfully');
  };

  const archiveDocument = (doc: Document) => {
    const updatedDoc = documentWorkflowService.archiveDocument(doc);
    updateDocument(updatedDoc);
    toast.success('Document archived successfully');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        selectedDocument,
        notifications,
        activities,
        stats,
        isLoading,
        setSelectedDocument,
        addDocument,
        updateDocument,
        deleteDocument,
        submitForApproval,
        approveDocument,
        rejectDocument,
        publishDocument,
        archiveDocument,
        markNotificationAsRead,
        clearAllNotifications,
        refreshDocumentStats,
        fetchDocuments
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};
