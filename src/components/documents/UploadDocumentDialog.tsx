
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentCategory, ModuleReference } from '@/types/document';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDocuments } from '@/contexts/DocumentContext';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategory | ''>('');
  const [linkedModule, setLinkedModule] = useState<ModuleReference>('none');
  const [date, setDate] = useState<Date>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { addDocument, setSelectedDocument } = useDocuments();

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setLinkedModule('none');
    setDate(undefined);
    setSelectedFile(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category) {
      toast({
        title: "Missing information",
        description: "Please select a category for the document.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new document with the entered details
    const newDocument = {
      id: `doc-${Math.random().toString(36).substring(2, 11)}`,
      title: title || "Untitled Document",
      description: description || "",
      fileName: selectedFile ? selectedFile.name : "new-document.txt",
      fileSize: selectedFile ? selectedFile.size : 0,
      fileType: selectedFile ? selectedFile.type : "text/plain",
      category: category as DocumentCategory,
      status: "Draft",
      version: 1,
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiryDate: date ? date.toISOString() : undefined,
      linkedModule: linkedModule,
      tags: []
    };
    
    // Add the document to the context
    addDocument(newDocument);
    
    // Set the newly created document as selected
    setSelectedDocument(newDocument);
    
    toast({
      title: "Document created",
      description: "Your document has been created and is ready for editing.",
    });
    
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
            <DialogDescription>
              Create a new document that will be added to the repository. Fill in the required details below.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh] pr-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="file" className="text-right">
                  Document File (Optional)
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {selectedFile && (
                  <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md">
                    <FileUp className="h-4 w-4 text-blue-500" />
                    <div className="text-sm">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-gray-500">
                        {selectedFile.size < 1024
                          ? `${selectedFile.size} B`
                          : selectedFile.size < 1024 * 1024
                          ? `${(selectedFile.size / 1024).toFixed(2)} KB`
                          : `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="title">Document Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Enter document title"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={3} 
                  placeholder="Enter description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as DocumentCategory)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
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
                
                <div className="grid gap-2">
                  <Label htmlFor="linkedModule">Link to Module</Label>
                  <Select value={linkedModule} onValueChange={(value) => setLinkedModule(value as ModuleReference)}>
                    <SelectTrigger id="linkedModule">
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="haccp">HACCP</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="audits">Audits</SelectItem>
                      <SelectItem value="suppliers">Suppliers</SelectItem>
                      <SelectItem value="capa">CAPA</SelectItem>
                      <SelectItem value="traceability">Traceability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select expiry date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!category}>
              Create Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
