
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { DocumentComment } from '@/types/database';

export async function getDocumentComments(documentId: string): Promise<DocumentComment[]> {
  const { data, error } = await supabase
    .from('document_comments')
    .select('*')
    .eq('document_id', documentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching document comments:', error);
    throw new Error('Failed to fetch document comments');
  }

  return data || [];
}

export async function createDocumentComment(comment: Partial<DocumentComment>): Promise<DocumentComment> {
  // Ensure all required fields are present
  if (!comment.document_id || !comment.user_id || !comment.user_name || !comment.content) {
    throw new Error('Missing required fields for document comment');
  }

  const newComment = {
    id: uuidv4(),
    created_at: new Date().toISOString(),
    ...comment
  };

  const { data, error } = await supabase
    .from('document_comments')
    .insert(newComment)
    .select()
    .single();

  if (error) {
    console.error('Error creating document comment:', error);
    throw new Error('Failed to create document comment');
  }

  return data;
}

export async function updateDocumentComment(commentId: string, updates: Partial<DocumentComment>): Promise<DocumentComment> {
  // Ensure content is provided for the update
  if (!updates.content) {
    throw new Error('Comment content is required');
  }
  
  const { data, error } = await supabase
    .from('document_comments')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', commentId)
    .select()
    .single();

  if (error) {
    console.error('Error updating document comment:', error);
    throw new Error('Failed to update document comment');
  }

  return data;
}

export async function deleteDocumentComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from('document_comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    console.error('Error deleting document comment:', error);
    throw new Error('Failed to delete document comment');
  }
}

export default {
  getDocumentComments,
  createDocumentComment,
  updateDocumentComment,
  deleteDocumentComment
};
