
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating } from '@/types/capa';

export const createCAPA = async (capaData: Partial<CAPA>): Promise<CAPA> => {
  try {
    // Ensure proper casing for status
    const status = capaData.status?.charAt(0).toUpperCase() + capaData.status?.slice(1) as CAPAStatus;

    const { data, error } = await supabase
      .from('capas')
      .insert({
        ...capaData,
        status: status
      })
      .select('*')
      .single();

    if (error) throw error;
    return data as CAPA;
  } catch (error) {
    console.error('Error creating CAPA:', error);
    throw error;
  }
};

export const updateCAPA = async (id: string, capaData: Partial<CAPA>): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capas')
      .update(capaData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data as CAPA;
  } catch (error) {
    console.error('Error updating CAPA:', error);
    throw error;
  }
};

export const getCAPAs = async (filters?: any): Promise<CAPA[]> => {
  try {
    let query = supabase.from('capas').select('*');

    // Apply filters if provided
    if (filters) {
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.source) {
        query = query.eq('source', filters.source);
      }
      if (filters.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }
    }

    const { data, error } = await query.order('createdAt', { ascending: false });

    if (error) throw error;

    // Transform data to match our UI expectations
    return (data as any[]).map(item => ({
      ...item,
      id: item.id || '',
      title: item.title || '',
      description: item.description || '',
      status: item.status || 'Open',
      priority: item.priority || 'Medium',
      source: item.source || 'other',
      dueDate: item.due_date || new Date().toISOString(),
      createdAt: item.created_at || new Date().toISOString(),
      lastUpdated: item.updated_at || new Date().toISOString(),
      assignedTo: item.assigned_to || '',
      createdBy: item.created_by || 'System',
    })) as CAPA[];
  } catch (error) {
    console.error('Error getting CAPAs:', error);
    return [];
  }
};

export const getPotentialCAPAs = async (module: string, id: string): Promise<any[]> => {
  try {
    // This is a mock function to simulate getting potential CAPAs
    // In a real app, you would query an AI model or database
    return [
      {
        id: 'mock-potential-1',
        title: 'Potential issue identified in ' + module,
        description: 'AI identified a potential issue that may need a CAPA',
        source: module as CAPASource,
        sourceId: id,
        date: new Date().toISOString(),
        severity: 'major',
        confidence: 0.89
      }
    ];
  } catch (error) {
    console.error('Error getting potential CAPAs:', error);
    return [];
  }
};

export const deleteCAPA = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('capas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting CAPA:', error);
    throw error;
  }
};
