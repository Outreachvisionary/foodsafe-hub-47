
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CAPAEffectivenessRating, CAPAEffectivenessMetrics } from '@/types/capa';
import { CheckSquare } from 'lucide-react';

interface CAPAEffectivenessFormProps {
  capaId: string;
  onSubmit: (data: CAPAEffectivenessMetrics) => void;
  implementationDate?: string;
}

const CAPAEffectivenessForm: React.FC<CAPAEffectivenessFormProps> = ({ 
  capaId, 
  onSubmit,
  implementationDate
}) => {
  const [rootCauseEliminated, setRootCauseEliminated] = useState(false);
  const [preventiveMeasuresImplemented, setPreventiveMeasuresImplemented] = useState(false);
  const [documentationComplete, setDocumentationComplete] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  const calculateScore = (): number => {
    let score = 0;
    if (rootCauseEliminated) score += 40;
    if (preventiveMeasuresImplemented) score += 40;
    if (documentationComplete) score += 20;
    return score;
  };
  
  const calculateRating = (score: number): CAPAEffectivenessRating => {
    if (score >= 90) return 'Highly_Effective';
    if (score >= 70) return 'Effective';
    if (score >= 40) return 'Partially_Effective';
    return 'Not_Effective';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      const score = calculateScore();
      const rating = calculateRating(score);
      
      const data: CAPAEffectivenessMetrics = {
        capaId,
        rootCauseEliminated,
        preventiveMeasuresImplemented,
        documentationComplete,
        score,
        rating,
        notes: notes.trim() || undefined
      };
      
      await onSubmit(data);
      
      toast({
        title: "Effectiveness Assessment Submitted",
        description: `CAPA effectiveness rated as ${rating.replace('_', ' ')}`
      });
    } catch (error) {
      console.error('Error submitting effectiveness assessment:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit the effectiveness assessment",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Effectiveness Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-6">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="rootCause"
                checked={rootCauseEliminated}
                onCheckedChange={(checked) => setRootCauseEliminated(checked === true)}
              />
              <div className="grid gap-1.5">
                <Label htmlFor="rootCause" className="font-medium">
                  Root Cause Eliminated
                </Label>
                <p className="text-sm text-muted-foreground">
                  The identified root cause has been fully addressed and eliminated
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="preventive"
                checked={preventiveMeasuresImplemented}
                onCheckedChange={(checked) => setPreventiveMeasuresImplemented(checked === true)}
              />
              <div className="grid gap-1.5">
                <Label htmlFor="preventive" className="font-medium">
                  Preventive Measures Implemented
                </Label>
                <p className="text-sm text-muted-foreground">
                  All preventive actions have been implemented and are effective
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="documentation"
                checked={documentationComplete}
                onCheckedChange={(checked) => setDocumentationComplete(checked === true)}
              />
              <div className="grid gap-1.5">
                <Label htmlFor="documentation" className="font-medium">
                  Documentation Complete
                </Label>
                <p className="text-sm text-muted-foreground">
                  All required documentation has been updated to reflect the changes
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Enter any additional observations or comments about the effectiveness of this CAPA..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mt-4">
            <p className="text-sm font-medium text-blue-800">
              Effectiveness Score: {calculateScore()}%
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Rating: {calculateRating(calculateScore()).replace('_', ' ')}
            </p>
            {implementationDate && (
              <p className="text-xs text-blue-600 mt-1">
                Implementation Date: {new Date(implementationDate).toLocaleDateString()}
              </p>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Assessment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessForm;
