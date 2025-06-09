
import { supabase } from '@/integrations/supabase/client';

export interface RouteTestConfig {
  route: string;
  description: string;
  expectedElements?: string[];
  requiredData?: string;
  testActions?: string[];
}

export const testRoutes: RouteTestConfig[] = [
  {
    route: '/dashboard',
    description: 'Dashboard page with metrics and charts',
    expectedElements: ['Overview Card', 'Recent Activities', 'Charts'],
    requiredData: 'metrics'
  },
  {
    route: '/documents',
    description: 'Document management system',
    expectedElements: ['Document List', 'Upload Button', 'Search'],
    requiredData: 'documents'
  },
  {
    route: '/capa',
    description: 'CAPA management module',
    expectedElements: ['CAPA List', 'Create Button', 'Status Filters'],
    requiredData: 'capa_actions'
  },
  {
    route: '/non-conformance',
    description: 'Non-conformance tracking',
    expectedElements: ['NC List', 'Create Form', 'Status Updates'],
    requiredData: 'non_conformances'
  },
  {
    route: '/audits',
    description: 'Audit management system',
    expectedElements: ['Audit Schedule', 'Findings', 'Reports'],
    requiredData: 'audits'
  },
  {
    route: '/training',
    description: 'Training management module',
    expectedElements: ['Training Sessions', 'Records', 'Assignments'],
    requiredData: 'training_sessions'
  },
  {
    route: '/suppliers',
    description: 'Supplier management system',
    expectedElements: ['Supplier List', 'Risk Assessment', 'Documents'],
    requiredData: 'suppliers'
  },
  {
    route: '/traceability',
    description: 'Product traceability system',
    expectedElements: ['Product Tree', 'Recall Simulation', 'Chain Links'],
    requiredData: 'products'
  }
];

export const validateRouteData = async (tableName: string): Promise<boolean> => {
  try {
    // Validate table exists by trying to select from it
    const validTables = [
      'audits', 'capa_actions', 'documents', 'training_sessions', 
      'haccp_plans', 'facilities', 'organizations', 'departments',
      'folders', 'document_versions', 'document_workflows', 'suppliers',
      'non_conformances', 'products', 'components'
    ];
    
    if (!validTables.includes(tableName)) {
      console.warn(`Table ${tableName} is not in the valid tables list`);
      return false;
    }

    const { error } = await supabase
      .from(tableName as any)
      .select('id')
      .limit(1);

    return !error;
  } catch (error) {
    console.error(`Error validating table ${tableName}:`, error);
    return false;
  }
};

export const runRouteTests = async (): Promise<{ passed: number; failed: number; results: any[] }> => {
  const results = [];
  let passed = 0;
  let failed = 0;

  for (const test of testRoutes) {
    try {
      const result = {
        route: test.route,
        description: test.description,
        status: 'unknown',
        dataValidation: false,
        error: null
      };

      // Test data validation if required
      if (test.requiredData) {
        const tableExists = await validateRouteData(test.requiredData);
        result.dataValidation = tableExists;
      } else {
        result.dataValidation = true;
      }

      // Basic route validation (simplified)
      result.status = result.dataValidation ? 'pass' : 'fail';
      
      if (result.status === 'pass') {
        passed++;
      } else {
        failed++;
      }

      results.push(result);
    } catch (error) {
      failed++;
      results.push({
        route: test.route,
        description: test.description,
        status: 'error',
        dataValidation: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return { passed, failed, results };
};

export const getRouteHealth = async (route: string): Promise<{
  healthy: boolean;
  issues: string[];
  recommendations: string[];
}> => {
  const issues: string[] = [];
  const recommendations: string[] = [];

  const testConfig = testRoutes.find(t => t.route === route);
  if (!testConfig) {
    issues.push('Route not found in test configuration');
    recommendations.push('Add route to test configuration');
    return { healthy: false, issues, recommendations };
  }

  // Validate required data
  if (testConfig.requiredData) {
    const isValid = await validateRouteData(testConfig.requiredData);
    if (!isValid) {
      issues.push(`Required data source "${testConfig.requiredData}" is not accessible`);
      recommendations.push(`Check database connectivity and table permissions for "${testConfig.requiredData}"`);
    }
  }

  const healthy = issues.length === 0;
  
  if (healthy) {
    recommendations.push('Route appears to be functioning correctly');
  }

  return { healthy, issues, recommendations };
};

// Add the missing functions that components are trying to import
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('organizations').select('id').limit(1);
    return !error;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};

export const testBackendIntegration = async (): Promise<{ status: string; tests: any[] }> => {
  const tests = [];
  
  for (const table of ['organizations', 'documents', 'audits']) {
    try {
      const { error } = await supabase.from(table as any).select('id').limit(1);
      tests.push({
        name: `${table} table access`,
        status: error ? 'failed' : 'passed',
        error: error?.message
      });
    } catch (error) {
      tests.push({
        name: `${table} table access`,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  const allPassed = tests.every(test => test.status === 'passed');
  
  return {
    status: allPassed ? 'passed' : 'failed',
    tests
  };
};

export default {
  testRoutes,
  validateRouteData,
  runRouteTests,
  getRouteHealth,
  testDatabaseConnection,
  testBackendIntegration
};
