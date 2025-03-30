
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Cloud, FileText, Loader2, Plus, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocuments } from '@/contexts/DocumentContext';
import { useDocumentService } from '@/hooks/useDocumentService';
import { Document } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@/contexts/UserContext';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CategoryOption = {
  label: string;
  value: string;
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
  const { uploadFile, checkStorageAvailability, createDocumentVersion } = useDocumentService();
  const { user } = useUser();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [storageAvailable, setStorageAvailable] = useState<boolean | null>(null);
  
  // Check storage on dialog open
  React.useEffect(() => {
    if (open) {
      const checkStorage = async () => {
        const isAvailable = await checkStorageAvailability();
        setStorageAvailable(isAvailable);
        if (!isAvailable) {
          setErrorMessage('Document storage is not available. Please contact your administrator.');
        }
      };
      
      checkStorage();
    }
  }, [open, checkStorageAvailability]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setFile(null);
    setExpiryDate(undefined);
    setErrorMessage(null);
    setUploadProgress(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // If no title is set yet, use the file name without extension as a suggestion
      if (!title) {
        const fileName = selectedFile.name.split('.');
        fileName.pop(); // Remove extension
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
      
      // Generate a unique ID for the document
      const documentId = uuidv4();
      
      // Create the document object
      const newDocument: Omit<Document, 'id'> = {
        title,
        description,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type || 'application/octet-stream',
        category: category as any,
        status: 'Draft',
        version: 1,
        created_by: user?.id || 'system',
        expiry_date: expiryDate ? expiryDate.toISOString() : undefined,
        is_locked: false,
        tags: []
      };
      
      // First check if storage is available
      const isStorageAvailable = await checkStorageAvailability();
      if (!isStorageAvailable) {
        throw new Error('Document storage is not available. Please contact your administrator.');
      }
      
      // Step 1: First create the document in the database
      console.log('Creating document record:', newDocument);
      const createdDocument = await addDocument({
        id: documentId,
        ...newDocument
      } as Document);
      
      setUploadProgress(33);
      
      // Step 2: Now upload the file to storage
      const storagePath = `documents/${documentId}/${file.name}`;
      console.log('Uploading file to storage:', storagePath);
      await uploadFile(file, storagePath);
      
      setUploadProgress(66);
      
      // Step 3: Create an initial version record
      console.log('Creating document version record');
      await createDocumentVersion({
        document_id: documentId,
        file_name: file.name,
        file_size: file.size,
        version: 1,
        created_by: user?.id || 'system',
        change_notes: 'Initial version'
      });
      
      setUploadProgress(100);
      
      resetForm();
      onOpenChange(false);
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            Upload New Document
          </DialogTitle>
        </DialogHeader>
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            <div className="flex">
              <div className="py-1"><svg className="fill-current h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
              <div>
                <p className="font-bold">Upload Error</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="col-span-1">
                <Label htmlFor="title">Document Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter document title"
                  required
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter document description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !expiryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expiryDate ? format(expiryDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={expiryDate}
                        onSelect={setExpiryDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="file">File Upload *</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
                  <div className="space-y-1 text-center">
                    {file ? (
                      <div className="flex flex-col items-center">
                        <FileText className="mx-auto h-12 w-12 text-primary" />
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setFile(null)}
                          className="mt-2"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Cloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div className="flex text-sm text-muted-foreground">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <Input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs">
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
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs text-center mt-2">Uploading... {uploadProgress}%</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading || !file || !title || !category || storageAvailable === false}
              className="flex items-center"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
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
