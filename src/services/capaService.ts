
import { CAPA, CAPAStats, CAPAFetchParams } from '@/types/capa';
import { supabase } from '@/integrations/supabase/client';

// Mock CAPA data for development
const mockCAPAs: CAPA[] = [
  {
    id: "1",
    title: "Raw Material Quality Issue",
    description: "Supplier delivered raw materials below quality standards",
    status: 'Open',
    priority: 'High',
    createdAt: new Date().toISOString(),
    createdBy: "John Doe",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: "Maria Rodriguez",
    source: "Supplier_Issue",
    sourceId: "SUP-001",
    sourceReference: "QC-Check-2023-42",
    completionDate: undefined,
    rootCause: "Supplier changed process without notification",
    correctiveAction: "Return materials and request replacement",
    preventiveAction: "Implement supplier pre-shipment testing",
    effectivenessCriteria: "No quality issues for 3 consecutive shipments",
    effectivenessRating: undefined,
    effectivenessVerified: false,
    department: "Quality Control",
    fsma204Compliant: true,
    relatedDocuments: ["DOC-1234", "DOC-5678"],
    relatedTraining: []
  },
  {
    id: "2",
    title: "Production Line Contamination",
    description: "Metal fragments detected in product during inspection",
    status: 'In_Progress',
    priority: 'Critical',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "Sarah Johnson",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: "Michael Chen",
    source: "Non_Conformance",
    sourceId: "NC-2023-15",
    sourceReference: "NC-2023-15",
    rootCause: "Worn equipment part causing metal shavings",
    correctiveAction: "Replace affected equipment parts",
    preventiveAction: "Enhance preventive maintenance schedule",
    effectivenessCriteria: "No metal detection alarms for 1 month",
    department: "Production",
    fsma204Compliant: true,
    relatedDocuments: [],
    relatedTraining: ["TR-527"]
  }
];

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

// Get all CAPAs with optional filtering
export const getCAPAs = async (params?: CAPAFetchParams): Promise<CAPA[]> => {
  try {
    // For now, return mock data
    // In a real app, this would use the params to filter data from the API
    return mockCAPAs;
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    throw error;
  }
};

// Mock function to fetch a single CAPA
export const getCAPAById = async (id: string): Promise<CAPA | null> => {
  // This would fetch from an API in production
  const foundCapa = mockCAPAs.find(capa => capa.id === id);
  
  if (foundCapa) {
    return foundCapa;
  }
  
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

// Delete CAPA
export const deleteCAPA = async (id: string): Promise<void> => {
  try {
    // In production, this would delete from the API
    console.log(`Deleting CAPA with ID: ${id}`);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  } catch (error) {
    console.error('Error deleting CAPA:', error);
    throw error;
  }
};

// Update CAPA
export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA> => {
  try {
    // In production, this would update via the API
    console.log(`Updating CAPA with ID: ${id}`, updates);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find existing CAPA or create a mock one
    const existingCapa = mockCAPAs.find(capa => capa.id === id) || {
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
      relatedDocuments: [],
      relatedTraining: []
    } as CAPA;
    
    return { ...existingCapa, ...updates };
  } catch (error) {
    console.error('Error updating CAPA:', error);
    throw error;
  }
};
