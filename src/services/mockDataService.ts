
import { getMockData, mockDocuments, mockCapaActions, mockTrainingSessions, mockDepartmentStats, mockEmployees } from '@/data/mockData';
import { Document, DocumentStatus } from '@/types/document';
import { CAPA, CAPAStatus } from '@/types/capa';
import { TrainingSession, TrainingCompletionStatus } from '@/types/training';

/**
 * Mock document service methods
 */
export const fetchDocuments = async (filter?: any): Promise<Document[]> => {
  let filteredDocs = [...mockDocuments];
  
  if (filter?.status) {
    filteredDocs = filteredDocs.filter(doc => doc.status === filter.status);
  }
  
  if (filter?.category) {
    filteredDocs = filteredDocs.filter(doc => doc.category === filter.category);
  }
  
  return getMockData(filteredDocs);
};

export const fetchDocumentById = async (id: string): Promise<Document | null> => {
  const document = mockDocuments.find(doc => doc.id === id) || null;
  return getMockData(document);
};

/**
 * Mock CAPA service methods
 */
export const fetchCapaActions = async (filter?: any): Promise<CAPA[]> => {
  let filteredCapas = [...mockCapaActions];
  
  if (filter?.status) {
    filteredCapas = filteredCapas.filter(capa => capa.status === filter.status);
  }
  
  if (filter?.priority) {
    filteredCapas = filteredCapas.filter(capa => capa.priority === filter.priority);
  }
  
  return getMockData(filteredCapas);
};

export const fetchCapaById = async (id: string): Promise<CAPA | null> => {
  const capa = mockCapaActions.find(c => c.id === id) || null;
  return getMockData(capa);
};

/**
 * Mock Training service methods
 */
export const fetchTrainingSessions = async (filter?: any): Promise<TrainingSession[]> => {
  let filteredSessions = [...mockTrainingSessions];
  
  if (filter?.status) {
    filteredSessions = filteredSessions.filter(session => session.completion_status === filter.status);
  }
  
  if (filter?.department) {
    filteredSessions = filteredSessions.filter(session => session.department === filter.department);
  }
  
  return getMockData(filteredSessions);
};

export const fetchEmployees = async (departmentFilter?: string): Promise<typeof mockEmployees> => {
  let filteredEmployees = [...mockEmployees];
  
  if (departmentFilter) {
    filteredEmployees = filteredEmployees.filter(emp => emp.department === departmentFilter);
  }
  
  return getMockData(filteredEmployees);
};

/**
 * Mock Department Statistics
 */
export const fetchDepartmentStats = async (): Promise<typeof mockDepartmentStats> => {
  return getMockData(mockDepartmentStats);
};

/**
 * Mock Compliance Trend Data
 */
export const getMockComplianceTrendData = async () => {
  const trendData = [
    { month: 'Jan', compliance: 85 },
    { month: 'Feb', compliance: 82 },
    { month: 'Mar', compliance: 88 },
    { month: 'Apr', compliance: 90 },
    { month: 'May', compliance: 92 },
    { month: 'Jun', compliance: 89 }
  ];
  return getMockData(trendData);
};

/**
 * Mock Training Stats
 */
export const getMockTrainingStats = async () => {
  const trainingStats = {
    overallCompliance: 87,
    departmentCompliance: [
      { department: 'Production', completed: 45, total: 50, compliance: 90 },
      { department: 'Quality', completed: 38, total: 40, compliance: 95 },
      { department: 'Maintenance', completed: 18, total: 25, compliance: 72 }
    ],
    expiringCertifications: [
      { name: 'HACCP Certification', employee: 'John Smith', expires: '2023-06-15' },
      { name: 'GMP Training', employee: 'Jane Doe', expires: '2023-06-20' },
      { name: 'Food Safety', employee: 'Robert Johnson', expires: '2023-06-25' }
    ],
    upcomingTrainings: [
      { title: 'Allergen Management', date: '2023-06-10', attendees: 12 },
      { title: 'Crisis Management', date: '2023-06-15', attendees: 8 },
      { title: 'New Equipment Training', date: '2023-06-18', attendees: 5 }
    ]
  };
  return getMockData(trainingStats);
};

/**
 * Mock Document Workflow Steps
 */
export const getMockDocumentWorkflowSteps = async () => {
  const workflowSteps = [
    {
      id: '1',
      name: 'Initial Review',
      description: 'Document is reviewed by department head',
      approvers: ['dept_head'],
      requiredApprovals: 1
    },
    {
      id: '2',
      name: 'Quality Approval',
      description: 'Document is reviewed by quality team',
      approvers: ['quality_manager'],
      requiredApprovals: 1
    },
    {
      id: '3', 
      name: 'Final Approval',
      description: 'Document is approved by senior management',
      approvers: ['senior_management'],
      requiredApprovals: 1
    }
  ];
  return getMockData(workflowSteps);
};

export default {
  fetchDocuments,
  fetchDocumentById,
  fetchCapaActions,
  fetchCapaById,
  fetchTrainingSessions,
  fetchEmployees,
  fetchDepartmentStats,
  getMockComplianceTrendData,
  getMockTrainingStats,
  getMockDocumentWorkflowSteps
};
