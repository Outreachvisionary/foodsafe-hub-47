
import { CAPAStats } from "@/types/capa";
import { supabase } from "@/integrations/supabase/client";

export const fetchCAPAStats = async (): Promise<CAPAStats> => {
  try {
    const { data, error } = await supabase.from('capa_actions').select('*');
    
    if (error) throw error;
    
    // Initialize stats object
    const stats: CAPAStats = {
      total: 0,
      openCount: 0,
      closedCount: 0,
      overdueCount: 0,
      pendingVerificationCount: 0,
      effectivenessRate: 0,
      byPriority: {},
      bySource: {},
      byDepartment: {} // Include the byDepartment property
    };
    
    if (!data || data.length === 0) {
      return stats;
    }
    
    // Set total count
    stats.total = data.length;
    
    // Count by status
    data.forEach((capa: any) => {
      // Count by status
      if (capa.status === 'Open') {
        stats.openCount++;
      } else if (capa.status === 'Closed') {
        stats.closedCount++;
      } else if (capa.status === 'Overdue') {
        stats.overdueCount++;
      } else if (capa.status === 'Pending Verification' || capa.status === 'Verified') {
        stats.pendingVerificationCount++;
      }
      
      // Count by priority
      if (!stats.byPriority[capa.priority]) {
        stats.byPriority[capa.priority] = 0;
      }
      stats.byPriority[capa.priority]++;
      
      // Count by source
      if (!stats.bySource[capa.source]) {
        stats.bySource[capa.source] = 0;
      }
      stats.bySource[capa.source]++;
      
      // Count by department
      if (capa.department) {
        if (!stats.byDepartment[capa.department]) {
          stats.byDepartment[capa.department] = 0;
        }
        stats.byDepartment[capa.department]++;
      }
    });
    
    // Calculate effectiveness rate (simplified example)
    const effectiveCount = data.filter((capa: any) => 
      capa.effectiveness_verified === true
    ).length;
    
    stats.effectivenessRate = stats.closedCount > 0 
      ? (effectiveCount / stats.closedCount) * 100 
      : 0;
    
    return stats;
    
  } catch (error) {
    console.error("Error fetching CAPA statistics:", error);
    throw error;
  }
};
