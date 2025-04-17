
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Type definitions
export interface TestResultDetail {
  name: string;
  status: 'success' | 'error' | 'partial' | 'pending';
  message: string;
  responseTime?: number;
  errorDetails?: string;
  actionRequired?: string;
}

export interface ModuleTestResult {
  moduleName: string;
  status: 'success' | 'error' | 'partial' | 'pending';
  timestamp: Date;
  details: TestResultDetail[];
}

interface ModuleConfig {
  moduleName: string;
  enabled: boolean;
  tests: (() => Promise<TestResultDetail>)[];
}

export const useBackendFrontendTesting = () => {
  const [results, setResults] = useState<ModuleTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeModules, setActiveModules] = useState<ModuleConfig[]>([
    {
      moduleName: 'Authentication',
      enabled: true,
      tests: [
        testAuthenticationSession,
        testUserRoles
      ]
    },
    {
      moduleName: 'Database',
      enabled: true,
      tests: [
        testDatabaseConnection,
        testTableAccess
      ]
    },
    {
      moduleName: 'Organizations',
      enabled: true,
      tests: [
        testOrganizationsFetch
      ]
    },
    {
      moduleName: 'Facilities',
      enabled: true,
      tests: [
        testFacilitiesFetch
      ]
    },
    {
      moduleName: 'Documents',
      enabled: true,
      tests: [
        testDocumentsFetch
      ]
    },
    {
      moduleName: 'CAPA',
      enabled: true,
      tests: [
        testCAPAFetch
      ]
    },
    {
      moduleName: 'Non-Conformance',
      enabled: true,
      tests: [
        testNonConformanceFetch
      ]
    },
    {
      moduleName: 'Integration',
      enabled: true,
      tests: [
        testModuleRelationships
      ]
    }
  ]);

  // Toggle module selection
  const toggleModule = (moduleName: string) => {
    setActiveModules(prevModules => 
      prevModules.map(module => 
        module.moduleName === moduleName 
          ? { ...module, enabled: !module.enabled } 
          : module
      )
    );
  };

  // Reset test results
  const resetResults = () => {
    setResults([]);
  };

  // Run tests for all selected modules
  const runAllTests = async () => {
    setIsRunning(true);
    const newResults: ModuleTestResult[] = [];
    
    try {
      // Get only enabled modules
      const enabledModules = activeModules.filter(module => module.enabled);
      
      // For each enabled module, run all its tests
      for (const module of enabledModules) {
        const moduleResult: ModuleTestResult = {
          moduleName: module.moduleName,
          status: 'pending',
          timestamp: new Date(),
          details: []
        };
        
        // Run all tests for this module
        for (const testFn of module.tests) {
          try {
            const testResult = await testFn();
            moduleResult.details.push(testResult);
          } catch (error) {
            moduleResult.details.push({
              name: 'Error running test',
              status: 'error',
              message: 'An unexpected error occurred while running the test',
              errorDetails: error instanceof Error ? error.message : String(error)
            });
          }
        }
        
        // Determine overall module status based on test results
        if (moduleResult.details.every(d => d.status === 'success')) {
          moduleResult.status = 'success';
        } else if (moduleResult.details.some(d => d.status === 'error')) {
          moduleResult.status = 'error';
        } else if (moduleResult.details.some(d => d.status === 'partial')) {
          moduleResult.status = 'partial';
        } else {
          moduleResult.status = 'pending';
        }
        
        newResults.push(moduleResult);
      }
      
      setResults(newResults);
      toast.success(`Testing completed for ${enabledModules.length} modules`);
    } catch (error) {
      console.error('Error running tests:', error);
      toast.error('Testing failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsRunning(false);
    }
  };

  // Individual test functions
  async function testAuthenticationSession(): Promise<TestResultDetail> {
    const start = performance.now();
    try {
      const { data, error } = await supabase.auth.getSession();
      
      const end = performance.now();
      const responseTime = end - start;
      
      if (error) throw error;
      
      return {
        name: 'Authentication Session',
        status: 'success',
        message: 'Successfully verified authentication session',
        responseTime
      };
    } catch (error) {
      const end = performance.now();
      const responseTime = end - start;
      
      return {
        name: 'Authentication Session',
        status: 'error',
        message: 'Failed to verify authentication session',
        errorDetails: error instanceof Error ? error.message : String(error),
        responseTime,
        actionRequired: 'Check if you are logged in and if Supabase authentication is properly configured'
      };
    }
  }

  async function testUserRoles(): Promise<TestResultDetail> {
    const start = performance.now();
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        throw new Error('No active session found');
      }
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', session.session.user.id)
        .limit(1);
      
      const end = performance.now();
      const responseTime = end - start;
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return {
          name: 'User Roles',
          status: 'partial',
          message: 'User authenticated but no roles assigned',
          responseTime,
          actionRequired: 'Assign a role to this user in the admin panel'
        };
      }
      
      return {
        name: 'User Roles',
        status: 'success',
        message: `User has ${data.length} role(s) assigned`,
        responseTime
      };
    } catch (error) {
      const end = performance.now();
      const responseTime = end - start;
      
      return {
        name: 'User Roles',
        status: 'error',
        message: 'Failed to retrieve user roles',
        errorDetails: error instanceof Error ? error.message : String(error),
        responseTime
      };
    }
  }

  async function testDatabaseConnection(): Promise<TestResultDetail> {
    const start = performance.now();
    try {
      // Simple query to verify database connection
      const { data, error } = await supabase
        .from('organizations')
        .select('count(*)', { count: 'exact' });
      
      const end = performance.now();
      const responseTime = end - start;
      
      if (error) throw error;
      
      return {
        name: 'Database Connection',
        status: 'success',
        message: 'Successfully connected to the database',
        responseTime
      };
    } catch (error) {
      const end = performance.now();
      const responseTime = end - start;
      
      return {
        name: 'Database Connection',
        status: 'error',
        message: 'Failed to connect to the database',
        errorDetails: error instanceof Error ? error.message : String(error),
        responseTime
      };
    }
  }

  async function testTableAccess(): Promise<TestResultDetail> {
    const start = performance.now();
    try {
      // Test access to a few key tables
      const tables = ['organizations', 'facilities', 'documents', 'capa_actions', 'non_conformances'];
      const results = [];
      
      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        if (error) {
          results.push({ table, success: false, error });
        } else {
          results.push({ table, success: true });
        }
      }
      
      const end = performance.now();
      const responseTime = end - start;
      
      const failedTables = results.filter(r => !r.success);
      
      if (failedTables.length > 0) {
        return {
          name: 'Table Access Check',
          status: 'partial',
          message: `Access denied to ${failedTables.length} of ${tables.length} tables`,
          errorDetails: failedTables.map(ft => `${ft.table}: ${ft.error.message}`).join('\n'),
          responseTime,
          actionRequired: 'Check RLS policies and permissions for these tables'
        };
      }
      
      return {
        name: 'Table Access Check',
        status: 'success',
        message: `Successfully accessed all ${tables.length} tables`,
        responseTime
      };
    } catch (error) {
      const end = performance.now();
      const responseTime = end - start;
      
      return {
        name: 'Table Access Check',
        status: 'error',
        message: 'Failed to test table access',
        errorDetails: error instanceof Error ? error.message : String(error),
        responseTime
      };
    }
  }

  async function testOrganizationsFetch(): Promise<TestResultDetail> {
    const start = performance.now();
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .limit(10);
      
      const end = performance.now();
      const responseTime = end - start;
      
      if (error) throw error;
      
      return {
        name: 'Fetch Organizations',
        status: 'success',
        message: `Successfully fetched ${data.length} organizations`,
        responseTime
      };
    } catch (error) {
      const end = performance.now();
      const responseTime = end - start;
      
      return {
        name: 'Fetch Organizations',
        status: 'error',
        message: 'Failed to fetch organizations',
        errorDetails: error instanceof Error ? error.message : String(error),
        responseTime
      };
    }
  }

  async function testFacilitiesFetch(): Promise<TestResultDetail> {
    const start = performance.now();
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .limit(10);
      
      const end = performance.now();
      const responseTime = end - start;
      
      if (error) throw error;
      
      return {
        name: 'Fetch Facilities',
        status: 'success',
        message: `Successfully fetched ${data.length} facilities`,
        responseTime
      };
    } catch (error) {
      const end = performance.now();
      const responseTime = end - start;
      
      return {
        name: 'Fetch Facilities',
        status: 'error',
        message: 'Failed to fetch facilities',
        errorDetails: error instanceof Error ? error.message : String(error),
        responseTime
      };
    }
  }

  async function testDocumentsFetch(): Promise<TestResultDetail> {
    const start = performance.now();
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .limit(10);
      
      const end = performance.now();
      const responseTime = end - start;
      
      if (error) throw error;
      
      return {
        name: 'Fetch Documents',
        status: 'success',
        message: `Successfully fetched ${data.length} documents`,
        responseTime
      };
    } catch (error) {
      const end = performance.now();
      const responseTime = end - start;
      
      return {
        name: 'Fetch Documents',
        status: 'error',
        message: 'Failed to fetch documents',
        errorDetails: error instanceof Error ? error.message : String(error),
        responseTime
      };
    }
  }

  async function testCAPAFetch(): Promise<TestResultDetail> {
    const start = performance.now();
    try {
      const { data, error } = await supabase
        .from('capa_actions')
        .select('*')
        .limit(10);
      
      const end = performance.now();
      const responseTime = end - start;
      
      if (error) throw error;
      
      return {
        name: 'Fetch CAPA Actions',
        status: 'success',
        message: `Successfully fetched ${data.length} CAPA actions`,
        responseTime
      };
    } catch (error) {
      const end = performance.now();
      const responseTime = end - start;
      
      return {
        name: 'Fetch CAPA Actions',
        status: 'error',
        message: 'Failed to fetch CAPA actions',
        errorDetails: error instanceof Error ? error.message : String(error),
        responseTime
      };
    }
  }

  async function testNonConformanceFetch(): Promise<TestResultDetail> {
    const start = performance.now();
    try {
      const { data, error } = await supabase
        .from('non_conformances')
        .select('*')
        .limit(10);
      
      const end = performance.now();
      const responseTime = end - start;
      
      if (error) throw error;
      
      return {
        name: 'Fetch Non-Conformances',
        status: 'success',
        message: `Successfully fetched ${data.length} non-conformances`,
        responseTime
      };
    } catch (error) {
      const end = performance.now();
      const responseTime = end - start;
      
      return {
        name: 'Fetch Non-Conformances',
        status: 'error',
        message: 'Failed to fetch non-conformances',
        errorDetails: error instanceof Error ? error.message : String(error),
        responseTime
      };
    }
  }

  async function testModuleRelationships(): Promise<TestResultDetail> {
    const start = performance.now();
    try {
      // Test a specific relationship between modules
      const { data, error } = await supabase
        .from('module_relationships')
        .select('*')
        .limit(10);
      
      const end = performance.now();
      const responseTime = end - start;
      
      if (error) throw error;
      
      // Check for specific relationships
      const ncToCapaRelations = data.filter(
        rel => rel.source_type === 'non_conformance' && rel.target_type === 'capa'
      );
      
      const suppliersToDocsRelations = data.filter(
        rel => rel.source_type === 'supplier' && rel.target_type === 'document'
      );
      
      if (ncToCapaRelations.length === 0 && suppliersToDocsRelations.length === 0) {
        return {
          name: 'Module Relationships',
          status: 'partial',
          message: 'No specific module relationships found',
          responseTime,
          actionRequired: 'Create test relationships between modules'
        };
      }
      
      return {
        name: 'Module Relationships',
        status: 'success',
        message: `Found ${data.length} module relationships`,
        responseTime
      };
    } catch (error) {
      const end = performance.now();
      const responseTime = end - start;
      
      return {
        name: 'Module Relationships',
        status: 'error',
        message: 'Failed to test module relationships',
        errorDetails: error instanceof Error ? error.message : String(error),
        responseTime
      };
    }
  }

  return {
    results,
    isRunning,
    activeModules,
    toggleModule,
    runAllTests,
    resetResults
  };
};

export default useBackendFrontendTesting;
