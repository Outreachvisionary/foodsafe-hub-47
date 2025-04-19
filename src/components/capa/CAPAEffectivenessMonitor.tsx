
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CAPA, CAPAEffectivenessMetrics, CAPAEffectivenessRating } from '@/types/capa';
import { useToast } from '@/components/ui/use-toast';
import { createCAPAEffectivenessReport, updateCAPAEffectivenessReport, getCAPAEffectivenessReport } from '@/services/capaService';
import { CheckCircle, Clock, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

interface CAPAEffectivenessMonitorProps {
  capaId: string;
  title: string;
  implementationDate?: string;
  onEffectivenessUpdate?: (data: CAPAEffectivenessMetrics) => void;
}

const CAPAEffectivenessMonitor: React.FC<CAPAEffectivenessMonitorProps> = ({
  capaId,
  title,
  implementationDate,
  onEffectivenessUpdate
}) => {
  const [metrics, setMetrics] = useState<CAPAEffectivenessMetrics>({
    capaId: capaId,
    rootCauseEliminated: false,
    documentationComplete: false,
    preventionMeasureEffective: false,
    recurrenceCheck: false,
    rootCauseEliminated: 0,
    documentationComplete: 0,
    preventionMeasureEffective: 0,
    recurrenceChecked: 0,
    overall: 0,
    score: 0,
    assessmentDate: new Date().toISOString(),
    createdBy: 'Current User',
    rating: 'not-verified'
  });
  
  const [existingReport, setExistingReport] = useState<CAPAEffectivenessMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('criteria');
  const [notes, setNotes] = useState('');
  
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const report = await getCAPAEffectivenessReport(capaId);
        
        if (report) {
          setExistingReport(report);
          setMetrics(report);
          setNotes(report.notes || '');
        }
      } catch (error) {
        console.error('Error fetching effectiveness report:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [capaId]);
  
  const calculateScore = (metrics: Partial<CAPAEffectivenessMetrics>) => {
    const rootCauseScore = metrics.rootCauseEliminated ? 40 : 0;
    const documentationScore = metrics.documentationComplete ? 20 : 0;
    const preventionScore = metrics.preventionMeasureEffective ? 30 : 0;
    const recurrenceScore = metrics.recurrenceCheck ? 10 : 0;
    
    const totalScore = rootCauseScore + documentationScore + preventionScore + recurrenceScore;
    
    let rating: CAPAEffectivenessRating = 'not-verified';
    
    if (totalScore >= 90) {
      rating = 'excellent';
    } else if (totalScore >= 75) {
      rating = 'effective';
    } else if (totalScore >= 60) {
      rating = 'good';
    } else if (totalScore >= 40) {
      rating = 'partially-effective';
    } else if (totalScore >= 25) {
      rating = 'adequate';
    } else if (totalScore > 0) {
      rating = 'inadequate';
    } else {
      rating = 'poor';
    }
    
    return {
      score: totalScore,
      rating
    };
  };
  
  const handleCriteriaChange = (criteria: keyof CAPAEffectivenessMetrics, value: boolean) => {
    const updatedMetrics = {
      ...metrics,
      [criteria]: value
    };
    
    const { score, rating } = calculateScore(updatedMetrics);
    
    setMetrics({
      ...updatedMetrics,
      score,
      rating
    });
  };
  
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      const updatedMetrics = {
        ...metrics,
        notes,
        assessmentDate: new Date().toISOString()
      };
      
      let result;
      
      if (existingReport) {
        result = await updateCAPAEffectivenessReport(existingReport.id!, updatedMetrics);
      } else {
        result = await createCAPAEffectivenessReport(updatedMetrics);
      }
      
      setExistingReport(result);
      
      if (onEffectivenessUpdate) {
        onEffectivenessUpdate(result);
      }
      
      toast({
        title: 'Success',
        description: 'Effectiveness assessment saved successfully',
      });
      
      setActiveTab('results');
    } catch (error) {
      console.error('Error submitting effectiveness assessment:', error);
      toast({
        title: 'Error',
        description: 'Failed to save effectiveness assessment',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const getEffectivenessColor = (rating: CAPAEffectivenessRating) => {
    if (rating === 'excellent' || rating === 'effective') {
      return 'text-green-600';
    } else if (rating === 'good' || rating === 'partially-effective' || rating === 'adequate') {
      return 'text-yellow-600';
    } else if (rating === 'poor' || rating === 'ineffective' || rating === 'inadequate') {
      return 'text-red-600';
    } else {
      return 'text-gray-600';
    }
  };
  
  const getEffectivenessIcon = (rating: CAPAEffectivenessRating) => {
    if (rating === 'excellent' || rating === 'effective') {
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    } else if (rating === 'good' || rating === 'partially-effective' || rating === 'adequate') {
      return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
    } else if (rating === 'poor' || rating === 'ineffective' || rating === 'inadequate') {
      return <XCircle className="h-6 w-6 text-red-600" />;
    } else {
      return <Clock className="h-6 w-6 text-gray-600" />;
    }
  };
  
  const renderEffectivenessDetails = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {getEffectivenessIcon(metrics.rating)}
          <div>
            <h3 className={`text-lg font-medium ${getEffectivenessColor(metrics.rating)}`}>
              {metrics.rating.charAt(0).toUpperCase() + metrics.rating.slice(1).replace('-', ' ')}
            </h3>
            <p className="text-sm text-gray-500">
              Overall effectiveness score: {metrics.score}/100
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Root Cause Eliminated</span>
              <span className={metrics.rootCauseEliminated ? 'text-green-600' : 'text-red-600'}>
                {metrics.rootCauseEliminated ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Documentation Complete</span>
              <span className={metrics.documentationComplete ? 'text-green-600' : 'text-red-600'}>
                {metrics.documentationComplete ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Prevention Effective</span>
              <span className={metrics.preventionMeasureEffective ? 'text-green-600' : 'text-red-600'}>
                {metrics.preventionMeasureEffective ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Recurrence Checked</span>
              <span className={metrics.recurrenceCheck ? 'text-green-600' : 'text-red-600'}>
                {metrics.recurrenceCheck ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
        
        {notes && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Notes</h4>
            <p className="text-sm p-3 bg-gray-50 rounded-md border">{notes}</p>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500">
          Assessment date: {new Date(metrics.assessmentDate).toLocaleString()}
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Effectiveness Monitoring</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Effectiveness Monitoring</span>
          {existingReport && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getEffectivenessColor(metrics.rating)} bg-opacity-20 bg-gray-100`}>
              {metrics.rating.charAt(0).toUpperCase() + metrics.rating.slice(1).replace('-', ' ')}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="criteria">Assessment Criteria</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="criteria">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="rootCause">Root Cause Eliminated</Label>
                    <p className="text-sm text-gray-500">Has the root cause been fully addressed?</p>
                  </div>
                  <Switch
                    id="rootCause"
                    checked={metrics.rootCauseEliminated}
                    onCheckedChange={(checked) => handleCriteriaChange('rootCauseEliminated', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="documentation">Documentation Complete</Label>
                    <p className="text-sm text-gray-500">Are all required documents updated?</p>
                  </div>
                  <Switch
                    id="documentation"
                    checked={metrics.documentationComplete}
                    onCheckedChange={(checked) => handleCriteriaChange('documentationComplete', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="prevention">Prevention Measure Effective</Label>
                    <p className="text-sm text-gray-500">Are preventive actions working as expected?</p>
                  </div>
                  <Switch
                    id="prevention"
                    checked={metrics.preventionMeasureEffective}
                    onCheckedChange={(checked) => handleCriteriaChange('preventionMeasureEffective', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="recurrence">Recurrence Check Completed</Label>
                    <p className="text-sm text-gray-500">Has adequate time passed to verify no recurrence?</p>
                  </div>
                  <Switch
                    id="recurrence"
                    checked={metrics.recurrenceCheck}
                    onCheckedChange={(checked) => handleCriteriaChange('recurrenceCheck', checked)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label htmlFor="notes">Assessment Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about the effectiveness assessment..."
                  className="mt-2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Effectiveness Score</h3>
                  <p className="text-sm text-gray-500">Based on selected criteria</p>
                </div>
                <div className="text-2xl font-bold">
                  {metrics.score}/100
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Assessment'
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {existingReport ? (
              renderEffectivenessDetails()
            ) : (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium">No Assessment Yet</h3>
                <p className="text-gray-500 mt-1 max-w-md mx-auto">
                  Complete the assessment criteria and save to generate effectiveness results.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
