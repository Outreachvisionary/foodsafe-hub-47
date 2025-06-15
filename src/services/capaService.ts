
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStats, CAPAFilter, UpdateCAPARequest } from '@/types/capa';
import { CAPAStatus, CAPASource, CAPAPriority } from '@/types/enums';
import { stringToCAPAStatus, stringToCAPASource, stringToCAPAPriority, stringToEffectivenessRating, capaStatusToString, capaSourceToString, capaPriorityToString } from '@/utils/capaAdapters';

export const getCAPAs = async (filter?: CAPAFilter): Promise<CAPA[]> => {
  try {
    console.log('Fetching CAPAs from database...');
    let query = supabase.from('capa_actions').select('*');
    
    if (filter) {
      if (filter.status) {
        const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
        const statusStrings = statuses.map(s => capaStatusToString(s));
        query = query.in('status', statusStrings);
      }
      
      if (filter.priority) {
        const priorities = Array.isArray(filter.priority) ? filter.priority : [filter.priority];
        const priorityStrings = priorities.map(p => capaPriorityToString(p));
        query = query.in('priority', priorityStrings);
      }
      
      if (filter.source) {
        const sources = Array.isArray(filter.source) ? filter.source : [filter.source];
        const sourceStrings = sources.map(s => capaSourceToString(s));
        query = query.in('source', sourceStrings);
      }
      
      if (filter.searchTerm) {
        query = query.or(`title.ilike.%${filter.searchTerm}%,description.ilike.%${filter.searchTerm}%`);
      }
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Fetched CAPAs:', data?.length || 0);
    
    if (!data || data.length === 0) {
      console.log('No CAPAs found in database');
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      root_cause: item.root_cause,
      corrective_action: item.corrective_action,
      preventive_action: item.preventive_action,
      priority: stringToCAPAPriority(item.priority),
      status: stringToCAPAStatus(item.status),
      assigned_to: item.assigned_to,
      created_by: item.created_by,
      source: stringToCAPASource(item.source),
      source_id: item.source_id,
      due_date: item.due_date,
      completion_date: item.completion_date,
      verification_date: item.verification_date,
      effectiveness_criteria: item.effectiveness_criteria,
      effectiveness_verified: item.effectiveness_verified,
      effectiveness_rating: item.effectiveness_rating ? stringToEffectivenessRating(item.effectiveness_rating) : undefined,
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

export const getCAPA = async (id: string): Promise<CAPA | null> => {
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
      root_cause: data.root_cause,
      corrective_action: data.corrective_action,
      preventive_action: data.preventive_action,
      priority: stringToCAPAPriority(data.priority),
      status: stringToCAPAStatus(data.status),
      assigned_to: data.assigned_to,
      created_by: data.created_by,
      source: stringToCAPASource(data.source),
      source_id: data.source_id,
      due_date: data.due_date,
      completion_date: data.completion_date,
      verification_date: data.verification_date,
      effectiveness_criteria: data.effectiveness_criteria,
      effectiveness_verified: data.effectiveness_verified,
      effectiveness_rating: data.effectiveness_rating ? stringToEffectivenessRating(data.effectiveness_rating) : undefined,
      department: data.department,
      verification_method: data.verification_method,
      verified_by: data.verified_by,
      fsma204_compliant: data.fsma204_compliant,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error('Error fetching CAPA:', error);
    return null;
  }
};

export const updateCAPA = async (id: string, updates: Partial<UpdateCAPARequest>): Promise<CAPA> => {
  try {
    const dbUpdates: any = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    if (updates.status) {
      dbUpdates.status = capaStatusToString(updates.status);
    }
    if (updates.priority) {
      dbUpdates.priority = capaPriorityToString(updates.priority);
    }
    if (updates.effectiveness_rating) {
      dbUpdates.effectiveness_rating = updates.effectiveness_rating.toString();
    }
    
    const { data, error } = await supabase
      .from('capa_actions')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      root_cause: data.root_cause,
      corrective_action: data.corrective_action,
      preventive_action: data.preventive_action,
      priority: stringToCAPAPriority(data.priority),
      status: stringToCAPAStatus(data.status),
      assigned_to: data.assigned_to,
      created_by: data.created_by,
      source: stringToCAPASource(data.source),
      source_id: data.source_id,
      due_date: data.due_date,
      completion_date: data.completion_date,
      verification_date: data.verification_date,
      effectiveness_criteria: data.effectiveness_criteria,
      effectiveness_verified: data.effectiveness_verified,
      effectiveness_rating: data.effectiveness_rating ? stringToEffectivenessRating(data.effectiveness_rating) : undefined,
      department: data.department,
      verification_method: data.verification_method,
      verified_by: data.verified_by,
      fsma204_compliant: data.fsma204_compliant,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error('Error updating CAPA:', error);
    throw error;
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
    
    return (data || []).map(activity => ({
      ...activity,
      old_status: activity.old_status ? stringToCAPAStatus(activity.old_status) : undefined,
      new_status: activity.new_status ? stringToCAPAStatus(activity.new_status) : undefined,
      metadata: activity.metadata as Record<string, any> || {}
    }));
  } catch (error) {
    console.error('Error fetching CAPA activities:', error);
    return [];
  }
};

export const getCAPAStats = async (): Promise<CAPAStats> => {
  try {
    console.log('Fetching CAPA stats...');
    const { data, error } = await supabase.from('capa_actions').select('*');
    
    if (error) {
      console.error('Error fetching CAPA stats:', error);
      throw error;
    }
    
    const capas = data || [];
    console.log('CAPA stats data:', capas.length);
    
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
    
    const byPriority = capas.reduce((acc, capa) => {
      const priority = stringToCAPAPriority(capa.priority);
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<CAPAPriority, number>);
    
    const bySource = capas.reduce((acc, capa) => {
      const source = stringToCAPASource(capa.source);
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<CAPASource, number>);
    
    const byStatus = capas.reduce((acc, capa) => {
      const status = stringToCAPAStatus(capa.status);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<CAPAStatus, number>);
    
    const byDepartment = capas.reduce((acc, capa) => {
      const dept = capa.department || 'Unassigned';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
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

export const createCAPA = async (capaData: any): Promise<CAPA> => {
  try {
    const dbData = {
      ...capaData,
      status: capaStatusToString(capaData.status || CAPAStatus.Open),
      priority: capaPriorityToString(capaData.priority),
      source: capaSourceToString(capaData.source),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('capa_actions')
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      root_cause: data.root_cause,
      corrective_action: data.corrective_action,
      preventive_action: data.preventive_action,
      priority: stringToCAPAPriority(data.priority),
      status: stringToCAPAStatus(data.status),
      assigned_to: data.assigned_to,
      created_by: data.created_by,
      source: stringToCAPASource(data.source),
      source_id: data.source_id,
      due_date: data.due_date,
      completion_date: data.completion_date,
      verification_date: data.verification_date,
      effectiveness_criteria: data.effectiveness_criteria,
      effectiveness_verified: data.effectiveness_verified,
      effectiveness_rating: data.effectiveness_rating ? stringToEffectivenessRating(data.effectiveness_rating) : undefined,
      department: data.department,
      verification_method: data.verification_method,
      verified_by: data.verified_by,
      fsma204_compliant: data.fsma204_compliant,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error('Error creating CAPA:', error);
    throw error;
  }
};
