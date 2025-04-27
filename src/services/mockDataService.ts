
import { CAPA } from '@/types/capa';
import { Document } from '@/types/document';
import { mapToCAPAStatus } from './capa/capaStatusService';

// Mock CAPA data
export const getMockCAPAs = (): CAPA[] => {
  return [
    {
      id: '1',
      title: 'Metal Detection Calibration Failure',
      description: 'Metal detector on Line 3 failed monthly verification check',
      status: 'Open',
      priority: 'High',
      createdAt: '2025-02-15T08:30:00Z',
      createdBy: 'john.smith',
      dueDate: '2025-03-15T17:00:00Z',
      assignedTo: 'sarah.johnson',
      source: 'Internal',
      rootCause: 'Calibration weights not properly maintained',
      correctiveAction: 'Immediate recalibration performed',
      preventiveAction: 'Implement weekly verification checks',
      department: 'QA',
      fsma204Compliant: true,
      sourceReference: 'NCR-2025-0023',
      relatedDocuments: [],
      relatedTraining: []
    },
    {
      id: '2',
      title: 'Temperature Deviation in Cold Storage',
      description: 'Cold storage unit #4 exceeded critical limit of 4°C for 3 hours',
      status: 'In_Progress',
      priority: 'Critical',
      createdAt: '2025-03-01T14:45:00Z',
      createdBy: 'robert.chen',
      dueDate: '2025-03-08T17:00:00Z',
      assignedTo: 'emily.wilson',
      source: 'Audit',
      rootCause: 'Faulty temperature sensor',
      correctiveAction: 'Replaced sensor and recalibrated monitoring system',
      preventiveAction: 'Installing backup temperature sensors',
      department: 'Warehouse',
      fsma204Compliant: true,
      sourceReference: 'DEV-2025-0112',
      relatedDocuments: [],
      relatedTraining: []
    },
    {
      id: '3',
      title: 'Supplier Audit Major Non-conformance',
      description: 'Major non-conformance found during supplier audit of ingredient supplier XYZ',
      status: 'Under_Review',
      priority: 'Medium',
      createdAt: '2025-02-20T10:15:00Z',
      createdBy: 'maria.garcia',
      dueDate: '2025-04-01T17:00:00Z',
      assignedTo: 'david.zhang',
      source: 'Audit',
      rootCause: 'Supplier not following approved allergen control program',
      preventiveAction: 'Require quarterly verification of allergen controls',
      department: 'Supply Chain',
      fsma204Compliant: false,
      sourceReference: 'SUP-AUD-2025-005',
      relatedDocuments: [],
      relatedTraining: []
    },
    {
      id: '4',
      title: 'Foreign Material Customer Complaint',
      description: 'Customer reported plastic fragment in finished product batch #45622',
      status: 'Completed',
      priority: 'High',
      createdAt: '2025-01-10T09:20:00Z',
      createdBy: 'james.wilson',
      dueDate: '2025-01-25T17:00:00Z',
      assignedTo: 'karen.nguyen',
      source: 'Customer Complaint',
      completionDate: '2025-01-23T16:45:00Z',
      rootCause: 'Damaged conveyor belt in packaging area',
      correctiveAction: 'Belt replaced and all potentially affected product placed on hold',
      preventiveAction: 'Implemented weekly preventive maintenance checks on all conveyor belts',
      effectivenessCriteria: 'No similar complaints for 90 days',
      effectivenessRating: 'Effective',
      effectivenessVerified: true,
      verificationDate: '2025-04-23T14:30:00Z',
      department: 'Production',
      sourceReference: 'CC-2025-0034',
      fsma204Compliant: true,
      relatedDocuments: [],
      relatedTraining: []
    },
    {
      id: '5',
      title: 'Missing Records During FDA Inspection',
      description: 'Daily sanitation verification records found missing during FDA visit',
      status: 'Closed',
      priority: 'Critical',
      createdAt: '2025-02-05T11:30:00Z',
      createdBy: 'susan.kim',
      dueDate: '2025-02-12T17:00:00Z',
      assignedTo: 'michael.brown',
      source: 'Regulatory',
      completionDate: '2025-02-11T15:20:00Z',
      rootCause: 'Electronic record system failure',
      correctiveAction: 'Restored records from backup system',
      preventiveAction: 'Implemented paper backup procedure during system downtime',
      effectivenessCriteria: 'No missing records for 60 days',
      effectivenessRating: 'Highly_Effective',
      effectivenessVerified: true,
      verificationDate: '2025-04-12T09:15:00Z',
      verifiedBy: 'william.jones',
      department: 'Sanitation',
      sourceReference: 'REG-2025-003',
      fsma204Compliant: true,
      relatedDocuments: [],
      relatedTraining: []
    }
  ];
};

// Mock document data
export const getMockDocuments = (): Document[] => {
  return [
    {
      id: '1',
      title: 'HACCP Plan - Ready to Eat Products',
      description: 'Hazard Analysis Critical Control Point Plan for RTE product line',
      category: 'HACCP Plan',
      status: 'Published',
      file_name: 'haccp_rte_v2.1.pdf',
      file_type: 'application/pdf',
      file_size: 1458000,
      version: 2,
      created_by: 'john.smith',
      created_at: '2024-12-10T14:30:00Z',
      updated_at: '2025-03-01T09:15:00Z',
      expiry_date: '2026-03-01T09:15:00Z',
      checkout_status: 'Available',
      tags: ['HACCP', 'Food Safety', 'RTE'],
      file_path: '/documents/food-safety/'
    },
    {
      id: '2',
      title: 'Supplier Approval Procedure',
      description: 'Standard operating procedure for supplier approval process',
      category: 'SOP',
      status: 'Pending_Review',
      file_name: 'supplier_approval_proc_v3.docx',
      file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      file_size: 985000,
      version: 3,
      created_by: 'maria.garcia',
      created_at: '2024-10-15T11:45:00Z',
      updated_at: '2025-03-05T16:30:00Z',
      checkout_status: 'Available',
      tags: ['Supplier', 'SOP', 'Approval'],
      file_path: '/documents/procedures/'
    },
    {
      id: '3',
      title: 'Foreign Material Prevention Policy',
      description: 'Company policy on foreign material prevention and control',
      category: 'Policy',
      status: 'Approved',
      file_name: 'foreign_material_prevention_v1.2.pdf',
      file_type: 'application/pdf',
      file_size: 754000,
      version: 1,
      created_by: 'robert.chen',
      created_at: '2025-01-22T13:15:00Z',
      updated_at: '2025-02-10T10:45:00Z',
      expiry_date: '2026-02-10T10:45:00Z',
      checkout_status: 'Available',
      approvers: ['john.smith', 'emily.wilson', 'david.zhang'],
      tags: ['Policy', 'Foreign Material', 'Food Safety'],
      file_path: '/documents/policies/'
    },
    {
      id: '4',
      title: 'Line Changeover Form',
      description: 'Form for documenting production line changeover procedure',
      category: 'Form',
      status: 'Active',
      file_name: 'line_changeover_form_v2.xlsx',
      file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      file_size: 345000,
      version: 2,
      created_by: 'emily.wilson',
      created_at: '2024-11-05T09:20:00Z',
      updated_at: '2025-01-15T14:10:00Z',
      checkout_status: 'Checked_Out',
      checkout_user_id: 'karen.nguyen',
      checkout_user_name: 'Karen Nguyen',
      checkout_timestamp: '2025-03-10T11:25:00Z',
      tags: ['Form', 'Production', 'Changeover'],
      file_path: '/documents/forms/'
    },
    {
      id: '5',
      title: 'Allergen Control Program',
      description: 'Comprehensive allergen control program documentation',
      category: 'Policy',
      status: 'Draft',
      file_name: 'allergen_control_program_draft.docx',
      file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      file_size: 1250000,
      version: 1,
      created_by: 'sarah.johnson',
      created_at: '2025-02-28T15:40:00Z',
      updated_at: '2025-02-28T15:40:00Z',
      checkout_status: 'Available',
      tags: ['Allergen', 'Food Safety', 'Policy', 'Draft'],
      file_path: '/documents/policies/'
    }
  ];
};

// Mock data for document workflow steps
export const getMockDocumentWorkflowSteps = (): any[] => {
  return [
    {
      id: '1',
      name: 'Technical Review',
      description: 'Review by technical subject matter expert',
      approvers: ['john.smith', 'maria.garcia'],
      status: 'Approved'
    },
    {
      id: '2',
      name: 'Quality Assurance Review',
      description: 'Review by QA manager',
      approvers: ['emily.wilson'],
      status: 'Approved'
    },
    {
      id: '3',
      name: 'Management Approval',
      description: 'Final approval by department management',
      approvers: ['david.zhang'],
      status: 'Pending'
    }
  ];
};

// Mock data for training metrics
export const getMockTrainingStats = () => {
  return {
    compliancePercentage: 84,
    totalAssigned: 250,
    completed: 210,
    departmentStats: [
      {
        department: 'production',
        name: 'Production',
        completed: 42,
        overdue: 8,
        totalAssigned: 50,
        complianceRate: 84
      },
      {
        department: 'quality',
        name: 'Quality',
        completed: 18,
        overdue: 2,
        totalAssigned: 20,
        complianceRate: 90
      },
      {
        department: 'maintenance',
        name: 'Maintenance',
        completed: 12,
        overdue: 3,
        totalAssigned: 15,
        complianceRate: 80
      },
      {
        department: 'warehouse',
        name: 'Warehouse',
        completed: 22,
        overdue: 3,
        totalAssigned: 25,
        complianceRate: 88
      }
    ],
    expiringCertifications: [
      { 
        id: '1', 
        name: 'Food Safety Manager Certification', 
        employee: 'Robert Johnson',
        expiryDate: '2025-05-20', 
        daysLeft: 14,
        auditRequired: true
      },
      { 
        id: '2', 
        name: 'HACCP Certification', 
        employee: 'Maria Garcia',
        expiryDate: '2025-05-28', 
        daysLeft: 22,
        auditRequired: true
      },
      { 
        id: '3', 
        name: 'ISO 9001 Lead Auditor', 
        employee: 'John Smith',
        expiryDate: '2025-06-05', 
        daysLeft: 30,
        auditRequired: false
      }
    ]
  };
};

// Mock CAPA Stats for dashboard
export const getMockCAPAStats = () => {
  return {
    total: 35,
    openCount: 12,
    closedCount: 18,
    overdueCount: 5,
    pendingVerificationCount: 4,
    effectivenessRate: 85,
    byPriority: {
      'Low': 8,
      'Medium': 14,
      'High': 10,
      'Critical': 3
    },
    bySource: {
      'Audit': 12,
      'Customer Complaint': 8,
      'Internal': 11,
      'Regulatory': 4
    },
    byDepartment: {
      'Production': 13,
      'QA': 10,
      'Warehouse': 6,
      'Maintenance': 4,
      'Sanitation': 2
    },
    byStatus: {
      'Open': 10,
      'In Progress': 8,
      'Under Review': 2,
      'Completed': 5,
      'Closed': 5,
      'Rejected': 1,
      'On Hold': 1,
      'Overdue': 3
    },
    byMonth: {
      'Jan': 8,
      'Feb': 10,
      'Mar': 12,
      'Apr': 5
    },
    overdue: 5
  };
};

// Mock document stats for dashboard
export const getMockDocumentStats = () => {
  return {
    total: 127,
    drafts: 15,
    pending: 8,
    published: 85,
    expired: 6,
    expiringSoon: 13
  };
};

// Mock compliance trend data
export const getMockComplianceTrendData = () => {
  return [
    { month: 'Jan', sqf: 82, iso22000: 78, fssc22000: 85, haccp: 90, brcgs2: 76 },
    { month: 'Feb', sqf: 85, iso22000: 80, fssc22000: 82, haccp: 88, brcgs2: 79 },
    { month: 'Mar', sqf: 83, iso22000: 82, fssc22000: 84, haccp: 91, brcgs2: 81 },
    { month: 'Apr', sqf: 87, iso22000: 85, fssc22000: 86, haccp: 93, brcgs2: 84 },
    { month: 'May', sqf: 90, iso22000: 88, fssc22000: 89, haccp: 94, brcgs2: 86 },
    { month: 'Jun', sqf: 92, iso22000: 89, fssc22000: 91, haccp: 95, brcgs2: 89 }
  ];
};
