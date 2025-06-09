
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader, CheckCircle2, XCircle, AlertTriangle, Database, Server, Link2, ArrowRight } from 'lucide-react';
import {
  testDatabase,
  testDatabaseTable,
  testSupabaseAuth,
  testSupabaseDatabase,
  testServiceIntegration,
  testRouterNavigation,
  testCrossModuleIntegration,
  type TestResult,
  type FunctionTestResult,
  type DatabaseTestResult
} from '@/utils/databaseTestUtils';

const TestingVerification: React.FC = () => {
  const [activeTab, setActiveTab] = useState('database');
  const [databaseStatus, setDatabaseStatus] = useState<TestResult>({
    status: 'warning',
    details: 'Test not run yet'
  });
  
  const [databaseTableResults, setDatabaseTableResults] = useState<TestResult[]>([]);
  const [authResults, setAuthResults] = useState<TestResult>({
    status: 'error',
    details: 'Test not run yet'
  });
  
  const [functionResults, setFunctionResults] = useState<FunctionTestResult[]>([]);
  const [integrationResults, setIntegrationResults] = useState<FunctionTestResult[]>([]);
  const [navigationResults, setNavigationResults] = useState<FunctionTestResult[]>([]);
  
  const [loading, setLoading] = useState<{
    database: boolean;
    tables: boolean;
    functions: boolean;
    integrations: boolean;
    navigation: boolean;
  }>({
    database: false,
    tables: false,
    functions: false,
    integrations: false,
    navigation: false
  });
  
  const { toast } = useToast();
  
  // Run database connection test on initial load
  useEffect(() => {
    handleTestDatabase();
  }, []);
  
  const handleTestDatabase = async () => {
    try {
      setLoading(prev => ({ ...prev, database: true }));
      const result = await testSupabaseDatabase();
      setDatabaseStatus(result);
      
      // If database test passes, also test auth
      if (result.status === 'success') {
        const authResult = await testSupabaseAuth();
        setAuthResults(authResult);
      }
      
      toast({
        title: `Database Test ${result.status === 'success' ? 'Passed' : 'Failed'}`,
        description: result.details,
        variant: result.status === 'success' ? 'default' : 'destructive'
      });
    } catch (error) {
      console.error('Error testing database:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while testing the database connection',
        variant: 'destructive'
      });
    } finally {
      setLoading(prev => ({ ...prev, database: false }));
    }
  };
  
  const handleTestDatabaseTables = async () => {
    try {
      setLoading(prev => ({ ...prev, tables: true }));
      setDatabaseTableResults([]);
      
      // Test common tables
      const tablesPromises = [
        testDatabaseTable('documents'),
        testDatabaseTable('training_records'),
        testDatabaseTable('suppliers'),
        testDatabaseTable('capa_actions'),
        testDatabaseTable('complaints'),
        testDatabaseTable('audits'),
        testDatabaseTable('non_conformances'),
        testDatabaseTable('profiles')
      ];
      
      const results = await Promise.all(tablesPromises);
      setDatabaseTableResults(results);
      
      const failedTables = results.filter(r => r.status === 'error').length;
      
      toast({
        title: failedTables > 0 ? `${failedTables} Table Tests Failed` : 'All Table Tests Passed',
        description: failedTables > 0 
          ? `${results.length - failedTables} of ${results.length} tables are accessible`
          : `Successfully tested ${results.length} database tables`,
        variant: failedTables > 0 ? 'destructive' : 'default'
      });
    } catch (error) {
      console.error('Error testing database tables:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while testing database tables',
        variant: 'destructive'
      });
    } finally {
      setLoading(prev => ({ ...prev, tables: false }));
    }
  };
  
  const handleTestIntegrations = async () => {
    try {
      setLoading(prev => ({ ...prev, integrations: true }));
      setIntegrationResults([]);
      
      // Test various service integrations
      const integrationsPromises = [
        testServiceIntegration(),
        testCrossModuleIntegration()
      ];
      
      const results = await Promise.all(integrationsPromises);
      setIntegrationResults(results);
      
      const failedIntegrations = results.filter(r => r.status === 'error').length;
      
      toast({
        title: failedIntegrations > 0 ? `${failedIntegrations} Integration Tests Failed` : 'All Integration Tests Passed',
        description: failedIntegrations > 0 
          ? `${results.length - failedIntegrations} of ${results.length} integrations are working`
          : `Successfully tested ${results.length} service integrations`,
        variant: failedIntegrations > 0 ? 'destructive' : 'default'
      });
    } catch (error) {
      console.error('Error testing integrations:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while testing integrations',
        variant: 'destructive'
      });
    } finally {
      setLoading(prev => ({ ...prev, integrations: false }));
    }
  };
  
  const handleTestNavigation = async () => {
    try {
      setLoading(prev => ({ ...prev, navigation: true }));
      setNavigationResults([]);
      
      // Test various routes
      const navigationPromises = [
        testRouterNavigation('/dashboard'),
        testRouterNavigation('/documents'),
        testRouterNavigation('/training'),
        testRouterNavigation('/capa'),
        testRouterNavigation('/suppliers')
      ];
      
      const results = await Promise.all(navigationPromises);
      setNavigationResults(results);
      
      const failedRoutes = results.filter(r => r.status === 'error').length;
      
      toast({
        title: failedRoutes > 0 ? `${failedRoutes} Route Tests Failed` : 'All Route Tests Passed',
        description: failedRoutes > 0 
          ? `${results.length - failedRoutes} of ${results.length} routes are working`
          : `Successfully tested ${results.length} application routes`,
        variant: failedRoutes > 0 ? 'destructive' : 'default'
      });
    } catch (error) {
      console.error('Error testing navigation:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while testing navigation',
        variant: 'destructive'
      });
    } finally {
      setLoading(prev => ({ ...prev, navigation: false }));
    }
  };
  
  const renderStatusIcon = (status: string) => {
    if (status === 'warning') {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    } else if (status === 'success') {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else if (status === 'error') {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>System Verification & Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="database">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button 
                    onClick={handleTestDatabase} 
                    disabled={loading.database}
                    className="flex items-center"
                  >
                    {loading.database ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
                    Test Database Connection
                  </Button>
                  
                  <Button 
                    onClick={handleTestDatabaseTables} 
                    disabled={loading.tables || databaseStatus.status !== 'success'}
                    className="flex items-center"
                    variant="outline"
                  >
                    {loading.tables ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Server className="h-4 w-4 mr-2" />}
                    Test Database Tables
                  </Button>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Connection Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {renderStatusIcon(databaseStatus.status)}
                          </div>
                          <div>
                            <div className="font-medium">Database Connection</div>
                            <div className="text-sm text-gray-500">{databaseStatus.details}</div>
                          </div>
                        </div>
                        <div className="capitalize font-medium text-sm">
                          {databaseStatus.status}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {renderStatusIcon(authResults.status)}
                          </div>
                          <div>
                            <div className="font-medium">Auth System</div>
                            <div className="text-sm text-gray-500">{authResults.details}</div>
                          </div>
                        </div>
                        <div className="capitalize font-medium text-sm">
                          {authResults.status}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {databaseTableResults.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Database Tables</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {databaseTableResults.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center">
                              <div className="mr-3">
                                {renderStatusIcon(result.status)}
                              </div>
                              <div>
                                <div className="font-medium">{result.tableName}</div>
                                <div className="text-sm text-gray-500">
                                  {result.status === 'success' 
                                    ? `${result.recordCount || 0} records (${result.duration || 0}ms)`
                                    : result.details
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="capitalize font-medium text-sm">
                              {result.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="integrations">
              <div className="space-y-4">
                <Button 
                  onClick={handleTestIntegrations} 
                  disabled={loading.integrations}
                  className="flex items-center"
                >
                  {loading.integrations ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Link2 className="h-4 w-4 mr-2" />}
                  Test Service Integrations
                </Button>
                
                {integrationResults.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Integration Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {integrationResults.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center">
                              <div className="mr-3">
                                {renderStatusIcon(result.status)}
                              </div>
                              <div>
                                <div className="font-medium">{result.functionName}</div>
                                <div className="text-sm text-gray-500">{result.details}</div>
                                {result.error && (
                                  <div className="text-xs text-gray-400">{result.error}</div>
                                )}
                              </div>
                            </div>
                            <div className="capitalize font-medium text-sm">
                              {result.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="navigation">
              <div className="space-y-4">
                <Button 
                  onClick={handleTestNavigation} 
                  disabled={loading.navigation}
                  className="flex items-center"
                >
                  {loading.navigation ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <ArrowRight className="h-4 w-4 mr-2" />}
                  Test Navigation Routes
                </Button>
                
                {navigationResults.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Navigation Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {navigationResults.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center">
                              <div className="mr-3">
                                {renderStatusIcon(result.status)}
                              </div>
                              <div>
                                <div className="font-medium">{result.functionName}</div>
                                <div className="text-sm text-gray-500">{result.details}</div>
                                {result.error && (
                                  <div className="text-xs text-gray-400">{result.error}</div>
                                )}
                              </div>
                            </div>
                            <div className="capitalize font-medium text-sm">
                              {result.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestingVerification;
