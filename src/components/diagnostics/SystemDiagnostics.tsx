
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { databaseService } from '@/services/databaseService';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details?: string;
  duration?: number;
}

const SystemDiagnostics: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateResult = (test: string, status: DiagnosticResult['status'], message: string, details?: string, duration?: number) => {
    setResults(prev => {
      const existing = prev.findIndex(r => r.test === test);
      const newResult = { test, status, message, details, duration };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newResult;
        return updated;
      }
      return [...prev, newResult];
    });
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    // Test 1: Authentication Status
    const authStart = Date.now();
    updateResult('Authentication', 'loading', 'Checking authentication...');
    try {
      if (authLoading) {
        updateResult('Authentication', 'warning', 'Auth still loading...', undefined, Date.now() - authStart);
      } else if (isAuthenticated && user) {
        updateResult('Authentication', 'success', `Authenticated as ${user.email}`, `User ID: ${user.id}`, Date.now() - authStart);
      } else {
        updateResult('Authentication', 'error', 'Not authenticated', 'User needs to log in', Date.now() - authStart);
      }
    } catch (error) {
      updateResult('Authentication', 'error', 'Auth check failed', error instanceof Error ? error.message : 'Unknown error', Date.now() - authStart);
    }

    // Test 2: Supabase Connection
    const supabaseStart = Date.now();
    updateResult('Supabase Connection', 'loading', 'Testing Supabase connection...');
    try {
      const { data, error } = await supabase.from('organizations').select('count').limit(1);
      if (error) throw error;
      updateResult('Supabase Connection', 'success', 'Connected to Supabase', `Response received`, Date.now() - supabaseStart);
    } catch (error) {
      updateResult('Supabase Connection', 'error', 'Supabase connection failed', error instanceof Error ? error.message : 'Unknown error', Date.now() - supabaseStart);
    }

    // Test 3: Database Service Auth Check
    const dbAuthStart = Date.now();
    updateResult('Database Auth Check', 'loading', 'Checking database auth...');
    try {
      const isAuth = await databaseService.checkAuth();
      updateResult('Database Auth Check', isAuth ? 'success' : 'error', isAuth ? 'Database auth successful' : 'Database auth failed', undefined, Date.now() - dbAuthStart);
    } catch (error) {
      updateResult('Database Auth Check', 'error', 'Database auth check failed', error instanceof Error ? error.message : 'Unknown error', Date.now() - dbAuthStart);
    }

    // Test 4: Complaints Data Fetch
    const complaintsStart = Date.now();
    updateResult('Complaints Data', 'loading', 'Fetching complaints...');
    try {
      const complaints = await databaseService.getComplaints();
      updateResult('Complaints Data', 'success', `Retrieved ${complaints.length} complaints`, `Data fetch successful`, Date.now() - complaintsStart);
    } catch (error) {
      updateResult('Complaints Data', 'error', 'Failed to fetch complaints', error instanceof Error ? error.message : 'Unknown error', Date.now() - complaintsStart);
    }

    // Test 5: Core Tables Access
    const tablesStart = Date.now();
    updateResult('Core Tables', 'loading', 'Testing core table access...');
    try {
      const tableTests = await Promise.allSettled([
        supabase.from('documents').select('count').limit(1),
        supabase.from('non_conformances').select('count').limit(1),
        supabase.from('capa_actions').select('count').limit(1),
        supabase.from('profiles').select('count').limit(1)
      ]);

      const successCount = tableTests.filter(result => result.status === 'fulfilled').length;
      const failedTables = tableTests
        .map((result, index) => ({ index, result }))
        .filter(({ result }) => result.status === 'rejected')
        .map(({ index }) => ['documents', 'non_conformances', 'capa_actions', 'profiles'][index]);

      if (successCount === tableTests.length) {
        updateResult('Core Tables', 'success', `All ${successCount} core tables accessible`, undefined, Date.now() - tablesStart);
      } else {
        updateResult('Core Tables', 'warning', `${successCount}/${tableTests.length} tables accessible`, `Failed: ${failedTables.join(', ')}`, Date.now() - tablesStart);
      }
    } catch (error) {
      updateResult('Core Tables', 'error', 'Core table access failed', error instanceof Error ? error.message : 'Unknown error', Date.now() - tablesStart);
    }

    // Test 6: Profile Data
    if (user) {
      const profileStart = Date.now();
      updateResult('User Profile', 'loading', 'Fetching user profile...');
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (profile) {
          updateResult('User Profile', 'success', 'Profile data found', `Organization: ${profile.organization_id || 'None'}`, Date.now() - profileStart);
        } else {
          updateResult('User Profile', 'warning', 'No profile data found', 'Profile may need to be created', Date.now() - profileStart);
        }
      } catch (error) {
        updateResult('User Profile', 'error', 'Profile fetch failed', error instanceof Error ? error.message : 'Unknown error', Date.now() - profileStart);
      }
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, [user, isAuthenticated]);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'loading':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const totalTests = results.length;
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const warningCount = results.filter(r => r.status === 'warning').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            System Diagnostics
            <Button onClick={runDiagnostics} disabled={isRunning}>
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                'Run Diagnostics'
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {totalTests > 0 && (
            <div className="mb-4 flex gap-4">
              <Badge variant="outline" className="bg-green-100 text-green-800">
                ✓ {successCount} Passed
              </Badge>
              <Badge variant="outline" className="bg-red-100 text-red-800">
                ✗ {errorCount} Failed
              </Badge>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                ⚠ {warningCount} Warnings
              </Badge>
            </div>
          )}

          <div className="space-y-3">
            {results.map((result, index) => (
              <Alert key={index} className={`border-l-4 ${
                result.status === 'success' ? 'border-l-green-500' :
                result.status === 'error' ? 'border-l-red-500' :
                result.status === 'warning' ? 'border-l-yellow-500' :
                'border-l-blue-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{result.test}</span>
                        <Badge className={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
                        {result.duration && (
                          <span className="text-xs text-gray-500">
                            {result.duration}ms
                          </span>
                        )}
                      </div>
                      <AlertDescription className="mt-1">
                        {result.message}
                        {result.details && (
                          <div className="text-xs text-gray-600 mt-1">
                            {result.details}
                          </div>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>

          {results.length === 0 && !isRunning && (
            <div className="text-center text-gray-500 py-8">
              Click "Run Diagnostics" to check system health
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemDiagnostics;
