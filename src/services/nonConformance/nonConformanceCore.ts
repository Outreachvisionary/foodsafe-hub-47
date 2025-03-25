
import { supabase } from '@/integrations/supabase/client';
import { NonConformance, NCFilter } from '@/types/non-conformance';
import { createNCNotification } from './notificationService';
import { createNCActivity } from './activityService';

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
  // Calculate quantity on hold if status is 'On Hold'
  const quantity_on_hold = nonConformance.status === 'On Hold' ? nonConformance.quantity || 0 : 0;
  
  // Include quantity_on_hold in the insert
  const { data, error } = await supabase
    .from('non_conformances')
    .insert({
      ...nonConformance,
      quantity_on_hold
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating non-conformance:', error);
    throw error;
  }
  
  // Create notification for new non-conformance
  if (nonConformance.assigned_to) {
    await createNCNotification({
      non_conformance_id: data.id,
      message: `New non-conformance item "${data.title}" has been assigned to you`,
      notification_type: 'assignment',
      target_users: [nonConformance.assigned_to]
    });
  }
  
  // Record activity
  await createNCActivity({
    non_conformance_id: data.id,
    action: 'Non-conformance created',
    performed_by: nonConformance.created_by
  });
  
  return data as NonConformance;
};

export const updateNonConformance = async (id: string, updates: Partial<NonConformance>): Promise<NonConformance> => {
  // If status is changing to 'On Hold', update quantity_on_hold
  if (updates.status === 'On Hold') {
    // Get current record to check quantity
    const { data: currentNC } = await supabase
      .from('non_conformances')
      .select('quantity')
      .eq('id', id)
      .single();
    
    if (currentNC) {
      // Use existing or updated quantity
      const quantity = updates.quantity !== undefined ? updates.quantity : (currentNC.quantity || 0);
      updates.quantity_on_hold = quantity;
    }
  } else if (updates.status === 'Released' || updates.status === 'Disposed') {
    // If releasing or disposing, set quantity_on_hold to 0
    updates.quantity_on_hold = 0;
  }
  
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

// Export the workflow service through this file too for easier access
export * from './workflowService';
