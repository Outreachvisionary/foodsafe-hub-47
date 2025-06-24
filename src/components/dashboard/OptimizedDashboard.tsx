import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Database, RefreshCw, TestTube, Activity } from 'lucide-react';
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

      {/* Testing & Diagnostics Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">System Testing & Diagnostics</h3>
              <p className="text-sm text-muted-foreground">
                Quick access to testing tools and system diagnostics
              </p>
            </div>
            <Link to="/testing">
              <Button variant="outline" size="sm">
                View All Tests
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/database-test">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Database className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Database Test</h4>
                      <p className="text-xs text-muted-foreground">Connection & Auth</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/diagnostics">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Activity className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-medium">System Health</h4>
                      <p className="text-xs text-muted-foreground">Live Diagnostics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/backend-tests">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TestTube className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Integration Tests</h4>
                      <p className="text-xs text-muted-foreground">Backend-Frontend</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedDashboard;
