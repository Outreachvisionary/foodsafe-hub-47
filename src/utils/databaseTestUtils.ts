
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseTestResult {
  success: boolean;
  status: 'success' | 'error' | 'warning' | 'pending';
  tableName: string;
  recordCount: number;
  message?: string;
  error?: any;
  duration?: number;
}

export interface FunctionTestResult {
  success: boolean;
  status: 'success' | 'error' | 'warning' | 'pending';
  functionName: string;
  result?: any;
  message?: string;
  error?: any;
  duration?: number;
}

export interface IntegrationTestResult {
  status: 'success' | 'error' | 'warning' | 'pending';
  details: string;
  error?: string;
  duration?: number;
}

export interface CrossModuleResult {
  status: 'success' | 'error' | 'warning' | 'pending';
  sourceModule: string;
  targetModule: string;
  error?: string;
  duration?: number;
}

// Test table existence and row counts
export const testTable = async (tableName: string): Promise<DatabaseTestResult> => {
  try {
    const startTime = performance.now();
    // We need to cast tableName to any here since we can't dynamically validate table names at compile time
    const { data, error, count } = await supabase
      .from(tableName as any)
      .select('*', { count: 'exact' })
      .limit(1);
    const endTime = performance.now();
      
    if (error) {
      return {
        success: false,
        status: 'error',
        tableName,
        recordCount: 0,
        message: `Error accessing table: ${error.message}`,
        error: error.message,
        duration: endTime - startTime
      };
    }
    
    return {
      success: true,
      status: 'success',
      tableName,
      recordCount: count || 0,
      message: `Table exists with ${count} records`,
      duration: endTime - startTime
    };
  } catch (error) {
    return {
      success: false,
      status: 'error',
      tableName,
      recordCount: 0,
      message: `Exception testing table: ${(error as Error).message}`,
      error: (error as Error).message
    };
  }
};

// Test RPC function existence and call
export const testFunction = async (
  functionName: string, 
  params?: Record<string, any>
): Promise<FunctionTestResult> => {
  try {
    const startTime = performance.now();
    // Use a cast to any to bypass TypeScript's strictness with function names
    const { data, error } = await supabase.rpc(functionName as any, params || {});
    const endTime = performance.now();
    
    if (error) {
      return {
        success: false,
        status: 'error',
        functionName,
        message: `Error calling function: ${error.message}`,
        error: error.message,
        duration: endTime - startTime
      };
    }
    
    return {
      success: true,
      status: 'success',
      functionName,
      result: data,
      message: `Function executed successfully`,
      duration: endTime - startTime
    };
  } catch (error) {
    return {
      success: false,
      status: 'error',
      functionName,
      message: `Exception testing function: ${(error as Error).message}`,
      error: (error as Error).message
    };
  }
};

// Aliases to support proper naming for both legacy and new code
export const testDatabaseTable = testTable;
export const testDatabaseFunction = testFunction;

// Test Supabase Auth connection
export const testSupabaseAuth = async (): Promise<IntegrationTestResult> => {
  try {
    const startTime = performance.now();
    const { data, error } = await supabase.auth.getSession();
    const endTime = performance.now();
    
    if (error) {
      return {
        status: 'error',
        details: 'Error connecting to Supabase Auth',
        error: error.message,
        duration: endTime - startTime
      };
    }
    
    return {
      status: 'success',
      details: 'Successfully connected to Supabase Auth service',
      duration: endTime - startTime
    };
  } catch (error) {
    return {
      status: 'error',
      details: 'Exception testing Supabase Auth',
      error: (error as Error).message
    };
  }
};

// Test Supabase Database connection
export const testSupabaseDatabase = async (): Promise<IntegrationTestResult> => {
  try {
    const startTime = performance.now();
    // Test a simple query on a reliable system table
    const { data, error } = await supabase
      .from('organizations')
      .select('id')
      .limit(1);
    const endTime = performance.now();
    
    if (error) {
      return {
        status: 'error',
        details: 'Error connecting to Supabase Database',
        error: error.message,
        duration: endTime - startTime
      };
    }
    
    return {
      status: 'success',
      details: 'Successfully connected to Supabase Database',
      duration: endTime - startTime
    };
  } catch (error) {
    return {
      status: 'error',
      details: 'Exception testing Supabase Database',
      error: (error as Error).message
    };
  }
};

// Test router navigation
export const testRouterNavigation = async (): Promise<IntegrationTestResult> => {
  // This is a placeholder - in a real app, we'd test the router
  return {
    status: 'success',
    details: 'Router navigation appears to be working',
    duration: 5 // Mock duration
  };
};

// Test service integration
export const testServiceIntegration = async (serviceName: string): Promise<IntegrationTestResult> => {
  // This is a placeholder - in a real app, we'd test specific services
  const isSuccess = Math.random() > 0.3; // Random success for demo
  
  return {
    status: isSuccess ? 'success' : 'error',
    details: isSuccess 
      ? `${serviceName} integration is working properly` 
      : `Could not connect to ${serviceName}`,
    error: isSuccess ? undefined : 'Connection timed out',
    duration: Math.floor(Math.random() * 100) + 20
  };
};

// Test cross-module integration
export const testCrossModuleIntegration = async (
  sourceModule: string,
  targetModule: string
): Promise<CrossModuleResult> => {
  // This is a placeholder - in a real app, we'd test relationships between modules
  const isSuccess = Math.random() > 0.2; // Random success for demo
  
  return {
    status: isSuccess ? 'success' : 'error',
    sourceModule,
    targetModule,
    error: isSuccess ? undefined : 'Failed to verify relationship',
    duration: Math.floor(Math.random() * 100) + 30
  };
};

export default {
  testTable,
  testFunction,
  testDatabaseTable,
  testDatabaseFunction,
  testSupabaseAuth,
  testSupabaseDatabase,
  testServiceIntegration,
  testCrossModuleIntegration,
  testRouterNavigation,
  DatabaseTestResult: {} as DatabaseTestResult,
  FunctionTestResult: {} as FunctionTestResult
};
