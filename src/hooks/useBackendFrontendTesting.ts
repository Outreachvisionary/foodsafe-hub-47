
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TestResultDetail {
  id: string;
  name: string;
  status: 'success' | 'error' | 'pending';
  message?: string;
  responseTime?: number;
  errorDetails?: string;
  actionRequired?: string;
}

export interface ModuleTestResult {
  id: string;
  moduleName: string;
  status: 'passing' | 'failing' | 'partial' | 'pending';
  details: TestResultDetail[];
  timestamp: Date;
}

export interface TestingModule {
  id: string;
  moduleName: string;
  enabled: boolean;
  description: string;
  lastRun?: string;
  lastStatus?: 'passing' | 'failing' | 'partial' | 'pending';
}

export function useBackendFrontendTesting() {
  const [activeModules, setActiveModules] = useState<TestingModule[]>([]);
  const [results, setResults] = useState<ModuleTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const mockModules: TestingModule[] = [
    {
      id: '1',
      moduleName: 'API Connectivity',
      enabled: true,
      description: 'Tests connectivity to critical external APIs',
      lastRun: new Date().toISOString(),
      lastStatus: 'passing'
    },
    {
      id: '2',
      moduleName: 'Database Connection',
      enabled: true,
      description: 'Verifies connection to database and permissions',
      lastRun: new Date().toISOString(),
      lastStatus: 'passing'
    },
    {
      id: '3',
      moduleName: 'Data Integrity',
      enabled: true,
      description: 'Validates critical data relationships',
      lastRun: new Date().toISOString(),
      lastStatus: 'partial'
    },
    {
      id: '4',
      moduleName: 'Authentication',
      enabled: true,
      description: 'Tests authentication flows',
      lastRun: new Date().toISOString(),
      lastStatus: 'passing'
    },
    {
      id: '5',
      moduleName: 'Performance',
      enabled: false,
      description: 'Measures response times for critical operations',
      lastRun: new Date().toISOString(),
      lastStatus: 'pending'
    }
  ];

  const mockResults: ModuleTestResult[] = [
    {
      id: '1',
      moduleName: 'API Connectivity',
      status: 'passing',
      timestamp: new Date(),
      details: [
        {
          id: '1-1',
          name: 'Supplier API',
          status: 'success',
          message: 'Connection successful',
          responseTime: 120
        },
        {
          id: '1-2',
          name: 'Document Storage API',
          status: 'success',
          message: 'Connection successful',
          responseTime: 95
        }
      ]
    },
    {
      id: '2',
      moduleName: 'Database Connection',
      status: 'passing',
      timestamp: new Date(),
      details: [
        {
          id: '2-1',
          name: 'Primary DB Connection',
          status: 'success',
          message: 'Connection successful',
          responseTime: 42
        },
        {
          id: '2-2',
          name: 'Read Permissions',
          status: 'success',
          message: 'Permissions verified',
          responseTime: 38
        },
        {
          id: '2-3',
          name: 'Write Permissions',
          status: 'success',
          message: 'Permissions verified',
          responseTime: 40
        }
      ]
    },
    {
      id: '3',
      moduleName: 'Data Integrity',
      status: 'partial',
      timestamp: new Date(),
      details: [
        {
          id: '3-1',
          name: 'Product-Component Relationships',
          status: 'success',
          message: 'All relationships valid',
          responseTime: 350
        },
        {
          id: '3-2',
          name: 'Supplier-Component Linkage',
          status: 'error',
          message: 'Orphaned components detected',
          responseTime: 420,
          errorDetails: '3 components found without supplier linkage',
          actionRequired: 'Review component table and ensure all have valid supplier_id'
        }
      ]
    }
  ];

  // Function to check database connectivity
  const checkDatabaseConnection = async () => {
    try {
      // Use a known table instead of pg_tables
      const { data, error } = await supabase
        .from('documents')
        .select('id')
        .limit(1);
      
      if (error) throw error;
      
      return {
        status: 'success',
        message: 'Database connection successful',
        responseTime: 50 // Mock response time
      };
    } catch (err: any) {
      console.error('Error checking database connection:', err);
      return {
        status: 'error',
        message: 'Database connection failed',
        errorDetails: err.message,
        responseTime: 500 // Mock timeout response time
      };
    }
  };

  // Initialize with mock data
  useEffect(() => {
    setActiveModules(mockModules);
    setResults(mockResults);
  }, []);

  // Function to run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    setError(null);
    
    try {
      // In a real implementation, this would actually run the tests
      // For now, we'll simulate a delay and use our mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the timestamp on our mock results
      const updatedResults = mockResults.map(result => ({
        ...result,
        timestamp: new Date()
      }));
      
      setResults(updatedResults);
      
      // Update the lastRun timestamp on our modules
      const updatedModules = activeModules.map(module => ({
        ...module,
        lastRun: new Date().toISOString()
      }));
      
      setActiveModules(updatedModules);
    } catch (err: any) {
      console.error('Error running tests:', err);
      setError('Failed to run tests: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  // Function to toggle a module's enabled status
  const toggleModule = (moduleName: string) => {
    setActiveModules(prevModules => 
      prevModules.map(module => 
        module.moduleName === moduleName 
          ? { ...module, enabled: !module.enabled } 
          : module
      )
    );
  };

  // Function to reset test results
  const resetResults = () => {
    setResults([]);
  };

  return {
    activeModules,
    results,
    isRunning,
    error,
    runAllTests,
    resetResults,
    toggleModule
  };
}

export default useBackendFrontendTesting;
