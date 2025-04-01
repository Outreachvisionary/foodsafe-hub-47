
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Document, DocumentNotification, Folder } from '@/types/document';
import documentService from '@/services/documentService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentContextType {
  documents: Document[];
  selectedDocument: Document | null;
  setSelectedDocument: (document: Document | null) => void;
  notifications: DocumentNotification[];
  folders: Folder[];
  fetchDocuments: () => Promise<void>;
  updateDocument: (document: Document) => void;
  submitForApproval: (document: Document) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  error: string | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  refreshData: () => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [notifications, setNotifications] = useState<DocumentNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to fetch documents
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedDocuments = await documentService.fetchDocuments();
      console.log('Documents fetched:', fetchedDocuments);
      setDocuments(fetchedDocuments);
      
      // Also fetch folders when documents are loaded
      fetchFolders();
      
      return fetchedDocuments;
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      setError('Failed to fetch documents. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Function to fetch folders
  const fetchFolders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setFolders(data || []);
    } catch (error: any) {
      console.error('Error fetching folders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load folders',
        variant: 'destructive'
      });
    }
  }, [toast]);

  // Function to refresh all data
  const refreshData = useCallback(() => {
    fetchDocuments();
    // Add any other data refresh calls here
  }, [fetchDocuments]);

  // Initial data load
  useEffect(() => {
    fetchDocuments();
    
    // Set up real-time subscription for document changes
    const documentChanges = supabase
      .channel('document-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'documents' }, 
        () => {
          console.log('Documents changed, refreshing data...');
          fetchDocuments();
        }
      )
      .subscribe();
      
    // Auto-refresh every minute
    const refreshInterval = setInterval(() => {
      refreshData();
    }, 60000);
    
    return () => {
      supabase.removeChannel(documentChanges);
      clearInterval(refreshInterval);
    };
  }, [fetchDocuments, refreshData]);

  // Load mock notifications
  useEffect(() => {
    // Mock notifications for demonstration purposes
    const mockNotifications: DocumentNotification[] = [
      {
        id: '1',
        documentId: '123',
        documentTitle: 'HACCP Plan Review',
        type: 'approval_request',
        message: 'HACCP Plan needs your approval',
        createdAt: new Date().toISOString(),
        isRead: false,
        targetUserIds: ['current-user']
      },
      {
        id: '2',
        documentId: '456',
        documentTitle: 'SOP-001 Manufacturing Process',
        type: 'expiry_reminder',
        message: 'Document expires in 15 days',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        isRead: false,
        targetUserIds: ['current-user']
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);

  // Function to update a document
  const updateDocument = async (updatedDoc: Document) => {
    try {
      await documentService.updateDocument(updatedDoc.id, updatedDoc);
      
      // Update documents list
      setDocuments(docs => 
        docs.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc)
      );
      
      // If the updated document is the selected document, update it
      if (selectedDocument && selectedDocument.id === updatedDoc.id) {
        setSelectedDocument(updatedDoc);
      }
      
      toast({
        title: 'Success',
        description: 'Document updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating document:', error);
      toast({
        title: 'Error',
        description: 'Failed to update document',
        variant: 'destructive',
      });
    }
  };

  // Function to submit a document for approval
  const submitForApproval = async (document: Document) => {
    try {
      const updatedDoc: Partial<Document> = {
        ...document,
        status: 'Pending Approval',
        updated_at: new Date().toISOString(),
      };
      
      await documentService.updateDocument(document.id, updatedDoc);
      
      // Update documents list
      setDocuments(docs => 
        docs.map(doc => doc.id === document.id ? {...doc, ...updatedDoc} : doc)
      );
      
      toast({
        title: 'Success',
        description: 'Document submitted for approval',
      });
    } catch (error: any) {
      console.error('Error submitting document for approval:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit document for approval',
        variant: 'destructive',
      });
    }
  };

  // Function to mark a notification as read
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  // Function to clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        selectedDocument,
        setSelectedDocument,
        notifications,
        folders,
        fetchDocuments,
        updateDocument,
        submitForApproval,
        markNotificationAsRead,
        clearAllNotifications,
        error,
        isLoading,
        setIsLoading,
        refreshData
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
