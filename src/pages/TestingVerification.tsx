
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, Clock, Database, Server, ArrowRight, RefreshCw } from 'lucide-react';
import { testDatabase, testDatabaseTable, testSupabaseAuth, testSupabaseDatabase, testServiceIntegration, testRouterNavigation, testCrossModuleIntegration, FunctionTestResult, DatabaseTestResult } from '@/utils/databaseTestUtils';

interface TestStatusProps {
  status: 'pending' | 'passing' | 'failing' | 'partial' | 'success' | 'error';
}

const TestStatus: React.FC<TestStatusProps> = ({ status }) => {
  switch (status) {
    case 'passing':
    case 'success':
      return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3.5 w-3.5 mr-1" />Passing</Badge>;
    case 'failing':
    case 'error':
      return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="h-3.5 w-3.5 mr-1" />Failing</Badge>;
    case 'partial':
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200"><AlertTriangle className="h-3.5 w-3.5 mr-1" />Partial</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200"><Clock className="h-3.5 w-3.5 mr-1" />Pending</Badge>;
  }
};

const TestingVerification = () => {
  const [databaseTests, setDatabaseTests] = useState<FunctionTestResult[]>([]);
  const [tableTests, setTableTests] = useState<DatabaseTestResult[]>([]);
  const [integrationTests, setIntegrationTests] = useState<FunctionTestResult[]>([]);
  const [uiTests, setUiTests] = useState<FunctionTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    setLoading(true);
    setDatabaseTests([
      { name: 'Database Connection', status: 'pending' },
      { name: 'Supabase Auth', status: 'pending' },
      { name: 'Supabase Database', status: 'pending' }
    ]);
    
    setTableTests([]);
    
    setIntegrationTests([
      { name: 'Service Integration: Documents', status: 'pending' },
      { name: 'Service Integration: CAPA', status: 'pending' },
      { name: 'Service Integration: Training', status: 'pending' },
      { name: 'Service Integration: Complaints', status: 'pending' },
      { name: 'Cross-Module Integration', status: 'pending' }
    ]);
    
    setUiTests([
      { name: 'Router Navigation: CAPA', status: 'pending' },
      { name: 'Router Navigation: Training', status: 'pending' },
      { name: 'Router Navigation: Document Control', status: 'pending' },
      { name: 'Router Navigation: Complaints', status: 'pending' }
    ]);
    
    try {
      // Run database tests
      const dbConnectionResult = await testDatabase();
      updateDatabaseTests(0, dbConnectionResult);
      
      const supabaseAuthResult = await testSupabaseAuth();
      updateDatabaseTests(1, { 
        name: 'Supabase Auth', 
        status: supabaseAuthResult.status === 'success' ? 'passing' : 'failing',
        message: supabaseAuthResult.details,
        details: supabaseAuthResult.error
      });
      
      const supabaseDbResult = await testSupabaseDatabase();
      updateDatabaseTests(2, { 
        name: 'Supabase Database', 
        status: supabaseDbResult.status === 'success' ? 'passing' : 'failing',
        message: supabaseDbResult.details,
        details: supabaseDbResult.error
      });
      
      // Run table tests
      const tables = [
        'complaints', 'capa_actions', 'training_records', 
        'training_sessions', 'training_plans', 'documents'
      ];
      
      for (const table of tables) {
        try {
          const tableResult = await testDatabaseTable(table);
          addTableTest(tableResult);
        } catch (error) {
          console.error(`Error testing table ${table}:`, error);
        }
      }
      
      // Run integration tests
      const capaIntegration = await testServiceIntegration('CAPA');
      updateIntegrationTests(1, capaIntegration);
      
      const docIntegration = await testServiceIntegration('Documents');
      updateIntegrationTests(0, docIntegration);
      
      const trainingIntegration = await testServiceIntegration('Training');
      updateIntegrationTests(2, trainingIntegration);
      
      const complaintIntegration = await testServiceIntegration('Complaints');
      updateIntegrationTests(3, complaintIntegration);
      
      const crossModuleIntegration = await testCrossModuleIntegration();
      updateIntegrationTests(4, crossModuleIntegration);
      
      // Run UI tests
      const capaNav = await testRouterNavigation('/capa');
      updateUiTests(0, capaNav);
      
      const trainingNav = await testRouterNavigation('/training');
      updateUiTests(1, trainingNav);
      
      const docNav = await testRouterNavigation('/documents');
      updateUiTests(2, docNav);
      
      const complaintNav = await testRouterNavigation('/complaints');
      updateUiTests(3, complaintNav);
      
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setLoading(false);
      calculateOverallProgress();
    }
  };

  const updateDatabaseTests = (index: number, result: FunctionTestResult) => {
    setDatabaseTests(prev => {
      const newTests = [...prev];
      newTests[index] = result;
      return newTests;
    });
  };

  const addTableTest = (result: DatabaseTestResult) => {
    setTableTests(prev => [...prev, result]);
  };

  const updateIntegrationTests = (index: number, result: FunctionTestResult) => {
    setIntegrationTests(prev => {
      const newTests = [...prev];
      newTests[index] = result;
      return newTests;
    });
  };

  const updateUiTests = (index: number, result: FunctionTestResult) => {
    setUiTests(prev => {
      const newTests = [...prev];
      newTests[index] = result;
      return newTests;
    });
  };

  const calculateOverallProgress = () => {
    const totalTests = databaseTests.length + tableTests.length + integrationTests.length + uiTests.length;
    const passedTests = [
      ...databaseTests,
      ...integrationTests,
      ...uiTests
    ].filter(test => test.status === 'passing').length;
    
    const tablePassedTests = tableTests.filter(test => test.status === 'success').length;
    
    const progress = Math.round(((passedTests + tablePassedTests) / totalTests) * 100);
    setOverallProgress(progress);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Testing and Verification</h1>
        <Button onClick={runTests} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Running Tests...' : 'Run Tests'}
        </Button>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Overall Test Progress</span>
              <Badge>{overallProgress}% Complete</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-3" />
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div className="p-3 bg-gray-50 rounded-md text-center">
                <div className="text-sm text-gray-500">Database Tests</div>
                <div className="font-semibold mt-1">
                  {databaseTests.filter(test => test.status === 'passing').length} / {databaseTests.length}
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md text-center">
                <div className="text-sm text-gray-500">Table Tests</div>
                <div className="font-semibold mt-1">
                  {tableTests.filter(test => test.status === 'success').length} / {tableTests.length}
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md text-center">
                <div className="text-sm text-gray-500">Integration Tests</div>
                <div className="font-semibold mt-1">
                  {integrationTests.filter(test => test.status === 'passing').length} / {integrationTests.length}
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md text-center">
                <div className="text-sm text-gray-500">UI Tests</div>
                <div className="font-semibold mt-1">
                  {uiTests.filter(test => test.status === 'passing').length} / {uiTests.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-primary" />
              Database Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {databaseTests.map((test, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{test.name}</TableCell>
                    <TableCell>
                      <TestStatus status={test.status} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {test.message}
                      {test.status === 'failing' && test.details && (
                        <p className="text-red-600 text-xs mt-1">{test.details}</p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Server className="h-5 w-5 mr-2 text-primary" />
              Database Table Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Time (ms)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableTests.map((test, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{test.tableName}</TableCell>
                    <TableCell>
                      <TestStatus status={test.status} />
                    </TableCell>
                    <TableCell>{test.recordCount || 0}</TableCell>
                    <TableCell>{test.duration || '-'}</TableCell>
                  </TableRow>
                ))}
                {tableTests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">No table tests run yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <ArrowRight className="h-5 w-5 mr-2 text-primary" />
              Service Integration Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {integrationTests.map((test, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{test.name}</TableCell>
                    <TableCell>
                      <TestStatus status={test.status} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {test.message}
                      {test.status === 'failing' && test.details && (
                        <p className="text-red-600 text-xs mt-1">{test.details}</p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Server className="h-5 w-5 mr-2 text-primary" />
              UI Navigation Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uiTests.map((test, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{test.name}</TableCell>
                    <TableCell>
                      <TestStatus status={test.status} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {test.message}
                      {test.status === 'failing' && test.details && (
                        <p className="text-red-600 text-xs mt-1">{test.details}</p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestingVerification;
