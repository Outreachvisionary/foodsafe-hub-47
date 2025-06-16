
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

export const getCAPAs = async (): Promise<CAPA[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Convert database records to CAPA objects with proper types
    const capas: CAPA[] = (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: stringToCAPAStatus(item.status),
      priority: stringToCAPAPriority(item.priority),
      source: stringToCAPASource(item.source),
      source_id: item.source_id,
      assigned_to: item.assigned_to,
      created_by: item.created_by,
      created_at: item.created_at,
      updated_at: item.updated_at,
      due_date: item.due_date,
      completion_date: item.completion_date,
      root_cause: item.root_cause,
      corrective_action: item.corrective_action,
      preventive_action: item.preventive_action,
      effectiveness_criteria: item.effectiveness_criteria,
      department: item.department,
      fsma204_compliant: item.fsma204_compliant,
      effectiveness_verified: item.effectiveness_verified,
      effectiveness_rating: item.effectiveness_rating ? stringToEffectivenessRating(item.effectiveness_rating) : undefined,
      verification_date: item.verification_date,
      verification_method: item.verification_method,
      verified_by: item.verified_by,
    }));
    
    return capas;
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    throw error;
  }
};

export const createCAPA = async (capaData: Partial<CAPA>): Promise<CAPA> => {
  try {
    // Convert enum types to database strings
    const dbData: any = {
      ...capaData,
      status: capaData.status ? capaStatusToDbString(capaData.status) : 'Open',
      priority: capaData.priority ? capaPriorityToDbString(capaData.priority) : 'Medium',
      source: capaData.source ? capaSourceToDbString(capaData.source) : 'Other',
      effectiveness_rating: capaData.effectiveness_rating ? effectivenessRatingToDbString(capaData.effectiveness_rating) : undefined,
    };

    const { data, error } = await supabase
      .from('capa_actions')
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    
    // Convert database record back to CAPA object
    const capa: CAPA = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: stringToCAPAStatus(data.status),
      priority: stringToCAPAPriority(data.priority),
      source: stringToCAPASource(data.source),
      source_id: data.source_id,
      assigned_to: data.assigned_to,
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at,
      due_date: data.due_date,
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
    };
    
    return capa;
  } catch (error) {
    console.error('Error creating CAPA:', error);
    throw error;
  }
};

export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA> => {
  try {
    // Convert enum types to database strings if they exist
    const dbUpdates: any = { ...updates };
    
    if (updates.status) {
      dbUpdates.status = capaStatusToDbString(updates.status);
    }
    if (updates.priority) {
      dbUpdates.priority = capaPriorityToDbString(updates.priority);
    }
    if (updates.source) {
      dbUpdates.source = capaSourceToDbString(updates.source);
    }
    if (updates.effectiveness_rating) {
      dbUpdates.effectiveness_rating = effectivenessRatingToDbString(updates.effectiveness_rating);
    }

    const { data, error } = await supabase
      .from('capa_actions')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Convert database record back to CAPA object
    const capa: CAPA = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: stringToCAPAStatus(data.status),
      priority: stringToCAPAPriority(data.priority),
      source: stringToCAPASource(data.source),
      source_id: data.source_id,
      assigned_to: data.assigned_to,
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at,
      due_date: data.due_date,
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
    };
    
    return capa;
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
    if (!data) return null;

    const capa: CAPA = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: stringToCAPAStatus(data.status),
      priority: stringToCAPAPriority(data.priority),
      source: stringToCAPASource(data.source),
      source_id: data.source_id,
      assigned_to: data.assigned_to,
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at,
      due_date: data.due_date,
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
    };
    
    return capa;
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
    
    // Convert database records to proper types
    const activities = (data || []).map(activity => ({
      id: activity.id,
      capa_id: activity.capa_id || capaId,
      action_type: activity.action_type,
      action_description: activity.action_description,
      performed_at: activity.performed_at || new Date().toISOString(),
      performed_by: activity.performed_by,
      old_status: activity.old_status ? stringToCAPAStatus(activity.old_status) : undefined,
      new_status: activity.new_status ? stringToCAPAStatus(activity.new_status) : undefined,
      metadata: activity.metadata as Record<string, any> || {},
    }));
    
    return activities;
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
      id: activity.id,
      capa_id: activity.capa_id || '',
      action_type: activity.action_type,
      action_description: activity.action_description,
      performed_at: activity.performed_at || new Date().toISOString(),
      performed_by: activity.performed_by,
      old_status: activity.old_status ? stringToCAPAStatus(activity.old_status) : undefined,
      new_status: activity.new_status ? stringToCAPAStatus(activity.new_status) : undefined,
      metadata: activity.metadata as Record<string, any> || {},
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
