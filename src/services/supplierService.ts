import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  website?: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Suspended';
  supplier_type: 'Raw Material' | 'Packaging' | 'Equipment' | 'Service' | 'Other';
  certification_status?: 'Certified' | 'Pending' | 'Expired' | 'Not Required';
  last_audit_date?: string;
  next_audit_date?: string;
  risk_level?: 'Low' | 'Medium' | 'High' | 'Critical';
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  suspended: number;
  byType: Record<string, number>;
  byRiskLevel: Record<string, number>;
  auditsDue: number;
  certificationsExpiring: number;
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
      contact_person: supplier.contact_person,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      city: supplier.city,
      state: supplier.state,
      zip_code: supplier.zip_code,
      country: supplier.country,
      website: supplier.website,
      status: supplier.status || 'Pending',
      supplier_type: supplier.supplier_type || 'Other',
      certification_status: supplier.certification_status,
      last_audit_date: supplier.last_audit_date,
      next_audit_date: supplier.next_audit_date,
      risk_level: supplier.risk_level,
      notes: supplier.notes,
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
      active: 0,
      inactive: 0,
      pending: 0,
      suspended: 0,
      byType: {},
      byRiskLevel: {},
      auditsDue: 0,
      certificationsExpiring: 0
    };

    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    suppliers.forEach(supplier => {
      // Count by status
      switch (supplier.status) {
        case 'Active':
          stats.active++;
          break;
        case 'Inactive':
          stats.inactive++;
          break;
        case 'Pending':
          stats.pending++;
          break;
        case 'Suspended':
          stats.suspended++;
          break;
      }

      // Count by type
      const type = supplier.supplier_type || 'Other';
      stats.byType[type] = (stats.byType[type] || 0) + 1;

      // Count by risk level
      const riskLevel = supplier.risk_level || 'Low';
      stats.byRiskLevel[riskLevel] = (stats.byRiskLevel[riskLevel] || 0) + 1;

      // Check for due audits
      if (supplier.next_audit_date && new Date(supplier.next_audit_date) <= thirtyDaysFromNow) {
        stats.auditsDue++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error fetching supplier stats:', error);
    return {
      total: 0,
      active: 0,
      inactive: 0,
      pending: 0,
      suspended: 0,
      byType: {},
      byRiskLevel: {},
      auditsDue: 0,
      certificationsExpiring: 0
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