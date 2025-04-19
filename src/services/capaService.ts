
import { CAPA, CAPAStats, CAPAFetchParams } from '@/types/capa';
import { fetchCAPAs as fetchCAPAsFromService } from './capa/capaFetchService';
import { createCAPA as createCAPAFromService, updateCAPA as updateCAPAFromService, deleteCAPA as deleteCAPAFromService } from './capa/capaUpdateService';
import { mapDbResultToCapa } from './capa/capaFetchService';

export const fetchCAPAs = async (params?: CAPAFetchParams): Promise<CAPA[]> => {
  return fetchCAPAsFromService(params);
};

export const fetchCAPAById = async (id: string): Promise<CAPA> => {
  const capas = await fetchCAPAsFromService({ id });
  if (capas.length === 0) {
    throw new Error(`CAPA with ID ${id} not found`);
  }
  return capas[0];
};

export const createCAPA = async (capaData: Omit<CAPA, 'id' | 'createdDate' | 'lastUpdated'>): Promise<CAPA> => {
  return createCAPAFromService(capaData);
};

export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA> => {
  return updateCAPAFromService(id, updates);
};

export const deleteCAPA = async (id: string): Promise<void> => {
  return deleteCAPAFromService(id);
};

export const getPotentialCAPAs = async (): Promise<any[]> => {
  // This is a mock function to return potential CAPAs for automation
  return [
    {
      id: 'potential-1',
      title: 'Critical temperature deviation in frozen storage',
      description: 'Temperature logs indicate Zone B frozen storage exceeded -15°C for more than 4 hours.',
      source: 'haccp',
      sourceId: 'temp-dev-129',
      date: new Date().toISOString(),
      severity: 'critical',
      confidence: 0.95
    },
    {
      id: 'potential-2',
      title: 'Allergen cross-contamination risk identified',
      description: 'Production line changeover inspection found traces of peanut residue after sanitation procedure on Line 3.',
      source: 'audit',
      sourceId: 'audit-2023-187',
      date: new Date().toISOString(),
      severity: 'major',
      confidence: 0.89
    },
    {
      id: 'potential-3',
      title: 'Foreign material complaint from distributor',
      description: 'Distributor reported 3 instances of hard plastic fragments in product batch #A78942.',
      source: 'complaint',
      sourceId: 'comp-2023-078',
      date: new Date().toISOString(),
      severity: 'critical',
      confidence: 0.92
    }
  ];
};

export const getCAPAStats = async (): Promise<CAPAStats> => {
  // Implement this function or provide mock data for now
  return {
    total: 125,
    openCount: 38,
    inProgressCount: 42,
    closedCount: 25,
    verifiedCount: 15,
    pendingVerificationCount: 5,
    overdueCount: 12,
    byStatus: [
      { name: 'Open', value: 38 },
      { name: 'In Progress', value: 42 },
      { name: 'Closed', value: 25 },
      { name: 'Verified', value: 15 },
      { name: 'Pending Verification', value: 5 }
    ],
    byPriority: [
      { name: 'Critical', value: 15 },
      { name: 'High', value: 35 },
      { name: 'Medium', value: 55 },
      { name: 'Low', value: 20 }
    ],
    bySource: [
      { name: 'Audit', value: 42 },
      { name: 'Complaint', value: 28 },
      { name: 'HACCP', value: 22 },
      { name: 'Incident', value: 15 },
      { name: 'Supplier', value: 18 }
    ],
    fsma204ComplianceRate: 87,
    effectivenessStats: {
      effective: 30,
      partiallyEffective: 12,
      ineffective: 5
    }
  };
};
