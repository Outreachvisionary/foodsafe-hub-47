import { supabase } from '@/integrations/supabase/client';
import { Employee, TrainingPlan, AutoAssignRule } from '@/types/training';

/**
 * Service for managing training assignments
 */
const trainingAssignmentService = {
  /**
   * Assign a training plan to employees
   * @param planId Training plan ID
   * @param employeeIds Array of employee IDs to assign the plan to
   * @returns Number of successful assignments
   */
  assignTrainingPlan: async (planId: string, employeeIds: string[]): Promise<number> => {
    try {
      // Get training plan details
      const { data: plan, error: planError } = await supabase
        .from('training_plans')
        .select('*')
        .eq('id', planId)
        .single();
        
      if (planError) {
        console.error('Error fetching training plan:', planError);
        return 0;
      }
      
      if (!plan || !plan.courses || plan.courses.length === 0) {
        console.error('Training plan not found or has no courses');
        return 0;
      }
      
      // Get employee details
      const { data: employees, error: empError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', employeeIds);
        
      if (empError) {
        console.error('Error fetching employees:', empError);
        return 0;
      }
      
      if (!employees || employees.length === 0) {
        console.error('No employees found for assignment');
        return 0;
      }
      
      let assignmentCount = 0;
      
      // Calculate due date based on plan duration
      const dueDate = new Date();
      if (plan.duration_days) {
        dueDate.setDate(dueDate.getDate() + plan.duration_days);
      } else {
        dueDate.setDate(dueDate.getDate() + 30); // Default to 30 days
      }
      
      // For each course in the plan, create training records for all employees
      for (const courseId of plan.courses) {
        // Get session details
        const { data: session, error: sessionError } = await supabase
          .from('training_sessions')
          .select('id, title')
          .eq('id', courseId)
          .single();
          
        if (sessionError) {
          console.error(`Error fetching session ${courseId}:`, sessionError);
          continue;
        }
        
        // Create training records for each employee
        for (const employee of employees) {
          // Check if employee already has a record for this session
          const { data: existingRecords, error: checkError } = await supabase
            .from('training_records')
            .select('id')
            .eq('employee_id', employee.id)
            .eq('session_id', courseId)
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
              session_id: courseId,
              status: 'Not Started' as const,
              assigned_date: new Date().toISOString(),
              due_date: dueDate.toISOString(),
              notes: `Assigned as part of training plan: ${plan.name}`
            });
            
          if (insertError) {
            console.error('Error creating training record:', insertError);
            continue;
          }
          
          assignmentCount++;
        }
      }
      
      return assignmentCount;
    } catch (error) {
      console.error('Error assigning training plan:', error);
      return 0;
    }
  },
  
  /**
   * Evaluate auto-assign rules to assign training automatically
   * @param rules Array of auto-assign rules to evaluate
   * @param employee Employee to evaluate rules for (if specified)
   * @returns Number of training assignments created
   */
  evaluateAutoAssignRules: async (
    rules: AutoAssignRule[], 
    employee?: Employee
  ): Promise<number> => {
    try {
      let assignmentCount = 0;
      
      // If a specific employee is provided, only evaluate for that employee
      if (employee) {
        for (const rule of rules) {
          if (await evaluateRuleForEmployee(rule, employee)) {
            // Get the training plan
            const planId = rule.trainingPlanId;
            const assignments = await trainingAssignmentService.assignTrainingPlan(
              planId, 
              [employee.id]
            );
            assignmentCount += assignments;
          }
        }
        
        return assignmentCount;
      }
      
      // Otherwise, get all active employees and evaluate rules for each
      const { data: employees, error: empError } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'active');
        
      if (empError) {
        console.error('Error fetching employees:', empError);
        return 0;
      }
      
      if (!employees || employees.length === 0) {
        console.log('No active employees found');
        return 0;
      }
      
      // Evaluate each rule for each employee
      for (const rule of rules) {
        const matchingEmployees: string[] = [];
        
        for (const emp of employees) {
          if (await evaluateRuleForEmployee(rule, emp)) {
            matchingEmployees.push(emp.id);
          }
        }
        
        // If there are matching employees, assign the training plan
        if (matchingEmployees.length > 0) {
          const planId = rule.trainingPlanId;
          const assignments = await trainingAssignmentService.assignTrainingPlan(
            planId, 
            matchingEmployees
          );
          assignmentCount += assignments;
        }
      }
      
      return assignmentCount;
    } catch (error) {
      console.error('Error evaluating auto-assign rules:', error);
      return 0;
    }
  }
};

/**
 * Helper function to evaluate a rule for a specific employee
 */
async function evaluateRuleForEmployee(rule: AutoAssignRule, employee: Employee): Promise<boolean> {
  // Check department matches if specified
  if (rule.targetDepartment && employee.department !== rule.targetDepartment) {
    return false;
  }
  
  // Check role matches if specified
  if (rule.targetRole && employee.role !== rule.targetRole) {
    return false;
  }
  
  // Check if employee already has assignments from this rule
  // This prevents duplicate assignments
  const { data: existingAssignments, error } = await supabase
    .from('training_records')
    .select('id')
    .eq('employee_id', employee.id)
    .eq('notes', `Assigned via auto-assign rule: ${rule.id}`)
    .limit(1);
    
  if (error) {
    console.error('Error checking existing assignments:', error);
    return false;
  }
  
  // If employee already has assignments from this rule, don't reassign
  if (existingAssignments && existingAssignments.length > 0) {
    return false;
  }
  
  return true;
}

export default trainingAssignmentService;
