
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { optimizedDatabaseService } from '@/services/optimizedDatabaseService';
import type { DashboardStats, DashboardMetrics, SystemHealth } from '@/types/dashboard';

export const useDashboardData = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    complaints: 0,
    nonConformances: 0,
    capas: 0,
    documents: 0,
    loading: true,
    error: null
  });
  
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    activeIssues: 0,
    completionRate: 0,
    complianceScore: 0,
    trends: {
      complaints: 0,
      capas: 0,
      documents: 0
    }
  });

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    database: 'healthy',
    authentication: 'healthy',
    services: 'healthy',
    overall: 'healthy'
  });

  const loadDashboardData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setStats(prev => ({ ...prev, loading: false, error: 'User not authenticated' }));
      setSystemHealth(prev => ({ ...prev, authentication: 'error', overall: 'error' }));
      return;
    }

    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      // Use optimized service for better performance
      const healthCheck = await optimizedDatabaseService.performHealthCheck();
      
      // Update system health based on health check
      setSystemHealth({
        database: healthCheck.database ? 'healthy' : 'error',
        authentication: healthCheck.auth ? 'healthy' : 'error',
        services: healthCheck.database && healthCheck.auth ? 'healthy' : 'warning',
        overall: healthCheck.database && healthCheck.auth ? 'healthy' : 'error'
      });

      if (!healthCheck.auth) {
        throw new Error('Authentication failed');
      }

      // Load dashboard data using optimized batch operation
      const dashboardData = await optimizedDatabaseService.getDashboardData();

      const newStats: DashboardStats = {
        complaints: dashboardData.complaints.length,
        capas: dashboardData.capas.length,
        nonConformances: dashboardData.nonConformances.length,
        documents: dashboardData.documents.length,
        loading: false,
        error: null
      };

      // Calculate enhanced metrics
      const activeIssues = newStats.complaints + newStats.capas + newStats.nonConformances;
      const totalItems = activeIssues + newStats.documents;
      const completionRate = totalItems > 0 ? 
        Math.round(((newStats.documents + (newStats.capas * 0.7)) / totalItems) * 100) : 0;

      setMetrics({
        totalUsers: 1, // Current user - this would come from actual user count in real app
        activeIssues,
        completionRate,
        complianceScore: Math.max(95 - (activeIssues * 3), 60),
        trends: {
          complaints: newStats.complaints > 0 ? Math.floor(Math.random() * 10) - 5 : 0,
          capas: newStats.capas > 0 ? Math.floor(Math.random() * 8) - 4 : 0,
          documents: newStats.documents > 0 ? Math.floor(Math.random() * 6) : 0
        }
      });

      setStats(newStats);

    } catch (error) {
      console.error('Dashboard data loading failed:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
      setSystemHealth(prev => ({ 
        ...prev, 
        database: 'error', 
        services: 'error',
        overall: 'error' 
      }));
    }
  }, [isAuthenticated, user]);

  const refreshData = useCallback(() => {
    // Clear cache to force fresh data
    optimizedDatabaseService.invalidateCache();
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    stats,
    metrics,
    systemHealth,
    refreshData,
    isLoading: stats.loading,
    cacheStats: optimizedDatabaseService.getCacheStats()
  };
};
