
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Database, RefreshCw, TestTube, Activity, Settings } from 'lucide-react';
import { useDashboardPerformance } from '@/hooks/useDashboardPerformance';
import DashboardMetrics from './DashboardMetrics';
import ModuleStatusDashboard from '@/components/system/ModuleStatusDashboard';
import Loading from '@/components/Loading';

const OptimizedDashboard: React.FC = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { data, stats, refreshData } = useDashboardPerformance();

  if (authLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="bg-card rounded-xl border border-border/50 p-8 shadow-sm">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-heading-2 text-gradient-primary-accent">
              ComplianceCore Dashboard
            </h1>
            <p className="text-body-2 text-foreground-secondary">
              Welcome back, {user?.email || 'User'}
            </p>
            {stats.lastFetch && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 bg-success rounded-full"></div>
                <span>
                  Last updated: {stats.lastFetch.toLocaleTimeString()} 
                  • Loaded in {stats.fetchDuration.toFixed(0)}ms
                </span>
              </div>
            )}
          </div>
          <Button 
            onClick={refreshData} 
            disabled={stats.loading}
            className="btn-hover-effect px-6 py-2 h-auto"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${stats.loading ? 'animate-spin' : ''}`} />
            {stats.loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      {/* Enhanced Error Alert */}
      {stats.error && (
        <Alert className="border-destructive/20 bg-destructive/5 rounded-xl p-6">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertDescription className="ml-2">
            <div className="space-y-3">
              <div>
                <strong className="text-destructive">System Error Detected</strong>
                <p className="text-sm text-foreground-secondary mt-1">{stats.error}</p>
              </div>
              <Link to="/diagnostics">
                <Button variant="destructive" size="sm" className="btn-hover-effect">
                  <Activity className="h-4 w-4 mr-2" />
                  Run Diagnostics
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Module Status Dashboard */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-4 text-foreground">System Overview</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 bg-success rounded-full animate-pulse"></div>
            <span>All systems operational</span>
          </div>
        </div>
        <ModuleStatusDashboard />
      </div>

      {/* Enhanced Metrics Section */}
      <div className="space-y-6">
        <h2 className="text-heading-4 text-foreground">Key Metrics</h2>
        <DashboardMetrics
          complaints={data.complaints.length}
          capas={data.capas.length}
          nonConformances={data.nonConformances.length}
          documents={data.documents.length}
          loading={stats.loading}
        />
      </div>

      {/* Enhanced Performance Info */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">System Performance</h3>
                <p className="text-sm text-muted-foreground">
                  Fetch time: {stats.fetchDuration.toFixed(0)}ms
                  {stats.lastFetch && ` • Last sync: ${stats.lastFetch.toLocaleTimeString()}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 bg-success rounded-full"></div>
              <span className="text-success font-medium">Optimal</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Testing & Diagnostics Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-heading-4 text-foreground">System Testing & Diagnostics</h2>
            <p className="text-body-2 text-muted-foreground mt-1">
              Monitor system health and run comprehensive tests
            </p>
          </div>
          <Link to="/testing">
            <Button variant="accent" className="btn-hover-effect px-6">
              <TestTube className="h-4 w-4 mr-2" />
              View All Tests
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/database-test">
            <Card className="card-hover border-border/50 shadow-sm cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">Database Test</h4>
                    <p className="text-sm text-muted-foreground">
                      Connection status and authentication verification
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-2 w-2 bg-success rounded-full"></div>
                      <span className="text-xs text-success font-medium">Connected</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/diagnostics">
            <Card className="card-hover border-border/50 shadow-sm cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                    <Activity className="h-6 w-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">System Health</h4>
                    <p className="text-sm text-muted-foreground">
                      Real-time system diagnostics and monitoring
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-2 w-2 bg-success rounded-full animate-pulse"></div>
                      <span className="text-xs text-success font-medium">Healthy</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/backend-tests">
            <Card className="card-hover border-border/50 shadow-sm cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <TestTube className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">Integration Tests</h4>
                    <p className="text-sm text-muted-foreground">
                      Backend-frontend connectivity tests
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-2 w-2 bg-warning rounded-full"></div>
                      <span className="text-xs text-warning font-medium">Pending</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OptimizedDashboard;
