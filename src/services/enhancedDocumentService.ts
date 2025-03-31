
import { supabase } from '@/integrations/supabase/client';
import { DocumentActivity, DocumentAccess } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';

const enhancedDocumentService = {
  // Storage path helpers
  getStoragePath(documentId: string, fileName: string): string {
    return `documents/${documentId}/${fileName}`;
  },
  
  async getDownloadUrl(filePath: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .storage
        .from('attachments')
        .createSignedUrl(filePath, 60); // 60 seconds expiry
      
      if (error) throw error;
      if (!data?.signedUrl) throw new Error('Failed to generate download URL');
      
      return data.signedUrl;
    } catch (error) {
      console.error('Error generating download URL:', error);
      throw error;
    }
  },
  
  // Document access
  async fetchAccess(documentId: string): Promise<DocumentAccess[]> {
    try {
      const { data, error } = await supabase
        .from('document_access')
        .select('*')
        .eq('document_id', documentId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching access for document ${documentId}:`, error);
      throw error;
    }
  },
  
  async grantAccess(documentId: string, userId: string, permissionLevel: string, grantedBy: string): Promise<DocumentAccess> {
    try {
      const newAccess = {
        id: uuidv4(),
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
      console.error(`Error granting access to document ${documentId}:`, error);
      throw error;
    }
  },
  
  async revokeAccess(accessId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('document_access')
        .delete()
        .eq('id', accessId);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error revoking access ${accessId}:`, error);
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
  
  async fetchDocumentVersions(documentId: string) {
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
  }
};

export default enhancedDocumentService;
