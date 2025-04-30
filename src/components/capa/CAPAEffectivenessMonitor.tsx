
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { format, differenceInDays } from 'date-fns';
import { CAPAEffectivenessRating } from '@/types/enums';

interface CAPAEffectivenessMonitorProps {
  id: string;
  implementationDate: string;
}

const CAPAEffectivenessMonitor: React.FC<CAPAEffectivenessMonitorProps> = ({
  id,
  implementationDate
}) => {
  const [daysElapsed, setDaysElapsed] = useState(0);
  const [nextCheckDays, setNextCheckDays] = useState(0);
  const [hasAssessment, setHasAssessment] = useState(false);
  const [effectivenessRating, setEffectivenessRating] = useState<CAPAEffectivenessRating | null>(null);
  
  useEffect(() => {
    if (implementationDate) {
      const implDate = new Date(implementationDate);
      const today = new Date();
      const daysSinceImpl = differenceInDays(today, implDate);
      setDaysElapsed(daysSinceImpl);
      
      // Simulate assessment check schedule
      if (daysSinceImpl >= 90) {
        setHasAssessment(true);
        setEffectivenessRating(CAPAEffectivenessRating.Effective);
      } else {
        setNextCheckDays(90 - daysSinceImpl);
      }
    }
  }, [implementationDate]);

  const getEffectivenessColor = () => {
    if (!effectivenessRating) return 'text-gray-400';
    
    switch (effectivenessRating) {
      case CAPAEffectivenessRating.HighlyEffective:
        return 'text-green-600';
      case CAPAEffectivenessRating.Effective:
        return 'text-green-500';
      case CAPAEffectivenessRating.PartiallyEffective:
        return 'text-amber-500';
      case CAPAEffectivenessRating.NotEffective:
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Effectiveness Monitoring</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-muted-foreground">Implementation Date:</span>
            <span>{format(new Date(implementationDate), 'MMM d, yyyy')}</span>
          </div>
          
          <div className="flex justify-between mb-1">
            <span className="text-muted-foreground">Days Since Implementation:</span>
            <span>{daysElapsed}</span>
          </div>
          
          {hasAssessment ? (
            <>
              <div className="flex justify-between items-center mt-4">
                <span className="text-muted-foreground">Effectiveness Rating:</span>
                <span className={`font-medium ${getEffectivenessColor()}`}>
                  {effectivenessRating?.replace(/_/g, ' ')}
                </span>
              </div>
              
              <div className="mt-4 flex justify-center">
                {effectivenessRating === CAPAEffectivenessRating.Effective || 
                 effectivenessRating === CAPAEffectivenessRating.HighlyEffective ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                    <p className="text-center text-green-700">
                      CAPA effectiveness verified
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <AlertCircle className="h-12 w-12 text-amber-500 mb-2" />
                    <p className="text-center text-amber-700">
                      CAPA requires additional action
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="mt-4 mb-2">
                <span className="text-muted-foreground">Next Effectiveness Check:</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm">{nextCheckDays} days remaining</span>
                  <span className="text-sm">
                    {format(new Date(new Date().getTime() + nextCheckDays * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, (daysElapsed / 90) * 100)} 
                  className="h-2 mt-1" 
                />
              </div>
              
              <Button size="sm" className="w-full mt-4">
                Schedule Assessment
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
