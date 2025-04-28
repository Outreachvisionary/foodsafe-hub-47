
import { CAPA, CAPAStatus } from '@/types/capa';
import { supabase } from '@/integrations/supabase/client';

// Mock function to fetch CAPAs
export const getCAPAs = async (): Promise<CAPA[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return [
    {
      id: '1',
      title: 'CAPA-001',
      description: 'Product temperature deviation in cold storage',
      status: 'In_Progress',
      priority: 'High',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'John Doe',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'Jane Smith',
      source: 'Audit',
      sourceReference: 'Audit-2023-001',
      rootCause: 'Refrigeration unit malfunction',
      correctiveAction: 'Replace refrigeration unit and implement daily temperature checks',
      preventiveAction: 'Scheduled maintenance program for all refrigeration units',
      effectivenessCriteria: 'No temperature deviations for 90 days',
      department: 'Production',
      fsma204Compliant: true,
      relatedDocuments: ['doc-123', 'doc-456'],
      relatedTraining: ['train-123']
    },
    {
      id: '2',
      title: 'CAPA-002',
      description: 'Allergen cross-contamination risk identified',
      status: 'Open',
      priority: 'Critical',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'Robert Johnson',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'Maria Garcia',
      source: 'Internal_QC',
      sourceReference: 'QC-2023-057',
      rootCause: 'Insufficient cleaning between allergen-containing product runs',
      correctiveAction: 'Implement enhanced cleaning validation protocol',
      preventiveAction: 'Update allergen management program',
      effectivenessCriteria: 'Zero allergen cross-contamination incidents',
      department: 'Quality',
      fsma204Compliant: true,
      relatedDocuments: ['doc-789'],
      relatedTraining: ['train-456']
    }
  ];
};

// Mock function to create a CAPA
export const createCAPA = async (capaData: Partial<CAPA>): Promise<CAPA> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate a new CAPA with the provided data
  const newCAPA: CAPA = {
    id: `capa-${Date.now()}`,
    title: capaData.title || '',
    description: capaData.description || '',
    status: (capaData.status || 'Open') as CAPAStatus,
    priority: capaData.priority || 'Medium',
    createdAt: new Date().toISOString(),
    createdBy: capaData.createdBy || 'System',
    dueDate: capaData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: capaData.assignedTo || '',
    source: capaData.source || 'Other',
    sourceReference: capaData.sourceReference || '',
    rootCause: capaData.rootCause || '',
    correctiveAction: capaData.correctiveAction || '',
    preventiveAction: capaData.preventiveAction || '',
    effectivenessCriteria: capaData.effectivenessCriteria || '',
    department: capaData.department || '',
    fsma204Compliant: capaData.fsma204Compliant || false,
    relatedDocuments: capaData.relatedDocuments || [],
    relatedTraining: capaData.relatedTraining || []
  };
  
  return newCAPA;
};

// Mock function to delete a CAPA
export const deleteCAPA = async (id: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
};

// Mock function to update a CAPA
export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, this would fetch the CAPA first, then update it
  const mockCAPA: CAPA = {
    id,
    title: updates.title || 'Updated CAPA',
    description: updates.description || '',
    status: updates.status || 'In_Progress',
    priority: updates.priority || 'Medium',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'John Doe',
    dueDate: updates.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: updates.assignedTo || 'Jane Smith',
    source: updates.source || 'Audit',
    sourceReference: updates.sourceReference || 'REF-123',
    rootCause: updates.rootCause || '',
    correctiveAction: updates.correctiveAction || '',
    preventiveAction: updates.preventiveAction || '',
    effectivenessCriteria: updates.effectivenessCriteria || '',
    department: updates.department || 'Quality',
    fsma204Compliant: updates.fsma204Compliant || false,
    relatedDocuments: updates.relatedDocuments || [],
    relatedTraining: updates.relatedTraining || []
  };
  
  return mockCAPA;
};
