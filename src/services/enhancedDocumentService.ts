
import { DocumentAccess } from '@/types/document';
import { supabase } from '@/integrations/supabase/client';

// Fetch document access permissions
export async function fetchDocumentAccess(documentId: string): Promise<DocumentAccess[]> {
  try {
    const { data, error } = await supabase
      .from('document_access')
      .select('*')
      .eq('document_id', documentId);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching document access:', error);
    return [];
  }
}

// Grant access to a document
export async function grantDocumentAccess(
  documentId: string,
  userId: string,
  permissionLevel: string,
  grantedBy: string
): Promise<DocumentAccess> {
  try {
    const newAccess = {
      document_id: documentId,
      user_id: userId,
      permission_level: permissionLevel,
      granted_by: grantedBy,
      granted_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('document_access')
      .insert(newAccess)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error granting document access:', error);
    throw error;
  }
}

// Revoke access to a document
export async function revokeDocumentAccess(accessId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('document_access')
      .delete()
      .eq('id', accessId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error revoking document access:', error);
    throw error;
  }
}
