import { supabase } from '@/integrations/supabase/client';
import { Supplier, FsmsStandard } from '@/types/supplier';
import { v4 as uuidv4 } from 'uuid';

// Fetch all suppliers
export const fetchSuppliers = async (): Promise<Supplier[]> => {
  const { data: suppliersData, error: suppliersError } = await supabase
    .from('suppliers')
    .select('*')
    .order('name');

  if (suppliersError) {
    console.error('Error fetching suppliers:', suppliersError);
    throw new Error('Failed to fetch suppliers');
  }

  // For each supplier, fetch their standards
  const suppliers = await Promise.all(suppliersData.map(async (supplier) => {
    const { data: standardsData, error: standardsError } = await supabase
      .from('supplier_standards')
      .select('*')
      .eq('supplier_id', supplier.id);

    if (standardsError) {
      console.error(`Error fetching standards for supplier ${supplier.id}:`, standardsError);
      return {
        ...supplier,
        id: supplier.id,
        name: supplier.name,
        category: supplier.category,
        country: supplier.country,
        riskScore: supplier.risk_score,
        complianceStatus: supplier.compliance_status,
        lastAuditDate: supplier.last_audit_date,
        contactName: supplier.contact_name,
        contactEmail: supplier.contact_email,
        contactPhone: supplier.contact_phone,
        products: supplier.products || [],
        status: supplier.status as 'Active' | 'Pending' | 'Suspended' | 'Inactive',
        fsmsStandards: [],
        documents: [] // Will be populated by the document service
      };
    }

    const fsmsStandards: FsmsStandard[] = standardsData.map(std => ({
      name: std.name,
      certified: std.certified,
      certificationNumber: std.certification_number,
      expiryDate: std.expiry_date,
      level: std.level,
      scope: std.scope
    }));

    return {
      id: supplier.id,
      name: supplier.name,
      category: supplier.category,
      country: supplier.country,
      riskScore: supplier.risk_score,
      complianceStatus: supplier.compliance_status,
      lastAuditDate: supplier.last_audit_date,
      fsmsStandards,
      contactName: supplier.contact_name,
      contactEmail: supplier.contact_email,
      contactPhone: supplier.contact_phone,
      products: supplier.products || [],
      status: supplier.status as 'Active' | 'Pending' | 'Suspended' | 'Inactive',
      documents: [] // Will be populated by the document service
    };
  }));

  return suppliers;
};

// Fetch a single supplier by ID
export const fetchSupplierById = async (id: string): Promise<Supplier | null> => {
  const { data: supplier, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching supplier with ID ${id}:`, error);
    return null;
  }
  
  if (!supplier) {
    return null;
  }

  // Fetch supplier standards
  const { data: standardsData, error: standardsError } = await supabase
    .from('supplier_standards')
    .select('*')
    .eq('supplier_id', id);

  if (standardsError) {
    console.error(`Error fetching standards for supplier ${id}:`, standardsError);
    return null;
  }

  const fsmsStandards: FsmsStandard[] = standardsData.map(std => ({
    name: std.name,
    certified: std.certified,
    certificationNumber: std.certification_number,
    expiryDate: std.expiry_date,
    level: std.level,
    scope: std.scope
  }));

  return {
    id: supplier.id,
    name: supplier.name,
    category: supplier.category,
    country: supplier.country,
    riskScore: supplier.risk_score,
    complianceStatus: supplier.compliance_status,
    lastAuditDate: supplier.last_audit_date,
    fsmsStandards,
    contactName: supplier.contact_name,
    contactEmail: supplier.contact_email,
    contactPhone: supplier.contact_phone,
    products: supplier.products || [],
    status: supplier.status as 'Active' | 'Pending' | 'Suspended' | 'Inactive',
    documents: [] // Will be populated by the document service
  };
};

// Create a new supplier
export const createSupplier = async (supplier: Omit<Supplier, 'id' | 'documents' | 'fsmsStandards'>): Promise<Supplier> => {
  const newSupplierId = uuidv4();
  
  // Insert the supplier
  const { error } = await supabase
    .from('suppliers')
    .insert({
      id: newSupplierId,
      name: supplier.name,
      category: supplier.category,
      country: supplier.country,
      risk_score: supplier.risk_score,
      compliance_status: supplier.compliance_status,
      last_audit_date: supplier.last_audit_date,
      contact_name: supplier.contact_name,
      contact_email: supplier.contact_email,
      contact_phone: supplier.contact_phone,
      products: supplier.products,
      status: supplier.status
    });

  if (error) {
    console.error('Error creating supplier:', error);
    throw new Error('Failed to create supplier');
  }

  return {
    id: newSupplierId,
    name: supplier.name,
    category: supplier.category,
    country: supplier.country,
    risk_score: supplier.risk_score,
    compliance_status: supplier.compliance_status,
    last_audit_date: supplier.last_audit_date,
    contact_name: supplier.contact_name,
    contact_email: supplier.contact_email,
    contact_phone: supplier.contact_phone,
    products: supplier.products,
    status: supplier.status
  };
};

// Update an existing supplier
export const updateSupplier = async (id: string, supplier: Partial<Supplier>): Promise<void> => {
  const { error } = await supabase
    .from('suppliers')
    .update({
      name: supplier.name,
      category: supplier.category,
      country: supplier.country,
      risk_score: supplier.risk_score,
      compliance_status: supplier.compliance_status,
      last_audit_date: supplier.last_audit_date,
      contact_name: supplier.contact_name,
      contact_email: supplier.contact_email,
      contact_phone: supplier.contact_phone,
      products: supplier.products,
      status: supplier.status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error(`Error updating supplier with ID ${id}:`, error);
    throw new Error('Failed to update supplier');
  }
};

// Delete a supplier
export const deleteSupplier = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting supplier with ID ${id}:`, error);
    throw new Error('Failed to delete supplier');
  }
};

// Add a standard to a supplier
export const addSupplierStandard = async (
  supplierId: string, 
  standard: FsmsStandard
): Promise<void> => {
  const { error } = await supabase
    .from('supplier_standards')
    .insert({
      supplier_id: supplierId,
      name: standard.name,
      certified: standard.certified,
      certification_number: standard.certificationNumber,
      expiry_date: standard.expiryDate,
      level: standard.level,
      scope: standard.scope
    });

  if (error) {
    console.error(`Error adding standard to supplier ${supplierId}:`, error);
    throw new Error('Failed to add standard to supplier');
  }
};

// Update a supplier standard
export const updateSupplierStandard = async (
  supplierId: string,
  standardName: string,
  standard: Partial<FsmsStandard>
): Promise<void> => {
  const { error } = await supabase
    .from('supplier_standards')
    .update({
      certified: standard.certified,
      certification_number: standard.certificationNumber,
      expiry_date: standard.expiryDate,
      level: standard.level,
      scope: standard.scope,
      updated_at: new Date().toISOString()
    })
    .eq('supplier_id', supplierId)
    .eq('name', standardName);

  if (error) {
    console.error(`Error updating standard for supplier ${supplierId}:`, error);
    throw new Error('Failed to update supplier standard');
  }
};

// Delete a supplier standard
export const deleteSupplierStandard = async (
  supplierId: string,
  standardName: string
): Promise<void> => {
  const { error } = await supabase
    .from('supplier_standards')
    .delete()
    .eq('supplier_id', supplierId)
    .eq('name', standardName);

  if (error) {
    console.error(`Error deleting standard for supplier ${supplierId}:`, error);
    throw new Error('Failed to delete supplier standard');
  }
};

// Export all functions
export default {
  fetchSuppliers,
  fetchSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  addSupplierStandard,
  updateSupplierStandard,
  deleteSupplierStandard
};
