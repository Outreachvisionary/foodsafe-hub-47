
import { 
  Employee, 
  Course, 
  TrainingRecord, 
  TrainingPlan, 
  AutoAssignRule,
  TrainingAutomationConfig,
  DocumentControlIntegration
} from '@/types/training';

/**
 * Service for automating training assignments and workflows
 */
export const trainingAutomationService = {
  /**
   * Assign training based on a training plan and target employees
   */
  assignTrainingPlan: (
    trainingPlan: TrainingPlan, 
    employees: Employee[]
  ): TrainingRecord[] => {
    // Implementation would connect to backend API
    console.log(`Assigning training plan ${trainingPlan.name} to ${employees.length} employees`);
    
    // Mock response - would normally come from API
    return employees.map(employee => ({
      id: `tr-${Math.random().toString(36).substr(2, 9)}`,
      session_id: `session-${Math.random().toString(36).substr(2, 9)}`,
      employee_id: employee.id,
      employee_name: employee.name,
      status: 'Not Started',
      assigned_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    }));
  },
  
  /**
   * Check if a training plan should be assigned based on automation rules
   */
  evaluateAutoAssignRules: (
    employee: Employee, 
    rules: AutoAssignRule[]
  ): boolean => {
    // If no rules, don't auto-assign
    if (!rules || rules.length === 0) return false;
    
    // Check each rule
    return rules.some(rule => {
      if (!rule.type || !rule.conditions) return false;
      
      switch (rule.type) {
        case 'Role':
          return rule.conditions.every(condition => {
            if (condition.key === 'role' && condition.operator === '=') {
              return employee.role === condition.value;
            }
            return false;
          });
          
        case 'Department':
          return rule.conditions.every(condition => {
            if (condition.key === 'department' && condition.operator === '=') {
              return employee.department === condition.value;
            }
            return false;
          });
          
        case 'NewHire':
          return rule.conditions.every(condition => {
            if (condition.key === 'hireDate' && condition.operator === '>') {
              if (!employee.hireDate) return false;
              const hireDate = new Date(employee.hireDate);
              const compareDate = new Date(condition.value as string);
              return hireDate > compareDate;
            }
            return false;
          });
          
        case 'CompetencyScore':
          return rule.conditions.every(condition => {
            if (condition.key === 'competencyScore' && condition.operator === '<') {
              if (!employee.competencyAssessments || employee.competencyAssessments.length === 0) return false;
              
              // Find the most recent assessment
              const latestAssessment = employee.competencyAssessments.sort(
                (a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime()
              )[0];
              
              return latestAssessment.score < Number(condition.value);
            }
            return false;
          });
          
        default:
          return false;
      }
    });
  },
  
  /**
   * Process document control updates and assign training if needed
   */
  handleDocumentUpdate: (
    document: DocumentControlIntegration,
    employees: Employee[]
  ): TrainingRecord[] => {
    // If training is not required for this document, return empty array
    if (!document.trainingRequired) return [];
    
    // Filter employees based on affected roles
    const targetEmployees = employees.filter(
      employee => document.affectedRoles?.includes(employee.role)
    );
    
    // Create training records for each employee
    return targetEmployees.map(employee => ({
      id: `tr-${Math.random().toString(36).substr(2, 9)}`,
      session_id: `session-${Math.random().toString(36).substr(2, 9)}`,
      employee_id: employee.id,
      employee_name: employee.name,
      assigned_date: new Date().toISOString(),
      due_date: new Date(Date.now() + (document.trainingDeadlineDays || 14) * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Not Started',
    }));
  },
  
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
            status: 'Not Started',
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
      status: 'Not Started',
    }));
  },
  
  /**
   * Get the automation settings for the organization
   */
  getAutomationConfig: (): TrainingAutomationConfig => {
    // Mock configuration - would normally come from API/database
    return {
      enabled: true,
      rules: [],
      documentChangesTrigger: true,
      newEmployeeTrigger: true,
      roleCangeTrigger: true,
    };
  },
  
  /**
   * Update the automation settings for the organization
   */
  updateAutomationConfig: (config: TrainingAutomationConfig): boolean => {
    // Implementation would connect to backend API
    console.log('Updating automation config:', config);
    
    // Mock response - would normally come from API
    return true;
  }
};

export default trainingAutomationService;
