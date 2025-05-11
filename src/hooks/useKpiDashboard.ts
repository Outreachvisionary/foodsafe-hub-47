
import { useState, useEffect } from 'react';
import useRealtimeSubscription from './useRealtimeSubscription';
import { 
  KpiMetric, 
  ProductionData,
  QualityData,
  SafetyData,
  fetchAllKpiData
} from '@/services/kpiService';

// This hook integrates all KPI data and provides realtime updates
export function useKpiDashboard() {
  const [kpiMetrics, setKpiMetrics] = useState<KpiMetric[]>([]);
  const [productionData, setProductionData] = useState<ProductionData[]>([]);
  const [qualityData, setQualityData] = useState<QualityData[]>([]);
  const [safetyData, setSafetyData] = useState<SafetyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Subscribe to KPI metrics table with realtime updates
  const kpiMetricsSubscription = useRealtimeSubscription<KpiMetric>({
    table: 'kpi_metrics',
    initialFetch: false, // We'll fetch all data at once instead
    relatedTables: ['non_conformances', 'audits', 'capa_actions', 'haccp_plans'], // Listen for changes in related tables
    onDataChange: (newData) => {
      setKpiMetrics(newData);
    }
  });

  // Subscribe to production data table
  const productionSubscription = useRealtimeSubscription<ProductionData>({
    table: 'kpi_production_data',
    initialFetch: false,
    onDataChange: (newData) => {
      setProductionData(newData);
    }
  });

  // Subscribe to quality data table
  const qualitySubscription = useRealtimeSubscription<QualityData>({
    table: 'kpi_quality_data',
    initialFetch: false,
    onDataChange: (newData) => {
      setQualityData(newData);
    }
  });

  // Subscribe to safety data table
  const safetySubscription = useRealtimeSubscription<SafetyData>({
    table: 'kpi_safety_data',
    initialFetch: false,
    onDataChange: (newData) => {
      setSafetyData(newData);
    }
  });

  // Fetch all KPI data initially
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const allData = await fetchAllKpiData();
        
        setKpiMetrics(allData.kpiMetrics);
        setProductionData(allData.productionData);
        setQualityData(allData.qualityData);
        setSafetyData(allData.safetyData);
      } catch (err) {
        console.error("Error loading KPI dashboard data:", err);
        setError(err instanceof Error ? err : new Error('Unknown error loading KPI data'));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Refetch data when any of the subscriptions report an error
  useEffect(() => {
    const hasError = 
      kpiMetricsSubscription.error || 
      productionSubscription.error ||
      qualitySubscription.error ||
      safetySubscription.error;
    
    if (hasError) {
      setError(new Error('Error in realtime subscription'));
    }
  }, [
    kpiMetricsSubscription.error,
    productionSubscription.error,
    qualitySubscription.error,
    safetySubscription.error
  ]);

  // Combined refetch function
  const refetchAll = async () => {
    setLoading(true);
    try {
      const allData = await fetchAllKpiData();
      
      setKpiMetrics(allData.kpiMetrics);
      setProductionData(allData.productionData);
      setQualityData(allData.qualityData);
      setSafetyData(allData.safetyData);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error refreshing data'));
    } finally {
      setLoading(false);
    }
  };

  return {
    kpiMetrics,
    productionData,
    qualityData,
    safetyData,
    loading,
    error,
    refetchAll
  };
}

export default useKpiDashboard;
