
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, File, X, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentCategory, DocumentStatus } from '@/types/database';
import { v4 as uuidv4 } from 'uuid';
import documentService from '@/services/documentService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface DocumentUploaderProps {
  onUploadComplete?: (document: Document) => void;
  category?: DocumentCategory;
  allowedTypes?: string[];
  maxSize?: number; // In MB
  onSuccess?: () => void;
  onCancel?: () => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onUploadComplete,
  category = 'Other',
  allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.xls', '.xlsx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png'],
  maxSize = 10, // Default 10MB
  onSuccess,
  onCancel
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>(category);
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
      // Set the default title to the file name without extension
      const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
      setTitle(fileName);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setTitle('');
  };

  const uploadDocument = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for the document",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress
    const progressInterval = simulateProgress();
    
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
        title: title.trim(),
        description: description.trim(),
        file_name: fileName,
        file_size: file.size,
        file_type: file.type,
        category: selectedCategory,
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
      
      setUploadProgress(100);
      
      setTimeout(() => {
        clearInterval(progressInterval);
        
        toast({
          title: "Upload successful",
          description: "Document has been uploaded successfully.",
        });
        
        if (onUploadComplete) {
          onUploadComplete(documentData);
        }
        
        if (onSuccess) {
          onSuccess();
        }
        
        // Reset state
        setFile(null);
        setTitle('');
        setDescription('');
        setSelectedCategory(category);
        setIsUploading(false);
      }, 500);
      
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error uploading document:', error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your document.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  // Function to simulate upload progress
  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress > 90) {
        clearInterval(interval);
        setUploadProgress(90); // Cap at 90% until the upload is actually complete
      } else {
        setUploadProgress(progress);
      }
    }, 200);
    
    return interval;
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        {!file ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
            <Input 
              id="document-upload"
              type="file"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
            <Label htmlFor="document-upload" className="cursor-pointer flex flex-col items-center justify-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-3" />
              <span className="text-lg font-medium mb-1">Drag & drop a file or click to browse</span>
              <span className="text-sm text-muted-foreground">
                Allowed file types: {allowedTypes.join(', ')} (Max size: {maxSize}MB)
              </span>
            </Label>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <File className="h-6 w-6 text-primary" />
                  </div>
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
                    className="text-gray-500 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {isUploading && (
                <div className="mt-3">
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
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="document-title">Title</Label>
                <Input 
                  id="document-title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Document title"
                  disabled={isUploading}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="document-description">Description (optional)</Label>
                <Textarea 
                  id="document-description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this document"
                  disabled={isUploading}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="document-category">Category</Label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={(value) => setSelectedCategory(value as DocumentCategory)}
                  disabled={isUploading}
                >
                  <SelectTrigger id="document-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOP">SOP</SelectItem>
                    <SelectItem value="Policy">Policy</SelectItem>
                    <SelectItem value="Form">Form</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                    <SelectItem value="Audit Report">Audit Report</SelectItem>
                    <SelectItem value="HACCP Plan">HACCP Plan</SelectItem>
                    <SelectItem value="Training Material">Training Material</SelectItem>
                    <SelectItem value="Supplier Documentation">Supplier Documentation</SelectItem>
                    <SelectItem value="Risk Assessment">Risk Assessment</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
        
        <div className="flex justify-between gap-3 pt-2">
          {onCancel && (
            <Button 
              onClick={onCancel} 
              variant="outline" 
              disabled={isUploading}
              className="w-full"
            >
              Cancel
            </Button>
          )}
          
          <Button
            onClick={uploadDocument}
            disabled={!file || isUploading || !title.trim()}
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
    </div>
  );
};

export default DocumentUploader;
