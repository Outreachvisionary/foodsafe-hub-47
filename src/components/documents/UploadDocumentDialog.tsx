
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import DocumentUploader from './DocumentUploader';
import { DocumentCategory } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Upload, FileText } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDocumentService } from '@/hooks/useDocumentService';
import { useToast } from '@/hooks/use-toast';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultCategory?: DocumentCategory;
}

const documentFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  category: z.enum(['SOP', 'Policy', 'Form', 'Certificate', 'Audit Report', 'HACCP Plan', 'Training Material', 'Supplier Documentation', 'Risk Assessment', 'Other'] as [DocumentCategory, ...DocumentCategory[]]),
  status: z.enum(['Draft', 'Pending Approval', 'Approved', 'Published', 'Archived', 'Expired']),
  expiry_date: z.date().optional(),
  tags: z.string().optional(),
  is_locked: z.boolean().default(false),
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  onCancel,
  defaultCategory = 'SOP'
}) => {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const { toast } = useToast();
  const { createDocument } = useDocumentService();

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: defaultCategory,
      status: "Draft",
      expiry_date: undefined,
      tags: "",
      is_locked: false,
    },
  });

  const handleUploadComplete = () => {
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };

  const handleCancel = () => {
    onOpenChange(false);
    if (onCancel) onCancel();
    form.reset();
  };

  const handleCreateDocument = async (values: DocumentFormValues) => {
    try {
      const newDocument = {
        title: values.title,
        description: values.description,
        file_name: 'Created via form',
        file_size: 0,
        file_type: 'text/plain',
        category: values.category,
        status: values.status,
        version: 1,
        created_by: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expiry_date: values.expiry_date?.toISOString(),
        tags: values.tags?.split(',').map(tag => tag.trim()),
        is_locked: values.is_locked,
      };

      await createDocument(newDocument);
      toast({
        title: 'Success',
        description: 'Document created successfully',
      });
      onOpenChange(false);
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error creating document:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create document',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Document Management</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Upload Document</span>
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Create Document</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <DocumentUploader 
              onUploadComplete={handleUploadComplete} 
              category={defaultCategory}
            />
          </TabsContent>
          
          <TabsContent value="create">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateDocument)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Document Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Document Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Published">Published</SelectItem>
                          <SelectItem value="Archived">Archived</SelectItem>
                          <SelectItem value="Expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expiry_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>Expiry Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
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
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Set an expiry date for the document.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="Comma separated tags" {...field} />
                      </FormControl>
                      <FormDescription>
                        Add comma separated tags for document.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_locked"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Lock Document</FormLabel>
                        <FormDescription>
                          Prevent further modifications to the document.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Document</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
        
        {activeTab === "upload" && onCancel && (
          <div className="flex justify-end mt-4">
            <button 
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
