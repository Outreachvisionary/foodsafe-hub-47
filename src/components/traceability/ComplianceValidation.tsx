
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, FileText, X, Info, Check } from 'lucide-react';
import { BatchTrace } from '@/types/traceability';
import { ComplianceValidationResult, ValidationScenario } from '@/types/compliance';
import { validateFSMA204Compliance, VALIDATION_SCENARIOS, runValidationScenario, validateAllScenarios } from '@/services/fsma204ValidationService';
import { toast } from 'sonner';

interface ComplianceValidationProps {
  batch?: BatchTrace;
}

const ComplianceValidation: React.FC<ComplianceValidationProps> = ({ batch }) => {
  const [validationResult, setValidationResult] = useState<ComplianceValidationResult | null>(null);
  const [scenarioResults, setScenarioResults] = useState<any[] | null>(null);
  const [scenarioSummary, setScenarioSummary] = useState<any | null>(null);
  
  const handleValidateBatch = () => {
    if (!batch) {
      toast.error("No batch selected for validation");
      return;
    }
    
    const result = validateFSMA204Compliance(batch);
    setValidationResult(result);
    
    if (result.passed) {
      toast.success("Batch passes FSMA 204 compliance validation");
    } else {
      toast.error(`Batch fails ${result.failedChecks.length} FSMA 204 compliance checks`);
    }
  };
  
  const handleRunAllScenarios = () => {
    const { results, summary } = validateAllScenarios();
    setScenarioResults(results);
    setScenarioSummary(summary);
    
    if (summary.passRate === 100) {
      toast.success("All validation scenarios passed successfully");
    } else {
      toast.error(`Validation framework passed ${summary.passingTests} of ${summary.totalTests} scenarios`);
    }
  };
  
  const handleRunScenario = (scenarioId: string) => {
    try {
      const result = runValidationScenario(scenarioId);
      
      if (result.match) {
        toast.success(`Scenario test passed: expected ${result.expected}, got ${result.result}`);
      } else {
        toast.error(`Scenario test failed: expected ${result.expected}, got ${result.result}`);
      }
      
      // Update the specific scenario in the results
      if (scenarioResults) {
        const updatedResults = scenarioResults.map(r => 
          r.scenario === VALIDATION_SCENARIOS.find(s => s.id === scenarioId)?.name 
            ? { ...r, ...result }
            : r
        );
        setScenarioResults(updatedResults);
        
        // Update summary
        const passingTests = updatedResults.filter(r => r.match).length;
        const totalTests = updatedResults.length;
        setScenarioSummary({
          passingTests,
          totalTests,
          passRate: (passingTests / totalTests) * 100
        });
      }
    } catch (error) {
      console.error('Error running scenario:', error);
      toast.error(`Error running scenario ${scenarioId}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            FSMA 204 Compliance Validation
          </CardTitle>
          <CardDescription>
            Test your recall procedures against FDA's FSMA 204 requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {batch ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Selected: {batch.product} (Batch {batch.id})
                </Badge>
                <Button onClick={handleValidateBatch} size="sm">
                  Run Compliance Check
                </Button>
              </div>
              
              {validationResult && (
                <div className="space-y-4">
                  <Alert
                    variant={validationResult.passed ? "default" : "destructive"}
                    className={validationResult.passed ? "bg-green-50 border-green-200" : undefined}
                  >
                    {validationResult.passed ? 
                      <CheckCircle className="h-4 w-4" /> : 
                      <AlertTriangle className="h-4 w-4" />
                    }
                    <AlertTitle>
                      {validationResult.passed ? "Compliance Validated" : "Compliance Issues Found"}
                    </AlertTitle>
                    <AlertDescription>
                      {validationResult.passed ? 
                        `This batch meets all critical FSMA 204 requirements with ${validationResult.score.toFixed(0)}% compliance score.` :
                        `This batch fails ${validationResult.failedChecks.filter(c => c.impact === 'Critical').length} critical compliance checks.`
                      }
                    </AlertDescription>
                  </Alert>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Status</TableHead>
                        <TableHead>Requirement</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Impact</TableHead>
                        <TableHead className="text-right">Regulation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validationResult.passedChecks.map(check => (
                        <TableRow key={check.id}>
                          <TableCell>
                            <Check className="h-5 w-5 text-green-600" />
                          </TableCell>
                          <TableCell>{check.description}</TableCell>
                          <TableCell>{check.category}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={
                                check.impact === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                                check.impact === 'Major' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                              }
                            >
                              {check.impact}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            {check.regulationRef}
                          </TableCell>
                        </TableRow>
                      ))}
                      {validationResult.failedChecks.map(check => (
                        <TableRow key={check.id} className="bg-red-50">
                          <TableCell>
                            <X className="h-5 w-5 text-red-600" />
                          </TableCell>
                          <TableCell className="font-medium">{check.description}</TableCell>
                          <TableCell>{check.category}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={
                                check.impact === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                                check.impact === 'Major' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                              }
                            >
                              {check.impact}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            {check.regulationRef}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg border">
              <Info className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No batch selected for validation</p>
              <p className="text-sm text-gray-400 mt-1">Select a batch or run validation scenarios</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <p className="text-sm text-gray-500">
            <Info className="h-4 w-4 inline mr-1" />
            FSMA 204 compliance required by January 2026
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRunAllScenarios}
          >
            Run All Test Scenarios
          </Button>
        </CardFooter>
      </Card>
      
      {scenarioResults && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Test Results</CardTitle>
            <CardDescription>
              Testing framework validates {scenarioResults.length} recall scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scenarioSummary && (
              <Alert className={scenarioSummary.passRate === 100 ? "bg-green-50 border-green-200 mb-4" : "mb-4"}>
                <AlertTitle className="flex items-center gap-2">
                  {scenarioSummary.passRate === 100 ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> :
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  }
                  Framework Validation: {scenarioSummary.passRate.toFixed(0)}% Pass Rate
                </AlertTitle>
                <AlertDescription>
                  {scenarioSummary.passingTests} of {scenarioSummary.totalTests} scenarios passing validation
                </AlertDescription>
              </Alert>
            )}
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scenario</TableHead>
                  <TableHead>Expected Result</TableHead>
                  <TableHead>Actual Result</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scenarioResults.map((result, index) => {
                  const scenario = VALIDATION_SCENARIOS[index];
                  return (
                    <TableRow key={scenario.id}>
                      <TableCell>
                        <div className="font-medium">{result.scenario}</div>
                        <div className="text-xs text-gray-500">{scenario.description}</div>
                      </TableCell>
                      <TableCell>{result.expected ? "Recall" : "No Recall"}</TableCell>
                      <TableCell>{result.result ? "Recall" : "No Recall"}</TableCell>
                      <TableCell>
                        {result.match ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Pass
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                            <X className="h-3 w-3 mr-1" />
                            Fail
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRunScenario(scenario.id)}
                        >
                          Retest
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComplianceValidation;
