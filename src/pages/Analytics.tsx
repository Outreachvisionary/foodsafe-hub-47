
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp,
  PieChart,
  LineChart,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const Analytics = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const kpiCards = [
    {
      title: 'CAPA Effectiveness',
      value: '89%',
      change: '+5%',
      trend: 'up',
      icon: Target,
      color: 'text-green-600'
    },
    {
      title: 'Audit Completion Rate',
      value: '95%',
      change: '+2%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-blue-600'
    },
    {
      title: 'Non-Conformance Rate',
      value: '2.3%',
      change: '-0.5%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      title: 'Training Compliance',
      value: '92%',
      change: '+3%',
      trend: 'up',
      icon: Activity,
      color: 'text-purple-600'
    }
  ];

  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground text-lg">
            Performance insights and quality metrics
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.title}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {kpi.title}
                    </CardTitle>
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{kpi.value}</span>
                    <span className={`text-sm flex items-center gap-1 ${
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="h-4 w-4" />
                      {kpi.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                CAPA Status Overview
              </CardTitle>
              <CardDescription>Current status of all CAPA actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Chart placeholder - implement with recharts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Non-Conformance by Category
              </CardTitle>
              <CardDescription>Distribution of non-conformances by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Chart placeholder - implement with recharts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Quality Metrics Trend
            </CardTitle>
            <CardDescription>Monthly trends for key quality indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <LineChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Trend chart placeholder - implement with recharts</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This will show CAPA effectiveness, audit scores, and compliance rates over time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedSidebarLayout>
  );
};

export default Analytics;
