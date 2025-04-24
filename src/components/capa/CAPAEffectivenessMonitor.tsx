
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertTriangle, BarChart, Loader2 } from 'lucide-react';
import { CAPAEffectivenessRating } from '@/types/capa';
import { supabase } from '@/integrations/supabase/client';

interface CAPAEffectivenessMonitorProps {
  capaId: string;
  implementationDate: string;
}

const CAPAEffectivenessMonitor: React.FC<CAPAEffectivenessMonitorProps> = ({ 
  capaId,
  implementationDate 
}) => {
  const [rootCauseEliminated, setRootCauseEliminated] = useState<boolean>(false);
  const [preventiveMeasures, setPreventiveMeasures] = useState<boolean>(false);
  const [documentationComplete, setDocumentationComplete] = useState<boolean>(false);
  const [recurrence, setRecurrence] = useState<string>('No recurrence detected');
  const [notes, setNotes] = useState<string>('');
  const [rating, setRating] = useState<CAPAEffectivenessRating>('Effective');
  const [loading, setLoading] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [savedAssessment, setSavedAssessment] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Calculate score based on checkboxes
    let newScore = 0;
    if (rootCauseEliminated) newScore += 40;
    if (preventiveMeasures) newScore += 30;
    if (documentationComplete) newScore += 30;

    // Determine rating based on score
    let newRating: CAPAEffectivenessRating = 'Not_Effective';
    if (newScore >= 90) newRating = 'Highly_Effective';
    else if (newScore >= 70) newRating = 'Effective';
    else if (newScore >= 40) newRating = 'Partially_Effective';

    setScore(newScore);
    setRating(newRating);
  }, [rootCauseEliminated, preventiveMeasures, documentationComplete]);

  useEffect(() => {
    const fetchEffectivenessAssessment = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('capa_effectiveness_assessments')
          .select('*')
          .eq('capa_id', capaId)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error code
          throw error;
        }

        if (data) {
          setSavedAssessment(data);
          setRootCauseEliminated(data.root_cause_eliminated || false);
          setPreventiveMeasures(data.preventive_measures_implemented || false);
          setDocumentationComplete(data.documentation_complete || false);
          setNotes(data.notes || '');
          setRecurrence(data.recurrence_check || 'No recurrence detected');
          
          // Convert DB format to app format for rating
          if (data.rating === 'Partially Effective') {
            setRating('Partially_Effective');
          } else if (data.rating === 'Not Effective') {
            setRating('Not_Effective');
          } else if (data.rating === 'Highly Effective') {
            setRating('Highly_Effective');
          } else {
            setRating(data.rating as CAPAEffectivenessRating);
          }
          
          setScore(data.score || 0);
        }
      } catch (error) {
        console.error('Error fetching effectiveness assessment:', error);
        toast({
          title: 'Error',
          description: 'Failed to load effectiveness assessment data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEffectivenessAssessment();
  }, [capaId, toast]);

  const handleSaveAssessment = async () => {
    try {
      setLoading(true);

      // Convert app format to DB format for rating
      let dbRating;
      if (rating === 'Partially_Effective') {
        dbRating = 'Partially Effective';
      } else if (rating === 'Not_Effective') {
        dbRating = 'Not Effective';
      } else if (rating === 'Highly_Effective') {
        dbRating = 'Highly Effective';
      } else {
        dbRating = rating;
      }

      const assessmentData = {
        capa_id: capaId,
        assessment_date: new Date().toISOString(),
        root_cause_eliminated: rootCauseEliminated,
        preventive_measures_implemented: preventiveMeasures,
        documentation_complete: documentationComplete,
        score: score,
        rating: dbRating,
        recurrence_check: recurrence,
        notes: notes,
        created_by: 'system' // This should be the actual user ID in a real implementation
      };

      let response;
      if (savedAssessment) {
        // Update existing assessment
        response = await supabase
          .from('capa_effectiveness_assessments')
          .update(assessmentData)
          .eq('id', savedAssessment.id)
          .select();
      } else {
        // Create new assessment
        response = await supabase
          .from('capa_effectiveness_assessments')
          .insert(assessmentData)
          .select();
      }

      const { data, error } = response;

      if (error) throw error;

      setSavedAssessment(data[0]);
      
      toast({
        title: 'Assessment Saved',
        description: 'Effectiveness assessment has been saved successfully',
      });

    } catch (error: any) {
      console.error('Error saving effectiveness assessment:', error);
      toast({
        title: 'Error',
        description: `Failed to save assessment: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRatingBadgeColor = () => {
    switch(rating) {
      case 'Highly_Effective':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Effective':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Partially_Effective':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Not_Effective':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatRatingLabel = (rating: CAPAEffectivenessRating): string => {
    return rating.replace('_', ' ');
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-blue-500" />
              CAPA Effectiveness Monitoring
            </CardTitle>
            <CardDescription>
              Assess if corrective and preventive actions have been effective
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={`${getRatingBadgeColor()} px-2 py-1`}
          >
            {formatRatingLabel(rating)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="rootCause" 
                  checked={rootCauseEliminated} 
                  onCheckedChange={(checked) => setRootCauseEliminated(checked === true)} 
                />
                <div className="flex flex-col">
                  <Label htmlFor="rootCause" className="font-medium">
                    Root cause has been eliminated
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Verify that the identified root cause no longer exists
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="preventive" 
                  checked={preventiveMeasures} 
                  onCheckedChange={(checked) => setPreventiveMeasures(checked === true)} 
                />
                <div className="flex flex-col">
                  <Label htmlFor="preventive" className="font-medium">
                    Preventive measures have been implemented
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Confirm that controls to prevent recurrence are in place
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="documentation" 
                  checked={documentationComplete} 
                  onCheckedChange={(checked) => setDocumentationComplete(checked === true)} 
                />
                <div className="flex flex-col">
                  <Label htmlFor="documentation" className="font-medium">
                    Documentation is complete
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    All relevant SOPs, forms, and training have been updated
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="recurrence">Recurrence check:</Label>
              <Select value={recurrence} onValueChange={setRecurrence}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recurrence status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No recurrence detected">No recurrence detected</SelectItem>
                  <SelectItem value="Partial recurrence">Partial recurrence</SelectItem>
                  <SelectItem value="Issue has recurred">Issue has recurred</SelectItem>
                  <SelectItem value="Not applicable">Not applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="notes">Assessment notes:</Label>
              <Textarea 
                id="notes" 
                placeholder="Add any additional notes about the effectiveness assessment"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="pt-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  <span className="text-xl font-bold">{score}%</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Effectiveness Score</p>
                  <div className="flex items-center">
                    {score >= 70 ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                    )}
                    <span className="text-sm font-medium">
                      {score >= 90 ? 'Excellent' : 
                       score >= 70 ? 'Good' : 
                       score >= 40 ? 'Needs improvement' : 
                       'Inadequate'}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSaveAssessment}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Assessment
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
