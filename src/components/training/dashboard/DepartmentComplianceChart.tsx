
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
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <UsersRound className="h-5 w-5 text-blue-500 mr-2" />
          Department Compliance
        </CardTitle>
        <CardDescription>Training completion by department</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={departmentData}
              margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="department" 
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="compliance" name="Compliance" radius={[4, 4, 0, 0]}>
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.compliance)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-sm text-center text-muted-foreground">
          Target: 90% compliance across all departments
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentComplianceChart;
