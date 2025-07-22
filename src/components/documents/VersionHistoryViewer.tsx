import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  Download, 
  Eye, 
  RotateCcw, 
  Check, 
  ArrowDownToLine, 
  Clock, 
  GitCompare 
} from 'lucide-react';
import { format } from 'date-fns';
import { Document, DocumentVersion } from '@/types/document';
import { useDocument } from '@/contexts/DocumentContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DocumentPreview from './DocumentPreview';

interface VersionHistoryViewerProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VersionHistoryViewer: React.FC<VersionHistoryViewerProps> = ({ 
  document, 
  open,
  onOpenChange 
}) => {
  const { getDocumentVersions, restoreVersion } = useDocument();
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (open && document) {
      loadVersions();
    }
  }, [open, document]);

  const loadVersions = async () => {
    if (!document) return;
    
    setLoading(true);
    try {
      const versionData = await getDocumentVersions(document.id);
      setVersions(versionData);
    } catch (error) {
      console.error('Error loading versions:', error);
      toast.error('Failed to load version history');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVersion = async (version: DocumentVersion) => {
    try {
      const filePath = `${document.created_by}/${document.id}/${version.id}/${version.file_name}`;
      
      const { data, error } = await supabase
        .storage
        .from('documents')
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
      
      if (error) throw error;
      
      // Create an anchor and trigger download
      const link = window.document.createElement('a');
      link.href = data.signedUrl;
      link.download = version.file_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download version');
    }
  };

  const handleRestoreVersion = async (version: DocumentVersion) => {
    try {
      await restoreVersion(document.id, version.id);
      toast.success('Version restored successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Restore error:', error);
      toast.error('Failed to restore version');
    }
  };

  const handlePreview = (version: DocumentVersion) => {
    setSelectedVersion(version);
    setShowPreview(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History
            </DialogTitle>
            <DialogDescription>
              View and manage previous versions of "{document?.title}"
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[400px] rounded-md border p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Modified By</TableHead>
                  <TableHead>Change Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Loading version history...
                    </TableCell>
                  </TableRow>
                ) : versions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No version history available
                    </TableCell>
                  </TableRow>
                ) : (
                  versions.map((version, index) => (
                    <TableRow key={version.id} className={version.version === document.version ? "bg-muted/30" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={version.version_type === 'major' ? 'default' : 'outline'}>
                            v{version.version}
                          </Badge>
                          {version.version === document.version && (
                            <Badge variant="secondary" className="ml-2">Current</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{format(new Date(version.created_at), 'MMM dd, yyyy HH:mm')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {version.created_by}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {version.change_summary || 'No change notes'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handlePreview(version)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDownloadVersion(version)} 
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {version.version !== document.version && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRestoreVersion(version)}
                              title="Restore this version"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedVersion && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Version Preview
              </DialogTitle>
              <DialogDescription>
                Viewing version {selectedVersion.version} of "{document?.title}"
              </DialogDescription>
            </DialogHeader>
            
            <DocumentPreview document={document} versionId={selectedVersion.id} />
            
            <DialogFooter className="gap-2">
              {selectedVersion.version !== document.version && (
                <Button 
                  onClick={() => handleRestoreVersion(selectedVersion)}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Restore This Version
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default VersionHistoryViewer;