
import { supabase } from '@/integrations/supabase/client';
import { CAPAStats, CAPAStatus, CAPAPriority, CAPASource } from '@/types/capa';
import { mapStatusFromDb } from './capaStatusService';

/**
 * Get CAPA statistics
 */
export const getCAPAStats = async (): Promise<CAPAStats> => {
  // Get all CAPAs for statistics
  const { data, error } = await supabase
    .from('capa_actions')
    .select('*');

  if (error) {
    console.error('Error fetching CAPA statistics:', error);
    throw error;
  }

  // Calculate statistics
  const today = new Date().toISOString().split('T')[0];
  const stats: CAPAStats = {
    total: data.length,
    byStatus: {
      open: 0,
      'in-progress': 0,
      closed: 0,
      verified: 0
    },
    byPriority: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    },
    bySource: {
      audit: 0,
      haccp: 0,
      supplier: 0,
      complaint: 0,
      traceability: 0
    },
    overdue: 0,
    averageClosureTime: 0,
    effectivenessRating: {
      effective: 0,
      partiallyEffective: 0,
      notEffective: 0
    },
    fsma204ComplianceRate: 0
  };

  // Process data
  data.forEach(item => {
    // Map database status to frontend status format
    const statusKey = mapStatusFromDb(item.status);
    if (stats.byStatus[statusKey] !== undefined) {
      stats.byStatus[statusKey]++;
    }

    // Count by priority
    if (stats.byPriority[item.priority as CAPAPriority] !== undefined) {
      stats.byPriority[item.priority as CAPAPriority]++;
    }

    // Count by source
    if (stats.bySource[item.source as CAPASource] !== undefined) {
      stats.bySource[item.source as CAPASource]++;
    }

    // Count overdue items - status is lowercase in DB, compare lowercase
    if (
      (statusKey === 'open' || statusKey === 'in-progress') && 
      item.due_date && 
      item.due_date < today
    ) {
      stats.overdue++;
    }
  });

  return stats;
};

/**
 * Calculate advanced CAPA metrics
 */
export const getAdvancedCAPAMetrics = async (): Promise<any> => {
  // Get all closed CAPAs
  const { data, error } = await supabase
    .from('capa_actions')
    .select('*')
    .or('status.eq.Closed,status.eq.Verified');

  if (error) {
    console.error('Error fetching closed CAPAs:', error);
    throw error;
  }

  // Calculate average time to close (in days)
  let totalDays = 0;
  let closedCount = 0;

  data.forEach(capa => {
    if (capa.created_at && capa.completion_date) {
      const createdDate = new Date(capa.created_at);
      const completedDate = new Date(capa.completion_date);
      const daysToClose = Math.floor((completedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      
      totalDays += daysToClose;
      closedCount++;
    }
  });

  const averageTimeToClose = closedCount > 0 ? totalDays / closedCount : 0;

  // Calculate distribution by department (dummy data since department is not in schema yet)
  const departmentDistribution = {
    'Quality': 35,
    'Production': 25,
    'Maintenance': 15,
    'Operations': 15,
    'Other': 10
  };

  return {
    averageTimeToClose,
    departmentDistribution,
    totalClosed: data.length,
    closedWithRootCause: data.filter(capa => capa.root_cause && capa.root_cause.trim() !== '').length,
    closedWithVerification: data.filter(capa => capa.verification_date).length
  };
};
