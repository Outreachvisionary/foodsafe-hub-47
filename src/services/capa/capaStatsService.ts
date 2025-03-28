
import { supabase } from '@/integrations/supabase/client';
import { CAPAStats, CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessMetrics } from '@/types/capa';
import { mapStatusFromDb, isOverdue } from './capaStatusService';

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
  let totalClosureDays = 0;
  let closedCount = 0;
  
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

    // Count overdue items
    if (
      (statusKey === 'open' || statusKey === 'in-progress') && 
      item.due_date && 
      item.due_date < today
    ) {
      stats.overdue++;
    }
    
    // Calculate closure time for closed items
    if ((statusKey === 'closed' || statusKey === 'verified') && item.created_at && item.completion_date) {
      const createdDate = new Date(item.created_at);
      const completedDate = new Date(item.completion_date);
      const daysToClose = Math.floor((completedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      
      totalClosureDays += daysToClose;
      closedCount++;
    }
  });
  
  // Calculate average closure time
  stats.averageClosureTime = closedCount > 0 ? Math.round(totalClosureDays / closedCount) : 0;

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
    .or('status.eq.Closed,status.eq.Pending Verification');

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

  // Calculate distribution by department (based on assigned_to field currently)
  const departmentCounts: Record<string, number> = {};
  data.forEach(capa => {
    if (capa.assigned_to) {
      departmentCounts[capa.assigned_to] = (departmentCounts[capa.assigned_to] || 0) + 1;
    }
  });

  return {
    averageTimeToClose,
    departmentDistribution: departmentCounts,
    totalClosed: data.length,
    closedWithRootCause: data.filter(capa => capa.root_cause && capa.root_cause.trim() !== '').length,
    closedWithVerification: data.filter(capa => capa.verification_date).length
  };
};

/**
 * Save CAPA effectiveness metrics
 */
export const saveEffectivenessMetrics = async (
  capaId: string, 
  metrics: CAPAEffectivenessMetrics
): Promise<void> => {
  try {
    // First update the CAPA record with effectiveness metrics
    const { error } = await supabase
      .from('capa_actions')
      .update({
        effectiveness_criteria: JSON.stringify(metrics),
        effectiveness_verified: metrics.score >= 85, // Mark as verified if score is above threshold
      })
      .eq('id', capaId);
    
    if (error) {
      console.error('Error saving effectiveness metrics:', error);
      throw error;
    }
    
  } catch (err) {
    console.error('Error in saveEffectivenessMetrics function:', err);
    throw err;
  }
};

/**
 * Retrieve CAPA effectiveness metrics
 */
export const getEffectivenessMetrics = async (capaId: string): Promise<CAPAEffectivenessMetrics | null> => {
  try {
    // Fetch CAPA data
    const { data, error } = await supabase
      .from('capa_actions')
      .select('effectiveness_criteria')
      .eq('id', capaId)
      .single();
    
    if (error) {
      console.error('Error fetching effectiveness metrics:', error);
      return null;
    }
    
    if (data && data.effectiveness_criteria) {
      try {
        // Try to parse the JSON data
        if (typeof data.effectiveness_criteria === 'string') {
          return JSON.parse(data.effectiveness_criteria) as CAPAEffectivenessMetrics;
        } else {
          return data.effectiveness_criteria as CAPAEffectivenessMetrics;
        }
      } catch (parseError) {
        console.error('Error parsing effectiveness metrics:', parseError);
        return null;
      }
    }
    
    return null;
  } catch (err) {
    console.error('Error in getEffectivenessMetrics function:', err);
    return null;
  }
};

/**
 * Get potential CAPAs based on audit findings
 */
export const getPotentialCAPAs = async (): Promise<any[]> => {
  try {
    // Fetch critical and major audit findings that don't have a CAPA yet
    const { data: auditFindings, error: auditError } = await supabase
      .from('audit_findings')
      .select('*')
      .in('severity', ['Critical', 'Major'])
      .is('capa_id', null);
    
    if (auditError) {
      console.error('Error fetching audit findings:', auditError);
      return [];
    }
    
    // Fetch serious complaints that don't have a CAPA yet
    const { data: complaints, error: complaintsError } = await supabase
      .from('complaints')
      .select('*')
      .in('category', ['Product Quality', 'Foreign Material'])
      .is('capa_id', null);
    
    if (complaintsError) {
      console.error('Error fetching complaints:', complaintsError);
      return [];
    }
    
    // Format audit findings for potential CAPAs
    const auditCAPAs = auditFindings?.map(finding => ({
      id: finding.id,
      title: `Audit Finding: ${finding.description.substring(0, 50)}...`,
      description: finding.description,
      source: 'audit' as CAPASource,
      sourceId: finding.audit_id,
      date: finding.created_at,
      severity: finding.severity,
      confidence: finding.severity === 'Critical' ? 0.95 : 0.8
    })) || [];
    
    // Format complaints for potential CAPAs
    const complaintCAPAs = complaints?.map(complaint => ({
      id: complaint.id,
      title: `Customer Complaint: ${complaint.title}`,
      description: complaint.description,
      source: 'complaint' as CAPASource,
      sourceId: complaint.id,
      date: complaint.reported_date,
      severity: complaint.category === 'Product Quality' ? 'Critical' : 'Major',
      confidence: complaint.category === 'Product Quality' ? 0.9 : 0.75
    })) || [];
    
    return [...auditCAPAs, ...complaintCAPAs];
  } catch (err) {
    console.error('Error in getPotentialCAPAs function:', err);
    return [];
  }
};
