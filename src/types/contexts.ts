
import { Document, DocumentVersion, DocumentActivity, DocumentNotification } from './document';

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
}
