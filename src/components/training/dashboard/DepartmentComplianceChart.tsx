
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DepartmentTrainingStats } from '@/types/training';

// Sample data for the dashboard
const sampleData: DepartmentTrainingStats[] = [
  {
    department: 'production',
    name: 'Production',
    completed: 42,
    overdue: 8,
    totalAssigned: 50,
    complianceRate: 84
  },
  {
    department: 'quality',
    name: 'Quality',
    completed: 18,
    overdue: 2,
    totalAssigned: 20,
    complianceRate: 90
  },
  {
    department: 'maintenance',
    name: 'Maintenance',
    completed: 12,
    overdue: 3,
    totalAssigned: 15,
    complianceRate: 80
  },
  {
    department: 'warehouse',
    name: 'Warehouse',
    completed: 22,
    overdue: 3,
    totalAssigned: 25,
    complianceRate: 88
  }
];

const DepartmentComplianceChart = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sampleData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            domain={[0, 100]} 
            label={{ value: 'Compliance %', angle: -90, position: 'insideRight' }} 
          />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="completed" fill="#10B981" name="Completed" />
          <Bar yAxisId="left" dataKey="overdue" fill="#EF4444" name="Overdue" />
          <Bar yAxisId="right" dataKey="complianceRate" fill="#6366F1" name="Compliance %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentComplianceChart;
