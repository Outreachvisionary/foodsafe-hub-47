
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardData {
  complaints: any[];
  capas: any[];
  nonConformances: any[];
  documents: any[];
  training: {
    sessions: any[];
    records: any[];
  };
}

interface PerformanceStats {
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;
  fetchDuration: number;
}

export const useDashboardPerformance = () => {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<DashboardData>({
    complaints: [],
    capas: [],
    nonConformances: [],
    documents: [],
    training: { sessions: [], records: [] }
  });
  const [stats, setStats] = useState<PerformanceStats>({
    loading: true,
    error: null,
    lastFetch: null,
    fetchDuration: 0
  });

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setStats(prev => ({ ...prev, loading: false, error: 'Not authenticated' }));
      return;
    }

    const startTime = performance.now();
    setStats(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Batch all queries to reduce round trips
      const [
        complaintsResult,
        capasResult,
        nonConformancesResult,
        documentsResult,
        trainingSessionsResult,
        trainingRecordsResult
      ] = await Promise.allSettled([
        supabase.from('complaints').select('*').limit(20),
        supabase.from('capa_actions').select('*').limit(20),
        supabase.from('non_conformances').select('*').limit(20),
        supabase.from('documents').select('*').limit(20),
        supabase.from('training_sessions').select('*').limit(20),
        supabase.from('training_records').select('*').limit(20)
      ]);

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Extract data from settled promises
      const newData: DashboardData = {
        complaints: complaintsResult.status === 'fulfilled' ? complaintsResult.value.data || [] : [],
        capas: capasResult.status === 'fulfilled' ? capasResult.value.data || [] : [],
        nonConformances: nonConformancesResult.status === 'fulfilled' ? nonConformancesResult.value.data || [] : [],
        documents: documentsResult.status === 'fulfilled' ? documentsResult.value.data || [] : [],
        training: {
          sessions: trainingSessionsResult.status === 'fulfilled' ? trainingSessionsResult.value.data || [] : [],
          records: trainingRecordsResult.status === 'fulfilled' ? trainingRecordsResult.value.data || [] : []
        }
      };

      setData(newData);
      setStats({
        loading: false,
        error: null,
        lastFetch: new Date(),
        fetchDuration: duration
      });

      console.log(`Dashboard data fetched in ${duration.toFixed(2)}ms`);
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.error('Dashboard fetch error:', error);
      setStats({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        lastFetch: new Date(),
        fetchDuration: duration
      });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    stats,
    refreshData: fetchDashboardData
  };
};
