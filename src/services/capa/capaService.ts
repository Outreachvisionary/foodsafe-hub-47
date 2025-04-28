
import { CAPAStats, CAPA } from '@/types/capa';

// Mock CAPA stats for development
export const getCAPAStats = async (): Promise<CAPAStats> => {
  // In a real application, this would fetch data from the API
  return {
    total: 85,
    openCount: 32,
    closedCount: 45,
    overdueCount: 8,
    pendingVerificationCount: 5,
    effectivenessRate: 78,
    byPriority: {
      'Low': 12,
      'Medium': 35,
      'High': 30,
      'Critical': 8
    },
    bySource: {
      'Audit': 25,
      'Customer_Complaint': 15,
      'Non_Conformance': 20,
      'Supplier_Issue': 10,
      'Management_Review': 15
    },
    byDepartment: {
      'Production': 30,
      'QA': 25,
      'Warehouse': 15,
      'Maintenance': 10,
      'Other': 5
    },
    byStatus: {
      'Open': 15,
      'In Progress': 17,
      'Closed': 40,
      'Overdue': 8,
      'Pending_Verification': 5,
      'Verified': 0
    },
    byMonth: {
      'Jan': 5,
      'Feb': 8,
      'Mar': 10,
      'Apr': 12,
      'May': 15,
      'Jun': 20,
      'Jul': 15
    },
    overdue: 8
  };
};

// Mock function to fetch a single CAPA
export const getCAPAById = async (id: string): Promise<CAPA | null> => {
  // This would fetch from an API in production
  const mockCapa: CAPA = {
    id,
    title: `CAPA-${id}`,
    description: "Description of the CAPA item",
    status: 'In_Progress',
    priority: 'High',
    createdAt: new Date().toISOString(),
    createdBy: 'John Doe',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Jane Smith',
    source: 'Audit',
    sourceReference: 'Audit-2023-001',
    rootCause: 'Process failure',
    correctiveAction: 'Update process documentation',
    preventiveAction: 'Staff training',
    effectivenessCriteria: 'No recurrence for 90 days',
    relatedDocuments: [],
    relatedTraining: []
  };
  
  return mockCapa;
};

// Additional mock service functions can be added here
