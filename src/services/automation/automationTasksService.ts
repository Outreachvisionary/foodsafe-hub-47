
import { supabase } from '@/integrations/supabase/client';

// Check for upcoming deadlines and send alerts
export const checkUpcomingDeadlines = async (): Promise<void> => {
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
export const processEffectivenessReviews = async (): Promise<void> => {
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
export const generatePerformanceReports = async (): Promise<void> => {
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
