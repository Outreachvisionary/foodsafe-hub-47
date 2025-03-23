
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck } from 'lucide-react';

interface OverallComplianceCardProps {
  compliancePercentage: number;
  totalAssigned: number;
  completed: number;
}

const OverallComplianceCard: React.FC<OverallComplianceCardProps> = ({ 
  compliancePercentage,
  totalAssigned,
  completed
}) => {
  const getComplianceColor = (percentage: number) => {
    if (percentage >= 85) return 'text-green-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getComplianceStatus = (percentage: number) => {
    if (percentage >= 85) return 'Good';
    if (percentage >= 70) return 'Needs Improvement';
    return 'Critical';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
          Overall Training Compliance
        </CardTitle>
        <CardDescription>Training completion across the organization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">{compliancePercentage}%</span>
            <span className={`font-medium ${getComplianceColor(compliancePercentage)}`}>
              {getComplianceStatus(compliancePercentage)}
            </span>
          </div>
          
          <Progress value={compliancePercentage} className="h-2" />
          
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">
              {completed} of {totalAssigned} trainings completed
            </span>
            <span className="text-muted-foreground">
              Target: 90%
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4">
            <ComplianceCategory 
              title="ISO 9001" 
              percentage={82} 
            />
            <ComplianceCategory 
              title="GMP" 
              percentage={79} 
            />
            <ComplianceCategory 
              title="HACCP" 
              percentage={91} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ComplianceCategoryProps {
  title: string;
  percentage: number;
}

const ComplianceCategory: React.FC<ComplianceCategoryProps> = ({ title, percentage }) => {
  const getColorClass = (value: number) => {
    if (value >= 85) return 'text-green-500';
    if (value >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <div className="text-center">
      <h4 className="text-sm font-medium mb-1">{title}</h4>
      <div className={`text-lg font-bold ${getColorClass(percentage)}`}>
        {percentage}%
      </div>
    </div>
  );
};

export default OverallComplianceCard;
