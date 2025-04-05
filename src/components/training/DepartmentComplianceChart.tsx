
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DepartmentTrainingStats } from '@/types/training';

interface DepartmentComplianceChartProps {
  departmentStats: DepartmentTrainingStats[];
}

const DepartmentComplianceChart: React.FC<DepartmentComplianceChartProps> = ({ departmentStats }) => {
  // Transform data for the chart
  const chartData = departmentStats.map(dept => ({
    name: dept.departmentName,
    Completed: dept.completedCount || dept.completed,
    Overdue: dept.overdueCount || dept.overdue,
    Total: dept.employeeCount || dept.totalAssigned,
    ComplianceRate: dept.compliancePercentage
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
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
          <Bar yAxisId="left" dataKey="Completed" fill="#10B981" name="Completed Training" />
          <Bar yAxisId="left" dataKey="Overdue" fill="#EF4444" name="Overdue Training" />
          <Bar yAxisId="right" dataKey="ComplianceRate" fill="#6366F1" name="Compliance Rate %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentComplianceChart;
