
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Trash2, 
  Upload, 
  Download, 
  File, 
  FileImage, 
  FileCode,
  FilePdf,
  FileSpreadsheet,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CAPAAttachment {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  uploaded_by: string;
}

interface CAPAAttachmentsProps {
  capaId: string;
}

const CAPAAttachments: React.FC<CAPAAttachmentsProps> = ({ capaId }) => {
  const [attachments, setAttachments] = useState<CAPAAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        setLoading(true);
        
        // This would be an API call in a real implementation
        // const response = await getAttachments(capaId);
        
        // Mock data for demonstration
        const mockAttachments = [
          {
            id: 'att-1',
            capa_id: capaId,
            filename: 'RootCauseAnalysis.pdf',
            file_type: 'application/pdf',
            file_size: 1254000,
            uploaded_at: new Date().toISOString(),
            uploaded_by: 'John Smith'
          },
          {
            id: 'att-2',
            capa_id: capaId,
            filename: 'CorrectiveActionPlan.docx',
            file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            file_size: 982400,
            uploaded_at: new Date().toISOString(),
            uploaded_by: 'Jane Doe'
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setAttachments(mockAttachments);
          setLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('Error fetching attachments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load attachments',
          variant: 'destructive'
        });
        setLoading(false);
      }
    };
    
    fetchAttachments();
  }, [capaId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    
    try {
      setUploading(true);
      
      // This would be an API call in a real implementation
      // const response = await uploadAttachment(capaId, files[0]);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock attachment for demonstration
      const newAttachment = {
        id: `att-${Date.now()}`,
        capa_id: capaId,
        filename: files[0].name,
        file_type: files[0].type,
        file_size: files[0].size,
        uploaded_at: new Date().toISOString(),
        uploaded_by: 'Current User'
      };
      
      setAttachments(prev => [...prev, newAttachment]);
      
      toast({
        title: 'File uploaded',
        description: 'Your file has been uploaded successfully'
      });
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload the file. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      // This would be an API call in a real implementation
      // await deleteAttachment(attachmentId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from state
      setAttachments(prev => prev.filter(att => att.id !== attachmentId));
      
      toast({
        title: 'File deleted',
        description: 'The file has been deleted successfully'
      });
      
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast({
        title: 'Delete failed',
        description: 'Failed to delete the file',
        variant: 'destructive'
      });
    }
  };

  const handleDownload = (attachment: CAPAAttachment) => {
    // In a real implementation, this would generate a download URL and trigger the download
    toast({
      title: 'Downloading',
      description: `Downloading ${attachment.filename}...`
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes('pdf')) {
      return <FilePdf className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) {
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-5 w-5 text-blue-800" />;
    } else if (fileType.includes('html') || fileType.includes('json') || fileType.includes('xml')) {
      return <FileCode className="h-5 w-5 text-purple-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Attachments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center">
            <Input 
              type="file" 
              className="w-full"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <Button 
              variant="outline"
              size="icon"
              className="ml-2" 
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : attachments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No attachments have been uploaded yet.
            </div>
          ) : (
            <div className="space-y-2">
              {attachments.map(attachment => (
                <div 
                  key={attachment.id}
                  className="flex items-center justify-between p-2 rounded-md border"
                >
                  <div className="flex items-center gap-2">
                    {getFileIcon(attachment.file_type)}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">
                        {attachment.filename}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.file_size)} • Uploaded {new Date(attachment.uploaded_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownload(attachment)}
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteAttachment(attachment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPAAttachments;
