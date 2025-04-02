
import { supabase } from '@/integrations/supabase/client';
import {
  Employee,
  TrainingRecord,
  TrainingStatus
} from '@/types/training';

/**
 * Service for certification and recertification training
 */
export const certificationTrainingService = {
  /**
   * Check for expired certifications and create retraining records
   */
  processExpiringCertifications: async (
    employees: Employee[],
    daysBeforeExpiry: number = 30
  ): Promise<TrainingRecord[]> => {
    const now = new Date();
    const expiryThreshold = new Date(now.getTime() + daysBeforeExpiry * 24 * 60 * 60 * 1000);
    
    const trainingRecords: TrainingRecord[] = [];
    
    // Process each employee
    for (const employee of employees) {
      if (!employee.certifications) continue;
      
      for (const cert of employee.certifications) {
        const expiryDate = new Date(cert.expiryDate);
        
        // If certification is expiring soon and requires recertification
        if (expiryDate <= expiryThreshold && cert.requiresRecertification) {
          const record: TrainingRecord = {
            id: crypto.randomUUID(),
            session_id: `recert-session-${cert.id}`,
            employee_id: employee.id,
            employee_name: employee.name,
            assigned_date: new Date().toISOString(),
            due_date: new Date(expiryDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days before expiry
            status: 'Not Started' as TrainingStatus,
          };
          
          trainingRecords.push(record);
        }
      }
    }
    
    // Save the records to Supabase if there are any
    if (trainingRecords.length > 0) {
      const { error } = await supabase
        .from('training_records')
        .insert(trainingRecords);

      if (error) {
        console.error('Error creating training records for expiring certifications:', error);
        // Return empty array on error
        return [];
      }
    }
    
    return trainingRecords;
  },
  
  /**
   * Create remediation training assignments for failed assessments
   */
  createRemediationTraining: async (
    failedAssessments: { 
      employeeId: string;
      employeeName: string;
      courseId?: string;
      score: number;
      assessmentDate: string;
    }[]
  ): Promise<TrainingRecord[]> => {
    const records = failedAssessments.map(assessment => ({
      id: crypto.randomUUID(),
      session_id: crypto.randomUUID(),
      employee_id: assessment.employeeId,
      employee_name: assessment.employeeName,
      assigned_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      status: 'Not Started' as TrainingStatus,
    }));

    // Save the records to Supabase if there are any
    if (records.length > 0) {
      const { error } = await supabase
        .from('training_records')
        .insert(records);

      if (error) {
        console.error('Error creating remediation training records:', error);
        // Return empty array on error
        return [];
      }
    }
    
    return records;
  }
};

export default certificationTrainingService;
