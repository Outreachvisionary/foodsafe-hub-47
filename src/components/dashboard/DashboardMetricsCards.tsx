
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import type { DashboardMetrics, SystemHealth } from '@/types/dashboard';

interface DashboardMetricsCardsProps {
  metrics: DashboardMetrics;
  systemHealth: SystemHealth;
}

const DashboardMetricsCards: React.FC<DashboardMetricsCardsProps> = ({ metrics, systemHealth }) => {
  const getHealthColor = (health: SystemHealth['overall']) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getHealthIcon = (health: SystemHealth['overall']) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            Active Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.activeIssues}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {metrics.trends.complaints > 0 ? (
              <TrendingUp className="h-3 w-3 text-red-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-green-500" />
            )}
            <span>{metrics.trends.complaints > 0 ? '+' : ''}{metrics.trends.complaints}% this month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Completion Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.completionRate}%</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {metrics.trends.capas > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span>{metrics.trends.capas > 0 ? '+' : ''}{metrics.trends.capas}% this week</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Compliance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.complianceScore}%</div>
          <Badge variant={metrics.complianceScore >= 90 ? 'default' : metrics.complianceScore >= 70 ? 'secondary' : 'destructive'}>
            {metrics.complianceScore >= 90 ? 'Excellent' : metrics.complianceScore >= 70 ? 'Good' : 'Needs Attention'}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getHealthColor(systemHealth.overall)}>
              {getHealthIcon(systemHealth.overall)}
              <span className="ml-1 capitalize">{systemHealth.overall}</span>
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>DB: <span className={`capitalize ${systemHealth.database === 'healthy' ? 'text-green-600' : systemHealth.database === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>{systemHealth.database}</span></div>
            <div>Auth: <span className={`capitalize ${systemHealth.authentication === 'healthy' ? 'text-green-600' : 'text-yellow-600'}`}>{systemHealth.authentication}</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetricsCards;
