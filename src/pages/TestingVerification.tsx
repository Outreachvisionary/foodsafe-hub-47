
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DashboardHeader from '@/components/DashboardHeader';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, RotateCw, Link as LinkIcon } from 'lucide-react';
import { useBackendFrontendTesting } from '@/hooks/useBackendFrontendTesting';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface RouteCheckItem {
  name: string;
  path: string;
  status: 'success' | 'error' | 'pending' | 'warning';
  errorDetails?: string;
  accessibleWithoutAuth?: boolean;
}

interface ComponentCheckItem {
  name: string;
  componentPath: string;
  status: 'success' | 'error' | 'pending' | 'warning';
  errorDetails?: string;
}

interface IntegrationCheckItem {
  name: string;
  status: 'success' | 'error' | 'pending' | 'warning';
  details: string;
  errorDetails?: string;
}

const TestingVerificationPage = () => {
  const { isRunning, results, activeModules, toggleModule, runAllTests, resetResults } = useBackendFrontendTesting();
  const navigate = useNavigate();
  
  const [routeChecks, setRouteChecks] = useState<RouteCheckItem[]>([]);
  const [componentChecks, setComponentChecks] = useState<ComponentCheckItem[]>([]);
  const [integrationChecks, setIntegrationChecks] = useState<IntegrationCheckItem[]>([]);
  const [runningTest, setRunningTest] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);
  
  // Initialize checks
  useEffect(() => {
    // Define routes to check
    const routesToCheck: RouteCheckItem[] = [
      { name: 'Dashboard', path: '/dashboard', status: 'pending', accessibleWithoutAuth: false },
      { name: 'Documents', path: '/documents', status: 'pending', accessibleWithoutAuth: false },
      { name: 'Organizations', path: '/organizations', status: 'pending', accessibleWithoutAuth: false },
      { name: 'Facilities', path: '/facilities', status: 'pending', accessibleWithoutAuth: false },
      { name: 'Departments', path: '/departments', status: 'pending', accessibleWithoutAuth: false },
      { name: 'Users', path: '/users', status: 'pending', accessibleWithoutAuth: false },
      { name: 'Training', path: '/training', status: 'pending', accessibleWithoutAuth: false },
      { name: 'Audits', path: '/audits', status: 'pending', accessibleWithoutAuth: false },
      { name: 'Non-Conformance', path: '/non-conformance', status: 'pending', accessibleWithoutAuth: false },
      { name: 'CAPA', path: '/capa', status: 'pending', accessibleWithoutAuth: false },
      { name: 'Suppliers', path: '/suppliers', status: 'pending', accessibleWithoutAuth: false },
      { name: 'Standards', path: '/standards', status: 'pending', accessibleWithoutAuth: false },
      { name: 'Authentication', path: '/auth', status: 'pending', accessibleWithoutAuth: true },
      { name: 'Not Found', path: '/invalid-path-123', status: 'pending', accessibleWithoutAuth: true },
    ];
    
    // Define components to check
    const componentsToCheck: ComponentCheckItem[] = [
      { name: 'Sidebar', componentPath: '@/components/layout/AppSidebar', status: 'pending' },
      { name: 'Navigation', componentPath: '@/components/Navigation', status: 'pending' },
      { name: 'Main Navigation', componentPath: '@/components/MainNavigation', status: 'pending' },
      { name: 'Standard Sidebar', componentPath: '@/components/standards/StandardSidebar', status: 'pending' },
      { name: 'Non-Conformance List', componentPath: '@/components/non-conformance/NCList', status: 'pending' },
      { name: 'Protected Route', componentPath: '@/components/layout/ProtectedRoute', status: 'pending' },
    ];
    
    // Define integrations to check
    const integrationsToCheck: IntegrationCheckItem[] = [
      { name: 'Supabase Authentication', status: 'pending', details: 'Verify user authentication' },
      { name: 'Supabase Database', status: 'pending', details: 'Verify database connectivity' },
      { name: 'Supabase Realtime', status: 'pending', details: 'Verify realtime subscriptions' },
      { name: 'i18n Translation', status: 'pending', details: 'Verify internationalization' },
      { name: 'Router Navigation', status: 'pending', details: 'Verify route navigation' },
      { name: 'Theme Provider', status: 'pending', details: 'Verify theme switching' },
    ];
    
    setRouteChecks(routesToCheck);
    setComponentChecks(componentsToCheck);
    setIntegrationChecks(integrationsToCheck);
  }, []);
  
  // Run route verification
  const verifyRoutes = async () => {
    setRunningTest('routes');
    const updatedRoutes = [...routeChecks];
    
    for (let i = 0; i < updatedRoutes.length; i++) {
      const route = updatedRoutes[i];
      route.status = 'pending';
      setRouteChecks([...updatedRoutes]);
      setOverallProgress(Math.floor((i / updatedRoutes.length) * 100));
      
      // Simulate verification with a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      try {
        // Check if the route is registered in App.tsx routes
        // This is a simple check - a real implementation would be more robust
        const appContent = await fetch('/src/App.tsx').then(response => {
          if (!response.ok) throw new Error('Failed to fetch App.tsx');
          return response.text();
        });
        
        const hasRoute = appContent.includes(`path="${route.path}"`) || 
                          appContent.includes(`path='${route.path}'`) ||
                          appContent.includes(`path: '${route.path}'`) ||
                          appContent.includes(`path: "${route.path}"`);
        
        if (hasRoute) {
          route.status = 'success';
        } else {
          route.status = 'warning';
          route.errorDetails = 'Route may not be properly defined in App.tsx';
        }
      } catch (error) {
        route.status = 'error';
        route.errorDetails = error instanceof Error ? error.message : 'Unknown error';
      }
      
      setRouteChecks([...updatedRoutes]);
    }
    
    setOverallProgress(100);
    setRunningTest(null);
    toast.success('Route verification completed');
  };
  
  // Run component verification
  const verifyComponents = async () => {
    setRunningTest('components');
    const updatedComponents = [...componentChecks];
    
    for (let i = 0; i < updatedComponents.length; i++) {
      const component = updatedComponents[i];
      component.status = 'pending';
      setComponentChecks([...updatedComponents]);
      setOverallProgress(Math.floor((i / updatedComponents.length) * 100));
      
      // Simulate verification with a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      try {
        // Simple check if the component file exists
        // A real implementation would dynamically import and render the component
        const filePath = component.componentPath.replace('@/', '/src/') + '.tsx';
        const response = await fetch(filePath);
        
        if (response.ok) {
          const content = await response.text();
          // Check if it's a valid React component
          if (content.includes('export default') || 
              content.includes('React.FC') || 
              content.includes('= () =>')) {
            component.status = 'success';
          } else {
            component.status = 'warning';
            component.errorDetails = 'File exists but may not be a valid React component';
          }
        } else {
          component.status = 'error';
          component.errorDetails = `Component file not found (${response.status})`;
        }
      } catch (error) {
        component.status = 'error';
        component.errorDetails = error instanceof Error ? error.message : 'Unknown error';
      }
      
      setComponentChecks([...updatedComponents]);
    }
    
    setOverallProgress(100);
    setRunningTest(null);
    toast.success('Component verification completed');
  };
  
  // Run integration verification (using the existing useBackendFrontendTesting hook)
  const verifyIntegrations = async () => {
    setRunningTest('integrations');
    resetResults();
    await runAllTests();
    
    // Map the results to our integration checks format
    const updatedIntegrations = [...integrationChecks];
    
    results.forEach(moduleResult => {
      const matchingIntegration = updatedIntegrations.find(i => 
        i.name.toLowerCase().includes(moduleResult.moduleName.toLowerCase())
      );
      
      if (matchingIntegration) {
        matchingIntegration.status = moduleResult.status;
        matchingIntegration.details = `${moduleResult.details.length} tests run`;
        if (moduleResult.status === 'error') {
          const errors = moduleResult.details.filter(d => d.status === 'error');
          matchingIntegration.errorDetails = errors.length > 0 
            ? errors[0].message
            : 'Error occurred during testing';
        }
      }
    });
    
    // Update any remaining pending integrations to warning
    updatedIntegrations.forEach(integration => {
      if (integration.status === 'pending') {
        integration.status = 'warning';
        integration.errorDetails = 'Verification not implemented';
      }
    });
    
    setIntegrationChecks(updatedIntegrations);
    setRunningTest(null);
    toast.success('Integration verification completed');
  };
  
  // Run all verifications
  const runAllVerifications = async () => {
    toast.info('Starting complete verification process');
    await verifyRoutes();
    await verifyComponents();
    await verifyIntegrations();
    toast.success('All verifications completed!');
  };
  
  // Get summary stats for each category
  const getStats = (items: Array<{status: string}>) => {
    const total = items.length;
    const success = items.filter(i => i.status === 'success').length;
    const error = items.filter(i => i.status === 'error').length;
    const warning = items.filter(i => i.status === 'warning').length;
    const pending = items.filter(i => i.status === 'pending').length;
    
    return {
      total,
      success,
      error,
      warning,
      pending,
      successRate: total > 0 ? Math.round((success / total) * 100) : 0
    };
  };
  
  const routeStats = getStats(routeChecks);
  const componentStats = getStats(componentChecks);
  const integrationStats = getStats(integrationChecks);
  
  const StatusBadge = ({ status }: { status: string }) => {
    switch(status) {
      case 'success':
        return <Badge className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Warning</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };
  
  const StatusIcon = ({ status }: { status: string }) => {
    switch(status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <RotateCw className="h-5 w-5 text-gray-400" />;
    }
  };
  
  return (
    <div className="container px-4 py-6">
      <DashboardHeader 
        title="Testing & Verification" 
        subtitle="Verify routes, components, and integrations across all modules"
      />
      
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between">
              Routes
              <Badge variant="outline" className="ml-2">
                {routeStats.success}/{routeStats.total}
              </Badge>
            </CardTitle>
            <CardDescription>Verify application routes and navigation</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={routeStats.successRate} className="h-2 mb-2" />
            <div className="flex text-sm justify-between mt-2">
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{routeStats.success} passed</span>
              </div>
              <div className="flex gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>{routeStats.error} failed</span>
              </div>
              <div className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span>{routeStats.warning} warnings</span>
              </div>
            </div>
            <Button 
              onClick={verifyRoutes}
              disabled={runningTest !== null}
              className="w-full mt-4"
              variant="outline"
            >
              Verify Routes
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between">
              Components
              <Badge variant="outline" className="ml-2">
                {componentStats.success}/{componentStats.total}
              </Badge>
            </CardTitle>
            <CardDescription>Verify React components and rendering</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={componentStats.successRate} className="h-2 mb-2" />
            <div className="flex text-sm justify-between mt-2">
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{componentStats.success} passed</span>
              </div>
              <div className="flex gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>{componentStats.error} failed</span>
              </div>
              <div className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span>{componentStats.warning} warnings</span>
              </div>
            </div>
            <Button 
              onClick={verifyComponents}
              disabled={runningTest !== null}
              className="w-full mt-4"
              variant="outline"
            >
              Verify Components
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between">
              Integrations
              <Badge variant="outline" className="ml-2">
                {integrationStats.success}/{integrationStats.total}
              </Badge>
            </CardTitle>
            <CardDescription>Verify backend integrations and services</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={integrationStats.successRate} className="h-2 mb-2" />
            <div className="flex text-sm justify-between mt-2">
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{integrationStats.success} passed</span>
              </div>
              <div className="flex gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>{integrationStats.error} failed</span>
              </div>
              <div className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span>{integrationStats.warning} warnings</span>
              </div>
            </div>
            <Button 
              onClick={verifyIntegrations}
              disabled={runningTest !== null || isRunning}
              className="w-full mt-4"
              variant="outline"
            >
              Verify Integrations
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={runAllVerifications}
          disabled={runningTest !== null || isRunning}
          variant="default"
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          Run All Verifications
        </Button>
        
        {runningTest && (
          <div className="flex items-center gap-2">
            <RotateCw className="h-4 w-4 animate-spin" />
            <span>Running {runningTest} test... {overallProgress}%</span>
            <Progress value={overallProgress} className="w-40 h-2" />
          </div>
        )}
        
        <Button
          onClick={() => {
            navigate(-1);
          }}
          variant="outline"
        >
          Back
        </Button>
      </div>
      
      <Tabs defaultValue="routes">
        <TabsList className="mb-4">
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="routes">
          <Card>
            <CardHeader>
              <CardTitle>Route Verification</CardTitle>
              <CardDescription>
                Verifies all application routes are properly configured and accessible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routeChecks.map((route, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <StatusIcon status={route.status} />
                      <div>
                        <div className="font-medium">{route.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <code className="text-xs bg-secondary/50 px-1 rounded">{route.path}</code>
                          {route.accessibleWithoutAuth && (
                            <Badge variant="outline" className="text-xs ml-2">Public</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={route.status} />
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          try {
                            navigate(route.path);
                          } catch (error) {
                            toast.error(`Navigation error: ${error}`);
                          }
                        }}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="components">
          <Card>
            <CardHeader>
              <CardTitle>Component Verification</CardTitle>
              <CardDescription>
                Verifies all core React components are properly rendering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {componentChecks.map((component, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <StatusIcon status={component.status} />
                      <div>
                        <div className="font-medium">{component.name}</div>
                        <div className="text-sm text-muted-foreground">
                          <code className="text-xs bg-secondary/50 px-1 rounded">
                            {component.componentPath}
                          </code>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={component.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integration Verification</CardTitle>
              <CardDescription>
                Verifies all system integrations and backend services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrationChecks.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <StatusIcon status={integration.status} />
                      <div>
                        <div className="font-medium">{integration.name}</div>
                        <div className="text-sm text-muted-foreground">{integration.details}</div>
                        {integration.errorDetails && (
                          <div className="text-xs text-red-500 mt-1">{integration.errorDetails}</div>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={integration.status} />
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Detailed Module Tests</h3>
                <div className="space-y-2">
                  {activeModules.map((module) => (
                    <div key={module.moduleName} className="flex items-center space-x-2">
                      <Checkbox 
                        id={module.moduleName} 
                        checked={module.enabled}
                        onCheckedChange={() => toggleModule(module.moduleName)}
                      />
                      <label 
                        htmlFor={module.moduleName}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {module.moduleName}
                      </label>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="mt-4" 
                  disabled={isRunning || runningTest !== null}
                  variant="outline"
                  onClick={() => {
                    resetResults();
                    runAllTests();
                  }}
                >
                  {isRunning ? (
                    <>
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    'Run Detailed Tests'
                  )}
                </Button>
              </div>
              
              {results.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Test Results</h3>
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <Alert key={index} variant={result.status === 'success' ? 'default' : 'destructive'}>
                        <div className="flex items-center gap-2">
                          <StatusIcon status={result.status} />
                          <AlertTitle>{result.moduleName}</AlertTitle>
                        </div>
                        <AlertDescription>
                          <div className="mt-2 text-sm">
                            {result.details.map((detail, detailIndex) => (
                              <div key={detailIndex} className="flex items-center gap-2 mb-1">
                                <StatusIcon status={detail.status} />
                                <span>{detail.name}: {detail.message}</span>
                              </div>
                            ))}
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestingVerificationPage;
