
import { useState, useEffect, useCallback } from 'react';
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
      
      // Transform data to match our interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        batch_lot_number: item.batch_lot_number,
        manufacturing_date: item.manufacturing_date,
        expiry_date: item.expiry_date,
        quantity: item.quantity || 0,
        location: item.location,
        status: item.status,
        created_by: item.created_by,
        created_at: item.created_at
      }));
      
      setProducts(transformedData);
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

  const addProduct = async (productData: Partial<Product>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      await fetchProducts();
      return data;
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err instanceof Error ? err.message : 'Failed to add product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    addProduct
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

  const addComponent = async (componentData: Partial<Component>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('components')
        .insert([componentData])
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
      
      // Transform database data to match our interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        product_name: item.product_name,
        batch_numbers: item.batch_numbers || [],
        reason: item.reason,
        status: item.status,
        initiated_date: item.initiated_date || item.created_at,
        affected_quantity: item.affected_quantity || 0,
        customer_notifications: item.customer_notifications || 0,
        retailer_notifications: item.retailer_notifications || 0,
        created_by: item.created_by,
        created_at: item.created_at
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

  const addRecall = async (recallData: Partial<Recall>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recalls')
        .insert([{
          title: recallData.title,
          product_name: recallData.product_name,
          batch_numbers: recallData.batch_numbers,
          reason: recallData.reason,
          status: recallData.status,
          created_by: recallData.created_by
        }])
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

// Main hook that combines all functionality
export const useTraceability = () => {
  const products = useProducts();
  const components = useComponents();
  const recalls = useRecalls();

  return {
    ...products,
    ...components,
    ...recalls,
    // Provide separate namespaced access if needed
    loadProducts: products.refetch,
    loadComponents: components.refetch,
    loadRecalls: recalls.refetch
  };
};
