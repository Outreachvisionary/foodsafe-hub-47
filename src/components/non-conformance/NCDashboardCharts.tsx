
import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

interface BarChartComponentProps {
  data: ChartData[];
}

export const BarChartComponent: React.FC<BarChartComponentProps> = ({ data }) => {
  // Default colors if not provided in data
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#6b7280'];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          height={70} 
          tick={{ fontSize: 12 }} 
        />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`${value}`, 'Count']}
          labelFormatter={(label) => `Category: ${label}`}
        />
        <Bar dataKey="value" fill="#3b82f6">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

interface PieChartComponentProps {
  data: ChartData[];
}

export const PieChartComponent: React.FC<PieChartComponentProps> = ({ data }) => {
  // Default colors if not provided in data
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#6b7280'];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value}`, 'Count']}
          labelFormatter={(name) => `Status: ${name}`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
