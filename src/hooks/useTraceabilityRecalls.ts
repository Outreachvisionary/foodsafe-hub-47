
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Recall {
  id: string;
  title: string;
  product_name?: string;
  batch_numbers?: string[];
  reason?: string;
  status: string;
  initiated_date?: string;
  affected_quantity?: number;
  customer_notifications?: number;
  retailer_notifications?: number;
  created_by?: string;
  created_at?: string;
  description?: string;
  recall_type: 'Mock' | 'Actual';
  recall_reason: string;
  initiated_by: string;
  initiated_at?: string;
  completed_at?: string;
  affected_products?: any;
  corrective_actions?: string;
  updated_at?: string;
}

export const useTraceabilityRecalls = () => {
  const [recalls, setRecalls] = useState<Recall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecalls = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recalls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        product_name: 'Unknown Product',
        batch_numbers: [],
        reason: item.recall_reason || '',
        status: item.status,
        initiated_date: item.initiated_at || item.created_at,
        affected_quantity: 0,
        customer_notifications: 0,
        retailer_notifications: 0,
        created_by: item.initiated_by,
        created_at: item.created_at,
        description: item.description,
        recall_type: item.recall_type,
        recall_reason: item.recall_reason,
        initiated_by: item.initiated_by,
        initiated_at: item.initiated_at,
        completed_at: item.completed_at,
        affected_products: item.affected_products,
        corrective_actions: item.corrective_actions,
        updated_at: item.updated_at
      }));
      
      setRecalls(transformedData);
    } catch (err) {
      console.error('Error fetching recalls:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recalls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecalls();
  }, []);

  const addRecall = async (recallData: { title: string; product_name?: string; batch_numbers?: string[]; reason: string; status: string; created_by: string }) => {
    try {
      setLoading(true);
      const dbData = {
        title: recallData.title,
        recall_reason: recallData.reason,
        status: recallData.status as 'In Progress' | 'Scheduled' | 'Completed' | 'Cancelled',
        recall_type: 'Actual' as const,
        initiated_by: recallData.created_by
      };
      
      const { data, error } = await supabase
        .from('recalls')
        .insert(dbData)
        .select()
        .single();

      if (error) throw error;
      await fetchRecalls();
      return data;
    } catch (err) {
      console.error('Error adding recall:', err);
      setError(err instanceof Error ? err.message : 'Failed to add recall');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    recalls,
    loading,
    error,
    refetch: fetchRecalls,
    addRecall
  };
};
