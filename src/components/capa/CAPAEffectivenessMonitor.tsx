
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CAPAEffectivenessRating,
  CAPAEffectivenessMetrics
} from '@/types/capa';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [effectivenessData, setEffectivenessData] = useState<{
    rootCauseEliminated: boolean;
    preventiveMeasuresImplemented: boolean;
    documentationComplete: boolean;
    recurrenceCheck: string;
    rating: CAPAEffectivenessRating;
    score: number;
  }>({
    rootCauseEliminated: false,
    preventiveMeasuresImplemented: false,
    documentationComplete: false,
    recurrenceCheck: '',
    rating: 'Effective',
    score: 0
  });

  const calculateEffectivenessScore = () => {
    let score = 0;
    
    if (effectivenessData.rootCauseEliminated) score += 40;
    if (effectivenessData.preventiveMeasuresImplemented) score += 30;
    if (effectivenessData.documentationComplete) score += 15;
    if (effectivenessData.recurrenceCheck === 'No recurrence') score += 15;
    
    let rating: CAPAEffectivenessRating = 'Ineffective';
    
    if (score >= 90) rating = 'Highly Effective';
    else if (score >= 75) rating = 'Effective';
    else if (score >= 50) rating = 'Partially Effective';
    else rating = 'Ineffective';
    
    return { score, rating };
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const { score, rating } = calculateEffectivenessScore();
      
      // Update state
      setEffectivenessData(prev => ({ ...prev, score, rating }));
      
      // In a real application, you would save this to the backend
      // For example:
      // await saveEffectivenessAssessment(capaId, { ...effectivenessData, score, rating });
      
      if (onEffectivenessUpdate) {
        onEffectivenessUpdate({
          score,
          rating,
          notes: effectivenessData.recurrenceCheck
        });
      }
      
      setSubmitted(true);
      toast.success('Effectiveness assessment submitted successfully');
    } catch (error) {
      console.error('Error submitting effectiveness assessment:', error);
      toast.error('Failed to submit effectiveness assessment');
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: CAPAEffectivenessRating) => {
    switch (rating) {
      case 'Highly Effective':
        return 'text-green-600';
      case 'Effective':
        return 'text-teal-600';
      case 'Partially Effective':
        return 'text-orange-600';
      case 'Ineffective':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const daysSinceImplementation = Math.floor(
    (new Date().getTime() - new Date(implementationDate).getTime()) / (1000 * 3600 * 24)
  );

  // For demonstration purposes, automatically update recurrence check based on time elapsed
  useEffect(() => {
    if (daysSinceImplementation >= 30) {
      setEffectivenessData(prev => ({
        ...prev,
        recurrenceCheck: 'No recurrence after 30+ days'
      }));
    }
  }, [daysSinceImplementation]);

  if (submitted) {
    const { score, rating } = calculateEffectivenessScore();
    
    return (
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg">CAPA Effectiveness Assessment</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-center mb-6">
              <div className="text-2xl font-bold mb-1 flex items-center justify-center">
                <span className={getRatingColor(rating)}>{rating}</span>
              </div>
              <div className="text-5xl font-bold mb-2">{score}/100</div>
              <p className="text-gray-500">
                Assessment completed {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="w-full max-w-md border rounded-md p-4">
              <h3 className="font-medium mb-2">Assessment Summary</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Root cause eliminated:</span>
                  <span>{effectivenessData.rootCauseEliminated ? 'Yes' : 'No'}</span>
                </li>
                <li className="flex justify-between">
                  <span>Preventive measures implemented:</span>
                  <span>{effectivenessData.preventiveMeasuresImplemented ? 'Yes' : 'No'}</span>
                </li>
                <li className="flex justify-between">
                  <span>Documentation complete:</span>
                  <span>{effectivenessData.documentationComplete ? 'Yes' : 'No'}</span>
                </li>
                <li className="flex justify-between">
                  <span>Recurrence status:</span>
                  <span>{effectivenessData.recurrenceCheck || 'Not checked'}</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg">CAPA Effectiveness Monitor</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">
              This CAPA has been implemented for {daysSinceImplementation} days. Please assess its effectiveness.
            </p>
          </div>
          
          {/* Assessment form would go here */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">1. Has the root cause been eliminated?</h3>
              <div className="flex space-x-4">
                <Button 
                  variant={effectivenessData.rootCauseEliminated ? "default" : "outline"}
                  onClick={() => setEffectivenessData(prev => ({ ...prev, rootCauseEliminated: true }))}
                >
                  Yes
                </Button>
                <Button 
                  variant={!effectivenessData.rootCauseEliminated ? "default" : "outline"}
                  onClick={() => setEffectivenessData(prev => ({ ...prev, rootCauseEliminated: false }))}
                >
                  No
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">2. Have preventive measures been fully implemented?</h3>
              <div className="flex space-x-4">
                <Button 
                  variant={effectivenessData.preventiveMeasuresImplemented ? "default" : "outline"}
                  onClick={() => setEffectivenessData(prev => ({ ...prev, preventiveMeasuresImplemented: true }))}
                >
                  Yes
                </Button>
                <Button 
                  variant={!effectivenessData.preventiveMeasuresImplemented ? "default" : "outline"}
                  onClick={() => setEffectivenessData(prev => ({ ...prev, preventiveMeasuresImplemented: false }))}
                >
                  No
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">3. Is all documentation complete?</h3>
              <div className="flex space-x-4">
                <Button 
                  variant={effectivenessData.documentationComplete ? "default" : "outline"}
                  onClick={() => setEffectivenessData(prev => ({ ...prev, documentationComplete: true }))}
                >
                  Yes
                </Button>
                <Button 
                  variant={!effectivenessData.documentationComplete ? "default" : "outline"}
                  onClick={() => setEffectivenessData(prev => ({ ...prev, documentationComplete: false }))}
                >
                  No
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">4. Has the issue recurred since implementation?</h3>
              <div className="flex space-x-4">
                <Button 
                  variant={effectivenessData.recurrenceCheck === 'No recurrence' ? "default" : "outline"}
                  onClick={() => setEffectivenessData(prev => ({ ...prev, recurrenceCheck: 'No recurrence' }))}
                >
                  No recurrence
                </Button>
                <Button 
                  variant={effectivenessData.recurrenceCheck === 'Has recurred' ? "default" : "outline"}
                  onClick={() => setEffectivenessData(prev => ({ ...prev, recurrenceCheck: 'Has recurred' }))}
                >
                  Has recurred
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-4">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Assessment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
