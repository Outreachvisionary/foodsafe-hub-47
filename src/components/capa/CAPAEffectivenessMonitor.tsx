import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle2, HelpCircle, Info, BarChart3, FileText, Clock, Loader2 } from 'lucide-react';
import { CAPAEffectivenessMetrics, CAPAEffectivenessRating } from '@/types/capa';
import { saveEffectivenessMetrics, getEffectivenessMetrics } from '@/services/capaService';

interface CAPAEffectivenessMonitorProps {
  capaId: string;
  title: string;
  implementationDate?: string;
  onEffectivenessUpdate?: (metrics: CAPAEffectivenessMetrics) => void;
}

const CAPAEffectivenessMonitor: React.FC<CAPAEffectivenessMonitorProps> = ({ 
  capaId, 
  title, 
  implementationDate, 
  onEffectivenessUpdate 
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("assessment");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<CAPAEffectivenessMetrics | null>(null);
  const [assessmentData, setAssessmentData] = useState<CAPAEffectivenessMetrics>({
    capaId,
    score: 0,
    recurrenceCheck: false,
    rootCauseEliminated: false,
    documentationComplete: false,
    preventionMeasureEffective: false,
    assessmentDate: new Date().toISOString().split('T')[0],
    createdBy: 'Current User',
    rating: 'adequate'
  });

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        const data = await getEffectivenessMetrics(capaId);
        if (data) {
          setMetrics(data);
          
          // Update assessment data with existing values
          setAssessmentData({
            ...assessmentData,
            score: data.score,
            recurrenceCheck: data.recurrenceCheck,
            rootCauseEliminated: data.rootCauseEliminated,
            documentationComplete: data.documentationComplete,
            preventionMeasureEffective: data.preventionMeasureEffective,
            rating: data.rating,
            notes: data.notes
          });
        }
      } catch (error) {
        console.error('Error loading effectiveness metrics:', error);
        toast({
          title: "Error",
          description: "Failed to load effectiveness metrics",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [capaId, toast]);

  const calculateScore = (data: CAPAEffectivenessMetrics): number => {
    let score = 0;
    
    if (data.rootCauseEliminated) score += 30;
    if (data.preventionMeasureEffective) score += 30;
    if (data.documentationComplete) score += 20;
    if (data.recurrenceCheck) score += 20;
    
    return score;
  };

  const handleToggleChange = (field: keyof CAPAEffectivenessMetrics) => {
    const updatedData = {
      ...assessmentData,
      [field]: !assessmentData[field as keyof CAPAEffectivenessMetrics]
    };
    
    // Recalculate score
    const newScore = calculateScore(updatedData);
    updatedData.score = newScore;
    
    // Determine rating based on score
    if (newScore >= 90) updatedData.rating = 'excellent';
    else if (newScore >= 75) updatedData.rating = 'good';
    else if (newScore >= 60) updatedData.rating = 'adequate';
    else if (newScore >= 40) updatedData.rating = 'poor';
    else updatedData.rating = 'ineffective';
    
    setAssessmentData(updatedData);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Ensure score is calculated before submission
      const finalData: CAPAEffectivenessMetrics = {
        ...assessmentData,
        score: calculateScore(assessmentData),
        assessmentDate: new Date().toISOString().split('T')[0]
      };
      
      const savedMetrics = await saveEffectivenessMetrics(finalData);
      
      setMetrics(savedMetrics);
      
      if (onEffectivenessUpdate) {
        onEffectivenessUpdate(savedMetrics);
      }
      
      toast({
        title: "Assessment Saved",
        description: "Effectiveness assessment has been recorded successfully",
      });
      
      setActiveTab("results");
    } catch (error) {
      console.error('Error saving effectiveness assessment:', error);
      toast({
        title: "Error",
        description: "Failed to save effectiveness assessment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (rating: CAPAEffectivenessRating): string => {
    if (rating === 'excellent') return 'Excellent';
    if (rating === 'good') return 'Good';
    if (rating === 'adequate') return 'Adequate';
    if (rating === 'poor') return 'Poor';
    return 'Ineffective';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const renderAssessmentTab = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">CAPA Effectiveness Monitoring</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Assess if corrective and preventive actions have effectively addressed the root cause
                  and prevented recurrence of the issue.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="rootCause">Root Cause Elimination</Label>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Has the root cause been completely eliminated?</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="rootCauseEliminated"
                    checked={assessmentData.rootCauseEliminated}
                    onCheckedChange={() => handleToggleChange('rootCauseEliminated')}
                  />
                  <Label htmlFor="rootCauseEliminated">
                    {assessmentData.rootCauseEliminated ? 'Yes' : 'No'}
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="preventionMeasureEffective">Prevention Measure Effectiveness</Label>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Are preventive measures effective in stopping recurrence?</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="preventionMeasureEffective"
                    checked={assessmentData.preventionMeasureEffective}
                    onCheckedChange={() => handleToggleChange('preventionMeasureEffective')}
                  />
                  <Label htmlFor="preventionMeasureEffective">
                    {assessmentData.preventionMeasureEffective ? 'Yes' : 'No'}
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="documentationComplete">Documentation Completeness</Label>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Is all required documentation complete and accurate?</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="documentationComplete"
                    checked={assessmentData.documentationComplete}
                    onCheckedChange={() => handleToggleChange('documentationComplete')}
                  />
                  <Label htmlFor="documentationComplete">
                    {assessmentData.documentationComplete ? 'Yes' : 'No'}
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="recurrenceCheck">Recurrence Check</Label>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Has the issue remained resolved without recurrence?</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="recurrenceCheck"
                    checked={assessmentData.recurrenceCheck}
                    onCheckedChange={() => handleToggleChange('recurrenceCheck')}
                  />
                  <Label htmlFor="recurrenceCheck">
                    {assessmentData.recurrenceCheck ? 'Yes' : 'No'}
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-1.5 pt-2">
              <Label htmlFor="notes">Assessment Notes</Label>
              <Textarea 
                id="notes"
                placeholder="Enter any additional notes or observations regarding the effectiveness of this CAPA"
                value={assessmentData.notes || ''}
                onChange={(e) => setAssessmentData({...assessmentData, notes: e.target.value})}
                rows={3}
              />
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Effectiveness Score: {assessmentData.score}%
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Rating: {getRatingLabel(assessmentData.rating)}
              </p>
            </div>
            
            <div>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Save Assessment
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResultsTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col">
          <div className="text-center mb-6">
            <div className={`text-5xl font-bold ${getScoreColor(assessmentData.score)}`}>
              {assessmentData.score}%
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
                  <span className="text-sm font-medium">{assessmentData.rootCauseEliminated ? '30/30' : '0/30'}</span>
                </div>
                <Progress value={assessmentData.rootCauseEliminated ? 100 : 0} className="h-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Preventive Measures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Score</span>
                  <span className="text-sm font-medium">{assessmentData.preventionMeasureEffective ? '30/30' : '0/30'}</span>
                </div>
                <Progress value={assessmentData.preventionMeasureEffective ? 100 : 0} className="h-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Score</span>
                  <span className="text-sm font-medium">{assessmentData.documentationComplete ? '20/20' : '0/20'}</span>
                </div>
                <Progress value={assessmentData.documentationComplete ? 100 : 0} className="h-2" />
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
                    {assessmentData.recurrenceCheck ? '20/20' : '0/20'}
                  </span>
                </div>
                <Progress 
                  value={assessmentData.recurrenceCheck ? 100 : 0} 
                  className="h-2" 
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="p-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              CAPA Effectiveness Monitoring
            </CardTitle>
            <CardDescription>
              {capaId}: {title}
            </CardDescription>
          </div>
          <Badge 
            className={
              assessmentData.score >= 85 ? "bg-green-100 text-green-800" : 
              assessmentData.score >= 60 ? "bg-amber-100 text-amber-800" : 
              "bg-red-100 text-red-800"
            }
          >
            {getRatingLabel(assessmentData.rating)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full border-b pb-0">
            <TabsTrigger value="assessment" className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Assessment
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assessment" className="pt-4 space-y-6">
            {renderAssessmentTab()}
          </TabsContent>
          
          <TabsContent value="results" className="pt-4">
            {renderResultsTab()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
