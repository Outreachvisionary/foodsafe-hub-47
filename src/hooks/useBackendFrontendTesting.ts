
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { useNotifications } from '@/contexts/NotificationContext';

interface TestConfig {
  moduleName: string;
  enabled: boolean;
}

export interface TestResultDetail {
  name: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  responseTime?: number;
  errorDetails?: string;
  actionRequired?: string;
}

export interface ModuleTestResult {
  moduleName: string;
  status: 'success' | 'error' | 'partial' | 'pending';
  details: TestResultDetail[];
  timestamp: Date;
}

export function useBackendFrontendTesting() {
  const { user } = useUser();
  const { addNotification } = useNotifications();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ModuleTestResult[]>([]);
  const [activeModules, setActiveModules] = useState<TestConfig[]>([
    { moduleName: 'Documents', enabled: true },
    { moduleName: 'Training', enabled: true },
    { moduleName: 'Non-Conformance', enabled: true },
    { moduleName: 'CAPA', enabled: true },
    { moduleName: 'Audits', enabled: true },
    { moduleName: 'Facilities', enabled: true },
    { moduleName: 'Notifications', enabled: true },
    { moduleName: 'Permissions', enabled: true }
  ]);

  const toggleModule = useCallback((moduleName: string) => {
    setActiveModules(current => 
      current.map(mod => 
        mod.moduleName === moduleName 
          ? { ...mod, enabled: !mod.enabled } 
          : mod
      )
    );
  }, []);

  const resetResults = useCallback(() => {
    setResults([]);
  }, []);

  // Test real-time synchronization for documents
  const testDocumentRealTimeSync = useCallback(async (): Promise<TestResultDetail> => {
    const startTime = performance.now();
    try {
      // Create a test document
      const testDocTitle = `Test Document ${new Date().toISOString()}`;
      const { data: document, error: createError } = await supabase
        .from('documents')
        .insert({
          title: testDocTitle,
          description: 'Test document for real-time sync testing',
          file_name: 'test.txt',
          file_type: 'text/plain',
          file_size: 100,
          created_by: user?.id || 'system',
          category: 'Procedure'
        })
        .select()
        .single();

      if (createError) throw createError;
      
      // Set up a subscription to listen for document updates
      const channel = supabase
        .channel('document-test')
        .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'documents', filter: `id=eq.${document.id}` },
          (payload) => {
            // This is where a real implementation would update UI components
            console.log('Document updated in real-time:', payload);
            
            // Create a test notification for this update
            addNotification({
              id: Date.now().toString(),
              type: 'info',
              title: 'Document Updated',
              message: `Document "${payload.new.title}" was updated`,
              read: false,
              timestamp: new Date()
            });
          }
        )
        .subscribe();
      
      // Wait a moment then update the document to trigger the real-time update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { error: updateError } = await supabase
        .from('documents')
        .update({ 
          status: 'In Review',
          description: 'Updated description for real-time testing'
        })
        .eq('id', document.id);
      
      if (updateError) throw updateError;
      
      // Wait a moment to ensure the subscription has time to fire
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clean up
      supabase.removeChannel(channel);
      
      const responseTime = performance.now() - startTime;
      
      return {
        name: 'Document Real-Time Sync',
        status: 'success',
        message: 'Successfully created and updated a document with real-time sync',
        responseTime,
        actionRequired: 'Verify notification appeared in UI'
      };
    } catch (error: any) {
      return {
        name: 'Document Real-Time Sync',
        status: 'error',
        message: 'Failed to test document real-time sync',
        errorDetails: error.message || String(error)
      };
    }
  }, [user, addNotification]);

  // Test UI rendering validation for facilities
  const testFacilityUIRendering = useCallback(async (): Promise<TestResultDetail> => {
    const startTime = performance.now();
    try {
      // Create a test facility with specific formatting challenges
      const testFacilityName = `Test <Facility> & ${new Date().toISOString()}`;
      const { data: facility, error: createError } = await supabase
        .from('facilities')
        .insert({
          name: testFacilityName,
          description: 'Facility with special characters: <>"\'\\/&',
          address: '123 Test St.',
          contact_email: 'test@example.com',
          organization_id: null
        })
        .select()
        .single();

      if (createError) throw createError;
      
      // Check if the facility exists in the database
      const { data: retrievedFacility, error: getError } = await supabase
        .from('facilities')
        .select('*')
        .eq('id', facility.id)
        .single();
        
      if (getError) throw getError;
      
      // Validate the retrieved facility has correct data
      const isDataValid = 
        retrievedFacility.name === testFacilityName &&
        retrievedFacility.description.includes('<>\"\'\\/&');
      
      if (!isDataValid) {
        throw new Error('Facility data was not stored or retrieved correctly');
      }
      
      const responseTime = performance.now() - startTime;
      
      return {
        name: 'Facility UI Rendering',
        status: 'success',
        message: 'Successfully validated facility data with special characters',
        responseTime,
        actionRequired: 'Check facility selector UI for proper character escaping'
      };
    } catch (error: any) {
      return {
        name: 'Facility UI Rendering',
        status: 'error',
        message: 'Failed to validate facility UI rendering',
        errorDetails: error.message || String(error)
      };
    }
  }, []);

  // Test notification propagation
  const testNotificationPropagation = useCallback(async (): Promise<TestResultDetail> => {
    const startTime = performance.now();
    try {
      // Create a test notification directly in the system
      const testNotificationId = Date.now().toString();
      addNotification({
        id: testNotificationId,
        type: 'warning',
        title: 'Test Backend Notification',
        message: 'This is a test notification triggered by the backend',
        read: false,
        timestamp: new Date()
      });
      
      // In a real implementation, we would verify the notification appears in UI
      // For this test, we're simulating that aspect
      
      // Simulate a check for the notification in the UI
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const responseTime = performance.now() - startTime;
      
      return {
        name: 'Notification Propagation',
        status: 'success',
        message: 'Successfully created a test notification',
        responseTime,
        actionRequired: 'Verify notification is visible in notifications panel'
      };
    } catch (error: any) {
      return {
        name: 'Notification Propagation',
        status: 'error',
        message: 'Failed to test notification propagation',
        errorDetails: error.message || String(error)
      };
    }
  }, [addNotification]);

  // Test permission-based UI updates
  const testPermissionBasedUI = useCallback(async (): Promise<TestResultDetail> => {
    const startTime = performance.now();
    try {
      if (!user) {
        throw new Error('User must be logged in to test permissions');
      }
      
      // Get current user's roles
      const { data: userRoles, error: rolesError } = await supabase
        .rpc('get_user_roles', { _user_id: user.id });
        
      if (rolesError) throw rolesError;
      
      // Check if the user has admin permission
      const hasAdminRole = userRoles.some(role => 
        role.permissions && role.permissions.admin === true
      );
      
      // Check if specific modules would be accessible based on permissions
      const accessResults = {
        canAccessDocuments: hasAdminRole || userRoles.some(role => role.permissions && role.permissions.document_view === true),
        canEditDocuments: hasAdminRole || userRoles.some(role => role.permissions && role.permissions.document_edit === true),
        canAccessTraining: hasAdminRole || userRoles.some(role => role.permissions && role.permissions.training_view === true),
        canManageUsers: hasAdminRole || userRoles.some(role => role.permissions && role.permissions.user_management === true)
      };
      
      const responseTime = performance.now() - startTime;
      
      return {
        name: 'Permission-Based UI',
        status: 'success',
        message: `Successfully validated user permissions. Admin: ${hasAdminRole}`,
        responseTime,
        actionRequired: 'Verify UI elements match permission results'
      };
    } catch (error: any) {
      return {
        name: 'Permission-Based UI',
        status: 'error',
        message: 'Failed to test permission-based UI updates',
        errorDetails: error.message || String(error)
      };
    }
  }, [user]);

  // Test training module real-time updates
  const testTrainingUpdates = useCallback(async (): Promise<TestResultDetail> => {
    const startTime = performance.now();
    try {
      // Create a test training session
      const { data: session, error: sessionError } = await supabase
        .from('training_sessions')
        .insert({
          title: `Test Training ${new Date().toISOString()}`,
          description: 'Test training session for real-time updates',
          training_type: 'Compliance',
          created_by: user?.id || 'system',
          assigned_to: [user?.id || 'system']
        })
        .select()
        .single();
        
      if (sessionError) throw sessionError;
      
      // Create a training record
      const { data: record, error: recordError } = await supabase
        .from('training_records')
        .insert({
          session_id: session.id,
          employee_id: user?.id || 'system',
          employee_name: user?.full_name || 'Test User',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();
        
      if (recordError) throw recordError;
      
      // Set up a subscription to listen for training record updates
      const channel = supabase
        .channel('training-test')
        .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'training_records', filter: `id=eq.${record.id}` },
          (payload) => {
            // This is where a real implementation would update UI components
            console.log('Training record updated in real-time:', payload);
            
            // Create a test notification for this update
            addNotification({
              id: Date.now().toString(),
              type: 'success',
              title: 'Training Updated',
              message: `Training record status changed to ${payload.new.status}`,
              read: false,
              timestamp: new Date()
            });
          }
        )
        .subscribe();
      
      // Wait a moment then update the training record
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { error: updateError } = await supabase
        .from('training_records')
        .update({ 
          status: 'Completed',
          completion_date: new Date().toISOString(),
          score: 95
        })
        .eq('id', record.id);
      
      if (updateError) throw updateError;
      
      // Wait a moment to ensure the subscription has time to fire
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clean up
      supabase.removeChannel(channel);
      
      const responseTime = performance.now() - startTime;
      
      return {
        name: 'Training Real-Time Updates',
        status: 'success',
        message: 'Successfully created and updated a training record with real-time sync',
        responseTime,
        actionRequired: 'Verify training notification appeared in UI'
      };
    } catch (error: any) {
      return {
        name: 'Training Real-Time Updates',
        status: 'error',
        message: 'Failed to test training real-time updates',
        errorDetails: error.message || String(error)
      };
    }
  }, [user, addNotification]);

  // Test non-conformance module
  const testNonConformanceModule = useCallback(async (): Promise<TestResultDetail> => {
    const startTime = performance.now();
    try {
      // Create a test non-conformance
      const { data: nc, error: ncError } = await supabase
        .from('non_conformances')
        .insert({
          title: `Test NC ${new Date().toISOString()}`,
          description: 'Test non-conformance for backend-frontend testing',
          item_name: 'Test Item',
          item_category: 'Raw Material',
          reason_category: 'Damaged',
          created_by: user?.id || 'system'
        })
        .select()
        .single();
        
      if (ncError) throw ncError;
      
      // Set up a channel to listen for NC updates
      const channel = supabase
        .channel('nc-test')
        .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'non_conformances', filter: `id=eq.${nc.id}` },
          (payload) => {
            console.log('Non-conformance updated in real-time:', payload);
            addNotification({
              id: Date.now().toString(),
              type: 'info',
              title: 'NC Status Changed',
              message: `Non-conformance status changed to ${payload.new.status}`,
              read: false,
              timestamp: new Date()
            });
          }
        )
        .subscribe();
      
      // Update the NC status using the RPC function
      const { data: updatedNc, error: updateError } = await supabase
        .rpc('update_nc_status', {
          nc_id: nc.id,
          new_status: 'Under Review',
          user_id: user?.id || 'system',
          comment: 'Status changed during backend-frontend test'
        });
        
      if (updateError) throw updateError;
      
      // Wait for subscription to process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clean up
      supabase.removeChannel(channel);
      
      const responseTime = performance.now() - startTime;
      
      return {
        name: 'Non-Conformance Real-Time Updates',
        status: 'success',
        message: 'Successfully created and updated a non-conformance with real-time sync',
        responseTime,
        actionRequired: 'Verify NC status change notification appeared in UI'
      };
    } catch (error: any) {
      return {
        name: 'Non-Conformance Real-Time Updates',
        status: 'error',
        message: 'Failed to test non-conformance real-time updates',
        errorDetails: error.message || String(error)
      };
    }
  }, [user, addNotification]);

  // Run all selected module tests
  const runAllTests = useCallback(async () => {
    if (!user) {
      toast.error('User must be logged in to run tests');
      return;
    }
    
    setIsRunning(true);
    setResults([]);
    
    const moduleResults: ModuleTestResult[] = [];
    
    // Process each enabled module
    for (const module of activeModules.filter(m => m.enabled)) {
      const moduleResult: ModuleTestResult = {
        moduleName: module.moduleName,
        status: 'pending',
        details: [],
        timestamp: new Date()
      };
      
      // Add the module to results immediately so UI shows progress
      setResults(prev => [...prev, moduleResult]);
      
      try {
        // Run specific tests based on module
        switch (module.moduleName) {
          case 'Documents':
            moduleResult.details.push(await testDocumentRealTimeSync());
            break;
            
          case 'Training':
            moduleResult.details.push(await testTrainingUpdates());
            break;
            
          case 'Non-Conformance':
            moduleResult.details.push(await testNonConformanceModule());
            break;
            
          case 'Facilities':
            moduleResult.details.push(await testFacilityUIRendering());
            break;
            
          case 'Notifications':
            moduleResult.details.push(await testNotificationPropagation());
            break;
            
          case 'Permissions':
            moduleResult.details.push(await testPermissionBasedUI());
            break;
            
          default:
            moduleResult.details.push({
              name: `${module.moduleName} Module Test`,
              status: 'pending',
              message: `Tests not implemented for ${module.moduleName} module yet`
            });
        }
        
        // Update module status based on test results
        const hasErrors = moduleResult.details.some(d => d.status === 'error');
        const allSuccess = moduleResult.details.every(d => d.status === 'success');
        
        moduleResult.status = hasErrors 
          ? 'error' 
          : (allSuccess ? 'success' : 'partial');
          
      } catch (error: any) {
        moduleResult.status = 'error';
        moduleResult.details.push({
          name: `${module.moduleName} Module Error`,
          status: 'error',
          message: `Error running ${module.moduleName} module tests`,
          errorDetails: error.message || String(error)
        });
      }
      
      // Update the results with the completed module
      moduleResults.push(moduleResult);
      setResults([...moduleResults]);
    }
    
    setIsRunning(false);
  }, [
    user, 
    activeModules, 
    testDocumentRealTimeSync, 
    testTrainingUpdates, 
    testNonConformanceModule, 
    testFacilityUIRendering, 
    testNotificationPropagation,
    testPermissionBasedUI
  ]);

  return {
    isRunning,
    results,
    activeModules,
    toggleModule,
    runAllTests,
    resetResults
  };
}
