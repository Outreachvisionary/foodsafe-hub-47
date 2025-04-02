
import { Document, DocumentVersion, DocumentActivity, DocumentNotification, DocumentRelationship, DocumentSummary } from './document';

export interface DocumentContextType {
  documents: Document[];
  selectedDocument: Document | null;
  notifications: DocumentNotification[];
  isLoading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  refreshData: () => Promise<void>;
  setSelectedDocument: (document: Document | null) => void;
  createDocument: (document: Partial<Document>) => Promise<Document>;
  updateDocument: (document: Document) => Promise<Document>;
  deleteDocument: (documentId: string) => Promise<void>;
  submitForApproval: (document: Document) => Promise<Document>;
  approveDocument: (document: Document, comment?: string) => Promise<Document>;
  rejectDocument: (document: Document, reason: string) => Promise<Document>;
  markNotificationAsRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  checkoutDocument: (document: Document) => Promise<Document>;
  checkinDocument: (document: Document) => Promise<Document>;
  selectedFolder: any;
  setSelectedFolder: (folder: any) => void;
  folders: any[];
  // New methods for Phase 2 features
  addDocumentRelationship: (sourceDocId: string, targetDocId: string, relationType: string) => Promise<DocumentRelationship | null>;
  removeDocumentRelationship: (relationshipId: string) => Promise<void>;
  getDocumentRelationships: (documentId: string) => Promise<DocumentRelationship[]>;
  generateDocumentSummary: (documentId: string) => Promise<DocumentSummary | null>;
  getDocumentSummary: (documentId: string) => Promise<DocumentSummary | null>;
  getDocumentsInFolder?: (folderId: string | null) => Document[];
  retryFetchDocuments?: () => Promise<void>;
  createFolder?: (name: string, parentId: string | null) => Promise<any>;
  moveDocumentToFolder?: (documentId: string, folderId: string | null) => Promise<void>;
  setIsLoading?: (loading: boolean) => void;
}
