
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  batch_lot_number: string;
  manufacturing_date: string;
  expiry_date?: string;
  quantity: number;
  location?: string;
  status: string;
  created_by: string;
  created_at?: string;
}

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
}

export interface Recall {
  id: string;
  title: string;
  product_name: string;
  batch_numbers: string[];
  reason: string;
  status: string;
  initiated_date: string;
  affected_quantity: number;
  customer_notifications: number;
  retailer_notifications: number;
  created_by: string;
  created_at?: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  };
};

export const useComponents = () => {
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

  return {
    components,
    loading,
    error,
    refetch: fetchComponents
  };
};

export const useRecalls = () => {
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
      setRecalls(data || []);
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

  return {
    recalls,
    loading,
    error,
    refetch: fetchRecalls
  };
};
