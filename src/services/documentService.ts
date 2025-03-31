
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentVersion, DocumentActivity } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';

interface DocumentServiceError extends Error {
  status?: number;
  detail?: string;
}

interface DocumentComment {
  id: string;
  document_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  updated_at?: string;
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
        ...document,
        created_at: document.created_at || new Date().toISOString(),
        updated_at: document.updated_at || new Date().toISOString()
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
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting document ${id}:`, error);
      throw error;
    }
  },
  
  // Document versions
  async createDocumentVersion(version: Partial<DocumentVersion>): Promise<DocumentVersion> {
    try {
      const newVersion = {
        id: version.id || uuidv4(),
        ...version,
        created_at: version.created_at || new Date().toISOString()
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
        ...activity,
        timestamp: activity.timestamp || new Date().toISOString()
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
  
  // Document comments
  async getDocumentComments(documentId: string): Promise<DocumentComment[]> {
    try {
      const { data, error } = await supabase
        .from('document_comments')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching comments for document ${documentId}:`, error);
      throw error;
    }
  },
  
  async createDocumentComment(comment: Partial<DocumentComment>): Promise<DocumentComment> {
    try {
      const newComment = {
        id: comment.id || uuidv4(),
        ...comment,
        created_at: comment.created_at || new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('document_comments')
        .insert(newComment)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating document comment:', error);
      throw error;
    }
  },
  
  async updateDocumentComment(commentId: string, updates: Partial<DocumentComment>): Promise<DocumentComment> {
    try {
      const { data, error } = await supabase
        .from('document_comments')
        .update(updates)
        .eq('id', commentId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating comment ${commentId}:`, error);
      throw error;
    }
  },
  
  async deleteDocumentComment(commentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('document_comments')
        .delete()
        .eq('id', commentId);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error);
      throw error;
    }
  }
};

export default documentService;
