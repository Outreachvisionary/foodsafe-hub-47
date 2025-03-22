
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface OpenIssuesCardProps {
  totalIssues: number;
  criticalIssues: number;
  majorIssues: number;
  minorIssues: number;
}

const OpenIssuesCard: React.FC<OpenIssuesCardProps> = ({
  totalIssues,
  criticalIssues,
  majorIssues,
  minorIssues,
}) => {
  return (
    <Card className="animate-scale-in delay-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
          Open Issues
        </CardTitle>
        <CardDescription>Requires attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-fsms-dark mb-2">{totalIssues}</div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Critical: {criticalIssues}</span>
          <span className="text-gray-500">Major: {majorIssues}</span>
          <span className="text-gray-500">Minor: {minorIssues}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenIssuesCard;
