import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentVersion, DocumentActivity } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';

interface DocumentServiceError extends Error {
  status?: number;
  detail?: string;
}

const documentService = {
  // Document CRUD
  async fetchDocuments(): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },
  
  async fetchDocument(id: string): Promise<Document> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error(`Document with ID ${id} not found`);
      
      return data;
    } catch (error) {
      console.error(`Error fetching document ${id}:`, error);
      throw error;
    }
  },
  
  async createDocument(document: Partial<Document>): Promise<Document> {
    try {
      const newDoc = {
        id: document.id || uuidv4(),
        title: document.title || '',
        description: document.description,
        file_name: document.file_name || '',
        file_size: document.file_size || 0,
        file_type: document.file_type || '',
        category: document.category || 'Other',
        status: document.status || 'Draft',
        version: document.version || 1,
        created_by: document.created_by || 'system',
        created_at: document.created_at || new Date().toISOString(),
        updated_at: document.updated_at || new Date().toISOString(),
        expiry_date: document.expiry_date,
        is_locked: document.is_locked || false,
        tags: document.tags || [],
        file_path: document.file_path || '',
        folder_id: document.folder_id || null
      };
      
      const { data, error } = await supabase
        .from('documents')
        .insert(newDoc)
        .select()
        .single();
      
      if (error) throw error;
      
      // If document has a folder, update the folder document count
      if (newDoc.folder_id) {
        await updateFolderDocumentCount(newDoc.folder_id);
      }
      
      return data;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },
  
  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    try {
      // Get the current document to check for folder change
      const { data: currentDoc } = await supabase
        .from('documents')
        .select('folder_id')
        .eq('id', id)
        .single();
      
      const oldFolderId = currentDoc?.folder_id;
      const newFolderId = updates.folder_id;
      
      // Update the document
      const { data, error } = await supabase
        .from('documents')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update folder document counts if folder has changed
      if (oldFolderId !== newFolderId) {
        if (oldFolderId) {
          await updateFolderDocumentCount(oldFolderId);
        }
        if (newFolderId) {
          await updateFolderDocumentCount(newFolderId);
        }
      }
      
      return data;
    } catch (error) {
      console.error(`Error updating document ${id}:`, error);
      throw error;
    }
  },
  
  async deleteDocument(id: string): Promise<void> {
    try {
      console.log(`Attempting to delete document with ID: ${id}`);
      
      // First get the document to find if there's an associated file in storage
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('file_path, file_name, folder_id')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error(`Error fetching document info for deletion: ${fetchError.message}`);
        throw fetchError;
      }
      
      const folderId = document?.folder_id;
      
      // If there's a file in storage, delete it
      if (document && document.file_path) {
        try {
          // Extract path from the file_path URL or use direct path
          let storagePath;
          if (document.file_path.includes('storage/v1/object/public/attachments/')) {
            // Extract path from URL
            const parts = document.file_path.split('attachments/');
            if (parts.length > 1) {
              storagePath = parts[1].split('?')[0];
            } else {
              storagePath = `documents/${id}/${document.file_name}`;
            }
          } else {
            storagePath = `documents/${id}/${document.file_name}`;
          }
          
          console.log(`Attempting to delete file at storage path: ${storagePath}`);
          
          const { error: deleteStorageError } = await supabase
            .storage
            .from('attachments')
            .remove([storagePath]);
          
          if (deleteStorageError) {
            console.warn(`Could not delete file from storage: ${deleteStorageError.message}`);
            // Continue with document deletion even if file deletion fails
          } else {
            console.log(`Successfully deleted file from storage: ${storagePath}`);
          }
        } catch (storageError) {
          console.warn('Error while attempting to delete file from storage:', storageError);
          // Continue with document deletion
        }
      }
      
      // Delete document's activities
      try {
        const { error: activitiesError } = await supabase
          .from('document_activities')
          .delete()
          .eq('document_id', id);
        
        if (activitiesError) {
          console.warn(`Could not delete document activities: ${activitiesError.message}`);
        }
      } catch (activitiesError) {
        console.warn('Error deleting document activities:', activitiesError);
      }
      
      // Delete document's versions
      try {
        const { error: versionsError } = await supabase
          .from('document_versions')
          .delete()
          .eq('document_id', id);
        
        if (versionsError) {
          console.warn(`Could not delete document versions: ${versionsError.message}`);
        }
      } catch (versionsError) {
        console.warn('Error deleting document versions:', versionsError);
      }
      
      // Delete document's comments
      try {
        const { error: commentsError } = await supabase
          .from('document_comments')
          .delete()
          .eq('document_id', id);
        
        if (commentsError) {
          console.warn(`Could not delete document comments: ${commentsError.message}`);
        }
      } catch (commentsError) {
        console.warn('Error deleting document comments:', commentsError);
      }
      
      // Finally delete the document itself
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        console.error(`Error deleting document from database: ${deleteError.message}`);
        throw deleteError;
      }
      
      // Update folder document count if needed
      if (folderId) {
        await updateFolderDocumentCount(folderId);
      }
      
      console.log(`Successfully deleted document with ID: ${id}`);
    } catch (error: any) {
      console.error(`Error deleting document ${id}:`, error);
      throw new Error(`Failed to delete document: ${error.message || "Unknown error"}`);
    }
  },
  
  // Document versions
  async createDocumentVersion(version: Partial<DocumentVersion>): Promise<DocumentVersion> {
    try {
      const newVersion = {
        id: version.id || uuidv4(),
        document_id: version.document_id || '',
        file_name: version.file_name || '',
        file_size: version.file_size || 0,
        file_type: version.file_type || '',
        version: version.version || 1,
        created_by: version.created_by || 'system',
        created_at: version.created_at || new Date().toISOString(),
        change_notes: version.change_notes,
        editor_metadata: version.editor_metadata
      };
      
      const { data, error } = await supabase
        .from('document_versions')
        .insert(newVersion)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating document version:', error);
      throw error;
    }
  },
  
  async fetchDocumentVersions(documentId: string): Promise<DocumentVersion[]> {
    try {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('version', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching versions for document ${documentId}:`, error);
      throw error;
    }
  },
  
  // Document activities
  async createDocumentActivity(activity: Partial<DocumentActivity>): Promise<DocumentActivity> {
    try {
      const newActivity = {
        id: activity.id || uuidv4(),
        document_id: activity.document_id || '',
        action: activity.action || 'view',
        user_id: activity.user_id || 'system',
        user_name: activity.user_name || 'System',
        user_role: activity.user_role || 'System',
        timestamp: activity.timestamp || new Date().toISOString(),
        comments: activity.comments
      };
      
      const { data, error } = await supabase
        .from('document_activities')
        .insert(newActivity)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating document activity:', error);
      throw error;
    }
  },
  
  async fetchDocumentActivities(documentId: string): Promise<DocumentActivity[]> {
    try {
      const { data, error } = await supabase
        .from('document_activities')
        .select('*')
        .eq('document_id', documentId)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching activities for document ${documentId}:`, error);
      throw error;
    }
  },
  
  // Folder operations
  async createFolder(name: string, parentId?: string): Promise<any> {
    try {
      const path = parentId ? `/${parentId}/${name}` : `/${name}`;
      
      const newFolder = {
        id: uuidv4(),
        name,
        path,
        parent_id: parentId || null,
        created_by: 'system',
        document_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('folders')
        .insert(newFolder)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  },
  
  async fetchFolders(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching folders:', error);
      throw error;
    }
  },
  
  async deleteFolder(id: string): Promise<void> {
    try {
      // First, get all documents in this folder
      const { data: documents } = await supabase
        .from('documents')
        .select('id')
        .eq('folder_id', id);
      
      // Delete all documents in the folder
      if (documents && documents.length > 0) {
        for (const doc of documents) {
          await this.deleteDocument(doc.id);
        }
      }
      
      // Then delete the folder
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting folder ${id}:`, error);
      throw error;
    }
  },
  
  // Upload functions
  async uploadDocumentFile(file: File, documentId: string): Promise<string> {
    try {
      const filePath = `documents/${documentId}/${file.name}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('attachments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },
  
  // Document checkout
  async checkoutDocument(documentId: string): Promise<Document> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('documents')
      .update({
        checkout_status: 'Checked_Out',
        checkout_user_id: user.id,
        checkout_user_name: user.email,
        checkout_timestamp: new Date().toISOString()
      })
      .eq('id', documentId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to checkout document');

    await this.createDocumentActivity({
      document_id: documentId,
      action: 'checkout',
      user_id: user.id,
      user_name: user.email || 'Unknown user',
      user_role: 'User',
      checkout_action: 'checkout'
    });

    return data;
  },

  // Document checkin
  async checkinDocument(documentId: string, comment: string): Promise<Document> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Start a transaction
    const { data, error } = await supabase.rpc('checkin_document', {
      p_document_id: documentId,
      p_user_id: user.id,
      p_user_name: user.email,
      p_comment: comment
    });

    if (error) throw error;
    if (!data) throw new Error('Failed to checkin document');

    return data;
  }
};

// Helper function to update folder document count
async function updateFolderDocumentCount(folderId: string): Promise<void> {
  try {
    // Count documents in this folder
    const { count, error: countError } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('folder_id', folderId);
    
    if (countError) throw countError;
    
    // Update folder with new count
    const { error: updateError } = await supabase
      .from('folders')
      .update({ 
        document_count: count || 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', folderId);
    
    if (updateError) throw updateError;
  } catch (error) {
    console.error(`Error updating document count for folder ${folderId}:`, error);
    // Don't throw error here to avoid breaking the main operations
  }
}

export default documentService;
