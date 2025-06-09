
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const DatabaseConnectionTest: React.FC = () => {
  const { user, session } = useAuth();
  const [testResults, setTestResults] = useState<any>({});
  const [testing, setTesting] = useState(false);

  const runDatabaseTests = async () => {
    setTesting(true);
    const results: any = {};

    try {
      // Test 1: Basic connection
      console.log('Testing basic connection...');
      const { data: connectionTest, error: connectionError } = await supabase
        .from('organizations')
        .select('count')
        .limit(1);
      
      results.connection = connectionError ? 
        `Error: ${connectionError.message}` : 
        'Success - Database connected';

      // Test 2: Auth state
      results.auth = user ? 
        `Authenticated as: ${user.email}` : 
        'Not authenticated';

      // Test 3: Session info
      results.session = session ? 
        `Session valid, expires: ${new Date(session.expires_at! * 1000).toLocaleString()}` : 
        'No session';

      // Test 4: Organizations table
      console.log('Testing organizations table...');
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .limit(5);
      
      results.organizations = orgError ? 
        `Error: ${orgError.message}` : 
        `Success - Found ${orgData?.length || 0} organizations`;

      // Test 5: Documents table
      console.log('Testing documents table...');
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('*')
        .limit(5);
      
      results.documents = docError ? 
        `Error: ${docError.message}` : 
        `Success - Found ${docData?.length || 0} documents`;

      // Test 6: Profiles table
      console.log('Testing profiles table...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);
      
      results.profiles = profileError ? 
        `Error: ${profileError.message}` : 
        `Success - Found ${profileData?.length || 0} profiles`;

    } catch (error) {
      results.general = `Unexpected error: ${error}`;
    }

    setTestResults(results);
    setTesting(false);
  };

  useEffect(() => {
    // Auto-run tests on component mount
    runDatabaseTests();
  }, [user]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Database Connection & Authentication Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Alert>
            <AlertDescription>
              <strong>Project URL:</strong> https://vngmjjvfofoggfqgpizo.supabase.co
            </AlertDescription>
          </Alert>
          
          <Alert>
            <AlertDescription>
              <strong>Auth Status:</strong> {user ? `Logged in as ${user.email}` : 'Not authenticated'}
            </AlertDescription>
          </Alert>
        </div>

        <Button onClick={runDatabaseTests} disabled={testing} className="w-full">
          {testing ? 'Testing...' : 'Run Database Tests'}
        </Button>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            {Object.entries(testResults).map(([test, result]) => (
              <Alert key={test} className={result.toString().includes('Error') ? 'border-red-500' : 'border-green-500'}>
                <AlertDescription>
                  <strong>{test}:</strong> {result as string}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseConnectionTest;
