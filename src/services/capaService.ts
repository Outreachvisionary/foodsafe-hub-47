
import { supabase } from "@/integrations/supabase/client";
import { CAPA, CAPAActivity } from "@/types/capa";
import { CAPAStatus, CAPAPriority, CAPASource } from "@/types/enums";
import { convertToCAPAStatus, convertToCAPAPriority, convertToCAPASource } from "@/utils/typeAdapters";

// Get all CAPAs with optional filtering
export const getCAPAs = async (filters?: any): Promise<CAPA[]> => {
  try {
    let query = supabase.from('capas').select('*');

    if (filters) {
      // Apply filters if they exist
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          const statuses = filters.status.map((s: CAPAStatus) => s.toString().replace(/_/g, ' '));
          query = query.in('status', statuses);
        } else {
          query = query.eq('status', filters.status.toString().replace(/_/g, ' '));
        }
      }

      if (filters.priority) {
        if (Array.isArray(filters.priority)) {
          const priorities = filters.priority.map((p: CAPAPriority) => p.toString());
          query = query.in('priority', priorities);
        } else {
          query = query.eq('priority', filters.priority.toString());
        }
      }

      if (filters.source) {
        if (Array.isArray(filters.source)) {
          const sources = filters.source.map((s: CAPASource) => s.toString().replace(/_/g, ' '));
          query = query.in('source', sources);
        } else {
          query = query.eq('source', filters.source.toString().replace(/_/g, ' '));
        }
      }

      if (filters.department) {
        if (Array.isArray(filters.department)) {
          query = query.in('department', filters.department);
        } else {
          query = query.eq('department', filters.department);
        }
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

    // Order by most recent
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching CAPAs: ${error.message}`);
    }

    // Convert database records to CAPA type with proper enums
    return (data || []).map(item => ({
      ...item,
      status: convertToCAPAStatus(item.status),
      priority: convertToCAPAPriority(item.priority),
      source: convertToCAPASource(item.source)
    })) as CAPA[];
  } catch (error) {
    console.error('Error in getCAPAs:', error);
    return [];
  }
};

// Get a single CAPA by id
export const getCAPA = async (id: string): Promise<CAPA | null> => {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error fetching CAPA: ${error.message}`);
    }

    if (!data) return null;

    return {
      ...data,
      status: convertToCAPAStatus(data.status),
      priority: convertToCAPAPriority(data.priority),
      source: convertToCAPASource(data.source)
    } as CAPA;
  } catch (error) {
    console.error(`Error in getCAPA(${id}):`, error);
    return null;
  }
};

// Create a new CAPA
export const createCAPA = async (capaData: Partial<CAPA>): Promise<CAPA | null> => {
  try {
    // Format enum values for database storage
    const dbCapa = {
      ...capaData,
      status: capaData.status?.toString().replace(/_/g, ' '),
      priority: capaData.priority?.toString(),
      source: capaData.source?.toString().replace(/_/g, ' ')
    };

    const { data, error } = await supabase
      .from('capas')
      .insert([dbCapa])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating CAPA: ${error.message}`);
    }

    return {
      ...data,
      status: convertToCAPAStatus(data.status),
      priority: convertToCAPAPriority(data.priority),
      source: convertToCAPASource(data.source)
    } as CAPA;
  } catch (error) {
    console.error('Error in createCAPA:', error);
    return null;
  }
};

// Update an existing CAPA
export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA | null> => {
  try {
    // Format enum values for database storage
    const dbUpdates = {
      ...updates,
      status: updates.status?.toString().replace(/_/g, ' '),
      priority: updates.priority?.toString(),
      source: updates.source?.toString().replace(/_/g, ' ')
    };

    const { data, error } = await supabase
      .from('capas')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating CAPA: ${error.message}`);
    }

    return {
      ...data,
      status: convertToCAPAStatus(data.status),
      priority: convertToCAPAPriority(data.priority),
      source: convertToCAPASource(data.source)
    } as CAPA;
  } catch (error) {
    console.error(`Error in updateCAPA(${id}):`, error);
    return null;
  }
};

// Get CAPA activities for a specific CAPA
export const getCAPAActivities = async (capaId: string): Promise<CAPAActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_activities')
      .select('*')
      .eq('capa_id', capaId)
      .order('performed_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching CAPA activities: ${error.message}`);
    }

    return (data || []).map(item => ({
      ...item,
      old_status: item.old_status ? convertToCAPAStatus(item.old_status) : undefined,
      new_status: item.new_status ? convertToCAPAStatus(item.new_status) : undefined
    })) as CAPAActivity[];
  } catch (error) {
    console.error(`Error in getCAPAActivities(${capaId}):`, error);
    return [];
  }
};

// Get recent CAPAs for dashboard
export const getRecentCAPAs = async (limit: number = 5): Promise<CAPA[]> => {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Error fetching recent CAPAs: ${error.message}`);
    }

    return (data || []).map(item => ({
      ...item,
      status: convertToCAPAStatus(item.status),
      priority: convertToCAPAPriority(item.priority),
      source: convertToCAPASource(item.source)
    })) as CAPA[];
  } catch (error) {
    console.error('Error in getRecentCAPAs:', error);
    return [];
  }
};

export default {
  getCAPAs,
  getCAPA,
  createCAPA,
  updateCAPA,
  getCAPAActivities,
  getRecentCAPAs
};
