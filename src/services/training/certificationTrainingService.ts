
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for certification-related training functionality
 */
const certificationTrainingService = {
  /**
   * Process expiring certifications by sending notifications and creating recertification training
   * @returns Number of records processed
   */
  processExpiringCertifications: async (): Promise<number> => {
    try {
      // Get date thresholds
      const now = new Date();
      const expiryWarningDate = new Date();
      expiryWarningDate.setDate(now.getDate() + 45); // 45 days in advance
      
      // Find training records with certifications expiring soon
      const { data, error } = await supabase
        .from('training_records')
        .select(`
          id, 
          employee_id, 
          employee_name, 
          next_recurrence,
          session_id,
          training_sessions(id, title, is_recurring, recurring_interval)
        `)
        .eq('status', 'Completed')
        .lt('next_recurrence', expiryWarningDate.toISOString())
        .is('completion_date', 'not.null')
        .order('next_recurrence', { ascending: true });
        
      if (error) {
        console.error('Error fetching expiring certifications:', error);
        return 0;
      }
      
      if (!data || data.length === 0) {
        return 0;
      }
      
      let processedCount = 0;
      
      // Process each expiring certification
      for (const record of data) {
        // Skip records that don't have next_recurrence or aren't recurring
        if (!record.next_recurrence || !record.training_sessions) {
          continue;
        }
        
        // Extract session details
        const session = Array.isArray(record.training_sessions) 
          ? record.training_sessions[0] 
          : record.training_sessions;
          
        if (!session || !session.is_recurring) {
          continue;
        }
        
        // Check if a recertification record already exists
        const { data: existingRecords, error: checkError } = await supabase
          .from('training_records')
          .select('id')
          .eq('employee_id', record.employee_id)
          .eq('session_id', record.session_id)
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
        
        // Calculate due date based on expiry date
        const expiryDate = new Date(record.next_recurrence);
        const dueDate = new Date(expiryDate);
        dueDate.setDate(dueDate.getDate() - 15); // Due 15 days before expiry
        
        // If due date is in the past, set it to 7 days from now
        if (dueDate < now) {
          dueDate.setDate(now.getDate() + 7);
        }
        
        // Create new training record for recertification
        const { error: insertError } = await supabase
          .from('training_records')
          .insert({
            employee_id: record.employee_id,
            employee_name: record.employee_name,
            session_id: record.session_id,
            status: 'Not Started' as const,
            assigned_date: now.toISOString(),
            due_date: dueDate.toISOString(),
            notes: `Recertification required before expiry on ${expiryDate.toLocaleDateString()}`
          });
          
        if (insertError) {
          console.error('Error creating recertification record:', insertError);
          continue;
        }
        
        processedCount++;
      }
      
      return processedCount;
    } catch (error) {
      console.error('Error processing expiring certifications:', error);
      return 0;
    }
  },
  
  /**
   * Create remediation training for a failed assessment
   * @param recordId The record ID of the failed assessment
   * @param failureReason Reason for the failure
   * @returns Boolean indicating success
   */
  createRemediationTraining: async (recordId: string, failureReason: string): Promise<boolean> => {
    try {
      // Get the failed training record
      const { data: record, error: recordError } = await supabase
        .from('training_records')
        .select(`
          id, 
          employee_id, 
          employee_name, 
          session_id,
          training_sessions(id, title)
        `)
        .eq('id', recordId)
        .single();
        
      if (recordError || !record) {
        console.error('Error fetching failed training record:', recordError);
        return false;
      }
      
      // Calculate due date (14 days from now)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      
      // Create new training record for remediation
      const { error: insertError } = await supabase
        .from('training_records')
        .insert({
          employee_id: record.employee_id,
          employee_name: record.employee_name,
          session_id: record.session_id,
          status: 'Not Started' as const,
          assigned_date: new Date().toISOString(),
          due_date: dueDate.toISOString(),
          notes: `Remediation training for failed assessment. Reason: ${failureReason}`
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
