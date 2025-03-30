
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, File, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentCategory, DocumentStatus } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';
import documentService from '@/services/documentService';

interface DocumentUploaderProps {
  onUploadComplete?: (document: Document) => void;
  category?: DocumentCategory;
  allowedTypes?: string[];
  maxSize?: number; // In MB
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onUploadComplete,
  category = 'Other',
  allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.xls', '.xlsx', '.ppt', '.pptx'],
  maxSize = 10, // Default 10MB
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size
      if (selectedFile.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `Maximum file size is ${maxSize}MB`,
          variant: "destructive"
        });
        return;
      }
      
      // Check file type
      const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: `Allowed file types: ${allowedTypes.join(', ')}`,
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const uploadDocument = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to upload documents",
          variant: "destructive"
        });
        setIsUploading(false);
        return;
      }
      
      // Generate unique ID for the document
      const documentId = uuidv4();
      
      // Upload file to Supabase Storage
      const fileName = `${documentId}_${file.name}`;
      const filePath = `documents/${documentId}/${fileName}`;
      
      // Use upload without progress tracking
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Create document record in database
      const newDocument: Partial<Document> = {
        id: documentId,
        title: file.name.split('.').slice(0, -1).join('.'), // Remove extension from filename
        file_name: fileName,
        file_size: file.size,
        file_type: file.type,
        category: category,
        status: 'Draft' as DocumentStatus,
        version: 1,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Use the documentService to create the document
      const documentData = await documentService.createDocument(newDocument);
      
      // Create initial version record
      const versionData = {
        document_id: documentId,
        file_name: fileName,
        file_size: file.size,
        file_type: file.type,
        created_by: user.id,
        version: 1,
        editor_metadata: { 
          upload_source: 'web',
          original_filename: file.name
        }
      };
      
      // Use documentService to create the version
      const versionResponse = await documentService.createDocumentVersion(versionData);
      
      // Update document with version ID
      await documentService.updateDocument(documentId, { 
        current_version_id: versionResponse.id 
      });
      
      // Record activity
      await documentService.createDocumentActivity({
        document_id: documentId,
        action: 'create',
        user_id: user.id,
        user_name: user.email || 'Unknown user',
        user_role: 'User', // Would be populated from user profile in a real app
        comments: 'Document created through file upload'
      });
      
      toast({
        title: "Upload successful",
        description: "Document has been uploaded successfully.",
      });
      
      if (onUploadComplete) {
        onUploadComplete(documentData);
      }
      
      // Reset state
      setFile(null);
      
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your document.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Add a function to simulate upload progress
  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress > 100) {
        clearInterval(interval);
      } else {
        setUploadProgress(progress);
      }
    }, 200);
    
    return () => clearInterval(interval);
  };

  return (
    <div className="p-4 bg-white rounded-md">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="document-upload">Upload Document</Label>
          <Input 
            id="document-upload"
            type="file"
            onChange={handleFileChange}
            disabled={isUploading || !!file}
            className="cursor-pointer"
          />
          {!file && (
            <p className="text-sm text-gray-500">
              Allowed file types: {allowedTypes.join(', ')} (Max size: {maxSize}MB)
            </p>
          )}
        </div>
        
        {file && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <File className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              {!isUploading && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleRemoveFile}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {isUploading && (
              <div className="mt-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}
          </div>
        )}
        
        <Button
          onClick={uploadDocument}
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploader;
