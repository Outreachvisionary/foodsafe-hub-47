import { fetchCAPAs } from './capaFetchService';
import { CAPA, CAPAEffectivenessMetrics, CAPAStats, CAPAStatus } from '@/types/capa';

// Update the CAPA stats function to match the CAPAStats type
export const fetchCAPAStats = async (): Promise<CAPAStats> => {
  try {
    const capas = await fetchCAPAs();
    
    const stats: CAPAStats = {
      total: capas.length,
      byStatus: {},
      byPriority: {},
      bySource: {},
      overdue: 0,
      recentItems: capas.slice(0, 5),
      completionRates: {},
      effectivenessStats: {
        effective: 0,
        partiallyEffective: 0,
        ineffective: 0,
        notEvaluated: 0
      },
      averageTimeToClose: 0,
      averageClosureTime: 0,
      fsma204ComplianceRate: 0
    };
    
    const today = new Date();
    let totalClosureTime = 0;
    let closedItemsCount = 0;
    let totalFSMACompliant = 0;

    capas.forEach(capa => {
      // Count by status
      stats.byStatus[capa.status] = (stats.byStatus[capa.status] || 0) + 1;

      // Count by priority
      stats.byPriority[capa.priority] = (stats.byPriority[capa.priority] || 0) + 1;

      // Count by source
      stats.bySource[capa.source] = (stats.bySource[capa.source] || 0) + 1;

      // Calculate overdue items
      if (new Date(capa.dueDate) < today && capa.status !== 'Closed' && capa.status !== 'Verified') {
        stats.overdue++;
      }

      // Calculate completion rates
      if (capa.completedDate) {
        const completionDate = new Date(capa.completedDate);
        const dueDate = new Date(capa.dueDate);
        const timeToClose = completionDate.getTime() - dueDate.getTime();
        totalClosureTime += timeToClose;
        closedItemsCount++;
      }

      // Calculate FSMA 204 compliance rate
      if (capa.fsma204Compliant) {
        totalFSMACompliant++;
      }

      // Calculate effectiveness stats
      if (capa.effectivenessRating === 'Effective') {
        stats.effectivenessStats.effective++;
      } else if (capa.effectivenessRating === 'Partially Effective') {
        stats.effectivenessStats.partiallyEffective++;
      } else if (capa.effectivenessRating === 'Ineffective') {
        stats.effectivenessStats.ineffective++;
      } else {
        stats.effectivenessStats.notEvaluated++;
      }
    });

    // Calculate average time to close
    if (closedItemsCount > 0) {
      stats.averageTimeToClose = totalClosureTime / closedItemsCount;
      stats.averageClosureTime = stats.averageTimeToClose / (1000 * 60 * 60 * 24); // Convert to days
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
      rootCauseEliminated: assessmentData.rootCauseEliminated || false,
      preventiveMeasuresImplemented: assessmentData.preventiveMeasuresImplemented || false,
      documentationComplete: assessmentData.documentationComplete || false,
      recurrenceCheck: assessmentData.recurrenceCheck,
      score: assessmentData.score || 0,
      checkedDate: assessmentData.checkedDate || new Date().toISOString(),
      assessmentDate: assessmentData.assessmentDate,
      notes: assessmentData.notes
    };
    
    return metrics;
  } catch (error) {
    console.error('Error in createEffectivenessAssessment:', error);
    throw error;
  }
};
