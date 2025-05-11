
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

// Source types for module integration
export type KpiDataSource = 'manual' | 'haccp' | 'audit' | 'non_conformance' | 'capa' | 'supplier' | 'training';

// Enhanced KPI service with module source mapping
interface ModuleSourceData {
  module: KpiDataSource;
  tableName: string; 
  metrics: string[];
}

// Define which modules feed into which KPI metrics
const kpiSourceMapping: Record<string, ModuleSourceData[]> = {
  'quality': [
    { module: 'non_conformance', tableName: 'non_conformances', metrics: ['status', 'item_category'] },
    { module: 'audit', tableName: 'audits', metrics: ['status', 'findings_count'] }
  ],
  'safety': [
    { module: 'non_conformance', tableName: 'non_conformances', metrics: ['status', 'reason_category'] }
  ],
  'compliance': [
    { module: 'haccp', tableName: 'haccp_plans', metrics: ['status'] },
    { module: 'audit', tableName: 'audits', metrics: ['status', 'findings_count'] },
    { module: 'capa', tableName: 'capa_actions', metrics: ['status'] }
  ],
  'production': [
    { module: 'supplier', tableName: 'suppliers', metrics: ['status', 'compliance_status'] }
  ]
};

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

// Fetch KPI metrics with source data integration
export const fetchKpiMetrics = async (): Promise<KpiMetric[]> => {
  // Return cached data if valid
  if (isCacheValid() && cachedData.kpiMetrics) {
    return cachedData.kpiMetrics;
  }

  const { data: storedMetrics, error } = await supabase
    .from('kpi_metrics')
    .select('*');

  if (error) {
    console.error('Error fetching KPI metrics:', error);
    return [];
  }

  // Enrich metrics with module data
  const enrichedMetrics = await Promise.all(storedMetrics.map(async (metric) => {
    // For demonstration, we'll update specific metrics based on module data
    if (metric.category === 'quality') {
      const metric_value = await calculateQualityMetric(metric.metric_name);
      if (metric_value !== null) {
        metric.metric_value = metric_value;
      }
    } else if (metric.category === 'compliance') {
      const metric_value = await calculateComplianceMetric(metric.metric_name);
      if (metric_value !== null) {
        metric.metric_value = metric_value;
      }
    }
    
    return metric;
  }));

  // Update cache with enriched metrics
  cachedData.kpiMetrics = enrichedMetrics;
  cachedData.timestamp = Date.now();
  return enrichedMetrics;
};

// Calculate quality metrics from source modules
const calculateQualityMetric = async (metricName: string): Promise<number | null> => {
  try {
    if (metricName === 'Quality Score') {
      // Example: Calculate quality score based on non-conformances
      const { count: totalCount } = await supabase
        .from('non_conformances')
        .select('*', { count: 'exact', head: true });
      
      const { count: resolvedCount } = await supabase
        .from('non_conformances')
        .select('*', { count: 'exact', head: true })
        .in('status', ['Resolved', 'Closed']);
      
      if (totalCount && totalCount > 0) {
        return Math.round((resolvedCount / totalCount) * 100);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error calculating quality metric:', error);
    return null;
  }
};

// Calculate compliance metrics from source modules
const calculateComplianceMetric = async (metricName: string): Promise<number | null> => {
  try {
    if (metricName === 'Compliance Rate') {
      // Example: Calculate compliance rate based on audit findings
      const { data: audits } = await supabase
        .from('audits')
        .select('*');
      
      if (audits && audits.length > 0) {
        const totalFindings = audits.reduce((sum, audit) => sum + (audit.findings_count || 0), 0);
        const avgFindingsPerAudit = totalFindings / audits.length;
        // Lower findings = higher compliance (inverse relationship)
        // Max of 10 findings per audit would be 0% compliance in this example
        const complianceRate = Math.max(0, 100 - (avgFindingsPerAudit * 10));
        return Math.round(complianceRate);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error calculating compliance metric:', error);
    return null;
  }
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

// Function to update KPI metrics manually when needed
export const updateKpiMetric = async (
  id: string, 
  updates: Partial<Omit<KpiMetric, 'id'>>
): Promise<KpiMetric | null> => {
  try {
    const { data, error } = await supabase
      .from('kpi_metrics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Invalidate cache to ensure fresh data on next fetch
    clearKpiCache();
    
    return data;
  } catch (error) {
    console.error('Error updating KPI metric:', error);
    return null;
  }
};

// Function to manually add new data points for time-series data
export const addProductionDataPoint = async (
  dataPoint: Omit<ProductionData, 'id'>
): Promise<ProductionData | null> => {
  try {
    const { data, error } = await supabase
      .from('kpi_production_data')
      .insert(dataPoint)
      .select()
      .single();
      
    if (error) throw error;
    clearKpiCache();
    return data;
  } catch (error) {
    console.error('Error adding production data point:', error);
    return null;
  }
};

// Similar functions for other KPI data types
export const addQualityDataPoint = async (
  dataPoint: Omit<QualityData, 'id'>
): Promise<QualityData | null> => {
  try {
    const { data, error } = await supabase
      .from('kpi_quality_data')
      .insert(dataPoint)
      .select()
      .single();
      
    if (error) throw error;
    clearKpiCache();
    return data;
  } catch (error) {
    console.error('Error adding quality data point:', error);
    return null;
  }
};

export const addSafetyDataPoint = async (
  dataPoint: Omit<SafetyData, 'id'>
): Promise<SafetyData | null> => {
  try {
    const { data, error } = await supabase
      .from('kpi_safety_data')
      .insert(dataPoint)
      .select()
      .single();
      
    if (error) throw error;
    clearKpiCache();
    return data;
  } catch (error) {
    console.error('Error adding safety data point:', error);
    return null;
  }
};
