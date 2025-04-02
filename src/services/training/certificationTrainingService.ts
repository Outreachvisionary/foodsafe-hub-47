import { Employee, TrainingRecord } from '@/types/training';
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for handling certification-related training
 */
const certificationTrainingService = {
  /**
   * Processes expiring certifications to create training notifications
   * @param daysBeforeExpiry Number of days before expiry to check
   * @returns Number of expiring certifications processed
   */
  processExpiringCertifications: async (daysBeforeExpiry: number = 30): Promise<number> => {
    try {
      // Calculate the date threshold for expiring certifications
      const expiryDateThreshold = new Date();
      expiryDateThreshold.setDate(expiryDateThreshold.getDate() + daysBeforeExpiry);
      
      // Query for training records with certifications expiring within the threshold
      const { data: expiringCertifications, error } = await supabase
        .from('training_records')
        .select('*')
        .eq('status', 'Completed')
        .lt('next_recurrence', expiryDateThreshold.toISOString())
        .is('completion_date', 'not.null');
      
      if (error) throw error;
      
      // Return early if no expiring certifications
      if (!expiringCertifications || expiringCertifications.length === 0) {
        console.log('No expiring certifications found');
        return 0;
      }
      
      // Keep track of how many notifications were created
      let notificationsCreated = 0;
      
      // Process each expiring certification
      for (const cert of expiringCertifications) {
        // Create a reminder training record if one doesn't already exist
        const { data: existingReminder, error: checkError } = await supabase
          .from('training_records')
          .select('id')
          .eq('employee_id', cert.employee_id)
          .eq('session_id', cert.session_id)
          .eq('status', 'Not Started')
          .is('completion_date', 'null');
          
        if (checkError) {
          console.error('Error checking for existing reminders:', checkError);
          continue;
        }
        
        // If a reminder already exists, skip this certification
        if (existingReminder && existingReminder.length > 0) {
          continue;
        }
        
        // Create a new training record as a reminder
        const { error: insertError } = await supabase
          .from('training_records')
          .insert({
            employee_id: cert.employee_id,
            employee_name: cert.employee_name,
            session_id: cert.session_id,
            status: 'Not Started' as const,
            assigned_date: new Date().toISOString(),
            due_date: cert.next_recurrence,
            notes: `Recertification required. Previous certification expires on ${new Date(cert.next_recurrence).toLocaleDateString()}.`
          });
          
        if (insertError) {
          console.error('Error creating reminder training record:', insertError);
          continue;
        }
        
        notificationsCreated++;
      }
      
      console.log(`Created ${notificationsCreated} certification reminder records`);
      return notificationsCreated;
    } catch (error) {
      console.error('Error processing expiring certifications:', error);
      return 0;
    }
  },
  
  /**
   * Creates remediation training for an employee who failed a certification
   * @param employeeId Employee ID
   * @param certificationId Training session ID of the failed certification
   * @returns Boolean indicating success
   */
  createRemediationTraining: async (employeeId: string, certificationId: string): Promise<boolean> => {
    try {
      // Get the failed training record
      const { data: failedTraining, error: fetchError } = await supabase
        .from('training_records')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('session_id', certificationId)
        .single();
        
      if (fetchError) {
        console.error('Error fetching failed training record:', fetchError);
        return false;
      }
      
      if (!failedTraining) {
        console.error('Failed training record not found');
        return false;
      }
      
      // Get the employee's name for the new record
      const { data: sessionData, error: sessionError } = await supabase
        .from('training_sessions')
        .select('title')
        .eq('id', certificationId)
        .single();
        
      if (sessionError) {
        console.error('Error fetching session data:', sessionError);
        return false;
      }
      
      // Create a new remediation training record
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // Due in 30 days
      
      const { error: insertError } = await supabase
        .from('training_records')
        .insert({
          employee_id: employeeId,
          employee_name: failedTraining.employee_name,
          session_id: certificationId,
          status: 'Not Started' as const,
          assigned_date: new Date().toISOString(),
          due_date: dueDate.toISOString(),
          notes: `Remediation training required due to failed certification attempt on ${new Date(failedTraining.completion_date || '').toLocaleDateString()}. Score: ${failedTraining.score}%.`
        });
        
      if (insertError) {
        console.error('Error creating remediation training record:', insertError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error creating remediation training:', error);
      return false;
    }
  }
};

export default certificationTrainingService;
