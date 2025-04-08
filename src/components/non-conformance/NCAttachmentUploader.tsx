
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { fetchNCAttachments, uploadNCAttachment } from '@/services/nonConformanceService';
import { Paperclip, Upload, X, FileText, Download, AlertCircle } from 'lucide-react';
import { NCAttachment } from '@/types/non-conformance';
import { useFileUpload } from '@/hooks/use-file-upload';

interface NCAttachmentUploaderProps {
  nonConformanceId: string;
  onSuccess?: () => void;
}

const NCAttachmentUploader: React.FC<NCAttachmentUploaderProps> = ({ 
  nonConformanceId, 
  onSuccess 
}) => {
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState<NCAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const { 
    file, 
    handleFileChange, 
    clearFile, 
    error: fileError 
  } = useFileUpload({
    maxSizeMB: 15, // 15MB maximum file size
    allowedTypes: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', // Images
      'application/pdf', // PDFs
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word docs
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel
      'text/plain', 'text/csv' // Text files
    ]
  });

  useEffect(() => {
    const loadAttachments = async () => {
      try {
        setLoading(true);
        const data = await fetchNCAttachments(nonConformanceId);
        setAttachments(data);
      } catch (error) {
        console.error('Error loading attachments:', error);
        toast({
          title: 'Failed to load attachments',
          description: 'There was an error fetching the attachments.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadAttachments();
  }, [nonConformanceId, toast]);

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const newAttachment = await uploadNCAttachment(
        nonConformanceId,
        file,
        description,
        'current-user' // This should be the actual user ID in a real app
      );

      // Add the new attachment to the list
      setAttachments(prev => [newAttachment, ...prev]);

      toast({
        title: 'File uploaded',
        description: 'The file has been successfully uploaded.',
      });

      // Reset form
      clearFile();
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Trigger success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading the file.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (attachment: NCAttachment) => {
    try {
      // Simply use the file_path which should now be a full URL
      const downloadUrl = attachment.file_path;
      
      // Create an anchor element and trigger download
      const link = window.document.createElement('a');
      link.href = downloadUrl;
      link.download = attachment.file_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `Downloading ${attachment.file_name}`,
      });
    } catch (error) {
      console.error('Error downloading attachment:', error);
      toast({
        title: "Download failed",
        description: "Could not download the attachment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Upload Attachment</h3>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">File</Label>
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="flex-1"
            />
            {file && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFile}
                className="text-gray-500"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {fileError && (
            <div className="text-red-500 text-sm flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {fileError}
            </div>
          )}
          <p className="text-xs text-gray-500">
            Maximum file size: 15MB. Allowed formats: Images, PDF, Office documents, and text files.
          </p>
        </div>

        {file && (
          <div className="space-y-2">
            <Label htmlFor="attachment-description">Description</Label>
            <Textarea
              id="attachment-description"
              placeholder="Add a description for this attachment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        )}

        {file && (
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </>
            )}
          </Button>
        )}
      </div>

      {!file && (
        <div 
          className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Click to select a file</p>
          <p className="text-xs text-gray-400 mt-1">
            Upload documents, images, or other files related to this non-conformance.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      ) : attachments.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Uploaded Attachments</h3>
          <div className="space-y-2">
            {attachments.map(attachment => (
              <div key={attachment.id} className="flex items-center p-2 bg-gray-50 rounded-md">
                <FileText className="h-4 w-4 text-gray-500 mr-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{attachment.file_name}</p>
                  {attachment.description && (
                    <p className="text-xs text-gray-500 truncate">{attachment.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(attachment)}
                  className="text-gray-500 mr-2"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <span className="text-xs text-gray-500">
                  {new Date(attachment.uploaded_at || '').toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NCAttachmentUploader;
