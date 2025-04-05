
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DepartmentTrainingStats } from '@/types/training';

const DepartmentComplianceChart: React.FC = () => {
  // Sample department compliance data - show only top departments
  const departmentData: DepartmentTrainingStats[] = [
    { 
      departmentName: 'Quality',
      totalAssigned: 150,
      completed: 120,
      inProgress: 26,
      overdue: 4,
      compliancePercentage: 94,
      department: 'Quality', 
      compliance: 94, 
      completedCount: 120, 
      overdueCount: 4,
      employeeCount: 12
    },
    { 
      departmentName: 'Management',
      totalAssigned: 50,
      completed: 42,
      inProgress: 6,
      overdue: 2,
      compliancePercentage: 96,
      department: 'Management', 
      compliance: 96, 
      completedCount: 42, 
      overdueCount: 2,
      employeeCount: 8
    },
    { 
      departmentName: 'R&D',
      totalAssigned: 120,
      completed: 95,
      inProgress: 19,
      overdue: 6,
      compliancePercentage: 89,
      department: 'R&D', 
      compliance: 89, 
      completedCount: 95, 
      overdueCount: 6,
      employeeCount: 10
    },
    { 
      departmentName: 'Production',
      totalAssigned: 250,
      completed: 180,
      inProgress: 42,
      overdue: 28,
      compliancePercentage: 72,
      department: 'Production', 
      compliance: 72, 
      completedCount: 180, 
      overdueCount: 28,
      employeeCount: 45
    }
  ];

  const getBarColor = (compliance: number) => {
    if (compliance >= 90) return '#22c55e'; // green
    if (compliance >= 75) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{data.department}</p>
          <p className="text-sm text-gray-600">{`Compliance: ${data.compliance}%`}</p>
          <p className="text-sm text-gray-600">{`${data.completedCount} trainings completed`}</p>
          <p className="text-sm text-gray-600">{`${data.overdueCount} trainings overdue`}</p>
          <p className="text-sm text-gray-600">{`${data.employeeCount} employees`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={departmentData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="department" 
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis 
            domain={[0, 100]}
            label={{ 
              value: 'Compliance %', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="compliance" fill="#4f46e5">
            {departmentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.compliance)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentComplianceChart;
