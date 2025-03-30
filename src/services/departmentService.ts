
import { supabase } from '@/integrations/supabase/client';
import { Department } from '@/types/department';

export const fetchDepartments = async (
  organizationId?: string,
  facilityId?: string
): Promise<Department[]> => {
  try {
    console.log('Fetching departments for org:', organizationId, 'facility:', facilityId);
    let query = supabase.from('departments').select('*');
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    
    if (facilityId) {
      query = query.eq('facility_id', facilityId);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
      console.error('Error in departments query:', error);
      throw error;
    }
    
    console.log('Departments data retrieved:', data);
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
  try {
    console.log('Creating department with data:', department);
    
    // Ensure organization_id is set
    if (!department.organization_id) {
      throw new Error('Organization ID is required to create a department');
    }
    
    const { data, error } = await supabase
      .from('departments')
      .insert({
        name: department.name,
        description: department.description || null,
        organization_id: department.organization_id,
        facility_id: department.facility_id || null,
        parent_department_id: department.parent_department_id || null
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating department:', error);
      throw error;
    }
    
    console.log('Created department:', data);
    return data as Department;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

export const updateDepartment = async (id: string, updates: Partial<Department>): Promise<Department> => {
  try {
    console.log('Updating department:', id, 'with data:', updates);
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
    
    console.log('Updated department:', data);
    return data as Department;
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};

export const deleteDepartment = async (id: string): Promise<void> => {
  try {
    console.log('Deleting department:', id);
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting department:', error);
      throw error;
    }
    
    console.log('Department deleted successfully');
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};
