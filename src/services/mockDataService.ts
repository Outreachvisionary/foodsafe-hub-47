
// Mock data service for generating test data for components

export const getMockComplianceTrendData = () => {
  return [
    { month: 'Jan', compliance: 78 },
    { month: 'Feb', compliance: 82 },
    { month: 'Mar', compliance: 85 },
    { month: 'Apr', compliance: 92 },
    { month: 'May', compliance: 88 },
    { month: 'Jun', compliance: 90 },
  ];
};

export const getMockDocumentWorkflowSteps = () => {
  return [
    { id: '1', name: 'Draft', completed: true, description: 'Initial document creation', approvers: [] },
    { id: '2', name: 'Review', completed: true, description: 'Document review by supervisor', approvers: [] },
    { id: '3', name: 'QA Approval', completed: false, description: 'Quality assurance approval', approvers: [] },
    { id: '4', name: 'Regulatory Approval', completed: false, description: 'Regulatory compliance check', approvers: [] },
    { id: '5', name: 'Publication', completed: false, description: 'Document published for use', approvers: [] },
  ];
};

export const getMockTrainingStatistics = () => {
  return {
    overallComplianceRate: 86,
    departmentCompliance: [
      { department: 'Production', compliance: 92 },
      { department: 'Quality', compliance: 95 },
      { department: 'R&D', compliance: 88 },
      { department: 'Logistics', compliance: 78 },
      { department: 'Admin', compliance: 84 },
    ],
    upcomingTrainings: 12,
    overdueTrainings: 5,
    completedTrainings: 128,
  };
};

// Add the missing getMockCAPAs function
export const getMockCAPAs = () => {
  return [
    {
      id: 'capa-001',
      title: 'Raw Material Quality Issue',
      description: 'Supplier delivered raw materials below quality standards',
      status: 'Open',
      priority: 'High',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'John Doe',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: 'Maria Rodriguez',
      source: 'Supplier_Issue',
      source_reference: 'QC-Check-2023-42',
      completion_date: null,
      root_cause: 'Supplier changed process without notification',
      corrective_action: 'Return materials and request replacement',
      preventive_action: 'Implement supplier pre-shipment testing',
      effectiveness_criteria: 'No quality issues for 3 consecutive shipments',
      effectiveness_rating: null,
      effectiveness_verified: false,
      department: 'Quality Control',
      fsma204_compliant: true,
      relatedDocuments: [],
      relatedTraining: []
    },
    {
      id: 'capa-002',
      title: 'Production Line Contamination',
      description: 'Metal fragments detected in product during inspection',
      status: 'In_Progress',
      priority: 'Critical',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: 'Sarah Johnson',
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: 'Michael Chen',
      source: 'Non_Conformance',
      source_reference: 'NC-2023-15',
      completion_date: null,
      root_cause: 'Worn equipment part causing metal shavings',
      corrective_action: 'Replace affected equipment parts',
      preventive_action: 'Enhance preventive maintenance schedule',
      effectiveness_criteria: 'No metal detection alarms for 1 month',
      effectiveness_rating: null,
      effectiveness_verified: false,
      department: 'Production',
      fsma204_compliant: true,
      relatedDocuments: [],
      relatedTraining: ['TR-527']
    }
  ];
};
