
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Document, DocumentNotification, Folder, DocumentStatus } from '@/types/document';
import documentService from '@/services/documentService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import documentWorkflowService from '@/services/documentWorkflowService';
import { v4 as uuidv4 } from 'uuid';

interface DocumentContextType {
  documents: Document[];
  selectedDocument: Document | null;
  setSelectedDocument: (document: Document | null) => void;
  notifications: DocumentNotification[];
  folders: Folder[];
  selectedFolder: Folder | null;
  setSelectedFolder: (folder: Folder | null) => void;
  fetchDocuments: () => Promise<void>;
  updateDocument: (document: Document) => void;
  submitForApproval: (document: Document) => void;
  approveDocument: (document: Document, comment: string) => Promise<void>;
  rejectDocument: (document: Document, reason: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  error: string | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  refreshData: () => void;
  retryFetchDocuments: () => Promise<void>;
  getDocumentsInFolder: (folderId: string | null) => Document[];
  createFolder: (name: string, parentId: string | null) => Promise<Folder>;
  moveDocumentToFolder: (documentId: string, folderId: string | null) => Promise<void>;
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
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [notifications, setNotifications] = useState<DocumentNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to fetch documents
  const fetchDocuments = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedDocuments = await documentService.fetchDocuments();
      console.log('Fetched documents:', fetchedDocuments);
      setDocuments(fetchedDocuments);
      
      // Also fetch folders when documents are loaded
      fetchFolders();
      
      // Generate real notifications based on the current documents
      const generatedNotifications = documentWorkflowService.generateNotifications(fetchedDocuments);
      setNotifications(generatedNotifications);
      
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      setError('Failed to fetch documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Function for retrying fetch documents (for error handling)
  const retryFetchDocuments = useCallback(async (): Promise<void> => {
    return fetchDocuments();
  }, [fetchDocuments]);
  
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
      
    const folderChanges = supabase
      .channel('folder-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'folders' }, 
        () => {
          console.log('Folders changed, refreshing data...');
          fetchFolders();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(documentChanges);
      supabase.removeChannel(folderChanges);
    };
  }, [fetchDocuments, fetchFolders]);

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
      const updatedDoc = documentWorkflowService.submitForApproval(document);
      await documentService.updateDocument(document.id, updatedDoc);
      
      // Convert updatedDoc to match Document type before updating state
      const typedUpdatedDoc: Document = {
        ...document,
        status: updatedDoc.status as DocumentStatus,
        pending_since: updatedDoc.pending_since
      };
      
      // Update documents list
      setDocuments(docs => 
        docs.map(doc => doc.id === document.id ? typedUpdatedDoc : doc)
      );
      
      // Add a notification for the approval request
      addNotification({
        id: uuidv4(),
        documentId: document.id,
        documentTitle: document.title,
        type: 'approval_request',
        message: `${document.title} needs your approval`,
        createdAt: new Date().toISOString(),
        isRead: false,
        targetUserIds: document.approvers || []
      });
      
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

  // Function to approve a document
  const approveDocument = async (document: Document, comment: string) => {
    try {
      const updatedDoc = documentWorkflowService.approveDocument(document, comment);
      await documentService.updateDocument(document.id, updatedDoc);
      
      // Convert updatedDoc to match Document type before updating state
      const typedUpdatedDoc: Document = {
        ...document,
        status: updatedDoc.status as DocumentStatus,
        last_action: updatedDoc.last_action,
        updated_at: updatedDoc.updated_at
      };
      
      // Update documents list
      setDocuments(docs => 
        docs.map(doc => doc.id === document.id ? typedUpdatedDoc : doc)
      );
      
      // Add a notification for the approval
      addNotification({
        id: uuidv4(),
        documentId: document.id,
        documentTitle: document.title,
        type: 'approval_complete',
        message: `${document.title} has been approved`,
        createdAt: new Date().toISOString(),
        isRead: false,
        targetUserIds: [document.created_by]
      });
      
      toast({
        title: 'Success',
        description: 'Document approved successfully',
      });
    } catch (error: any) {
      console.error('Error approving document:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve document',
        variant: 'destructive',
      });
      throw error; // Re-throw to allow component to handle error
    }
  };

  // Function to reject a document
  const rejectDocument = async (document: Document, reason: string) => {
    try {
      const updatedDoc = documentWorkflowService.rejectDocument(document, reason);
      await documentService.updateDocument(document.id, updatedDoc);
      
      // Convert updatedDoc to match Document type before updating state
      const typedUpdatedDoc: Document = {
        ...document,
        status: updatedDoc.status as DocumentStatus,
        rejection_reason: updatedDoc.rejection_reason,
        last_action: updatedDoc.last_action,
        updated_at: updatedDoc.updated_at
      };
      
      // Update documents list
      setDocuments(docs => 
        docs.map(doc => doc.id === document.id ? typedUpdatedDoc : doc)
      );
      
      // Add a notification for the rejection
      addNotification({
        id: uuidv4(),
        documentId: document.id,
        documentTitle: document.title,
        type: 'approval_rejected',
        message: `${document.title} was rejected: ${reason}`,
        createdAt: new Date().toISOString(),
        isRead: false,
        targetUserIds: [document.created_by]
      });
      
      toast({
        title: 'Success',
        description: 'Document rejected',
      });
    } catch (error: any) {
      console.error('Error rejecting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject document',
        variant: 'destructive',
      });
      throw error; // Re-throw to allow component to handle error
    }
  };

  // Function to add a notification
  const addNotification = (notification: DocumentNotification) => {
    setNotifications(prev => [notification, ...prev]);
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

  // Function to get documents in a specific folder
  const getDocumentsInFolder = (folderId: string | null) => {
    if (!folderId) {
      return documents; // Return all documents if no folder selected
    }
    return documents.filter(doc => doc.folder_id === folderId);
  };

  // Function to create a new folder
  const createFolder = async (name: string, parentId: string | null) => {
    try {
      // Generate a path for the folder
      let path = name;
      if (parentId) {
        const parentFolder = folders.find(f => f.id === parentId);
        if (parentFolder) {
          path = `${parentFolder.path || parentFolder.name}/${name}`;
        }
      }

      const { data, error } = await supabase
        .from('folders')
        .insert({
          name,
          parent_id: parentId,
          path,
          created_by: 'current_user', // This should be replaced with the actual user ID in a real implementation
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update the folders state
      setFolders(prev => [...prev, data]);
      
      toast({
        title: 'Success',
        description: 'Folder created successfully',
      });
      
      return data;
    } catch (error: any) {
      console.error('Error creating folder:', error);
      toast({
        title: 'Error',
        description: 'Failed to create folder',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Function to move a document to a folder
  const moveDocumentToFolder = async (documentId: string, folderId: string | null) => {
    try {
      const document = documents.find(doc => doc.id === documentId);
      if (!document) {
        throw new Error('Document not found');
      }
      
      await documentService.updateDocument(documentId, { folder_id: folderId });
      
      // Update the documents state
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, folder_id: folderId } 
            : doc
        )
      );
      
      toast({
        title: 'Success',
        description: `Document moved to ${folderId ? 'folder' : 'root level'}`,
      });
    } catch (error: any) {
      console.error('Error moving document to folder:', error);
      toast({
        title: 'Error',
        description: 'Failed to move document',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        selectedDocument,
        setSelectedDocument,
        notifications,
        folders,
        selectedFolder,
        setSelectedFolder,
        fetchDocuments,
        updateDocument,
        submitForApproval,
        approveDocument,
        rejectDocument,
        markNotificationAsRead,
        clearAllNotifications,
        error,
        isLoading,
        setIsLoading,
        refreshData,
        retryFetchDocuments,
        getDocumentsInFolder,
        createFolder,
        moveDocumentToFolder
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
