
import { CAPA, CAPASource, CAPAPriority, CAPAStatus, CAPAStats, CAPAFilter, CAPAEffectivenessMetrics } from '@/types/capa';
import { supabase } from '@/integrations/supabase/client';
import { mapStatusFromDb, mapStatusToDb } from './capa/capaStatusService';

// Mock potential CAPA data for prototype
const mockPotentialCAPAs = [
  {
    id: 'potcapa1',
    title: 'High bacteria count in raw material batch',
    description: 'Routine testing of raw material batch RM-2023-0456 detected high bacteria count exceeding critical limits.',
    source: 'audit' as CAPASource,
    sourceReference: {
      type: 'lab_test',
      title: 'Microbiological Test Results - March 2023',
      date: new Date().toISOString()
    },
    priority: 'critical' as CAPAPriority,
    suggestedActions: 'Isolate affected batch, investigate supplier process controls, conduct root cause analysis',
    detectedBy: 'QA Laboratory',
    detectedAt: new Date().toISOString(),
    department: 'Quality Assurance'
  },
  {
    id: 'potcapa2',
    title: 'Metal detection system failure',
    description: 'Production line A metal detector failed validation check for 3 consecutive shifts.',
    source: 'incident' as CAPASource,
    sourceReference: {
      type: 'equipment_report',
      title: 'Metal Detector Validation Report',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    priority: 'high' as CAPAPriority,
    suggestedActions: 'Service metal detector, verify calibration, review maintenance schedule',
    detectedBy: 'Production Supervisor',
    detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    department: 'Production'
  },
  {
    id: 'potcapa3',
    title: 'Allergen control procedure non-compliance',
    description: 'Internal audit found instances of allergen control procedures not being followed correctly during changeovers.',
    source: 'audit' as CAPASource,
    sourceReference: {
      type: 'internal_audit',
      title: 'Q1 GMP Audit Report',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    priority: 'high' as CAPAPriority,
    suggestedActions: 'Retrain production staff, update allergen control procedures, increase monitoring frequency',
    detectedBy: 'Internal Auditor',
    detectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    department: 'Production'
  }
];

export async function getPotentialCAPAs() {
  try {
    // In a real implementation, we would fetch from the database
    // const { data, error } = await supabase.from('capa_potential_issues').select('*');
    // if (error) throw error;
    // return data;
    
    // For now, return mock data
    return mockPotentialCAPAs;
  } catch (error) {
    console.error('Error fetching potential CAPAs:', error);
    return [];
  }
}

export async function createCAPA(capaData: Omit<CAPA, 'id'>) {
  try {
    // In a real implementation, we would insert into the database
    // const { data, error } = await supabase.from('capa_actions').insert(capaData).select().single();
    // if (error) throw error;
    // return data;
    
    // For now, return mock data with a generated ID
    const newCAPA: CAPA = {
      ...capaData,
      id: `capa-${Date.now()}`,
      lastUpdated: new Date().toISOString()
    };
    
    return newCAPA;
  } catch (error) {
    console.error('Error creating CAPA:', error);
    throw error;
  }
}

// Add the missing exported functions
export async function getCAPAStats(): Promise<CAPAStats> {
  // Mock implementation for CAPA statistics
  return {
    total: 35,
    openCount: 12,
    inProgressCount: 8,
    closedCount: 10,
    verifiedCount: 5,
    pendingVerificationCount: 3,
    overdueCount: 7,
    byStatus: [
      { name: 'Open', value: 12 },
      { name: 'In Progress', value: 8 },
      { name: 'Closed', value: 10 },
      { name: 'Verified', value: 5 }
    ],
    byPriority: [
      { name: 'Critical', value: 5 },
      { name: 'High', value: 10 },
      { name: 'Medium', value: 15 },
      { name: 'Low', value: 5 }
    ],
    bySource: [
      { name: 'Audit', value: 8 },
      { name: 'Complaint', value: 12 },
      { name: 'Nonconformance', value: 6 },
      { name: 'HACCP', value: 4 },
      { name: 'Other', value: 5 }
    ],
    fsma204ComplianceRate: 85,
    effectivenessStats: {
      effective: 12,
      partiallyEffective: 8,
      ineffective: 3
    }
  };
}

export async function fetchCAPAs(filter?: CAPAFilter): Promise<CAPA[]> {
  // Mock implementation for fetching CAPAs
  const mockCAPAs: CAPA[] = [
    {
      id: 'capa-1',
      title: 'Audit Finding: Metal Detection Failure',
      description: 'Critical failure in metal detection system during production',
      source: 'audit',
      sourceId: 'audit-123',
      priority: 'critical',
      status: 'open',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'John Smith',
      department: 'Production',
      createdBy: 'Quality Manager',
      createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date().toISOString(),
      rootCause: 'Calibration issues and maintenance gaps',
      isFsma204Compliant: true,
    },
    {
      id: 'capa-2',
      title: 'Customer Complaint: Foreign Material',
      description: 'Customer reported finding plastic in product',
      source: 'complaint',
      sourceId: 'complaint-456',
      priority: 'high',
      status: 'in-progress',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'Sarah Johnson',
      department: 'Quality Assurance',
      createdBy: 'Customer Service',
      createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date().toISOString(),
      rootCause: 'Packaging material fragment from supplier',
      correctiveAction: 'Supplier audit initiated',
      isFsma204Compliant: true,
    },
    {
      id: 'capa-3',
      title: 'Temperature Deviation in Storage',
      description: 'Temperature logs showed deviation outside acceptable range',
      source: 'nonconformance',
      sourceId: 'nc-789',
      priority: 'medium',
      status: 'closed',
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      completionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'Michael Wong',
      department: 'Warehouse',
      createdBy: 'Warehouse Manager',
      createdDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      rootCause: 'Refrigeration system failure',
      correctiveAction: 'Repaired cooling system and updated monitoring',
      preventiveAction: 'Installed backup power system and alarm',
      effectivenessCriteria: 'Zero temperature deviations for 30 days',
      effectivenessVerified: true,
      isFsma204Compliant: false,
    }
  ];
  
  // Apply filters if provided
  if (filter) {
    let filtered = [...mockCAPAs];
    
    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter(capa => 
        Array.isArray(filter.status) 
          ? filter.status.includes(capa.status)
          : capa.status === filter.status
      );
    }
    
    if (filter.priority && filter.priority.length > 0) {
      filtered = filtered.filter(capa => 
        Array.isArray(filter.priority) 
          ? filter.priority.includes(capa.priority)
          : capa.priority === filter.priority
      );
    }
    
    if (filter.source && filter.source.length > 0) {
      filtered = filtered.filter(capa => 
        Array.isArray(filter.source) 
          ? filter.source.includes(capa.source)
          : capa.source === filter.source
      );
    }
    
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(capa => 
        capa.title.toLowerCase().includes(term) || 
        capa.description.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }
  
  return mockCAPAs;
}

export async function fetchCAPAById(id: string): Promise<CAPA | null> {
  // Mock implementation for fetching a specific CAPA
  const allCAPAs = await fetchCAPAs();
  return allCAPAs.find(capa => capa.id === id) || null;
}

export async function updateCAPA(id: string, updates: Partial<CAPA>): Promise<CAPA> {
  // Mock implementation for updating CAPA
  const allCAPAs = await fetchCAPAs();
  const capaIndex = allCAPAs.findIndex(capa => capa.id === id);
  
  if (capaIndex === -1) {
    throw new Error(`CAPA with id ${id} not found`);
  }
  
  const updatedCAPA: CAPA = {
    ...allCAPAs[capaIndex],
    ...updates,
    lastUpdated: new Date().toISOString()
  };
  
  // In a real implementation, we would update the database here
  
  return updatedCAPA;
}
