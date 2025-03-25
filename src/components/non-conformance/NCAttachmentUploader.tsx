
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { uploadNCAttachment } from '@/services/nonConformance';
import { Paperclip, Upload, X } from 'lucide-react';

interface NCAttachmentUploaderProps {
  nonConformanceId: string;
  onSuccess: () => void;
}

const NCAttachmentUploader: React.FC<NCAttachmentUploaderProps> = ({ 
  nonConformanceId, 
  onSuccess 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      await uploadNCAttachment(
        nonConformanceId,
        file,
        description,
        'current-user' // This should be the actual user ID in a real app
      );

      toast({
        title: 'File uploaded',
        description: 'The file has been successfully uploaded.',
      });

      // Reset form
      setFile(null);
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Trigger success callback
      onSuccess();
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
    </div>
  );
};

export default NCAttachmentUploader;
