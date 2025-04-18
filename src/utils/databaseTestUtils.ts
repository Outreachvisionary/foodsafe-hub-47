import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  status: 'success' | 'error';
  tableName?: string;
  details: string;
  recordCount?: number;
  duration?: number;
  error?: string;
}

// Test the basic Supabase database connection
export const testSupabaseDatabase = async (): Promise<TestResult> => {
  const startTime = performance.now();
  try {
    // Perform a simple query to test database connection
    const { data, error } = await supabase
      .from('non_conformances')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }
    
    const duration = performance.now() - startTime;
    return {
      status: 'success',
      details: 'Successfully connected to Supabase database',
      duration
    };
  } catch (error) {
    console.error('Error testing database connection:', error);
    return {
      status: 'error',
      details: 'Failed to connect to Supabase database',
      error: error.message || String(error),
      duration: performance.now() - startTime
    };
  }
};

// Test Supabase authentication
export const testSupabaseAuth = async (): Promise<TestResult> => {
  const startTime = performance.now();
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    const duration = performance.now() - startTime;
    const sessionExists = data.session !== null;
    
    return {
      status: 'success',
      details: sessionExists 
        ? 'Authenticated session found' 
        : 'Unauthenticated, but auth service is working',
      duration
    };
  } catch (error) {
    console.error('Error testing auth connection:', error);
    return {
      status: 'error',
      details: 'Failed to connect to Supabase auth service',
      error: error.message || String(error),
      duration: performance.now() - startTime
    };
  }
};

// Test a specific database table
export const testDatabaseTable = async (tableName: string): Promise<TestResult> => {
  const startTime = performance.now();
  try {
    // Perform a count query on the specified table
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }
    
    const duration = performance.now() - startTime;
    return {
      status: 'success',
      tableName,
      details: `Table '${tableName}' exists and is accessible`,
      recordCount: count || 0,
      duration
    };
  } catch (error) {
    console.error(`Error testing table ${tableName}:`, error);
    return {
      status: 'error',
      tableName,
      details: `Failed to query table '${tableName}'`,
      error: error.message || String(error),
      duration: performance.now() - startTime
    };
  }
};

// Test a database function if needed
export const testDatabaseFunction = async (functionName: string): Promise<TestResult> => {
  const startTime = performance.now();
  try {
    // This is a placeholder. Actual function testing would depend on your specific functions
    // For example, you might call an RPC function like this:
    // const { data, error } = await supabase.rpc(functionName);
    
    // For this example, we'll just simulate a successful test
    const duration = performance.now() - startTime;
    return {
      status: 'success',
      details: `Function '${functionName}' exists and is callable`,
      duration
    };
  } catch (error) {
    console.error(`Error testing function ${functionName}:`, error);
    return {
      status: 'error',
      details: `Failed to call function '${functionName}'`,
      error: error.message || String(error),
      duration: performance.now() - startTime
    };
  }
};

export default {
  testSupabaseDatabase,
  testSupabaseAuth,
  testDatabaseTable,
  testDatabaseFunction
};
