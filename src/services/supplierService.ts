
/**
 * Mock Supplier Service
 * This is a placeholder to support testing.
 */

export const fetchSuppliers = async () => {
  // In a real implementation, this would interact with the database
  return [];
};

export const createSupplier = async (supplier: any) => {
  // In a real implementation, this would interact with the database
  return { id: 'mock-supplier-id', ...supplier };
};

export const fetchSupplierById = async (id: string) => {
  // In a real implementation, this would interact with the database
  return { id };
};

export const updateSupplier = async (id: string, updates: any) => {
  // In a real implementation, this would interact with the database
  return { id, ...updates };
};

export const deleteSupplier = async (id: string) => {
  // In a real implementation, this would interact with the database
  return true;
};

// Additional functionality needed for tests
export const scheduleAudit = async (supplierId: string, date: Date) => {
  return {
    id: 'audit-mock-id',
    supplierId,
    date: date.toISOString(),
    status: 'Scheduled'
  };
};

export default {
  fetchSuppliers,
  createSupplier,
  fetchSupplierById,
  updateSupplier,
  deleteSupplier,
  scheduleAudit
};
