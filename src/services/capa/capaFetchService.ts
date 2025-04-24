
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAFilter, CAPAStatus, CAPAPriority, CAPASource, CAPAStats } from '@/types/capa';
import { mapDbStatusToInternal, mapInternalStatusToDb } from './capaStatusMapper';

export const fetchCAPAStats = async (): Promise<CAPAStats> => {
  try {
    // Get all CAPAs for statistics
    const { data: capas, error } = await supabase
      .from('capa_actions')
      .select('*');

    if (error) throw error;

    const total = capas.length;
    const openCount = capas.filter(capa => capa.status === 'Open').length;
    const closedCount = capas.filter(capa => capa.status === 'Closed').length;
    const overdueCount = capas.filter(capa => capa.status === 'Overdue').length;
    const pendingVerificationCount = capas.filter(capa => capa.status === 'Pending Verification').length;

    // Calculate effectiveness rate based on verified CAPAs
    const closedOrVerifiedCAPAs = capas.filter(capa => 
      capa.status === 'Closed' || capa.status === 'Verified');
    
    const effectivenessCAPAs = closedOrVerifiedCAPAs.filter(capa => {
      if (!capa.effectiveness_rating) return false;
      return capa.effectiveness_rating === 'Effective' || capa.effectiveness_rating === 'Highly_Effective';
    });

    const effectivenessRate = closedOrVerifiedCAPAs.length > 0
      ? Math.round((effectivenessCAPAs.length / closedOrVerifiedCAPAs.length) * 100)
      : 0;

    // Group by categories
    const byPriority = groupBy(capas, 'priority');
    const bySource = groupBy(capas, 'source');
    const byDepartment = groupBy(capas, 'department');

    return {
      total,
      openCount,
      closedCount,
      overdueCount,
      pendingVerificationCount,
      effectivenessRate,
      byPriority,
      bySource,
      byDepartment
    };
  } catch (error) {
    console.error('Error fetching CAPA stats:', error);
    throw error;
  }
};

export const fetchCAPAs = async (filters?: CAPAFilter): Promise<CAPA[]> => {
  try {
    let query = supabase
      .from('capa_actions')
      .select('*');

    if (filters) {
      if (filters.status) {
        const dbStatus = mapInternalStatusToDb(filters.status);
        query = query.eq('status', dbStatus);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.source) {
        query = query.eq('source', filters.source);
      }
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }
      if (filters.dateRange) {
        if (filters.dateRange.start) {
          query = query.gte('created_at', filters.dateRange.start);
        }
        if (filters.dateRange.end) {
          query = query.lte('created_at', filters.dateRange.end);
        }
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // Map database records to application model
    return (data || []).map(item => mapDbCAPAToApp(item));
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    throw error;
  }
};

// Helper function to map database CAPA to application CAPA model
const mapDbCAPAToApp = (dbCapa: any): CAPA => {
  return {
    id: dbCapa.id,
    title: dbCapa.title,
    description: dbCapa.description,
    status: mapDbStatusToInternal(dbCapa.status),
    priority: dbCapa.priority as CAPAPriority,
    createdAt: dbCapa.created_at,
    dueDate: dbCapa.due_date,
    completionDate: dbCapa.completion_date,
    verificationDate: dbCapa.verification_date,
    assignedTo: dbCapa.assigned_to,
    createdBy: dbCapa.created_by,
    source: dbCapa.source as CAPASource,
    rootCause: dbCapa.root_cause,
    correctiveAction: dbCapa.corrective_action,
    preventiveAction: dbCapa.preventive_action,
    department: dbCapa.department,
    effectivenessRating: mapEffectivenessRating(dbCapa.effectiveness_rating),
    effectivenessCriteria: dbCapa.effectiveness_criteria,
    verificationMethod: dbCapa.verification_method,
    verifiedBy: dbCapa.verified_by,
    fsma204Compliant: dbCapa.fsma204_compliant,
    effectivenessVerified: dbCapa.effectiveness_verified,
    sourceId: dbCapa.source_id
  };
};

// Helper function to map database effectiveness rating to application model
const mapEffectivenessRating = (dbRating: string | null) => {
  if (!dbRating) return null;

  switch (dbRating) {
    case 'Highly Effective':
      return 'Highly_Effective';
    case 'Effective':
      return 'Effective';
    case 'Partially Effective':
      return 'Partially_Effective';
    case 'Not Effective':
      return 'Not_Effective';
    default:
      return 'Effective';
  }
};

// Helper function to group items by a property
const groupBy = (items: any[], key: string) => {
  return items.reduce((result: Record<string, number>, item) => {
    const value = item[key] || 'Unspecified';
    if (!result[value]) {
      result[value] = 0;
    }
    result[value]++;
    return result;
  }, {});
};

// Add a function to get potential CAPAs for AutoGeneratedCAPA component
export const getPotentialCAPAs = async (organizationId: string, userId: string) => {
  // This would normally fetch from the database, but we'll mock it for now
  return [
    {
      id: '1',
      title: 'Foreign Material in Production Line',
      description: 'Metal fragments found in product during routine inspection',
      source: 'Internal_QC' as CAPASource,
      sourceId: 'QC-2023-042',
      date: new Date().toISOString(),
      severity: 'Critical',
      confidence: 0.92
    },
    {
      id: '2',
      title: 'Temperature Deviation in Freezer Storage',
      description: 'Storage temperature exceeded critical limit for 3 hours',
      source: 'Audit' as CAPASource,
      sourceId: 'AUD-2023-015',
      date: new Date().toISOString(),
      severity: 'High',
      confidence: 0.87
    }
  ];
};
