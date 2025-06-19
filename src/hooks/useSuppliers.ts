
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Supplier {
  id: string;
  name: string;
  category: string;
  country: string;
  compliance_status: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  products: string[];
  status: string;
  risk_score: number;
  last_audit_date?: string;
  created_at?: string;
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Add alias for compatibility
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setIsLoading(true);
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuppliers(data || []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const addSupplier = async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setIsLoading(true);
      const { data, error } = await supabase
        .from('suppliers')
        .insert(supplierData) // Single object, not array
        .select()
        .single();

      if (error) throw error;
      await fetchSuppliers();
      return data;
    } catch (err) {
      console.error('Error adding supplier:', err);
      setError(err instanceof Error ? err.message : 'Failed to add supplier');
      return null;
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const editSupplier = async (id: string, updates: Partial<Supplier>) => {
    try {
      setLoading(true);
      setIsLoading(true);
      const { data, error } = await supabase
        .from('suppliers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchSuppliers();
      return data;
    } catch (err) {
      console.error('Error updating supplier:', err);
      setError(err instanceof Error ? err.message : 'Failed to update supplier');
      return null;
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return {
    suppliers,
    loading,
    isLoading,
    error,
    refetch: fetchSuppliers,
    addSupplier,
    editSupplier
  };
};
