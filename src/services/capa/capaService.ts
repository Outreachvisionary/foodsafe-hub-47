
import { CAPA, CAPAStats } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating } from '@/types/enums';
import { convertToCAPAStatus, stringToCAPAPriority, stringToCAPASource } from '@/utils/typeAdapters';
import { supabase } from '@/integrations/supabase/client';

// Mock CAPA stats for development
export const getCAPAStats = async (): Promise<CAPAStats> => {
  // In a real application, this would fetch data from the API
  return {
    total: 85,
    open: 32,
    completed: 45,
    overdue: 8,
    inProgress: 0,
    openCount: 32,
    closedCount: 45,
    overdueCount: 8,
    pendingVerificationCount: 5,
    effectivenessRate: 78,
    byPriority: {
      [CAPAPriority.Low]: 12,
      [CAPAPriority.Medium]: 35,
      [CAPAPriority.High]: 30,
      [CAPAPriority.Critical]: 8
    },
    bySource: {
      [CAPASource.Audit]: 25,
      [CAPASource.CustomerComplaint]: 15,
      [CAPASource.NonConformance]: 20,
      [CAPASource.SupplierIssue]: 10,
      [CAPASource.InternalReport]: 15,
      [CAPASource.RegulatoryInspection]: 0, // Added missing property
      [CAPASource.Other]: 0 // Added missing property
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
    recentActivities: [] // Added missing property
  };
};

// Mock function to fetch a single CAPA
export const getCAPAById = async (id: string): Promise<CAPA | null> => {
  // This would fetch from an API in production
  const mockCapa: CAPA = {
    id,
    title: `CAPA-${id}`,
    description: "Description of the CAPA item",
    status: CAPAStatus.InProgress,
    priority: CAPAPriority.High,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(), // Added required field
    created_by: 'John Doe',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_to: 'Jane Smith',
    source: CAPASource.Audit,
    source_reference: 'Audit-2023-001',
    root_cause: 'Process failure',
    corrective_action: 'Update process documentation',
    preventive_action: 'Staff training',
    effectiveness_criteria: 'No recurrence for 90 days',
    relatedDocuments: [],
    relatedTraining: []
  };
  
  return mockCapa;
};

// Additional mock service functions can be added here
