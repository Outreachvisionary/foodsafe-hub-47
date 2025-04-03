
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, RefreshCw, ServerCrash, CheckCircle2 } from 'lucide-react';
import { useDocuments } from '@/contexts/DocumentContext';
import { useDocumentService } from '@/hooks/useDocumentService';
import { supabase } from '@/integrations/supabase/client';
import { checkDatabaseConnection } from '@/utils/supabaseHelpers';

/**
 * This component provides error handling, diagnostics and recovery options for the document repository
 * when documents fail to load or other issues are encountered.
 */
const DocumentRepositoryErrorHandler: React.FC = () => {
  const { error, retryFetchDocuments, isLoading } = useDocuments();
  const [diagnosisResults, setDiagnosisResults] = useState<Record<string, boolean | null>>({
    supabaseConnection: null,
    storageAccess: null,
    documentsTableAccess: null,
    policyAccess: null
  });
  const [diagnosisRunning, setDiagnosisRunning] = useState(false);
  const [diagnosisComplete, setDiagnosisComplete] = useState(false);
  const documentService = useDocumentService();
  const [connectionResponseTime, setConnectionResponseTime] = useState<number | null>(null);

  const runDiagnostics = async () => {
    setDiagnosisRunning(true);
    setDiagnosisComplete(false);
    const results: Record<string, boolean> = {
      supabaseConnection: false,
      storageAccess: false,
      documentsTableAccess: false,
      policyAccess: false
    };

    try {
      // Test Supabase connection
      console.log('Testing Supabase connection...');
      const connectionCheck = await checkDatabaseConnection();
      results.supabaseConnection = connectionCheck.success;
      if (connectionCheck.responseTime) {
        setConnectionResponseTime(connectionCheck.responseTime);
      }
      
      if (!results.supabaseConnection) {
        console.error('Supabase connection failed:', connectionCheck.error);
      } else {
        console.log(`Supabase connection successful (${connectionCheck.responseTime}ms)`);
      }
    } catch (error) {
      console.error('Error testing Supabase connection:', error);
      results.supabaseConnection = false;
    }

    // Only run the remaining tests if the connection is working
    if (results.supabaseConnection) {
      try {
        // Test storage access
        console.log('Testing storage access...');
        const storageAvailable = await documentService.checkStorageAvailability();
        results.storageAccess = storageAvailable;
        console.log('Storage access test result:', storageAvailable);
      } catch (error) {
        console.error('Error testing storage access:', error);
        results.storageAccess = false;
      }

      try {
        // Test documents table access
        console.log('Testing documents table access...');
        const startTime = Date.now();
        const { data: documentsTest, error: documentsError } = await supabase
          .from('documents')
          .select('id')
          .limit(1);
        const responseTime = Date.now() - startTime;
        results.documentsTableAccess = !documentsError;
        console.log(`Documents table access test result: ${!documentsError} (${responseTime}ms)`);
      } catch (error) {
        console.error('Error testing documents table access:', error);
        results.documentsTableAccess = false;
      }

      try {
        // Test policy access
        console.log('Testing document status types access...');
        const startTime = Date.now();
        const { data: policyTest, error: policyError } = await supabase
          .from('document_status_types')
          .select('id, name')
          .limit(1);
        const responseTime = Date.now() - startTime;
        results.policyAccess = !policyError && !!policyTest;
        console.log(`Document status types access test result: ${!policyError && !!policyTest} (${responseTime}ms)`);
      } catch (error) {
        console.error('Error testing policy access:', error);
        results.policyAccess = false;
      }
    }

    setDiagnosisResults(results);
    setDiagnosisRunning(false);
    setDiagnosisComplete(true);
  };

  // Run diagnostics when an error is detected
  useEffect(() => {
    if (error && !diagnosisComplete && !diagnosisRunning) {
      runDiagnostics();
    }
  }, [error, diagnosisComplete, diagnosisRunning]);

  if (!error) return null;

  // Safe error display that handles both string and object errors
  const errorMessage = typeof error === 'string' 
    ? error 
    : ((error as Error)?.message || 'An unexpected error occurred');

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <CardTitle>Document Repository Issues Detected</CardTitle>
        </div>
        <CardDescription>
          We've encountered a problem loading your documents. Let's diagnose and fix the issue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-red-600 bg-red-50 p-4 rounded-md">
            <h3 className="font-medium">Error Details</h3>
            <p className="text-sm mt-1">{errorMessage}</p>
          </div>

          {diagnosisComplete && (
            <div className="space-y-3 mt-4">
              <h3 className="font-medium">Diagnostic Results</h3>
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm">Supabase Connection</span>
                  <div className="flex items-center gap-2">
                    {diagnosisResults.supabaseConnection === null ? (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    ) : diagnosisResults.supabaseConnection ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {connectionResponseTime && (
                          <span className="text-xs text-gray-500">{connectionResponseTime}ms</span>
                        )}
                      </>
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm">Storage Access</span>
                  <div className="flex items-center">
                    {diagnosisResults.storageAccess === null ? (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    ) : diagnosisResults.storageAccess ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm">Documents Table Access</span>
                  <div className="flex items-center">
                    {diagnosisResults.documentsTableAccess === null ? (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    ) : diagnosisResults.documentsTableAccess ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm">Reference Data Access</span>
                  <div className="flex items-center">
                    {diagnosisResults.policyAccess === null ? (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    ) : diagnosisResults.policyAccess ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mt-4">
                <h4 className="text-sm font-medium text-yellow-800">Recommendation</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  {Object.values(diagnosisResults).every(val => val) ? 
                    "All systems are operational. Try refreshing the document repository." : 
                    "Some services appear to be unavailable. This could be due to network connectivity issues, database maintenance, or configuration problems. Please try again or contact your system administrator."}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button 
          variant="outline" 
          onClick={runDiagnostics} 
          disabled={diagnosisRunning}
          className="flex items-center"
        >
          {diagnosisRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            <>
              <ServerCrash className="h-4 w-4 mr-2" />
              Run Diagnostics
            </>
          )}
        </Button>
        
        <Button 
          onClick={retryFetchDocuments} 
          disabled={isLoading}
          className="flex items-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Documents
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentRepositoryErrorHandler;
