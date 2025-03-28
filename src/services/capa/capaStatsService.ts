
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
      traceability: 0,
      nonconformance: 0
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

  // Get effectiveness statistics
  const { data: effectivenessData, error: effectivenessError } = await supabase
    .from('capa_effectiveness_assessments')
    .select('*');

  if (!effectivenessError && effectivenessData) {
    let effective = 0;
    let partiallyEffective = 0;
    let notEffective = 0;

    effectivenessData.forEach(item => {
      if (item.rating === 'Effective') effective++;
      else if (item.rating === 'Partially Effective') partiallyEffective++;
      else if (item.rating === 'Not Effective') notEffective++;
    });

    stats.effectivenessRating = {
      effective,
      partiallyEffective,
      notEffective
    };
  }

  // Calculate FSMA 204 compliance rate
  const fsma204CompliantCount = data.filter(item => item.fsma204_compliant).length;
  stats.fsma204ComplianceRate = data.length > 0 ? Math.round((fsma204CompliantCount / data.length) * 100) : 0;

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

  // Calculate distribution by department (based on department field now)
  const departmentCounts: Record<string, number> = {};
  data.forEach(capa => {
    if (capa.department) {
      departmentCounts[capa.department] = (departmentCounts[capa.department] || 0) + 1;
    }
  });

  // Get related CAPAs with effectiveness assessments
  const { data: effectivenessData, error: effectivenessError } = await supabase
    .from('capa_effectiveness_assessments')
    .select('*');
  
  let effectivenessRate = 0;
  if (!effectivenessError && effectivenessData && effectivenessData.length > 0) {
    const effectiveCAPAs = effectivenessData.filter(item => item.rating === 'Effective').length;
    effectivenessRate = Math.round((effectiveCAPAs / effectivenessData.length) * 100);
  }

  return {
    averageTimeToClose,
    departmentDistribution: departmentCounts,
    totalClosed: data.length,
    effectivenessRate,
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
    const effectivenessRating = metrics.score >= 85 ? 'Effective' : 
                                metrics.score >= 60 ? 'Partially Effective' : 'Not Effective';
    
    // First check if an assessment already exists
    const { data: existingAssessment } = await supabase
      .from('capa_effectiveness_assessments')
      .select('id')
      .eq('capa_id', capaId)
      .single();
    
    if (existingAssessment) {
      // Update existing assessment
      const { error: updateError } = await supabase
        .from('capa_effectiveness_assessments')
        .update({
          root_cause_eliminated: metrics.rootCauseEliminated,
          preventive_measures_implemented: metrics.preventiveMeasuresImplemented,
          documentation_complete: metrics.documentationComplete,
          recurrence_check: metrics.recurrenceCheck,
          score: metrics.score,
          notes: metrics.notes,
          assessment_date: metrics.assessmentDate || new Date().toISOString(),
          rating: effectivenessRating
        })
        .eq('id', existingAssessment.id);
      
      if (updateError) throw updateError;
    } else {
      // Create new assessment
      const { error: insertError } = await supabase
        .from('capa_effectiveness_assessments')
        .insert({
          capa_id: capaId,
          root_cause_eliminated: metrics.rootCauseEliminated,
          preventive_measures_implemented: metrics.preventiveMeasuresImplemented,
          documentation_complete: metrics.documentationComplete,
          recurrence_check: metrics.recurrenceCheck,
          score: metrics.score,
          notes: metrics.notes,
          assessment_date: metrics.assessmentDate || new Date().toISOString(),
          created_by: (await supabase.auth.getUser()).data.user?.id || 'system',
          rating: effectivenessRating
        });
      
      if (insertError) throw insertError;
    }
    
    // Update the CAPA record with effectiveness rating
    const { error } = await supabase
      .from('capa_actions')
      .update({
        effectiveness_rating: effectivenessRating,
        effectiveness_criteria: JSON.stringify(metrics),
        effectiveness_verified: metrics.score >= 85, // Mark as verified if score is above threshold
      })
      .eq('id', capaId);
    
    if (error) throw error;
    
    // Add an activity record for this effectiveness assessment
    await supabase
      .from('capa_activities')
      .insert({
        capa_id: capaId,
        action_type: 'effectiveness_assessment',
        action_description: `Effectiveness assessed: ${effectivenessRating} (${metrics.score}%)`,
        performed_by: (await supabase.auth.getUser()).data.user?.id || 'system',
        metadata: { metrics }
      });
    
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
    // First try to get from the dedicated effectiveness table
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('capa_effectiveness_assessments')
      .select('*')
      .eq('capa_id', capaId)
      .single();
    
    if (!assessmentError && assessmentData) {
      return {
        rootCauseEliminated: assessmentData.root_cause_eliminated,
        preventiveMeasuresImplemented: assessmentData.preventive_measures_implemented,
        documentationComplete: assessmentData.documentation_complete,
        recurrenceCheck: assessmentData.recurrence_check as 'Passed' | 'Minor Issues' | 'Failed',
        score: assessmentData.score,
        notes: assessmentData.notes,
        assessmentDate: assessmentData.assessment_date
      };
    }
    
    // Fallback to checking the CAPA record itself
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
    
    // Fetch non-conformances that don't have a CAPA yet
    const { data: nonConformances, error: ncError } = await supabase
      .from('non_conformances')
      .select('*')
      .in('risk_level', ['High', 'Critical'])
      .is('capa_id', null);
      
    if (ncError) {
      console.error('Error fetching non-conformances:', ncError);
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
    
    // Format non-conformances for potential CAPAs
    const ncCAPAs = nonConformances?.map(nc => ({
      id: nc.id,
      title: `Non-Conformance: ${nc.title}`,
      description: nc.description || nc.reason_details || '',
      source: 'nonconformance' as CAPASource,
      sourceId: nc.id,
      date: nc.reported_date,
      severity: nc.risk_level === 'Critical' ? 'Critical' : 'Major',
      confidence: nc.risk_level === 'Critical' ? 0.95 : 0.85
    })) || [];
    
    return [...auditCAPAs, ...complaintCAPAs, ...ncCAPAs];
  } catch (err) {
    console.error('Error in getPotentialCAPAs function:', err);
    return [];
  }
};
