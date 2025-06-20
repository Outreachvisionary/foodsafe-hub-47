
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

export const useTraceabilityProducts = () => {
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
      
      const transformedData = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        batch_lot_number: item.batch_lot_number,
        manufacturing_date: item.manufacturing_date,
        expiry_date: item.expiry_date,
        quantity: 0,
        location: '',
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

  const loadProductByBatchLot = useCallback(async (batchLotNumber: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('batch_lot_number', batchLotNumber)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error loading product by batch/lot:', err);
      setError(err instanceof Error ? err.message : 'Failed to load product');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    addProduct,
    loadProductByBatchLot
  };
};
