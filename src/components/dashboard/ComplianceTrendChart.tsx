
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

// Placeholder chart component - in a real implementation, this would be a real chart
const Chart = () => (
  <div className="w-full h-60 bg-gradient-to-r from-fsms-blue/5 to-fsms-indigo/5 rounded-md flex items-center justify-center">
    <BarChart className="h-12 w-12 text-fsms-blue/30" />
    <span className="ml-2 text-gray-400">Compliance Trend Chart</span>
  </div>
);

const ComplianceTrendChart: React.FC = () => {
  return (
    <Card className="lg:col-span-2 animate-fade-in delay-300">
      <CardHeader>
        <CardTitle>Compliance Trend</CardTitle>
        <CardDescription>Last 6 months performance</CardDescription>
      </CardHeader>
      <CardContent>
        <Chart />
      </CardContent>
    </Card>
  );
};

export default ComplianceTrendChart;
