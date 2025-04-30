
import { supabase } from '@/integrations/supabase/client';
import { DocumentComment } from '@/types/document';

// Get comments for a document
export async function getDocumentComments(documentId: string): Promise<DocumentComment[]> {
  try {
    const { data, error } = await supabase
      .from('document_comments')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    return data as DocumentComment[];
  } catch (error) {
    console.error('Error fetching document comments:', error);
    throw error;
  }
}

// Create a comment for a document
export async function createDocumentComment(
  documentId: string,
  userId: string,
  userName: string,
  content: string
): Promise<DocumentComment> {
  try {
    const { data, error } = await supabase
      .from('document_comments')
      .insert({
        document_id: documentId,
        user_id: userId,
        user_name: userName,
        content
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Record comment activity
    await supabase
      .from('document_activities')
      .insert({
        document_id: documentId,
        user_id: userId,
        user_name: userName,
        user_role: 'Commenter',
        action: 'comment',
        comments: content.substring(0, 100) + (content.length > 100 ? '...' : '') // Include a preview
      });
    
    return data as DocumentComment;
  } catch (error) {
    console.error('Error creating document comment:', error);
    throw error;
  }
}

// Update a document comment
export async function updateDocumentComment(
  commentId: string,
  content: string
): Promise<DocumentComment> {
  try {
    const { data, error } = await supabase
      .from('document_comments')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as DocumentComment;
  } catch (error) {
    console.error('Error updating document comment:', error);
    throw error;
  }
}

// Delete a document comment
export async function deleteDocumentComment(commentId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('document_comments')
      .delete()
      .eq('id', commentId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting document comment:', error);
    throw error;
  }
}

// Get comment count for a document
export async function getCommentCount(documentId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('document_comments')
      .select('*', { count: 'exact', head: true })
      .eq('document_id', documentId);
      
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error('Error getting comment count:', error);
    return 0; // Return 0 in case of error
  }
}
