
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { databaseService } from '@/services/databaseService';
import SystemDiagnostics from '@/components/diagnostics/SystemDiagnostics';
import DashboardOverview from './DashboardOverview';
import { AlertTriangle, Database, Activity, Settings } from 'lucide-react';

interface DashboardStats {
  complaints: number;
  nonConformances: number;
  capas: number;
  documents: number;
  loading: boolean;
  error: string | null;
}

const EnhancedDashboard: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    complaints: 0,
    nonConformances: 0,
    capas: 0,
    documents: 0,
    loading: true,
    error: null
  });
  const [activeTab, setActiveTab] = useState('overview');

  const loadDashboardData = async () => {
    if (!isAuthenticated || !user) {
      setStats(prev => ({ ...prev, loading: false, error: 'User not authenticated' }));
      return;
    }

    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      // Test basic connectivity first
      const isAuth = await databaseService.checkAuth();
      if (!isAuth) {
        throw new Error('Database authentication failed');
      }

      // Load data with error handling for each service
      const [complaints, capas] = await Promise.allSettled([
        databaseService.getComplaints(),
        databaseService.getCAPAs()
      ]);

      const newStats: Partial<DashboardStats> = {
        loading: false,
        error: null
      };

      // Handle complaints
      if (complaints.status === 'fulfilled') {
        newStats.complaints = complaints.value.length;
      } else {
        console.error('Failed to load complaints:', complaints.reason);
        newStats.complaints = 0;
      }

      // Handle CAPAs
      if (capas.status === 'fulfilled') {
        newStats.capas = capas.value.length;
      } else {
        console.error('Failed to load CAPAs:', capas.reason);
        newStats.capas = 0;
      }

      // Set placeholder values for other data
      newStats.nonConformances = 0; // TODO: Implement NC service
      newStats.documents = 0; // TODO: Implement document count

      setStats(prev => ({ ...prev, ...newStats }));

    } catch (error) {
      console.error('Dashboard data loading failed:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadDashboardData();
    }
  }, [isAuthenticated, user, authLoading]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-muted-foreground">Please log in to access the dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Food Safety Management Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email || 'User'}
          </p>
        </div>
        <Button onClick={loadDashboardData} disabled={stats.loading}>
          {stats.loading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>

      {stats.error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error loading dashboard data:</strong> {stats.error}
            <Button 
              variant="link" 
              className="p-0 ml-2 text-red-600"
              onClick={() => setActiveTab('diagnostics')}
            >
              Run diagnostics
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Diagnostics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {stats.loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Complaints
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.complaints}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Non-Conformances
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.nonConformances}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      CAPAs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.capas}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.documents}</div>
                  </CardContent>
                </Card>
              </div>

              <DashboardOverview />
            </>
          )}
        </TabsContent>

        <TabsContent value="diagnostics">
          <SystemDiagnostics />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Dashboard configuration options will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDashboard;
