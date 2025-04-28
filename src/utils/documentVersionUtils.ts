
import { DocumentVersion } from '@/types/document';

export const getMockDocumentVersions = (documentId: string): DocumentVersion[] => {
  return [
    {
      id: "v1",
      document_id: documentId,
      version: 1,
      file_name: "document-v1.docx",
      file_size: 12345,
      created_by: "John Doe",
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      version_type: "major",
      change_summary: "Initial version"
    },
    {
      id: "v2",
      document_id: documentId,
      version: 2,
      file_name: "document-v2.docx",
      file_size: 12450,
      created_by: "Jane Smith",
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      version_type: "minor",
      change_summary: "Fixed typos in section 3"
    },
    {
      id: "v3",
      document_id: documentId,
      version: 3,
      file_name: "document-v3.docx",
      file_size: 13200,
      created_by: "John Doe",
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      version_type: "major",
      change_summary: "Updated process instructions based on new regulations"
    }
  ];
};
