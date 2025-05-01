
import { CAPA } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';
import { convertToCAPAStatus } from '@/utils/typeAdapters';

// Mock data for testing
const mockCapas: CAPA[] = [
  {
    id: 'capa-001',
    title: 'Foreign Material in Product',
    description: 'Metal fragments found in the finished product batch #12345',
    status: CAPAStatus.Open,
    priority: CAPAPriority.High,
    created_at: new Date().toISOString(),
    created_by: 'John Doe',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_to: 'Jane Smith',
    source: CAPASource.NonConformance,
    source_reference: 'NC-2023-005',
    department: 'Production',
    fsma204_compliant: true,
    relatedDocuments: ['doc-123', 'doc-456'],
    relatedTraining: ['training-789']
  },
  {
    id: 'capa-002',
    title: 'Temperature Control Failure',
    description: 'Cold storage temperature exceeded critical limits for 4 hours',
    status: CAPAStatus.InProgress,
    priority: CAPAPriority.Critical,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: 'Sarah Johnson',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_to: 'Mike Wilson',
    source: CAPASource.Audit,
    source_reference: 'AUDIT-2023-12',
    completion_date: undefined,
    root_cause: 'Equipment failure - compressor malfunction',
    corrective_action: 'Replaced compressor and installed backup system',
    preventive_action: 'Implemented hourly temperature checks and alarm system',
    effectiveness_criteria: '30 days of continuous operation within limits',
    department: 'Cold Storage',
    fsma204_compliant: true,
    relatedDocuments: ['doc-789'],
    relatedTraining: []
  }
];

export const fetchCAPAs = async (): Promise<CAPA[]> => {
  // In a real implementation, this would call an API
  return mockCapas;
};

export const fetchCAPAById = async (id: string): Promise<CAPA> => {
  // In a real implementation, this would call an API
  const capa = mockCapas.find(c => c.id === id);
  
  if (!capa) {
    throw new Error(`CAPA with ID ${id} not found`);
  }
  
  return capa;
};

export const fetchCAPAsBySource = async (source: string, sourceId?: string): Promise<CAPA[]> => {
  // In a real implementation, this would call an API
  const filtered = mockCapas.filter(capa => {
    if (capa.source === source) {
      if (sourceId) {
        return capa.source_id === sourceId;
      }
      return true;
    }
    return false;
  });
  
  return filtered;
};

export default {
  fetchCAPAs,
  fetchCAPAById,
  fetchCAPAsBySource
};
