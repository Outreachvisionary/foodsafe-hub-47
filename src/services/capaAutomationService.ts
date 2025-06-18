
import { supabase } from '@/integrations/supabase/client';
import { CAPAStatus } from '@/types/enums';
import { checkOverdueCAPAs, getWorkflowConfig } from './capaWorkflowService';
import { toast } from 'sonner';

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

// Daily automation tasks
export const runDailyAutomation = async (): Promise<void> => {
  console.log('Running daily CAPA automation tasks...');
  
  try {
    await checkOverdueCAPAs();
    await checkUpcomingDeadlines();
    await processEffectivenessReviews();
    await generatePerformanceReports();
    
    console.log('Daily automation tasks completed successfully');
  } catch (error) {
    console.error('Error in daily automation:', error);
  }
};

// Check for upcoming deadlines and send alerts
const checkUpcomingDeadlines = async (): Promise<void> => {
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  const { data: upcomingCAPAs } = await supabase
    .from('capa_actions')
    .select('*')
    .lt('due_date', threeDaysFromNow.toISOString())
    .gt('due_date', new Date().toISOString())
    .in('status', ['Open', 'In Progress']);

  for (const capa of upcomingCAPAs || []) {
    await supabase
      .from('capa_activities')
      .insert({
        capa_id: capa.id,
        action_type: 'deadline_warning',
        action_description: `CAPA due in ${Math.ceil((new Date(capa.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`,
        performed_by: 'System',
        metadata: { dueDate: capa.due_date, daysRemaining: Math.ceil((new Date(capa.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) }
      });
  }
};

// Process effectiveness reviews for completed CAPAs
const processEffectivenessReviews = async (): Promise<void> => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: completedCAPAs } = await supabase
    .from('capa_actions')
    .select('*')
    .eq('status', 'Closed')
    .lt('completion_date', thirtyDaysAgo.toISOString())
    .is('effectiveness_verified', false);

  for (const capa of completedCAPAs || []) {
    // Create effectiveness review task
    await supabase
      .from('capa_activities')
      .insert({
        capa_id: capa.id,
        action_type: 'effectiveness_review_due',
        action_description: 'Effectiveness review is due for this completed CAPA',
        performed_by: 'System',
        metadata: { completionDate: capa.completion_date, reviewDueDate: new Date().toISOString() }
      });
  }
};

// Generate performance reports
const generatePerformanceReports = async (): Promise<void> => {
  try {
    const { data: capas } = await supabase
      .from('capa_actions')
      .select('*');

    if (!capas) return;

    const metrics = {
      totalCAPAs: capas.length,
      completedOnTime: capas.filter(c => 
        c.status === 'Closed' && 
        c.completion_date && 
        new Date(c.completion_date) <= new Date(c.due_date)
      ).length,
      overdue: capas.filter(c => 
        new Date(c.due_date) < new Date() && 
        !['Closed'].includes(c.status)
      ).length,
      avgResolutionTime: calculateAverageResolutionTime(capas),
      effectivenessRate: capas.filter(c => c.effectiveness_verified).length / capas.filter(c => c.status === 'Closed').length
    };

    // Store metrics for dashboard
    console.log('CAPA Performance Metrics:', metrics);
    
  } catch (error) {
    console.error('Error generating performance reports:', error);
  }
};

// Calculate average resolution time
const calculateAverageResolutionTime = (capas: any[]): number => {
  const completed = capas.filter(c => c.status === 'Closed' && c.completion_date);
  if (completed.length === 0) return 0;

  const totalDays = completed.reduce((sum, capa) => {
    const start = new Date(capa.created_at);
    const end = new Date(capa.completion_date);
    return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  }, 0);

  return Math.round(totalDays / completed.length);
};

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
