
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
