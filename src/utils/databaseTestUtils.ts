
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseTestResult {
  success: boolean;
  tableName: string;
  recordCount: number;
  message?: string;
  error?: any;
}

export interface FunctionTestResult {
  success: boolean;
  functionName: string;
  result?: any;
  message?: string;
  error?: any;
}

// Test table existence and row counts
export const testTable = async (tableName: string): Promise<DatabaseTestResult> => {
  try {
    // We need to cast tableName to any here since we can't dynamically validate table names at compile time
    const { data, error, count } = await supabase
      .from(tableName as any)
      .select('*', { count: 'exact' })
      .limit(1);
      
    if (error) {
      return {
        success: false,
        tableName,
        recordCount: 0,
        message: `Error accessing table: ${error.message}`,
        error
      };
    }
    
    return {
      success: true,
      tableName,
      recordCount: count || 0,
      message: `Table exists with ${count} records`
    };
  } catch (error) {
    return {
      success: false,
      tableName,
      recordCount: 0,
      message: `Exception testing table: ${(error as Error).message}`,
      error
    };
  }
};

// Test RPC function existence and call
export const testFunction = async (
  functionName: string, 
  params?: Record<string, any>
): Promise<FunctionTestResult> => {
  try {
    const { data, error } = await supabase.rpc(functionName, params || {});
    
    if (error) {
      return {
        success: false,
        functionName,
        message: `Error calling function: ${error.message}`,
        error
      };
    }
    
    return {
      success: true,
      functionName,
      result: data,
      message: `Function executed successfully`
    };
  } catch (error) {
    return {
      success: false,
      functionName,
      message: `Exception testing function: ${(error as Error).message}`,
      error
    };
  }
};

export default {
  testTable,
  testFunction,
  DatabaseTestResult: {} as DatabaseTestResult,
  FunctionTestResult: {} as FunctionTestResult
};
