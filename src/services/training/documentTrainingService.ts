
import { supabase } from '@/integrations/supabase/client';
import { DocumentControlIntegration } from '@/types/training';

/**
 * Service for document-related training
 */
const documentTrainingService = {
  /**
   * Handle document updates by creating related training records
   * @param documentId The ID of the updated document
   * @param versionId The ID of the new document version
   * @returns Boolean indicating success
   */
  handleDocumentUpdate: async (documentId: string, versionId: string): Promise<boolean> => {
    try {
      // Get document details
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();
        
      if (docError) {
        console.error('Error fetching document:', docError);
        return false;
      }
      
      if (!document) {
        console.error('Document not found');
        return false;
      }
      
      // Get training automation config to check if document triggers are enabled
      const { data: configData, error: configError } = await supabase
        .from('training_automation_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (configError) {
        console.error('Error fetching training config:', configError);
        return false;
      }
      
      const config = configData?.[0];
      if (!config || !config.enabled || !config.document_changes_trigger) {
        console.log('Document change training triggers are disabled');
        return false;
      }
      
      // Find training sessions related to this document
      const { data: relatedSessions, error: relError } = await supabase
        .from('module_relationships')
        .select('target_id')
        .eq('source_id', documentId)
        .eq('source_type', 'document')
        .eq('target_type', 'training_session');
        
      if (relError) {
        console.error('Error fetching related sessions:', relError);
        return false;
      }
      
      if (!relatedSessions || relatedSessions.length === 0) {
        console.log('No related training sessions found for document');
        return false;
      }
      
      // Get the session IDs
      const sessionIds = relatedSessions.map(rel => rel.target_id);
      
      // Find employees who should be notified of the document update
      const { data: sessions, error: sessionsError } = await supabase
        .from('training_sessions')
        .select('id, title, assigned_to')
        .in('id', sessionIds);
        
      if (sessionsError) {
        console.error('Error fetching training sessions:', sessionsError);
        return false;
      }
      
      let successCount = 0;
      
      // For each session, create training records for the assigned employees
      for (const session of sessions || []) {
        if (!session.assigned_to || session.assigned_to.length === 0) {
          continue;
        }
        
        // Get employee details
        const { data: employees, error: employeesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', session.assigned_to);
          
        if (employeesError) {
          console.error('Error fetching employees:', employeesError);
          continue;
        }
        
        // Create due date (30 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        
        // Create training records for each employee
        for (const employee of employees || []) {
          // Check if the employee already has an active training record for this session
          const { data: existingRecords, error: checkError } = await supabase
            .from('training_records')
            .select('id')
            .eq('employee_id', employee.id)
            .eq('session_id', session.id)
            .in('status', ['Not Started', 'In Progress'])
            .limit(1);
            
          if (checkError) {
            console.error('Error checking existing records:', checkError);
            continue;
          }
          
          // Skip if employee already has an active record
          if (existingRecords && existingRecords.length > 0) {
            continue;
          }
          
          // Create new training record
          const { error: insertError } = await supabase
            .from('training_records')
            .insert({
              employee_id: employee.id,
              employee_name: employee.full_name,
              session_id: session.id,
              status: 'Not Started' as const,
              assigned_date: new Date().toISOString(),
              due_date: dueDate.toISOString(),
              notes: `Document update training required. Document "${document.title}" was updated to version ${document.version}.`
            });
            
          if (insertError) {
            console.error('Error creating training record:', insertError);
            continue;
          }
          
          successCount++;
        }
      }
      
      console.log(`Created ${successCount} training records for document update`);
      return successCount > 0;
    } catch (error) {
      console.error('Error handling document update:', error);
      return false;
    }
  },
  
  /**
   * Get notifications for document training assignments
   * @returns Array of notification objects
   */
  getDocumentTrainingNotifications: async (): Promise<DocumentControlIntegration[]> => {
    try {
      // Get recently updated documents that have associated training
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: relationships, error: relError } = await supabase
        .from('module_relationships')
        .select('source_id, target_id')
        .eq('source_type', 'document')
        .eq('target_type', 'training_session');
        
      if (relError) {
        console.error('Error fetching document relationships:', relError);
        return [];
      }
      
      if (!relationships || relationships.length === 0) {
        return [];
      }
      
      // Get unique document IDs
      const documentIds = [...new Set(relationships.map(rel => rel.source_id))];
      
      // Get document details
      const { data: documents, error: docError } = await supabase
        .from('documents')
        .select('id, title, updated_at, version')
        .in('id', documentIds)
        .gt('updated_at', thirtyDaysAgo.toISOString())
        .order('updated_at', { ascending: false });
        
      if (docError) {
        console.error('Error fetching documents:', docError);
        return [];
      }
      
      if (!documents || documents.length === 0) {
        return [];
      }
      
      // Map documents to notification objects
      const notifications: DocumentControlIntegration[] = documents.map(doc => {
        const relatedSessionIds = relationships
          .filter(rel => rel.source_id === doc.id)
          .map(rel => rel.target_id);
          
        return {
          documentId: doc.id,
          documentTitle: doc.title,
          versionNumber: doc.version,
          changeType: 'Updated', // Default to Updated for existing docs
          trainingRequired: true,
          updatedAt: doc.updated_at,
          version: doc.version.toString(),
          relatedSessionIds
        };
      });
      
      return notifications;
    } catch (error) {
      console.error('Error getting document training notifications:', error);
      return [];
    }
  }
};

export default documentTrainingService;
