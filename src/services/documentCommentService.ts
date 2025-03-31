
import { supabase } from '@/integrations/supabase/client';
import { DocumentComment } from '@/types/document-comment';
import { v4 as uuidv4 } from 'uuid';

const documentCommentService = {
  // Document comments
  async getDocumentComments(documentId: string): Promise<DocumentComment[]> {
    try {
      const { data, error } = await supabase
        .from('document_comments')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [] as DocumentComment[];
    } catch (error) {
      console.error(`Error fetching comments for document ${documentId}:`, error);
      throw error;
    }
  },
  
  async createDocumentComment(comment: Partial<DocumentComment>): Promise<DocumentComment> {
    try {
      const newComment = {
        id: comment.id || uuidv4(),
        document_id: comment.document_id,
        user_id: comment.user_id,
        user_name: comment.user_name,
        content: comment.content,
        created_at: comment.created_at || new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('document_comments')
        .insert(newComment)
        .select()
        .single();
      
      if (error) throw error;
      return data as DocumentComment;
    } catch (error) {
      console.error('Error creating document comment:', error);
      throw error;
    }
  },
  
  async updateDocumentComment(commentId: string, updates: Partial<DocumentComment>): Promise<DocumentComment> {
    try {
      const { data, error } = await supabase
        .from('document_comments')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId)
        .select()
        .single();
      
      if (error) throw error;
      return data as DocumentComment;
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

export default documentCommentService;
