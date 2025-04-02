
import { DocumentControlIntegration } from '@/types/training';
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for handling document control integration with training
 */
const documentTrainingService = {
  /**
   * Handles document updates by creating training assignments if needed
   */
  handleDocumentUpdate: async (documentInfo: DocumentControlIntegration): Promise<boolean> => {
    try {
      // Skip if training isn't required for this document change
      if (!documentInfo.trainingRequired) {
        return true;
      }
      
      // Get affected roles
      const affectedRoles = documentInfo.affectedRoles || [];
      
      if (affectedRoles.length === 0) {
        console.warn('Document requires training but no affected roles specified');
        return false;
      }
      
      // Calculate due date based on deadline days
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (documentInfo.trainingDeadlineDays || 14));
      
      // Create a training session for this document
      const { data: session, error: sessionError } = await supabase
        .from('training_sessions')
        .insert({
          title: `Training: ${documentInfo.documentTitle} - v${documentInfo.versionNumber}`,
          description: `Training on ${documentInfo.changeType} document`,
          training_type: 'Document',
          training_category: 'Document Update',
          required_roles: affectedRoles,
          due_date: dueDate.toISOString(),
          is_recurring: false,
          created_by: 'system',
          materials_id: [documentInfo.documentId]
        })
        .select()
        .single();
        
      if (sessionError) {
        console.error('Error creating document training session:', sessionError);
        return false;
      }
      
      // Ideally, we would fetch users with the affected roles and create training records
      // For now, we'll just return success
      return true;
    } catch (error) {
      console.error('Error handling document update:', error);
      return false;
    }
  },
  
  /**
   * Get notifications about training needed based on document updates
   */
  getDocumentTrainingNotifications: async (): Promise<DocumentControlIntegration[]> => {
    try {
      // In a real implementation, this would query a join between documents and training
      // For now, return an empty array
      return [];
    } catch (error) {
      console.error('Error getting document training notifications:', error);
      return [];
    }
  }
};

export default documentTrainingService;
