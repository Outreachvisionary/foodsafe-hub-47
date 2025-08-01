import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError, getCurrentUserId } from '@/utils/supabaseHelpers';

export interface CrudOptions {
  table: string;
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
  filters?: Record<string, any>;
  limit?: number;
  offset?: number;
}

export interface ExportOptions extends CrudOptions {
  format?: 'csv' | 'json';
  filename?: string;
}

export interface ImportOptions {
  table: string;
  data: any[];
  upsert?: boolean;
  conflictColumns?: string[];
}

/**
 * Generic CRUD service with improved error handling and RLS support
 */
export class CrudService {
  /**
   * Fetch records with filtering, sorting, and pagination
   */
  static async fetchRecords<T = any>(options: CrudOptions): Promise<T[]> {
    try {
      const { table, select = '*', orderBy, filters, limit, offset } = options;
      
      // Start with select to get the proper FilterBuilder type
      let query = supabase.from(table as any).select(select);

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              query = query.in(key, value);
            } else if (typeof value === 'string' && value.includes('%')) {
              query = query.ilike(key, value);
            } else {
              query = query.eq(key, value);
            }
          }
        });
      }

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }

      // Apply pagination
      if (limit) {
        query = query.limit(limit);
      }
      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Error fetching ${table}:`, error);
        throw new Error(handleSupabaseError(error, `fetch ${table}`));
      }

      return (data as T[]) || [];
    } catch (error) {
      console.error(`Failed to fetch ${options.table}:`, error);
      throw error;
    }
  }

  /**
   * Create a new record
   */
  static async createRecord<T = any>(
    table: string, 
    data: Partial<T>, 
    options?: { returning?: string }
  ): Promise<T> {
    try {
      const userId = await getCurrentUserId();
      
      // Add audit fields if not present
      const recordData = {
        ...data,
        ...(userId && !data.hasOwnProperty('created_by') && { created_by: userId }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: result, error } = await supabase
        .from(table as any)
        .insert(recordData)
        .select(options?.returning || '*')
        .single();

      if (error) {
        console.error(`Error creating ${table}:`, error);
        throw new Error(handleSupabaseError(error, `create ${table}`));
      }

      return result as T;
    } catch (error) {
      console.error(`Failed to create ${table}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing record
   */
  static async updateRecord<T = any>(
    table: string,
    id: string,
    updates: Partial<T>,
    options?: { returning?: string }
  ): Promise<T> {
    try {
      const userId = await getCurrentUserId();
      
      // Add audit fields
      const updateData = {
        ...updates,
        ...(userId && { updated_by: userId }),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(table as any)
        .update(updateData)
        .eq('id', id)
        .select(options?.returning || '*')
        .single();

      if (error) {
        console.error(`Error updating ${table}:`, error);
        throw new Error(handleSupabaseError(error, `update ${table}`));
      }

      return data as T;
    } catch (error) {
      console.error(`Failed to update ${table}:`, error);
      throw error;
    }
  }

  /**
   * Delete a record (soft delete by default)
   */
  static async deleteRecord(
    table: string, 
    id: string, 
    hardDelete: boolean = false
  ): Promise<boolean> {
    try {
      if (hardDelete) {
        const { error } = await supabase
          .from(table as any)
          .delete()
          .eq('id', id);

        if (error) {
          console.error(`Error deleting ${table}:`, error);
          throw new Error(handleSupabaseError(error, `delete ${table}`));
        }
      } else {
        // Soft delete
        const userId = await getCurrentUserId();
        const { error } = await supabase
          .from(table as any)
          .update({
            status: 'deleted',
            deleted_at: new Date().toISOString(),
            ...(userId && { deleted_by: userId }),
          })
          .eq('id', id);

        if (error) {
          console.error(`Error soft deleting ${table}:`, error);
          throw new Error(handleSupabaseError(error, `delete ${table}`));
        }
      }

      return true;
    } catch (error) {
      console.error(`Failed to delete ${table}:`, error);
      throw error;
    }
  }

  /**
   * Export records to CSV or JSON
   */
  static async exportRecords(options: ExportOptions): Promise<void> {
    try {
      const records = await this.fetchRecords(options);
      const { format = 'csv', filename } = options;
      
      if (format === 'csv') {
        this.downloadCSV(records, filename || `${options.table}_export.csv`);
      } else {
        this.downloadJSON(records, filename || `${options.table}_export.json`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  /**
   * Import records from data array
   */
  static async importRecords(options: ImportOptions): Promise<any[]> {
    try {
      const { table, data, upsert = false, conflictColumns = ['id'] } = options;
      const userId = await getCurrentUserId();

      // Add audit fields to all records
      const recordsWithAudit = data.map(record => ({
        ...record,
        ...(userId && !record.created_by && { created_by: userId }),
        created_at: record.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      let query = supabase.from(table as any);

      if (upsert) {
        const { data: result, error } = await query
          .upsert(recordsWithAudit, {
            onConflict: conflictColumns.join(','),
          })
          .select('*');

        if (error) {
          console.error(`Error importing to ${table}:`, error);
          throw new Error(handleSupabaseError(error, `import to ${table}`));
        }

        return result || [];
      } else {
        const { data: result, error } = await query
          .insert(recordsWithAudit)
          .select('*');

        if (error) {
          console.error(`Error importing to ${table}:`, error);
          throw new Error(handleSupabaseError(error, `import to ${table}`));
        }

        return result || [];
      }
    } catch (error) {
      console.error(`Failed to import to ${options.table}:`, error);
      throw error;
    }
  }

  /**
   * Bulk operations
   */
  static async bulkDelete(table: string, ids: string[], hardDelete: boolean = false): Promise<number> {
    try {
      if (hardDelete) {
        const { error, count } = await supabase
          .from(table as any)
          .delete({ count: 'exact' })
          .in('id', ids);

        if (error) throw error;
        return count || 0;
      } else {
        const userId = await getCurrentUserId();
        const { error, count } = await supabase
          .from(table as any)
          .update({
            status: 'deleted',
            deleted_at: new Date().toISOString(),
            ...(userId && { deleted_by: userId }),
          }, { count: 'exact' })
          .in('id', ids);

        if (error) throw error;
        return count || 0;
      }
    } catch (error) {
      console.error(`Failed to bulk delete from ${table}:`, error);
      throw error;
    }
  }

  static async bulkUpdate<T>(
    table: string, 
    updates: Array<{ id: string; data: Partial<T> }>
  ): Promise<any[]> {
    try {
      const userId = await getCurrentUserId();
      const results = [];

      for (const update of updates) {
        const updateData = {
          ...update.data,
          ...(userId && { updated_by: userId }),
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from(table as any)
          .update(updateData)
          .eq('id', update.id)
          .select('*')
          .single();

        if (error) throw error;
        results.push(data);
      }

      return results;
    } catch (error) {
      console.error(`Failed to bulk update ${table}:`, error);
      throw error;
    }
  }

  /**
   * Download data as CSV
   */
  private static downloadCSV(data: any[], filename: string): void {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Download data as JSON
   */
  private static downloadJSON(data: any[], filename: string): void {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}

export default CrudService;
