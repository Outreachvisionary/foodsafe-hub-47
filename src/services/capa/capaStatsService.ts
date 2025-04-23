
import { supabase } from '@/integrations/supabase/client';
import { CAPAStats, CAPAPriority, CAPASource } from '@/types/capa';
import { fetchCAPAs } from './capaFetchService';

export const getCAPAStats = async (): Promise<CAPAStats> => {
  try {
    const capas = await fetchCAPAs();
    
    // Initialize stats object
    const stats: CAPAStats = {
      total: capas.length,
      openCount: 0,
      closedCount: 0,
      overdueCount: 0,
      pendingVerificationCount: 0,
      byPriority: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
      byDepartment: {} as Record<string, number>,
    };
    
    // Initialize priority counts
    const priorities: CAPAPriority[] = ['low', 'medium', 'high', 'critical'];
    priorities.forEach(priority => {
      stats.byPriority[priority] = 0;
    });
    
    // Initialize source counts
    const sources: CAPASource[] = ['audit', 'customer-complaint', 'internal-qc', 'supplier-issue', 'other'];
    sources.forEach(source => {
      stats.bySource[source] = 0;
    });
    
    // Process each CAPA for statistics
    capas.forEach(capa => {
      // Count by status
      if (capa.status.toLowerCase() === 'open') {
        stats.openCount++;
      } else if (capa.status.toLowerCase() === 'closed' || capa.status.toLowerCase() === 'verified') {
        stats.closedCount++;
      } else if (capa.status.toLowerCase() === 'overdue') {
        stats.overdueCount++;
      } else if (capa.status.toLowerCase().includes('verification')) {
        stats.pendingVerificationCount++;
      }
      
      // Count by priority
      const priority = capa.priority.toLowerCase() as CAPAPriority;
      if (!stats.byPriority[priority]) {
        stats.byPriority[priority] = 0;
      }
      stats.byPriority[priority]++;
      
      // Count by source
      const source = capa.source as CAPASource;
      if (!stats.bySource[source]) {
        stats.bySource[source] = 0;
      }
      stats.bySource[source]++;
      
      // Count by department
      if (capa.department) {
        if (!stats.byDepartment![capa.department]) {
          stats.byDepartment![capa.department] = 0;
        }
        stats.byDepartment![capa.department]++;
      }
    });
    
    // Calculate effectiveness rate
    const verifiedCapas = capas.filter(capa => capa.effectivenessVerified === true);
    stats.effectivenessRate = verifiedCapas.length > 0
      ? (verifiedCapas.filter(capa => capa.effectivenessRating?.toLowerCase().includes('effective')).length / verifiedCapas.length) * 100
      : 0;
    
    return stats;
  } catch (error) {
    console.error('Error getting CAPA statistics:', error);
    // Return default empty stats on error
    return {
      total: 0,
      openCount: 0,
      closedCount: 0,
      overdueCount: 0,
      pendingVerificationCount: 0,
      byPriority: {},
      bySource: {}
    };
  }
};
