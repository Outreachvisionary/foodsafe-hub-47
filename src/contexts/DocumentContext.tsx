
import React, { createContext, useState, useContext, useCallback, useEffect, ReactNode } from 'react';
import { Document, Folder, DocumentNotification, DocumentVersion } from '@/types/document';
import documentService from '@/services/documentService';
import { useToast } from '@/hooks/use-toast';
import { adaptDatabaseToDocument, adaptDatabaseToFolder, adaptDocumentToDatabase } from '@/utils/documentTypeAdapter';

interface DocumentContextProps {
  documents: Document[];
  folders: Folder[];
  notifications: DocumentNotification[];
  selectedDocument: Document | null;
  selectedFolder: Folder | null;
  isLoading: boolean;
  error: Error | null;
  setSelectedDocument: (document: Document | null) => void;
  setSelectedFolder: (folder: Folder | null) => void;
  refreshData: () => Promise<void>;
  updateDocument: (document: Document) => Promise<Document>;
  deleteDocument: (id: string) => Promise<void>;
  submitForApproval: (document: Document) => Promise<Document>;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  fetchDocuments: () => Promise<void>;
  checkoutDocument: (documentId: string) => Promise<void>;
  checkinDocument: (documentId: string, comment: string) => Promise<void>;
  fetchVersions: (documentId: string) => Promise<DocumentVersion[]>;
  restoreVersion: (documentId: string, versionId: string) => Promise<void>;
  downloadVersion: (versionId: string) => Promise<void>;
}

const DocumentContext = createContext<DocumentContextProps>({
  documents: [],
  folders: [],
  notifications: [],
  selectedDocument: null,
  selectedFolder: null,
  isLoading: false,
  error: null,
  setSelectedDocument: () => {},
  setSelectedFolder: () => {},
  refreshData: async () => {},
  updateDocument: async () => ({} as Document),
  deleteDocument: async () => {},
  submitForApproval: async () => ({} as Document),
  markNotificationAsRead: () => {},
  clearAllNotifications: () => {},
  fetchDocuments: async () => {},
  checkoutDocument: async () => {},
  checkinDocument: async () => {},
  fetchVersions: async () => [],
  restoreVersion: async () => {},
  downloadVersion: async () => {},
});

export const useDocuments = () => useContext(DocumentContext);

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notifications, setNotifications] = useState<DocumentNotification[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await documentService.fetchDocuments();
      const docsData = data.map(doc => adaptDatabaseToDocument(doc));
      setDocuments(docsData);
      
      // Fetch folders
      const folderData = await documentService.fetchFolders();
      setFolders(folderData.map(folder => adaptDatabaseToFolder(folder)));
      
      // TODO: Fetch notifications in a real implementation
      // For now, just set some sample notifications
      setNotifications([
        {
          id: '1',
          documentId: docsData[0]?.id || '1',
          documentTitle: docsData[0]?.title || 'Document 1',
          type: 'approval_request',
          message: 'Document awaiting your approval',
          createdAt: new Date().toISOString(),
          isRead: false,
          targetUserIds: ['user1']
        },
        {
          id: '2',
          documentId: docsData[1]?.id || '2',
          documentTitle: docsData[1]?.title || 'Document 2',
          type: 'expiry_reminder',
          message: 'Document is expiring soon',
          createdAt: new Date().toISOString(),
          isRead: false,
          targetUserIds: ['user1']
        }
      ]);
      
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err as Error);
      toast({
        title: "Error",
        description: "Failed to load documents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const refreshData = useCallback(async () => {
    await fetchDocuments();
  }, [fetchDocuments]);
  
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  const updateDocument = useCallback(async (document: Document): Promise<Document> => {
    try {
      // Need to cast the document to the right type for the database
      const dbDocument: any = adaptDocumentToDatabase(document);
      
      const updatedDoc = await documentService.updateDocument(document.id, dbDocument);
      
      // Update local state
      setDocuments(prev => prev.map(doc => 
        doc.id === updatedDoc.id ? adaptDatabaseToDocument(updatedDoc) : doc
      ));
      
      // Update selected document if it's the current one
      if (selectedDocument?.id === updatedDoc.id) {
        setSelectedDocument(adaptDatabaseToDocument(updatedDoc));
      }
      
      toast({
        title: "Success",
        description: "Document updated successfully",
      });
      
      return adaptDatabaseToDocument(updatedDoc);
    } catch (err) {
      console.error('Error updating document:', err);
      toast({
        title: "Error",
        description: "Failed to update document. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  }, [selectedDocument, toast]);
  
  const deleteDocument = useCallback(async (id: string): Promise<void> => {
    try {
      await documentService.deleteDocument(id);
      
      // Update local state - remove the deleted document
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      
      // Clear selected document if it's the deleted one
      if (selectedDocument?.id === id) {
        setSelectedDocument(null);
      }
      
      // Add a notification (in a real app, this would be handled by a backend service)
      const newNotification: DocumentNotification = {
        id: Date.now().toString(),
        documentId: id,
        documentTitle: documents.find(d => d.id === id)?.title || "Unknown document",
        type: 'comment',
        message: 'Document has been deleted',
        createdAt: new Date().toISOString(),
        isRead: false,
        targetUserIds: ['user1']
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting document:', err);
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  }, [selectedDocument, documents, toast]);
  
  const submitForApproval = useCallback(async (document: Document): Promise<Document> => {
    try {
      const docWithUpdatedStatus = {
        ...document,
        status: 'Pending_Approval',
        pending_since: new Date().toISOString()
      };
      
      // Need to cast the document to the right type for the database
      const dbDocument: any = adaptDocumentToDatabase(docWithUpdatedStatus);
      
      const updatedDoc = await documentService.updateDocument(document.id, dbDocument);
      
      // Update local state
      setDocuments(prev => prev.map(doc => 
        doc.id === updatedDoc.id ? adaptDatabaseToDocument(updatedDoc) : doc
      ));
      
      // Update selected document if it's the current one
      if (selectedDocument?.id === updatedDoc.id) {
        setSelectedDocument(adaptDatabaseToDocument(updatedDoc));
      }
      
      // Add a notification (in a real app, this would be handled by a backend service)
      const newNotification: DocumentNotification = {
        id: Date.now().toString(),
        documentId: document.id,
        documentTitle: document.title,
        type: 'approval_request',
        message: `Document "${document.title}" has been submitted for approval`,
        createdAt: new Date().toISOString(),
        isRead: false,
        targetUserIds: ['approver1']
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      toast({
        title: "Success",
        description: "Document submitted for approval",
      });
      
      return adaptDatabaseToDocument(updatedDoc);
    } catch (err) {
      console.error('Error submitting document for approval:', err);
      toast({
        title: "Error",
        description: "Failed to submit document for approval. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  }, [selectedDocument, toast]);
  
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  }, []);
  
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  const checkoutDocument = useCallback(async (documentId: string) => {
    setIsLoading(true);
    try {
      const updatedDoc = await documentService.checkoutDocument(documentId);
      setDocuments(prev => 
        prev.map(doc => doc.id === documentId ? updatedDoc : doc)
      );
    } catch (error) {
      console.error('Error checking out document:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkinDocument = useCallback(async (documentId: string, comment: string) => {
    setIsLoading(true);
    try {
      const updatedDoc = await documentService.checkinDocument(documentId, comment);
      setDocuments(prev => 
        prev.map(doc => doc.id === documentId ? updatedDoc : doc)
      );
    } catch (error) {
      console.error('Error checking in document:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchVersions = useCallback(async (documentId: string) => {
    return await documentService.fetchVersions(documentId);
  }, []);

  const restoreVersion = useCallback(async (documentId: string, versionId: string) => {
    return await documentService.restoreVersion(documentId, versionId);
  }, []);

  const downloadVersion = useCallback(async (versionId: string) => {
    return await documentService.downloadVersion(versionId);
  }, []);

  return (
    <DocumentContext.Provider 
      value={{
        documents,
        folders,
        notifications,
        selectedDocument,
        selectedFolder,
        isLoading,
        error,
        setSelectedDocument,
        setSelectedFolder,
        refreshData,
        updateDocument,
        deleteDocument,
        submitForApproval,
        markNotificationAsRead,
        clearAllNotifications,
        fetchDocuments,
        checkoutDocument,
        checkinDocument,
        fetchVersions,
        restoreVersion,
        downloadVersion
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
