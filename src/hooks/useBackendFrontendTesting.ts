
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

export function useBackendFrontendTesting() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [functions, setFunctions] = useState<FunctionInfo[]>([]);
  const [storage, setStorage] = useState<StorageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
        const { data, error } = await supabase.rpc(func.name, func.params || {});
        
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

  return {
    tables,
    functions,
    storage,
    summary,
    isLoading,
    runTests
  };
}
