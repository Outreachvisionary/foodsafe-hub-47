
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define types for test results
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

interface TestModule {
  moduleName: string;
  enabled: boolean;
}

export const useBackendFrontendTesting = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ModuleTestResult[]>([]);
  const [activeModules, setActiveModules] = useState<TestModule[]>([
    { moduleName: 'Users', enabled: true },
    { moduleName: 'Documents', enabled: true },
    { moduleName: 'Training', enabled: true },
    { moduleName: 'Non-Conformances', enabled: true },
    { moduleName: 'Audits', enabled: true },
    { moduleName: 'CAPA', enabled: true },
    { moduleName: 'Facilities', enabled: true },
    { moduleName: 'Organizations', enabled: true },
  ]);

  const toggleModule = (moduleName: string) => {
    setActiveModules(prev => 
      prev.map(mod => 
        mod.moduleName === moduleName ? { ...mod, enabled: !mod.enabled } : mod
      )
    );
  };

  const resetResults = () => {
    setResults([]);
  };

  // Function to test user authentication and profile synchronization
  const testUserAuth = async (): Promise<TestResultDetail[]> => {
    const results: TestResultDetail[] = [];
    const startTime = Date.now();
    
    try {
      // Test user auth session
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        results.push({
          name: 'Auth Session',
          status: 'error',
          message: 'Failed to retrieve auth session',
          responseTime: Date.now() - startTime,
          errorDetails: sessionError.message
        });
      } else {
        results.push({
          name: 'Auth Session',
          status: 'success',
          message: 'Successfully retrieved auth session',
          responseTime: Date.now() - startTime
        });
      }

      // Test profile access
      const profileStartTime = Date.now();
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single();

      if (profileError) {
        results.push({
          name: 'Profile Access',
          status: 'error',
          message: 'Failed to access user profile',
          responseTime: Date.now() - profileStartTime,
          errorDetails: profileError.message
        });
      } else {
        results.push({
          name: 'Profile Access',
          status: 'success',
          message: 'Successfully accessed user profile',
          responseTime: Date.now() - profileStartTime
        });
      }

      // Test real-time subscription
      const realtimeStartTime = Date.now();
      const subscription = supabase
        .channel('test-channel')
        .on('presence', { event: 'sync' }, () => {})
        .subscribe();

      if (subscription) {
        results.push({
          name: 'Realtime Subscription',
          status: 'success',
          message: 'Successfully established realtime connection',
          responseTime: Date.now() - realtimeStartTime
        });
        
        // Clean up subscription
        setTimeout(() => {
          subscription.unsubscribe();
        }, 500);
      } else {
        results.push({
          name: 'Realtime Subscription',
          status: 'error',
          message: 'Failed to establish realtime connection',
          responseTime: Date.now() - realtimeStartTime
        });
      }
    } catch (error: any) {
      results.push({
        name: 'User Authentication',
        status: 'error',
        message: 'Unexpected error in user authentication test',
        errorDetails: error.message
      });
    }

    return results;
  };

  // Function to test document module
  const testDocuments = async (): Promise<TestResultDetail[]> => {
    const results: TestResultDetail[] = [];
    const startTime = Date.now();
    
    try {
      // Test document list retrieval
      const { data: documents, error: documentError } = await supabase
        .from('documents')
        .select('*')
        .limit(5);
      
      if (documentError) {
        results.push({
          name: 'Document Retrieval',
          status: 'error',
          message: 'Failed to retrieve documents',
          responseTime: Date.now() - startTime,
          errorDetails: documentError.message
        });
      } else {
        results.push({
          name: 'Document Retrieval',
          status: 'success',
          message: `Successfully retrieved ${documents?.length || 0} documents`,
          responseTime: Date.now() - startTime
        });
      }

      // Test document version history
      const versionStartTime = Date.now();
      if (documents && documents.length > 0) {
        const { data: versions, error: versionError } = await supabase
          .from('document_versions')
          .select('*')
          .eq('document_id', documents[0].id)
          .limit(3);
          
        if (versionError) {
          results.push({
            name: 'Version History',
            status: 'error',
            message: 'Failed to retrieve document versions',
            responseTime: Date.now() - versionStartTime,
            errorDetails: versionError.message
          });
        } else {
          results.push({
            name: 'Version History',
            status: 'success',
            message: `Successfully retrieved ${versions?.length || 0} versions`,
            responseTime: Date.now() - versionStartTime
          });
        }
      } else {
        results.push({
          name: 'Version History',
          status: 'partial',
          message: 'Skipped version test (no documents available)',
          responseTime: Date.now() - versionStartTime
        });
      }
    } catch (error: any) {
      results.push({
        name: 'Document Tests',
        status: 'error',
        message: 'Unexpected error in document tests',
        errorDetails: error.message
      });
    }

    return results;
  };

  // Function to run all enabled tests
  const runAllTests = async () => {
    setIsRunning(true);
    const newResults: ModuleTestResult[] = [];

    // Get enabled modules
    const enabledModules = activeModules.filter(mod => mod.enabled);
    
    for (const module of enabledModules) {
      // Initialize with pending status
      const pendingResult: ModuleTestResult = {
        moduleName: module.moduleName,
        status: 'pending',
        timestamp: new Date(),
        details: [{
          name: 'Initializing',
          status: 'pending',
          message: 'Test in progress...'
        }]
      };
      
      setResults(prev => [...prev, pendingResult]);
      
      try {
        let details: TestResultDetail[] = [];
        
        // Run the appropriate test based on module name
        switch (module.moduleName) {
          case 'Users':
            details = await testUserAuth();
            break;
          case 'Documents':
            details = await testDocuments();
            break;
          case 'Training':
            // Placeholder for training module tests
            details = [{
              name: 'Training Module',
              status: 'partial',
              message: 'Training module tests not yet implemented',
              actionRequired: 'Implement training module tests'
            }];
            break;
          default:
            details = [{
              name: `${module.moduleName} Tests`,
              status: 'partial',
              message: `Tests for ${module.moduleName} not yet implemented`,
              actionRequired: `Implement ${module.moduleName} module tests`
            }];
        }
        
        // Determine overall status based on details
        const hasErrors = details.some(d => d.status === 'error');
        const hasPartial = details.some(d => d.status === 'partial');
        const overallStatus = hasErrors ? 'error' : hasPartial ? 'partial' : 'success';
        
        const result: ModuleTestResult = {
          moduleName: module.moduleName,
          status: overallStatus,
          timestamp: new Date(),
          details
        };
        
        // Update results for this module
        setResults(prev => 
          prev.map(r => 
            r.moduleName === module.moduleName ? result : r
          )
        );
        
        newResults.push(result);
      } catch (error) {
        // Handle any unexpected errors
        const errorResult: ModuleTestResult = {
          moduleName: module.moduleName,
          status: 'error',
          timestamp: new Date(),
          details: [{
            name: 'Unexpected Error',
            status: 'error',
            message: 'An unexpected error occurred during testing',
            errorDetails: error instanceof Error ? error.message : String(error)
          }]
        };
        
        setResults(prev => 
          prev.map(r => 
            r.moduleName === module.moduleName ? errorResult : r
          )
        );
        
        newResults.push(errorResult);
      }
    }
    
    setIsRunning(false);
  };

  return {
    isRunning,
    results,
    activeModules,
    toggleModule,
    runAllTests,
    resetResults
  };
};
