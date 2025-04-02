
import { 
  Employee, 
  TrainingRecord, 
  TrainingPlan, 
  AutoAssignRule,
  TrainingStatus
} from '@/types/training';

/**
 * Service specifically for training assignment functionality
 */
export const trainingAssignmentService = {
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
      status: 'Not Started' as TrainingStatus,
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
  }
};

export default trainingAssignmentService;
