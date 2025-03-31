import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Cloud, FileText, Loader2, Plus, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocuments } from '@/contexts/DocumentContext';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import documentService from '@/services/documentService';
import { supabase } from '@/integrations/supabase/client';
import { DocumentCategory, DocumentStatus } from '@/types/document';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CategoryOption = {
  label: string;
  value: DocumentCategory;
};

const CATEGORIES: CategoryOption[] = [
  { label: 'SOP', value: 'SOP' },
  { label: 'Policy', value: 'Policy' },
  { label: 'Form', value: 'Form' },
  { label: 'Certificate', value: 'Certificate' },
  { label: 'Audit Report', value: 'Audit Report' },
  { label: 'HACCP Plan', value: 'HACCP Plan' },
  { label: 'Training Material', value: 'Training Material' },
  { label: 'Supplier Documentation', value: 'Supplier Documentation' },
  { label: 'Risk Assessment', value: 'Risk Assessment' },
  { label: 'Other', value: 'Other' },
];

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({ open, onOpenChange }) => {
  const { addDocument } = useDocuments();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategory | ''>('');
  const [file, setFile] = useState<File | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setFile(null);
    setExpiryDate(undefined);
    setErrorMessage(null);
    setUploadProgress(0);
    setUploadSuccess(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      if (!title) {
        const fileName = selectedFile.name.split('.');
        fileName.pop();
        setTitle(fileName.join('.'));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setErrorMessage('Please select a file to upload');
      return;
    }
    
    if (!title) {
      setErrorMessage('Please enter a document title');
      return;
    }
    
    if (!category) {
      setErrorMessage('Please select a document category');
      return;
    }
    
    try {
      setIsUploading(true);
      setErrorMessage(null);
      setUploadProgress(10);
      
      const documentId = uuidv4();
      
      const filePath = `documents/${documentId}/${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        throw new Error(`File upload failed: ${uploadError.message}`);
      }
      
      setUploadProgress(50);
      
      const { data: urlData } = await supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);
      
      const fileUrl = urlData?.publicUrl;
      
      setUploadProgress(70);
      
      const newDocument = {
        id: documentId,
        title,
        description,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type || 'application/octet-stream',
        file_path: fileUrl,
        category: category as DocumentCategory,
        status: 'Draft' as DocumentStatus,
        version: 1,
        created_by: user?.id || 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expiry_date: expiryDate ? expiryDate.toISOString() : undefined,
        is_locked: false,
        tags: []
      };
      
      const createdDocument = await documentService.createDocument(newDocument);
      
      await documentService.createDocumentVersion({
        document_id: documentId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type || 'application/octet-stream',
        version: 1,
        created_by: user?.id || 'system',
        editor_metadata: { 
          upload_source: 'web',
          original_filename: file.name
        }
      });
      
      addDocument(createdDocument);
      
      setUploadProgress(100);
      setUploadSuccess(true);
      
      toast({
        title: "Document uploaded successfully",
        description: "Your document has been uploaded and added to the repository.",
        variant: "default",
      });
      
      setTimeout(() => {
        resetForm();
        onOpenChange(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error uploading document:', err);
      setErrorMessage((err as Error).message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isUploading) {
        if (!newOpen) resetForm();
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-accent/5 border-accent/20 shadow-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            <Upload className="mr-2 h-6 w-6 text-accent" />
            Upload New Document
          </DialogTitle>
        </DialogHeader>
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 shadow-sm animate-fade-in">
            <div className="flex">
              <div className="py-1"><AlertCircle className="h-5 w-5 text-red-500 mr-2" /></div>
              <div className="flex-1">
                <p className="font-bold text-lg">Upload Error</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        {uploadSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4 shadow-sm animate-fade-in">
            <div className="flex">
              <div className="py-1"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /></div>
              <div className="flex-1">
                <p className="font-bold text-lg">Upload Successful</p>
                <p className="text-sm">Your document has been uploaded successfully!</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="col-span-1">
                <Label htmlFor="title" className="text-lg font-medium">Document Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter document title"
                  required
                  disabled={isUploading}
                  className="mt-1 text-base border-border/60 focus:border-accent focus:ring-accent"
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="description" className="text-lg font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter document description"
                  rows={3}
                  disabled={isUploading}
                  className="mt-1 text-base border-border/60 focus:border-accent focus:ring-accent"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="text-lg font-medium">Category *</Label>
                  <Select 
                    value={category} 
                    onValueChange={(value) => setCategory(value as DocumentCategory)} 
                    required
                    disabled={isUploading}
                  >
                    <SelectTrigger id="category" className="mt-1 text-base border-border/60 focus:border-accent focus:ring-accent">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-border/60">
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="expiryDate" className="text-lg font-medium">Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1 text-base border-border/60",
                          !expiryDate && "text-muted-foreground"
                        )}
                        disabled={isUploading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expiryDate ? format(expiryDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border border-border/60">
                      <Calendar
                        mode="single"
                        selected={expiryDate}
                        onSelect={setExpiryDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="file" className="text-lg font-medium">File Upload *</Label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-accent/30 rounded-md hover:border-accent/50 transition-colors bg-white/50">
                  <div className="space-y-1 text-center">
                    {file ? (
                      <div className="flex flex-col items-center">
                        <FileText className="mx-auto h-16 w-16 text-accent" />
                        <p className="text-lg font-medium">{file.name}</p>
                        <p className="text-base text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setFile(null)}
                          className="mt-2 text-primary hover:text-primary-dark"
                          disabled={isUploading}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Cloud className="mx-auto h-16 w-16 text-accent/70" />
                        <div className="flex text-base text-muted-foreground gap-1 justify-center">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-accent hover:text-accent-dark focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <Input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png"
                              disabled={isUploading}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-sm mt-1">
                          PDF, Office documents, images up to 50MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500 animate-pulse" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-sm text-center mt-2">Uploading... {uploadProgress}%</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
              className="border-accent/30 text-accent hover:bg-accent/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading || !file || !title || !category}
              className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary-dark hover:to-accent-dark font-medium text-base"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Upload Document
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
