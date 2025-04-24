
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chart } from '@/components/charts/Chart';
import { CAPAStatusBadge } from './CAPAStatusBadge';
import { CAPAStatus, CAPAStats } from '@/types/capa';

interface CAPADashboardProps {
  stats: CAPAStats;
}

const CAPADashboard: React.FC<CAPADashboardProps> = ({ stats }) => {
  const {
    total,
    openCount,
    closedCount,
    overdueCount,
    pendingVerificationCount,
    effectivenessRate,
    byPriority,
    bySource,
    byDepartment
  } = stats;

  const formatPercentage = (value: number, total: number): string => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  const getProgressColor = (status: string): string => {
    switch (status) {
      case 'Closed':
        return 'bg-green-500';
      case 'Overdue':
        return 'bg-red-500';
      case 'Pending_Verification':
        return 'bg-amber-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getEffectivenessColor = (rate: number): string => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const getEffectivenessRating = (rate: number): string => {
    if (rate >= 90) return 'Highly Effective';
    if (rate >= 70) return 'Effective';
    if (rate >= 40) return 'Partially Effective';
    return 'Not Effective';
  };

  // For the chart
  const priorityData = Object.entries(byPriority).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const sourceData = Object.entries(bySource).map(([key, value]) => ({
    name: key.replace('_', ' '),
    value: value
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Total CAPAs</p>
              <p className="text-3xl font-bold">{total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Open</p>
              <p className="text-3xl font-bold">{openCount}</p>
              <p className="text-sm text-gray-500">{formatPercentage(openCount, total)} of total</p>
              <Progress value={(openCount / total) * 100} className="h-1 bg-gray-100" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Closed</p>
              <p className="text-3xl font-bold">{closedCount}</p>
              <p className="text-sm text-gray-500">{formatPercentage(closedCount, total)} of total</p>
              <Progress value={(closedCount / total) * 100} className={`h-1 ${getProgressColor('Closed')}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Overdue</p>
              <p className="text-3xl font-bold">{overdueCount}</p>
              <p className="text-sm text-gray-500">{formatPercentage(overdueCount, total)} of total</p>
              <Progress value={(overdueCount / total) * 100} className={`h-1 ${getProgressColor('Overdue')}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Effectiveness Rate */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Overall Effectiveness</h3>
              <p className="text-sm text-gray-500">Based on closed CAPAs</p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${getEffectivenessColor(effectivenessRate)}`}>
                {effectivenessRate}%
              </p>
              <p className="text-sm">{getEffectivenessRating(effectivenessRate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="priority" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="priority">By Priority</TabsTrigger>
          <TabsTrigger value="source">By Source</TabsTrigger>
          <TabsTrigger value="department">By Department</TabsTrigger>
        </TabsList>

        <TabsContent value="priority" className="mt-0">
          <Card>
            <CardContent className="p-6 h-[300px]">
              <Chart data={priorityData} type="pie" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="source" className="mt-0">
          <Card>
            <CardContent className="p-6 h-[300px]">
              <Chart data={sourceData} type="bar" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department" className="mt-0">
          <Card>
            <CardContent className="p-6 h-[300px]">
              <Chart data={Object.entries(byDepartment).map(([key, value]) => ({ name: key, value }))} type="bar" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CAPADashboard;
