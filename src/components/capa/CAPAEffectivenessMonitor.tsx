
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronUp, 
  CircleCheck, 
  CircleX, 
  FileCheck, 
  Loader2, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { CAPAEffectivenessRating } from '@/types/capa';
import { saveEffectivenessMetrics, getEffectivenessMetrics } from '@/services/capaService';

interface CAPAEffectivenessMetrics {
  id?: string;
  capaId: string;
  score: number;
  recurrenceCheck: boolean;
  rootCauseEliminated: boolean;
  documentationComplete: boolean;
  preventionMeasureEffective: boolean;
  assessmentDate: string;
  notes?: string;
  createdBy: string;
  rating: CAPAEffectivenessRating;
}

interface CAPAEffectivenessMonitorProps {
  capaId: string;
  title: string;
  implementationDate?: string;
  onEffectivenessUpdate: (metrics: CAPAEffectivenessMetrics) => Promise<void>;
}

const CAPAEffectivenessMonitor: React.FC<CAPAEffectivenessMonitorProps> = ({
  capaId,
  title,
  implementationDate,
  onEffectivenessUpdate
}) => {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [metrics, setMetrics] = useState<CAPAEffectivenessMetrics>({
    capaId,
    score: 0,
    recurrenceCheck: false,
    rootCauseEliminated: false,
    documentationComplete: false,
    preventionMeasureEffective: false,
    assessmentDate: new Date().toISOString().split('T')[0],
    notes: '',
    createdBy: 'system',
    rating: 'inadequate'
  });
  
  const [hasExistingReport, setHasExistingReport] = useState(false);

  // Load existing effectiveness metrics if any
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        const existingMetrics = await getEffectivenessMetrics(capaId);
        
        if (existingMetrics) {
          setMetrics(existingMetrics);
          setHasExistingReport(true);
        }
      } catch (error) {
        console.error('Error loading effectiveness metrics:', error);
        toast({
          title: 'Error',
          description: 'Failed to load effectiveness assessment data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadMetrics();
  }, [capaId, toast]);

  // Calculate score and rating whenever criteria change
  useEffect(() => {
    calculateScore();
  }, [
    metrics.rootCauseEliminated, 
    metrics.documentationComplete, 
    metrics.preventionMeasureEffective,
    metrics.recurrenceCheck
  ]);

  const calculateScore = () => {
    let totalScore = 0;
    
    // Weight each criterion
    if (metrics.rootCauseEliminated) totalScore += 30;
    if (metrics.documentationComplete) totalScore += 20;
    if (metrics.preventionMeasureEffective) totalScore += 30;
    if (metrics.recurrenceCheck) totalScore += 20;
    
    // Set the rating based on score
    let rating: CAPAEffectivenessRating;
    if (totalScore >= 90) {
      rating = 'excellent';
    } else if (totalScore >= 70) {
      rating = 'good';
    } else if (totalScore >= 50) {
      rating = 'adequate';
    } else if (totalScore >= 30) {
      rating = 'poor';
    } else {
      rating = 'ineffective';
    }
    
    setMetrics(prev => ({
      ...prev,
      score: totalScore,
      rating
    }));
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleToggleChange = (field: keyof CAPAEffectivenessMetrics) => {
    setMetrics(prev => ({
      ...prev,
      [field]: !prev[field as keyof CAPAEffectivenessMetrics]
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMetrics(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Save metrics to database
      const savedMetrics = await saveEffectivenessMetrics(metrics);
      
      // Notify parent component
      await onEffectivenessUpdate(savedMetrics);
      
      setHasExistingReport(true);
      toast({
        title: 'Success',
        description: 'Effectiveness assessment saved successfully',
      });
    } catch (error) {
      console.error('Error saving effectiveness metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to save effectiveness assessment',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-emerald-500';
    if (score >= 50) return 'bg-blue-500';
    if (score >= 30) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getRatingBadge = (rating: CAPAEffectivenessRating) => {
    switch (rating) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-emerald-100 text-emerald-800">Good</Badge>;
      case 'adequate':
        return <Badge className="bg-blue-100 text-blue-800">Adequate</Badge>;
      case 'poor':
        return <Badge className="bg-amber-100 text-amber-800">Poor</Badge>;
      case 'ineffective':
        return <Badge className="bg-red-100 text-red-800">Ineffective</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Not Rated</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="text-xl">
            Effectiveness Assessment
          </CardTitle>
          <div className="ml-auto flex items-center">
            <Loader2 className="animate-spin h-5 w-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
            <span className="ml-2">Loading assessment data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader 
        className="flex flex-row items-center cursor-pointer" 
        onClick={handleToggleExpand}
      >
        <CardTitle className="text-xl flex items-center">
          <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
          Effectiveness Assessment
          {hasExistingReport && (
            <Badge className="ml-2 bg-blue-100 text-blue-800">
              {metrics.score >= 70 ? 'Verified' : 'Assessed'}
            </Badge>
          )}
        </CardTitle>
        <div className="ml-auto flex items-center">
          <div className="mr-4 flex items-center">
            <span className="text-sm font-medium mr-2">Score:</span>
            <Badge className={`${getScoreColor(metrics.score)} text-white`}>
              {metrics.score}%
            </Badge>
          </div>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="space-y-6">
          {implementationDate && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Effectiveness Verification</AlertTitle>
              <AlertDescription>
                This CAPA was implemented on {new Date(implementationDate).toLocaleDateString()}. 
                Effectiveness should be verified to ensure the issue has been resolved.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-1">
            <div className="text-sm text-gray-500">Overall Effectiveness</div>
            <div className="flex items-center space-x-3">
              <Progress 
                value={metrics.score} 
                className={`h-2.5 ${getScoreColor(metrics.score)}`} 
              />
              <span className="font-medium">{metrics.score}%</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm">Rating: </span>
              {getRatingBadge(metrics.rating)}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label htmlFor="rootCauseEliminated" className="text-base font-medium">
                  Root Cause Eliminated (30%)
                </Label>
                <div className="text-sm text-gray-500">
                  The root cause has been successfully eliminated
                </div>
              </div>
              <div className="flex items-center">
                {metrics.rootCauseEliminated ? (
                  <CircleCheck className="mr-2 h-5 w-5 text-green-500" />
                ) : (
                  <CircleX className="mr-2 h-5 w-5 text-red-500" />
                )}
                <Switch 
                  id="rootCauseEliminated"
                  checked={metrics.rootCauseEliminated}
                  onCheckedChange={() => handleToggleChange('rootCauseEliminated')}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label htmlFor="documentationComplete" className="text-base font-medium">
                  Documentation Complete (20%)
                </Label>
                <div className="text-sm text-gray-500">
                  All documentation has been properly updated
                </div>
              </div>
              <div className="flex items-center">
                {metrics.documentationComplete ? (
                  <CircleCheck className="mr-2 h-5 w-5 text-green-500" />
                ) : (
                  <CircleX className="mr-2 h-5 w-5 text-red-500" />
                )}
                <Switch 
                  id="documentationComplete"
                  checked={metrics.documentationComplete}
                  onCheckedChange={() => handleToggleChange('documentationComplete')}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label htmlFor="preventionMeasureEffective" className="text-base font-medium">
                  Prevention Measures Effective (30%)
                </Label>
                <div className="text-sm text-gray-500">
                  Preventive actions have been effective
                </div>
              </div>
              <div className="flex items-center">
                {metrics.preventionMeasureEffective ? (
                  <CircleCheck className="mr-2 h-5 w-5 text-green-500" />
                ) : (
                  <CircleX className="mr-2 h-5 w-5 text-red-500" />
                )}
                <Switch 
                  id="preventionMeasureEffective"
                  checked={metrics.preventionMeasureEffective}
                  onCheckedChange={() => handleToggleChange('preventionMeasureEffective')}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label htmlFor="recurrenceCheck" className="text-base font-medium">
                  No Recurrence (20%)
                </Label>
                <div className="text-sm text-gray-500">
                  The issue has not recurred
                </div>
              </div>
              <div className="flex items-center">
                {metrics.recurrenceCheck ? (
                  <CircleCheck className="mr-2 h-5 w-5 text-green-500" />
                ) : (
                  <CircleX className="mr-2 h-5 w-5 text-red-500" />
                )}
                <Switch 
                  id="recurrenceCheck"
                  checked={metrics.recurrenceCheck}
                  onCheckedChange={() => handleToggleChange('recurrenceCheck')}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes"
              value={metrics.notes || ''}
              onChange={handleNotesChange}
              placeholder="Enter any additional notes or observations about the effectiveness assessment"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FileCheck className="mr-2 h-4 w-4" />
                  {hasExistingReport ? 'Update Assessment' : 'Save Assessment'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
