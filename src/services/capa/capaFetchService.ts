
import { CAPA } from '@/types/capa';

// Mock function to fetch a CAPA by ID
export const fetchCAPAById = async (id: string): Promise<any> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return {
    id,
    title: `CAPA-${id}`,
    description: "Description of the CAPA item",
    status: 'In_Progress',
    priority: 'High',
    created_at: new Date().toISOString(),
    created_by: 'John Doe',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_to: 'Jane Smith',
    source: 'Audit',
    source_reference: 'Audit-2023-001',
    root_cause: 'Process failure',
    corrective_action: 'Update process documentation',
    preventive_action: 'Staff training',
    effectiveness_criteria: 'No recurrence for 90 days',
    department: 'Quality'
  };
};
