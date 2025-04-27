
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, FileText, FileType, Info, Building, Lock, Upload, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FormSection } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';

// Define the form schema with zod
const formSchema = z.object({
  // Document Information section
  title: z.string().min(3, { message: "Document title must be at least 3 characters" }),
  documentType: z.enum(['Policy', 'Procedure', 'Work Instruction', 'Form', 'Record', 'Manual', 'Training Material', 'Other']),
  category: z.enum(['Food Safety', 'Quality Assurance', 'HACCP', 'GMP', 'Sanitation', 'Personnel', 'Regulatory', 'Other']),
  status: z.enum(['Draft', 'Under Review', 'Approved', 'Archived']),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  
  // Document Details section
  documentNumber: z.string().optional(),
  revisionNumber: z.string().optional(),
  effectiveDate: z.date(),
  reviewDate: z.date().optional().nullable(),
  department: z.enum([
    'Production', 
    'Quality Assurance', 
    'Food Safety', 
    'Maintenance', 
    'Sanitation', 
    'Human Resources', 
    'Management', 
    'All Departments'
  ]),
  
  // Access Control section
  accessLevel: z.enum(['Public', 'Restricted', 'Confidential']),
  authorizedUsers: z.array(z.string()).optional(),
  
  // Document Content section
  content: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof formSchema>;

export default function DocumentCreate() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  
  // Define form
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      documentType: 'Procedure',
      category: 'Food Safety',
      status: 'Draft',
      description: '',
      documentNumber: '',
      revisionNumber: '',
      effectiveDate: new Date(),
      reviewDate: null,
      department: 'All Departments',
      accessLevel: 'Public',
      authorizedUsers: [],
      content: '',
    },
  });

  // Form submission handler
  async function onSubmit(data: DocumentFormValues) {
    try {
      // Show loading state
      setIsUploading(true);

      // Here we would typically integrate with API to save the document
      // This is a mock API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Handle file uploads if any
      if (files.length > 0) {
        // Mock file upload logic
        console.log("Files to upload:", files);
      }
      
      // Display success notification
      toast({
        title: "Document created successfully",
        description: `${data.title} has been saved as ${data.status}`,
        variant: "success",
      });
      
      // Navigate to the documents list
      navigate('/documents');
    } catch (error) {
      console.error("Error creating document:", error);
      toast({
        title: "Error creating document",
        description: "There was a problem saving your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }

  // Handler for file uploads
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles) {
      // Convert FileList to array and check file size
      const filesArray = Array.from(newFiles);
      const validFiles = filesArray.filter(file => file.size <= 10 * 1024 * 1024); // 10MB max
      
      if (validFiles.length !== filesArray.length) {
        toast({
          title: "File size exceeded",
          description: "Some files were not added because they exceed the 10MB size limit",
          variant: "destructive",
        });
      }
      
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  // Remove a file from the list
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Create Document</h1>
          <p className="text-muted-foreground mt-1">Complete the form to create a new document</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/documents')}>Cancel</Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Document Details</TabsTrigger>
              <TabsTrigger value="content">Content & Attachments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <FormSection title="Document Information" icon={FileText}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Document Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Document Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter document title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Document Type */}
                  <FormField
                    control={form.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Document Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Policy">Policy</SelectItem>
                            <SelectItem value="Procedure">Procedure</SelectItem>
                            <SelectItem value="Work Instruction">Work Instruction</SelectItem>
                            <SelectItem value="Form">Form</SelectItem>
                            <SelectItem value="Record">Record</SelectItem>
                            <SelectItem value="Manual">Manual</SelectItem>
                            <SelectItem value="Training Material">Training Material</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Food Safety">Food Safety</SelectItem>
                            <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                            <SelectItem value="HACCP">HACCP</SelectItem>
                            <SelectItem value="GMP">GMP</SelectItem>
                            <SelectItem value="Sanitation">Sanitation</SelectItem>
                            <SelectItem value="Personnel">Personnel</SelectItem>
                            <SelectItem value="Regulatory">Regulatory</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Under Review">Under Review</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Description */}
                  <div className="col-span-1 md:col-span-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter document description" 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </FormSection>
              
              <FormSection title="Document Details" icon={FileType}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Document Number */}
                  <FormField
                    control={form.control}
                    name="documentNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. DOC-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Revision Number */}
                  <FormField
                    control={form.control}
                    name="revisionNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Revision Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 1.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Effective Date */}
                  <FormField
                    control={form.control}
                    name="effectiveDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel required>Effective Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Review Date */}
                  <FormField
                    control={form.control}
                    name="reviewDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Review Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Department */}
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Production">Production</SelectItem>
                            <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                            <SelectItem value="Food Safety">Food Safety</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                            <SelectItem value="Sanitation">Sanitation</SelectItem>
                            <SelectItem value="Human Resources">Human Resources</SelectItem>
                            <SelectItem value="Management">Management</SelectItem>
                            <SelectItem value="All Departments">All Departments</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>
              
              <FormSection title="Access Control" icon={Lock}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Access Level */}
                  <FormField
                    control={form.control}
                    name="accessLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Access Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select access level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Public">Public</SelectItem>
                            <SelectItem value="Restricted">Restricted</SelectItem>
                            <SelectItem value="Confidential">Confidential</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Authorized Users would be shown conditionally based on access level */}
                  {form.watch('accessLevel') !== 'Public' && (
                    <FormItem>
                      <FormLabel>Authorized Users</FormLabel>
                      <FormControl>
                        <Input placeholder="This would be a multi-select in real implementation" disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                </div>
              </FormSection>
            </TabsContent>
            
            <TabsContent value="content">
              <FormSection title="Document Content" icon={Info}>
                <div className="space-y-4">
                  {/* Rich Text Editor would go here */}
                  <FormItem>
                    <FormLabel>Document Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="This would be a rich text editor in real implementation" 
                        className="min-h-[200px]"
                      />
                    </FormControl>
                  </FormItem>
                </div>
              </FormSection>
              
              <FormSection title="Attachments" icon={Upload}>
                <div className="space-y-4">
                  {/* File Upload */}
                  <FormItem>
                    <FormLabel>Upload Files</FormLabel>
                    <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                      <Input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        onChange={handleFileChange}
                        multiple
                        accept=".pdf,.docx,.xlsx,.txt,.jpeg,.jpg,.png"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                        <p className="mb-1 font-medium">Click to upload files</p>
                        <p className="text-xs text-muted-foreground">
                          PDF, DOCX, XLSX, TXT, JPEG, PNG (Max 10MB per file)
                        </p>
                      </label>
                    </div>
                    
                    {/* File List */}
                    {files.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Uploaded Files</p>
                        <ul className="space-y-2">
                          {files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-secondary/30 p-2 rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="text-sm truncate max-w-[250px]">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="xs" 
                                onClick={() => removeFile(index)}
                                className="h-6 w-6 p-0"
                              >
                                ✕
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </FormItem>
                </div>
              </FormSection>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between pt-6 border-t">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => navigate('/documents')}
            >
              Cancel
            </Button>
            <div className="space-x-2">
              <Button 
                variant="secondary" 
                type="button"
                onClick={() => {
                  form.setValue('status', 'Draft');
                  form.handleSubmit(onSubmit)();
                }}
                disabled={isUploading}
              >
                Save as Draft
              </Button>
              <Button 
                type="submit" 
                disabled={isUploading}
              >
                {isUploading ? "Saving..." : "Create Document"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
