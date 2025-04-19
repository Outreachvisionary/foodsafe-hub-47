
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BadgeCheck, Calendar, CheckCircle2, Clipboard, ClipboardCheck, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { CAPAEffectivenessMetrics } from '@/types/capa';
import { createCAPAEffectivenessReport, updateCAPAEffectivenessReport, getCAPAEffectivenessReport } from '@/services/capaService';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<CAPAEffectivenessMetrics>({
    capaId,
    rootCauseEliminated: false,
    documentationComplete: false,
    preventionMeasureEffective: false,
    recurrenceCheck: false,
    score: 0,
    assessmentDate: new Date().toISOString(),
    notes: '',
    createdBy: user?.id || 'system',
    rating: 'not-verified',
    recurrenceChecked: 0,
    overall: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  
  const calculateTotalScore = () => {
    const rootCauseScore = metrics.rootCauseEliminated ? 40 : 0;
    const documentationScore = metrics.documentationComplete ? 20 : 0;
    const preventionScore = metrics.preventionMeasureEffective ? 30 : 0;
    const recurrenceScore = metrics.recurrenceCheck ? 10 : 0;
    
    const totalScore = rootCauseScore + documentationScore + preventionScore + recurrenceScore;
    
    let rating: CAPAEffectivenessMetrics['rating'] = 'not-verified';
    if (totalScore >= 90) rating = 'excellent';
    else if (totalScore >= 80) rating = 'effective';
    else if (totalScore >= 70) rating = 'good';
    else if (totalScore >= 60) rating = 'adequate';
    else if (totalScore >= 50) rating = 'partially-effective';
    else if (totalScore >= 40) rating = 'inadequate';
    else if (totalScore >= 30) rating = 'poor';
    else if (totalScore > 0) rating = 'ineffective';
    
    return { score: totalScore, rating };
  };
  
  // Load existing report if available
  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const report = await getCAPAEffectivenessReport(capaId);
        
        if (report) {
          setReportId(report.id);
          setMetrics({
            ...report,
            rootCauseEliminated: Boolean(report.rootCauseEliminated),
            documentationComplete: Boolean(report.documentationComplete),
            preventionMeasureEffective: Boolean(report.preventionMeasureEffective),
            recurrenceCheck: Boolean(report.recurrenceCheck)
          });
        }
      } catch (error) {
        console.error('Error loading effectiveness report:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadReport();
  }, [capaId]);
  
  const handleSwitchChange = (field: keyof CAPAEffectivenessMetrics) => (checked: boolean) => {
    const newValue = checked;
    
    // Convert to number format for database compatibility
    const numericValue = newValue ? 1 : 0;
    
    setMetrics(prev => {
      const updatedMetrics = {
        ...prev,
        [field]: newValue
      };
      
      const { score, rating } = calculateTotalScore();
      
      return {
        ...updatedMetrics,
        score,
        rating
      };
    });
  };
  
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Calculate final score and rating
      const { score, rating } = calculateTotalScore();
      
      const dataToSave: CAPAEffectivenessMetrics = {
        ...metrics,
        score,
        rating,
        assessmentDate: new Date().toISOString(),
        createdBy: user?.id || 'system'
      };
      
      let result;
      if (reportId) {
        result = await updateCAPAEffectivenessReport(reportId, dataToSave);
      } else {
        result = await createCAPAEffectivenessReport(dataToSave);
        setReportId(result.id);
      }
      
      toast({
        title: 'Effectiveness Assessment Saved',
        description: `CAPA effectiveness assessment saved successfully with a score of ${score}%.`
      });
      
      if (onEffectivenessUpdate) {
        onEffectivenessUpdate(result);
      }
    } catch (error) {
      console.error('Error saving effectiveness assessment:', error);
      toast({
        title: 'Error',
        description: 'Failed to save effectiveness assessment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ClipboardCheck className="h-5 w-5 mr-2 text-blue-600" />
          CAPA Effectiveness Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading assessment data...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium">Assessment for:</h3>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Implementation Date: {new Date(implementationDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{metrics.score}%</div>
                <div className={`text-sm ${
                  metrics.rating === 'excellent' || metrics.rating === 'effective' || metrics.rating === 'good' 
                    ? 'text-green-600' 
                    : metrics.rating === 'adequate' || metrics.rating === 'partially-effective' 
                      ? 'text-amber-600' 
                      : 'text-red-600'
                }`}>
                  {metrics.rating.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              </div>
            </div>
            
            <Progress value={metrics.score} className="h-2" />
            
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Root Cause Elimination</Label>
                  <p className="text-sm text-gray-500">Has the root cause been eliminated?</p>
                </div>
                <Switch 
                  checked={Boolean(metrics.rootCauseEliminated)} 
                  onCheckedChange={handleSwitchChange('rootCauseEliminated')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Documentation</Label>
                  <p className="text-sm text-gray-500">Are all related documents updated and complete?</p>
                </div>
                <Switch 
                  checked={Boolean(metrics.documentationComplete)} 
                  onCheckedChange={handleSwitchChange('documentationComplete')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Preventive Measures</Label>
                  <p className="text-sm text-gray-500">Are preventive measures effective?</p>
                </div>
                <Switch 
                  checked={Boolean(metrics.preventionMeasureEffective)} 
                  onCheckedChange={handleSwitchChange('preventionMeasureEffective')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Recurrence Check</Label>
                  <p className="text-sm text-gray-500">Has there been no recurrence of the issue?</p>
                </div>
                <Switch 
                  checked={Boolean(metrics.recurrenceCheck)} 
                  onCheckedChange={handleSwitchChange('recurrenceCheck')}
                />
              </div>
            </div>
            
            <div className="pt-2">
              <Label>Assessment Notes</Label>
              <Textarea 
                placeholder="Enter any notes regarding the effectiveness assessment..." 
                className="mt-1" 
                rows={3}
                value={metrics.notes || ''}
                onChange={(e) => setMetrics(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            
            {metrics.score < 70 && (
              <Alert variant="destructive" className="bg-amber-50 border-amber-200">
                <AlertDescription className="text-amber-800">
                  This CAPA's effectiveness is below the acceptable threshold. Additional corrective actions may be required.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center"
              >
                <BadgeCheck className="h-4 w-4 mr-2" />
                {saving ? 'Saving Assessment...' : reportId ? 'Update Assessment' : 'Save Assessment'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
