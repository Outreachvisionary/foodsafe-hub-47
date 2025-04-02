
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export interface OverallComplianceCardProps {
  compliancePercentage: number;
  avgScore?: number; // Add avgScore as an optional prop
}

const OverallComplianceCard: React.FC<OverallComplianceCardProps> = ({ 
  compliancePercentage,
  avgScore 
}) => {
  // Determine status color based on compliance percentage
  const getStatusColor = (percent: number) => {
    if (percent >= 90) return 'text-green-600';
    if (percent >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  // Get progress color based on percentage
  const getProgressColor = (percent: number) => {
    if (percent >= 90) return 'bg-green-600';
    if (percent >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
          Overall Training Compliance
        </CardTitle>
        <CardDescription>Organization-wide training status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold mb-2 flex items-center">
            <span className={getStatusColor(compliancePercentage)}>{compliancePercentage}%</span>
          </div>
          <Progress 
            value={compliancePercentage} 
            className="h-2 w-full mb-4" 
            indicatorClassName={getProgressColor(compliancePercentage)}
          />
          
          <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
              <span>Status</span>
              <span className={getStatusColor(compliancePercentage)}>
                {compliancePercentage >= 90 ? 'Compliant' : 
                 compliancePercentage >= 70 ? 'At Risk' : 'Non-Compliant'}
              </span>
            </div>
            
            {avgScore !== undefined && (
              <div className="flex justify-between text-sm mb-1">
                <span>Avg. Score</span>
                <span className="font-medium">{avgScore}%</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm mb-1">
              <span>Last Updated</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallComplianceCard;
