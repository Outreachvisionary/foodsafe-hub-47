import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Calendar,
  Target,
  Users,
  Award,
  Activity,
  BarChart3
} from 'lucide-react';
import { CAPAStats } from '@/types/capa';

interface EnhancedCAPAStats extends CAPAStats {
  // Risk Assessment Stats
  riskLevels: Record<string, number>;
  riskTrends: Array<{ month: string; critical: number; high: number; medium: number; low: number }>;
  
  // Effectiveness Stats
  effectivenessStats: {
    effective: number;
    partiallyEffective: number;
    notEffective: number;
    pending: number;
  };
  
  // Cost Analysis
  costAnalysis: {
    totalCost: number;
    avgCostPerCAPA: number;
    costByDepartment: Record<string, number>;
    costSavings: number;
    roi: number;
  };
  
  // Compliance Stats
  complianceStats: {
    sqf: number;
    brc: number;
    fssc22000: number;
    haccp: number;
    overall: number;
  };
  
  // Performance Metrics
  performance: {
    avgResolutionTime: number;
    onTimeCompletion: number;
    recurrenceRate: number;
    customerSatisfaction: number;
  };
  
  // Trending Data
  trends: Array<{
    month: string;
    opened: number;
    closed: number;
    overdue: number;
    effectiveness: number;
  }>;
}

interface CAPAEnhancedDashboardProps {
  stats: EnhancedCAPAStats;
  timeRange: '30d' | '90d' | '6m' | '12m';
  onTimeRangeChange: (range: '30d' | '90d' | '6m' | '12m') => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CAPAEnhancedDashboard: React.FC<CAPAEnhancedDashboardProps> = ({
  stats,
  timeRange,
  onTimeRangeChange
}) => {
  const [selectedView, setSelectedView] = useState<string>('overview');

  // Calculate key metrics
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  const overdueRate = stats.total > 0 ? (stats.overdue / stats.total) * 100 : 0;
  const effectivenessRate = stats.effectivenessStats 
    ? (stats.effectivenessStats.effective / (stats.effectivenessStats.effective + stats.effectivenessStats.partiallyEffective + stats.effectivenessStats.notEffective)) * 100 
    : 0;

  // Risk level data for charts
  const riskData = Object.entries(stats.riskLevels || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Effectiveness data
  const effectivenessData = stats.effectivenessStats ? [
    { name: 'Effective', value: stats.effectivenessStats.effective },
    { name: 'Partially Effective', value: stats.effectivenessStats.partiallyEffective },
    { name: 'Not Effective', value: stats.effectivenessStats.notEffective },
    { name: 'Pending Review', value: stats.effectivenessStats.pending }
  ] : [];

  // Compliance data
  const complianceData = stats.complianceStats ? [
    { standard: 'SQF', compliance: stats.complianceStats.sqf },
    { standard: 'BRC', compliance: stats.complianceStats.brc },
    { standard: 'FSSC 22000', compliance: stats.complianceStats.fssc22000 },
    { standard: 'HACCP', compliance: stats.complianceStats.haccp }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">CAPA Analytics Dashboard</h2>
        <div className="flex gap-2">
          {(['30d', '90d', '6m', '12m'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange(range)}
            >
              {range === '30d' ? '30 Days' : 
               range === '90d' ? '90 Days' : 
               range === '6m' ? '6 Months' : '12 Months'}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total CAPAs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{completionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Overdue Rate</p>
                <p className="text-2xl font-bold">{overdueRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Effectiveness</p>
                <p className="text-2xl font-bold">{effectivenessRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Cost Savings</p>
                <p className="text-2xl font-bold">
                  ${stats.costAnalysis?.costSavings?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Compliance</p>
                <p className="text-2xl font-bold">
                  {stats.complianceStats?.overall?.toFixed(1) || '0'}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="effectiveness">Effectiveness</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {/* CAPA Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>CAPA Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(stats.byStatus).map(([name, value]) => ({ name, value }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(stats.byStatus).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Trends Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>CAPA Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.trends || []}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="opened" stroke="#8884d8" name="Opened" />
                      <Line type="monotone" dataKey="closed" stroke="#82ca9d" name="Closed" />
                      <Line type="monotone" dataKey="overdue" stroke="#ff7300" name="Overdue" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(stats.byDepartment).map(([name, value]) => ({ name, value }))}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {/* Risk Level Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Level Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Risk Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Trends Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.riskTrends || []}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="critical" stackId="1" stroke="#ff4444" fill="#ff4444" />
                      <Area type="monotone" dataKey="high" stackId="1" stroke="#ff8800" fill="#ff8800" />
                      <Area type="monotone" dataKey="medium" stackId="1" stroke="#ffbb00" fill="#ffbb00" />
                      <Area type="monotone" dataKey="low" stackId="1" stroke="#00cc44" fill="#00cc44" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="effectiveness" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {/* Effectiveness Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>CAPA Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={effectivenessData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {effectivenessData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Average Resolution Time</span>
                    <span>{stats.performance?.avgResolutionTime || 0} days</span>
                  </div>
                  <Progress value={Math.min((stats.performance?.avgResolutionTime || 0) / 30 * 100, 100)} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>On-Time Completion</span>
                    <span>{stats.performance?.onTimeCompletion || 0}%</span>
                  </div>
                  <Progress value={stats.performance?.onTimeCompletion || 0} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Recurrence Rate</span>
                    <span>{stats.performance?.recurrenceRate || 0}%</span>
                  </div>
                  <Progress value={stats.performance?.recurrenceRate || 0} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Customer Satisfaction</span>
                    <span>{stats.performance?.customerSatisfaction || 0}%</span>
                  </div>
                  <Progress value={stats.performance?.customerSatisfaction || 0} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {/* Compliance by Standard */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance by Standard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={complianceData}>
                      <XAxis dataKey="standard" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="compliance" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {complianceData.map((item) => (
                  <div key={item.standard}>
                    <div className="flex justify-between mb-2">
                      <span>{item.standard}</span>
                      <span>{item.compliance}%</span>
                    </div>
                    <Progress value={item.compliance} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {/* Cost Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Total CAPA Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${stats.costAnalysis?.totalCost?.toLocaleString() || '0'}</p>
                <p className="text-sm text-muted-foreground">
                  Avg per CAPA: ${stats.costAnalysis?.avgCostPerCAPA?.toLocaleString() || '0'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  ${stats.costAnalysis?.costSavings?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-muted-foreground">
                  ROI: {stats.costAnalysis?.roi || 0}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.costAnalysis?.costByDepartment || {}).map(([dept, cost]) => (
                    <div key={dept} className="flex justify-between">
                      <span className="text-sm">{dept}</span>
                      <span className="text-sm font-medium">${cost.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CAPAEnhancedDashboard;