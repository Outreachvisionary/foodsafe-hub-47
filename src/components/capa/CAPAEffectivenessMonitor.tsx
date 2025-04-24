
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, HelpCircle, BarChart2 } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';
import { CAPAEffectivenessMetrics, CAPAEffectivenessRating } from '@/types/capa';
import CAPAEffectivenessForm from './CAPAEffectivenessForm';

interface CAPAEffectivenessMonitorProps {
  capaId: string;
  title: string;
  implementationDate?: string;
}

const CAPAEffectivenessMonitor: React.FC<CAPAEffectivenessMonitorProps> = ({
  capaId,
  title,
  implementationDate
}) => {
  // For this example, we'll simulate fetching effectiveness metrics
  const [metrics, setMetrics] = useState<CAPAEffectivenessMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Simulate loading effectiveness metrics
  useEffect(() => {
    const loadMetrics = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch this from the backend
        // For now, we'll just use a mock implementation
        setTimeout(() => {
          // Mock data or null if not assessed yet
          setMetrics(null);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading effectiveness metrics:', error);
        setLoading(false);
      }
    };
    
    loadMetrics();
  }, [capaId]);
  
  const getRatingColor = (rating: CAPAEffectivenessRating) => {
    switch (rating) {
      case 'Highly_Effective':
        return 'bg-green-500';
      case 'Effective':
        return 'bg-blue-500';
      case 'Partially_Effective':
        return 'bg-yellow-500';
      case 'Not_Effective':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getRatingIcon = (rating: CAPAEffectivenessRating) => {
    switch (rating) {
      case 'Highly_Effective':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Effective':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'Partially_Effective':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'Not_Effective':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const handleSubmitAssessment = async (data: CAPAEffectivenessMetrics) => {
    try {
      console.log('Submitting effectiveness assessment:', data);
      // In a real app, you would save this to the backend
      // For now, we'll just update the local state
      setMetrics(data);
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting effectiveness assessment:', error);
      throw error;
    }
  };
  
  const shouldEnableAssessment = () => {
    if (!implementationDate) return false;
    return isPast(parseISO(implementationDate));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart2 className="h-5 w-5" />
          Effectiveness Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <p className="text-sm text-gray-500">Loading assessment data...</p>
          </div>
        ) : metrics ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getRatingIcon(metrics.rating)}
                <span className="font-medium">{metrics.rating.replace('_', ' ')}</span>
              </div>
              <Badge className={`${getRatingColor(metrics.rating)} text-white`}>
                Score: {metrics.score}%
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                <span className="text-lg font-semibold">{metrics.rootCauseEliminated ? '✓' : '✗'}</span>
                <span className="text-xs text-center">Root Cause</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                <span className="text-lg font-semibold">{metrics.preventiveMeasuresImplemented ? '✓' : '✗'}</span>
                <span className="text-xs text-center">Prevention</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                <span className="text-lg font-semibold">{metrics.documentationComplete ? '✓' : '✗'}</span>
                <span className="text-xs text-center">Documentation</span>
              </div>
            </div>
            
            {metrics.notes && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">Notes:</p>
                <p className="text-sm text-gray-600">{metrics.notes}</p>
              </div>
            )}
          </div>
        ) : showForm ? (
          <CAPAEffectivenessForm 
            capaId={capaId}
            onSubmit={handleSubmitAssessment}
            implementationDate={implementationDate}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              No effectiveness assessment has been completed for this CAPA yet.
            </p>
            
            {implementationDate && (
              <div className="text-sm">
                <p className="font-medium">Implementation Date:</p>
                <p className="text-gray-600">
                  {format(parseISO(implementationDate), 'PPP')}
                </p>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowForm(true)}
                disabled={!shouldEnableAssessment()}
                className={`px-4 py-2 rounded text-sm ${
                  shouldEnableAssessment()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {shouldEnableAssessment()
                  ? 'Assess Effectiveness'
                  : 'Not Yet Implemented'}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
