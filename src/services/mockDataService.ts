
// Mock data service for compliance trend data
export const getMockComplianceTrendData = () => {
  return [
    { month: 'Jan', compliance: 85 },
    { month: 'Feb', compliance: 82 },
    { month: 'Mar', compliance: 87 },
    { month: 'Apr', compliance: 91 },
    { month: 'May', compliance: 89 },
    { month: 'Jun', compliance: 93 },
    { month: 'Jul', compliance: 95 }
  ];
};

// Mock data for document workflow steps
export const getMockDocumentWorkflowSteps = () => {
  return [
    {
      id: '1',
      name: 'Initial Review',
      description: 'Initial review by department manager',
      approvers: ['user1', 'user2'],
      status: 'Approved'
    },
    {
      id: '2',
      name: 'Quality Review',
      description: 'Review by quality assurance',
      approvers: ['user3'],
      status: 'Approved'
    },
    {
      id: '3',
      name: 'Final Approval',
      description: 'Final sign-off by leadership',
      approvers: ['user4', 'user5'],
      status: 'Pending'
    }
  ];
};

// Mock training statistics
export const getMockTrainingStatistics = () => {
  return {
    totalTrainingSessions: 156,
    completedTrainingSessions: 132,
    pendingTrainingSessions: 24,
    completionRate: 85,
    expiringCertifications: [
      { name: 'HACCP Certification', employee: 'John Doe', expiryDate: '2023-09-15' },
      { name: 'Food Safety', employee: 'Jane Smith', expiryDate: '2023-09-20' },
      { name: 'GMP Training', employee: 'Robert Johnson', expiryDate: '2023-09-25' }
    ],
    departmentCompliance: [
      { department: 'Production', compliance: 92 },
      { department: 'Quality', compliance: 97 },
      { department: 'Warehouse', compliance: 85 },
      { department: 'Maintenance', compliance: 78 },
      { department: 'R&D', compliance: 90 }
    ]
  };
};
