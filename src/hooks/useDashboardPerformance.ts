
import { useState, useEffect, useCallback } from 'react';

interface DashboardData {
  complaints: any[];
  capas: any[];
  nonConformances: any[];
  documents: any[];
}

interface DashboardStats {
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;
  fetchDuration: number;
}

export const useDashboardPerformance = () => {
  const [data, setData] = useState<DashboardData>({
    complaints: [],
    capas: [],
    nonConformances: [],
    documents: []
  });

  const [stats, setStats] = useState<DashboardStats>({
    loading: false,
    error: null,
    lastFetch: null,
    fetchDuration: 0
  });

  const fetchData = useCallback(async () => {
    const startTime = Date.now();
    setStats(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Mock data for now - replace with actual API calls when ready
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      const mockData: DashboardData = {
        complaints: [],
        capas: [],
        nonConformances: [],
        documents: []
      };

      setData(mockData);
      
      const duration = Date.now() - startTime;
      setStats({
        loading: false,
        error: null,
        lastFetch: new Date(),
        fetchDuration: duration
      });
    } catch (error) {
      setStats({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastFetch: null,
        fetchDuration: Date.now() - startTime
      });
    }
  }, []);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    stats,
    refreshData
  };
};
