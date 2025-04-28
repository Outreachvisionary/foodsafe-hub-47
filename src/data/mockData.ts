
import { Document } from '@/types/document';
import { CAPA } from '@/types/capa';
import { TrainingRecord, TrainingSession, TrainingStatus, TrainingCategory } from '@/types/training';

// Mock Document Data
export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    title: 'HACCP Plan for Production Line A',
    description: 'Hazard Analysis Critical Control Point plan for the main production line',
    file_name: 'haccp_plan_line_a.pdf',
    file_type: 'application/pdf',
    file_size: 1024000,
    category: 'HACCP Plan',
    status: 'Published', // Updated to match DocumentStatus type
    version: 1,
    created_by: 'john.doe',
    created_at: '2023-08-01T10:30:00Z',
    updated_at: '2023-08-01T10:30:00Z',
  },
  {
    id: 'doc-2',
    title: 'Good Manufacturing Practices SOP',
    description: 'Standard Operating Procedure for GMP compliance',
    file_name: 'gmp_sop_v2.docx',
    file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    file_size: 512000,
    category: 'SOP',
    status: 'Pending_Review', // Updated to match DocumentStatus type
    version: 2,
    created_by: 'jane.smith',
    created_at: '2023-08-05T14:15:00Z',
    updated_at: '2023-08-10T09:45:00Z',
  },
  {
    id: 'doc-3',
    title: 'Allergen Control Policy',
    description: 'Company policy for allergen control and management',
    file_name: 'allergen_policy.pdf',
    file_type: 'application/pdf',
    file_size: 768000,
    category: 'Policy',
    status: 'Active', // Updated to match DocumentStatus type
    version: 3,
    created_by: 'quality.manager',
    created_at: '2023-07-15T11:20:00Z',
    updated_at: '2023-08-12T16:30:00Z',
  },
  {
    id: 'doc-4',
    title: 'Sanitation Verification Form',
    description: 'Form for verifying sanitation procedures',
    file_name: 'sanitation_form.xlsx',
    file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    file_size: 256000,
    category: 'Form',
    status: 'Pending_Approval', // Updated to match DocumentStatus type
    version: 1,
    created_by: 'sanitation.lead',
    created_at: '2023-08-14T08:00:00Z',
    updated_at: '2023-08-14T08:00:00Z',
  }
];

// Mock CAPA Data
export const mockCAPAs: CAPA[] = [
  {
    id: 'capa-1',
    title: 'Temperature Control Deviation',
    description: 'Temperature exceeded critical limits during processing',
    status: 'Open',
    priority: 'High',
    createdAt: '2023-08-01T10:30:00Z',
    dueDate: '2023-09-01T00:00:00Z',
    assignedTo: 'jane.smith',
    createdBy: 'john.doe',
    source: 'Internal_Issue', // Updated to match CAPASource type
    rootCause: 'Faulty temperature sensor',
    correctiveAction: 'Replace temperature sensor',
    preventiveAction: 'Implement daily calibration checks',
    department: 'Production',
    fsma204Compliant: true,
    effectivenessVerified: false,
    relatedDocuments: [],
    relatedTraining: [],
    sourceReference: 'NC-2023-0125'
  },
  {
    id: 'capa-2',
    title: 'Foreign Material Contamination',
    description: 'Metal fragments found during routine inspection',
    status: 'In_Progress',
    priority: 'Critical',
    createdAt: '2023-08-05T14:15:00Z',
    dueDate: '2023-08-20T00:00:00Z',
    assignedTo: 'maintenance.manager',
    createdBy: 'quality.manager',
    source: 'Non_Conformance', // Updated to match CAPASource type
    rootCause: 'Worn equipment part',
    correctiveAction: 'Replace damaged equipment',
    preventiveAction: 'Increase frequency of equipment inspections',
    department: 'Maintenance',
    effectivenessCriteria: 'No foreign material findings for 30 days',
    fsma204Compliant: true,
    effectivenessVerified: false,
    relatedDocuments: [],
    relatedTraining: [],
    sourceReference: 'NC-2023-0138'
  },
  {
    id: 'capa-3',
    title: 'Missing Documentation',
    description: 'Required records not completed during production',
    status: 'Completed',
    priority: 'Medium',
    createdAt: '2023-07-15T11:20:00Z',
    dueDate: '2023-08-15T00:00:00Z',
    completionDate: '2023-08-10T09:45:00Z',
    assignedTo: 'production.supervisor',
    createdBy: 'documentation.specialist',
    source: 'Audit',
    rootCause: 'Lack of training on documentation requirements',
    correctiveAction: 'Retrain production staff',
    preventiveAction: 'Implement documentation verification step',
    department: 'Production',
    effectivenessRating: 'Effective',
    effectivenessVerified: true,
    verificationDate: '2023-08-17T00:00:00Z',
    verifiedBy: 'quality.manager',
    fsma204Compliant: true,
    relatedDocuments: [
      {
        id: 'rd-1',
        documentId: 'doc-1',
        documentName: 'Documentation Procedure',
        documentType: 'SOP'
      }
    ],
    relatedTraining: [
      {
        id: 'rt-1',
        trainingId: 'training-1',
        trainingName: 'Documentation Requirements',
        trainingType: 'online'
      }
    ],
    sourceReference: 'Audit-2023-042'
  }
];

// Mock Training Records
export const mockTrainingRecords: TrainingRecord[] = [
  {
    id: 'tr-1',
    session_id: 'ts-1',
    employee_id: 'emp-101',
    employee_name: 'John Doe',
    status: 'Completed',
    assigned_date: '2023-07-01T00:00:00Z',
    due_date: '2023-07-15T00:00:00Z',
    completion_date: '2023-07-12T14:30:00Z',
    score: 95,
    pass_threshold: 80
  },
  {
    id: 'tr-2',
    session_id: 'ts-2',
    employee_id: 'emp-102',
    employee_name: 'Jane Smith',
    status: 'In Progress',
    assigned_date: '2023-08-01T00:00:00Z',
    due_date: '2023-08-20T00:00:00Z'
  },
  {
    id: 'tr-3',
    session_id: 'ts-1',
    employee_id: 'emp-103',
    employee_name: 'David Wilson',
    status: 'Not Started',
    assigned_date: '2023-08-05T00:00:00Z',
    due_date: '2023-08-25T00:00:00Z'
  }
];

// Mock Training Sessions
export const mockTrainingSessions: TrainingSession[] = [
  {
    id: 'ts-1',
    title: 'HACCP Principles Training',
    description: 'Comprehensive training on HACCP principles and implementation',
    training_type: 'classroom',
    training_category: 'haccp',
    department: 'Quality',
    start_date: '2023-07-10T09:00:00Z',
    due_date: '2023-07-10T17:00:00Z',
    assigned_to: ['emp-101', 'emp-103', 'emp-105'],
    materials_id: ['doc-5', 'doc-6'],
    is_recurring: true,
    recurring_interval: 365,
    required_roles: ['quality', 'production-supervisor'],
    completion_status: 'Completed',
    created_by: 'training.manager',
    created_at: '2023-06-15T10:30:00Z',
    updated_at: '2023-06-15T10:30:00Z'
  },
  {
    id: 'ts-2',
    title: 'Allergen Management',
    description: 'Training on allergen control and cross-contamination prevention',
    training_type: 'online',
    training_category: 'allergen-management',
    department: 'Production',
    start_date: '2023-08-05T00:00:00Z',
    due_date: '2023-08-20T00:00:00Z',
    assigned_to: ['emp-102', 'emp-104', 'emp-106'],
    materials_id: ['doc-7'],
    is_recurring: true,
    recurring_interval: 180,
    required_roles: ['production'],
    completion_status: 'In Progress',
    created_by: 'training.manager',
    created_at: '2023-07-25T14:15:00Z',
    updated_at: '2023-07-25T14:15:00Z'
  }
];

// Export additional mock data as needed
