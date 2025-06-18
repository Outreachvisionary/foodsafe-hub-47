
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';

const Performance = () => {
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

  const performanceMetrics = [
    {
      title: 'Overall QMS Score',
      value: '87',
      unit: '/100',
      change: '+3',
      trend: 'up',
      target: '90',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Audit Success Rate',
      value: '94',
      unit: '%',
      change: '+2',
      trend: 'up',
      target: '95',
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'CAPA Effectiveness',
      value: '89',
      unit: '%',
      change: '+5',
      trend: 'up',
      target: '92',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Response Time',
      value: '2.3',
      unit: 'days',
      change: '-0.5',
      trend: 'down',
      target: '2.0',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const departmentPerformance = [
    { department: 'Quality Assurance', score: 92, trend: 'up', change: '+4' },
    { department: 'Production', score: 85, trend: 'up', change: '+2' },
    { department: 'Procurement', score: 88, trend: 'down', change: '-1' },
    { department: 'Maintenance', score: 83, trend: 'up', change: '+3' }
  ];

  const recentAchievements = [
    { title: 'Zero Non-Conformances', description: 'Manufacturing line A - 30 days', icon: Award, color: 'text-green-600' },
    { title: 'Audit Excellence', description: 'Q1 Internal Audit - 98% score', icon: CheckCircle, color: 'text-blue-600' },
    { title: 'Training Completion', description: 'HACCP module - 100% completion', icon: Users, color: 'text-purple-600' },
    { title: 'Process Improvement', description: 'Reduced cycle time by 15%', icon: TrendingUp, color: 'text-orange-600' }
  ];

  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Performance</h1>
              <p className="text-muted-foreground text-lg">
                Quality management system performance metrics and achievements
              </p>
            </div>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric) => {
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
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold">
                        {metric.value}
                        <span className="text-sm text-muted-foreground">{metric.unit}</span>
                      </span>
                      <span className={`text-sm flex items-center gap-1 ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {metric.change}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Target: {metric.target}{metric.unit}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Performance scores by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentPerformance.map((dept) => (
                  <div key={dept.department} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium">{dept.department}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold">{dept.score}</span>
                        <span className={`text-sm flex items-center gap-1 ${
                          dept.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {dept.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {dept.change}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={dept.score >= 90 ? 'default' : dept.score >= 80 ? 'secondary' : 'destructive'}>
                        {dept.score >= 90 ? 'Excellent' : dept.score >= 80 ? 'Good' : 'Needs Improvement'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Notable accomplishments and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAchievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`p-2 rounded-lg bg-white`}>
                        <Icon className={`h-4 w-4 ${achievement.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Trends
            </CardTitle>
            <CardDescription>Historical performance data and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Performance trend chart placeholder</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This will show performance metrics over time with benchmarks and targets
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedSidebarLayout>
  );
};

export default Performance;
