
import { CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating, ComplaintStatus, ComplaintCategory, ComplaintPriority } from '@/types/enums';

export const getMockCAPAs = () => [
  {
    id: "capa-1",
    title: "Process Deviation in Fermentation",
    description: "Temperature exceeded specified range for 2 hours during fermentation process",
    status: CAPAStatus.Open,
    priority: CAPAPriority.High,
    source: CAPASource.NonConformance,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_to: "John Smith",
    created_by: "Quality Manager",
    department: "Production",
    source_id: "NC-2023-0123"
  },
  {
    id: "capa-2",
    title: "Missing Documentation for Raw Materials",
    description: "Certificate of Analysis missing for raw material batch RM-4567",
    status: CAPAStatus.InProgress,
    priority: CAPAPriority.Medium,
    source: CAPASource.Audit,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_to: "Sarah Johnson",
    created_by: "Quality Manager",
    department: "Quality",
    source_id: "AUDIT-2023-0045"
  },
  {
    id: "capa-3",
    title: "Foreign Material in Product",
    description: "Metal fragments found in finished product batch FP-2023-789",
    status: CAPAStatus.Completed,
    priority: CAPAPriority.Critical,
    source: CAPASource.CustomerComplaint,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    due_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    completion_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_to: "Robert Garcia",
    created_by: "QA Director",
    department: "Production",
    source_id: "COMP-2023-0022"
  }
];

export const getMockComplaints = () => [
  {
    id: "comp-1",
    title: "Foreign object in product",
    description: "Customer found plastic fragment in product",
    category: ComplaintCategory.ForeignMaterial,
    status: ComplaintStatus.Under_Investigation,
    priority: ComplaintPriority.High,
    reported_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "Customer Service",
    customer_name: "ABC Foods Inc.",
    customer_contact: "contact@abcfoods.com",
    product_involved: "Cereal Product Batch #45678",
    lot_number: "LOT-2023-45678"
  },
  {
    id: "comp-2",
    title: "Incorrect labeling on package",
    description: "Product labeled as gluten-free but contains wheat",
    category: ComplaintCategory.Labeling,
    status: ComplaintStatus.New,
    priority: ComplaintPriority.Critical,
    reported_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "Customer Service",
    customer_name: "Health Foods Store",
    customer_contact: "manager@healthfoods.com",
    product_involved: "Cookies Batch #78945",
    lot_number: "LOT-2023-78945"
  }
];

// Add the missing mock data functions
export const getMockComplianceTrendData = () => {
  return [
    { month: "Jan", compliance: 85 },
    { month: "Feb", compliance: 82 },
    { month: "Mar", compliance: 87 },
    { month: "Apr", compliance: 84 },
    { month: "May", compliance: 89 },
    { month: "Jun", compliance: 91 },
    { month: "Jul", compliance: 94 },
    { month: "Aug", compliance: 92 },
    { month: "Sep", compliance: 95 },
    { month: "Oct", compliance: 96 },
    { month: "Nov", compliance: 97 },
    { month: "Dec", compliance: 98 }
  ];
};

export const getMockDocumentWorkflowSteps = () => {
  return [
    {
      id: "step1",
      name: "Initial Review",
      description: "Review by department manager",
      approvers: ["John Doe"],
      status: "Approved"
    },
    {
      id: "step2",
      name: "QA Approval",
      description: "Quality Assurance approval",
      approvers: ["Jane Smith"],
      status: "Approved"
    },
    {
      id: "step3",
      name: "Final Approval",
      description: "Approval by Quality Director",
      approvers: ["Robert Johnson"],
      status: "Pending"
    }
  ];
};

export const getMockTrainingStatistics = () => {
  return {
    totalTrainings: 145,
    completedTrainings: 112,
    overdueTrainings: 18,
    upcomingTrainings: 15,
    departmentCompliance: [
      { department: "Production", compliance: 87 },
      { department: "Quality", compliance: 94 },
      { department: "Warehouse", compliance: 78 },
      { department: "Maintenance", compliance: 81 },
      { department: "R&D", compliance: 91 }
    ],
    courseCompletionRate: 77,
    trainingsByCategory: {
      "Food Safety": 45,
      "GMP": 32,
      "HACCP": 28,
      "Equipment": 25,
      "Other": 15
    }
  };
};
