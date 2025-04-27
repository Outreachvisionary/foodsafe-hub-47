import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Document, CheckoutStatus, DocumentStatus } from '@/types/document';
import {
  mapDbToAppDocStatus,
  mapAppToDbDocStatus,
  mapDbToAppCheckoutStatus,
  mapAppToDbCheckoutStatus,
  adaptDocumentToDatabase,
  adaptDatabaseToDocument
} from '@/utils/documentTypeAdapter';

interface UseDocumentService {
  documents: Document[];
  loading: boolean;
  error: string | null;
  fetchDocuments: (filter?: any) => Promise<void>;
  fetchDocumentById: (id: string) => Promise<Document | null>;
  createDocument: (newDocument: Partial<Document>) => Promise<Document | null>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<Document | null>;
  deleteDocument: (id: string) => Promise<void>;
  checkoutDocument: (id: string, userId: string) => Promise<void>;
  checkinDocument: (id: string, userId: string, newStatus: DocumentStatus) => Promise<void>;
  getDocumentVersions: (documentId: string) => Promise<any[]>;
  getDocumentActivities: (documentId: string) => Promise<any[]>;
  uploadFile: (file: File, path: string) => Promise<string | null>;
  deleteFile: (filePath: string) => Promise<void>;
}

const useDocumentService = (): UseDocumentService => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDocuments = useCallback(async (filter: any = {}) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('documents')
        .select('*');

      // Apply filters
      if (filter.searchTerm) {
        query = query.ilike('title', `%${filter.searchTerm}%`);
      }
      if (filter.status && filter.status.length > 0) {
        query = query.in('status', filter.status);
      }
      if (filter.category && filter.category.length > 0) {
        query = query.in('category', filter.category);
      }
      if (filter.ownedByMe) {
        // Assuming you have user context to get the current user ID
        const userId = supabase.auth.user()?.id;
        query = query.eq('created_by', userId);
      }
      if (filter.dateRange && filter.dateRange.start && filter.dateRange.end) {
        query = query.gte('created_at', filter.dateRange.start);
        query = query.lte('created_at', filter.dateRange.end);
      }
      if (filter.sortBy) {
        const ascending = filter.sortDirection === 'asc';
        query = query.order(filter.sortBy, { ascending });
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      // Adapt database documents to application documents
      const adaptedDocuments = data.map(dbDocument => adaptDatabaseToDocument(dbDocument));
      setDocuments(adaptedDocuments);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDocumentById = useCallback(async (id: string): Promise<Document | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return adaptDatabaseToDocument(data);
    } catch (err: any) {
      setError(err.message);
      console.error(`Error fetching document with ID ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createDocument = useCallback(async (newDocument: Partial<Document>): Promise<Document | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert(adaptDocumentToDatabase(newDocument))
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Document Created",
        description: "The document has been created successfully.",
      });

      return adaptDatabaseToDocument(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to create the document.",
        variant: "destructive",
      });
      console.error("Error creating document:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateDocument = useCallback(async (id: string, updates: Partial<Document>): Promise<Document | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('documents')
        .update(adaptDocumentToDatabase(updates))
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Document Updated",
        description: "The document has been updated successfully.",
      });

      return adaptDatabaseToDocument(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to update the document.",
        variant: "destructive",
      });
      console.error(`Error updating document with ID ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteDocument = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      setDocuments(prevDocuments => prevDocuments.filter(document => document.id !== id));

      toast({
        title: "Document Deleted",
        description: "The document has been deleted successfully.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to delete the document.",
        variant: "destructive",
      });
      console.error(`Error deleting document with ID ${id}:`, err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const checkoutDocument = useCallback(async (id: string, userId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // First, get the current document to check its checkout status
      const { data: dbDocument, error: getError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (getError) {
        throw new Error(getError.message);
      }

      if (!dbDocument) {
        throw new Error('Document not found');
      }

      if (mapDbToAppCheckoutStatus(dbDocument.checkout_status) === 'Checked_Out') {
        throw new Error('Document is already checked out');
      }

      // Proceed with the checkout
      const { error } = await supabase
        .from('documents')
        .update({
          checkout_status: 'Checked Out',
          checkout_user_id: userId,
          checkout_timestamp: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Document Checked Out",
        description: "The document has been checked out successfully.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to check out the document.",
        variant: "destructive",
      });
      console.error(`Error checking out document with ID ${id}:`, err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const checkinDocument = useCallback(async (id: string, userId: string, newStatus: DocumentStatus): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // First, get the current document to check its checkout status
      const { data: dbDocument, error: getError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (getError) {
        throw new Error(getError.message);
      }

      if (!dbDocument) {
        throw new Error('Document not found');
      }

      if (mapDbToAppCheckoutStatus(dbDocument.checkout_status) === 'Checked_Out' && dbDocument.checkout_user_id !== userId) {
        throw new Error('Document is checked out by another user');
      }

      const { error } = await supabase
        .from('documents')
        .update({
          checkout_status: 'Available',
          checkout_user_id: null,
          checkout_timestamp: null,
          status: mapAppToDbDocStatus(newStatus),
        })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Document Checked In",
        description: "The document has been checked in successfully.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to check in the document.",
        variant: "destructive",
      });
      console.error(`Error checking in document with ID ${id}:`, err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getDocumentVersions = useCallback(async (documentId: string): Promise<any[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (err: any) {
      setError(err.message);
      console.error(`Error fetching versions for document ID ${documentId}:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getDocumentActivities = useCallback(async (documentId: string): Promise<any[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('document_activities')
        .select('*')
        .eq('document_id', documentId)
        .order('timestamp', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (err: any) {
      setError(err.message);
      console.error(`Error fetching activities for document ID ${documentId}:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadFile = useCallback(async (file: File, path: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.storage
        .from('documents')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(error.message);
      }

      return `${supabase.supabaseUrl}/storage/v1/object/public/documents/${path}`;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to upload the file.",
        variant: "destructive",
      });
      console.error("Error uploading file:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteFile = useCallback(async (filePath: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "File Deleted",
        description: "The file has been deleted successfully.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to delete the file.",
        variant: "destructive",
      });
      console.error("Error deleting file:", err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    fetchDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    checkoutDocument,
    checkinDocument,
    getDocumentVersions,
    getDocumentActivities,
    uploadFile,
    deleteFile
  };
};

export default useDocumentService;
