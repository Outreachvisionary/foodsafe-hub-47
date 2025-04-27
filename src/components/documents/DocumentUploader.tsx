
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, File, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useDocument } from '@/contexts/DocumentContext';
import { DocumentCategory, DocumentStatus, Document } from '@/types/document';
import useDocumentService from '@/hooks/useDocumentService';

interface DocumentUploaderProps {
  onDocumentCreated?: (document: Document) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onDocumentCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Other');
  const [status, setStatus] = useState<DocumentStatus>('Draft');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  const { toast } = useToast();
  const { fetchDocuments, createDocument } = useDocument();
  const documentService = useDocumentService();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const droppedFile = acceptedFiles[0];
    setFile(droppedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  const handleCategoryChange = (value: DocumentCategory) => {
    setCategory(value);
  };

  const handleStatusChange = (value: DocumentStatus) => {
    setStatus(value);
  };

  const handleExpiryDateChange = (date: Date | undefined) => {
    setExpiryDate(date);
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Other');
    setStatus('Draft');
    setExpiryDate(undefined);
    setFile(null);
  };

  const createNewDocument = async (values: any) => {
    try {
      setUploading(true);
      setErrorMessage(null);
      
      // Convert string status to DocumentStatus type
      const documentStatus = values.status as DocumentStatus;
      
      const documentData: Partial<Document> = {
        id: values.id,
        title: values.title,
        description: values.description,
        file_name: values.file_name,
        file_path: values.file_path,
        file_size: values.file_size,
        file_type: values.file_type,
        category: values.category,
        status: documentStatus,
        version: values.version,
        created_at: values.created_at,
        created_by: values.created_by,
        updated_at: values.updated_at,
        tags: values.tags,
        approvers: values.approvers,
        folder_id: values.folder_id,
        expiry_date: values.expiry_date,
        pending_since: values.pending_since
      };

      const newDocument = await createDocument(documentData);
      
      if (newDocument) {
        toast({
          title: "Document Created",
          description: "New document has been created successfully"
        });
        
        // Refresh the document list
        await fetchDocuments();
        
        // Notify parent component
        if (onDocumentCreated) {
          onDocumentCreated(newDocument);
        }
        
        clearForm();
      } else {
        setErrorMessage("Failed to create document");
      }
    } catch (error: any) {
      console.error("Error creating document:", error);
      setErrorMessage(error.message || "Failed to create document");
      toast({
        title: "Error",
        description: `Failed to create document: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setErrorMessage('Please select a file to upload');
      return;
    }

    const newDocumentId = uuidv4();
    const now = new Date().toISOString();

    const values = {
      id: newDocumentId,
      title: title,
      description: description,
      file_name: file.name,
      file_path: `${newDocumentId}/${file.name}`,
      file_size: file.size,
      file_type: file.type,
      category: category,
      status: status,
      version: 1,
      created_at: now,
      created_by: 'user',
      updated_at: now,
      tags: [],
      approvers: [],
      folder_id: null,
      expiry_date: expiryDate?.toISOString(),
      pending_since: now
    };

    await createNewDocument(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Document</CardTitle>
        <CardDescription>Add a new document to the repository</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  There was an error creating the document.
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{errorMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              placeholder="Document Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Document Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="SOP">SOP</SelectItem>
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="Form">Form</SelectItem>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                  <SelectItem value="Audit Report">Audit Report</SelectItem>
                  <SelectItem value="HACCP Plan">HACCP Plan</SelectItem>
                  <SelectItem value="Training Material">Training Material</SelectItem>
                  <SelectItem value="Supplier Documentation">Supplier Documentation</SelectItem>
                  <SelectItem value="Risk Assessment">Risk Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Pending_Review">Pending Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Expiry Date</Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !expiryDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={handleExpiryDateChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>Upload Document</Label>
            <div
              {...getRootProps()}
              className="relative border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-white"
            >
              <input {...getInputProps()} />
              <div className="text-center py-12">
                {file ? (
                  <div className="flex items-center justify-center space-x-2">
                    <File className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-500">{file.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-6 w-6 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Drag 'n' drop some files here, or click to select files
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG up to 10MB</p>
                  </>
                )}
              </div>
              {isDragActive ? (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <p className="text-white font-semibold">Drop here...</p>
                </div>
              ) : null}
            </div>
          </div>
          <Button type="submit" disabled={uploading} className="w-full">
            {uploading ? 'Uploading...' : 'Create Document'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
