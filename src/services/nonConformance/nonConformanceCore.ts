
import { supabase } from '@/integrations/supabase/client';
import { NonConformance, NCFilter } from '@/types/non-conformance';

// Non-Conformance CRUD operations
export const fetchNonConformances = async (filters?: NCFilter): Promise<NonConformance[]> => {
  let query = supabase
    .from('non_conformances')
    .select('*');
  
  // Apply filters if provided
  if (filters) {
    if (filters.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }
    
    if (filters.item_category && filters.item_category.length > 0) {
      query = query.in('item_category', filters.item_category);
    }
    
    if (filters.reason_category && filters.reason_category.length > 0) {
      query = query.in('reason_category', filters.reason_category);
    }
    
    if (filters.date_range) {
      if (filters.date_range.start) {
        query = query.gte('reported_date', filters.date_range.start);
      }
      if (filters.date_range.end) {
        query = query.lte('reported_date', filters.date_range.end);
      }
    }
    
    if (filters.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to);
    }
    
    if (filters.location) {
      query = query.eq('location', filters.location);
    }
    
    if (filters.department) {
      query = query.eq('department', filters.department);
    }
    
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,item_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching non-conformances:', error);
    throw error;
  }
  
  return data as NonConformance[];
};

export const fetchNonConformanceById = async (id: string): Promise<NonConformance> => {
  const { data, error } = await supabase
    .from('non_conformances')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching non-conformance with ID ${id}:`, error);
    throw error;
  }
  
  return data as NonConformance;
};

export const createNonConformance = async (nonConformance: Omit<NonConformance, 'id'>): Promise<NonConformance> => {
  const { data, error } = await supabase
    .from('non_conformances')
    .insert(nonConformance)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating non-conformance:', error);
    throw error;
  }
  
  return data as NonConformance;
};

export const updateNonConformance = async (id: string, updates: Partial<NonConformance>): Promise<NonConformance> => {
  const { data, error } = await supabase
    .from('non_conformances')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating non-conformance with ID ${id}:`, error);
    throw error;
  }
  
  return data as NonConformance;
};

export const deleteNonConformance = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('non_conformances')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting non-conformance with ID ${id}:`, error);
    throw error;
  }
};
