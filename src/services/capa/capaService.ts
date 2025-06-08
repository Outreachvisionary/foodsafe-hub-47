
import { CAPA, CAPAStats } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource, EffectivenessRating } from '@/types/enums';
import { stringToCAPAPriority, stringToCAPASource, stringToCAPAStatus, stringToEffectivenessRating } from '@/utils/capaAdapters';
import { supabase } from '@/integrations/supabase/client';

// Mock CAPA stats for development
export const getCAPAStats = async (): Promise<CAPAStats> => {
  try {
    const { data, error } = await supabase.from('capa_actions').select('*');
    
    if (error) throw error;
    
    const capas = data || [];
    const total = capas.length;
    const open = capas.filter(c => c.status === 'Open').length;
    const openCount = open;
    const closed = capas.filter(c => c.status === 'Closed').length;
    const closedCount = closed;
    const completed = capas.filter(c => c.status === 'Closed').length;
    const inProgress = capas.filter(c => c.status === 'In Progress').length;
    const overdue = capas.filter(c => {
      const dueDate = new Date(c.due_date);
      const now = new Date();
      return dueDate < now && c.status !== 'Closed';
    }).length;
    const overdueCount = overdue;
    const pendingVerificationCount = capas.filter(c => c.status === 'Pending Verification').length;
    
    // Count by priority
    const byPriority = capas.reduce((acc, capa) => {
      const priority = stringToCAPAPriority(capa.priority);
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<CAPAPriority, number>);
    
    // Count by source
    const bySource = capas.reduce((acc, capa) => {
      const source = stringToCAPASource(capa.source);
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<CAPASource, number>);
    
    // Count by status
    const byStatus = capas.reduce((acc, capa) => {
      const status = stringToCAPAStatus(capa.status);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<CAPAStatus, number>);
    
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
    
    const mappedActivities = (activities || []).map(activity => ({
      ...activity,
      old_status: activity.old_status ? stringToCAPAStatus(activity.old_status) : undefined,
      new_status: activity.new_status ? stringToCAPAStatus(activity.new_status) : undefined,
      metadata: activity.metadata as Record<string, any> || {}
    }));
    
    return {
      total,
      open,
      openCount,
      closed,
      closedCount,
      completed,
      inProgress,
      overdue,
      overdueCount,
      pendingVerificationCount,
      byPriority,
      bySource,
      byStatus,
      byDepartment,
      completedThisMonth: 0,
      averageResolutionTime: 0,
      upcomingDueDates: [],
      recentActivities: mappedActivities
    };
  } catch (error) {
    console.error('Error fetching CAPA stats:', error);
    return {
      total: 0,
      open: 0,
      openCount: 0,
      closed: 0,
      closedCount: 0,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      overdueCount: 0,
      pendingVerificationCount: 0,
      byPriority: {} as Record<CAPAPriority, number>,
      bySource: {} as Record<CAPASource, number>,
      byStatus: {} as Record<CAPAStatus, number>,
      byDepartment: {},
      completedThisMonth: 0,
      averageResolutionTime: 0,
      upcomingDueDates: [],
      recentActivities: []
    };
  }
};

// Function to fetch a single CAPA
export const getCAPAById = async (id: string): Promise<CAPA | null> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: stringToCAPAStatus(data.status),
      priority: stringToCAPAPriority(data.priority),
      created_at: data.created_at,
      updated_at: data.updated_at,
      created_by: data.created_by,
      due_date: data.due_date,
      assigned_to: data.assigned_to,
      source: stringToCAPASource(data.source),
      source_id: data.source_id,
      completion_date: data.completion_date,
      root_cause: data.root_cause,
      corrective_action: data.corrective_action,
      preventive_action: data.preventive_action,
      effectiveness_criteria: data.effectiveness_criteria,
      department: data.department,
      fsma204_compliant: data.fsma204_compliant,
      effectiveness_verified: data.effectiveness_verified,
      effectiveness_rating: data.effectiveness_rating ? stringToEffectivenessRating(data.effectiveness_rating) : undefined,
      verification_date: data.verification_date,
      verification_method: data.verification_method,
      verified_by: data.verified_by,
    } as CAPA;
  } catch (error) {
    console.error('Error fetching CAPA by ID:', error);
    return null;
  }
};
