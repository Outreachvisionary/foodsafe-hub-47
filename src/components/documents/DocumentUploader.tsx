
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, File, X, FileText, UserCheck } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface DocumentUploaderProps {
  onUploadComplete?: (document: Document) => void;
  category?: DocumentCategory;
  allowedTypes?: string[];
  maxSize?: number; // In MB
  onSuccess?: () => void;
  onCancel?: () => void;
  selectedFolder?: string | null;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onUploadComplete,
  category = 'Other',
  allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.xls', '.xlsx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png'],
  maxSize = 10, // Default 10MB
  onSuccess,
  onCancel,
  selectedFolder
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>(category);
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus>('Draft');
  const [isLocked, setIsLocked] = useState(false);
  const [tags, setTags] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [submitForReview, setSubmitForReview] = useState(false);
  const [approvers, setApprovers] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
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
    setUploadSuccess(false);
    
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
        clearInterval(progressInterval);
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
      const tagArray = tags.trim() ? tags.split(',').map(tag => tag.trim()) : [];
      
      const newDocument: Partial<Document> = {
        id: documentId,
        title: title.trim(),
        description: description.trim(),
        file_name: fileName,
        file_size: file.size,
        file_type: file.type,
        category: selectedCategory,
        status: submitForReview ? 'Pending Approval' : selectedStatus,
        version: 1,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expiry_date: expiryDate?.toISOString(),
        is_locked: isLocked,
        tags: tagArray,
        folder_id: selectedFolder || null,
        approvers: submitForReview ? approvers : [],
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
      setUploadSuccess(true);
      
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
      
      // Reset state after a short delay
      setTimeout(() => {
        setFile(null);
        setTitle('');
        setDescription('');
        setSelectedCategory(category);
        setIsUploading(false);
        setUploadSuccess(false);
      }, 1500);
      
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
                
                {!isUploading && !uploadSuccess && (
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
              
              {(isUploading || uploadSuccess) && (
                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        uploadSuccess ? "bg-green-500" : "bg-primary"
                      }`}
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {uploadSuccess 
                      ? "Upload complete!" 
                      : `${uploadProgress}% uploaded`}
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
                  disabled={isUploading || uploadSuccess}
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
                  disabled={isUploading || uploadSuccess}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="document-category">Category</Label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={(value) => setSelectedCategory(value as DocumentCategory)}
                  disabled={isUploading || uploadSuccess}
                >
                  <SelectTrigger id="document-category" className="bg-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
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
              
              <div>
                <Label htmlFor="document-status">Status</Label>
                <Select 
                  value={selectedStatus} 
                  onValueChange={(value) => setSelectedStatus(value as DocumentStatus)}
                  disabled={isUploading || uploadSuccess || submitForReview}
                >
                  <SelectTrigger id="document-status" className="bg-white">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="document-expiry">Expiry Date (optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={isUploading || uploadSuccess}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white",
                        !expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white">
                    <Calendar
                      mode="single"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="document-tags">Tags (comma separated)</Label>
                <Input 
                  id="document-tags" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="quality, inspection, compliance"
                  disabled={isUploading || uploadSuccess}
                />
              </div>

              <div className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base" htmlFor="submit-for-review">Submit for Review</Label>
                  <p className="text-sm text-muted-foreground">
                    Send this document for approval
                  </p>
                </div>
                <Switch
                  id="submit-for-review"
                  checked={submitForReview}
                  onCheckedChange={setSubmitForReview}
                  disabled={isUploading || uploadSuccess}
                />
              </div>

              {submitForReview && (
                <div>
                  <Label htmlFor="approvers">Approvers</Label>
                  <Select 
                    disabled={isUploading || uploadSuccess}
                    value={approvers[0] || ""}
                    onValueChange={(value) => setApprovers([value])}
                  >
                    <SelectTrigger id="approvers" className="bg-white">
                      <SelectValue placeholder="Select approver" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="quality_manager">Quality Manager</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base" htmlFor="document-locked">Lock Document</Label>
                  <p className="text-sm text-muted-foreground">
                    Prevent further modifications to this document
                  </p>
                </div>
                <Switch
                  id="document-locked"
                  checked={isLocked}
                  onCheckedChange={setIsLocked}
                  disabled={isUploading || uploadSuccess}
                />
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
            disabled={!file || isUploading || !title.trim() || uploadSuccess}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : uploadSuccess ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Uploaded
              </>
            ) : submitForReview ? (
              <>
                <UserCheck className="h-4 w-4 mr-2" />
                Submit for Review
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
