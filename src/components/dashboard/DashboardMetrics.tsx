
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users
} from 'lucide-react';

interface DashboardMetricsProps {
  complaints: number;
  capas: number;
  nonConformances: number;
  documents: number;
  loading: boolean;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  complaints,
  capas,
  nonConformances,
  documents,
  loading
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-12 w-12 bg-muted rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      icon: AlertTriangle,
      label: 'Active Complaints',
      value: complaints,
      color: 'destructive',
      bgColor: 'bg-destructive/10',
      change: '+2 this week'
    },
    {
      icon: Clock,
      label: 'Non-Conformances',
      value: nonConformances,
      color: 'warning',
      bgColor: 'bg-warning/10',
      change: '3 pending review'
    },
    {
      icon: CheckCircle,
      label: 'Active CAPAs',
      value: capas,
      color: 'primary',
      bgColor: 'bg-primary/10',
      change: '5 due this month'
    },
    {
      icon: FileText,
      label: 'Documents',
      value: documents,
      color: 'success',
      bgColor: 'bg-success/10',
      change: '12 updated today'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="card-hover border-border/50 shadow-sm group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className={`h-12 w-12 rounded-xl ${metric.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 text-${metric.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {metric.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {metric.change}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardMetrics;
