
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';

interface ComplianceOverviewCardProps {
  compliancePercentage: number;
  changePercentage: number;
}

const ComplianceOverviewCard: React.FC<ComplianceOverviewCardProps> = ({ 
  compliancePercentage,
  changePercentage
}) => {
  return (
    <Card className="animate-scale-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          Overall Compliance
        </CardTitle>
        <CardDescription>Across all standards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-fsms-dark mb-2">{compliancePercentage}%</div>
        <Progress value={compliancePercentage} className="h-2" />
        <p className="text-sm text-gray-500 mt-2">
          {changePercentage > 0 ? '+' : ''}{changePercentage}% from last month
        </p>
      </CardContent>
    </Card>
  );
};

export default ComplianceOverviewCard;
