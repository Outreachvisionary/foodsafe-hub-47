
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { File, Upload, Trash2, Download, FileIcon, FileText } from 'lucide-react';
import { CAPAAttachment } from '@/types/capa';

interface CAPAAttachmentsProps {
  capaId: string;
  attachments: CAPAAttachment[];
  onUpload?: (file: File) => Promise<void>;
  onDelete?: (attachmentId: string) => Promise<void>;
}

const CAPAAttachments: React.FC<CAPAAttachmentsProps> = ({ 
  capaId, 
  attachments = [], 
  onUpload, 
  onDelete 
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  // Handle file upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files.length || !onUpload) return;
    
    const file = files[0];
    setIsUploading(true);
    
    try {
      await onUpload(file);
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
      
      // Reset the input
      event.target.value = '';
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem uploading your file",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle attachment deletion
  const handleDelete = async (attachmentId: string, fileName: string) => {
    if (!onDelete) return;
    
    try {
      await onDelete(attachmentId);
      
      toast({
        title: "File deleted",
        description: `${fileName} has been deleted`,
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: "There was a problem deleting the file",
      });
    }
  };
  
  // Get appropriate icon for file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="h-6 w-6" />;
    } else if (fileType.includes('image')) {
      return <FileIcon className="h-6 w-6" />;
    } else {
      return <File className="h-6 w-6" />;
    }
  };
  
  // Format file size to human-readable
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Attachments</CardTitle>
        <div>
          <Button variant="outline" size="sm" disabled={isUploading} asChild>
            <label htmlFor="file-upload" className="cursor-pointer flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload'}
              <Input 
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {attachments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <File className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-muted-foreground">No attachments yet</p>
            <p className="text-sm text-muted-foreground">
              Upload files to provide additional context for this CAPA
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/5"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(attachment.file_type)}
                  <div>
                    <p className="font-medium">{attachment.filename}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{formatFileSize(attachment.file_size)}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(attachment.uploaded_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a href="#" download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(attachment.id, attachment.filename)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
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
