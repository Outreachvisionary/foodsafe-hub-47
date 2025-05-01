
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AlertCircle, File, FileText, Image, Download, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CAPAAttachmentsProps {
  capaId: string;
}

interface Attachment {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  uploaded_by: string;
  file_path: string;
}

const CAPAAttachments: React.FC<CAPAAttachmentsProps> = ({ capaId }) => {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Format bytes to human-readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  };
  
  // Get appropriate icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return <Image className="h-5 w-5" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="h-5 w-5" />;
    } else {
      return <File className="h-5 w-5" />;
    }
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Upload attachment
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }
    
    setUploadLoading(true);
    
    try {
      // TODO: Implement file upload logic with Supabase storage
      // For now, just simulate an upload
      
      setTimeout(() => {
        const newAttachment: Attachment = {
          id: `att-${Date.now()}`,
          file_name: selectedFile.name,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
          uploaded_at: new Date().toISOString(),
          uploaded_by: 'Current User',
          file_path: `/attachments/${capaId}/${selectedFile.name}`,
        };
        
        setAttachments([...attachments, newAttachment]);
        setSelectedFile(null);
        
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        toast({
          title: 'File uploaded',
          description: 'Your file has been uploaded successfully',
        });
        
        setUploadLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your file',
        variant: 'destructive',
      });
      setUploadLoading(false);
    }
  };
  
  // Download attachment
  const handleDownload = (attachment: Attachment) => {
    // TODO: Implement file download logic with Supabase storage
    // For now, just show a toast
    
    toast({
      title: 'Download started',
      description: `Downloading ${attachment.file_name}`,
    });
  };
  
  // Delete attachment
  const handleDelete = (id: string) => {
    // TODO: Implement file deletion logic with Supabase
    // For now, just remove from state
    
    setAttachments(attachments.filter(att => att.id !== id));
    
    toast({
      title: 'File deleted',
      description: 'The file has been removed',
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>CAPA Attachments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload document</Label>
          <div className="flex items-start gap-2">
            <Input
              id="file-upload"
              type="file"
              className="max-w-sm"
              onChange={handleFileChange}
            />
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadLoading}
            >
              {uploadLoading ? (
                <>
                  <span className="animate-spin mr-2">●</span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
          {selectedFile && (
            <p className="text-xs text-muted-foreground">
              Selected: {selectedFile.name} ({formatBytes(selectedFile.size)})
            </p>
          )}
        </div>
        
        {attachments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attachments.map((attachment) => (
                <TableRow key={attachment.id}>
                  <TableCell className="flex items-center space-x-2">
                    {getFileIcon(attachment.file_type)}
                    <span className="text-sm">{attachment.file_name}</span>
                  </TableCell>
                  <TableCell>{attachment.file_type.split('/')[1]?.toUpperCase() || 'UNKNOWN'}</TableCell>
                  <TableCell>{formatBytes(attachment.file_size)}</TableCell>
                  <TableCell>
                    {new Date(attachment.uploaded_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(attachment)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(attachment.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/30 rounded-md border border-dashed">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No attachments found for this CAPA</p>
            <p className="text-xs text-muted-foreground mt-1">
              Upload supporting documents, images, or reports
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPAAttachments;
