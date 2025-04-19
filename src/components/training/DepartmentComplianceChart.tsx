
import React from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DepartmentTrainingStats } from '@/types/training';

interface DepartmentComplianceChartProps {
  departmentStats: DepartmentTrainingStats[];
}

const DepartmentComplianceChart: React.FC<DepartmentComplianceChartProps> = ({ departmentStats }) => {
  // Prepare the data for the chart
  const chartData = departmentStats.map(dept => ({
    name: dept.name,
    completed: dept.completed,
    overdue: dept.overdue,
    compliance: dept.complianceRate
  }));

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
          <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="completed" name="Completed" fill="#82ca9d" />
          <Bar yAxisId="left" dataKey="overdue" name="Overdue" fill="#ff8a65" />
          <Bar yAxisId="right" dataKey="compliance" name="Compliance (%)" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentComplianceChart;
