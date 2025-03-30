
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
import { CalendarIcon, Cloud, FileText, Loader2, Plus, Upload, AlertCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocuments } from '@/contexts/DocumentContext';
import { useDocumentService } from '@/hooks/useDocumentService';
import { Document } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@/contexts/UserContext';
import { initializeStorage } from '@/integrations/supabase/client';

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
  const [isCheckingStorage, setIsCheckingStorage] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Improved storage availability check with auto-retry
  useEffect(() => {
    if (open) {
      // Force timeout after 10 seconds regardless of response
      const forceTimeoutId = setTimeout(() => {
        if (isCheckingStorage) {
          console.error("Storage check timed out after 10 seconds");
          setIsCheckingStorage(false);
          setStorageAvailable(false);
          setErrorMessage("Storage check timed out. Try again or contact your administrator.");
        }
      }, 10000); // 10 seconds hard timeout
      
      const checkStorage = async () => {
        try {
          setIsCheckingStorage(true);
          setErrorMessage(null);
          
          console.log("Checking storage availability...");
          
          // Try to initialize storage first
          await initializeStorage();
          
          // Now check if it's available
          const isAvailable = await checkStorageAvailability();
          setStorageAvailable(isAvailable);
          
          if (!isAvailable) {
            setErrorMessage('Document storage is not available. Please contact your administrator.');
            console.error('Storage is not available');
            
            // Auto-retry up to 3 times
            if (retryCount < 3) {
              console.log(`Auto-retrying storage check (attempt ${retryCount + 1}/3)...`);
              setRetryCount(prev => prev + 1);
              // Wait 1 second before retrying
              setTimeout(() => {
                checkStorage();
              }, 1000);
            }
          } else {
            console.log('Storage is available and accessible');
          }
        } catch (err) {
          console.error('Error checking storage:', err);
          setStorageAvailable(false);
          setErrorMessage(`Storage connection error: ${(err as Error).message}`);
        } finally {
          clearTimeout(forceTimeoutId); // Clear the force timeout
          setIsCheckingStorage(false);
        }
      };
      
      checkStorage();
      
      return () => {
        clearTimeout(forceTimeoutId); // Clean up on unmount
      };
    } else {
      setRetryCount(0); // Reset retry count when dialog closes
    }
  }, [open, checkStorageAvailability, retryCount]);
  
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

  // Improved submit handler
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
      
      // Initialize storage first if needed
      if (!storageAvailable) {
        console.log('Trying to initialize storage before upload...');
        await initializeStorage();
        const isStorageAvailable = await checkStorageAvailability();
        if (!isStorageAvailable) {
          throw new Error('Document storage is not available. Please try again later or contact your administrator.');
        }
      }
      
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
      
      setUploadProgress(10);
      
      // Step 1: First create the document in the database
      console.log('Creating document record:', newDocument);
      const createdDocument = await addDocument({
        id: documentId,
        ...newDocument
      } as Document);
      
      setUploadProgress(30);
      
      // Step 2: Now upload the file to storage with retries
      const storagePath = `documents/${documentId}/${file.name}`;
      let uploadSuccess = false;
      let uploadAttempt = 0;
      const maxUploadAttempts = 3;
      
      while (!uploadSuccess && uploadAttempt < maxUploadAttempts) {
        uploadAttempt++;
        try {
          console.log(`Upload attempt ${uploadAttempt}/${maxUploadAttempts} for file:`, storagePath);
          await uploadFile(file, storagePath);
          uploadSuccess = true;
          console.log('File upload successful');
        } catch (uploadErr) {
          console.error(`Upload attempt ${uploadAttempt} failed:`, uploadErr);
          if (uploadAttempt >= maxUploadAttempts) {
            throw new Error(`Failed to upload file after ${maxUploadAttempts} attempts: ${(uploadErr as Error).message}`);
          }
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      setUploadProgress(70);
      
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

  // Function to manually retry storage check
  const handleRetryStorageCheck = async () => {
    setErrorMessage(null);
    setIsCheckingStorage(true);
    
    try {
      // Try to initialize storage first
      await initializeStorage();
      
      // Then check availability
      const isAvailable = await checkStorageAvailability();
      setStorageAvailable(isAvailable);
      
      if (!isAvailable) {
        setErrorMessage('Document storage is still not available. Please contact your administrator.');
      }
    } catch (err) {
      console.error('Error during manual storage check:', err);
      setErrorMessage(`Storage check failed: ${(err as Error).message}`);
    } finally {
      setIsCheckingStorage(false);
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
              <div className="py-1"><AlertCircle className="h-5 w-5 text-red-500 mr-2" /></div>
              <div className="flex-1">
                <p className="font-bold">Upload Error</p>
                <p className="text-sm">{errorMessage}</p>
                {errorMessage.includes('storage') && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRetryStorageCheck} 
                    className="mt-2"
                    disabled={isCheckingStorage}
                  >
                    {isCheckingStorage ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      'Retry Storage Check'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {storageAvailable === false && !errorMessage && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md mb-4">
            <div className="flex">
              <div className="py-1"><AlertTriangle className="h-5 w-5 text-amber-500 mr-2" /></div>
              <div className="flex-1">
                <p className="font-bold">Storage Unavailable</p>
                <p className="text-sm">Document storage is not available. Documents cannot be uploaded at this time.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetryStorageCheck} 
                  className="mt-2"
                  disabled={isCheckingStorage}
                >
                  {isCheckingStorage ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    'Retry Storage Check'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {isCheckingStorage && !errorMessage && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mb-4">
            <div className="flex">
              <div className="py-1">
                <Loader2 className="h-5 w-5 text-blue-500 mr-2 animate-spin" />
              </div>
              <div>
                <p className="font-bold">Checking Storage</p>
                <p className="text-sm">Verifying document storage availability...</p>
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
                  disabled={isUploading || storageAvailable === false}
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
                  disabled={isUploading || storageAvailable === false}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={category} 
                    onValueChange={setCategory} 
                    required
                    disabled={isUploading || storageAvailable === false}
                  >
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
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !expiryDate && "text-muted-foreground"
                        )}
                        disabled={isUploading || storageAvailable === false}
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
                        disabled={(date) => date < new Date()}
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
                          disabled={isUploading}
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
                            className={cn(
                              "relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none",
                              (storageAvailable === false || isUploading) && "opacity-50 pointer-events-none"
                            )}
                          >
                            <span>Upload a file</span>
                            <Input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png"
                              disabled={isUploading || storageAvailable === false}
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
              disabled={isUploading || !file || !title || !category || storageAvailable === false || isCheckingStorage}
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
