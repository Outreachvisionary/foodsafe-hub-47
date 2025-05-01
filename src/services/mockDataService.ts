
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
    { id: '1', name: 'Draft', completed: true, description: 'Initial document creation' },
    { id: '2', name: 'Review', completed: true, description: 'Document review by supervisor' },
    { id: '3', name: 'QA Approval', completed: false, description: 'Quality assurance approval' },
    { id: '4', name: 'Regulatory Approval', completed: false, description: 'Regulatory compliance check' },
    { id: '5', name: 'Publication', completed: false, description: 'Document published for use' },
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
