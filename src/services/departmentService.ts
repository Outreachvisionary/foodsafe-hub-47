
import { supabase } from '@/integrations/supabase/client';
import { Department } from '@/types/department';

export const fetchDepartments = async (
  organizationId?: string,
  facilityId?: string
): Promise<Department[]> => {
  try {
    let query = supabase.from('departments').select('*');
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    
    if (facilityId) {
      query = query.eq('facility_id', facilityId);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    
    return data as Department[];
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
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

export const createDepartment = async (department: Partial<Department>): Promise<Department> => {
  const { data, error } = await supabase
    .from('departments')
    .insert({
      name: department.name,
      description: department.description || null,
      organization_id: department.organization_id,
      facility_id: department.facility_id,
      parent_department_id: department.parent_department_id || null
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating department:', error);
    throw error;
  }
  
  return data as Department;
};

export const updateDepartment = async (id: string, updates: Partial<Department>): Promise<Department> => {
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
