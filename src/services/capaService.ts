
import { CAPA, CAPASource, CAPAPriority, CAPAStatus } from '@/types/capa';
import { supabase } from '@/integrations/supabase/client';

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
