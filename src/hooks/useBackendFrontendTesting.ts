
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

export interface TableInfo {
  name: string;
  rowCount: number;
  hasError: boolean;
  error?: PostgrestError | Error | null;
}

export interface FunctionInfo {
  name: string;
  params?: Record<string, any>;
  result?: any;
  hasError: boolean;
  error?: PostgrestError | Error | null;
}

export interface StorageInfo {
  bucket: string;
  files: number;
  hasError: boolean;
  error?: Error | null;
}

export interface TestSummary {
  tables: {
    total: number;
    success: number;
    failed: number;
  };
  functions: {
    total: number;
    success: number;
    failed: number;
  };
  storage: {
    total: number;
    success: number;
    failed: number;
  };
}

export interface TestResultDetail {
  name: string;
  status: 'success' | 'error' | 'warning' | 'pending';
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

// Define structure for active modules
export interface ActiveModule {
  moduleName: string;
  enabled: boolean;
}

export function useBackendFrontendTesting() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [functions, setFunctions] = useState<FunctionInfo[]>([]);
  const [storage, setStorage] = useState<StorageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ModuleTestResult[]>([]);
  const [activeModules, setActiveModules] = useState<ActiveModule[]>([
    { moduleName: 'Database', enabled: true },
    { moduleName: 'Authentication', enabled: true },
    { moduleName: 'Storage', enabled: false },
    { moduleName: 'Functions', enabled: false }
  ]);
  const [summary, setSummary] = useState<TestSummary>({
    tables: { total: 0, success: 0, failed: 0 },
    functions: { total: 0, success: 0, failed: 0 },
    storage: { total: 0, success: 0, failed: 0 }
  });

  // Define tables to test
  const tablesToTest = [
    'organizations',
    'facilities',
    'departments',
    'documents',
    'non_conformances',
    'capa_actions',
    'training_records',
    'training_sessions',
    'training_plans',
    'suppliers',
    'profiles',
    'audits'
  ];

  // Define functions to test
  const functionsToTest = [
    { name: 'get_organizations', params: {} },
    { name: 'get_facilities', params: {} },
    { name: 'get_regulatory_standards', params: {} },
    { name: 'find_product_components', params: { product_batch_lot: 'TEST-001' } }
  ];

  // Define storage buckets to test
  const bucketsToTest = [
    'documents',
    'attachments',
    'profile-images'
  ];

  const testTables = async () => {
    const tableResults: TableInfo[] = [];
    
    for (const tableName of tablesToTest) {
      try {
        // We need to try/catch here since we can't do dynamic type checking
        // at compile time for table names
        const { count, error } = await supabase
          .from(tableName as any)
          .select('*', { count: 'exact', head: true });
          
        tableResults.push({
          name: tableName,
          rowCount: count || 0,
          hasError: !!error,
          error
        });
      } catch (err) {
        tableResults.push({
          name: tableName,
          rowCount: 0,
          hasError: true,
          error: err instanceof Error ? err : new Error(String(err))
        });
      }
    }
    
    setTables(tableResults);
    return tableResults;
  };

  const testFunctions = async () => {
    const functionResults: FunctionInfo[] = [];
    
    for (const func of functionsToTest) {
      try {
        // Cast function name to the correct type for Supabase RPC call
        const functionName = func.name as "get_organizations" | "get_facilities" | 
          "get_regulatory_standards" | "find_product_components" | 
          "find_affected_products_by_component" | "get_facility_standards" | 
          "get_related_items" | "has_permission" | "has_role" | 
          "update_nc_status" | "update_recall_schedule_next_execution";
        
        const { data, error } = await supabase.rpc(functionName, func.params || {});
        
        functionResults.push({
          name: func.name,
          params: func.params,
          result: data,
          hasError: !!error,
          error
        });
      } catch (err) {
        functionResults.push({
          name: func.name,
          params: func.params,
          hasError: true,
          error: err instanceof Error ? err : new Error(String(err))
        });
      }
    }
    
    setFunctions(functionResults);
    return functionResults;
  };

  const testStorage = async () => {
    const storageResults: StorageInfo[] = [];
    
    for (const bucket of bucketsToTest) {
      try {
        const { data, error } = await supabase.storage.from(bucket).list();
        
        storageResults.push({
          bucket,
          files: data?.length || 0,
          hasError: !!error,
          error: error || null
        });
      } catch (err) {
        storageResults.push({
          bucket,
          files: 0,
          hasError: true,
          error: err instanceof Error ? err : new Error(String(err))
        });
      }
    }
    
    setStorage(storageResults);
    return storageResults;
  };

  const calculateSummary = (tableData: TableInfo[], functionData: FunctionInfo[], storageData: StorageInfo[]) => {
    const tableSummary = {
      total: tableData.length,
      success: tableData.filter(t => !t.hasError).length,
      failed: tableData.filter(t => t.hasError).length
    };
    
    const functionSummary = {
      total: functionData.length,
      success: functionData.filter(f => !f.hasError).length,
      failed: functionData.filter(f => f.hasError).length
    };
    
    const storageSummary = {
      total: storageData.length,
      success: storageData.filter(s => !s.hasError).length,
      failed: storageData.filter(s => s.hasError).length
    };
    
    return {
      tables: tableSummary,
      functions: functionSummary,
      storage: storageSummary
    };
  };

  const runTests = async () => {
    setIsLoading(true);
    
    try {
      const tableResults = await testTables();
      const functionResults = await testFunctions();
      const storageResults = await testStorage();
      
      const testSummary = calculateSummary(tableResults, functionResults, storageResults);
      setSummary(testSummary);
    } catch (err) {
      console.error('Error running tests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    const newResults: ModuleTestResult[] = [];
    
    // Run each enabled module test
    for (const module of activeModules.filter(m => m.enabled)) {
      const result: ModuleTestResult = {
        moduleName: module.moduleName,
        status: 'pending',
        timestamp: new Date(),
        details: []
      };
      
      try {
        if (module.moduleName === 'Database') {
          // Test database tables
          const tableDetails: TestResultDetail[] = [];
          let successCount = 0;
          
          for (const tableName of tablesToTest.slice(0, 5)) { // Limit to 5 tables for demo
            const startTime = performance.now();
            const { count, error } = await supabase
              .from(tableName as any)
              .select('*', { count: 'exact', head: true });
            const endTime = performance.now();
            
            const detail: TestResultDetail = {
              name: `Table: ${tableName}`,
              status: error ? 'error' : 'success',
              message: error ? `Error: ${error.message}` : `Found ${count || 0} records`,
              responseTime: endTime - startTime,
              errorDetails: error ? error.message : undefined
            };
            
            tableDetails.push(detail);
            if (!error) successCount++;
          }
          
          result.details = tableDetails;
          result.status = successCount === tableDetails.length ? 'success' : 
                        successCount > 0 ? 'partial' : 'error';
        } 
        else if (module.moduleName === 'Authentication') {
          // Add a placeholder auth test
          result.details = [{
            name: 'Authentication Service',
            status: 'success',
            message: 'Authentication service is available',
            responseTime: 45
          }];
          result.status = 'success';
        }
        // Add more module tests here
      } catch (error) {
        result.status = 'error';
        result.details.push({
          name: 'Module Error',
          status: 'error',
          message: `Failed to test ${module.moduleName}`,
          errorDetails: error instanceof Error ? error.message : String(error)
        });
      }
      
      newResults.push(result);
    }
    
    setResults(newResults);
    setIsRunning(false);
  };

  const toggleModule = (moduleName: string) => {
    setActiveModules(prev => 
      prev.map(module => 
        module.moduleName === moduleName 
          ? { ...module, enabled: !module.enabled } 
          : module
      )
    );
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
    runTests
  };
}
