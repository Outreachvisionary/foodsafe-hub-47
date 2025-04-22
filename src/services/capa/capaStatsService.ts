
import { fetchCAPAs } from './capaFetchService';
import { CAPA, CAPAEffectivenessMetrics, CAPAStats, CAPAStatus, CAPAEffectivenessRating, ExtendedCAPAEffectivenessRating } from '@/types/capa';

// Update the CAPA stats function to match the CAPAStats type
export const fetchCAPAStats = async (): Promise<CAPAStats> => {
  try {
    const capas = await fetchCAPAs();
    
    const stats: CAPAStats = {
      total: capas.length,
      openCount: 0,
      inProgressCount: 0,
      closedCount: 0,
      verifiedCount: 0,
      pendingVerificationCount: 0,
      overdueCount: 0,
      byStatus: [],
      byPriority: [],
      bySource: [],
      fsma204ComplianceRate: 0,
      effectivenessStats: {
        effective: 0,
        partiallyEffective: 0,
        ineffective: 0
      }
    };
    
    const today = new Date();
    let totalClosureTime = 0;
    let closedItemsCount = 0;
    let totalFSMACompliant = 0;
    
    // Create counters for statuses, priorities, and sources
    const statusCounts: Record<string, number> = {};
    const priorityCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};

    capas.forEach(capa => {
      // Count by status
      statusCounts[capa.status] = (statusCounts[capa.status] || 0) + 1;
      
      // Update individual status counts
      if (capa.status === 'open') stats.openCount++;
      if (capa.status === 'in-progress') stats.inProgressCount++;
      if (capa.status === 'closed') stats.closedCount++;
      if (capa.status === 'verified') stats.verifiedCount++;
      if (capa.status === 'pending-verification') stats.pendingVerificationCount++;

      // Count by priority
      priorityCounts[capa.priority] = (priorityCounts[capa.priority] || 0) + 1;

      // Count by source
      sourceCounts[capa.source] = (sourceCounts[capa.source] || 0) + 1;

      // Calculate overdue items
      if (new Date(capa.dueDate) < today && (capa.status !== 'closed' && capa.status !== 'verified')) {
        stats.overdueCount++;
      }

      // Calculate completion rates
      if (capa.completionDate) {
        const completionDate = new Date(capa.completionDate);
        const dueDate = new Date(capa.dueDate);
        const timeToClose = completionDate.getTime() - dueDate.getTime();
        totalClosureTime += timeToClose;
        closedItemsCount++;
      }

      // Calculate FSMA 204 compliance rate
      if (capa.isFsma204Compliant) {
        totalFSMACompliant++;
      }

      // Calculate effectiveness stats based on rating
      if (capa.effectivenessRating === 'excellent' || capa.effectivenessRating === 'good') {
        stats.effectivenessStats!.effective++;
      } else if (capa.effectivenessRating === 'fair') {
        stats.effectivenessStats!.partiallyEffective++;
      } else if (capa.effectivenessRating === 'poor' || capa.effectivenessRating === 'not-determined') {
        stats.effectivenessStats!.ineffective++;
      }
    });

    // Convert counters to array format for charts
    stats.byStatus = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    stats.byPriority = Object.entries(priorityCounts).map(([name, value]) => ({ name, value }));
    stats.bySource = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

    // Calculate average time to close
    if (closedItemsCount > 0) {
      const avgTimeToClose = totalClosureTime / closedItemsCount;
      stats.averageTimeToClose = avgTimeToClose;
      stats.averageClosureTime = avgTimeToClose / (1000 * 60 * 60 * 24); // Convert to days
    } else {
      stats.averageTimeToClose = 0;
      stats.averageClosureTime = 0;
    }

    // Calculate FSMA 204 compliance rate
    stats.fsma204ComplianceRate = (capas.length > 0) ? (totalFSMACompliant / capas.length) * 100 : 0;

    return stats;
  } catch (error) {
    console.error('Error in fetchCAPAStats:', error);
    throw error;
  }
};

// Fix the effectiveness metrics creation function
export const createEffectivenessAssessment = async (
  capaId: string,
  assessmentData: Partial<CAPAEffectivenessMetrics>
): Promise<CAPAEffectivenessMetrics> => {
  try {
    const metrics: CAPAEffectivenessMetrics = {
      score: assessmentData.score || 0,
      rootCauseEliminated: assessmentData.rootCauseEliminated || false,
      preventiveMeasuresImplemented: assessmentData.preventiveMeasuresImplemented || false,
      documentationComplete: assessmentData.documentationComplete || false,
      recurrenceCheck: assessmentData.recurrenceCheck || '',
      checkedDate: assessmentData.checkedDate || new Date().toISOString(),
      assessmentDate: assessmentData.assessmentDate,
      notes: assessmentData.notes,
      rating: assessmentData.rating
    };
    
    return metrics;
  } catch (error) {
    console.error('Error in createEffectivenessAssessment:', error);
    throw error;
  }
};
