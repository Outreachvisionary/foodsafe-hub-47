
import { supabase } from '@/integrations/supabase/client';
import { TrainingPlan, Employee, AutoAssignRule } from '@/types/training';

const trainingAssignmentService = {
  /**
   * Assign a training plan to eligible employees
   */
  assignTrainingPlan: async (plan: TrainingPlan, employeeIds: string[]): Promise<boolean> => {
    try {
      // For each employee and course combination in the plan
      const assignments = [];
      
      for (const employeeId of employeeIds) {
        const courses = plan.courses || plan.coursesIncluded || [];
        for (const courseId of courses) {
          // Calculate due date based on plan duration
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + (plan.durationDays || plan.duration_days || 30));
          
          assignments.push({
            employee_id: employeeId,
            employee_name: 'Employee Name', // In a real app, look up the name
            session_id: courseId, // Using course ID as session ID for now
            due_date: dueDate.toISOString(),
            status: 'Not Started',
            assigned_date: new Date().toISOString(),
          });
        }
      }
      
      if (assignments.length > 0) {
        const { error } = await supabase
          .from('training_records')
          .insert(assignments);
          
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error assigning training plan:', error);
      return false;
    }
  },
  
  /**
   * Evaluate auto-assign rules for employees
   */
  evaluateAutoAssignRules: async (rules: AutoAssignRule[], employee: Employee): Promise<boolean> => {
    try {
      for (const rule of rules) {
        let ruleMatches = true;
        
        for (const condition of rule.conditions) {
          const employeeValue = employee[condition.key as keyof Employee];
          
          switch (condition.operator) {
            case '=':
              if (employeeValue !== condition.value) ruleMatches = false;
              break;
            case '!=':
              if (employeeValue === condition.value) ruleMatches = false;
              break;
            case '>':
              if (typeof employeeValue === 'number' && typeof condition.value === 'number') {
                if (employeeValue <= condition.value) ruleMatches = false;
              }
              break;
            case '<':
              if (typeof employeeValue === 'number' && typeof condition.value === 'number') {
                if (employeeValue >= condition.value) ruleMatches = false;
              }
              break;
            case '>=':
              if (typeof employeeValue === 'number' && typeof condition.value === 'number') {
                if (employeeValue < condition.value) ruleMatches = false;
              }
              break;
            case '<=':
              if (typeof employeeValue === 'number' && typeof condition.value === 'number') {
                if (employeeValue > condition.value) ruleMatches = false;
              }
              break;
          }
          
          if (!ruleMatches) break;
        }
        
        if (ruleMatches) return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error evaluating auto-assign rules:', error);
      return false;
    }
  },
};

export default trainingAssignmentService;
