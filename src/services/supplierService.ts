import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Supplier {
  id: string;
  name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  status?: string;
  partner_type: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierStats {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
}

// Get all suppliers
export const getSuppliers = async (): Promise<Supplier[]> => {
  try {
    const { data, error } = await supabase
      .from('supply_chain_partners')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    toast.error('Failed to load suppliers');
    return [];
  }
};

// Get supplier by ID
export const getSupplierById = async (id: string): Promise<Supplier | null> => {
  try {
    const { data, error } = await supabase
      .from('supply_chain_partners')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching supplier:', error);
    return null;
  }
};

// Create new supplier
export const createSupplier = async (supplier: Partial<Supplier>): Promise<Supplier> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // Get user profile for proper attribution
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    const supplierData = {
      name: supplier.name || '',
      contact_name: supplier.contact_name,
      contact_email: supplier.contact_email,
      contact_phone: supplier.contact_phone,
      address: supplier.address,
      status: supplier.status || 'Pending',
      partner_type: supplier.partner_type || 'Other',
      created_by: profile?.full_name || user.email || 'System',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('supply_chain_partners') 
      .insert(supplierData)
      .select()
      .single();

    if (error) throw error;
    toast.success('Supplier created successfully');
    return data;
  } catch (error) {
    console.error('Error creating supplier:', error);
    toast.error('Failed to create supplier');
    throw error;
  }
};

// Update supplier
export const updateSupplier = async (id: string, updates: Partial<Supplier>): Promise<Supplier> => {
  try {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('supply_chain_partners')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast.success('Supplier updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating supplier:', error);
    toast.error('Failed to update supplier');
    throw error;
  }
};

// Delete supplier
export const deleteSupplier = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('supply_chain_partners')
      .delete()
      .eq('id', id);

    if (error) throw error;
    toast.success('Supplier deleted successfully');
  } catch (error) {
    console.error('Error deleting supplier:', error);
    toast.error('Failed to delete supplier');
    throw error;
  }
};

// Get supplier statistics
export const getSupplierStats = async (): Promise<SupplierStats> => {
  try {
    const { data: suppliers, error } = await supabase
      .from('supply_chain_partners')
      .select('*');

    if (error) throw error;

    const stats: SupplierStats = {
      total: suppliers.length,
      byType: {},
      byStatus: {}
    };

    suppliers.forEach(supplier => {
      // Count by status
      const status = supplier.status || 'Unknown';
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

      // Count by type
      const type = supplier.partner_type || 'Other';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error fetching supplier stats:', error);
    return {
      total: 0,
      byType: {},
      byStatus: {}
    };
  }
};

export default {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierStats
};