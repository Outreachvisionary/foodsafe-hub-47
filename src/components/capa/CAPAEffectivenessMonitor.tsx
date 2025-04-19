
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { CAPAEffectivenessMetrics } from '@/types/capa';
import { CheckCircle2, AlertCircle, AlertTriangle, BarChart, Clipboard, FileText } from 'lucide-react';

interface CAPAEffectivenessMonitorProps {
  capaId: string;
  title: string;
  implementationDate: string;
  onEffectivenessUpdate?: (data: CAPAEffectivenessMetrics) => void;
}

const CAPAEffectivenessMonitor: React.FC<CAPAEffectivenessMonitorProps> = ({
  capaId,
  title,
  implementationDate,
  onEffectivenessUpdate
}) => {
  const [activeTab, setActiveTab] = useState('criteria');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Track assessment values
  const [assessment, setAssessment] = useState({
    rootCauseEliminated: false,
    preventiveMeasuresImplemented: false,
    documentationComplete: false,
    recurrenceCheck: '',
    notes: '',
    score: 0,
    rating: 'partially-effective' as 'effective' | 'partially-effective' | 'ineffective'
  });
  
  // Toggle assessment values
  const toggleAssessmentValue = (key: string, value: boolean) => {
    setAssessment(prev => {
      const newAssessment = { ...prev, [key]: value };
      
      // Calculate score based on checked items
      let score = 0;
      if (newAssessment.rootCauseEliminated) score += 40;
      if (newAssessment.preventiveMeasuresImplemented) score += 40;
      if (newAssessment.documentationComplete) score += 20;
      
      // Determine rating based on score
      let rating: 'effective' | 'partially-effective' | 'ineffective' = 'partially-effective';
      if (score >= 85) rating = 'effective';
      else if (score <= 40) rating = 'ineffective';
      
      return { ...newAssessment, score, rating };
    });
  };
  
  // Submit assessment
  const submitAssessment = async () => {
    setLoading(true);
    
    try {
      // Create metrics object
      const metrics: CAPAEffectivenessMetrics = {
        id: `effectiveness-${capaId}`,
        capaId: capaId,
        assessmentDate: new Date().toISOString(),
        rootCauseEliminated: assessment.rootCauseEliminated,
        preventiveMeasuresImplemented: assessment.preventiveMeasuresImplemented,
        documentationComplete: assessment.documentationComplete,
        score: assessment.score,
        rating: assessment.rating,
        recurrenceCheck: assessment.recurrenceCheck,
        notes: assessment.notes,
        createdBy: user?.id || 'unknown'
      };
      
      // In a real app, we would save this to the database
      // For now, we'll just mock a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the onEffectivenessUpdate callback if provided
      if (onEffectivenessUpdate) {
        onEffectivenessUpdate(metrics);
      }
      
      toast({
        title: 'Assessment Submitted',
        description: 'CAPA effectiveness assessment has been recorded.',
      });
      
      // After submission, switch to the results tab
      setActiveTab('results');
    } catch (error) {
      console.error('Error submitting effectiveness assessment:', error);
      toast({
        title: 'Submission Failed',
        description: 'Unable to submit effectiveness assessment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'effective':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Effective
          </Badge>
        );
      case 'partially-effective':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Partially Effective
          </Badge>
        );
      case 'ineffective':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Ineffective
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Not Assessed
          </Badge>
        );
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <BarChart className="h-5 w-5 mr-2 text-primary" />
          CAPA Effectiveness Assessment
        </CardTitle>
        <CardDescription>
          Evaluate the effectiveness of corrective and preventive actions
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="criteria">Assessment Criteria</TabsTrigger>
            <TabsTrigger value="evaluate">Evaluate</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="criteria" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md border">
                <h3 className="font-medium mb-2">CAPA Information</h3>
                <p className="text-sm text-gray-600 mb-2">{title}</p>
                <p className="text-xs text-gray-500">
                  Implementation Date: {new Date(implementationDate).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Effectiveness Criteria</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="bg-primary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center mt-0.5 mr-2">1</span>
                    <div>
                      <p className="text-sm font-medium">Root Cause Elimination (40%)</p>
                      <p className="text-sm text-gray-600">Verify if the identified root cause has been eliminated</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <span className="bg-primary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center mt-0.5 mr-2">2</span>
                    <div>
                      <p className="text-sm font-medium">Preventive Measures (40%)</p>
                      <p className="text-sm text-gray-600">Confirm that preventive measures are in place to prevent recurrence</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <span className="bg-primary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center mt-0.5 mr-2">3</span>
                    <div>
                      <p className="text-sm font-medium">Documentation (20%)</p>
                      <p className="text-sm text-gray-600">Ensure all relevant documentation has been updated to reflect changes</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Effectiveness Ratings</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mr-2">Effective</span>
                    <p className="text-sm text-gray-600">Score of 85% or higher</p>
                  </li>
                  
                  <li className="flex items-center">
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded mr-2">Partially Effective</span>
                    <p className="text-sm text-gray-600">Score between 41% and 84%</p>
                  </li>
                  
                  <li className="flex items-center">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded mr-2">Ineffective</span>
                    <p className="text-sm text-gray-600">Score of 40% or lower</p>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => setActiveTab('evaluate')}>
                Begin Assessment
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="evaluate" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md border">
                <h3 className="font-medium mb-1">Root Cause Elimination (40%)</h3>
                <p className="text-sm text-gray-600 mb-3">Has the root cause been effectively eliminated?</p>
                
                <div className="flex space-x-4">
                  <Button 
                    variant={assessment.rootCauseEliminated ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAssessmentValue('rootCauseEliminated', true)}
                  >
                    Yes
                  </Button>
                  <Button 
                    variant={!assessment.rootCauseEliminated ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAssessmentValue('rootCauseEliminated', false)}
                  >
                    No
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border">
                <h3 className="font-medium mb-1">Preventive Measures Implementation (40%)</h3>
                <p className="text-sm text-gray-600 mb-3">Are adequate preventive measures implemented?</p>
                
                <div className="flex space-x-4">
                  <Button 
                    variant={assessment.preventiveMeasuresImplemented ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAssessmentValue('preventiveMeasuresImplemented', true)}
                  >
                    Yes
                  </Button>
                  <Button 
                    variant={!assessment.preventiveMeasuresImplemented ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAssessmentValue('preventiveMeasuresImplemented', false)}
                  >
                    No
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border">
                <h3 className="font-medium mb-1">Documentation Completeness (20%)</h3>
                <p className="text-sm text-gray-600 mb-3">Is all documentation up-to-date and complete?</p>
                
                <div className="flex space-x-4">
                  <Button 
                    variant={assessment.documentationComplete ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAssessmentValue('documentationComplete', true)}
                  >
                    Yes
                  </Button>
                  <Button 
                    variant={!assessment.documentationComplete ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAssessmentValue('documentationComplete', false)}
                  >
                    No
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border">
                <h3 className="font-medium mb-1">Additional Notes</h3>
                <textarea 
                  className="w-full min-h-[100px] p-2 border rounded-md mt-2"
                  placeholder="Enter any additional observations or notes about the effectiveness..."
                  value={assessment.notes}
                  onChange={(e) => setAssessment(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" className="mr-2" onClick={() => setActiveTab('criteria')}>
                Back
              </Button>
              <Button onClick={submitAssessment} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Assessment'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Assessment Results</h3>
                {getRatingBadge(assessment.rating)}
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Effectiveness Score</span>
                    <span className="text-sm font-medium">{assessment.score}%</span>
                  </div>
                  <Progress value={assessment.score} className={getScoreColor(assessment.score)} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-3 bg-white">
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${assessment.rootCauseEliminated ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                      <span className="text-sm font-medium">Root Cause Eliminated</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">40% of total score</p>
                  </div>
                  
                  <div className="border rounded-md p-3 bg-white">
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${assessment.preventiveMeasuresImplemented ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                      <span className="text-sm font-medium">Preventive Measures</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">40% of total score</p>
                  </div>
                  
                  <div className="border rounded-md p-3 bg-white">
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${assessment.documentationComplete ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                      <span className="text-sm font-medium">Documentation</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">20% of total score</p>
                  </div>
                </div>
                
                {assessment.score < 85 && (
                  <div className="border-l-4 border-amber-400 bg-amber-50 p-3">
                    <h4 className="font-medium flex items-center text-amber-800">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Recommendations
                    </h4>
                    <ul className="mt-2 text-sm space-y-1 text-amber-700">
                      {!assessment.rootCauseEliminated && (
                        <li>• Further investigate the root cause and implement additional measures to address it completely.</li>
                      )}
                      {!assessment.preventiveMeasuresImplemented && (
                        <li>• Strengthen preventive measures to ensure the issue does not recur in the future.</li>
                      )}
                      {!assessment.documentationComplete && (
                        <li>• Update all relevant documentation to reflect the changes and maintain compliance.</li>
                      )}
                    </ul>
                  </div>
                )}
                
                {assessment.notes && (
                  <div>
                    <h4 className="font-medium flex items-center mb-2">
                      <FileText className="h-4 w-4 mr-1" />
                      Assessment Notes
                    </h4>
                    <div className="border rounded-md p-3 bg-white text-sm">
                      {assessment.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="default" onClick={() => setActiveTab('evaluate')}>
                Review Assessment
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="text-sm text-gray-500 flex items-center">
          <Clipboard className="h-4 w-4 mr-1" />
          Assessment performed {new Date().toLocaleDateString()}
        </div>
        
        {activeTab === 'results' && (
          <Button variant="outline">
            Download Report
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
