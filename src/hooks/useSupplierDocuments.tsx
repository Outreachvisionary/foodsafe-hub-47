
import { useState, useEffect } from 'react';
import { SupplierDocument, StandardName } from '@/types/supplier';
import { 
  fetchAllDocuments, 
  fetchSupplierDocuments, 
  uploadSupplierDocument, 
  updateDocumentStatus, 
  deleteSupplierDocument,
  fetchDocumentStatistics
} from '@/services/supplierDocumentService';
import { toast } from 'sonner';

export function useSupplierDocuments(supplierId?: string, standard?: StandardName) {
  const [documents, setDocuments] = useState<SupplierDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [statistics, setStatistics] = useState<{
    validCount: number;
    expiringCount: number;
    expiredCount: number;
    pendingCount: number;
  }>({
    validCount: 0,
    expiringCount: 0,
    expiredCount: 0,
    pendingCount: 0
  });

  // Load documents based on whether we're looking at a specific supplier or all documents
  const loadDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data: SupplierDocument[];
      if (supplierId) {
        data = await fetchSupplierDocuments(supplierId);
      } else {
        data = await fetchAllDocuments(standard);
      }
      setDocuments(data);
      
      // Also fetch document statistics
      const stats = await fetchDocumentStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError(err instanceof Error ? err : new Error('Failed to load documents'));
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  // Upload a new document
  const uploadDocument = async (
    documentInfo: {
      name: string;
      type: string;
      expiryDate?: string;
      standard?: StandardName;
      file: File;
    },
    targetSupplierId: string = supplierId || ''
  ) => {
    if (!targetSupplierId) {
      throw new Error('Supplier ID is required for uploading documents');
    }
    
    try {
      const newDocument = await uploadSupplierDocument(targetSupplierId, documentInfo);
      setDocuments(prev => [...prev, newDocument]);
      
      // Update statistics
      if (newDocument.status === 'Valid') {
        setStatistics(prev => ({ ...prev, validCount: prev.validCount + 1 }));
      } else if (newDocument.status === 'Expiring Soon') {
        setStatistics(prev => ({ ...prev, expiringCount: prev.expiringCount + 1 }));
      } else if (newDocument.status === 'Expired') {
        setStatistics(prev => ({ ...prev, expiredCount: prev.expiredCount + 1 }));
      } else if (newDocument.status === 'Pending Review') {
        setStatistics(prev => ({ ...prev, pendingCount: prev.pendingCount + 1 }));
      }
      
      toast.success('Document uploaded successfully');
      return newDocument;
    } catch (err) {
      console.error('Error uploading document:', err);
      toast.error('Failed to upload document');
      throw err;
    }
  };

  // Update document status
  const updateStatus = async (
    documentId: string, 
    status: 'Valid' | 'Expiring Soon' | 'Expired' | 'Pending Review'
  ) => {
    try {
      await updateDocumentStatus(documentId, status);
      
      // Find the current status to update statistics
      const currentDocument = documents.find(doc => doc.id === documentId);
      
      // Update documents list
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId ? { ...doc, status } : doc
      ));
      
      // Update statistics
      if (currentDocument) {
        setStatistics(prev => {
          const newStats = { ...prev };
          
          // Decrement count for the old status
          if (currentDocument.status === 'Valid') {
            newStats.validCount = Math.max(0, newStats.validCount - 1);
          } else if (currentDocument.status === 'Expiring Soon') {
            newStats.expiringCount = Math.max(0, newStats.expiringCount - 1);
          } else if (currentDocument.status === 'Expired') {
            newStats.expiredCount = Math.max(0, newStats.expiredCount - 1);
          } else if (currentDocument.status === 'Pending Review') {
            newStats.pendingCount = Math.max(0, newStats.pendingCount - 1);
          }
          
          // Increment count for the new status
          if (status === 'Valid') {
            newStats.validCount++;
          } else if (status === 'Expiring Soon') {
            newStats.expiringCount++;
          } else if (status === 'Expired') {
            newStats.expiredCount++;
          } else if (status === 'Pending Review') {
            newStats.pendingCount++;
          }
          
          return newStats;
        });
      }
      
      toast.success('Document status updated');
    } catch (err) {
      console.error('Error updating document status:', err);
      toast.error('Failed to update document status');
      throw err;
    }
  };

  // Delete a document
  const deleteDocument = async (documentId: string) => {
    try {
      // Find the current status to update statistics
      const currentDocument = documents.find(doc => doc.id === documentId);
      
      await deleteSupplierDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      // Update statistics
      if (currentDocument) {
        setStatistics(prev => {
          const newStats = { ...prev };
          
          if (currentDocument.status === 'Valid') {
            newStats.validCount = Math.max(0, newStats.validCount - 1);
          } else if (currentDocument.status === 'Expiring Soon') {
            newStats.expiringCount = Math.max(0, newStats.expiringCount - 1);
          } else if (currentDocument.status === 'Expired') {
            newStats.expiredCount = Math.max(0, newStats.expiredCount - 1);
          } else if (currentDocument.status === 'Pending Review') {
            newStats.pendingCount = Math.max(0, newStats.pendingCount - 1);
          }
          
          return newStats;
        });
      }
      
      toast.success('Document deleted successfully');
    } catch (err) {
      console.error('Error deleting document:', err);
      toast.error('Failed to delete document');
      throw err;
    }
  };

  // Load documents when the component mounts or dependencies change
  useEffect(() => {
    loadDocuments();
  }, [supplierId, standard]);

  return {
    documents,
    isLoading,
    error,
    statistics,
    loadDocuments,
    uploadDocument,
    updateStatus,
    deleteDocument
  };
}
