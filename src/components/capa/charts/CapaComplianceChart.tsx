
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface CapaComplianceChartProps {
  data: {
    fsma204Rate: number;
    effectiveRate: number;
    closureRate: number;
    overdueRate: number;
  };
}

const CapaComplianceChart: React.FC<CapaComplianceChartProps> = ({ data }) => {
  const chartData = [
    { name: 'FSMA 204', value: data.fsma204Rate, color: '#8884D8' },
    { name: 'Effectiveness', value: data.effectiveRate, color: '#00C49F' },
    { name: 'Closure Rate', value: data.closureRate, color: '#0088FE' },
    { name: 'Overdue Rate', value: data.overdueRate, color: '#FF0000' },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} unit="%" />
          <Tooltip formatter={(value) => [`${value}%`, 'Rate']} />
          <Legend />
          <Bar dataKey="value" name="Compliance Rate" fill="#8884d8" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CapaComplianceChart;
