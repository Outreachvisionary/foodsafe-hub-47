
import { CAPA, CAPAStats } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';
import { CAPAActivity } from '@/components/capa/CAPAActivityList';
import { createEmptyCAPAPriorityRecord, createEmptyCAPASourceRecord } from '@/utils/typeAdapters';

// Mock data and service functions
export const getCAPAs = async (): Promise<CAPA[]> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          title: 'Temperature monitoring system failure',
          description: 'Cold storage temperature monitoring system failed during weekend',
          status: CAPAStatus.Open,
          priority: CAPAPriority.High,
          source: CAPASource.InternalReport,
          source_id: 'IR-2023-0042',
          assigned_to: 'John Doe',
          created_by: 'Jane Smith',
          created_at: '2023-09-15T10:30:00Z',
          updated_at: '2023-09-15T10:30:00Z',
          due_date: '2023-10-15T10:30:00Z',
          root_cause: 'Power surge damaged sensor calibration',
          corrective_action: 'Replace damaged sensors and install surge protectors',
          preventive_action: 'Implement backup power system for monitoring equipment',
          department: 'Quality Assurance',
          fsma204_compliant: true
        },
        {
          id: '2',
          title: 'Foreign material found in finished product',
          description: 'Metal fragment detected in finished product during final inspection',
          status: CAPAStatus.InProgress,
          priority: CAPAPriority.Critical,
          source: CAPASource.NonConformance,
          source_id: 'NC-2023-0089',
          assigned_to: 'Robert Johnson',
          created_by: 'Maria Garcia',
          created_at: '2023-09-10T14:20:00Z',
          updated_at: '2023-09-12T09:45:00Z',
          due_date: '2023-09-25T14:20:00Z',
          root_cause: 'Metal detector sensitivity set too low',
          corrective_action: 'Adjust metal detector settings and revalidate',
          preventive_action: 'Implement daily verification of metal detector sensitivity',
          department: 'Production',
          fsma204_compliant: true
        }
      ]);
    }, 500);
  });
};

export const getRecentCAPAs = async (): Promise<CAPA[]> => {
  const allCAPAs = await getCAPAs();
  return allCAPAs.slice(0, 5);
};

export const getCAPA = async (id: string): Promise<CAPA> => {
  const allCAPAs = await getCAPAs();
  const capa = allCAPAs.find(c => c.id === id);
  
  if (!capa) {
    throw new Error(`CAPA with ID ${id} not found`);
  }
  
  return capa;
};

export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA> => {
  // Mock implementation
  const capa = await getCAPA(id);
  
  // Merge updates
  const updatedCAPA: CAPA = {
    ...capa,
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return updatedCAPA;
};

export const createCAPA = async (capaData: Partial<CAPA>): Promise<CAPA> => {
  // Mock implementation
  const newCAPA: CAPA = {
    id: Date.now().toString(),
    title: capaData.title || '',
    description: capaData.description || '',
    status: capaData.status || CAPAStatus.Open,
    priority: capaData.priority || CAPAPriority.Medium,
    source: capaData.source || CAPASource.InternalReport,
    source_id: capaData.source_id || '',
    assigned_to: capaData.assigned_to || '',
    created_by: 'Current User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    due_date: capaData.due_date,
    root_cause: capaData.root_cause || '',
    corrective_action: capaData.corrective_action || '',
    preventive_action: capaData.preventive_action || '',
    department: capaData.department || '',
    fsma204_compliant: capaData.fsma204_compliant || false
  };
  
  return newCAPA;
};

export const getCAPAActivities = async (capaId: string): Promise<CAPAActivity[]> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          capa_id: capaId,
          performed_at: '2023-09-15T10:30:00Z',
          old_status: null,
          new_status: CAPAStatus.Open,
          action_type: 'creation',
          action_description: 'CAPA created',
          performed_by: 'Jane Smith'
        },
        {
          id: '2',
          capa_id: capaId,
          performed_at: '2023-09-16T14:20:00Z',
          old_status: CAPAStatus.Open,
          new_status: CAPAStatus.InProgress,
          action_type: 'status_change',
          action_description: 'Status updated',
          performed_by: 'John Doe'
        },
        {
          id: '3',
          capa_id: capaId,
          performed_at: '2023-09-17T09:15:00Z',
          old_status: null,
          new_status: null,
          action_type: 'comment',
          action_description: 'Added root cause analysis',
          performed_by: 'John Doe'
        }
      ]);
    }, 500);
  });
};

export const getCAPAStats = async (): Promise<CAPAStats> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        total: 35,
        open: 12,
        inProgress: 8,
        completed: 10,
        overdue: 5,
        byPriority: {
          [CAPAPriority.Low]: 8,
          [CAPAPriority.Medium]: 14,
          [CAPAPriority.High]: 10,
          [CAPAPriority.Critical]: 3
        },
        bySource: {
          [CAPASource.Audit]: 7,
          [CAPASource.CustomerComplaint]: 5,
          [CAPASource.InternalReport]: 8,
          [CAPASource.NonConformance]: 10,
          [CAPASource.RegulatoryInspection]: 2,
          [CAPASource.SupplierIssue]: 3,
          [CAPASource.Other]: 0
        },
        byDepartment: {
          'Quality Assurance': 12,
          'Production': 9,
          'Warehouse': 5,
          'R&D': 3,
          'Maintenance': 6
        },
        recentActivities: [
          {
            id: '1',
            capaId: '1',
            action: 'Status changed',
            timestamp: '2023-09-18T14:30:00Z',
            user: 'John Doe',
            details: 'Status updated from Open to In Progress'
          }
        ]
      });
    }, 500);
  });
};
