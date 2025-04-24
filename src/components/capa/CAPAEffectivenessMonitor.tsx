
import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CAPAEffectivenessRating } from '@/types/capa';
import { useToast } from '@/hooks/use-toast';

export interface CAPAEffectivenessMetrics {
  capaId: string;
  rootCauseEliminated: boolean;
  preventiveMeasuresImplemented: boolean;
  documentationComplete: boolean;
  score: number;
  rating: CAPAEffectivenessRating;
  notes?: string;
}

interface CAPAEffectivenessMonitorProps {
  capaId: string;
  isEditable?: boolean;
  onMetricsUpdate?: (metrics: CAPAEffectivenessMetrics) => void;
  existingMetrics?: CAPAEffectivenessMetrics;
  title?: string;
  implementationDate?: string;
}

const CAPAEffectivenessMonitor: React.FC<CAPAEffectivenessMonitorProps> = ({
  capaId,
  isEditable = true,
  onMetricsUpdate,
  existingMetrics,
  title,
  implementationDate
}) => {
  const { toast } = useToast();
  const [rootCauseEliminated, setRootCauseEliminated] = useState(existingMetrics?.rootCauseEliminated || false);
  const [preventiveMeasuresImplemented, setPreventiveMeasuresImplemented] = useState(existingMetrics?.preventiveMeasuresImplemented || false);
  const [documentationComplete, setDocumentationComplete] = useState(existingMetrics?.documentationComplete || false);
  const [rating, setRating] = useState<CAPAEffectivenessRating>(existingMetrics?.rating || 'Not_Effective');
  const [notes, setNotes] = useState(existingMetrics?.notes || '');

  const calculateScore = useCallback(() => {
    let score = 0;
    if (rootCauseEliminated) score += 40;
    if (preventiveMeasuresImplemented) score += 40;
    if (documentationComplete) score += 20;
    return score;
  }, [rootCauseEliminated, preventiveMeasuresImplemented, documentationComplete]);

  const calculateRating = useCallback((score: number): CAPAEffectivenessRating => {
    if (score < 40) return 'Not_Effective';
    if (score < 70) return 'Partially_Effective';
    if (score < 90) return 'Effective';
    return 'Highly_Effective';
  }, []);

  const handleScoreChange = useCallback(() => {
    const score = calculateScore();
    setRating(calculateRating(score));
  }, [calculateScore, calculateRating]);

  const handleSaveMetrics = () => {
    const score = calculateScore();
    const metrics: CAPAEffectivenessMetrics = {
      capaId,
      rootCauseEliminated,
      preventiveMeasuresImplemented,
      documentationComplete,
      score,
      rating,
      notes
    };
    
    if (onMetricsUpdate) {
      onMetricsUpdate(metrics);
    }
    
    toast({
      title: 'Effectiveness metrics saved',
      description: 'CAPA effectiveness assessment has been updated.'
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title ? `Effectiveness Assessment: ${title}` : 'Effectiveness Assessment'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {implementationDate && (
          <div className="text-sm text-gray-500 mb-4">
            Implementation date: {implementationDate}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rootCause" 
              checked={rootCauseEliminated} 
              onCheckedChange={(checked) => {
                setRootCauseEliminated(checked === true);
                handleScoreChange();
              }}
              disabled={!isEditable}
            />
            <Label htmlFor="rootCause">
              Root cause has been eliminated (40%)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="preventiveMeasures" 
              checked={preventiveMeasuresImplemented} 
              onCheckedChange={(checked) => {
                setPreventiveMeasuresImplemented(checked === true);
                handleScoreChange();
              }}
              disabled={!isEditable}
            />
            <Label htmlFor="preventiveMeasures">
              Preventive measures have been implemented (40%)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="documentation" 
              checked={documentationComplete} 
              onCheckedChange={(checked) => {
                setDocumentationComplete(checked === true);
                handleScoreChange();
              }}
              disabled={!isEditable}
            />
            <Label htmlFor="documentation">
              Documentation is complete and accurate (20%)
            </Label>
          </div>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="effectiveness">Overall Effectiveness Rating</Label>
          <Select 
            value={rating} 
            onValueChange={(value: CAPAEffectivenessRating) => setRating(value)}
            disabled={!isEditable}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Not_Effective">Not Effective</SelectItem>
              <SelectItem value="Partially_Effective">Partially Effective</SelectItem>
              <SelectItem value="Effective">Effective</SelectItem>
              <SelectItem value="Highly_Effective">Highly Effective</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="notes">Assessment Notes</Label>
          <Textarea 
            id="notes" 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any notes regarding the effectiveness assessment"
            disabled={!isEditable}
          />
        </div>
        
        <div className="pt-2">
          <div className="bg-gray-100 rounded p-3 flex justify-between items-center">
            <div>
              <span className="text-sm font-medium">Current Score:</span> 
              <span className="text-lg font-bold ml-2">{calculateScore()}%</span>
            </div>
            {isEditable && (
              <Button onClick={handleSaveMetrics}>Save Assessment</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
