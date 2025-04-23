
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import documentService from '@/services/documentService';
import { useDocuments } from '@/contexts/DocumentContext';
import { v4 as uuidv4 } from 'uuid';
import { Document } from '@/types/document';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({ 
  open, 
  onOpenChange,
  onSuccess
}) => {
  const { toast } = useToast();
  const { folders, selectedFolder, refreshData } = useDocuments();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('SOP');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Use selected folder as default if available
  React.useEffect(() => {
    if (selectedFolder) {
      setSelectedFolderId(selectedFolder.id);
    }
  }, [selectedFolder, open]);

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setCategory('SOP');
    setUploadProgress(0);
    setErrors({});
    // Don't reset selected folder to preserve user's context
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      // Auto-populate title from filename if empty
      if (!title) {
        // Remove extension from filename
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
        setTitle(fileName);
      }
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 1
  });

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!file) {
      newErrors.file = 'Please select a file to upload';
    }
    
    if (!category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;
    
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      // Create a new document ID
      const documentId = uuidv4();
      
      // Create document metadata first
      const documentData: Partial<Document> = {
        id: documentId,
        title,
        description,
        category,
        status: 'Draft',
        created_by: 'Current User', // In a real app, get the current user
        file_name: file?.name,
        file_size: file?.size || 0,
        file_type: file?.type || '',
        folder_id: selectedFolderId || undefined,
        version: 1
      };
      
      setUploadProgress(30);
      
      // Upload the file first to get the URL
      if (file) {
        const fileUrl = await documentService.uploadDocumentFile(file, documentId);
        documentData.file_path = fileUrl;
      }
      
      setUploadProgress(70);
      
      // Then create the document record
      await documentService.createDocument(documentData);
      
      setUploadProgress(100);
      
      toast({
        title: "Document uploaded successfully",
        description: "Your document has been uploaded and is now available in the document repository.",
      });
      
      // Close dialog and refresh document list
      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess();
      } else {
        refreshData();
      }
      
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading the document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Upload Document</DialogTitle>
          <DialogDescription>
            Upload a new document to the repository
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <div className="col-span-3">
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? "border-red-500" : ""}
                placeholder="Enter document title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Enter document description (optional)"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <div className="col-span-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOP">Standard Operating Procedure</SelectItem>
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="Work_Instruction">Work Instruction</SelectItem>
                  <SelectItem value="Form">Form</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Record">Record</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="folder" className="text-right">
              Folder
            </Label>
            <div className="col-span-3">
              <Select 
                value={selectedFolderId || ''} 
                onValueChange={(value) => setSelectedFolderId(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a folder (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Root (No Folder)</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="file" className="text-right mt-2">
              File
            </Label>
            <div className="col-span-3">
              {!file ? (
                <div 
                  {...getRootProps()} 
                  className={cn(
                    "border-2 border-dashed p-6 rounded-md transition-colors cursor-pointer text-center",
                    isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                    errors.file ? "border-red-500" : ""
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <div className="font-medium">
                      {isDragActive ? (
                        <p>Drop the file here</p>
                      ) : (
                        <p>Drag & drop a file here or click to browse</p>
                      )}
                    </div>
                    <p className="text-xs">
                      Support for DOC, DOCX, PDF, XLS, XLSX, TXT, JPG, PNG (max 50MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center p-2 border rounded-md">
                  <File className="h-8 w-8 text-muted-foreground mr-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={removeFile}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {errors.file && (
                <p className="text-red-500 text-sm mt-1">{errors.file}</p>
              )}
            </div>
          </div>
          
          {isUploading && (
            <div className="col-span-4 mt-2">
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-center mt-1 text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={isUploading}
            className="bg-primary hover:bg-primary/90"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
