
import React, { useState } from 'react';
import { Gauge, TrendingUp, Activity, RefreshCw, BarChart2 } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useKpiDashboard } from '@/hooks/useKpiDashboard';
import { KpiMetric } from '@/services/kpiService';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Performance = () => {
  const [activeTab, setActiveTab] = useState('kpis');
  const { 
    kpiMetrics, 
    productionData, 
    qualityData, 
    safetyData, 
    loading, 
    error, 
    refetchAll 
  } = useKpiDashboard();

  // Function to get the correct icon component
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      'LineChart': <TrendingUp className="h-5 w-5 text-primary" />,
      'BarChart': <BarChart2 className="h-5 w-5 text-primary" />,
      'Gauge': <Gauge className="h-5 w-5 text-primary" />,
      'Activity': <Activity className="h-5 w-5 text-primary" />
    };
    
    return icons[iconName] || <Activity className="h-5 w-5 text-primary" />;
  };

  // Handle loading state
  if (loading) {
    return (
      <>
        <DashboardHeader 
          title="Performance Monitoring" 
          subtitle="Track key performance indicators and metrics across the organization"
        />
        <div className="container mx-auto py-6 flex items-center justify-center h-64">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-muted-foreground">Loading performance data...</p>
          </div>
        </div>
      </>
    );
  }

  // Handle error state
  if (error) {
    return (
      <>
        <DashboardHeader 
          title="Performance Monitoring" 
          subtitle="Track key performance indicators and metrics across the organization"
        />
        <div className="container mx-auto py-6 flex flex-col items-center justify-center h-64">
          <p className="text-destructive mb-4">Error loading performance data</p>
          <Button onClick={refetchAll}>Retry</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader 
        title="Performance Monitoring" 
        subtitle="Track key performance indicators and metrics across the organization"
      />

      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="kpis">Key Performance Indicators</TabsTrigger>
              <TabsTrigger value="metrics">Operational Metrics</TabsTrigger>
              <TabsTrigger value="reports">Performance Reports</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={refetchAll}
            className="ml-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <TabsContent value="kpis" className="mt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
            {kpiMetrics.map((metric: KpiMetric) => (
              <KpiCard 
                key={metric.id}
                title={metric.metric_name} 
                value={metric.metric_value}
                target={metric.metric_target}
                unit={metric.metric_unit || ''}
                trend={metric.trend || 0}
                icon={getIconComponent(metric.icon)}
                sourceModule={getModuleForKpiCategory(metric.category)}
              />
            ))}
          </div>

          {productionData.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Production Efficiency Trend</CardTitle>
                <CardDescription>Target vs Actual production over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="target" fill="#8884d8" name="Target" />
                      <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {qualityData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Quality Data</CardTitle>
                  <CardDescription>Defect and return rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={qualityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="defect_rate" fill="#ff8042" name="Defect Rate %" />
                        <Bar dataKey="return_rate" fill="#ffbb28" name="Return Rate %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {safetyData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Safety Data</CardTitle>
                  <CardDescription>Incidents and near misses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={safetyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="incidents" fill="#f44336" name="Incidents" />
                        <Bar dataKey="near_misses" fill="#ff9800" name="Near Misses" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Operational Metrics</CardTitle>
              <CardDescription>Detailed metrics by department and process</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Advanced operational metrics sourced from all modules</p>
                <Button variant="outline">Configure Operational Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reports</CardTitle>
              <CardDescription>Scheduled and on-demand performance reports</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Generate custom reports based on system-wide data</p>
                <Button>Create New Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </>
  );
};

// Get source module name based on KPI category
const getModuleForKpiCategory = (category: string): string => {
  const moduleMapping: Record<string, string> = {
    'quality': 'Non-Conformance & Audit',
    'safety': 'Non-Conformance',
    'compliance': 'HACCP & Audit',
    'production': 'Supplier Management'
  };
  
  return moduleMapping[category] || 'Manual Entry';
};

// KPI card component
interface KpiCardProps {
  title: string;
  value: number;
  target?: number;
  unit?: string;
  trend?: number;
  icon: React.ReactNode;
  sourceModule: string;
}

const KpiCard = ({ 
  title, 
  value, 
  target, 
  unit = "", 
  trend = 0, 
  icon,
  sourceModule 
}: KpiCardProps) => {
  const isPositiveTrend = trend >= 0;
  const progressValue = target ? Math.min(100, (value / target) * 100) : 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/20 p-1.5 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline">
          <div className="text-2xl font-bold">
            {typeof value === 'number' ? value.toLocaleString() : value}{unit}
          </div>
          {target !== undefined && (
            <div className="ml-2 text-sm text-muted-foreground">
              / {target.toLocaleString()}{unit} target
            </div>
          )}
        </div>
        
        <div className="flex items-center text-sm">
          <span className="text-muted-foreground">Source: </span>
          <span className="ml-1 font-medium">{sourceModule}</span>
        </div>
        
        {trend !== undefined && (
          <div className={`flex items-center text-sm ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
            {isPositiveTrend ? 
              <TrendingUp className="mr-1 h-4 w-4" /> : 
              <TrendingUp className="mr-1 h-4 w-4 transform rotate-180" />
            }
            <span>{isPositiveTrend ? '+' : ''}{trend}% vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Performance;
