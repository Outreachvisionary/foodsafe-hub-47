
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaQuestionCircle } from 'react-icons/fa';
import { CAPA } from '@/types/capa';

interface CAPAEffectivenessMonitorProps {
  capas: CAPA[];
}

type EffectivenessRating = 'Highly Effective' | 'Effective' | 'Partially Effective' | 'Not Effective';
type RatingSummary = Record<string, { count: number; color: string; icon: React.FC }>;

const CAPAEffectivenessMonitor: React.FC<CAPAEffectivenessMonitorProps> = ({ capas }) => {
  const ratingSummary = React.useMemo(() => {
    const summary: RatingSummary = {
      'Highly Effective': { count: 0, color: 'text-green-600', icon: FaCheckCircle },
      'Effective': { count: 0, color: 'text-green-500', icon: FaCheckCircle },
      'Partially Effective': { count: 0, color: 'text-yellow-500', icon: FaExclamationCircle },
      'Not Effective': { count: 0, color: 'text-red-500', icon: FaTimesCircle },
      'Not Verified': { count: 0, color: 'text-gray-400', icon: FaQuestionCircle }
    };
    
    capas.forEach(capa => {
      if (!capa.effectiveness_verified) {
        summary['Not Verified'].count++;
      } else {
        // Ensure we're using the correct type comparison
        const rating = capa.effectiveness_rating;
        if (rating === 'Highly_Effective') {
          summary['Highly Effective'].count++;
        } else if (rating === 'Effective') {
          summary['Effective'].count++;
        } else if (rating === 'Partially_Effective') {
          summary['Partially Effective'].count++;
        } else if (rating === 'Not_Effective') {
          summary['Not Effective'].count++;
        } else {
          summary['Not Verified'].count++;
        }
      }
    });
    
    return summary;
  }, [capas]);
  
  const totalVerified = React.useMemo(() => {
    return capas.filter(capa => capa.effectiveness_verified).length;
  }, [capas]);
  
  const totalCapas = capas.length;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>CAPA Effectiveness</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Verification Progress */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Verification Progress</span>
              <span className="text-sm font-semibold">{totalVerified}/{totalCapas}</span>
            </div>
            <Progress value={(totalVerified / totalCapas) * 100} className="h-2" />
          </div>
          
          {/* Effectiveness Ratings */}
          <div className="pt-4 space-y-3">
            {Object.entries(ratingSummary).map(([rating, { count, color, icon: Icon }]) => {
              if (rating === 'Not Verified' && count === 0) return null;
              
              const percentage = totalCapas > 0 ? Math.round((count / totalCapas) * 100) : 0;
              
              return (
                <div key={rating} className="flex items-center">
                  <Icon className={`${color} mr-2`} />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span>{rating}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                    <Progress value={percentage} className="h-1.5 mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
