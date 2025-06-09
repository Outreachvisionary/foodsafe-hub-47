
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  status: 'success' | 'error' | 'warning';
  tableName?: string;
  details: string;
  recordCount?: number;
  duration?: number;
  error?: string;
}

export const testSupabaseDatabase = async (): Promise<TestResult> => {
  const startTime = performance.now();
  
  try {
    // Test basic connection with a simple query
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    const duration = performance.now() - startTime;
    
    if (error) {
      return {
        status: 'error',
        details: 'Database connection failed',
        error: error.message,
        duration
      };
    }
    
    return {
      status: 'success',
      details: 'Database connection successful',
      duration
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    return {
      status: 'error',
      details: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration
    };
  }
};

export const testSupabaseAuth = async (): Promise<TestResult> => {
  const startTime = performance.now();
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    const duration = performance.now() - startTime;
    
    if (error) {
      return {
        status: 'error',
        details: 'Auth connection failed',
        error: error.message,
        duration
      };
    }
    
    return {
      status: 'success',
      details: session ? `Auth connected - User: ${session.user.email}` : 'Auth connected - No active session',
      duration
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    return {
      status: 'error',
      details: 'Auth connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration
    };
  }
};

export const testDatabaseTable = async (tableName: string): Promise<TestResult> => {
  const startTime = performance.now();
  
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    const duration = performance.now() - startTime;
    
    if (error) {
      return {
        status: 'error',
        tableName,
        details: `Table '${tableName}' access failed`,
        error: error.message,
        duration
      };
    }
    
    return {
      status: 'success',
      tableName,
      details: `Table '${tableName}' accessible`,
      recordCount: count || 0,
      duration
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    return {
      status: 'error',
      tableName,
      details: `Table '${tableName}' access failed`,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration
    };
  }
};

export const testDatabaseFunction = async (functionName: string): Promise<TestResult> => {
  const startTime = performance.now();
  
  try {
    const { data, error } = await supabase.rpc(functionName);
    const duration = performance.now() - startTime;
    
    if (error) {
      return {
        status: 'error',
        details: `Function '${functionName}' failed`,
        error: error.message,
        duration
      };
    }
    
    return {
      status: 'success',
      details: `Function '${functionName}' executed successfully`,
      duration
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    return {
      status: 'error',
      details: `Function '${functionName}' failed`,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration
    };
  }
};
