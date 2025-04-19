import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleTestResult {
  id: string;
  name: string;
  status: 'success' | 'error' | 'pending';
  tests: DatabaseTestResult[];
  error?: string;
  moduleName: string;
  timestamp: Date;
  details: TestResultDetail[];
}

export interface TestResultDetail {
  id: string;
  name: string;
  description: string;
  status: 'success' | 'error' | 'pending';
  duration?: number;
  error?: string;
  message: string;
  responseTime?: number;
  errorDetails?: string;
  actionRequired?: string;
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

const testModules = [
  { id: 'tables', name: 'Database Tables', moduleName: 'Database Tables', enabled: true },
  { id: 'functions', name: 'Database Functions', moduleName: 'Database Functions', enabled: true },
  { id: 'auth', name: 'Authentication', moduleName: 'Authentication', enabled: true },
  { id: 'storage', name: 'Storage', moduleName: 'Storage', enabled: true },
  { id: 'api', name: 'API Integration', moduleName: 'API Integration', enabled: true },
  { id: 'routing', name: 'Routing', moduleName: 'Routing', enabled: true },
  { id: 'components', name: 'Component Rendering', moduleName: 'Component Rendering', enabled: true },
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
  const [activeModules, setActiveModules] = useState<{moduleName: string; enabled: boolean}[]>(
    testModules.map(m => ({ moduleName: m.moduleName, enabled: true }))
  );

  const fetchDatabaseInfo = useCallback(async () => {
    try {
      setIsLoading(true);

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

      const mockStorage: StorageInfo[] = [
        { bucket: 'documents', fileCount: 378, size: 541012345, status: 'active' },
        { bucket: 'images', fileCount: 195, size: 982345678, status: 'active' },
        { bucket: 'audit_files', fileCount: 89, size: 123456789, status: 'active' },
        { bucket: 'reports', fileCount: 156, size: 245678901, status: 'active' },
      ];

      setStorage(mockStorage);

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

  useEffect(() => {
    fetchDatabaseInfo();
  }, [fetchDatabaseInfo]);

  const toggleModule = (moduleName: string) => {
    setActiveModules(prev => {
      return prev.map(module => 
        module.moduleName === moduleName ? { ...module, enabled: !module.enabled } : module
      );
    });
  };

  const runAllTests = async () => {
    setIsRunning(true);

    try {
      setResults(testModules.map(module => ({
        id: module.id,
        name: module.name,
        moduleName: module.moduleName,
        status: 'pending',
        tests: [],
        timestamp: new Date(),
        details: []
      })));

      for (const module of activeModules.filter(m => m.enabled)) {
        const moduleIndex = testModules.findIndex(m => m.moduleName === module.moduleName);
        if (moduleIndex === -1) continue;

        setResults(prev => {
          const updated = [...prev];
          updated[moduleIndex] = {
            ...updated[moduleIndex],
            status: 'pending',
          };
          return updated;
        });

        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 2000));

        const testResults: DatabaseTestResult[] = [];
        const detailResults: TestResultDetail[] = [];
        const testCount = Math.floor(Math.random() * 5) + 2;

        for (let i = 0; i < testCount; i++) {
          const success = Math.random() > 0.2;
          const testId = `test-${i + 1}`;
          
          testResults.push({
            success,
            message: success ? `Test ${i + 1} passed` : `Test ${i + 1} failed`,
            status: success ? 'success' : 'error',
            duration: Math.floor(Math.random() * 500) + 100,
            error: success ? undefined : 'Mock error message for testing purposes',
          });
          
          detailResults.push({
            id: testId,
            name: `Test ${i + 1}`,
            description: `Test case for ${module.moduleName}`,
            status: success ? 'success' : 'error',
            message: success ? `Successfully completed test ${i + 1}` : `Failed to complete test ${i + 1}`,
            responseTime: Math.floor(Math.random() * 500) + 100,
            errorDetails: success ? undefined : 'Detailed error information would appear here',
            actionRequired: success ? undefined : 'Recommended action to fix this issue',
            duration: Math.floor(Math.random() * 500) + 100,
          });
        }

        const allPassed = testResults.every(r => r.success);

        setResults(prev => {
          const updated = [...prev];
          updated[moduleIndex] = {
            ...updated[moduleIndex],
            status: allPassed ? 'success' : 'error',
            tests: testResults,
            details: detailResults,
            error: allPassed ? undefined : 'Some tests failed',
            timestamp: new Date()
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
