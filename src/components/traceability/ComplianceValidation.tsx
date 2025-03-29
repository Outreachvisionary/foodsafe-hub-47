
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, AlertTriangle, CircleCheck, CircleX, PlayCircle } from 'lucide-react';
import { BatchTrace } from '@/types/traceability';
import { validateFSMA204Compliance, validateAllScenarios, VALIDATION_SCENARIOS } from '@/services/fsma204ValidationService';
import { toast } from 'sonner';

interface ComplianceValidationProps {
  batch?: BatchTrace | null;
}

const ComplianceValidation: React.FC<ComplianceValidationProps> = ({ batch }) => {
  const [validationResults, setValidationResults] = useState<any>(null);
  const [scenarioResults, setScenarioResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('batch');

  const runValidation = () => {
    if (!batch) {
      toast.error('No batch selected for validation');
      return;
    }
    
    try {
      const results = validateFSMA204Compliance(batch);
      setValidationResults(results);
      toast.success('Batch validation complete');
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Error validating batch');
    }
  };

  const runScenarioTests = () => {
    try {
      const results = validateAllScenarios();
      setScenarioResults(results);
      toast.success('Scenario tests complete');
    } catch (error) {
      console.error('Scenario test error:', error);
      toast.error('Error running scenario tests');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-blue-500" />
              FSMA 204 Compliance Validation
            </CardTitle>
            <CardDescription>Validate batch traceability against FDA requirements</CardDescription>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="batch">Batch Validation</TabsTrigger>
              <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <TabsContent value="batch" className="mt-0 space-y-4">
          {batch ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Selected Batch</h3>
                  <Button onClick={runValidation} size="sm">
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Run Validation
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm font-medium">Product:</span> {batch.product}
                    </div>
                    <div>
                      <span className="text-sm font-medium">Batch ID:</span> {batch.id}
                    </div>
                    <div>
                      <span className="text-sm font-medium">Date:</span> {batch.date}
                    </div>
                    <div>
                      <span className="text-sm font-medium">Status:</span> {batch.status}
                    </div>
                  </div>
                </div>
              </div>

              {validationResults && (
                <div className="space-y-4 mt-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      Validation Results
                      {validationResults.passed ? (
                        <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">Passed</Badge>
                      ) : (
                        <Badge className="ml-2 bg-red-100 text-red-800 border-red-200">Failed</Badge>
                      )}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">{Math.round(validationResults.score)}%</div>
                      <Progress value={validationResults.score} className="w-32" />
                    </div>
                  </div>

                  {!validationResults.passed && validationResults.failedChecks.some(check => check.impact === 'Critical') && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Critical Compliance Issues</AlertTitle>
                      <AlertDescription>
                        {validationResults.failedChecks.filter(check => check.impact === 'Critical').length} critical checks failed
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <div className="text-sm font-medium">Failed Checks:</div>
                    {validationResults.failedChecks.length === 0 ? (
                      <div className="text-sm text-gray-500">No failed checks</div>
                    ) : (
                      validationResults.failedChecks.map((check, index) => (
                        <div key={index} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <CircleX className={`h-4 w-4 ${check.impact === 'Critical' ? 'text-red-500' : 'text-amber-500'}`} />
                              <span className="font-medium">{check.id}: {check.description}</span>
                            </div>
                            <Badge variant={check.impact === 'Critical' ? 'destructive' : 'outline'}>
                              {check.impact}
                            </Badge>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            Regulation: {check.regulationRef || 'N/A'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium">Passed Checks:</div>
                    {validationResults.passedChecks.length === 0 ? (
                      <div className="text-sm text-gray-500">No passed checks</div>
                    ) : (
                      <div className="border rounded-lg p-3 bg-gray-50">
                        {validationResults.passedChecks.map((check, index) => (
                          <div key={index} className="flex items-center gap-2 py-1">
                            <CircleCheck className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{check.id}: {check.description}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <ClipboardCheck className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">No Batch Selected</h3>
              <p className="mt-1 text-sm text-gray-500">Select a batch from the dashboard to validate compliance</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="scenarios" className="mt-0 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Test Scenarios</h3>
              <Button onClick={runScenarioTests} size="sm">
                <PlayCircle className="h-4 w-4 mr-1" />
                Run All Scenarios
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VALIDATION_SCENARIOS.map(scenario => (
                <div key={scenario.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="font-medium mb-1">{scenario.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{scenario.description}</div>
                  
                  {scenarioResults && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm">
                        {scenarioResults.results.find(r => r.scenario === scenario.name)?.match 
                          ? 'Passed' 
                          : 'Failed'}
                      </span>
                      {scenarioResults.results.find(r => r.scenario === scenario.name)?.match 
                        ? <CircleCheck className="h-4 w-4 text-green-500" />
                        : <CircleX className="h-4 w-4 text-red-500" />
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {scenarioResults && (
            <div className="mt-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Summary</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {scenarioResults.summary.passingTests} / {scenarioResults.summary.totalTests} Passed
                  </span>
                  <Progress 
                    value={scenarioResults.summary.passRate} 
                    className="w-32"
                  />
                </div>
              </div>
              
              {scenarioResults.summary.passRate < 100 && (
                <Alert className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Attention Needed</AlertTitle>
                  <AlertDescription>
                    Some test scenarios failed. Review the results to ensure compliance.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default ComplianceValidation;
