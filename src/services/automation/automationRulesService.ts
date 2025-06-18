
export interface AutomationRule {
  id: string;
  name: string;
  trigger: 'time_based' | 'status_change' | 'external_event';
  conditions: Record<string, any>;
  actions: AutomationAction[];
  enabled: boolean;
}

export interface AutomationAction {
  type: 'update_status' | 'send_notification' | 'create_activity' | 'assign_user';
  parameters: Record<string, any>;
}

// Execute automation rules
export const executeAutomationRules = async (trigger: string, context: Record<string, any>): Promise<void> => {
  // This would fetch and execute custom automation rules
  // For now, we'll implement some basic rules

  if (trigger === 'capa_created') {
    await handleCAPACreated(context.capaId);
  } else if (trigger === 'status_changed') {
    await handleStatusChanged(context.capaId, context.oldStatus, context.newStatus);
  }
};

const handleCAPACreated = async (capaId: string): Promise<void> => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  const { data: capa } = await supabase
    .from('capa_actions')
    .select('*')
    .eq('id', capaId)
    .single();

  if (!capa) return;

  // Auto-assign based on priority
  if (capa.priority === 'Critical') {
    await supabase
      .from('capa_activities')
      .insert({
        capa_id: capaId,
        action_type: 'critical_alert',
        action_description: 'Critical CAPA created - immediate attention required',
        performed_by: 'System'
      });
  }
};

const handleStatusChanged = async (capaId: string, oldStatus: string, newStatus: string): Promise<void> => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  if (newStatus === 'Closed') {
    // Schedule effectiveness review
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    await supabase
      .from('capa_activities')
      .insert({
        capa_id: capaId,
        action_type: 'effectiveness_review_scheduled',
        action_description: 'Effectiveness review scheduled for 30 days from completion',
        performed_by: 'System',
        metadata: { scheduledDate: futureDate.toISOString() }
      });
  }
};
