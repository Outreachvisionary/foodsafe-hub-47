
import { useState } from 'react';
import { Document } from '@/types/document';
import { DocumentStatus, CheckoutStatus, DocumentVersionType } from '@/types/enums';
import { adaptDocumentToModel } from '@/utils/typeAdapters';
import { fetchDocuments as fetchDocumentsService } from '@/services/documentService';
import { v4 as uuidv4 } from 'uuid';

export const useDocumentService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async (): Promise<Document[]> => {
    setLoading(true);
    try {
      // In a real application, this would fetch from an API
      const documents = [];
      return documents.map(doc => adaptDocumentToModel(doc));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch documents';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (documentData: Partial<Document>): Promise<Document | null> => {
    setLoading(true);
    try {
      // Mock document creation - in a real app, this would call an API
      const newDocument: Document = {
        id: uuidv4(),
        title: documentData.title || '',
        description: documentData.description || '',
        file_name: documentData.file_name || '',
        file_path: documentData.file_path || '',
        file_size: documentData.file_size || 0,
        file_type: documentData.file_type || '',
        category: documentData.category || 'Other',
        status: documentData.status || DocumentStatus.Draft,
        version: documentData.version || 1,
        created_at: new Date().toISOString(),
        created_by: documentData.created_by || 'Current User',
        updated_at: new Date().toISOString(),
        tags: documentData.tags || [],
        approvers: documentData.approvers || [],
        folders: documentData.folders || [],
        checkout_status: documentData.checkout_status || CheckoutStatus.Available,
        checkout_by: documentData.checkout_by,
        checkout_date: documentData.checkout_date,
        folder_id: documentData.folder_id,
        department: documentData.department,
        expiry_date: documentData.expiry_date,
        effective_date: documentData.effective_date,
        review_date: documentData.review_date,
        pending_since: documentData.pending_since
      };
      
      return newDocument;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create document';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchDocuments,
    createDocument
  };
};

export default useDocumentService;
