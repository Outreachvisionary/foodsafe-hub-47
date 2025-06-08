
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

const AuthDebugger: React.FC = () => {
  const { user } = useUser();
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionInfo(session);
    };
    getSession();
  }, []);

  const testDatabaseOperations = async () => {
    const results: any = {};

    try {
      // Test basic connection
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      results.profileRead = profileError ? `Error: ${profileError.message}` : 'Success';

      // Test insert operation
      const { error: insertError } = await supabase
        .from('capa_actions')
        .insert({
          title: 'Test CAPA',
          description: 'Test description',
          priority: 'Medium',
          assigned_to: 'test-user',
          created_by: 'test-user',
          source: 'Internal_Report',
          due_date: new Date().toISOString()
        });

      results.capaInsert = insertError ? `Error: ${insertError.message}` : 'Success';

      // Test complaints insert
      const { error: complaintError } = await supabase
        .from('complaints')
        .insert({
          title: 'Test Complaint',
          description: 'Test description',
          category: 'Product_Quality',
          created_by: 'test-user'
        });

      results.complaintInsert = complaintError ? `Error: ${complaintError.message}` : 'Success';

    } catch (error) {
      results.general = `Error: ${error}`;
    }

    setTestResults(results);
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Authentication & Database Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">User Info:</h3>
          <pre className="text-sm bg-gray-100 p-2 rounded">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold">Session Info:</h3>
          <pre className="text-sm bg-gray-100 p-2 rounded">
            {JSON.stringify(sessionInfo, null, 2)}
          </pre>
        </div>

        <Button onClick={testDatabaseOperations}>Test Database Operations</Button>

        {Object.keys(testResults).length > 0 && (
          <div>
            <h3 className="font-semibold">Test Results:</h3>
            <pre className="text-sm bg-gray-100 p-2 rounded">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthDebugger;
