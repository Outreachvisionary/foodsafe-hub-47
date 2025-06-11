
import { supabase } from '@/integrations/supabase/client';
import { Facility } from '@/types/facility';

/**
 * Centralized error handling for Supabase operations
 */
export const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Supabase ${operation} error:`, error);
  
  // Handle specific error types
  if (error?.code === 'PGRST116') {
    return 'No data found';
  }
  
  if (error?.code === '23505') {
    return 'This record already exists';
  }
  
  if (error?.code === '23503') {
    return 'Cannot delete this record as it is referenced by other data';
  }
  
  return error?.message || `${operation} failed`;
};

/**
 * Check if user is authenticated and return user ID
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    
    return user?.id || null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

/**
 * Fetch facilities from Supabase with error handling
 */
export const fetchFacilities = async (): Promise<Facility[]> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('status', 'active')
      .order('name');
    
    if (error) {
      console.error('Error fetching facilities:', handleSupabaseError(error, 'fetch facilities'));
      return [];
    }
    
    return data as Facility[];
  } catch (error) {
    console.error('Unexpected error fetching facilities:', error);
    return [];
  }
};

/**
 * Generic function to fetch data from any table with filtering
 */
export const fetchTableData = async <T>(
  tableName: string,
  options?: {
    select?: string;
    filters?: Array<{ column: string; operator: string; value: any }>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  }
): Promise<T[]> => {
  try {
    let query = supabase.from(tableName);
    
    // Apply select
    if (options?.select) {
      query = query.select(options.select);
    } else {
      query = query.select('*');
    }
    
    // Apply filters
    if (options?.filters) {
      options.filters.forEach(filter => {
        query = (query as any)[filter.operator](filter.column, filter.value);
      });
    }
    
    // Apply ordering
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending ?? true 
      });
    }
    
    // Apply limit
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching ${tableName}:`, handleSupabaseError(error, `fetch ${tableName}`));
      return [];
    }
    
    return data as T[];
  } catch (error) {
    console.error(`Unexpected error fetching ${tableName}:`, error);
    return [];
  }
};

/**
 * Generic function to insert data into any table
 */
export const insertTableData = async <T>(
  tableName: string,
  data: Partial<T>,
  options?: {
    select?: string;
    upsert?: boolean;
  }
): Promise<T | null> => {
  try {
    const userId = await getCurrentUserId();
    
    let query = supabase.from(tableName);
    
    // Add user ID if not provided and user is authenticated
    const insertData = {
      ...data,
      ...(userId && !data.hasOwnProperty('created_by') ? { created_by: userId } : {}),
      ...(userId && !data.hasOwnProperty('user_id') ? { user_id: userId } : {}),
    };
    
    if (options?.upsert) {
      query = query.upsert(insertData);
    } else {
      query = query.insert(insertData);
    }
    
    if (options?.select) {
      query = query.select(options.select);
    } else {
      query = query.select('*');
    }
    
    const { data: result, error } = await query.single();
    
    if (error) {
      console.error(`Error inserting into ${tableName}:`, handleSupabaseError(error, `insert ${tableName}`));
      return null;
    }
    
    return result as T;
  } catch (error) {
    console.error(`Unexpected error inserting into ${tableName}:`, error);
    return null;
  }
};

/**
 * Generic function to update data in any table
 */
export const updateTableData = async <T>(
  tableName: string,
  id: string,
  updates: Partial<T>,
  options?: {
    select?: string;
    idColumn?: string;
  }
): Promise<T | null> => {
  try {
    const idColumn = options?.idColumn || 'id';
    
    let query = supabase
      .from(tableName)
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq(idColumn, id);
    
    if (options?.select) {
      query = query.select(options.select);
    } else {
      query = query.select('*');
    }
    
    const { data, error } = await query.single();
    
    if (error) {
      console.error(`Error updating ${tableName}:`, handleSupabaseError(error, `update ${tableName}`));
      return null;
    }
    
    return data as T;
  } catch (error) {
    console.error(`Unexpected error updating ${tableName}:`, error);
    return null;
  }
};

/**
 * Generic function to delete data from any table
 */
export const deleteTableData = async (
  tableName: string,
  id: string,
  options?: {
    idColumn?: string;
    softDelete?: boolean;
  }
): Promise<boolean> => {
  try {
    const idColumn = options?.idColumn || 'id';
    
    let query;
    
    if (options?.softDelete) {
      // Soft delete by updating status
      query = supabase
        .from(tableName)
        .update({ 
          status: 'inactive',
          updated_at: new Date().toISOString(),
        })
        .eq(idColumn, id);
    } else {
      // Hard delete
      query = supabase
        .from(tableName)
        .delete()
        .eq(idColumn, id);
    }
    
    const { error } = await query;
    
    if (error) {
      console.error(`Error deleting from ${tableName}:`, handleSupabaseError(error, `delete ${tableName}`));
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Unexpected error deleting from ${tableName}:`, error);
    return false;
  }
};

export default {
  handleSupabaseError,
  getCurrentUserId,
  fetchFacilities,
  fetchTableData,
  insertTableData,
  updateTableData,
  deleteTableData,
};
