
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  batch_lot_number: string;
  manufacturing_date: string;
  expiry_date?: string;
  quantity?: number;
  location?: string;
  status: string;
  created_by: string;
  created_at?: string;
  category?: string;
  description?: string;
  sku?: string;
  attributes?: any;
  updated_at?: string;
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
  description?: string;
  supplier_id?: string;
  attributes?: any;
  units?: string;
  updated_at?: string;
}

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
  // Database fields
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
      
      // Transform data to match our interface, providing defaults for missing fields
      const transformedData = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        batch_lot_number: item.batch_lot_number,
        manufacturing_date: item.manufacturing_date,
        expiry_date: item.expiry_date,
        quantity: 0, // Default since not in DB
        location: '', // Default since not in DB
        status: item.status,
        created_by: item.created_by,
        created_at: item.created_at,
        category: item.category,
        description: item.description,
        sku: item.sku,
        attributes: item.attributes,
        updated_at: item.updated_at
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

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      // Only send fields that exist in the database
      const dbData = {
        name: productData.name,
        batch_lot_number: productData.batch_lot_number,
        manufacturing_date: productData.manufacturing_date,
        expiry_date: productData.expiry_date,
        status: productData.status,
        created_by: productData.created_by,
        category: productData.category,
        description: productData.description,
        sku: productData.sku,
        attributes: productData.attributes
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert(dbData)
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

  const addComponent = async (componentData: Omit<Component, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      // Only send fields that exist in the database
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
        product_name: 'Unknown Product', // Default since not in DB
        batch_numbers: [], // Default since not in DB
        reason: item.recall_reason || '',
        status: item.status,
        initiated_date: item.initiated_at || item.created_at,
        affected_quantity: 0, // Default since not in DB
        customer_notifications: 0, // Default since not in DB
        retailer_notifications: 0, // Default since not in DB
        created_by: item.initiated_by,
        created_at: item.created_at,
        // Include actual DB fields
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
      // Map to database fields
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
