
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError, getCurrentUserId } from '@/utils/supabaseHelpers';

export interface RpcOptions {
  params?: Record<string, any>;
  timeout?: number;
}

/**
 * Enhanced RPC service for calling database functions
 */
export class RpcService {
  /**
   * Call a database function with error handling
   */
  static async callFunction<T = any>(
    functionName: string, 
    options: RpcOptions = {}
  ): Promise<T> {
    try {
      const { params = {}, timeout = 30000 } = options;
      
      console.log(`Calling RPC function: ${functionName}`, params);
      
      // Add current user ID to params if not provided
      const userId = await getCurrentUserId();
      const enhancedParams = {
        ...params,
        ...(userId && !params.user_id && { user_id: userId }),
      };

      const { data, error } = await supabase.rpc(functionName, enhancedParams);

      if (error) {
        console.error(`RPC ${functionName} error:`, error);
        throw new Error(handleSupabaseError(error, `call ${functionName}`));
      }

      console.log(`RPC ${functionName} success:`, data);
      return data;
    } catch (error) {
      console.error(`Failed to call RPC ${functionName}:`, error);
      throw error;
    }
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<any> {
    return this.callFunction('get_dashboard_stats');
  }

  /**
   * Get user permissions
   */
  static async getUserPermissions(userId?: string): Promise<any> {
    return this.callFunction('get_user_permissions', {
      params: userId ? { user_id: userId } : {},
    });
  }

  /**
   * Bulk update records
   */
  static async bulkUpdateRecords(
    table: string,
    updates: Array<{ id: string; data: Record<string, any> }>
  ): Promise<any> {
    return this.callFunction('bulk_update_records', {
      params: {
        table_name: table,
        updates,
      },
    });
  }

  /**
   * Archive old records
   */
  static async archiveOldRecords(
    table: string,
    cutoffDate: string
  ): Promise<any> {
    return this.callFunction('archive_old_records', {
      params: {
        table_name: table,
        cutoff_date: cutoffDate,
      },
    });
  }

  /**
   * Generate compliance report
   */
  static async generateComplianceReport(
    startDate: string,
    endDate: string,
    modules?: string[]
  ): Promise<any> {
    return this.callFunction('generate_compliance_report', {
      params: {
        start_date: startDate,
        end_date: endDate,
        modules,
      },
    });
  }

  /**
   * Calculate KPI metrics
   */
  static async calculateKpiMetrics(
    kpiType: string,
    period: string
  ): Promise<any> {
    return this.callFunction('calculate_kpi_metrics', {
      params: {
        kpi_type: kpiType,
        period,
      },
    });
  }

  /**
   * Search across multiple tables
   */
  static async globalSearch(
    query: string,
    tables?: string[],
    limit: number = 50
  ): Promise<any> {
    return this.callFunction('global_search', {
      params: {
        search_query: query,
        tables,
        search_limit: limit,
      },
    });
  }
}

export default RpcService;
