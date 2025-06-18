
import { supabase } from '@/integrations/supabase/client';

// Auto-escalation for stuck CAPAs
export const autoEscalateStuckCAPAs = async (): Promise<void> => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: stuckCAPAs } = await supabase
    .from('capa_actions')
    .select('*')
    .eq('status', 'In Progress')
    .lt('updated_at', sevenDaysAgo.toISOString());

  for (const capa of stuckCAPAs || []) {
    // Escalate to manager
    await supabase
      .from('capa_activities')
      .insert({
        capa_id: capa.id,
        action_type: 'auto_escalation',
        action_description: 'CAPA automatically escalated due to inactivity',
        performed_by: 'System',
        metadata: { 
          originalAssignee: capa.assigned_to, 
          escalatedTo: 'Quality Manager',
          daysInactive: 7
        }
      });

    // Update assignee to manager
    await supabase
      .from('capa_actions')
      .update({ assigned_to: 'Quality Manager' })
      .eq('id', capa.id);
  }
};
