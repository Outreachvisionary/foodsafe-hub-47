
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  testDatabaseTable, 
  testSupabaseAuth, 
  testSupabaseDatabase 
} from '@/utils/databaseTestUtils';

// Component for the database connection test page
const DatabaseConnectionTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [databaseResults, setDatabaseResults] = useState<any[]>([]);
  const [tablesChecked, setTablesChecked] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Automatically run a basic connection check on component mount
    runBasicConnectionCheck();
  }, []);

  const runBasicConnectionCheck = async () => {
    setIsLoading(true);
    try {
      // Test basic database connection
      const basicDbTest = await testSupabaseDatabase();
      
      // Test auth connection
      const authTest = await testSupabaseAuth();

      setDatabaseResults([basicDbTest, authTest]);
      
      if (basicDbTest.status === 'success' && authTest.status === 'success') {
        toast.success("Successfully connected to Supabase");
      } else {
        toast.error("Some connection tests failed. See details below.");
      }
    } catch (error) {
      toast.error("Error testing database connection");
      console.error("Database connection test error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const runTableTests = async () => {
    setIsLoading(true);
    try {
      // Define core tables to test
      const coreTables = [
        'organizations', 
        'facilities', 
        'departments', 
        'documents', 
        'non_conformances',
        'profiles'
      ];
      
      setTablesChecked(coreTables);
      
      // Run tests for each table
      const tableTests = await Promise.all(
        coreTables.map(table => testDatabaseTable(table))
      );
      
      setDatabaseResults(prev => [...prev, ...tableTests]);
      
      const failedTables = tableTests.filter(test => test.status === 'error');
      if (failedTables.length > 0) {
        toast.error(`Failed to connect to ${failedTables.length} tables`);
      } else {
        toast.success("Successfully connected to all core tables");
      }
    } catch (error) {
      toast.error("Error testing table connections");
      console.error("Table connection test error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTestResult = (result: any) => {
    let icon;
    let statusColor;
    
    switch (result.status) {
      case 'success':
        icon = <CheckCircle2 className="h-5 w-5 text-green-500" />;
        statusColor = "text-green-500";
        break;
      case 'error':
        icon = <XCircle className="h-5 w-5 text-red-500" />;
        statusColor = "text-red-500";
        break;
      default:
        icon = <AlertCircle className="h-5 w-5 text-yellow-500" />;
        statusColor = "text-yellow-500";
    }
    
    return (
      <Card key={result.tableName || result.details} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            {icon}
            <CardTitle className={statusColor}>
              {result.tableName ? `Table: ${result.tableName}` : 'Connection Test'}
            </CardTitle>
          </div>
          {result.details && <CardDescription>{result.details}</CardDescription>}
        </CardHeader>
        <CardContent>
          {result.recordCount !== undefined && (
            <p className="text-sm">Record count: {result.recordCount}</p>
          )}
          {result.duration && (
            <p className="text-sm text-gray-500">Duration: {result.duration.toFixed(2)}ms</p>
          )}
          {result.error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded">
              <p className="text-sm font-medium text-red-800">Error:</p>
              <p className="text-sm text-red-700">{result.error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Database Connection Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
          <CardDescription>
            Test your connection to the Supabase database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${databaseResults.some(r => r.status === 'error') ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span className="font-medium">
              {databaseResults.some(r => r.status === 'error') 
                ? 'Some connection issues detected' 
                : 'Connected to Supabase'}
            </span>
          </div>
          
          <p className="text-sm mb-4">
            Project ID: <code className="bg-gray-100 p-1 rounded">vngmjjvfofoggfqgpizo</code>
          </p>
          
          {user && (
            <p className="text-sm mb-4">
              Current user: {user.email} (ID: {user.id?.substring(0, 8)}...)
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            onClick={runBasicConnectionCheck} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Basic Connection'
            )}
          </Button>
          
          <Button 
            onClick={runTableTests} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Core Tables'
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="space-y-4">
        {databaseResults.map(result => renderTestResult(result))}
        
        {databaseResults.length === 0 && !isLoading && (
          <Card>
            <CardContent className="py-4">
              <p className="text-center text-gray-500">
                No tests run yet. Click one of the test buttons above to begin.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DatabaseConnectionTest;
