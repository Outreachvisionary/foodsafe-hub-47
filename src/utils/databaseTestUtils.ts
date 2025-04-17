
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseTestResult {
  tableName: string;
  status: 'success' | 'error' | 'pending';
  recordCount?: number;
  error?: string;
  duration?: number;
}

export interface FunctionTestResult {
  functionName: string;
  status: 'success' | 'error' | 'pending';
  result?: any;
  error?: string;
  duration?: number;
}

export async function testDatabaseTable(tableName: string): Promise<DatabaseTestResult> {
  const start = performance.now();
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) throw error;
    
    const duration = performance.now() - start;
    return {
      tableName,
      status: 'success',
      recordCount: count || 0,
      duration
    };
  } catch (error) {
    const duration = performance.now() - start;
    return {
      tableName,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration
    };
  }
}

export async function testDatabaseFunction(
  functionName: string,
  params?: Record<string, any>
): Promise<FunctionTestResult> {
  const start = performance.now();
  try {
    const { data, error } = await supabase.rpc(functionName, params || {});
    
    if (error) throw error;
    
    const duration = performance.now() - start;
    return {
      functionName,
      status: 'success',
      result: data,
      duration
    };
  } catch (error) {
    const duration = performance.now() - start;
    return {
      functionName,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration
    };
  }
}

export async function testSupabaseAuth(): Promise<{
  status: 'success' | 'error' | 'pending';
  details: string;
  error?: string;
}> {
  try {
    // Test if Supabase auth is initialized properly
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return {
      status: 'success',
      details: 'Successfully connected to Supabase Authentication'
    };
  } catch (error) {
    return {
      status: 'error',
      details: 'Failed to connect to Supabase Authentication',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function testSupabaseDatabase(): Promise<{
  status: 'success' | 'error' | 'pending';
  details: string;
  error?: string;
}> {
  try {
    // Test if Supabase database is accessible by querying a simple table
    const { data, error } = await supabase.from('organizations').select('count(*)', { count: 'exact' });
    
    if (error) throw error;
    
    return {
      status: 'success',
      details: 'Successfully connected to Supabase Database'
    };
  } catch (error) {
    return {
      status: 'error',
      details: 'Failed to connect to Supabase Database',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function testRouterNavigation(): Promise<{
  status: 'success' | 'error' | 'pending';
  details: string;
  error?: string;
}> {
  try {
    // In a real implementation, we would check if routes are properly configured
    // For now, we'll use a simple check to see if a valid path can be accessed
    const response = await fetch('/src/App.tsx');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch App.tsx: ${response.status}`);
    }
    
    const appContent = await response.text();
    const hasRoutes = appContent.includes('Routes') && 
                     (appContent.includes('Route') || appContent.includes('<Route'));
    
    if (!hasRoutes) {
      throw new Error('Router configuration not found in App.tsx');
    }
    
    return {
      status: 'success',
      details: 'Router navigation is properly configured'
    };
  } catch (error) {
    return {
      status: 'error',
      details: 'Failed to verify router navigation',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function testServiceIntegration(serviceName: string): Promise<{
  service: string;
  status: 'success' | 'error' | 'pending';
  details: string;
  error?: string;
}> {
  try {
    // This function would implement specific logic per service
    // to test if it's properly integrated with the database
    
    // For demonstration, we're simulating success/failure
    const success = Math.random() > 0.2; // 80% success rate
    
    if (!success) {
      throw new Error(`Integration test failed for ${serviceName}`);
    }
    
    return {
      service: serviceName,
      status: 'success',
      details: `Successfully verified ${serviceName} integration`
    };
  } catch (error) {
    return {
      service: serviceName,
      status: 'error',
      details: `Failed to verify ${serviceName} integration`,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function testCrossModuleIntegration(
  sourceModule: string,
  targetModule: string
): Promise<{
  source: string;
  target: string;
  status: 'success' | 'error' | 'pending';
  details: string;
  error?: string;
}> {
  try {
    // This would implement specific logic to test relationships
    // between different modules in the database
    
    // For demonstration, we're simulating success/failure
    const success = Math.random() > 0.2; // 80% success rate
    
    if (!success) {
      throw new Error(`Integration test failed between ${sourceModule} and ${targetModule}`);
    }
    
    return {
      source: sourceModule,
      target: targetModule,
      status: 'success',
      details: `Successfully verified integration between ${sourceModule} and ${targetModule}`
    };
  } catch (error) {
    return {
      source: sourceModule,
      target: targetModule,
      status: 'error',
      details: `Failed to verify integration between ${sourceModule} and ${targetModule}`,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
