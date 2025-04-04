
import React from 'react';
import { 
  useBackendFrontendTesting,
  ModuleTestResult,
  TestResultDetail
} from '@/hooks/useBackendFrontendTesting';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

const BackendFrontendTests: React.FC = () => {
  const { 
    isRunning, 
    results,
    activeModules,
    toggleModule,
    runAllTests,
    resetResults
  } = useBackendFrontendTesting();

  // Render test result status badge with appropriate color
  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const variants: Record<string, string> = {
      'success': 'bg-green-100 text-green-800 hover:bg-green-200',
      'error': 'bg-red-100 text-red-800 hover:bg-red-200',
      'partial': 'bg-amber-100 text-amber-800 hover:bg-amber-200',
      'pending': 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    };
    
    const statusText: Record<string, string> = {
      'success': 'Success',
      'error': 'Failed',
      'partial': 'Partial',
      'pending': 'Pending'
    };
    
    return (
      <Badge variant="outline" className={variants[status] || ''}>
        {statusText[status] || status}
      </Badge>
    );
  };

  // Render a single test result detail
  const TestDetail: React.FC<{ detail: TestResultDetail }> = ({ detail }) => {
    return (
      <div className="mb-4 p-3 border rounded-md bg-card">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">{detail.name}</h4>
          <StatusBadge status={detail.status} />
        </div>
        <p className="text-sm text-muted-foreground mb-2">{detail.message}</p>
        
        {detail.responseTime && (
          <p className="text-xs text-muted-foreground">
            Response time: {Math.round(detail.responseTime)}ms
          </p>
        )}
        
        {detail.errorDetails && (
          <div className="mt-2 p-2 bg-red-50 text-red-800 rounded text-xs font-mono whitespace-pre-wrap">
            {detail.errorDetails}
          </div>
        )}
        
        {detail.actionRequired && (
          <div className="mt-2 p-2 bg-blue-50 text-blue-800 rounded text-xs">
            <strong>Action required:</strong> {detail.actionRequired}
          </div>
        )}
      </div>
    );
  };

  // Render a module result with all its test details
  const ModuleResult: React.FC<{ result: ModuleTestResult }> = ({ result }) => {
    return (
      <AccordionItem value={result.moduleName}>
        <AccordionTrigger className="py-4 px-4 hover:bg-accent hover:text-accent-foreground rounded-md">
          <div className="flex w-full justify-between items-center">
            <span>{result.moduleName}</span>
            <StatusBadge status={result.status} />
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-2 pb-4">
          <p className="text-xs text-muted-foreground mb-4">
            Tests ran at {result.timestamp.toLocaleTimeString()} on {result.timestamp.toLocaleDateString()}
          </p>
          
          {result.details.map((detail, index) => (
            <TestDetail key={index} detail={detail} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle className="text-xl">Backend-to-Frontend Integration Tests</CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Module selection */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Select Modules to Test</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeModules.map((module) => (
              <div 
                key={module.moduleName} 
                className="flex items-center space-x-2"
              >
                <Checkbox 
                  id={`module-${module.moduleName}`}
                  checked={module.enabled}
                  onCheckedChange={() => toggleModule(module.moduleName)}
                  disabled={isRunning}
                />
                <label 
                  htmlFor={`module-${module.moduleName}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {module.moduleName}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Test results */}
        {results.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {results.map((result, index) => (
              <ModuleResult key={index} result={result} />
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No tests have been run yet. Select modules and click "Run Tests".
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={resetResults}
          disabled={isRunning || results.length === 0}
        >
          Reset Results
        </Button>
        <Button 
          onClick={runAllTests} 
          disabled={isRunning || activeModules.filter(m => m.enabled).length === 0}
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run Tests'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BackendFrontendTests;
