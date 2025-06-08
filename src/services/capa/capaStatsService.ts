
import { supabase } from '@/integrations/supabase/client';
import { CAPAStats } from '@/types/capa';
import { CAPAStatus, CAPASource, CAPAPriority } from '@/types/enums';

export const fetchCAPAStats = async (): Promise<CAPAStats> => {
  try {
    // Fetch all CAPA actions
    const { data: capas, error } = await supabase
      .from('capa_actions')
      .select('*');
    
    if (error) throw error;
    
    const actions = capas || [];
    
    // Initialize counters
    const stats: CAPAStats = {
      total: actions.length,
      byStatus: {} as Record<CAPAStatus, number>,
      bySource: {} as Record<CAPASource, number>,
      byPriority: {} as Record<CAPAPriority, number>,
      overdue: 0,
      completedThisMonth: 0,
      averageResolutionTime: 0,
      upcomingDueDates: []
    };
    
    // Initialize all enum values with 0
    Object.values(CAPAStatus).forEach(status => {
      stats.byStatus[status] = 0;
    });
    
    Object.values(CAPASource).forEach(source => {
      stats.bySource[source] = 0;
    });
    
    Object.values(CAPAPriority).forEach(priority => {
      stats.byPriority[priority] = 0;
    });
    
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    let totalResolutionTime = 0;
    let completedCount = 0;
    
    // Process each CAPA action
    actions.forEach(capa => {
      // Count by status
      const status = capa.status as CAPAStatus;
      if (stats.byStatus[status] !== undefined) {
        stats.byStatus[status]++;
      }
      
      // Count by source
      const source = capa.source as CAPASource;
      if (stats.bySource[source] !== undefined) {
        stats.bySource[source]++;
      }
      
      // Count by priority
      const priority = capa.priority as CAPAPriority;
      if (stats.byPriority[priority] !== undefined) {
        stats.byPriority[priority]++;
      }
      
      // Check if overdue
      if (capa.due_date && new Date(capa.due_date) < now && status !== CAPAStatus.Closed) {
        stats.overdue++;
      }
      
      // Count completed this month
      if (capa.completion_date && new Date(capa.completion_date) >= thisMonth) {
        stats.completedThisMonth++;
      }
      
      // Calculate resolution time for completed CAPAs
      if (capa.completion_date && capa.created_at) {
        const resolutionTime = new Date(capa.completion_date).getTime() - new Date(capa.created_at).getTime();
        totalResolutionTime += resolutionTime;
        completedCount++;
      }
      
      // Add to upcoming due dates (next 30 days)
      if (capa.due_date && status !== CAPAStatus.Closed) {
        const dueDate = new Date(capa.due_date);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        if (dueDate <= thirtyDaysFromNow && dueDate >= now) {
          stats.upcomingDueDates.push({
            id: capa.id,
            title: capa.title,
            due_date: capa.due_date,
            priority: capa.priority
          });
        }
      }
    });
    
    // Calculate average resolution time in days
    if (completedCount > 0) {
      stats.averageResolutionTime = Math.round(totalResolutionTime / completedCount / (1000 * 60 * 60 * 24));
    }
    
    // Sort upcoming due dates by date
    stats.upcomingDueDates.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    
    return stats;
  } catch (error) {
    console.error('Error fetching CAPA stats:', error);
    throw error;
  }
};

export default { fetchCAPAStats };
