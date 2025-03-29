
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { 
  AlertCircle, 
  BarChart3, 
  CheckCircle2, 
  FileCheck, 
  LineChart, 
  ListTodo,
  Calendar,
  Users
} from 'lucide-react';
import { CAPAEffectivenessMetrics } from '@/types/capa';
import { saveEffectivenessMetrics, getEffectivenessMetrics } from '@/services/capaService';

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
  const [activeTab, setActiveTab] = useState('checklist');
  const [metrics, setMetrics] = useState<CAPAEffectivenessMetrics>({
    rootCauseEliminated: false,
    preventiveMeasuresImplemented: false,
    documentationComplete: false,
    recurrenceCheck: 'Failed',
    score: 0
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assessmentDate, setAssessmentDate] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    const loadEffectivenessData = async () => {
      try {
        setLoading(true);
        const data = await getEffectivenessMetrics(capaId);
        
        if (data) {
          setMetrics(data);
          setNotes(data.notes || '');
          setAssessmentDate(data.assessmentDate);
        }
      } catch (error) {
        console.error('Error loading effectiveness data:', error);
        toast.error('Failed to load effectiveness data');
      } finally {
        setLoading(false);
      }
    };
    
    if (capaId) {
      loadEffectivenessData();
    }
  }, [capaId]);
  
  const calculateScore = (data: Partial<CAPAEffectivenessMetrics> = {}): number => {
    const updatedMetrics = { ...metrics, ...data };
    
    let score = 0;
    if (updatedMetrics.rootCauseEliminated) score += 30;
    if (updatedMetrics.preventiveMeasuresImplemented) score += 30;
    if (updatedMetrics.documentationComplete) score += 15;
    
    if (updatedMetrics.recurrenceCheck === 'Passed') score += 25;
    else if (updatedMetrics.recurrenceCheck === 'Minor Issues') score += 10;
    
    return score;
  };
  
  const handleChecklistChange = (field: keyof CAPAEffectivenessMetrics, value: any) => {
    const updatedMetrics = { ...metrics, [field]: value };
    updatedMetrics.score = calculateScore(updatedMetrics);
    setMetrics(updatedMetrics);
  };
  
  const handleSubmit = async () => {
    try {
      setSaving(true);
      const finalScore = calculateScore();
      const currentDate = new Date().toISOString();
      const updatedMetrics = { 
        ...metrics, 
        score: finalScore,
        notes: notes,
        assessmentDate: assessmentDate || currentDate
      };
      
      setMetrics(updatedMetrics);
      
      await saveEffectivenessMetrics(capaId, updatedMetrics);
      
      if (onEffectivenessUpdate) {
        onEffectivenessUpdate(updatedMetrics);
      }
      
      toast.success(`Effectiveness assessment completed with score: ${finalScore}%`);
      setAssessmentDate(currentDate);
    } catch (error) {
      console.error('Error saving effectiveness assessment:', error);
      toast.error('Failed to save effectiveness assessment');
    } finally {
      setSaving(false);
    }
  };
  
  const getEffectivenessRating = (score: number) => {
    if (score >= 85) return 'Effective';
    if (score >= 60) return 'Partially Effective';
    return 'Not Effective';
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };
  
  if (loading) {
    return (
      <Card className="p-8 flex justify-center items-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading effectiveness data...</span>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center text-base">
              <FileCheck className="h-5 w-5 mr-2 text-green-600" />
              CAPA Effectiveness Monitoring
            </CardTitle>
            <CardDescription>
              {capaId}: {title}
            </CardDescription>
          </div>
          <Badge 
            className={
              metrics.score >= 85 ? "bg-green-100 text-green-800" : 
              metrics.score >= 60 ? "bg-amber-100 text-amber-800" : 
              "bg-red-100 text-red-800"
            }
          >
            {getEffectivenessRating(metrics.score)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full border-b pb-0">
            <TabsTrigger value="checklist" className="flex items-center">
              <ListTodo className="h-4 w-4 mr-2" />
              Assessment Checklist
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Effectiveness Metrics
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center">
              <LineChart className="h-4 w-4 mr-2" />
              Trend Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="checklist" className="pt-4 space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Implementation Details</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Completed on {new Date(implementationDate).toLocaleDateString()}
                    </p>
                    {assessmentDate && (
                      <p className="text-sm text-gray-600 mt-1">
                        Last assessed: {new Date(assessmentDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-blue-50">
                      <Calendar className="h-3 w-3 mr-1" />
                      {assessmentDate ? 'Re-assessment' : '90-Day Follow-up'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="rootCauseEliminated" 
                      checked={metrics.rootCauseEliminated}
                      onCheckedChange={(checked) => 
                        handleChecklistChange('rootCauseEliminated', checked === true)
                      }
                    />
                    <Label htmlFor="rootCauseEliminated" className="ml-2 font-medium">
                      Root Cause Elimination
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">
                    Has the identified root cause been fully addressed and eliminated?
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="preventiveMeasuresImplemented" 
                      checked={metrics.preventiveMeasuresImplemented}
                      onCheckedChange={(checked) => 
                        handleChecklistChange('preventiveMeasuresImplemented', checked === true)
                      }
                    />
                    <Label htmlFor="preventiveMeasuresImplemented" className="ml-2 font-medium">
                      Preventive Measures Implementation
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">
                    Have all preventive measures been fully implemented and validated?
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="documentationComplete" 
                      checked={metrics.documentationComplete}
                      onCheckedChange={(checked) => 
                        handleChecklistChange('documentationComplete', checked === true)
                      }
                    />
                    <Label htmlFor="documentationComplete" className="ml-2 font-medium">
                      Documentation Completeness
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">
                    Is all CAPA documentation complete, accurate, and FSMA 204 compliant?
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label className="font-medium">Recurrence Verification</Label>
                  <p className="text-sm text-gray-600">
                    Has the issue recurred since implementing the CAPA?
                  </p>
                  
                  <RadioGroup 
                    value={metrics.recurrenceCheck} 
                    onValueChange={(value) => 
                      handleChecklistChange('recurrenceCheck', value as 'Passed' | 'Minor Issues' | 'Failed')
                    }
                    className="ml-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Passed" id="recurrence-passed" />
                      <Label htmlFor="recurrence-passed">No recurrence (Passed)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Minor Issues" id="recurrence-minor" />
                      <Label htmlFor="recurrence-minor">Minor related issues (Partial)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Failed" id="recurrence-failed" />
                      <Label htmlFor="recurrence-failed">Issue has recurred (Failed)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes" className="font-medium">Assessment Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Add notes about the effectiveness evaluation..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
            
            <Alert className={
              metrics.score >= 85 ? "bg-green-50 border-green-200" : 
              metrics.score >= 60 ? "bg-amber-50 border-amber-200" : 
              "bg-red-50 border-red-200"
            }>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Current Effectiveness Score: <span className={getScoreColor(metrics.score)}>{metrics.score}%</span></AlertTitle>
              <AlertDescription>
                {metrics.score >= 85 
                  ? "CAPA appears to be effective. Continue monitoring."
                  : metrics.score >= 60 
                  ? "CAPA is partially effective. Additional actions may be needed."
                  : "CAPA is not effective. Immediate review and revision required."
                }
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmit} 
                disabled={saving}
                className="flex items-center"
              >
                {saving && <Loader className="h-4 w-4 mr-2 animate-spin" />}
                Save Assessment
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="metrics" className="pt-4">
            <div className="space-y-6">
              <div className="flex flex-col">
                <div className="text-center mb-6">
                  <div className={`text-5xl font-bold ${getScoreColor(metrics.score)}`}>
                    {metrics.score}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Overall Effectiveness Score</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Root Cause Elimination</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500">Score</span>
                        <span className="text-sm font-medium">{metrics.rootCauseEliminated ? '30/30' : '0/30'}</span>
                      </div>
                      <Progress value={metrics.rootCauseEliminated ? 100 : 0} className="h-2" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Preventive Measures</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500">Score</span>
                        <span className="text-sm font-medium">{metrics.preventiveMeasuresImplemented ? '30/30' : '0/30'}</span>
                      </div>
                      <Progress value={metrics.preventiveMeasuresImplemented ? 100 : 0} className="h-2" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Documentation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500">Score</span>
                        <span className="text-sm font-medium">{metrics.documentationComplete ? '15/15' : '0/15'}</span>
                      </div>
                      <Progress value={metrics.documentationComplete ? 100 : 0} className="h-2" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Recurrence Check</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500">Score</span>
                        <span className="text-sm font-medium">
                          {metrics.recurrenceCheck === 'Passed' ? '25/25' : 
                           metrics.recurrenceCheck === 'Minor Issues' ? '10/25' : '0/25'}
                        </span>
                      </div>
                      <Progress 
                        value={metrics.recurrenceCheck === 'Passed' ? 100 : 
                               metrics.recurrenceCheck === 'Minor Issues' ? 40 : 0} 
                        className="h-2" 
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {assessmentDate && (
                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Assessment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <p>Last assessment: {new Date(assessmentDate).toLocaleDateString()}</p>
                      <p>Status: {getEffectivenessRating(metrics.score)}</p>
                      {notes && (
                        <div className="mt-2">
                          <p className="font-medium">Notes:</p>
                          <p className="text-gray-600">{notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="pt-4">
            <div className="text-center p-8">
              <h3 className="text-lg font-medium mb-2">Trend Analysis</h3>
              <p className="text-gray-500">
                Trend analysis will be available after multiple assessments have been completed.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
