
import { supabase } from '@/integrations/supabase/client';

const certificationTrainingService = {
  /**
   * Process expiring certifications
   */
  processExpiringCertifications: async (daysThreshold: number = 30): Promise<boolean> => {
    try {
      // Get certifications that expire within the threshold
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + daysThreshold);
      
      const { data: certifications, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('status', 'Valid')
        .lt('expiry_date', expiryDate.toISOString())
        .eq('reminder_sent', false);
        
      if (error) throw error;
      
      if (certifications && certifications.length > 0) {
        // Update reminder_sent flag
        const { error: updateError } = await supabase
          .from('certifications')
          .update({ reminder_sent: true })
          .in('id', certifications.map(cert => cert.id));
          
        if (updateError) throw updateError;
        
        // In a real app, send notifications here
        console.log(`Processed ${certifications.length} expiring certifications`);
      }
      
      return true;
    } catch (error) {
      console.error('Error processing expiring certifications:', error);
      return false;
    }
  },
  
  /**
   * Create remediation training for failed assessments
   */
  createRemediationTraining: async (failedAssessmentIds: string[]): Promise<boolean> => {
    try {
      // Get the failed assessments
      const { data: failedAssessments, error } = await supabase
        .from('training_progress')
        .select(`
          *,
          assignment:assignment_id(employee_id, employee_name, course_id)
        `)
        .in('id', failedAssessmentIds)
        .eq('pass_fail', false);
        
      if (error) throw error;
      
      if (failedAssessments && failedAssessments.length > 0) {
        // Create remediation assignments
        const remediationAssignments = failedAssessments.map(assessment => {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 14); // 2 weeks for remediation
          
          return {
            employee_id: assessment.assignment.employee_id,
            employee_name: assessment.assignment.employee_name,
            course_id: assessment.assignment.course_id,
            due_date: dueDate.toISOString(),
            status: 'Not Started',
            assigned_by: 'System',
            is_remediation: true,
            original_assessment_id: assessment.id
          };
        });
        
        const { error: insertError } = await supabase
          .from('training_records')
          .insert(remediationAssignments);
          
        if (insertError) throw insertError;
      }
      
      return true;
    } catch (error) {
      console.error('Error creating remediation training:', error);
      return false;
    }
  },
};

export default certificationTrainingService;
