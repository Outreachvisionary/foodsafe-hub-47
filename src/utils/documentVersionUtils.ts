
import { DocumentVersion } from '@/types/document';

export const getMockDocumentVersions = (documentId: string): DocumentVersion[] => {
  // Mock version history data
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  return [
    {
      id: 'v3',
      document_id: documentId,
      version: 3,
      version_type: "minor",
      file_name: "document_v3.pdf",
      file_path: "/documents/v3.pdf",
      file_size: 1024,
      created_at: now.toISOString(),
      created_by: "John Doe",
      change_summary: "Updated formatting and fixed typos",
      change_notes: "Minor formatting changes",
    },
    {
      id: 'v2',
      document_id: documentId,
      version: 2,
      version_type: "major",
      file_name: "document_v2.pdf",
      file_path: "/documents/v2.pdf",
      file_size: 980,
      created_at: yesterday.toISOString(),
      created_by: "Jane Smith",
      change_summary: "Updated content based on new regulations",
      change_notes: "Major content changes",
    },
    {
      id: 'v1',
      document_id: documentId,
      version: 1,
      version_type: "major",
      file_name: "document_v1.pdf",
      file_path: "/documents/v1.pdf",
      file_size: 950,
      created_at: lastWeek.toISOString(),
      created_by: "Robert Johnson",
      change_summary: "Initial version",
      change_notes: "First version of the document",
    }
  ];
};
