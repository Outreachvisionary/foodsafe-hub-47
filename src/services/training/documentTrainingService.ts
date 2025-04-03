
import { supabase } from '@/integrations/supabase/client';
import {
  Employee,
  TrainingRecord,
  DocumentControlIntegration,
  TrainingStatus
} from '@/types/training';

/**
 * Service for handling document control related training
 */
export const documentTrainingService = {
  /**
   * Process document control updates and assign training if needed
   */
  handleDocumentUpdate: async (
    document: DocumentControlIntegration,
    employees: Employee[]
  ): Promise<TrainingRecord[]> => {
    // If training is not required for this document, return empty array
    if (!document.trainingRequired) return [];
    
    // Filter employees based on affected roles
    const targetEmployees = employees.filter(
      employee => document.affectedRoles?.includes(employee.role)
    );
    
    // Create training records for each employee
    const records: TrainingRecord[] = targetEmployees.map(employee => ({
      id: crypto.randomUUID(),
      session_id: crypto.randomUUID(),
      employee_id: employee.id,
      employee_name: employee.name,
      assigned_date: new Date().toISOString(),
      due_date: new Date(Date.now() + (document.trainingDeadlineDays || 14) * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Not Started' as TrainingStatus,
    }));

    // Save the records to Supabase if there are any
    if (records.length > 0) {
      const { error } = await supabase
        .from('training_records')
        .insert(records);

      if (error) {
        console.error('Error creating training records for document update:', error);
        // Return empty array on error
        return [];
      }
    }
    
    return records;
  },
  
  /**
   * Get notifications for document changes that require training
   */
  getDocumentTrainingNotifications: (documentUpdates: DocumentControlIntegration[]): {
    documentId: string;
    documentTitle: string;
    affectedEmployeeCount: number;
    dueDate: string;
  }[] => {
    // Filter documents that require training
    const trainingRequired = documentUpdates.filter(doc => doc.trainingRequired);
    
    // Create notifications
    return trainingRequired.map(doc => ({
      documentId: doc.documentId,
      documentTitle: doc.documentTitle,
      affectedEmployeeCount: doc.affectedRoles?.length || 0,
      dueDate: new Date(Date.now() + (doc.trainingDeadlineDays || 14) * 24 * 60 * 60 * 1000).toISOString(),
    }));
  }
};

export default documentTrainingService;
