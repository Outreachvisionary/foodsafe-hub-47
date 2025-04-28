// Mock data for documents
export const mockDocuments = [
  {
    id: '1',
    title: 'Quality Manual',
    description: 'Main quality management system documentation',
    status: 'Published',
    category: 'Policy',
    version: 2,
    file_name: 'quality_manual_v2.pdf',
    file_size: 1024 * 1024,
    file_type: 'application/pdf',
    created_at: new Date().toISOString(),
    created_by: 'John Doe',
    checkout_status: 'Available'
  },
  {
    id: '2',
    title: 'Sanitation SOP',
    description: 'Standard operating procedure for sanitation',
    status: 'Draft',
    category: 'SOP',
    version: 1,
    file_name: 'sanitation_sop.docx',
    file_size: 512 * 1024,
    file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    created_at: new Date().toISOString(),
    created_by: 'Maria Garcia',
    checkout_status: 'Available'
  }
];

// Mock data for training sessions
export const mockTrainingSessions = [
  {
    id: '1',
    title: 'HACCP Training',
    description: 'Basic HACCP principles and application',
    training_type: 'classroom',
    training_category: 'food-safety',
    department: 'Production',
    start_date: new Date().toISOString(),
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    completion_status: 'Not Started',
    is_recurring: true,
    recurring_interval: 'annually',
    assigned_to: ['user1', 'user2'],
    required_roles: ['Production Staff'],
    materials_id: ['mat-001', 'mat-002'],
    created_by: 'admin'
  },
  {
    id: '2',
    title: 'GMP Refresher',
    description: 'Good Manufacturing Practices refresher course',
    training_type: 'online',
    training_category: 'gmp',
    department: 'All Departments',
    start_date: new Date().toISOString(),
    due_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    completion_status: 'In Progress',
    is_recurring: true,
    recurring_interval: 'bi-annually',
    assigned_to: ['user3', 'user4'],
    required_roles: ['All Staff'],
    materials_id: ['mat-003'],
    created_by: 'admin'
  }
];

// Mock data for CAPAs
export const mockCAPAs = [
  {
    id: '1',
    title: 'Raw Material Quality Issue',
    description: 'Supplier delivered raw materials below quality standards',
    status: 'Open',
    priority: 'High',
    createdAt: new Date().toISOString(),
    createdBy: 'John Doe',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Maria Rodriguez',
    source: 'Supplier_Issue',
    sourceId: 'SUP-001',
    sourceReference: 'QC-Check-2023-42',
    completionDate: undefined,
    rootCause: 'Supplier changed process without notification',
    correctiveAction: 'Return materials and request replacement',
    preventiveAction: 'Implement supplier pre-shipment testing',
    effectivenessCriteria: 'No quality issues for 3 consecutive shipments',
    effectivenessRating: undefined,
    effectivenessVerified: false,
    department: 'Quality Control',
    fsma204Compliant: true,
    // Fix for relatedDocuments and relatedTraining
    relatedDocuments: [
      "doc-001",
      "doc-002",
      "doc-003"
    ],
    relatedTraining: [
      "tr-001",
      "tr-002"
    ]
  },
  {
    id: '2',
    title: 'Production Line Contamination',
    description: 'Metal fragments detected in product during inspection',
    status: 'In_Progress',
    priority: 'Critical',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'Sarah Johnson',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Michael Chen',
    source: 'Non_Conformance',
    sourceId: 'NC-2023-15',
    sourceReference: 'NC-2023-15',
    rootCause: 'Worn equipment part causing metal shavings',
    correctiveAction: 'Replace affected equipment parts',
    preventiveAction: 'Enhance preventive maintenance schedule',
    effectivenessCriteria: 'No metal detection alarms for 1 month',
    department: 'Production',
    fsma204Compliant: true,
    relatedDocuments: [],
    relatedTraining: ['TR-527']
  }
];

// Mock data for related documents
export const mockRelatedDocuments = [
  {
    id: 'doc-001',
    documentId: '1',
    documentName: 'HACCP Plan',
    documentType: 'Plan'
  },
  {
    id: 'doc-002',
    documentId: '2',
    documentName: 'Supplier Agreement',
    documentType: 'Agreement'
  },
  {
    id: 'doc-003',
    documentId: '3',
    documentName: 'Equipment Maintenance Log',
    documentType: 'Log'
  }
];

// Mock data for related training
export const mockRelatedTraining = [
  {
    id: 'tr-001',
    trainingId: '1',
    trainingName: 'HACCP Principles',
    trainingType: 'Classroom'
  },
  {
    id: 'tr-002',
    trainingId: '2',
    trainingName: 'Food Safety Basics',
    trainingType: 'Online'
  }
];
