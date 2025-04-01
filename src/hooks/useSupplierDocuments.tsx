
import { useState, useEffect } from 'react';
import { SupplierDocument, StandardName } from '@/types/supplier';
import { 
  fetchSupplierDocuments, 
  fetchAllDocuments, 
  uploadSupplierDocument, 
  deleteSupplierDocument,
  fetchDocumentStatistics
} from '@/services/supplierDocumentService';
import { toast } from 'sonner';

export function useSupplierDocuments(supplierId?: string, standard?: StandardName) {
  const [documents, setDocuments] = useState<SupplierDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [statistics, setStatistics] = useState({
    validCount: 0,
    expiringCount: 0,
    expiredCount: 0,
    pendingCount: 0
  });

  // Load documents
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
      
      // Load statistics
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

  // Upload a document
  const uploadDocument = async (
    document: {
      name: string;
      type: string;
      expiryDate?: string;
      standard?: StandardName;
      file: File;
    },
    supplierId: string
  ) => {
    try {
      const newDocument = await uploadSupplierDocument(supplierId, document);
      setDocuments(prev => [...prev, newDocument]);
      toast.success('Document uploaded successfully');
      await loadDocuments(); // Reload to get updated statistics
      return newDocument;
    } catch (err) {
      console.error('Error uploading document:', err);
      toast.error('Failed to upload document');
      throw err;
    }
  };

  // Delete a document
  const deleteDocument = async (documentId: string) => {
    try {
      await deleteSupplierDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success('Document deleted successfully');
      await loadDocuments(); // Reload to get updated statistics
    } catch (err) {
      console.error('Error deleting document:', err);
      toast.error('Failed to delete document');
      throw err;
    }
  };

  // Load documents on mount or when props change
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
    deleteDocument
  };
}
