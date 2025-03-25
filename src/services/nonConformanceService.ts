// Assuming this file exists and has a method that's causing an error
// We need to modify the method that's causing the type error where a string is passed to a 'never' type

import { supabase } from '@/integrations/supabase/client';
import { NCActivity, NonConformance } from '@/types/non-conformance';

// Fetch Non-Conformance items
export const fetchNonConformances = async (): Promise<NonConformance[]> => {
  const { data, error } = await supabase
    .from('non_conformances')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching non-conformances:', error);
    throw error;
  }
  
  return data as NonConformance[];
};

// Fetch a single Non-Conformance by ID
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

// Create a new Non-Conformance
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

// Update a Non-Conformance
export const updateNonConformance = async (id: string, updates: Partial<NonConformance>): Promise<NonConformance> => {
  const { data, error } = await supabase
    .from('non_conformances')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating non-conformance with ID ${id}:`, error);
    throw error;
  }
  
  return data as NonConformance;
};

// Update Non-Conformance status with RPC function
export const updateNCStatus = async (
  ncId: string, 
  newStatus: string, 
  userId: string, 
  comment: string,
  prevStatus: string
): Promise<void> => {
  const { error } = await supabase.rpc('update_nc_status', {
    nc_id: ncId,
    new_status: newStatus,
    user_id: userId,
    comment: comment,
    prev_status: prevStatus
  });
  
  if (error) {
    console.error('Error updating NC status:', error);
    throw error;
  }
};

// Delete a Non-Conformance
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

// Fetch NC Activities
export const fetchNCActivities = async (nonConformanceId: string): Promise<NCActivity[]> => {
  const { data, error } = await supabase
    .from('nc_activities')
    .select('*')
    .eq('non_conformance_id', nonConformanceId)
    .order('performed_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching activities for NC ${nonConformanceId}:`, error);
    throw error;
  }
  
  return data as NCActivity[];
};

export const fetchNCAttachments = async (nonConformanceId: string) => {
  const { data, error } = await supabase
    .from('nc_attachments')
    .select('*')
    .eq('non_conformance_id', nonConformanceId);
  
  if (error) {
    console.error(`Error fetching attachments for NC ${nonConformanceId}:`, error);
    throw error;
  }
  
  return data;
};

// Use the proper type annotation to avoid 'never' type error
export const createNCActivity = async (activity: {
  non_conformance_id: string;
  action: string;
  comments?: string;
  performed_by: string;
  previous_status?: string;
  new_status?: string;
}) => {
  const { data, error } = await supabase
    .from('nc_activities')
    .insert(activity)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating NC activity:', error);
    throw error;
  }
  
  return data;
};
