
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

export default {
  fetchDocuments,
  fetchDocumentById,
  fetchCapaActions,
  fetchCapaById,
  fetchTrainingSessions,
  fetchEmployees,
  fetchDepartmentStats
};
