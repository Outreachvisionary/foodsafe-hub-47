
import { supabase } from '@/integrations/supabase/client';

export interface TestResult {
  status: 'success' | 'error' | 'warning';
  tableName?: string;
  details: string;
  recordCount?: number;
  duration?: number;
  error?: string;
}

export const testSupabaseDatabase = async (): Promise<TestResult> => {
  const startTime = Date.now();
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('count')
      .limit(1);
    
    const duration = Date.now() - startTime;
    
    if (error) {
      return {
        status: 'error',
        details: 'Database connection failed',
        duration,
        error: error.message
      };
    }
    
    return {
      status: 'success',
      details: 'Database connection successful',
      duration
    };
  } catch (error) {
    return {
      status: 'error',
      details: 'Database connection failed',
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const testSupabaseAuth = async (): Promise<TestResult> => {
  const startTime = Date.now();
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    const duration = Date.now() - startTime;
    
    if (error) {
      return {
        status: 'error',
        details: 'Auth system error',
        duration,
        error: error.message
      };
    }
    
    return {
      status: 'success',
      details: session ? 'User is authenticated' : 'Auth system working (no user)',
      duration
    };
  } catch (error) {
    return {
      status: 'error',
      details: 'Auth system failed',
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const testDatabaseTable = async (tableName: string): Promise<TestResult> => {
  const startTime = Date.now();
  try {
    const { data, error, count } = await supabase
      .from(tableName as any)
      .select('*', { count: 'exact' })
      .limit(5);
    
    const duration = Date.now() - startTime;
    
    if (error) {
      return {
        status: 'error',
        tableName,
        details: `Failed to access table: ${tableName}`,
        duration,
        error: error.message
      };
    }
    
    return {
      status: 'success',
      tableName,
      details: `Table access successful`,
      recordCount: count || 0,
      duration
    };
  } catch (error) {
    return {
      status: 'error',
      tableName,
      details: `Table test failed: ${tableName}`,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
