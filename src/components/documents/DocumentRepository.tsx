import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CheckCircle, Copy, CopyCheck, File, FileText, Filter, FolderPlus, Loader2, MoreHorizontal, Plus, RefreshCw, Search, Trash2, Upload, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDocumentService } from '@/hooks/useDocumentService';
import { Document, DocumentCategory, DocumentStatus, Folder } from '@/types/database';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DocumentPreview } from './DocumentPreview';
import { DocumentVersionHistory } from './DocumentVersionHistory';
import { DocumentComments } from './DocumentComments';
import { DocumentUpload } from './DocumentUpload';
import { DocumentActions } from './DocumentActions';
import { DocumentFilters } from './DocumentFilters';
import { DocumentFolders } from './DocumentFolders';
import { DocumentMetadata } from './DocumentMetadata';
import { DocumentAccessControl } from './DocumentAccessControl';
import { DocumentWorkflowManagement } from './DocumentWorkflowManagement';
import { DocumentTrainingIntegration } from './DocumentTrainingIntegration';
import { DocumentReviewSchedule } from './DocumentReviewSchedule';
import { DocumentLinking } from './DocumentLinking';
import { DocumentSecuritySettings } from './DocumentSecuritySettings';
import { DocumentCompliance } from './DocumentCompliance';
import { DocumentTranslations } from './DocumentTranslations';
import { DocumentAnalytics } from './DocumentAnalytics';
import { DocumentTemplates } from './DocumentTemplates';
import { DocumentCollaboration } from './DocumentCollaboration';
import { DocumentCheckinCheckout } from './DocumentCheckinCheckout';
import { DocumentApprovalWorkflow } from './DocumentApprovalWorkflow';
import { DocumentNotifications } from './DocumentNotifications';
import { DocumentAuditTrail } from './DocumentAuditTrail';
import { DocumentRetentionPolicy } from './DocumentRetentionPolicy';
import { DocumentExport } from './DocumentExport';
import { DocumentImport } from './DocumentImport';
import { DocumentSearch } from './DocumentSearch';
import { DocumentTagging } from './DocumentTagging';
import { DocumentCustomFields } from './DocumentCustomFields';
import { DocumentReporting } from './DocumentReporting';
import { DocumentWatermarking } from './DocumentWatermarking';
import { DocumentDigitalSignatures } from './DocumentDigitalSignatures';
import { DocumentOCR } from './DocumentOCR';
import { DocumentAI } from './DocumentAI';
import { DocumentMobileAccess } from './DocumentMobileAccess';
import { DocumentOfflineAccess } from './DocumentOfflineAccess';
import { DocumentIntegration } from './DocumentIntegration';
import { DocumentBranding } from './DocumentBranding';
import { DocumentHelp } from './DocumentHelp';
import { DocumentSettings } from './DocumentSettings';

const documentFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  category: z.enum(['SOP', 'Policy', 'Form', 'Certificate', 'Audit Report', 'HACCP Plan', 'Training Material', 'Supplier Documentation', 'Risk Assessment', 'Other'] as [string, ...string[]]),
  status: z.enum(['Draft', 'Pending Approval', 'Approved', 'Published', 'Archived', 'Expired'] as [string, ...string[]]),
  expiry_date: z.date().optional(),
  tags: z.string().optional(),
  is_locked: z.boolean().default(false),
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;

const DocumentRepository: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | null>(null);
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | null>(null);
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRange | undefined>(undefined);
  const [isLockedFilter, setIsLockedFilter] = useState<boolean | null>(null);
  const [isAscendingSort, setIsAscendingSort] = useState(true);
  const [selectedDocumentToDelete, setSelectedDocumentToDelete] = useState<Document | null>(null);
  const { toast } = useToast();
  const documentService = useDocumentService();

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Other",
      status: "Draft",
      expiry_date: undefined,
      tags: "",
      is_locked: false,
    },
  });

  useEffect(() => {
    loadDocuments();
    loadFolders();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const fetchedDocuments = await documentService.fetchDocuments();
      setDocuments(fetchedDocuments);
    } catch (error: any) {
      setError(error.message || 'Failed to load documents');
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      // Fetch folders from your data source (e.g., Supabase)
      const fetchedFolders = await documentService.fetchFolders();
      setFolders(fetchedFolders);
    } catch (error: any) {
      console.error('Error loading folders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load folders',
        variant: 'destructive',
      });
    }
  };

  const handleCreateDocument = async (values: DocumentFormValues) => {
    try {
      const newDocument: Omit<Document, 'id'> = {
        title: values.title,
        description: values.description,
        file_name: 'N/A',
        file_size: 0,
        file_type: 'N/A',
        category: values.category,
        status: values.status,
        version: 1,
        created_by: 'admin', // Replace with actual user
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expiry_date: values.expiry_date?.toISOString(),
        tags: values.tags?.split(',').map(tag => tag.trim()),
        is_locked: values.is_locked,
      };

      await documentService.createDocument(newDocument);
      toast({
        title: 'Success',
        description: 'Document created successfully',
      });
      setIsCreateDialogOpen(false);
      form.reset();
      loadDocuments();
    } catch (error: any) {
      console.error('Error creating document:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create document',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateDocument = async (values: DocumentFormValues) => {
    if (!selectedDocument) return;

    try {
      const updatedDocument: Partial<Document> = {
        title: values.title,
        description: values.description,
        category: values.category,
        status: values.status,
        expiry_date: values.expiry_date?.toISOString(),
        tags: values.tags?.split(',').map(tag => tag.trim()),
        is_locked: values.is_locked,
      };

      await documentService.updateDocument(selectedDocument.id, updatedDocument);
      toast({
        title: 'Success',
        description: 'Document updated successfully',
      });
      setIsEditDialogOpen(false);
      form.reset();
      loadDocuments();
    } catch (error: any) {
      console.error('Error updating document:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update document',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDocument = async () => {
    if (!selectedDocumentToDelete) return;

    try {
      await documentService.deleteDocument(selectedDocumentToDelete.id);
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      loadDocuments();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete document',
        variant: 'destructive',
      });
    }
  };

  const handleDocumentUploadSuccess = () => {
    setIsUploadDialogOpen(false);
    loadDocuments();
  };

  const filteredDocuments = documents.filter(doc => {
    const searchTermLower = searchTerm.toLowerCase();
    const titleMatch = doc.title.toLowerCase().includes(searchTermLower);
    const descriptionMatch = doc.description?.toLowerCase().includes(searchTermLower);
    const categoryMatch = !categoryFilter || doc.category === categoryFilter;
    const statusMatch = !statusFilter || doc.status === statusFilter;
    const dateRangeMatch = !dateRangeFilter ||
      (doc.created_at &&
        new Date(doc.created_at) >= (dateRangeFilter.from || new Date(0)) &&
        new Date(doc.created_at) <= (dateRangeFilter.to || new Date()));
    const isLockedMatch = isLockedFilter === null || doc.is_locked === isLockedFilter;

    return titleMatch || descriptionMatch && categoryMatch && statusMatch && dateRangeMatch && isLockedMatch;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
    const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
    return isAscendingSort ? dateA - dateB : dateB - dateA;
  });

  const handleDocumentSelected = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const handleOpenEditDialog = (document: Document) => {
    setSelectedDocument(document);
    form.setValue('title', document.title);
    form.setValue('description', document.description || '');
    form.setValue('category', document.category);
    form.setValue('status', document.status);
    form.setValue('expiry_date', document.expiry_date ? new Date(document.expiry_date) : undefined);
    form.setValue('tags', document.tags?.join(', ') || '');
    form.setValue('is_locked', document.is_locked || false);
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (document: Document) => {
    setSelectedDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };

  const handleSortToggle = () => {
    setIsAscendingSort(!isAscendingSort);
  };

  const handleCategoryFilterChange = (category: DocumentCategory | null) => {
    setCategoryFilter(category);
  };

  const handleStatusFilterChange = (status: DocumentStatus | null) => {
    setStatusFilter(status);
  };

  const handleDateRangeFilterChange = (dateRange: DateRange | undefined) => {
    setDateRangeFilter(dateRange);
  };

  const handleIsLockedFilterChange = (isLocked: boolean | null) => {
    setIsLockedFilter(isLocked);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Document Repository</CardTitle>
          <CardDescription>Manage and organize your documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input
                type="search"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={handleSortToggle}>
                Sort by Date {isAscendingSort ? '↑' : '↓'}
              </Button>

              <DocumentFilters
                categoryFilter={categoryFilter}
                statusFilter={statusFilter}
                dateRangeFilter={dateRangeFilter}
                isLockedFilter={isLockedFilter}
                onCategoryChange={handleCategoryFilterChange}
                onStatusChange={handleStatusFilterChange}
                onDateRangeChange={handleDateRangeFilterChange}
                onIsLockedChange={handleIsLockedFilterChange}
              />

              <div className="space-x-2">
                <Button size="sm" onClick={() => setIsUploadDialogOpen(true)}>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload
                </Button>
                <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Document
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading documents...
              </div>
            ) : error ? (
              <div className="text-red-500 py-4">Error: {error}</div>
            ) : (
              <ScrollArea className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">{document.title}</TableCell>
                        <TableCell>{document.category}</TableCell>
                        <TableCell>{document.status}</TableCell>
                        <TableCell>
                          {document.updated_at
                            ? format(new Date(document.updated_at), 'MMM d, yyyy h:mm a')
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDocumentSelected(document)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(document)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDeleteDialog(document)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create Document</DialogTitle>
            <DialogDescription>
              Add a new document to the repository.
            </DialogDescription>
          </DialogHeader>
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
                              'w-[240px] pl-3 text-left font-normal',
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
                          disabled={(date) =>
                            date < new Date()
                          }
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
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Edit the selected document.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateDocument)} className="space-y-4">
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
                              'w-[240px] pl-3 text-left font-normal',
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
                          disabled={(date) =>
                            date < new Date()
                          }
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
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteDocument}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document to the repository.
            </DialogDescription>
          </DialogHeader>
          <DocumentUpload onSuccess={handleDocumentUploadSuccess} onCancel={() => setIsUploadDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[80%] sm:max-h-[90vh]">
          {selectedDocument && (
            <DocumentPreview document={selectedDocument} onClose={() => setIsPreviewOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      <DocumentVersionHistory
        document={selectedDocument}
        open={isVersionHistoryOpen}
        onOpenChange={setIsVersionHistoryOpen}
      />
    </>
  );
};

export default DocumentRepository;
