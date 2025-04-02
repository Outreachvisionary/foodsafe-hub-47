
import { supabase } from '@/integrations/supabase/client';
import { TrainingPlan, AutoAssignRule, Employee } from '@/types/training';

/**
 * Service for handling training assignments and automatic rule-based assignments
 */
const trainingAssignmentService = {
  /**
   * Assigns a training plan to employees based on roles or departments
   */
  assignTrainingPlan: async (plan: TrainingPlan, employeeIds: string[]): Promise<boolean> => {
    try {
      // Get the courses associated with this plan
      const courses = plan.coursesIncluded || plan.courses || [];
      
      if (courses.length === 0) {
        console.error('Cannot assign training plan with no courses');
        return false;
      }
      
      // Calculate due date based on plan duration
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (plan.durationDays || 30));
      
      // Create a training session for this plan
      const { data: session, error: sessionError } = await supabase
        .from('training_sessions')
        .insert({
          title: `${plan.name} Training`,
          description: plan.description,
          training_type: 'Plan',
          training_category: 'Required',
          assigned_to: employeeIds,
          materials_id: courses,
          start_date: new Date().toISOString(),
          due_date: dueDate.toISOString(),
          is_recurring: plan.isAutomated,
          recurring_interval: plan.recurringSchedule?.interval || null,
          created_by: 'system'
        })
        .select()
        .single();
        
      if (sessionError) {
        console.error('Error creating training session:', sessionError);
        return false;
      }
      
      // For each employee, create a training record
      const trainingRecords = employeeIds.map(empId => ({
        session_id: session.id,
        employee_id: empId,
        employee_name: empId, // Ideally would be fetched from a users/employees table
        status: 'Not Started',
        assigned_date: new Date().toISOString(),
        due_date: dueDate.toISOString()
      }));
      
      const { error: recordsError } = await supabase
        .from('training_records')
        .insert(trainingRecords);
        
      if (recordsError) {
        console.error('Error creating training records:', recordsError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error assigning training plan:', error);
      return false;
    }
  },
  
  /**
   * Evaluates assignment rules to determine if an employee should be assigned training
   */
  evaluateAutoAssignRules: async (employee: Employee, rules: AutoAssignRule[]): Promise<string[]> => {
    try {
      // Array to hold the IDs of plans that should be assigned
      const matchingPlanIds: string[] = [];
      
      // Check each rule
      for (const rule of rules) {
        let ruleMatches = false;
        
        switch (rule.type) {
          case 'Role':
            // Check if employee's role matches any role conditions
            ruleMatches = rule.conditions.some(condition => 
              condition.key === 'role' && 
              condition.operator === '=' && 
              condition.value === employee.role
            );
            break;
            
          case 'Department':
            // Check if employee's department matches any department conditions
            ruleMatches = rule.conditions.some(condition => 
              condition.key === 'department' && 
              condition.operator === '=' && 
              condition.value === employee.department
            );
            break;
            
          case 'NewHire':
            // Check if employee was hired within the specified timeframe
            if (employee.hireDate) {
              const hireDate = new Date(employee.hireDate);
              const today = new Date();
              const daysSinceHire = Math.floor((today.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24));
              
              ruleMatches = rule.conditions.some(condition => {
                if (condition.key === 'daysSinceHire') {
                  if (condition.operator === '<=' && daysSinceHire <= Number(condition.value)) return true;
                  if (condition.operator === '<' && daysSinceHire < Number(condition.value)) return true;
                }
                return false;
              });
            }
            break;
            
          case 'CompetencyScore':
            // Check if employee's competency score meets the criteria
            if (employee.competencyAssessments && employee.competencyAssessments.length > 0) {
              const latestAssessment = employee.competencyAssessments[employee.competencyAssessments.length - 1];
              
              ruleMatches = rule.conditions.some(condition => {
                if (condition.key === 'score') {
                  if (condition.operator === '<=' && latestAssessment.score <= Number(condition.value)) return true;
                  if (condition.operator === '<' && latestAssessment.score < Number(condition.value)) return true;
                  if (condition.operator === '>=' && latestAssessment.score >= Number(condition.value)) return true;
                  if (condition.operator === '>' && latestAssessment.score > Number(condition.value)) return true;
                  if (condition.operator === '=' && latestAssessment.score === Number(condition.value)) return true;
                }
                return false;
              });
            }
            break;
        }
        
        // If the rule matches, fetch the associated training plan
        if (ruleMatches) {
          // This would typically fetch from a mapping table linking rules to plans
          // For now, we'll return a placeholder plan ID if rule matches
          matchingPlanIds.push('placeholder-plan-id');
        }
      }
      
      return matchingPlanIds;
    } catch (error) {
      console.error('Error evaluating auto-assign rules:', error);
      return [];
    }
  }
};

export default trainingAssignmentService;
