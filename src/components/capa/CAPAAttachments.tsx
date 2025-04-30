
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download, Trash2, Plus } from 'lucide-react';

interface CAPAAttachment {
  id: string;
  filename: string;
  filesize: number;
  uploaded_at: string;
  uploaded_by: string;
}

interface CAPAAttachmentsProps {
  capaId: string;
  attachments?: CAPAAttachment[];
  loading?: boolean;
  onUpload?: () => void;
  onDownload?: (attachmentId: string) => void;
  onDelete?: (attachmentId: string) => void;
}

const CAPAAttachments: React.FC<CAPAAttachmentsProps> = ({
  capaId,
  attachments = [],
  loading = false,
  onUpload,
  onDownload,
  onDelete
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-base">Attachments</CardTitle>
        <Button variant="outline" size="sm" onClick={onUpload}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            Loading attachments...
          </div>
        ) : attachments.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No attachments yet. Add documents related to this CAPA.
          </div>
        ) : (
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-2 border rounded-md bg-gray-50"
              >
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">{attachment.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.filesize)} • Uploaded by{" "}
                      {attachment.uploaded_by} on{" "}
                      {new Date(attachment.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => onDownload?.(attachment.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete?.(attachment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPAAttachments;
