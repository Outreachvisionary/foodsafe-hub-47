
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Database, RefreshCw } from 'lucide-react';
import { useDashboardPerformance } from '@/hooks/useDashboardPerformance';
import DashboardMetrics from './DashboardMetrics';
import Loading from '@/components/Loading';

const OptimizedDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { data, stats, refreshData } = useDashboardPerformance();

  if (authLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Performance Info */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email || 'User'}
          </p>
          {stats.lastFetch && (
            <p className="text-xs text-muted-foreground">
              Last updated: {stats.lastFetch.toLocaleTimeString()} 
              ({stats.fetchDuration.toFixed(0)}ms)
            </p>
          )}
        </div>
        <Button 
          onClick={refreshData} 
          disabled={stats.loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${stats.loading ? 'animate-spin' : ''}`} />
          {stats.loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {/* Error Alert */}
      {stats.error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error loading dashboard data:</strong> {stats.error}
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Cards */}
      <DashboardMetrics
        complaints={data.complaints.length}
        capas={data.capas.length}
        nonConformances={data.nonConformances.length}
        documents={data.documents.length}
        loading={stats.loading}
      />

      {/* Performance Info Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Database className="h-4 w-4" />
            <span>
              Performance: {stats.fetchDuration.toFixed(0)}ms fetch time
              {stats.lastFetch && ` • Updated ${stats.lastFetch.toLocaleTimeString()}`}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedDashboard;
