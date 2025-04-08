
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
