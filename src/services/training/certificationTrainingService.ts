
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
  processExpiringCertifications: (
    employees: Employee[],
    daysBeforeExpiry: number = 30
  ): TrainingRecord[] => {
    const now = new Date();
    const expiryThreshold = new Date(now.getTime() + daysBeforeExpiry * 24 * 60 * 60 * 1000);
    
    const trainingRecords: TrainingRecord[] = [];
    
    employees.forEach(employee => {
      if (!employee.certifications) return;
      
      employee.certifications.forEach(cert => {
        const expiryDate = new Date(cert.expiryDate);
        
        // If certification is expiring soon and requires recertification
        if (expiryDate <= expiryThreshold && cert.requiresRecertification) {
          trainingRecords.push({
            id: `tr-${Math.random().toString(36).substr(2, 9)}`,
            session_id: `recert-session-${cert.id}`,
            employee_id: employee.id,
            employee_name: employee.name,
            assigned_date: new Date().toISOString(),
            due_date: new Date(expiryDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days before expiry
            status: 'Not Started' as TrainingStatus,
          });
        }
      });
    });
    
    return trainingRecords;
  },
  
  /**
   * Create remediation training assignments for failed assessments
   */
  createRemediationTraining: (
    failedAssessments: { 
      employeeId: string;
      employeeName: string;
      courseId?: string;
      score: number;
      assessmentDate: string;
    }[]
  ): TrainingRecord[] => {
    return failedAssessments.map(assessment => ({
      id: `tr-${Math.random().toString(36).substr(2, 9)}`,
      session_id: `remed-session-${Math.random().toString(36).substr(2, 9)}`,
      employee_id: assessment.employeeId,
      employee_name: assessment.employeeName,
      assigned_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      status: 'Not Started' as TrainingStatus,
    }));
  }
};

export default certificationTrainingService;
