
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStats, CAPAFilter } from '@/types/capa';
import { CAPAStatus, CAPASource, CAPAPriority } from '@/types/enums';

export const getCAPAs = async (filter?: CAPAFilter): Promise<CAPA[]> => {
  try {
    let query = supabase.from('capa_actions').select('*');
    
    if (filter) {
      if (filter.status) {
        const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
        query = query.in('status', statuses);
      }
      
      if (filter.priority) {
        const priorities = Array.isArray(filter.priority) ? filter.priority : [filter.priority];
        query = query.in('priority', priorities);
      }
      
      if (filter.source) {
        const sources = Array.isArray(filter.source) ? filter.source : [filter.source];
        query = query.in('source', sources);
      }
      
      if (filter.searchTerm) {
        query = query.or(`title.ilike.%${filter.searchTerm}%,description.ilike.%${filter.searchTerm}%`);
      }
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      root_cause: item.root_cause,
      corrective_action: item.corrective_action,
      preventive_action: item.preventive_action,
      priority: item.priority as CAPAPriority,
      status: item.status as CAPAStatus,
      assigned_to: item.assigned_to,
      created_by: item.created_by,
      source: item.source as CAPASource,
      source_id: item.source_id,
      due_date: item.due_date,
      completion_date: item.completion_date,
      verification_date: item.verification_date,
      effectiveness_criteria: item.effectiveness_criteria,
      effectiveness_verified: item.effectiveness_verified,
      effectiveness_rating: item.effectiveness_rating,
      department: item.department,
      verification_method: item.verification_method,
      verified_by: item.verified_by,
      fsma204_compliant: item.fsma204_compliant,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    return [];
  }
};

export const getCAPAStats = async (): Promise<CAPAStats> => {
  try {
    const { data, error } = await supabase.from('capa_actions').select('*');
    
    if (error) throw error;
    
    const capas = data || [];
    const total = capas.length;
    const openCount = capas.filter(c => c.status === CAPAStatus.Open).length;
    const closedCount = capas.filter(c => c.status === CAPAStatus.Closed).length;
    const overdueCount = capas.filter(c => {
      const dueDate = new Date(c.due_date);
      const now = new Date();
      return dueDate < now && c.status !== CAPAStatus.Closed;
    }).length;
    const pendingVerificationCount = capas.filter(c => c.status === CAPAStatus.Pending_Verification).length;
    
    // Count by priority
    const byPriority = capas.reduce((acc, capa) => {
      const priority = capa.priority as CAPAPriority;
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<CAPAPriority, number>);
    
    // Count by source
    const bySource = capas.reduce((acc, capa) => {
      const source = capa.source as CAPASource;
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<CAPASource, number>);
    
    // Count by department
    const byDepartment = capas.reduce((acc, capa) => {
      const dept = capa.department || 'Unassigned';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Get recent activities
    const { data: activities } = await supabase
      .from('capa_activities')
      .select('*')
      .order('performed_at', { ascending: false })
      .limit(10);
    
    return {
      total,
      openCount,
      closedCount,
      overdueCount,
      pendingVerificationCount,
      byPriority,
      bySource,
      byDepartment,
      recentActivities: activities || []
    };
  } catch (error) {
    console.error('Error fetching CAPA stats:', error);
    return {
      total: 0,
      openCount: 0,
      closedCount: 0,
      overdueCount: 0,
      pendingVerificationCount: 0,
      byPriority: {} as Record<CAPAPriority, number>,
      bySource: {} as Record<CAPASource, number>,
      byDepartment: {},
      recentActivities: []
    };
  }
};
