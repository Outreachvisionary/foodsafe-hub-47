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

// Use a caching mechanism to prevent unnecessary refetches
let cachedData = {
  productionData: null as ProductionData[] | null,
  qualityData: null as QualityData[] | null,
  safetyData: null as SafetyData[] | null,
  kpiMetrics: null as KpiMetric[] | null,
  timestamp: 0 // Track when the cache was last updated
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache time-to-live

// Helper to check if cache is valid
const isCacheValid = () => {
  return cachedData.timestamp > 0 && (Date.now() - cachedData.timestamp) < CACHE_TTL;
};

// Fetch production data
export const fetchProductionData = async (): Promise<ProductionData[]> => {
  // Return cached data if valid
  if (isCacheValid() && cachedData.productionData) {
    return cachedData.productionData;
  }

  const { data, error } = await supabase
    .from('kpi_production_data')
    .select('*')
    .order('month');

  if (error) {
    console.error('Error fetching production data:', error);
    return [];
  }

  // Update cache
  cachedData.productionData = data || [];
  cachedData.timestamp = Date.now();
  return data || [];
};

// Fetch quality data
export const fetchQualityData = async (): Promise<QualityData[]> => {
  // Return cached data if valid
  if (isCacheValid() && cachedData.qualityData) {
    return cachedData.qualityData;
  }

  const { data, error } = await supabase
    .from('kpi_quality_data')
    .select('*')
    .order('month');

  if (error) {
    console.error('Error fetching quality data:', error);
    return [];
  }

  // Update cache
  cachedData.qualityData = data || [];
  cachedData.timestamp = Date.now();
  return data || [];
};

// Fetch safety data
export const fetchSafetyData = async (): Promise<SafetyData[]> => {
  // Return cached data if valid
  if (isCacheValid() && cachedData.safetyData) {
    return cachedData.safetyData;
  }

  const { data, error } = await supabase
    .from('kpi_safety_data')
    .select('*')
    .order('month');

  if (error) {
    console.error('Error fetching safety data:', error);
    return [];
  }

  // Update cache
  cachedData.safetyData = data || [];
  cachedData.timestamp = Date.now();
  return data || [];
};

// Fetch KPI metrics
export const fetchKpiMetrics = async (): Promise<KpiMetric[]> => {
  // Return cached data if valid
  if (isCacheValid() && cachedData.kpiMetrics) {
    return cachedData.kpiMetrics;
  }

  const { data, error } = await supabase
    .from('kpi_metrics')
    .select('*');

  if (error) {
    console.error('Error fetching KPI metrics:', error);
    return [];
  }

  // Update cache
  cachedData.kpiMetrics = data || [];
  cachedData.timestamp = Date.now();
  return data || [];
};

// Function to fetch all KPI data at once to minimize loading flicker
export const fetchAllKpiData = async () => {
  // If we have valid cached data for all entities, return it
  if (
    isCacheValid() &&
    cachedData.productionData &&
    cachedData.qualityData &&
    cachedData.safetyData &&
    cachedData.kpiMetrics
  ) {
    return {
      productionData: cachedData.productionData,
      qualityData: cachedData.qualityData,
      safetyData: cachedData.safetyData,
      kpiMetrics: cachedData.kpiMetrics,
    };
  }

  // Otherwise fetch all data in parallel
  const [production, quality, safety, metrics] = await Promise.all([
    fetchProductionData(),
    fetchQualityData(),
    fetchSafetyData(),
    fetchKpiMetrics()
  ]);

  // Set the cache timestamp
  cachedData.timestamp = Date.now();

  return {
    productionData: production,
    qualityData: quality,
    safetyData: safety,
    kpiMetrics: metrics,
  };
};

// Clear the cache (useful when you need fresh data)
export const clearKpiCache = () => {
  cachedData = {
    productionData: null,
    qualityData: null,
    safetyData: null,
    kpiMetrics: null,
    timestamp: 0
  };
};
