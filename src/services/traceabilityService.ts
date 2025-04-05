
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TrainingRecord, TrainingSession } from '@/types/training';

// This file replaces the old traceabilityService.ts with training functionality

// Evaluate if an employee needs training and assign appropriate courses
export const evaluateTrainingNeeds = async (employeeId: string, employeeName: string) => {
  try {
    // Get employee details - in a real app this would include role, department, etc.
    
    // Get training matrix requirements
    const { data: requirements, error: reqError } = await supabase
      .from('training_requirements')
      .select('*');
      
    if (reqError) throw reqError;
    
    // Get existing assigned training
    const { data: existing, error: existingError } = await supabase
      .from('training_records')
      .select('*')
      .eq('employee_id', employeeId);
      
    if (existingError) throw existingError;
    
    // Filter requirements that haven't been assigned yet
    const existingCourseIds = existing?.map(record => record.course_id) || [];
    
    // Here we would normally match employee role/department against requirements
    // This is a simplified version
    const needsTraining = requirements?.filter(req => 
      !existingCourseIds.includes(req.id) && req.required
    ) || [];
    
    if (needsTraining.length > 0) {
      // Calculate due dates
      const trainingToAssign = needsTraining.map(training => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30); // Default 30 days
        
        return {
          employee_id: employeeId,
          employee_name: employeeName,
          course_id: training.id,
          due_date: dueDate.toISOString(),
          status: 'Not Started',
          assigned_by: 'System',
        };
      });
      
      // Assign the training
      const { error: assignError } = await supabase
        .from('training_records')
        .insert(trainingToAssign);
        
      if (assignError) throw assignError;
      
      toast.success(`Assigned ${trainingToAssign.length} training courses to ${employeeName}`);
      return { assigned: trainingToAssign.length };
    }
    
    return { assigned: 0 };
  } catch (error) {
    console.error('Error evaluating training needs:', error);
    toast.error('Failed to evaluate training needs');
    return { assigned: 0, error };
  }
};

// Get completion status for employee training
export const getTrainingCompletionStatus = async (employeeId: string): Promise<number> => {
  try {
    // Get assigned training
    const { data: records, error } = await supabase
      .from('training_records')
      .select('status')
      .eq('employee_id', employeeId);
      
    if (error) throw error;
    
    if (!records || records.length === 0) return 100; // No training assigned
    
    // Calculate completion percentage
    const completed = records.filter(record => record.status === 'Completed').length;
    return Math.round((completed / records.length) * 100);
  } catch (error) {
    console.error('Error getting training completion status:', error);
    return 0;
  }
};

// Process training certifications that are expiring soon
export const processCertifications = async () => {
  try {
    // Get expiring certifications (next 30 days)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    const { data: certifications, error } = await supabase
      .from('certifications')
      .select('*')
      .lte('expiry_date', expiryDate.toISOString())
      .eq('status', 'Valid')
      .eq('reminder_sent', false);
      
    if (error) throw error;
    
    if (certifications && certifications.length > 0) {
      // Update the reminder_sent flag
      const { error: updateError } = await supabase
        .from('certifications')
        .update({ reminder_sent: true })
        .in('id', certifications.map(c => c.id));
        
      if (updateError) throw updateError;
      
      toast.info(`${certifications.length} certifications are expiring soon`);
      return { processed: certifications.length };
    }
    
    return { processed: 0 };
  } catch (error) {
    console.error('Error processing certifications:', error);
    toast.error('Failed to process certifications');
    return { processed: 0, error };
  }
};

// Get department compliance metrics
export const getDepartmentComplianceMetrics = async (departmentId: string) => {
  try {
    // For now, return mock data
    // In a real app, this would call the Supabase function
    
    // Mock data
    return {
      departmentId,
      totalEmployees: 45,
      compliantEmployees: 38,
      compliancePercentage: 84,
    };
  } catch (error) {
    console.error('Error getting department compliance metrics:', error);
    return null;
  }
};
