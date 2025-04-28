
import { Document, DocumentStatus, DocumentCategory, CheckoutStatus } from '@/types/document';
import { CAPA, CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating } from '@/types/capa';
import { TrainingSession, TrainingPriority, TrainingType, TrainingCategory, TrainingCompletionStatus } from '@/types/training';

// Mock Document Data
export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Food Safety Policy',
    description: 'Comprehensive food safety policy for the organization',
    category: 'Policy',
    status: 'Published',
    file_name: 'food-safety-policy.pdf',
    file_type: 'application/pdf',
    file_size: 245000,
    version: 1,
    created_by: 'admin',
    created_at: '2023-03-15T10:30:00Z',
    updated_at: '2023-03-15T10:30:00Z',
    checkout_status: 'Available',
    tags: ['food-safety', 'policy', 'compliance']
  },
  {
    id: '2',
    title: 'HACCP Plan - Production Line A',
    description: 'HACCP plan for the main production line',
    category: 'HACCP Plan',
    status: 'Pending_Review',
    file_name: 'haccp-plan-production-a.docx',
    file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    file_size: 385000,
    version: 2,
    created_by: 'quality_manager',
    created_at: '2023-04-10T14:25:00Z',
    updated_at: '2023-04-20T09:15:00Z',
    checkout_status: 'Available',
    tags: ['haccp', 'production', 'food-safety']
  },
  {
    id: '3',
    title: 'Equipment Cleaning SOP',
    description: 'Standard operating procedure for equipment cleaning',
    category: 'SOP',
    status: 'Active',
    file_name: 'equipment-cleaning-sop.pdf',
    file_type: 'application/pdf',
    file_size: 320000,
    version: 3,
    created_by: 'operations_manager',
    created_at: '2023-01-20T11:45:00Z',
    updated_at: '2023-05-05T16:30:00Z',
    checkout_status: 'Available',
    tags: ['sop', 'cleaning', 'equipment']
  },
  {
    id: '4',
    title: 'Allergen Control Form',
    description: 'Form for documenting allergen control measures',
    category: 'Form',
    status: 'Pending_Approval',
    file_name: 'allergen-control-form.xlsx',
    file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    file_size: 125000,
    version: 1,
    created_by: 'quality_specialist',
    created_at: '2023-05-12T09:20:00Z',
    updated_at: '2023-05-12T09:20:00Z',
    checkout_status: 'Available',
    tags: ['allergen', 'control', 'form']
  }
];

// Mock CAPA Data
export const mockCapaActions: CAPA[] = [
  {
    id: 'capa-001',
    title: 'Foreign Material in Product Line A',
    description: 'Metal fragments found in finished product during inspection',
    status: 'Open',
    priority: 'High',
    createdAt: '2023-04-10T08:30:00Z',
    createdBy: 'quality_inspector',
    dueDate: '2023-05-10T00:00:00Z',
    assignedTo: 'production_manager',
    source: 'Internal_Issue',
    source_reference: 'NC-2023-042',
    rootCause: 'Metal detector calibration drift',
    correctiveAction: 'Re-calibrate all metal detectors on Line A',
    preventiveAction: 'Implement daily verification checks',
    department: 'Production',
    fsma204Compliant: true
  },
  {
    id: 'capa-002',
    title: 'Temperature Deviation in Cold Storage',
    description: 'Temperature exceeded critical limits for 3 hours',
    status: 'In_Progress',
    priority: 'Critical',
    createdAt: '2023-05-02T14:15:00Z',
    createdBy: 'facility_manager',
    dueDate: '2023-05-09T00:00:00Z',
    assignedTo: 'maintenance_supervisor',
    source: 'Non_Conformance',
    source_reference: 'NC-2023-056',
    rootCause: 'Compressor failure',
    department: 'Warehouse',
    fsma204Compliant: true
  },
  {
    id: 'capa-003',
    title: 'Missing GMP Training Records',
    description: 'Audit found 5 employees without documented GMP training',
    status: 'Completed',
    priority: 'Medium',
    createdAt: '2023-03-20T10:00:00Z',
    createdBy: 'compliance_officer',
    dueDate: '2023-04-20T00:00:00Z',
    assignedTo: 'hr_manager',
    source: 'Audit',
    source_reference: 'AUDIT-2023-012',
    completionDate: '2023-04-15T16:30:00Z',
    rootCause: 'Training records not properly documented during onboarding',
    correctiveAction: 'Conduct GMP training for all identified employees',
    preventiveAction: 'Update onboarding checklist to include training documentation',
    effectivenessRating: 'Effective',
    department: 'HR',
    fsma204Compliant: false,
    source_reference: 'AUDIT-2023-012-F3'
  }
];

// Mock Training Data
export const mockTrainingSessions: TrainingSession[] = [
  {
    id: 'ts-001',
    title: 'Food Safety Fundamentals',
    description: 'Basic food safety training for all employees',
    training_type: 'online',
    training_category: 'food-safety',
    department: 'All',
    start_date: '2023-06-01T09:00:00Z',
    due_date: '2023-06-15T17:00:00Z',
    assigned_to: ['emp-001', 'emp-002', 'emp-003'],
    materials_id: ['doc-001', 'doc-002'],
    required_roles: ['line-worker', 'supervisor'],
    is_recurring: true,
    recurring_interval: '365', // Annual
    completion_status: 'in-progress',
    created_by: 'training_manager',
    created_at: '2023-05-15T14:30:00Z',
    updated_at: '2023-05-15T14:30:00Z'
  },
  {
    id: 'ts-002',
    title: 'HACCP Principles',
    description: 'Comprehensive HACCP training for quality team',
    training_type: 'classroom',
    training_category: 'haccp',
    department: 'Quality',
    start_date: '2023-06-10T09:00:00Z',
    due_date: '2023-06-10T17:00:00Z',
    assigned_to: ['emp-004', 'emp-005'],
    materials_id: ['doc-003'],
    required_roles: ['quality-specialist'],
    is_recurring: false,
    completion_status: 'not-started',
    created_by: 'quality_director',
    created_at: '2023-05-20T11:15:00Z',
    updated_at: '2023-05-20T11:15:00Z'
  },
  {
    id: 'ts-003',
    title: 'Allergen Management',
    description: 'Training on allergen control and prevention',
    training_type: 'online',
    training_category: 'allergen-control',
    department: 'Production',
    start_date: '2023-05-20T00:00:00Z',
    due_date: '2023-05-27T00:00:00Z',
    assigned_to: ['emp-001', 'emp-006', 'emp-007'],
    materials_id: ['doc-004'],
    required_roles: ['line-worker', 'supervisor'],
    is_recurring: true,
    recurring_interval: '180', // Every 6 months
    completion_status: 'completed',
    created_by: 'training_manager',
    created_at: '2023-05-10T09:00:00Z',
    updated_at: '2023-05-28T10:30:00Z'
  }
];

// Mock Department Statistics
export const mockDepartmentStats = [
  { department: 'Production', name: 'Production', completed: 45, overdue: 5, totalAssigned: 50, complianceRate: 90 },
  { department: 'Quality', name: 'Quality', completed: 38, overdue: 2, totalAssigned: 40, complianceRate: 95 },
  { department: 'Maintenance', name: 'Maintenance', completed: 18, overdue: 7, totalAssigned: 25, complianceRate: 72 },
  { department: 'R&D', name: 'R&D', completed: 12, overdue: 3, totalAssigned: 15, complianceRate: 80 },
];

// Mock Employees
export const mockEmployees = [
  { id: 'emp-001', name: 'John Smith', department: 'Production', position: 'Line Supervisor' },
  { id: 'emp-002', name: 'Maria Garcia', department: 'Quality', position: 'Quality Specialist' },
  { id: 'emp-003', name: 'Robert Johnson', department: 'Maintenance', position: 'Technician' },
  { id: 'emp-004', name: 'Lisa Chen', department: 'Quality', position: 'QA Manager' },
  { id: 'emp-005', name: 'David Rodriguez', department: 'Production', position: 'Line Worker' },
  { id: 'emp-006', name: 'Sarah Williams', department: 'R&D', position: 'Food Scientist' },
  { id: 'emp-007', name: 'Michael Brown', department: 'Production', position: 'Production Manager' },
];

// Helper function to get mock data with a delay to simulate API calls
export const getMockData = <T>(data: T, delay: number = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};
