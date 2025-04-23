
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
        file_path: document.file_path || ''
      };
      
      const { data, error } = await supabase
        .from('documents')
        .insert(newDoc)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },
  
  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    try {
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
        .select('file_path, file_name')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error(`Error fetching document info for deletion: ${fetchError.message}`);
        throw fetchError;
      }
      
      // If there's a file in storage, delete it
      if (document && document.file_path) {
        try {
          const storagePath = `documents/${id}/${document.file_name}`;
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
      
      // Finally delete the document itself
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        console.error(`Error deleting document from database: ${deleteError.message}`);
        throw deleteError;
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
  }
};

export default documentService;
