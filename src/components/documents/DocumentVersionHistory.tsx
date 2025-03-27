import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Document, DocumentVersion } from '@/types/document';
import { CalendarClock, Download, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import enhancedDocumentService from '@/services/documentService';

interface DocumentVersionHistoryProps {
  document: Document;
  onRevertVersion: (updatedDoc: Document, version: DocumentVersion) => void;
}

const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  document,
  onRevertVersion
}) => {
  const { toast } = useToast();

  // Mock document versions for demonstration - updated with new fields
  const mockVersions: DocumentVersion[] = [
    {
      id: 'version-1',
      document_id: document.id,
      version: 1,
      version_number: 1,
      file_name: document.file_name,
      file_size: document.file_size,
      file_type: document.file_type,
      created_by: 'John Doe',
      created_at: '2023-01-01T12:00:00Z',
      change_summary: 'Initial version',
      storage_path: '/path/to/version-1',
      organization_id: document.organization_id,
      facility_id: document.facility_id
    },
    {
      id: 'version-2',
      document_id: document.id,
      version: 2,
      version_number: 2,
      file_name: document.file_name,
      file_size: document.file_size,
      file_type: document.file_type,
      created_by: 'Jane Smith',
      created_at: '2023-02-15T14:30:00Z',
      change_summary: 'Updated content and formatting',
      storage_path: '/path/to/version-2',
      organization_id: document.organization_id,
      facility_id: document.facility_id
    },
    {
      id: 'version-3',
      document_id: document.id,
      version: 3,
      version_number: 3,
      file_name: document.file_name,
      file_size: document.file_size,
      file_type: document.file_type,
      created_by: 'John Doe',
      created_at: '2023-03-22T16:45:00Z',
      change_summary: 'Added new section on safety guidelines',
      storage_path: '/path/to/version-3',
      organization_id: document.organization_id,
      facility_id: document.facility_id
    }
  ];

  const handleRevert = (version: DocumentVersion) => {
    // In a real application, you would call an API to revert to the selected version
    // and update the document state accordingly.
    
    // For this example, we'll just simulate the revert by updating the document's
    // version and displaying a success message.
    
    const updatedDoc = {
      ...document,
      version: version.version_number || 1,
      updated_at: new Date().toISOString()
    };
    
    onRevertVersion(updatedDoc, version);
  };

  const handleDownloadVersion = async (version: DocumentVersion) => {
    try {
      // Get actual download URL from storage
      const storagePath = version.storage_path || `${document.id}/${version.file_name}_v${version.version_number}`;
      
      // Get the download URL from storage
      const downloadUrl = await enhancedDocumentService.getDownloadUrl(storagePath);
      
      // Create a temporary anchor element to trigger download
      const link = window.document.createElement('a');
      link.href = downloadUrl;
      link.download = version.file_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: `${version.file_name} is downloading`,
      });
    } catch (error) {
      console.error('Error downloading version:', error);
      toast({
        title: "Error",
        description: "Could not download the document version",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Changes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockVersions.map((version) => (
              <TableRow key={version.id}>
                <TableCell>{version.version_number}</TableCell>
                <TableCell>
                  {version.created_at ? new Date(version.created_at).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>{version.created_by}</TableCell>
                <TableCell>{version.change_summary}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDownloadVersion(version)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRevert(version)}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Revert to
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DocumentVersionHistory;
