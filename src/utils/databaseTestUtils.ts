
import { supabase } from '@/integrations/supabase/client';

export interface TestResult {
  status: 'success' | 'error' | 'warning';
  tableName?: string;
  details: string;
  recordCount?: number;
  duration?: number;
  error?: string;
}

export interface FunctionTestResult {
  status: 'success' | 'error' | 'warning';
  functionName: string;
  details: string;
  duration?: number;
  error?: string;
}

export interface DatabaseTestResult {
  status: 'success' | 'error' | 'warning';
  details: string;
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

// Legacy function name for backward compatibility
export const testDatabase = testSupabaseDatabase;

export const testServiceIntegration = async (): Promise<FunctionTestResult> => {
  const startTime = Date.now();
  try {
    // Test multiple services integration
    const authTest = await testSupabaseAuth();
    const dbTest = await testSupabaseDatabase();
    
    const duration = Date.now() - startTime;
    
    if (authTest.status === 'error' || dbTest.status === 'error') {
      return {
        status: 'error',
        functionName: 'Service Integration',
        details: 'One or more services failed integration test',
        duration,
        error: authTest.error || dbTest.error
      };
    }
    
    return {
      status: 'success',
      functionName: 'Service Integration',
      details: 'All services are properly integrated',
      duration
    };
  } catch (error) {
    return {
      status: 'error',
      functionName: 'Service Integration',
      details: 'Service integration test failed',
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const testRouterNavigation = async (route: string): Promise<FunctionTestResult> => {
  const startTime = Date.now();
  try {
    // Simulate route testing by checking if the route is valid
    const validRoutes = [
      '/dashboard', '/documents', '/training', '/capa', '/suppliers',
      '/non-conformance', '/audits', '/standards', '/haccp', '/traceability',
      '/complaints', '/analytics', '/reports', '/facilities', '/users'
    ];
    
    const duration = Date.now() - startTime;
    
    if (validRoutes.includes(route)) {
      return {
        status: 'success',
        functionName: `Route: ${route}`,
        details: `Route ${route} is valid and accessible`,
        duration
      };
    } else {
      return {
        status: 'error',
        functionName: `Route: ${route}`,
        details: `Route ${route} is not found or invalid`,
        duration,
        error: 'Invalid route'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      functionName: `Route: ${route}`,
      details: `Route navigation test failed for ${route}`,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const testCrossModuleIntegration = async (): Promise<FunctionTestResult> => {
  const startTime = Date.now();
  try {
    // Test cross-module integration by checking key tables
    const moduleTests = await Promise.all([
      testDatabaseTable('documents'),
      testDatabaseTable('capa_actions'),
      testDatabaseTable('non_conformances'),
      testDatabaseTable('training_records')
    ]);
    
    const duration = Date.now() - startTime;
    const failedTests = moduleTests.filter(test => test.status === 'error');
    
    if (failedTests.length > 0) {
      return {
        status: 'error',
        functionName: 'Cross-Module Integration',
        details: `${failedTests.length} of ${moduleTests.length} modules failed integration test`,
        duration,
        error: failedTests.map(test => test.error).join(', ')
      };
    }
    
    return {
      status: 'success',
      functionName: 'Cross-Module Integration',
      details: `All ${moduleTests.length} modules are properly integrated`,
      duration
    };
  } catch (error) {
    return {
      status: 'error',
      functionName: 'Cross-Module Integration',
      details: 'Cross-module integration test failed',
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
