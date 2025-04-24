
// Mock document service implementation

import { Document, DocumentCategory, DocumentStatus } from '@/types/document';

let mockDocuments: Document[] = [
  {
    id: '1',
    title: 'HACCP Plan',
    description: 'Company HACCP Plan and procedures',
    file_name: 'haccp_plan.pdf',
    file_size: 1024 * 1024,
    file_type: 'application/pdf',
    category: 'HACCP Plan',
    status: 'Active',
    version: 1,
    created_by: 'admin',
    created_at: '2023-07-01T00:00:00.000Z',
    updated_at: '2023-07-01T00:00:00.000Z',
    folder_id: '/',
    expiry_date: '2024-07-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'SOP - Sanitation',
    description: 'Standard Operating Procedure for Sanitation',
    file_name: 'sanitation_sop.docx',
    file_size: 512 * 1024,
    file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'SOP',
    status: 'Active',
    version: 2,
    created_by: 'admin',
    created_at: '2023-06-15T00:00:00.000Z',
    updated_at: '2023-06-15T00:00:00.000Z',
    folder_id: '/',
    expiry_date: '2024-06-15T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Audit Report - Q2 2023',
    description: 'Quarterly audit findings and corrective actions',
    file_name: 'q2_audit.pdf',
    file_size: 2 * 1024 * 1024,
    file_type: 'application/pdf',
    category: 'Audit Report',
    status: 'Pending Review',
    version: 1,
    created_by: 'auditor',
    created_at: '2023-07-15T00:00:00.000Z',
    updated_at: '2023-07-15T00:00:00.000Z',
    folder_id: '/',
    expiry_date: '2024-07-15T00:00:00.000Z',
  }
];

export const fetchDocuments = async (): Promise<Document[]> => {
  return [...mockDocuments];
};

export const fetchDocument = async (id: string): Promise<Document | undefined> => {
  return mockDocuments.find(doc => doc.id === id);
};

export const createDocument = async (document: any): Promise<Document> => {
  const newDoc = {
    ...document,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockDocuments.push(newDoc);
  return newDoc;
};

export const updateDocument = async (document: any): Promise<Document> => {
  const index = mockDocuments.findIndex(doc => doc.id === document.id);
  if (index === -1) {
    throw new Error(`Document with ID ${document.id} not found`);
  }
  
  mockDocuments[index] = {
    ...mockDocuments[index],
    ...document,
    updated_at: new Date().toISOString(),
  };
  
  return mockDocuments[index];
};

export const deleteDocument = async (id: string): Promise<void> => {
  const index = mockDocuments.findIndex(doc => doc.id === id);
  if (index === -1) {
    throw new Error(`Document with ID ${id} not found`);
  }
  
  mockDocuments.splice(index, 1);
};

export default {
  fetchDocuments,
  fetchDocument,
  createDocument,
  updateDocument,
  deleteDocument
};
