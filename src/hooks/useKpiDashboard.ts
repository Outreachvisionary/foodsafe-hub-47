import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface KPIData {
  id: string;
  title: string;
  value: number;
  target: number;
  trend: number;
  description: string;
  updated_at: string;
}

interface SafetyData {
  id: string;
  title: string;
  value: number;
  target: number;
  trend: number;
  description: string;
  updated_at: string;
}

interface MetricsData {
  id: string;
  title: string;
  value: number;
  target: number;
  trend: number;
  description: string;
  updated_at: string;
}

export const useKpiDashboard = () => {
  const [kpiData, setKPIData] = useState<KPIData[]>([]);
  const [safetyData, setSafetyData] = useState<SafetyData[]>([]);
  const [metrics, setMetrics] = useState<MetricsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKPIData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kpi_quality_data')
        .select('*')
        .order('title', { ascending: true });

      if (error) {
        console.error('Error fetching KPI data:', error);
        setError(error.message);
      } else {
        setKPIData(data || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching KPI data:', err);
      setError('Failed to load KPI data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSafetyData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kpi_safety_data')
        .select('*')
        .order('title', { ascending: true });

      if (error) {
        console.error('Error fetching safety data:', error);
        setError(error.message);
      } else {
        setSafetyData(data || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching safety data:', err);
      setError('Failed to load safety data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kpi_metrics')
        .select('*')
        .order('title', { ascending: true });

      if (error) {
        console.error('Error fetching metrics:', error);
        setError(error.message);
      } else {
        setMetrics(data || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching metrics:', err);
      setError('Failed to load metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIData();

    // Set up real-time subscriptions
    const qualityChannel = supabase
      .channel('kpi_quality_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'kpi_quality_data' }, 
        () => fetchQualityData()
      )
      .subscribe();

    const safetyChannel = supabase
      .channel('kpi_safety_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'kpi_safety_data' }, 
        () => fetchSafetyData()
      )
      .subscribe();

    const metricsChannel = supabase
      .channel('kpi_metrics_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'kpi_metrics' }, 
        () => fetchMetrics()
      )
      .subscribe();

    return () => {
      qualityChannel.unsubscribe();
      safetyChannel.unsubscribe();
      metricsChannel.unsubscribe();
    };
  }, []);

  return {
    kpiData,
    safetyData,
    metrics,
    loading,
    error,
    fetchKPIData,
    fetchSafetyData,
    fetchMetrics
  };
};
