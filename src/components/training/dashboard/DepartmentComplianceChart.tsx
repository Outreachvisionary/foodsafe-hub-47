
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UsersRound } from 'lucide-react';
import { DepartmentTrainingStats } from '@/types/training';

const DepartmentComplianceChart: React.FC = () => {
  // Sample department compliance data
  const departmentData: DepartmentTrainingStats[] = [
    { 
      department: 'Production', 
      compliance: 72, 
      completedCount: 180, 
      overdueCount: 28,
      employeeCount: 45
    },
    { 
      department: 'Quality', 
      compliance: 94, 
      completedCount: 120, 
      overdueCount: 4,
      employeeCount: 12
    },
    { 
      department: 'Maintenance', 
      compliance: 68, 
      completedCount: 75, 
      overdueCount: 15,
      employeeCount: 18
    },
    { 
      department: 'R&D', 
      compliance: 89, 
      completedCount: 95, 
      overdueCount: 6,
      employeeCount: 10
    },
    { 
      department: 'Management', 
      compliance: 96, 
      completedCount: 42, 
      overdueCount: 2,
      employeeCount: 8
    },
    { 
      department: 'Logistics', 
      compliance: 75, 
      completedCount: 68, 
      overdueCount: 12,
      employeeCount: 15
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersRound className="h-5 w-5 text-blue-500" />
          Department Compliance
        </CardTitle>
        <CardDescription>
          Training compliance by department
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                label={{ 
                  value: 'Compliance %', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
                domain={[0, 100]}
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
      </CardContent>
    </Card>
  );
};

export default DepartmentComplianceChart;
