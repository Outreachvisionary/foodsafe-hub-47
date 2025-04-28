
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMockTrainingStatistics } from '@/services/mockDataService';

const DepartmentComplianceChart = () => {
  const [trainingStats, setTrainingStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Use synchronous mock data
    const mockStats = getMockTrainingStatistics();
    setTrainingStats(mockStats);
    setLoading(false);
  }, []);
  
  if (loading || !trainingStats) {
    return <Card className="w-full h-80 animate-pulse bg-muted"></Card>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Department Training Compliance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={trainingStats.departmentCompliance}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis 
                domain={[0, 100]}
                label={{ value: 'Completion Rate (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="compliance" name="Completion Rate (%)" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentComplianceChart;
