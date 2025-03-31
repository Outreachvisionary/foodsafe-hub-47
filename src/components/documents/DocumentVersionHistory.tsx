
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useDocumentService } from '@/hooks/useDocumentService';
import { Document, DocumentVersion } from '@/types/document';
import { Loader2, FileText, Download, Clock, RefreshCw, Info } from 'lucide-react';
import { format } from 'date-fns';

interface DocumentVersionHistoryProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  document,
  open,
  onOpenChange
}) => {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  
  const { toast } = useToast();
  const documentService = useDocumentService();
  
  useEffect(() => {
    if (open && document) {
      fetchVersions();
    }
  }, [open, document]);
  
  const fetchVersions = async () => {
    if (!document) return;
    
    setIsLoading(true);
    try {
      const fetchedVersions = await documentService.fetchDocumentVersions(document.id);
      setVersions(fetchedVersions);
    } catch (error) {
      console.error('Error fetching document versions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load document versions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadVersion = async (version: DocumentVersion) => {
    try {
      // Construct storage path for this version
      const storagePath = `documents/${document?.id}/${version.file_name}`;
      
      // Get download URL
      const downloadUrl = await documentService.getDownloadUrl(storagePath);
      
      // Open the download URL in a new tab
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error downloading version:', error);
      toast({
        title: 'Error',
        description: 'Failed to download document version',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Document Version History</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading version history...</span>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-lg font-medium">No version history found</p>
              <p className="text-muted-foreground">This document has no previous versions.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {document?.title} - Version History
                </h3>
                <Button size="sm" onClick={fetchVersions}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              
              <div className="border rounded-md">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Version</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Created By</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Created Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">File Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Change Notes</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {versions.map((version) => (
                      <tr key={version.id} className="border-t hover:bg-muted/30">
                        <td className="px-4 py-3">v{version.version}</td>
                        <td className="px-4 py-3">{version.created_by}</td>
                        <td className="px-4 py-3">
                          {version.created_at && format(new Date(version.created_at), 'MMM d, yyyy h:mm a')}
                        </td>
                        <td className="px-4 py-3">{version.file_name}</td>
                        <td className="px-4 py-3">
                          {version.change_notes || <span className="text-muted-foreground italic">No change notes</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDownloadVersion(version)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedVersion(version)}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {selectedVersion && (
                <div className="border rounded-md p-4 mt-4">
                  <h4 className="text-md font-medium mb-3">Version Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Version</p>
                      <p className="font-medium">v{selectedVersion.version}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">File Name</p>
                      <p className="font-medium">{selectedVersion.file_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created By</p>
                      <p className="font-medium">{selectedVersion.created_by}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created Date</p>
                      <p className="font-medium">
                        {selectedVersion.created_at && format(new Date(selectedVersion.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Change Notes</p>
                      <p className="font-medium">{selectedVersion.change_notes || 'No change notes provided'}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" onClick={() => handleDownloadVersion(selectedVersion)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download This Version
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentVersionHistory;
