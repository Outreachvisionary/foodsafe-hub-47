
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Document, CheckoutStatus, DocumentStatus, DocumentAccess } from '@/types/document';
import { convertToDocumentStatus, convertToCheckoutStatus } from '@/utils/typeAdapters';

// Functions to adapt between app format and database format
const adaptDocumentToDatabase = (document: Partial<Document>) => {
  // Convert to database format
  return {
    ...document,
    // Ensure we use the database expected formats
    status: document.status?.toString().replace(/_/g, ' '),
    checkout_status: document.checkout_status?.toString().replace(/_/g, ' ')
  };
};

const adaptDatabaseToDocument = (dbDocument: any): Document => {
  // Convert database format to app format
  return {
    ...dbDocument,
    status: convertToDocumentStatus(dbDocument.status),
    checkout_status: dbDocument.checkout_status ? 
      convertToCheckoutStatus(dbDocument.checkout_status) : 'Available'
  } as Document;
};

const useDocumentService = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Helper to get storage path
  const getStoragePath = (documentId: string, fileName: string) => {
    return `${documentId}/${fileName}`;
  };

  // Helper to get download URL
  const getDownloadUrl = async (path: string) => {
    const { data } = supabase.storage.from('documents').getPublicUrl(path);
    return data.publicUrl;
  };

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
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          query = query.eq('created_by', data.user.id);
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

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // Convert database documents to application format
      const adaptedDocuments = data.map((dbDocument: any) => 
        adaptDatabaseToDocument(dbDocument)
      );

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
      const { data, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // Convert to application format
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
      // Convert to database format
      const dbDocument = adaptDocumentToDatabase(newDocument);
      
      const { data, error: createError } = await supabase
        .from('documents')
        .insert(dbDocument)
        .select()
        .single();

      if (createError) {
        throw new Error(createError.message);
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
      // Convert to database format
      const dbDocument = adaptDocumentToDatabase(updates);
      
      const { data, error: updateError } = await supabase
        .from('documents')
        .update(dbDocument)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw new Error(updateError.message);
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
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw new Error(deleteError.message);
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

      const checkoutStatus = convertToCheckoutStatus(dbDocument.checkout_status);
      
      if (checkoutStatus === 'Checked_Out') {
        throw new Error('Document is already checked out');
      }

      // Proceed with the checkout
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          checkout_status: 'Checked Out',
          checkout_user_id: userId,
          checkout_user_name: userName,
          checkout_timestamp: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        throw new Error(updateError.message);
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

      const checkoutStatus = convertToCheckoutStatus(dbDocument.checkout_status);
      
      if (checkoutStatus === 'Checked_Out' && dbDocument.checkout_user_id !== userId) {
        throw new Error('Document is checked out by another user');
      }

      const { error: updateError } = await supabase
        .from('documents')
        .update({
          checkout_status: 'Available',
          checkout_user_id: null,
          checkout_timestamp: null,
        })
        .eq('id', id);

      if (updateError) {
        throw new Error(updateError.message);
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
      const { data, error: fetchError } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId);

      if (fetchError) {
        throw new Error(fetchError.message);
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
      const { data, error: fetchError } = await supabase
        .from('document_activities')
        .select('*')
        .eq('document_id', documentId)
        .order('timestamp', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
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
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get the public URL
      const { data } = supabase.storage.from('documents').getPublicUrl(path);
      return data.publicUrl;
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
      const { error: deleteError } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (deleteError) {
        throw new Error(deleteError.message);
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
      const { data, error: fetchError } = await supabase
        .from('document_comments')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
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

  const createDocumentComment = useCallback(async (commentData: {
    document_id: string;
    content: string;
    user_id: string;
    user_name: string;
  }): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: createError } = await supabase
        .from('document_comments')
        .insert({
          document_id: commentData.document_id,
          content: commentData.content,
          user_id: commentData.user_id,
          user_name: commentData.user_name
        })
        .select()
        .single();

      if (createError) {
        throw new Error(createError.message);
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error(`Error creating comment for document ID ${commentData.document_id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAccess = useCallback(async (documentId: string): Promise<DocumentAccess[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('document_access')
        .select('*')
        .eq('document_id', documentId);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      return (data || []) as DocumentAccess[];
    } catch (err: any) {
      setError(err.message);
      console.error(`Error fetching access for document ID ${documentId}:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const grantAccess = useCallback(async (
    documentId: string, 
    userId: string,
    permissionLevel: string, 
    grantedBy: string
  ): Promise<DocumentAccess> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: createError } = await supabase
        .from('document_access')
        .insert({
          document_id: documentId,
          user_id: userId,
          permission_level: permissionLevel,
          granted_by: grantedBy,
        })
        .select()
        .single();

      if (createError) {
        throw new Error(createError.message);
      }

      return data as DocumentAccess;
    } catch (err: any) {
      setError(err.message);
      console.error(`Error granting access for document ID ${documentId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const revokeAccess = useCallback(async (accessId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('document_access')
        .delete()
        .eq('id', accessId);

      if (deleteError) {
        throw new Error(deleteError.message);
      }
    } catch (err: any) {
      setError(err.message);
      console.error(`Error revoking access with ID ${accessId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const restoreVersion = useCallback(async (documentId: string, versionId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Implementation depends on your version management logic
      console.log(`Restoring document ${documentId} to version ${versionId}`);
      // This is a placeholder for actual restore implementation
    } catch (err: any) {
      setError(err.message);
      console.error(`Error restoring version for document ID ${documentId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadVersion = useCallback(async (versionId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Implementation depends on your version management and file storage
      console.log(`Downloading version ${versionId}`);
      // This is a placeholder for actual download implementation
    } catch (err: any) {
      setError(err.message);
      console.error(`Error downloading version ${versionId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Additional methods for approval workflow
  const approveDocument = useCallback(async (documentId: string, comment: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('documents')
        .update({ 
          status: 'Approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Record the approval action
      // Get current user info from auth
      const { data } = await supabase.auth.getUser();
      const userId = data?.user?.id || 'unknown';
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', userId)
        .single();

      const userName = profile?.full_name || 'Unknown User';
      const userRole = profile?.role || 'User';

      await recordDocumentActivity(
        documentId,
        'approve',
        userId,
        userName,
        userRole,
        comment
      );

      toast({
        title: "Document Approved",
        description: "The document has been approved successfully.",
      });
      
      // Refresh document list
      await fetchDocuments();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to approve the document.",
        variant: "destructive",
      });
      console.error(`Error approving document ${documentId}:`, err);
    } finally {
      setLoading(false);
    }
  }, [toast, fetchDocuments]);

  const rejectDocument = useCallback(async (documentId: string, reason: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      if (!reason) {
        throw new Error("Rejection reason is required");
      }

      const { error: updateError } = await supabase
        .from('documents')
        .update({ 
          status: 'Rejected',
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Record the rejection action
      // Get current user info from auth
      const { data } = await supabase.auth.getUser();
      const userId = data?.user?.id || 'unknown';
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', userId)
        .single();

      const userName = profile?.full_name || 'Unknown User';
      const userRole = profile?.role || 'User';

      await recordDocumentActivity(
        documentId,
        'reject',
        userId,
        userName,
        userRole,
        reason
      );

      toast({
        title: "Document Rejected",
        description: "The document has been rejected with provided reason.",
      });
      
      // Refresh document list
      await fetchDocuments();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to reject the document.",
        variant: "destructive",
      });
      console.error(`Error rejecting document ${documentId}:`, err);
    } finally {
      setLoading(false);
    }
  }, [toast, fetchDocuments]);

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
    downloadVersion,
    approveDocument,
    rejectDocument,
    getStoragePath,
    getDownloadUrl
  };
};

export default useDocumentService;
