
import { useState } from 'react';
import { NonConformance } from '@/types/non-conformance';

export const useNonConformanceService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNonConformanceById = async (id: string): Promise<NonConformance | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now
      const mockData: NonConformance = {
        id: id,
        title: 'Foreign material in product batch',
        description: 'Metal fragments detected during quality inspection',
        item_name: 'Product Batch 12345',
        item_category: 'Finished Products',
        reason_category: 'Contamination',
        status: 'On Hold',
        reported_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'Quality Inspector',
        assigned_to: 'Quality Manager',
        capa_id: 'CAPA-2023-001',
        capaId: 'CAPA-2023-001',
        severity: 'Critical',
        category: 'Contamination',
        source: 'Internal QC',
        location: 'Production Line 3',
        department: 'Production'
      };
      
      return mockData;
    } catch (err) {
      console.error('Error fetching non-conformance:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch non-conformance');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchNonConformanceById,
    loading,
    error
  };
};
