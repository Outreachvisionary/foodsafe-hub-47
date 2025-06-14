
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

      const { data, error } = await supabase.rpc(functionName as any, enhancedParams);

      if (error) {
        console.error(`RPC ${functionName} error:`, error);
        throw new Error(handleSupabaseError(error, `call ${functionName}`));
      }

      console.log(`RPC ${functionName} success:`, data);
      return data as T;
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
   * Get user roles
   */
  static async getUserRoles(userId?: string): Promise<any> {
    return this.callFunction('get_user_roles', {
      params: userId ? { _user_id: userId } : {},
    });
  }

  /**
   * Check if user has permission
   */
  static async hasPermission(
    permission: string,
    userId?: string,
    orgId?: string,
    facilityId?: string,
    departmentId?: string
  ): Promise<boolean> {
    return this.callFunction('has_permission', {
      params: {
        _user_id: userId,
        _permission: permission,
        _org_id: orgId,
        _facility_id: facilityId,
        _department_id: departmentId,
      },
    });
  }

  /**
   * Check if user has role
   */
  static async hasRole(
    roleName: string,
    userId?: string,
    orgId?: string,
    facilityId?: string,
    departmentId?: string
  ): Promise<boolean> {
    return this.callFunction('has_role', {
      params: {
        _user_id: userId,
        _role_name: roleName,
        _org_id: orgId,
        _facility_id: facilityId,
        _department_id: departmentId,
      },
    });
  }

  /**
   * Get facilities for user
   */
  static async getFacilities(organizationId?: string, onlyAssigned: boolean = false): Promise<any> {
    return this.callFunction('get_facilities', {
      params: {
        p_organization_id: organizationId,
        p_only_assigned: onlyAssigned,
      },
    });
  }

  /**
   * Get facility standards
   */
  static async getFacilityStandards(facilityId: string): Promise<any> {
    return this.callFunction('get_facility_standards', {
      params: {
        p_facility_id: facilityId,
      },
    });
  }

  /**
   * Update non-conformance status
   */
  static async updateNCStatus(
    ncId: string,
    newStatus: string,
    userId: string,
    comment?: string,
    prevStatus?: string
  ): Promise<any> {
    return this.callFunction('update_nc_status', {
      params: {
        nc_id: ncId,
        new_status: newStatus,
        user_id: userId,
        comment: comment || '',
        prev_status: prevStatus,
      },
    });
  }

  /**
   * Find product components for traceability
   */
  static async findProductComponents(productBatchLot: string): Promise<any> {
    return this.callFunction('find_product_components', {
      params: {
        product_batch_lot: productBatchLot,
      },
    });
  }

  /**
   * Find affected products by component
   */
  static async findAffectedProductsByComponent(componentBatchLot: string): Promise<any> {
    return this.callFunction('find_affected_products_by_component', {
      params: {
        component_batch_lot: componentBatchLot,
      },
    });
  }

  /**
   * Get related items
   */
  static async getRelatedItems(
    sourceId: string,
    sourceType: string,
    targetType: string
  ): Promise<any> {
    return this.callFunction('get_related_items', {
      params: {
        p_source_id: sourceId,
        p_source_type: sourceType,
        p_target_type: targetType,
      },
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
