
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
        .order('month', { ascending: true });

      if (error) {
        console.error('Error fetching KPI data:', error);
        setError(error.message);
      } else {
        // Transform database data to match KPIData interface
        const transformedData: KPIData[] = (data || []).map(item => ({
          id: item.id,
          title: `Quality Metrics - ${item.month}`,
          value: item.defect_rate,
          target: 2.0, // Default target
          trend: item.return_rate - item.defect_rate,
          description: `Defect rate: ${item.defect_rate}%, Return rate: ${item.return_rate}%`,
          updated_at: item.updated_at,
        }));
        setKPIData(transformedData);
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
        .order('month', { ascending: true });

      if (error) {
        console.error('Error fetching safety data:', error);
        setError(error.message);
      } else {
        // Transform database data to match SafetyData interface
        const transformedData: SafetyData[] = (data || []).map(item => ({
          id: item.id,
          title: `Safety Metrics - ${item.month}`,
          value: item.incidents,
          target: 0, // Target zero incidents
          trend: item.near_misses - item.incidents,
          description: `Incidents: ${item.incidents}, Near misses: ${item.near_misses}`,
          updated_at: item.updated_at,
        }));
        setSafetyData(transformedData);
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
        .order('metric_name', { ascending: true });

      if (error) {
        console.error('Error fetching metrics:', error);
        setError(error.message);
      } else {
        // Transform database data to match MetricsData interface
        const transformedData: MetricsData[] = (data || []).map(item => ({
          id: item.id,
          title: item.metric_name,
          value: item.metric_value,
          target: item.metric_target || 100,
          trend: item.trend || 0,
          description: `${item.metric_name}: ${item.metric_value} ${item.metric_unit || ''}`,
          updated_at: item.updated_at,
        }));
        setMetrics(transformedData);
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
    fetchSafetyData();
    fetchMetrics();

    // Set up real-time subscriptions
    const qualityChannel = supabase
      .channel('kpi_quality_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'kpi_quality_data' }, 
        () => fetchKPIData()
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
