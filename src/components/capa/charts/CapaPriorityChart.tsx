
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CapaPriorityChartProps {
  data: Record<string, number>;
}

const CapaPriorityChart: React.FC<CapaPriorityChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Critical', value: data.critical || 0, color: '#FF0000' },
    { name: 'High', value: data.high || 0, color: '#FF8042' },
    { name: 'Medium', value: data.medium || 0, color: '#FFAB00' },
    { name: 'Low', value: data.low || 0, color: '#00C49F' },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}`, 'Count']} />
          <Legend />
          <Bar dataKey="value" name="CAPA Count" fill="#8884d8" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CapaPriorityChart;
