
import { useState, useEffect } from 'react';
import { Supplier } from '@/types/supplier';
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from '@/services/supplierService';
import { toast } from 'sonner';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load suppliers
  const loadSuppliers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error('Error loading suppliers:', err);
      setError(err instanceof Error ? err : new Error('Failed to load suppliers'));
      toast.error('Failed to load suppliers');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new supplier
  const addSupplier = async (supplier: Omit<Supplier, 'id' | 'documents' | 'fsmsStandards'>) => {
    try {
      const newSupplier = await createSupplier(supplier);
      setSuppliers(prev => [...prev, newSupplier]);
      toast.success('Supplier added successfully');
      return newSupplier;
    } catch (err) {
      console.error('Error adding supplier:', err);
      toast.error('Failed to add supplier');
      throw err;
    }
  };

  // Update an existing supplier
  const editSupplier = async (id: string, updates: Partial<Supplier>) => {
    try {
      await updateSupplier(id, updates);
      setSuppliers(prev => 
        prev.map(supplier => 
          supplier.id === id ? { ...supplier, ...updates } : supplier
        )
      );
      toast.success('Supplier updated successfully');
    } catch (err) {
      console.error('Error updating supplier:', err);
      toast.error('Failed to update supplier');
      throw err;
    }
  };

  // Remove a supplier
  const removeSupplier = async (id: string) => {
    try {
      await deleteSupplier(id);
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      toast.success('Supplier removed successfully');
    } catch (err) {
      console.error('Error removing supplier:', err);
      toast.error('Failed to remove supplier');
      throw err;
    }
  };

  // Load suppliers on mount
  useEffect(() => {
    loadSuppliers();
  }, []);

  return {
    suppliers,
    isLoading,
    error,
    loadSuppliers,
    addSupplier,
    editSupplier,
    removeSupplier
  };
}
