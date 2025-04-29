
import { CAPA } from '@/types/capa';
import { adaptCAPAToModel } from '@/utils/typeAdapters';
import { CAPAStatus } from '@/types/enums';

// Fetch a CAPA by ID
export const fetchCAPAById = async (id: string): Promise<CAPA> => {
  // In a real implementation, this would call an API
  const mockData = {
    id: id,
    title: 'Sample CAPA',
    description: 'This is a sample CAPA',
    status: 'Open',
    priority: 'High',
    created_at: new Date().toISOString(),
    created_by: 'admin',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_to: 'user123',
    source: 'Audit',
    source_reference: 'AUDIT-123',
    root_cause: 'Process failure',
    corrective_action: 'Update procedure',
    preventive_action: 'Staff training',
    effectiveness_criteria: 'No recurrences for 90 days',
    department: 'Quality',
    source_id: 'SRC-456'
  };
  
  // Convert to CAPA model
  return {
    id: mockData.id,
    title: mockData.title,
    description: mockData.description,
    status: CAPAStatus.Open,
    priority: mockData.priority,
    createdAt: mockData.created_at,
    createdBy: mockData.created_by,
    dueDate: mockData.due_date,
    assignedTo: mockData.assigned_to,
    source: mockData.source,
    sourceReference: mockData.source_reference,
    rootCause: mockData.root_cause,
    correctiveAction: mockData.corrective_action,
    preventiveAction: mockData.preventive_action,
    effectivenessCriteria: mockData.effectiveness_criteria,
    department: mockData.department,
    sourceId: mockData.source_id,
    relatedDocuments: [],
    relatedTraining: []
  };
};

// Fetch CAPAs with filters
export const fetchCAPAs = async (): Promise<CAPA[]> => {
  // Mock implementation
  const mockCAPAs = [
    {
      id: '1',
      title: 'CAPA 1',
      description: 'Description 1',
      status: 'Open',
      priority: 'High',
      created_at: new Date().toISOString(),
      created_by: 'admin',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: 'user123',
      source: 'Audit',
      source_reference: 'AUDIT-123'
    },
    {
      id: '2',
      title: 'CAPA 2',
      description: 'Description 2',
      status: 'In_Progress',
      priority: 'Medium',
      created_at: new Date().toISOString(),
      created_by: 'admin',
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: 'user456',
      source: 'Customer_Complaint',
      source_reference: 'COMP-789'
    }
  ];
  
  return mockCAPAs.map(capa => adaptCAPAToModel(capa));
};

export default {
  fetchCAPAById,
  fetchCAPAs
};
