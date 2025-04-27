
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMockTrainingStats } from '@/services/mockDataService';

// Interface for department training stats
interface DepartmentTrainingStats {
  department: string;
  name: string;
  completed: number;
  overdue: number;
  totalAssigned: number;
  complianceRate: number;
}

const DepartmentComplianceChart = () => {
  // Get data from mock service instead of hardcoding
  const { departmentStats } = getMockTrainingStats();
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={departmentStats}
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
