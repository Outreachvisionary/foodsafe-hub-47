
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Edit, Eye } from 'lucide-react';
import { Document } from '@/types/document';
import { documentService } from '@/services/documentService';

interface DocumentPreviewDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (document: Document) => void;
  onDownload?: (document: Document) => void;
}

const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({
  document,
  open,
  onOpenChange,
  onEdit,
  onDownload
}) => {
  if (!document) return null;

  const handleDownload = () => {
    if (onDownload) {
      onDownload(document);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(document);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {document.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Document Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Category</label>
              <Badge variant="outline">{document.category}</Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Status</label>
              <Badge variant="outline">{document.status}</Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Version</label>
              <p className="text-sm">v{document.version}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">File Size</label>
              <p className="text-sm">{Math.round(document.file_size / 1024)} KB</p>
            </div>
          </div>

          {/* Description */}
          {document.description && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                {document.description}
              </p>
            </div>
          )}

          {/* File Preview Placeholder */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-gray-500">
              <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Document Preview</p>
              <p className="text-sm">
                {document.file_name}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                File preview functionality will be implemented based on file type
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
