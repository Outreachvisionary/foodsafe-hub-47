import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const downloadService = {
  async downloadDocument(filePath: string, fileName: string): Promise<void> {
    try {
      // Get download URL
      const { data, error } = await supabase
        .storage
        .from('documents')
        .createSignedUrl(filePath, 60); // 1 minute expiry
        
      if (error) {
        throw error;
      }
      
      if (data?.signedUrl) {
        // Create an anchor element and trigger download
        const a = window.document.createElement('a');
        a.href = data.signedUrl;
        a.download = fileName;
        a.style.display = 'none';
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        
        toast.success('Document download started');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
      throw error;
    }
  },

  async downloadDocumentVersion(versionId: string, fileName: string): Promise<void> {
    try {
      // For now, document versions share the same file path as the main document
      // This would need to be enhanced when implementing proper version storage
      toast.info('Version download feature coming soon');
    } catch (error) {
      console.error('Version download error:', error);
      toast.error('Failed to download document version');
      throw error;
    }
  },

  async getPreviewUrl(filePath: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .storage
        .from('documents')
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
        
      if (error) {
        console.error('Error creating signed URL:', error);
        return null;
      }
      
      return data?.signedUrl || null;
    } catch (error) {
      console.error('Preview URL error:', error);
      return null;
    }
  }
};