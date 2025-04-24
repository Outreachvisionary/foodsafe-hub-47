
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Document, DocumentVersion } from '@/types/document';
import { format } from 'date-fns';
import { useDocumentService } from '@/hooks/useDocumentService';
import { Button } from '@/components/ui/button';
import { Download, RotateCcw } from 'lucide-react';

interface DocumentVersionHistoryProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  document,
  open,
  onOpenChange,
}) => {
  const { fetchDocumentVersions, restoreVersion, downloadVersion } = useDocumentService();
  const [versions, setVersions] = React.useState<DocumentVersion[]>([]);

  React.useEffect(() => {
    if (open && document.id) {
      fetchDocumentVersions(document.id).then(setVersions);
    }
  }, [open, document.id, fetchDocumentVersions]);

  const handleRestore = async (version: DocumentVersion) => {
    try {
      await restoreVersion(document.id, version.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Error restoring version:', error);
    }
  };

  const handleDownload = async (version: DocumentVersion) => {
    try {
      await downloadVersion(version.id);
    } catch (error) {
      console.error('Error downloading version:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[500px] overflow-y-auto mt-4">
          <div className="space-y-4">
            {versions.map((version) => (
              <div
                key={version.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="font-medium">
                    Version {version.version_number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(version.created_at), 'PPpp')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Modified by {version.modified_by_name}
                  </div>
                  {version.check_in_comment && (
                    <div className="mt-2 text-sm">{version.check_in_comment}</div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(version)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestore(version)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Add default export to fix import issues
export default DocumentVersionHistory;
