
import { supabase } from '@/integrations/supabase/client';

// Get document comments
export async function getDocumentComments(documentId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('document_comments')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching document comments:', error);
    return [];
  }
}

// Create a document comment
export async function createDocumentComment(comment: any): Promise<any> {
  try {
    const newComment = {
      document_id: comment.documentId,
      user_id: comment.userId,
      user_name: comment.userName,
      content: comment.content,
      created_at: new Date().toISOString()
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
}
