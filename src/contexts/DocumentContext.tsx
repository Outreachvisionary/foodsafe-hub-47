
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentFolder, DocumentStats } from '@/types/document';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface DocumentContextType {
  documents: Document[];
  folders: DocumentFolder[];
  loading: boolean;
  error: string | null;
  stats: DocumentStats | null;
  
  // Document operations
  createDocument: (data: Partial<Document>) => Promise<Document>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<Document>;
  deleteDocument: (id: string) => Promise<void>;
  checkoutDocument: (id: string) => Promise<void>;
  checkinDocument: (id: string, versionData?: any) => Promise<void>;
  approveDocument: (id: string, comments?: string) => Promise<Document>;
  rejectDocument: (id: string, reason: string) => Promise<Document>;
  
  // Folder operations
  createFolder: (data: Partial<DocumentFolder>) => Promise<DocumentFolder>;
  updateFolder: (id: string, updates: Partial<DocumentFolder>) => Promise<DocumentFolder>;
  deleteFolder: (id: string) => Promise<void>;
  
  // Utility functions
  refresh: () => Promise<void>;
  refreshDocuments: () => Promise<void>;
  searchDocuments: (query: string) => Document[];
  getDocumentsByFolder: (folderId: string) => Document[];
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};

interface DocumentProviderProps {
  children: ReactNode;
}

// Helper function to convert status for database operations
const convertStatusForDatabase = (status: string): "Draft" | "Pending Approval" | "Approved" | "Published" | "Archived" | "Expired" => {
  switch (status) {
    case 'Pending_Review':
      return 'Pending Approval'; // Map to available database status
    case 'Pending_Approval':
      return 'Pending Approval';
    case 'Rejected':
      return 'Draft'; // Map rejected to draft since it's not in database
    case 'Approved':
      return 'Approved';
    case 'Published':
      return 'Published';
    case 'Archived':
      return 'Archived';
    case 'Expired':
      return 'Expired';
    default:
      return 'Draft';
  }
};

// Helper function to convert checkout status for database
const convertCheckoutStatusForDatabase = (status: string): "Available" | "Checked_Out" => {
  switch (status) {
    case 'Checked_Out':
      return 'Checked_Out';
    default:
      return 'Available';
  }
};

// Helper function to convert category for database
const convertCategoryForDatabase = (category: string): "SOP" | "Policy" | "Form" | "Certificate" | "Audit Report" | "HACCP Plan" | "Training Material" | "Supplier Documentation" | "Risk Assessment" | "Other" => {
  switch (category) {
    case 'SOP':
      return 'SOP';
    case 'Policy':
      return 'Policy';
    case 'Form':
      return 'Form';
    case 'Certificate':
      return 'Certificate';
    case 'Audit_Report':
    case 'Audit Report':
      return 'Audit Report';
    case 'HACCP_Plan':
    case 'HACCP Plan':
      return 'HACCP Plan';
    case 'Training_Material':
    case 'Training Material':
      return 'Training Material';
    case 'Supplier_Documentation':
    case 'Supplier Documentation':
      return 'Supplier Documentation';
    case 'Risk_Assessment':
    case 'Risk Assessment':
      return 'Risk Assessment';
    default:
      return 'Other';
  }
};

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  console.log('DocumentProvider render with user:', !!user);

  // Fetch documents
  const { 
    data: documents = [], 
    isLoading: documentsLoading, 
    error: documentsError,
    refetch: refetchDocuments 
  } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      console.log('Fetching documents...');
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching documents:', error);
          throw new Error(error.message);
        }
        
        console.log('Documents fetched successfully:', data?.length || 0);
        return data as Document[] || [];
      } catch (err) {
        console.error('Document fetch error:', err);
        throw err;
      }
    },
    enabled: !!user,
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Fetch folders
  const { 
    data: folders = [], 
    isLoading: foldersLoading,
    error: foldersError,
    refetch: refetchFolders 
  } = useQuery({
    queryKey: ['document-folders'],
    queryFn: async () => {
      console.log('Fetching folders...');
      try {
        const { data, error } = await supabase
          .from('document_folders')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching folders:', error);
          throw new Error(error.message);
        }
        
        console.log('Folders fetched successfully:', data?.length || 0);
        return data as DocumentFolder[] || [];
      } catch (err) {
        console.error('Folder fetch error:', err);
        throw err;
      }
    },
    enabled: !!user,
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000,
  });

  // Calculate stats
  const stats: DocumentStats | null = documents.length > 0 ? {
    total: documents.length,
    byStatus: documents.reduce((acc, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byCategory: documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    expiringCount: documents.filter(doc => 
      doc.expiry_date && new Date(doc.expiry_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    ).length,
    pendingReviewCount: documents.filter(doc => doc.status === 'Pending_Review').length,
    pendingApprovalCount: documents.filter(doc => doc.status === 'Pending_Approval').length,
  } : null;

  // Only consider loading if both queries are loading and we don't have data yet
  const loading = (documentsLoading && documents.length === 0) || (foldersLoading && folders.length === 0);

  // Document mutations
  const createDocumentMutation = useMutation({
    mutationFn: async (data: Partial<Document>) => {
      if (!user) throw new Error('User not authenticated');
      
      const documentData = {
        title: data.title || '',
        file_name: data.file_name || '',
        file_type: data.file_type || '',
        file_size: data.file_size || 0,
        category: convertCategoryForDatabase(data.category || 'Other'),
        status: convertStatusForDatabase(data.status || 'Draft'),
        checkout_status: convertCheckoutStatusForDatabase(data.checkout_status || 'Available'),
        version: data.version || 1,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        description: data.description,
        file_path: data.file_path,
        folder_id: data.folder_id,
        tags: data.tags,
        approvers: data.approvers,
        expiry_date: data.expiry_date,
        workflow_status: data.workflow_status || 'draft',
      };

      const { data: result, error } = await supabase
        .from('documents')
        .insert(documentData)
        .select()
        .single();

      if (error) throw error;
      return result as Document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document created successfully');
    },
    onError: (error) => {
      console.error('Error creating document:', error);
      toast.error('Failed to create document');
    },
  });

  const updateDocumentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Document> }) => {
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // Convert status if it exists in the updates
      if (updates.status) {
        updateData.status = convertStatusForDatabase(updates.status);
      }

      // Convert checkout_status if it exists in the updates
      if (updates.checkout_status) {
        updateData.checkout_status = convertCheckoutStatusForDatabase(updates.checkout_status);
      }

      // Convert category if it exists in the updates
      if (updates.category) {
        updateData.category = convertCategoryForDatabase(updates.category);
      }

      const { data, error } = await supabase
        .from('documents')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document updated successfully');
    },
    onError: (error) => {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    },
  });

  // Folder mutations
  const createFolderMutation = useMutation({
    mutationFn: async (data: Partial<DocumentFolder>) => {
      if (!user) throw new Error('User not authenticated');
      
      const folderData = {
        name: data.name || '',
        path: data.path || '',
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        parent_id: data.parent_id,
        organization_id: data.organization_id,
        is_system_folder: data.is_system_folder || false,
      };

      const { data: result, error } = await supabase
        .from('document_folders')
        .insert(folderData)
        .select()
        .single();

      if (error) throw error;
      return result as DocumentFolder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-folders'] });
      toast.success('Folder created successfully');
    },
    onError: (error) => {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    },
  });

  const updateFolderMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<DocumentFolder> }) => {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('document_folders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as DocumentFolder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-folders'] });
      toast.success('Folder updated successfully');
    },
    onError: (error) => {
      console.error('Error updating folder:', error);
      toast.error('Failed to update folder');
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('document_folders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-folders'] });
      toast.success('Folder deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
    },
  });

  // Approval functions
  const approveDocumentMutation = useMutation({
    mutationFn: async ({ id, comments }: { id: string; comments?: string }) => {
      const updates = {
        status: 'Approved' as const,
        workflow_status: 'approved',
        pending_since: null
      };

      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document approved successfully');
    },
    onError: (error) => {
      console.error('Error approving document:', error);
      toast.error('Failed to approve document');
    },
  });

  const rejectDocumentMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const updates = {
        status: 'Draft' as const, // Map rejection to Draft since Rejected is not in database
        workflow_status: 'rejected',
        rejection_reason: reason,
        pending_since: null
      };

      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document rejected');
    },
    onError: (error) => {
      console.error('Error rejecting document:', error);
      toast.error('Failed to reject document');
    },
  });

  // Handle errors
  useEffect(() => {
    if (documentsError || foldersError) {
      const errorMessage = documentsError?.message || foldersError?.message || 'Unknown error';
      console.error('Setting error state:', errorMessage);
      setError(errorMessage);
    } else {
      setError(null);
    }
  }, [documentsError, foldersError]);

  const value: DocumentContextType = {
    documents: documents || [],
    folders: folders || [],
    loading,
    error,
    stats,
    
    createDocument: createDocumentMutation.mutateAsync,
    updateDocument: (id: string, updates: Partial<Document>) => 
      updateDocumentMutation.mutateAsync({ id, updates }),
    deleteDocument: deleteDocumentMutation.mutateAsync,
    
    checkoutDocument: async (id: string) => {
      if (!user) throw new Error('User not authenticated');
      
      await updateDocumentMutation.mutateAsync({
        id,
        updates: {
          checkout_status: 'Checked_Out',
          checkout_user_id: user.id,
          checkout_user_name: user.email || '',
          checkout_timestamp: new Date().toISOString(),
          is_locked: true
        }
      });
    },
    
    checkinDocument: async (id: string, versionData?: any) => {
      await updateDocumentMutation.mutateAsync({
        id,
        updates: {
          checkout_status: 'Available',
          checkout_user_id: undefined,
          checkout_user_name: undefined,
          checkout_timestamp: undefined,
          is_locked: false
        }
      });
    },
    
    approveDocument: (id: string, comments?: string) => 
      approveDocumentMutation.mutateAsync({ id, comments }),
    rejectDocument: (id: string, reason: string) => 
      rejectDocumentMutation.mutateAsync({ id, reason }),
    
    createFolder: createFolderMutation.mutateAsync,
    updateFolder: (id: string, updates: Partial<DocumentFolder>) => 
      updateFolderMutation.mutateAsync({ id, updates }),
    deleteFolder: deleteFolderMutation.mutateAsync,
    
    refresh: async () => {
      console.log('Refreshing documents and folders...');
      await Promise.all([
        refetchDocuments(),
        refetchFolders()
      ]);
    },
    refreshDocuments: async () => {
      console.log('Refreshing documents...');
      await refetchDocuments();
    },
    searchDocuments: (query: string) => {
      return documents.filter(doc =>
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.description?.toLowerCase().includes(query.toLowerCase())
      );
    },
    getDocumentsByFolder: (folderId: string) => {
      return documents.filter(doc => doc.folder_id === folderId);
    },
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};
