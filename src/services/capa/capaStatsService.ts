
import { CAPAStats } from "@/types/capa";
import { CAPAPriority, CAPASource } from "@/types/enums";
import { supabase } from "@/integrations/supabase/client";

export const fetchCAPAStats = async (): Promise<CAPAStats> => {
  try {
    const { data, error } = await supabase.from('capa_actions').select('*');
    
    if (error) throw error;
    
    // Initialize stats object with default values
    const stats: CAPAStats = {
      total: 0,
      open: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
      openCount: 0,
      closedCount: 0,
      overdueCount: 0,
      pendingVerificationCount: 0,
      effectivenessRate: 0,
      byStatus: {},
      byPriority: {
        [CAPAPriority.Low]: 0,
        [CAPAPriority.Medium]: 0,
        [CAPAPriority.High]: 0,
        [CAPAPriority.Critical]: 0
      },
      bySource: {
        [CAPASource.Audit]: 0,
        [CAPASource.CustomerComplaint]: 0,
        [CAPASource.InternalReport]: 0,
        [CAPASource.NonConformance]: 0,
        [CAPASource.RegulatoryInspection]: 0,
        [CAPASource.SupplierIssue]: 0,
        [CAPASource.Other]: 0
      },
      byMonth: {},
      byDepartment: {},
      recentActivities: [] // Added missing property
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
        stats.open++;
      } else if (capa.status === 'Closed') {
        stats.closedCount++;
      } else if (capa.status === 'Overdue') {
        stats.overdueCount++;
        stats.overdue++;
      } else if (capa.status === 'Pending Verification' || capa.status === 'Verified') {
        stats.pendingVerificationCount++;
      }
      
      // Count by priority
      if (capa.priority && stats.byPriority) {
        const priority = capa.priority as CAPAPriority;
        if (priority in stats.byPriority) {
          stats.byPriority[priority]++;
        }
      }
      
      // Count by source
      if (capa.source && stats.bySource) {
        const source = capa.source as CAPASource;
        if (source in stats.bySource) {
          stats.bySource[source]++;
        }
      }
      
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
