
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStats } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating } from '@/types/enums';
import { 
  stringToCAPAStatus, 
  stringToCAPAPriority, 
  stringToCAPASource, 
  stringToEffectivenessRating,
  capaStatusToDbString,
  capaPriorityToDbString,
  capaSourceToDbString,
  effectivenessRatingToDbString
} from '@/utils/capaAdapters';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string;
  created_by: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  source?: string;
  source_id?: string;
}

export const getCAPAs = async (): Promise<CAPA[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    throw error;
  }
};

export const createCAPA = async (capaData: Partial<CAPA>): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .insert(capaData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating CAPA:', error);
    throw error;
  }
};

export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA> => {
  try {
    const dbUpdates: any = { ...updates };
    
    // Convert enum types to database strings if they exist
    if (updates.status) {
      dbUpdates.status = updates.status;
    }
    if (updates.priority) {
      dbUpdates.priority = updates.priority;
    }
    if (updates.source) {
      dbUpdates.source = updates.source;
    }

    const { data, error } = await supabase
      .from('capa_actions')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating CAPA:', error);
    throw error;
  }
};

export const deleteCAPA = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('capa_actions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting CAPA:', error);
    throw error;
  }
};

export const getCAPA = async (id: string): Promise<CAPA | null> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching CAPA:', error);
    return null;
  }
};

export const getCAPAActivities = async (capaId: string) => {
  try {
    const { data, error } = await supabase
      .from('capa_activities')
      .select('*')
      .eq('capa_id', capaId)
      .order('performed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching CAPA activities:', error);
    return [];
  }
};

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
    const inProgress = capas.filter(c => c.status === 'In_Progress').length;
    const overdue = capas.filter(c => {
      const dueDate = new Date(c.due_date);
      const now = new Date();
      return dueDate < now && c.status !== 'Closed';
    }).length;
    const overdueCount = overdue;
    const pendingVerificationCount = capas.filter(c => c.status === 'Pending_Verification').length;
    
    // Count by priority
    const byPriority = capas.reduce((acc, capa) => {
      const priority = capa.priority;
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<CAPAPriority, number>);
    
    // Count by source
    const bySource = capas.reduce((acc, capa) => {
      const source = capa.source;
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<CAPASource, number>);
    
    // Count by status
    const byStatus = capas.reduce((acc, capa) => {
      const status = capa.status;
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
