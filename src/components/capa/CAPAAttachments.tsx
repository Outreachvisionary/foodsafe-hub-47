
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, FileText, Download, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Attachment {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  uploaded_by: string;
}

interface CAPAAttachmentsProps {
  capaId: string;
}

const CAPAAttachments: React.FC<CAPAAttachmentsProps> = ({ capaId }) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAttachments();
  }, [capaId]);

  const fetchAttachments = async () => {
    try {
      setLoading(true);
      // Mock data for now
      setTimeout(() => {
        setAttachments([
          {
            id: '1',
            file_name: 'root-cause-analysis.pdf',
            file_type: 'application/pdf',
            file_size: 1240000,
            uploaded_at: new Date().toISOString(),
            uploaded_by: 'John Doe'
          },
          {
            id: '2',
            file_name: 'corrective-action-plan.docx',
            file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            file_size: 840000,
            uploaded_at: new Date().toISOString(),
            uploaded_by: 'Jane Smith'
          }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching attachments:', error);
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Mock upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAttachment: Attachment = {
        id: Date.now().toString(),
        file_name: files[0].name,
        file_type: files[0].type,
        file_size: files[0].size,
        uploaded_at: new Date().toISOString(),
        uploaded_by: 'Current User'
      };
      
      setAttachments(prev => [...prev, newAttachment]);
      
      toast({
        title: 'Upload Successful',
        description: `${files[0].name} has been uploaded.`
      });
      
      // Reset the input
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading your file.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Paperclip className="h-5 w-5 mr-2" />
          Attachments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={handleFileChange}
            />
            <label 
              htmlFor="file-upload" 
              className="flex-1"
            >
              <Button 
                variant="outline" 
                className="w-full cursor-pointer" 
                disabled={isUploading}
                asChild
              >
                <span>
                  {isUploading ? (
                    <>Uploading...</>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </>
                  )}
                </span>
              </Button>
            </label>
          </div>
          
          {loading ? (
            <p className="text-center py-4 text-muted-foreground">Loading attachments...</p>
          ) : attachments.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No attachments found.</p>
          ) : (
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div 
                  key={attachment.id} 
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{attachment.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.file_size)} • Uploaded by {attachment.uploaded_by}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
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
