
import { Document, DocumentStatus, DocumentCategory, CheckoutStatus } from '@/types/document';
import { CAPA, CAPAStatus, CAPASource, CAPAPriority } from '@/types/capa';
import { NonConformance } from '@/types/non-conformance';

// Helper function to convert promises to sync for mock data
export const getMockDocumentData = (): Document[] => {
  return [
    {
      id: '1',
      title: 'Food Safety Manual',
      description: 'Primary food safety manual for the organization',
      category: 'SOP',
      status: 'Published' as DocumentStatus,
      file_name: 'food_safety_manual.pdf',
      file_type: 'application/pdf',
      file_size: 2500000,
      version: 1,
      created_by: 'admin',
      created_at: '2023-01-05T10:30:00Z',
      updated_at: '2023-01-05T10:30:00Z',
      checkout_status: 'Available' as CheckoutStatus
    },
    {
      id: '2',
      title: 'Allergen Control Program',
      description: 'Procedures for controlling allergens in production',
      category: 'Policy',
      status: 'Pending_Review' as DocumentStatus,
      file_name: 'allergen_control.docx',
      file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      file_size: 1800000,
      version: 2,
      created_by: 'quality_manager',
      created_at: '2023-02-10T14:45:00Z',
      updated_at: '2023-03-15T09:20:00Z',
      checkout_status: 'Available' as CheckoutStatus
    },
    {
      id: '3',
      title: 'HACCP Plan - Production Line A',
      description: 'HACCP plan for the primary production line',
      category: 'HACCP Plan',
      status: 'Active' as DocumentStatus,
      file_name: 'haccp_plan_line_a.pdf',
      file_type: 'application/pdf',
      file_size: 3200000,
      version: 4,
      created_by: 'haccp_team_lead',
      created_at: '2023-01-20T08:15:00Z',
      updated_at: '2023-05-12T11:30:00Z',
      checkout_status: 'Available' as CheckoutStatus
    },
    {
      id: '4',
      title: 'Audit Checklist - Monthly GMP Inspection',
      description: 'Checklist for monthly GMP inspections',
      category: 'Form',
      status: 'Pending_Approval' as DocumentStatus,
      file_name: 'gmp_checklist.xlsx',
      file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      file_size: 950000,
      version: 1,
      created_by: 'quality_specialist',
      created_at: '2023-06-05T16:40:00Z',
      updated_at: '2023-06-05T16:40:00Z',
      checkout_status: 'Available' as CheckoutStatus
    }
  ];
};

// Mock CAPA data
export const getMockCAPAData = (): CAPA[] => {
  return [
    {
      id: '1',
      title: 'Temperature Control Failure in Cold Storage',
      description: 'Multiple temperature excursions detected in Cold Storage #3 during overnight monitoring',
      status: 'In_Progress' as CAPAStatus,
      priority: 'High' as CAPAPriority,
      createdAt: '2023-05-15T09:30:00Z',
      createdBy: 'quality_manager',
      dueDate: '2023-06-15T00:00:00Z',
      assignedTo: 'maintenance_lead',
      source: 'Internal_Issue' as CAPASource,
      source_reference: 'INC-2023-0542',
      rootCause: 'Faulty temperature sensor and backup generator failure',
      correctiveAction: 'Replaced temperature sensors and scheduled maintenance for backup generators',
      preventiveAction: 'Implemented redundant temperature monitoring and weekly generator testing',
      fsma204Compliant: true
    },
    {
      id: '2',
      title: 'Foreign Material Found in Finished Product',
      description: 'Metal fragment (2mm) detected in finished product batch #LT4572',
      status: 'Open' as CAPAStatus,
      priority: 'Critical' as CAPAPriority,
      createdAt: '2023-06-20T14:15:00Z',
      createdBy: 'production_supervisor',
      dueDate: '2023-07-05T00:00:00Z',
      assignedTo: 'quality_director',
      source: 'Non_Conformance' as CAPASource,
      source_reference: 'NC-2023-0112',
      department: 'Production',
      effectivenessCriteria: 'No foreign material detected in finished products for 3 consecutive months'
    },
    {
      id: '3',
      title: 'Missing Documentation for Supplier Approval',
      description: 'Three new ingredient suppliers were onboarded without full documentation review',
      status: 'Completed' as CAPAStatus,
      priority: 'Medium' as CAPAPriority,
      createdAt: '2023-04-10T11:20:00Z',
      createdBy: 'audit_manager',
      dueDate: '2023-05-10T00:00:00Z',
      assignedTo: 'procurement_manager',
      completionDate: '2023-05-08T16:45:00Z',
      source: 'Audit' as CAPASource,
      source_reference: 'AUDIT-2023-INT-04',
      effectivenessVerified: true,
      effectivenessRating: 'Effective' as CAPAEffectivenessRating,
      verificationDate: '2023-07-10T14:30:00Z'
    }
  ];
};

// Document workflow steps
export const getMockDocumentWorkflowSteps = () => {
  return [
    {
      id: '1',
      name: 'Technical Review',
      description: 'Review for technical accuracy',
      approvers: ['tech_lead', 'qa_specialist'],
      status: 'Approved'
    },
    {
      id: '2',
      name: 'Quality Review',
      description: 'Review for compliance with quality standards',
      approvers: ['quality_manager'],
      status: 'Approved'
    },
    {
      id: '3',
      name: 'Final Approval',
      description: 'Final management approval',
      approvers: ['department_head'],
      status: 'Pending'
    }
  ];
};

// Compliance trend data
export const getMockComplianceTrendData = () => {
  return [
    {
      month: 'Jan',
      sqf: 95,
      iso22000: 92,
      fssc22000: 93,
      haccp: 97,
      brcgs2: 90
    },
    {
      month: 'Feb',
      sqf: 94,
      iso22000: 93,
      fssc22000: 95,
      haccp: 96,
      brcgs2: 91
    },
    {
      month: 'Mar',
      sqf: 96,
      iso22000: 94,
      fssc22000: 96,
      haccp: 98,
      brcgs2: 93
    },
    {
      month: 'Apr',
      sqf: 95,
      iso22000: 93,
      fssc22000: 97,
      haccp: 99,
      brcgs2: 94
    },
    {
      month: 'May',
      sqf: 93,
      iso22000: 95,
      fssc22000: 98,
      haccp: 97,
      brcgs2: 95
    },
    {
      month: 'Jun',
      sqf: 97,
      iso22000: 96,
      fssc22000: 99,
      haccp: 98,
      brcgs2: 96
    }
  ];
};

// Training statistics
export const getMockTrainingStatistics = () => {
  return {
    overallCompliance: 87,
    departmentCompliance: [
      { department: 'Production', completed: 45, total: 50, compliance: 90 },
      { department: 'Quality', completed: 22, total: 25, compliance: 88 },
      { department: 'Maintenance', completed: 15, total: 20, compliance: 75 },
      { department: 'Warehouse', completed: 18, total: 20, compliance: 90 },
      { department: 'R&D', completed: 8, total: 10, compliance: 80 }
    ],
    expiringCertifications: [
      { name: 'HACCP Certification', employee: 'John Smith', expires: '2023-08-15' },
      { name: 'PCQI Training', employee: 'Maria Garcia', expires: '2023-08-20' },
      { name: 'Food Defense', employee: 'Robert Johnson', expires: '2023-08-25' },
      { name: 'SQF Practitioner', employee: 'Sarah Williams', expires: '2023-09-01' }
    ],
    upcomingTrainings: [
      { name: 'Annual GMP Refresher', date: '2023-08-15', participants: 45 },
      { name: 'Food Safety Culture', date: '2023-08-22', participants: 60 },
      { name: 'Internal Auditor Training', date: '2023-09-05', participants: 15 }
    ]
  };
};

// Mock training data for training_sessions table
export const getMockTrainingSessionData = () => {
  return {
    id: '12345',
    title: 'HACCP Principles Training',
    description: 'Training on the 7 principles of HACCP and their application',
    training_type: 'classroom',
    training_category: 'haccp',
    department: 'Quality',
    start_date: '2023-08-01',
    due_date: '2023-08-31',
    assigned_to: ['user1', 'user2', 'user3'],
    materials_id: ['doc1', 'doc2'],
    is_recurring: true,
    recurring_interval: 365, // Adding this field
    required_roles: ['quality_specialist', 'production_supervisor'],
    created_by: 'admin',
    created_at: '2023-07-15',
    updated_at: '2023-07-15'
  };
};

// Export any other mock data functions needed
