
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

  // Function to test non-conformance module
  const testNonConformances = async (): Promise<TestResultDetail[]> => {
    const results: TestResultDetail[] = [];
    const startTime = Date.now();
    
    try {
      // Test non-conformance list retrieval
      const { data: nonConformances, error: ncError } = await supabase
        .from('non_conformances')
        .select('*')
        .limit(5);
      
      if (ncError) {
        results.push({
          name: 'Non-Conformance Retrieval',
          status: 'error',
          message: 'Failed to retrieve non-conformances',
          responseTime: Date.now() - startTime,
          errorDetails: ncError.message
        });
      } else {
        results.push({
          name: 'Non-Conformance Retrieval',
          status: 'success',
          message: `Successfully retrieved ${nonConformances?.length || 0} non-conformances`,
          responseTime: Date.now() - startTime
        });
      }

      // Test non-conformance activities
      const activityStartTime = Date.now();
      if (nonConformances && nonConformances.length > 0) {
        const { data: activities, error: activityError } = await supabase
          .from('nc_activities')
          .select('*')
          .eq('non_conformance_id', nonConformances[0].id)
          .limit(3);
          
        if (activityError) {
          results.push({
            name: 'Activity History',
            status: 'error',
            message: 'Failed to retrieve non-conformance activities',
            responseTime: Date.now() - activityStartTime,
            errorDetails: activityError.message
          });
        } else {
          results.push({
            name: 'Activity History',
            status: 'success',
            message: `Successfully retrieved ${activities?.length || 0} activities`,
            responseTime: Date.now() - activityStartTime
          });
        }
      } else {
        results.push({
          name: 'Activity History',
          status: 'partial',
          message: 'Skipped activities test (no non-conformances available)',
          responseTime: Date.now() - activityStartTime
        });
      }
    } catch (error: any) {
      results.push({
        name: 'Non-Conformance Tests',
        status: 'error',
        message: 'Unexpected error in non-conformance tests',
        errorDetails: error.message
      });
    }

    return results;
  };

  // Function to test CAPA module
  const testCAPAs = async (): Promise<TestResultDetail[]> => {
    const results: TestResultDetail[] = [];
    const startTime = Date.now();
    
    try {
      // Test CAPA actions retrieval
      const { data: capaActions, error: capaError } = await supabase
        .from('capa_actions')
        .select('*')
        .limit(5);
      
      if (capaError) {
        results.push({
          name: 'CAPA Retrieval',
          status: 'error',
          message: 'Failed to retrieve CAPA actions',
          responseTime: Date.now() - startTime,
          errorDetails: capaError.message
        });
      } else {
        results.push({
          name: 'CAPA Retrieval',
          status: 'success',
          message: `Successfully retrieved ${capaActions?.length || 0} CAPA actions`,
          responseTime: Date.now() - startTime
        });
      }

      // Test CAPA effectiveness assessments
      const assessmentStartTime = Date.now();
      if (capaActions && capaActions.length > 0) {
        const { data: assessments, error: assessmentError } = await supabase
          .from('capa_effectiveness_assessments')
          .select('*')
          .eq('capa_id', capaActions[0].id)
          .limit(3);
          
        if (assessmentError) {
          results.push({
            name: 'Effectiveness Assessments',
            status: 'error',
            message: 'Failed to retrieve CAPA effectiveness assessments',
            responseTime: Date.now() - assessmentStartTime,
            errorDetails: assessmentError.message
          });
        } else {
          results.push({
            name: 'Effectiveness Assessments',
            status: 'success',
            message: `Successfully retrieved ${assessments?.length || 0} assessments`,
            responseTime: Date.now() - assessmentStartTime
          });
        }
      } else {
        results.push({
          name: 'Effectiveness Assessments',
          status: 'partial',
          message: 'Skipped assessment test (no CAPA actions available)',
          responseTime: Date.now() - assessmentStartTime
        });
      }
    } catch (error: any) {
      results.push({
        name: 'CAPA Tests',
        status: 'error',
        message: 'Unexpected error in CAPA tests',
        errorDetails: error.message
      });
    }

    return results;
  };

  // Function to test facility module
  const testFacilities = async (): Promise<TestResultDetail[]> => {
    const results: TestResultDetail[] = [];
    const startTime = Date.now();
    
    try {
      // Test facilities retrieval
      const { data: facilities, error: facilityError } = await supabase
        .from('facilities')
        .select('*')
        .limit(5);
      
      if (facilityError) {
        results.push({
          name: 'Facility Retrieval',
          status: 'error',
          message: 'Failed to retrieve facilities',
          responseTime: Date.now() - startTime,
          errorDetails: facilityError.message
        });
      } else {
        results.push({
          name: 'Facility Retrieval',
          status: 'success',
          message: `Successfully retrieved ${facilities?.length || 0} facilities`,
          responseTime: Date.now() - startTime
        });
      }

      // Test facility standards
      const standardsStartTime = Date.now();
      if (facilities && facilities.length > 0) {
        const { data: standards, error: standardsError } = await supabase
          .rpc('get_facility_standards', { p_facility_id: facilities[0].id });
          
        if (standardsError) {
          results.push({
            name: 'Facility Standards',
            status: 'error',
            message: 'Failed to retrieve facility standards',
            responseTime: Date.now() - standardsStartTime,
            errorDetails: standardsError.message
          });
        } else {
          results.push({
            name: 'Facility Standards',
            status: 'success',
            message: `Successfully retrieved ${standards?.length || 0} standards`,
            responseTime: Date.now() - standardsStartTime
          });
        }
      } else {
        results.push({
          name: 'Facility Standards',
          status: 'partial',
          message: 'Skipped standards test (no facilities available)',
          responseTime: Date.now() - standardsStartTime
        });
      }
    } catch (error: any) {
      results.push({
        name: 'Facility Tests',
        status: 'error',
        message: 'Unexpected error in facility tests',
        errorDetails: error.message
      });
    }

    return results;
  };

  // Function to test organization module
  const testOrganizations = async (): Promise<TestResultDetail[]> => {
    const results: TestResultDetail[] = [];
    const startTime = Date.now();
    
    try {
      // Test organizations retrieval
      const { data: organizations, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .limit(5);
      
      if (orgError) {
        results.push({
          name: 'Organization Retrieval',
          status: 'error',
          message: 'Failed to retrieve organizations',
          responseTime: Date.now() - startTime,
          errorDetails: orgError.message
        });
      } else {
        results.push({
          name: 'Organization Retrieval',
          status: 'success',
          message: `Successfully retrieved ${organizations?.length || 0} organizations`,
          responseTime: Date.now() - startTime
        });
      }

      // Test departments within organizations
      const deptStartTime = Date.now();
      if (organizations && organizations.length > 0) {
        const { data: departments, error: deptError } = await supabase
          .from('departments')
          .select('*')
          .eq('organization_id', organizations[0].id)
          .limit(5);
          
        if (deptError) {
          results.push({
            name: 'Departments',
            status: 'error',
            message: 'Failed to retrieve departments',
            responseTime: Date.now() - deptStartTime,
            errorDetails: deptError.message
          });
        } else {
          results.push({
            name: 'Departments',
            status: 'success',
            message: `Successfully retrieved ${departments?.length || 0} departments`,
            responseTime: Date.now() - deptStartTime
          });
        }
      } else {
        results.push({
          name: 'Departments',
          status: 'partial',
          message: 'Skipped departments test (no organizations available)',
          responseTime: Date.now() - deptStartTime
        });
      }
    } catch (error: any) {
      results.push({
        name: 'Organization Tests',
        status: 'error',
        message: 'Unexpected error in organization tests',
        errorDetails: error.message
      });
    }

    return results;
  };

  // Function to test training module
  const testTraining = async (): Promise<TestResultDetail[]> => {
    const results: TestResultDetail[] = [];
    const startTime = Date.now();
    
    try {
      // Test training sessions retrieval
      const { data: sessions, error: sessionError } = await supabase
        .from('training_sessions')
        .select('*')
        .limit(5);
      
      if (sessionError) {
        results.push({
          name: 'Training Sessions',
          status: 'error',
          message: 'Failed to retrieve training sessions',
          responseTime: Date.now() - startTime,
          errorDetails: sessionError.message
        });
      } else {
        results.push({
          name: 'Training Sessions',
          status: 'success',
          message: `Successfully retrieved ${sessions?.length || 0} training sessions`,
          responseTime: Date.now() - startTime
        });
      }

      // Test training records
      const recordStartTime = Date.now();
      if (sessions && sessions.length > 0) {
        const { data: records, error: recordError } = await supabase
          .from('training_records')
          .select('*')
          .eq('session_id', sessions[0].id)
          .limit(5);
          
        if (recordError) {
          results.push({
            name: 'Training Records',
            status: 'error',
            message: 'Failed to retrieve training records',
            responseTime: Date.now() - recordStartTime,
            errorDetails: recordError.message
          });
        } else {
          results.push({
            name: 'Training Records',
            status: 'success',
            message: `Successfully retrieved ${records?.length || 0} training records`,
            responseTime: Date.now() - recordStartTime
          });
        }
      } else {
        results.push({
          name: 'Training Records',
          status: 'partial',
          message: 'Skipped records test (no training sessions available)',
          responseTime: Date.now() - recordStartTime
        });
      }

      // Test training automation configuration
      const automationStartTime = Date.now();
      const { data: automation, error: automationError } = await supabase
        .from('training_automation_config')
        .select('*')
        .limit(1)
        .single();
        
      if (automationError) {
        results.push({
          name: 'Training Automation',
          status: 'error',
          message: 'Failed to retrieve training automation configuration',
          responseTime: Date.now() - automationStartTime,
          errorDetails: automationError.message
        });
      } else {
        results.push({
          name: 'Training Automation',
          status: 'success',
          message: 'Successfully retrieved training automation configuration',
          responseTime: Date.now() - automationStartTime
        });
      }
    } catch (error: any) {
      results.push({
        name: 'Training Tests',
        status: 'error',
        message: 'Unexpected error in training tests',
        errorDetails: error.message
      });
    }

    return results;
  };

  // Function to test audit module
  const testAudits = async (): Promise<TestResultDetail[]> => {
    const results: TestResultDetail[] = [];
    const startTime = Date.now();
    
    try {
      // Test audits retrieval
      const { data: audits, error: auditError } = await supabase
        .from('audits')
        .select('*')
        .limit(5);
      
      if (auditError) {
        results.push({
          name: 'Audit Retrieval',
          status: 'error',
          message: 'Failed to retrieve audits',
          responseTime: Date.now() - startTime,
          errorDetails: auditError.message
        });
      } else {
        results.push({
          name: 'Audit Retrieval',
          status: 'success',
          message: `Successfully retrieved ${audits?.length || 0} audits`,
          responseTime: Date.now() - startTime
        });
      }

      // Test audit findings
      const findingsStartTime = Date.now();
      if (audits && audits.length > 0) {
        const { data: findings, error: findingsError } = await supabase
          .from('audit_findings')
          .select('*')
          .eq('audit_id', audits[0].id)
          .limit(5);
          
        if (findingsError) {
          results.push({
            name: 'Audit Findings',
            status: 'error',
            message: 'Failed to retrieve audit findings',
            responseTime: Date.now() - findingsStartTime,
            errorDetails: findingsError.message
          });
        } else {
          results.push({
            name: 'Audit Findings',
            status: 'success',
            message: `Successfully retrieved ${findings?.length || 0} audit findings`,
            responseTime: Date.now() - findingsStartTime
          });
        }
      } else {
        results.push({
          name: 'Audit Findings',
          status: 'partial',
          message: 'Skipped findings test (no audits available)',
          responseTime: Date.now() - findingsStartTime
        });
      }
    } catch (error: any) {
      results.push({
        name: 'Audit Tests',
        status: 'error',
        message: 'Unexpected error in audit tests',
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
          case 'Non-Conformances':
            details = await testNonConformances();
            break;
          case 'CAPA':
            details = await testCAPAs();
            break;
          case 'Facilities':
            details = await testFacilities();
            break;
          case 'Organizations':
            details = await testOrganizations();
            break;
          case 'Training':
            details = await testTraining();
            break;
          case 'Audits':
            details = await testAudits();
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
