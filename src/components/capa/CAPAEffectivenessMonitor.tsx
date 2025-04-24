
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format, differenceInDays } from 'date-fns';
import { CAPAEffectivenessRating } from '@/types/capa';

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
  title: string;
  implementationDate: string;
  onEffectivenessUpdate?: (result: CAPAEffectivenessMetrics) => void;
}

const CAPAEffectivenessMonitor: React.FC<CAPAEffectivenessMonitorProps> = ({
  capaId,
  title,
  implementationDate,
  onEffectivenessUpdate
}) => {
  const [rootCauseEliminated, setRootCauseEliminated] = useState(false);
  const [preventiveMeasuresImplemented, setPreventiveMeasuresImplemented] = useState(false);
  const [documentationComplete, setDocumentationComplete] = useState(false);
  const [rating, setRating] = useState<CAPAEffectivenessRating>('Effective');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  const calculateScore = (): number => {
    let score = 0;
    
    if (rootCauseEliminated) score += 40;
    if (preventiveMeasuresImplemented) score += 40;
    if (documentationComplete) score += 20;
    
    return score;
  };
  
  const determineRating = (score: number): CAPAEffectivenessRating => {
    if (score >= 90) return 'Highly_Effective';
    if (score >= 70) return 'Effective';  
    if (score >= 40) return 'Partially_Effective';
    return 'Not_Effective';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      const score = calculateScore();
      const calculatedRating = determineRating(score);
      
      // Create effectiveness assessment data
      const effectivenessData: CAPAEffectivenessMetrics = {
        capaId,
        rootCauseEliminated,
        preventiveMeasuresImplemented,
        documentationComplete,
        score,
        rating: calculatedRating,
        notes
      };
      
      // Call the parent callback with the effectiveness data
      if (onEffectivenessUpdate) {
        onEffectivenessUpdate(effectivenessData);
      }
      
      toast({
        title: 'Effectiveness Assessment Saved',
        description: `CAPA effectiveness rated as ${calculatedRating.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error('Error saving effectiveness assessment:', error);
      toast({
        title: 'Error',
        description: 'Failed to save effectiveness assessment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getRatingIcon = (score: number) => {
    if (score >= 90) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else if (score >= 70) {
      return <CheckCircle2 className="h-5 w-5 text-amber-500" />;
    } else if (score >= 40) {
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };
  
  const getRatingColor = (score: number) => {
    if (score >= 90) {
      return 'text-green-800 bg-green-100';
    } else if (score >= 70) {
      return 'text-amber-800 bg-amber-100';
    } else if (score >= 40) {
      return 'text-orange-800 bg-orange-100';
    } else {
      return 'text-red-800 bg-red-100';
    }
  };
  
  const daysSinceImplementation = differenceInDays(
    new Date(),
    new Date(implementationDate)
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Effectiveness Monitoring</span>
          <span className="text-sm font-normal text-gray-500">
            {daysSinceImplementation} days since implementation
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground mb-4">
                Assess the effectiveness of this CAPA by evaluating the following criteria:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rootCause" 
                    checked={rootCauseEliminated}
                    onCheckedChange={(checked) => setRootCauseEliminated(!!checked)}
                  />
                  <Label htmlFor="rootCause">Root cause has been eliminated</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="preventiveMeasures" 
                    checked={preventiveMeasuresImplemented}
                    onCheckedChange={(checked) => setPreventiveMeasuresImplemented(!!checked)}
                  />
                  <Label htmlFor="preventiveMeasures">Preventive measures are in place</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="documentation" 
                    checked={documentationComplete}
                    onCheckedChange={(checked) => setDocumentationComplete(!!checked)}
                  />
                  <Label htmlFor="documentation">Documentation is complete and accurate</Label>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes" className="block mb-2">Notes</Label>
              <Textarea 
                id="notes"
                placeholder="Add any additional observations or comments about the effectiveness of this CAPA..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="pt-2">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving Assessment...
                  </>
                ) : (
                  'Save Assessment'
                )}
              </Button>
            </div>
            
            {calculateScore() > 0 && (
              <div className={`p-4 rounded-md ${getRatingColor(calculateScore())} mt-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getRatingIcon(calculateScore())}
                    <span className="ml-2 font-medium">
                      {determineRating(calculateScore()).replace('_', ' ')}
                    </span>
                  </div>
                  <span className="font-bold">{calculateScore()}/100</span>
                </div>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
