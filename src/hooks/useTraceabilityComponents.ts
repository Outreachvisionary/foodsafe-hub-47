
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Component {
  id: string;
  name: string;
  batch_lot_number: string;
  received_date: string;
  expiry_date?: string;
  quantity?: number;
  status: string;
  category?: string;
  created_by: string;
  created_at?: string;
  description?: string;
  supplier_id?: string;
  attributes?: any;
  units?: string;
  updated_at?: string;
}

export const useTraceabilityComponents = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComponents(data || []);
    } catch (err) {
      console.error('Error fetching components:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch components');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const addComponent = async (componentData: Omit<Component, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const dbData = {
        name: componentData.name,
        batch_lot_number: componentData.batch_lot_number,
        received_date: componentData.received_date,
        expiry_date: componentData.expiry_date,
        status: componentData.status,
        created_by: componentData.created_by,
        category: componentData.category,
        description: componentData.description,
        supplier_id: componentData.supplier_id,
        quantity: componentData.quantity,
        attributes: componentData.attributes,
        units: componentData.units
      };
      
      const { data, error } = await supabase
        .from('components')
        .insert(dbData)
        .select()
        .single();

      if (error) throw error;
      await fetchComponents();
      return data;
    } catch (err) {
      console.error('Error adding component:', err);
      setError(err instanceof Error ? err.message : 'Failed to add component');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    components,
    loading,
    error,
    refetch: fetchComponents,
    addComponent
  };
};
