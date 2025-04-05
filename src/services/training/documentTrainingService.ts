
import { supabase } from '@/integrations/supabase/client';
import { DocumentControlIntegration } from '@/types/training';

const documentTrainingService = {
  /**
   * Handle document updates that might require training
   */
  handleDocumentUpdate: async (documentUpdate: DocumentControlIntegration): Promise<boolean> => {
    try {
      if (documentUpdate.trainingRequired) {
        // Find affected employees based on roles
        const { data: employees, error: employeeError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('role', documentUpdate.affectedRoles || []);
          
        if (employeeError) throw employeeError;
        
        if (employees && employees.length > 0) {
          // Create document training course if it doesn't exist
          const { data: course, error: courseError } = await supabase
            .from('training_courses')
            .select('id')
            .eq('document_id', documentUpdate.documentId)
            .single();
            
          if (courseError && courseError.code !== 'PGRST116') throw courseError;
          
          let courseId = course?.id;
          
          if (!courseId) {
            // Create a new course for this document
            const { data: newCourse, error: newCourseError } = await supabase
              .from('training_courses')
              .insert({
                title: `${documentUpdate.documentTitle} Training`,
                description: `Training for ${documentUpdate.changeType.toLowerCase()} document: ${documentUpdate.documentTitle}`,
                document_id: documentUpdate.documentId,
                duration_hours: 1, // Default
                created_by: 'System'
              })
              .select('id')
              .single();
              
            if (newCourseError) throw newCourseError;
            courseId = newCourse?.id;
          }
          
          if (courseId) {
            // Calculate due date
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + (documentUpdate.trainingDeadlineDays || 30));
            
            // Create training assignments for affected employees
            const assignments = employees.map(emp => ({
              employee_id: emp.id,
              employee_name: emp.full_name,
              course_id: courseId,
              due_date: dueDate.toISOString(),
              status: 'Not Started',
              assigned_by: 'System', // Automatic assignment
            }));
            
            const { error: assignError } = await supabase
              .from('training_records')
              .insert(assignments);
              
            if (assignError) throw assignError;
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error handling document update for training:', error);
      return false;
    }
  },
  
  /**
   * Get document training notifications
   */
  getDocumentTrainingNotifications: async () => {
    try {
      const { data, error } = await supabase
        .from('training_records')
        .select(`
          *,
          course:course_id(title, document_id),
          document:course(document_id).document(title, version)
        `)
        .eq('status', 'Not Started')
        .is('notification_sent', false);
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting document training notifications:', error);
      return [];
    }
  },
};

export default documentTrainingService;
