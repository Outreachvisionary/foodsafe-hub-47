
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DepartmentTrainingStats } from '@/types/training';

const sampleData: DepartmentTrainingStats[] = [
  {
    departmentName: 'Production',
    totalAssigned: 56,
    completed: 42,
    inProgress: 10,
    overdue: 4,
    compliancePercentage: 75,
    completedCount: 42,
    overdueCount: 4,
    employeeCount: 20
  },
  {
    departmentName: 'Quality',
    totalAssigned: 32,
    completed: 28,
    inProgress: 4,
    overdue: 0,
    compliancePercentage: 87.5,
    completedCount: 28,
    overdueCount: 0,
    employeeCount: 8
  },
  {
    departmentName: 'Maintenance',
    totalAssigned: 24,
    completed: 18,
    inProgress: 4,
    overdue: 2,
    compliancePercentage: 75,
    completedCount: 18,
    overdueCount: 2,
    employeeCount: 6
  },
  {
    departmentName: 'Management',
    totalAssigned: 16,
    completed: 16,
    inProgress: 0,
    overdue: 0,
    compliancePercentage: 100,
    completedCount: 16,
    overdueCount: 0,
    employeeCount: 4
  }
];

interface DepartmentComplianceChartProps {
  data?: DepartmentTrainingStats[];
}

const DepartmentComplianceChart: React.FC<DepartmentComplianceChartProps> = ({ data = sampleData }) => {
  const getBarColor = (percentage: number) => {
    if (percentage >= 90) return '#22c55e';  // Green
    if (percentage >= 70) return '#f59e0b';  // Amber
    return '#ef4444';                        // Red
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Training Compliance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="departmentName" 
                angle={-45} 
                textAnchor="end" 
                tick={{ fontSize: 12 }}
                height={60}
              />
              <YAxis 
                label={{ value: 'Completion %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} 
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [`${value}%`, 'Compliance']}
                labelFormatter={(label: string) => `Department: ${label}`}
              />
              <Bar 
                dataKey="compliancePercentage" 
                name="Compliance" 
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.compliancePercentage)} />
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
