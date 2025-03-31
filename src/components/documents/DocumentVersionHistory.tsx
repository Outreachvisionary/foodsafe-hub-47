import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon, Download, FileText, Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Document, DocumentVersion } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import enhancedDocumentService from '@/services/enhancedDocumentService';

interface DocumentVersionHistoryProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  document,
  open,
  onOpenChange,
}) => {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadingVersion, setDownloadingVersion] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && document) {
      loadVersions();
    }
  }, [open, document]);

  const loadVersions = async () => {
    if (!document) return;
    
    setLoading(true);
    try {
      const fetchedVersions = await enhancedDocumentService.fetchDocumentVersions(document.id);
      setVersions(fetchedVersions);
    } catch (error) {
      console.error('Error loading document versions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load document version history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVersion = async (version: DocumentVersion) => {
    if (!document) return;
    
    try {
      setDownloadingVersion(version.id);
    
      // Construct the version file path
      const versionFilePath = `documents/${document.id}/versions/${version.version}/${version.file_name}`;
    
      // Get download URL using enhanced service
      const downloadUrl = await enhancedDocumentService.getDownloadUrl(versionFilePath);
    
      // Create anchor and trigger download
      const a = window.document.createElement('a');
      a.href = downloadUrl;
      a.download = version.file_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
    
      // Record activity
      await enhancedDocumentService.createDocumentActivity({
        document_id: document.id,
        action: 'download_version',
        user_id: 'current-user', // Replace with actual user ID
        user_name: 'Current User', // Replace with actual user name
        user_role: 'User', // Replace with actual user role
        comments: `Downloaded version ${version.version}`
      });
    } catch (error) {
      console.error('Error downloading version:', error);
      toast({
        title: 'Error',
        description: 'Failed to download document version',
        variant: 'destructive',
      });
    } finally {
      setDownloadingVersion(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Version History
          </DialogTitle>
          <DialogDescription>
            View and download previous versions of this document.
          </DialogDescription>
        </DialogHeader>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Change Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                  Loading versions...
                </TableCell>
              </TableRow>
            ) : versions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No version history available for this document.
                </TableCell>
              </TableRow>
            ) : (
              versions.map((version) => (
                <TableRow key={version.id}>
                  <TableCell className="font-medium">{version.version}</TableCell>
                  <TableCell>
                    {version.created_at ? format(new Date(version.created_at), 'PPP p') : 'Unknown'}
                  </TableCell>
                  <TableCell>{version.created_by}</TableCell>
                  <TableCell>{version.change_notes || 'No notes provided.'}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadVersion(version)}
                      disabled={downloadingVersion === version.id}
                    >
                      {downloadingVersion === version.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentVersionHistory;
