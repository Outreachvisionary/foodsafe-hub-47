
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CapaOverviewChartProps {
  data: {
    open: number;
    inProgress: number;
    closed: number;
    verified: number;
    overdue: number;
    pendingVerification: number;
  };
}

const CapaOverviewChart: React.FC<CapaOverviewChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Open', value: data.open, color: '#FFAB00' },
    { name: 'In Progress', value: data.inProgress, color: '#0088FE' },
    { name: 'Closed', value: data.closed, color: '#00C49F' },
    { name: 'Verified', value: data.verified, color: '#8884D8' },
    { name: 'Overdue', value: data.overdue, color: '#FF0000' },
    { name: 'Pending Verification', value: data.pendingVerification, color: '#FF8042' },
  ].filter(item => item.value > 0); // Only show non-zero values

  if (chartData.length === 0) {
    return <div className="h-64 flex items-center justify-center">No data available</div>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, 'Count']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CapaOverviewChart;
