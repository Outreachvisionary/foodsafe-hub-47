
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CapaStatusChartProps {
  data: Record<string, number>;
}

const CapaStatusChart: React.FC<CapaStatusChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Open', value: data.open || 0, color: '#FFAB00' },
    { name: 'In Progress', value: data['in-progress'] || 0, color: '#0088FE' },
    { name: 'Closed', value: data.closed || 0, color: '#00C49F' },
    { name: 'Verified', value: data.verified || 0, color: '#8884D8' },
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

export default CapaStatusChart;
