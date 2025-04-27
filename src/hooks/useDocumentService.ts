import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Document, CheckoutStatus, DocumentStatus } from '@/types/document';
import { convertToDocumentStatus, convertToCheckoutStatus } from '@/utils/typeAdapters';

interface UseDocumentService {
  documents: Document[];
  loading: boolean;
  error: string | null;
  fetchDocuments: (filter?: any) => Promise<void>;
  fetchDocumentById: (id: string) => Promise<Document | null>;
  createDocument: (newDocument: Partial<Document>) => Promise<Document | null>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<Document | null>;
  deleteDocument: (id: string) => Promise<void>;
  checkOutDocument: (id: string, userId: string, userName: string, userRole: string) => Promise<void>;
  checkInDocument: (id: string, userId: string, comments?: string) => Promise<void>;
  getDocumentVersions: (documentId: string) => Promise<any[]>;
  getDocumentActivities: (documentId: string) => Promise<any[]>;
  uploadFile: (file: File, path: string) => Promise<string | null>;
  deleteFile: (filePath: string) => Promise<void>;
  getDocumentComments: (documentId: string) => Promise<any[]>;
  createDocumentComment: (documentId: string, comment: string) => Promise<void>;
  fetchAccess: (documentId: string) => Promise<any[]>;
  grantAccess: (documentId: string, userId: string) => Promise<void>;
  revokeAccess: (documentId: string, userId: string) => Promise<void>;
  restoreVersion: (documentId: string, versionId: string) => Promise<void>;
  downloadVersion: (documentId: string, versionId: string) => Promise<void>;
}

const useDocumentService = () => {
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
        // Get the current user ID
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('created_by', user.id);
        }
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

      // Convert database documents to application format
      const adaptedDocuments = data.map((dbDocument: any) => ({
        ...dbDocument,
        status: convertToDocumentStatus(dbDocument.status),
        checkout_status: dbDocument.checkout_status ? 
          convertToCheckoutStatus(dbDocument.checkout_status) : 'Available'
      })) as Document[];

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

      // Convert to application format
      return {
        ...data,
        status: convertToDocumentStatus(data.status),
        checkout_status: data.checkout_status ? 
          convertToCheckoutStatus(data.checkout_status) : 'Available'
      } as Document;
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
  }, []);

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
  }, []);

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
  }, []);

  const checkOutDocument = useCallback(async (
    id: string, 
    userId: string,
    userName: string,
    userRole: string
  ): Promise<void> => {
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

      if (convertToCheckoutStatus(dbDocument.checkout_status) === 'Checked_Out') {
        throw new Error('Document is already checked out');
      }

      // Proceed with the checkout
      const { error } = await supabase
        .from('documents')
        .update({
          checkout_status: 'Checked_Out',
          checkout_user_id: userId,
          checkout_user_name: userName,
          checkout_timestamp: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Record activity
      await recordDocumentActivity(
        id, 
        'checkout', 
        userId, 
        userName, 
        userRole, 
        'Document checked out'
      );

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

  const checkInDocument = useCallback(async (
    id: string, 
    userId: string, 
    comments?: string
  ): Promise<void> => {
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

      if (convertToCheckoutStatus(dbDocument.checkout_status) === 'Checked_Out' && 
          dbDocument.checkout_user_id !== userId) {
        throw new Error('Document is checked out by another user');
      }

      const { error } = await supabase
        .from('documents')
        .update({
          checkout_status: 'Available',
          checkout_user_id: null,
          checkout_timestamp: null,
        })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Get user info for activity record
      const userQuery = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', userId)
        .single();
        
      const userName = userQuery.data?.full_name || 'Unknown User';
      const userRole = userQuery.data?.role || 'User';

      // Record activity
      await recordDocumentActivity(
        id,
        'checkin',
        userId,
        userName,
        userRole,
        comments || 'Document checked in'
      );

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

  const recordDocumentActivity = async (
    documentId: string,
    action: string,
    userId: string,
    userName: string,
    userRole: string,
    comments?: string,
    checkoutAction?: string,
    versionId?: string
  ) => {
    try {
      await supabase.from('document_activities').insert({
        document_id: documentId,
        action,
        user_id: userId,
        user_name: userName,
        user_role: userRole,
        comments,
        checkout_action: checkoutAction,
        version_id: versionId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error recording document activity:', error);
    }
  };

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

  const getDocumentComments = useCallback(async (documentId: string): Promise<any[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('document_comments')
        .select('*')
        .eq('document_id', documentId)
        .order('timestamp', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (err: any) {
      setError(err.message);
      console.error(`Error fetching comments for document ID ${documentId}:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createDocumentComment = useCallback(async (documentId: string, comment: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await supabase
        .from('document_comments')
        .insert({
          document_id: documentId,
          comment,
          timestamp: new Date().toISOString()
        });

      toast({
        title: "Comment Created",
        description: "The comment has been created successfully.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to create the comment.",
        variant: "destructive",
      });
      console.error("Error creating comment:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAccess = useCallback(async (documentId: string): Promise<any[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('document_access')
        .select('*')
        .eq('document_id', documentId);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (err: any) {
      setError(err.message);
      console.error(`Error fetching access for document ID ${documentId}:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const grantAccess = useCallback(async (documentId: string, userId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await supabase
        .from('document_access')
        .insert({
          document_id: documentId,
          user_id: userId,
          timestamp: new Date().toISOString()
        });

      toast({
        title: "Access Granted",
        description: "Access has been granted successfully.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to grant access.",
        variant: "destructive",
      });
      console.error("Error granting access:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const revokeAccess = useCallback(async (documentId: string, userId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await supabase
        .from('document_access')
        .delete()
        .eq('document_id', documentId)
        .eq('user_id', userId);

      toast({
        title: "Access Revoked",
        description: "Access has been revoked successfully.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to revoke access.",
        variant: "destructive",
      });
      console.error("Error revoking access:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const restoreVersion = useCallback(async (documentId: string, versionId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await supabase
        .from('document_versions')
        .update({
          status: 'Active'
        })
        .eq('document_id', documentId)
        .eq('id', versionId);

      toast({
        title: "Version Restored",
        description: "The version has been restored successfully.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to restore the version.",
        variant: "destructive",
      });
      console.error("Error restoring version:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadVersion = useCallback(async (documentId: string, versionId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(`${documentId}/${versionId}`);

      if (error) {
        throw new Error(error.message);
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentId}-${versionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to download the version.",
        variant: "destructive",
      });
      console.error("Error downloading version:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    fetchDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    checkOutDocument,
    checkInDocument,
    getDocumentVersions,
    getDocumentActivities,
    uploadFile,
    deleteFile,
    getDocumentComments,
    createDocumentComment,
    fetchAccess,
    grantAccess,
    revokeAccess,
    restoreVersion,
    downloadVersion
  };
};

export default useDocumentService;
