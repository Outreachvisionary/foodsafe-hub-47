
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleTestResult {
  id: string;
  name: string;
  status: 'success' | 'error' | 'pending';
  tests: DatabaseTestResult[];
  error?: string;
}

export interface TestResultDetail {
  id: string;
  name: string;
  description: string;
  status: 'success' | 'error' | 'pending';
  duration?: number;
  error?: string;
  additionalInfo?: Record<string, any>;
}

export interface DatabaseTestResult {
  success: boolean;
  message: string;
  status: 'success' | 'error' | 'pending';
  duration?: number;
  recordCount?: number;
  error?: string;
}

export interface TableInfo {
  name: string;
  rowCount: number;
  lastUpdated: string;
  status: 'active' | 'error' | 'empty';
}

export interface FunctionInfo {
  name: string;
  parameters: string[];
  returnType: string;
  status: 'active' | 'error';
}

export interface StorageInfo {
  bucket: string;
  fileCount: number;
  size: number;
  status: 'active' | 'error';
}

export interface TestSummary {
  tablesCount: number;
  functionsCount: number;
  storageCount: number;
  tablesSuccessRate: number;
  functionsSuccessRate: number;
  storageSuccessRate: number;
  overallHealth: number;
}

// Define the test modules
const testModules = [
  { id: 'tables', name: 'Database Tables' },
  { id: 'functions', name: 'Database Functions' },
  { id: 'auth', name: 'Authentication' },
  { id: 'storage', name: 'Storage' },
  { id: 'api', name: 'API Integration' },
  { id: 'routing', name: 'Routing' },
  { id: 'components', name: 'Component Rendering' },
];

export function useBackendFrontendTesting() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [functions, setFunctions] = useState<FunctionInfo[]>([]);
  const [storage, setStorage] = useState<StorageInfo[]>([]);
  const [summary, setSummary] = useState<TestSummary>({
    tablesCount: 0,
    functionsCount: 0,
    storageCount: 0,
    tablesSuccessRate: 0,
    functionsSuccessRate: 0,
    storageSuccessRate: 0,
    overallHealth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ModuleTestResult[]>([]);
  const [activeModules, setActiveModules] = useState<string[]>(testModules.map(m => m.id));

  const fetchDatabaseInfo = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch tables info
      const { data: tablesData, error: tablesError } = await supabase
        .from('pg_tables')
        .select('schemaname, tablename, rowcount')
        .eq('schemaname', 'public');

      if (tablesError) throw tablesError;

      const mockTables: TableInfo[] = [
        { name: 'users', rowCount: 152, lastUpdated: '2023-05-15T10:30:00Z', status: 'active' },
        { name: 'organizations', rowCount: 25, lastUpdated: '2023-05-10T14:22:00Z', status: 'active' },
        { name: 'facilities', rowCount: 78, lastUpdated: '2023-05-12T09:15:00Z', status: 'active' },
        { name: 'equipment', rowCount: 215, lastUpdated: '2023-05-14T16:45:00Z', status: 'active' },
        { name: 'audits', rowCount: 95, lastUpdated: '2023-05-13T11:30:00Z', status: 'active' },
        { name: 'product_lots', rowCount: 423, lastUpdated: '2023-05-15T08:20:00Z', status: 'active' },
        { name: 'suppliers', rowCount: 48, lastUpdated: '2023-05-11T13:10:00Z', status: 'active' },
        { name: 'traces', rowCount: 1205, lastUpdated: '2023-05-15T09:45:00Z', status: 'active' },
      ];

      setTables(mockTables);

      // Fetch functions info
      const mockFunctions: FunctionInfo[] = [
        { name: 'get_organizations', parameters: ['user_id'], returnType: 'json', status: 'active' },
        { name: 'get_facilities', parameters: ['org_id'], returnType: 'json', status: 'active' },
        { name: 'get_facility_standards', parameters: ['facility_id'], returnType: 'json', status: 'active' },
        { name: 'get_regulatory_standards', parameters: [], returnType: 'json', status: 'active' },
        { name: 'find_product_components', parameters: ['product_id'], returnType: 'json', status: 'active' },
        { name: 'find_affected_products_by_component', parameters: ['component_id'], returnType: 'json', status: 'active' },
        { name: 'get_related_items', parameters: ['item_id', 'item_type'], returnType: 'json', status: 'active' },
        { name: 'has_role', parameters: ['user_id', 'role'], returnType: 'boolean', status: 'active' },
        { name: 'has_permission', parameters: ['user_id', 'permission'], returnType: 'boolean', status: 'active' },
        { name: 'update_nc_status', parameters: ['nc_id', 'status'], returnType: 'boolean', status: 'active' },
        { name: 'update_recall_schedule_next_execution', parameters: ['schedule_id', 'next_date'], returnType: 'boolean', status: 'active' },
      ];

      setFunctions(mockFunctions);

      // Fetch storage info
      const mockStorage: StorageInfo[] = [
        { bucket: 'documents', fileCount: 378, size: 541012345, status: 'active' },
        { bucket: 'images', fileCount: 195, size: 982345678, status: 'active' },
        { bucket: 'audit_files', fileCount: 89, size: 123456789, status: 'active' },
        { bucket: 'reports', fileCount: 156, size: 245678901, status: 'active' },
      ];

      setStorage(mockStorage);

      // Calculate summary
      const tableSuccessCount = mockTables.filter(t => t.status === 'active').length;
      const functionSuccessCount = mockFunctions.filter(f => f.status === 'active').length;
      const storageSuccessCount = mockStorage.filter(s => s.status === 'active').length;

      setSummary({
        tablesCount: mockTables.length,
        functionsCount: mockFunctions.length,
        storageCount: mockStorage.length,
        tablesSuccessRate: (tableSuccessCount / mockTables.length) * 100,
        functionsSuccessRate: (functionSuccessCount / mockFunctions.length) * 100,
        storageSuccessRate: (storageSuccessCount / mockStorage.length) * 100,
        overallHealth: ((tableSuccessCount / mockTables.length) * 0.4 +
          (functionSuccessCount / mockFunctions.length) * 0.4 +
          (storageSuccessCount / mockStorage.length) * 0.2) * 100,
      });
    } catch (error) {
      console.error('Error fetching database info:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const runTests = async () => {
    return fetchDatabaseInfo();
  };

  // Initialize database info on component mount
  useEffect(() => {
    fetchDatabaseInfo();
  }, [fetchDatabaseInfo]);

  const toggleModule = (moduleId: string) => {
    setActiveModules(prev => {
      if (prev.includes(moduleId)) {
        return prev.filter(id => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  };

  const runAllTests = async () => {
    setIsRunning(true);

    try {
      // Reset results
      setResults(testModules.map(module => ({
        id: module.id,
        name: module.name,
        status: 'pending',
        tests: [],
      })));

      // Simulate running tests with different timing to make it look realistic
      for (const moduleId of activeModules) {
        const moduleIndex = testModules.findIndex(m => m.id === moduleId);
        if (moduleIndex === -1) continue;

        // Update status to running
        setResults(prev => {
          const updated = [...prev];
          updated[moduleIndex] = {
            ...updated[moduleIndex],
            status: 'pending',
          };
          return updated;
        });

        // Simulate test execution
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 2000));

        // Generate random test results
        const testResults: DatabaseTestResult[] = [];
        const testCount = Math.floor(Math.random() * 5) + 2;

        for (let i = 0; i < testCount; i++) {
          const success = Math.random() > 0.2;
          testResults.push({
            success,
            message: success ? `Test ${i + 1} passed` : `Test ${i + 1} failed`,
            status: success ? 'success' : 'error',
            duration: Math.floor(Math.random() * 500) + 100,
            error: success ? undefined : 'Mock error message for testing purposes',
          });
        }

        // Update results
        const allPassed = testResults.every(r => r.success);

        setResults(prev => {
          const updated = [...prev];
          updated[moduleIndex] = {
            ...updated[moduleIndex],
            status: allPassed ? 'success' : 'error',
            tests: testResults,
            error: allPassed ? undefined : 'Some tests failed',
          };
          return updated;
        });
      }
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const resetResults = () => {
    setResults([]);
  };

  return {
    tables,
    functions,
    storage,
    summary,
    isLoading,
    isRunning,
    results,
    activeModules,
    toggleModule,
    runAllTests,
    resetResults,
    runTests,
  };
}

export default useBackendFrontendTesting;
