
import { supabase } from '@/integrations/supabase/client';

// Types for KPI data
export interface ProductionData {
  id?: string;
  month: string;
  target: number;
  actual: number;
}

export interface QualityData {
  id?: string;
  month: string;
  defect_rate: number;
  return_rate: number;
}

export interface SafetyData {
  id?: string;
  month: string;
  incidents: number;
  near_misses: number;
}

export interface KpiMetric {
  id?: string;
  metric_name: string;
  metric_value: number;
  metric_target?: number;
  metric_unit?: string;
  trend?: number;
  trend_period?: string;
  progress_value?: number;
  icon: string;
  category: string;
}

// Fetch production data
export const fetchProductionData = async (): Promise<ProductionData[]> => {
  const { data, error } = await supabase
    .from('kpi_production_data')
    .select('*')
    .order('month');

  if (error) {
    console.error('Error fetching production data:', error);
    return [];
  }

  return data || [];
};

// Fetch quality data
export const fetchQualityData = async (): Promise<QualityData[]> => {
  const { data, error } = await supabase
    .from('kpi_quality_data')
    .select('*')
    .order('month');

  if (error) {
    console.error('Error fetching quality data:', error);
    return [];
  }

  return data || [];
};

// Fetch safety data
export const fetchSafetyData = async (): Promise<SafetyData[]> => {
  const { data, error } = await supabase
    .from('kpi_safety_data')
    .select('*')
    .order('month');

  if (error) {
    console.error('Error fetching safety data:', error);
    return [];
  }

  return data || [];
};

// Fetch KPI metrics
export const fetchKpiMetrics = async (): Promise<KpiMetric[]> => {
  const { data, error } = await supabase
    .from('kpi_metrics')
    .select('*');

  if (error) {
    console.error('Error fetching KPI metrics:', error);
    return [];
  }

  return data || [];
};
