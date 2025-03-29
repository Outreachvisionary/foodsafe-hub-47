
import { supabase } from '@/integrations/supabase/client';
import { Department } from '@/types/department';

export const fetchDepartments = async (
  organizationId?: string,
  facilityId?: string
): Promise<Department[]> => {
  if (!organizationId && !facilityId) {
    console.warn('fetchDepartments called without organizationId or facilityId');
    return [];
  }

  let query = supabase
    .from('departments')
    .select('*')
    .order('name');
  
  if (organizationId) {
    query = query.eq('organization_id', organizationId);
  }
  
  if (facilityId) {
    query = query.eq('facility_id', facilityId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
  
  return data as Department[];
};

export const fetchDepartmentById = async (id: string): Promise<Department> => {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching department:', error);
    throw error;
  }
  
  return data as Department;
};

export const createDepartment = async (department: Omit<Department, 'id'>): Promise<Department> => {
  // Ensure name is provided
  if (!department.name) {
    throw new Error('Department name is required');
  }

  const { data, error } = await supabase
    .from('departments')
    .insert(department)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating department:', error);
    throw error;
  }
  
  return data as Department;
};

export const updateDepartment = async (id: string, updates: Partial<Department>): Promise<Department> => {
  // Ensure name is not being removed
  if (updates.name === '') {
    throw new Error('Department name cannot be empty');
  }

  const { data, error } = await supabase
    .from('departments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating department:', error);
    throw error;
  }
  
  return data as Department;
};

export const deleteDepartment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('departments')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};
