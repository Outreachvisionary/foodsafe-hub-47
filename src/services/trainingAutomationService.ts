
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
      employeeId: employee.id,
      courseId: trainingPlan.courses[0],
      courseName: 'Auto-assigned Course',
      assignedDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      status: 'Not Started',
      autoAssigned: true,
      autoAssignReason: 'Compliance Requirement'
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
              const hireDate = new Date(employee.hireDate);
              const compareDate = new Date(condition.value as string);
              return hireDate > compareDate;
            }
            return false;
          });
          
        case 'CompetencyScore':
          return rule.conditions.every(condition => {
            if (condition.key === 'competencyScore' && condition.operator === '<') {
              const assessments = employee.competencyAssessments;
              if (!assessments || assessments.length === 0) return false;
              
              // Find the most recent assessment
              const latestAssessment = assessments.sort(
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
      employee => document.affectedRoles.includes(employee.role)
    );
    
    // Create training records for each employee
    return targetEmployees.map(employee => ({
      id: `tr-${Math.random().toString(36).substr(2, 9)}`,
      employeeId: employee.id,
      courseId: document.linkedCourseIds[0],
      courseName: `Training for ${document.documentType} ${document.documentId}`,
      assignedDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + document.trainingDeadlineDays * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Not Started',
      autoAssigned: true,
      autoAssignReason: 'Document Update',
      linkedDocuments: [document.documentId]
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
      employee.certifications.forEach(cert => {
        const expiryDate = new Date(cert.expiryDate);
        
        // If certification is expiring soon and requires recertification
        if (expiryDate <= expiryThreshold && cert.requiresRecertification) {
          trainingRecords.push({
            id: `tr-${Math.random().toString(36).substr(2, 9)}`,
            employeeId: employee.id,
            courseId: 'RECERT-' + cert.id,
            courseName: `Recertification: ${cert.name}`,
            assignedDate: new Date().toISOString(),
            dueDate: new Date(expiryDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days before expiry
            status: 'Not Started',
            autoAssigned: true,
            autoAssignReason: 'Compliance Requirement',
            isRecurring: true,
            recurringInterval: cert.recertificationInterval || 12, // Default to annual if not specified
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
      courseId?: string;
      score: number;
      assessmentDate: string;
    }[]
  ): TrainingRecord[] => {
    return failedAssessments.map(assessment => ({
      id: `tr-${Math.random().toString(36).substr(2, 9)}`,
      employeeId: assessment.employeeId,
      courseId: assessment.courseId || 'REMEDIATION-GENERAL',
      courseName: `Remediation Training for Failed Assessment`,
      assignedDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      status: 'Not Started',
      autoAssigned: true,
      autoAssignReason: 'Remediation',
      linkedDocuments: []
    }));
  },
  
  /**
   * Get the automation settings for the organization
   */
  getAutomationConfig: (): TrainingAutomationConfig => {
    // Mock configuration - would normally come from API/database
    return {
      enabled: true,
      triggerEvents: {
        newHire: true,
        roleChange: true,
        documentUpdate: true,
        competencyFailure: true,
        certificationExpiry: true
      },
      notificationSettings: {
        emailEnabled: true,
        inAppEnabled: true,
        reminderDays: [1, 7, 14], // Remind 1, 7, and 14 days before due
        escalationThreshold: 7, // Escalate after 7 days overdue
        escalationTargets: ['Supervisor', 'Manager']
      }
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
