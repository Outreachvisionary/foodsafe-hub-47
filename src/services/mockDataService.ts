// Add this to your existing mockDataService.ts file

// Mock compliance trend data
export function getMockComplianceTrendData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  // Generate last 6 months of data
  const data = [];
  let startValue = 70 + Math.random() * 10;
  
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const randomChange = (Math.random() - 0.3) * 5; // Slightly biased toward improvement
    startValue = Math.min(100, Math.max(50, startValue + randomChange));
    
    data.push({
      month: months[monthIndex],
      compliance: parseFloat(startValue.toFixed(1))
    });
  }
  
  return data;
}

// Mock document workflow steps
export function getMockDocumentWorkflowSteps() {
  return [
    {
      id: '1',
      name: 'Initial Review',
      description: 'Review by department head',
      approvers: ['john.doe', 'jane.smith'],
      status: 'Approved'
    },
    {
      id: '2',
      name: 'Quality Assurance',
      description: 'Review by QA team',
      approvers: ['david.brown'],
      status: 'Approved'
    },
    {
      id: '3',
      name: 'Final Approval',
      description: 'Sign-off by compliance officer',
      approvers: ['susan.white'],
      status: 'Pending'
    }
  ];
}

// Mock training statistics
export function getMockTrainingStatistics() {
  return {
    overallCompliance: 85,
    departmentCompliance: [
      { department: 'Production', completed: 42, total: 50, compliance: 84 },
      { department: 'Quality', completed: 18, total: 20, compliance: 90 },
      { department: 'Warehouse', completed: 15, total: 25, compliance: 60 }
    ],
    expiringCertifications: [
      { name: 'HACCP', employee: 'John Doe', expires: '2024-12-31' },
      { name: 'GMP', employee: 'Jane Smith', expires: '2025-01-15' }
    ],
    upcomingTrainings: [
      { name: 'Food Safety', date: '2024-07-20', participants: 30 },
      { name: 'Equipment Training', date: '2024-08-10', participants: 15 }
    ]
  };
}
