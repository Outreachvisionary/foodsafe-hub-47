
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DepartmentStat {
  department: string;
  name: string;
  completed: number;
  overdue: number;
  totalAssigned: number;
  complianceRate: number;
}

interface DepartmentComplianceChartProps {
  departmentStats: DepartmentStat[];
}

const DepartmentComplianceChart: React.FC<DepartmentComplianceChartProps> = ({ departmentStats }) => {
  // Define color based on compliance rate
  const getBarColor = (rate: number) => {
    if (rate >= 90) return '#22c55e'; // Green
    if (rate >= 75) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={departmentStats}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Compliance Rate']}
            contentStyle={{ fontSize: 12, borderRadius: 4 }}
          />
          <Bar 
            dataKey="complianceRate" 
            name="Compliance Rate"
            radius={[4, 4, 0, 0]}
          >
            {departmentStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.complianceRate)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentComplianceChart;
