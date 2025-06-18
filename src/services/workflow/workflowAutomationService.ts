
import { supabase } from '@/integrations/supabase/client';
import { CAPA } from '@/types/capa';

// Check for overdue CAPAs and send notifications
export const checkOverdueCAPAs = async (): Promise<void> => {
  try {
    const { data: overdueCAPAs } = await supabase
      .from('capa_actions')
      .select('*')
      .lt('due_date', new Date().toISOString())
      .in('status', ['Open', 'In Progress']);

    for (const capa of overdueCAPAs || []) {
      // Update status to overdue
      await supabase
        .from('capa_actions')
        .update({ status: 'Overdue' })
        .eq('id', capa.id);

      // Create notification activity
      await supabase
        .from('capa_activities')
        .insert({
          capa_id: capa.id,
          action_type: 'overdue_notification',
          action_description: 'CAPA is now overdue',
          performed_by: 'System',
          metadata: { originalDueDate: capa.due_date }
        });
    }
  } catch (error) {
    console.error('Error checking overdue CAPAs:', error);
  }
};

// Auto-assign CAPAs based on rules
export const autoAssignCAPA = async (capa: CAPA): Promise<string> => {
  const assignmentRules: Record<string, string> = {
    'Contamination': 'Food Safety Manager',
    'Equipment Malfunction': 'Maintenance Manager',
    'Documentation Error': 'Quality Manager',
    'Process Deviation': 'Operations Manager',
    'Regulatory Non-Compliance': 'Compliance Manager'
  };

  // Determine assignee based on source or reason
  const assignee = assignmentRules[capa.source] || 'Quality Manager';
  
  return assignee;
};
