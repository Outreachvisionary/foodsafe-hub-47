
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Clock, Activity, AlertTriangle } from 'lucide-react';
import { CAPA, CAPAStats } from '@/types/capa';
import Chart from '@/components/charts/Chart';

// Define the props interface for CAPADashboard
interface CAPADashboardProps {
  stats: CAPAStats;
}

const CAPADashboard: React.FC<CAPADashboardProps> = ({ stats }) => {
  // Provide default empty stats if not provided
  const defaultStats: CAPAStats = {
    total: 0,
    openCount: 0,
    closedCount: 0,
    overdueCount: 0,
    pendingVerificationCount: 0,
    effectivenessRate: 0,
    byPriority: {},
    bySource: {},
    byDepartment: {},
    byStatus: {},
    byMonth: {},
    overdue: 0
  };

  const safeStats = stats || defaultStats;

  // Status distribution data
  const statusData = {
    labels: ['Open', 'Closed', 'Overdue', 'Pending Verification'],
    datasets: [
      {
        data: [
          safeStats.openCount,
          safeStats.closedCount,
          safeStats.overdueCount,
          safeStats.pendingVerificationCount,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // blue
          'rgba(16, 185, 129, 0.7)', // green
          'rgba(239, 68, 68, 0.7)',  // red
          'rgba(139, 92, 246, 0.7)', // purple
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Priority distribution data
  const priorityData = {
    labels: Object.keys(safeStats.byPriority),
    datasets: [
      {
        label: 'CAPAs by Priority',
        data: Object.values(safeStats.byPriority),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Source distribution data
  const sourceData = {
    labels: Object.keys(safeStats.bySource),
    datasets: [
      {
        label: 'CAPAs by Source',
        data: Object.values(safeStats.bySource),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for bar charts
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* CAPA Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total CAPAs</p>
                <h3 className="text-2xl font-bold">{safeStats.total}</h3>
              </div>
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Open CAPAs</p>
                <h3 className="text-2xl font-bold text-blue-600">{safeStats.openCount}</h3>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Overdue</p>
                <h3 className="text-2xl font-bold text-red-600">{safeStats.overdueCount}</h3>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Closed</p>
                <h3 className="text-2xl font-bold text-green-600">{safeStats.closedCount}</h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Effectiveness Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Effectiveness Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Progress value={safeStats.effectivenessRate} />
            </div>
            <div className="text-2xl font-bold text-green-600">{safeStats.effectivenessRate}%</div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Measures how effective implemented CAPAs are at preventing recurrence.</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CAPA Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <Chart type="pie" data={statusData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Tabs defaultValue="priority">
              <TabsList>
                <TabsTrigger value="priority">By Priority</TabsTrigger>
                <TabsTrigger value="source">By Source</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="h-80">
            <TabsContent value="priority">
              <Chart type="bar" data={priorityData} options={barOptions} />
            </TabsContent>
            <TabsContent value="source">
              <Chart type="bar" data={sourceData} options={barOptions} />
            </TabsContent>
          </CardContent>
        </Card>
      </div>
      
      {/* Alerts Section */}
      {safeStats.overdueCount > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-red-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              There {safeStats.overdueCount === 1 ? 'is' : 'are'} {safeStats.overdueCount} overdue CAPA{safeStats.overdueCount === 1 ? '' : 's'} requiring immediate attention.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CAPADashboard;
