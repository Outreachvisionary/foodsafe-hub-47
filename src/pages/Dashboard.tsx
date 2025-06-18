
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Users,
  FileText,
  TrendingUp,
  Activity
} from 'lucide-react';

const Dashboard = () => {
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

  const metrics = [
    {
      title: 'Open CAPAs',
      value: '12',
      change: '+2',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Completed Audits',
      value: '8',
      change: '+3',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Pending Documents',
      value: '5',
      change: '-1',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Training',
      value: '24',
      change: '+5',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const recentActivities = [
    { action: 'New CAPA created', item: 'CAPA-2024-001', time: '2 hours ago', type: 'capa' },
    { action: 'Document approved', item: 'SOP-Quality-Control', time: '4 hours ago', type: 'document' },
    { action: 'Audit completed', item: 'Internal Audit Q1', time: '1 day ago', type: 'audit' },
    { action: 'Training assigned', item: 'HACCP Refresher', time: '2 days ago', type: 'training' }
  ];

  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Overview of your quality management system
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                      <Icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className="text-sm text-green-600">{metric.change}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.item}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <AlertTriangle className="h-6 w-6 mb-2 text-orange-600" />
                  <p className="font-medium">Create CAPA</p>
                </button>
                <button className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <FileText className="h-6 w-6 mb-2 text-blue-600" />
                  <p className="font-medium">New Document</p>
                </button>
                <button className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <Clock className="h-6 w-6 mb-2 text-purple-600" />
                  <p className="font-medium">Schedule Audit</p>
                </button>
                <button className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <Users className="h-6 w-6 mb-2 text-green-600" />
                  <p className="font-medium">Assign Training</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedSidebarLayout>
  );
};

export default Dashboard;
