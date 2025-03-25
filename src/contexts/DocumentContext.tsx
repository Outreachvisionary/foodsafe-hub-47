import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Document, DocumentNotification, DocumentActivity, DocumentStats } from '@/types/document';
import { documentWorkflowService } from '@/services/documentWorkflowService';
import { toast } from 'sonner';

// Sample documents for initial state
const initialDocuments: Document[] = [
  {
    id: "doc-1",
    title: "Raw Material Receiving SOP",
    fileName: "raw_material_receiving_sop_v3.pdf",
    fileSize: 2456000,
    fileType: "application/pdf",
    category: "SOP",
    status: "Draft",
    version: 3,
    createdBy: "John Doe",
    createdAt: "2023-04-15T10:30:00Z",
    updatedAt: "2023-06-20T14:15:00Z",
    expiryDate: "2024-06-20T14:15:00Z",
    linkedModule: "haccp",
    tags: ['receiving', 'materials', 'procedures'],
    description: "## 1. Purpose\n\nThis Standard Operating Procedure (SOP) establishes guidelines for receiving raw materials to ensure compliance with food safety standards.\n\n## 2. Scope\n\nThis procedure applies to all incoming raw materials at all facilities.\n\n## 3. Responsibilities\n\n- **Receiving Personnel**: Inspect and document incoming materials\n- **QA Manager**: Verify compliance with specifications\n- **Operations Manager**: Ensure proper storage\n\n## 4. Procedure\n\n### 4.1 Pre-Receiving Activities\n\n1. Review purchase orders\n2. Prepare receiving area\n3. Verify calibration of measuring equipment\n\n### 4.2 Receiving Inspection\n\n1. Inspect delivery vehicle for cleanliness\n2. Check temperature of refrigerated/frozen items\n3. Verify packaging integrity\n4. Check for pest activity\n\n### 4.3 Documentation\n\n1. Complete receiving log with date, time, supplier\n2. Record lot numbers and quantities\n3. Document any non-conformances\n\n## 5. Records\n\n- Receiving logs\n- Non-conformance reports\n- Supplier certificates of analysis\n\n## 6. References\n\n- FDA Food Safety Modernization Act (FSMA)\n- Company Food Safety Plan\n- HACCP Plan"
  },
  {
    id: "doc-2",
    title: "Allergen Control Program",
    fileName: "allergen_control_program_v2.docx",
    fileSize: 1245000,
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    category: "Policy",
    status: "Pending Approval",
    version: 2,
    createdBy: "Jane Smith",
    createdAt: "2023-03-10T09:45:00Z",
    updatedAt: "2023-05-22T11:30:00Z",
    expiryDate: "2024-05-22T11:30:00Z",
    linkedModule: "haccp",
    tags: ['allergen', 'control', 'food safety'],
    pendingSince: "2023-05-22T11:30:00Z",
    isLocked: true
  },
  {
    id: "doc-3",
    title: "Supplier Quality Audit Checklist",
    fileName: "supplier_quality_audit_checklist_v1.xlsx",
    fileSize: 985000,
    fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    category: "Form",
    status: "Approved",
    version: 1,
    createdBy: "Sarah Johnson",
    createdAt: "2023-05-05T13:20:00Z",
    updatedAt: "2023-05-05T13:20:00Z",
    expiryDate: "2024-01-05T13:20:00Z",
    linkedModule: "suppliers",
    tags: ['supplier', 'audit', 'checklist'],
    customNotificationDays: [30, 60, 90]
  },
  {
    id: "doc-4",
    title: "HACCP Plan for Production Line A",
    fileName: "haccp_plan_line_a_v2.pdf",
    fileSize: 3567000,
    fileType: "application/pdf",
    category: "HACCP Plan",
    status: "Published",
    version: 2,
    createdBy: "Michael Brown",
    createdAt: "2022-11-20T08:15:00Z",
    updatedAt: "2023-01-15T16:40:00Z",
    expiryDate: "2024-01-15T16:40:00Z",
    linkedModule: "haccp",
    tags: ['haccp', 'production', 'food safety']
  },
  {
    id: "doc-5",
    title: "Annual BRC Audit Report",
    fileName: "brc_audit_report_2023.pdf",
    fileSize: 4215000,
    fileType: "application/pdf",
    category: "Audit Report",
    status: "Published",
    version: 1,
    createdBy: "External Auditor",
    createdAt: "2023-02-28T11:00:00Z",
    updatedAt: "2023-02-28T11:00:00Z",
    expiryDate: "2023-10-15T00:00:00Z", // About to expire
    linkedModule: "audits",
    tags: ['audit', 'BRC', 'compliance']
  },
  {
    id: "doc-6",
    title: "Food Safety Certificate ISO 22000",
    fileName: "iso_22000_certificate.pdf",
    fileSize: 1125000,
    fileType: "application/pdf",
    category: "Certificate",
    status: "Published",
    version: 1,
    createdBy: "Certification Body",
    createdAt: "2022-08-10T09:30:00Z",
    updatedAt: "2022-08-10T09:30:00Z",
    expiryDate: "2023-08-10T09:30:00Z", // Expired
    linkedModule: "none",
    tags: ['certificate', 'ISO 22000', 'food safety']
  }
];

interface DocumentContextType {
  documents: Document[];
  selectedDocument: Document | null;
  notifications: DocumentNotification[];
  activities: DocumentActivity[];
  stats: DocumentStats;
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
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [notifications, setNotifications] = useState<DocumentNotification[]>([]);
  const [activities, setActivities] = useState<DocumentActivity[]>([]);
  const [stats, setStats] = useState<DocumentStats>({
    totalDocuments: 0,
    pendingApproval: 0,
    expiringSoon: 0,
    expired: 0,
    published: 0,
    archived: 0,
    byCategory: {} as Record<string, number>
  });

  // Initialize notifications and stats
  useEffect(() => {
    // Update document status based on expiry dates
    const updatedDocs = documentWorkflowService.updateDocumentStatusBasedOnExpiry(documents);
    if (JSON.stringify(updatedDocs) !== JSON.stringify(documents)) {
      setDocuments(updatedDocs);
    }
    
    // Generate notifications
    const generatedNotifications = documentWorkflowService.generateNotifications(updatedDocs);
    setNotifications(generatedNotifications);
    
    // Calculate stats
    refreshDocumentStats();
    
    // Set up interval to check for expired documents and refresh notifications
    const interval = setInterval(() => {
      const updatedDocs = documentWorkflowService.updateDocumentStatusBasedOnExpiry(documents);
      if (JSON.stringify(updatedDocs) !== JSON.stringify(documents)) {
        setDocuments(updatedDocs);
      }
      
      const freshNotifications = documentWorkflowService.generateNotifications(updatedDocs);
      setNotifications(previousNotifications => {
        // Keep read status of existing notifications
        const existingNotificationMap = new Map(
          previousNotifications.map(n => [n.id, n.isRead])
        );
        
        return freshNotifications.map(n => ({
          ...n,
          isRead: existingNotificationMap.get(n.id) || false
        }));
      });
      
      refreshDocumentStats();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const refreshDocumentStats = () => {
    const calculatedStats = documentWorkflowService.getDocumentStats(documents);
    setStats(calculatedStats);
  };

  const addDocument = (doc: Document) => {
    setDocuments(prev => [...prev, doc]);
    toast.success('Document added successfully');
    refreshDocumentStats();
  };

  const updateDocument = (doc: Document) => {
    setDocuments(prev => 
      prev.map(d => d.id === doc.id ? doc : d)
    );
    
    // If the updated document is currently selected, update the selection
    if (selectedDocument && selectedDocument.id === doc.id) {
      setSelectedDocument(doc);
    }
    
    toast.success('Document updated successfully');
    refreshDocumentStats();
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    
    // If the deleted document is currently selected, clear the selection
    if (selectedDocument && selectedDocument.id === id) {
      setSelectedDocument(null);
    }
    
    toast.success('Document deleted successfully');
    refreshDocumentStats();
  };

  const submitForApproval = (doc: Document) => {
    const updatedDoc = documentWorkflowService.submitForApproval(doc);
    updateDocument(updatedDoc);
    
    // Add approval request notification
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
    
    // Add approval complete notification
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
    
    // Add rejection notification
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
        refreshDocumentStats
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
