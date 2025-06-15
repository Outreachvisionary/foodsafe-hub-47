
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from 'sonner';
import { DocumentCategory, DocumentStatus } from '@/types/enums';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderPath?: string;
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({
  open,
  onOpenChange,
  folderPath = '/'
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategory>(DocumentCategory.Other);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  
  const { createDocument, isCreating } = useDocuments();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Auto-fill title if not set
      if (!title) {
        setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
      }
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile || !title || !category) {
      toast.error('Please fill in all required fields and select a file');
      return;
    }
    
    try {
      // Determine initial status based on approval requirement
      const initialStatus: DocumentStatus = requiresApproval ? DocumentStatus.Pending_Review : DocumentStatus.Draft;
      
      // Create document with proper integration
      const newDoc = {
        title,
        description,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        file_type: selectedFile.type,
        file_path: folderPath,
        category: category,
        status: initialStatus,
        version: 1,
        created_by: 'current_user', // TODO: Get from auth context
        expiry_date: expiryDate || undefined,
        approvers: requiresApproval ? ['approver1', 'approver2'] : [], // TODO: Get from form or default approvers
        tags: [],
        pending_since: requiresApproval ? new Date().toISOString() : undefined
      };
      
      await createDocument(newDoc);
      
      toast.success(
        requiresApproval 
          ? 'Document uploaded and sent for approval' 
          : 'Document uploaded successfully'
      );
      
      // Reset form
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory(DocumentCategory.Other);
    setSelectedFile(null);
    setRequiresApproval(false);
    setExpiryDate('');
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Document description"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as DocumentCategory)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DocumentCategory).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry-date">Expiry Date (Optional)</Label>
            <Input
              id="expiry-date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="requires-approval"
              checked={requiresApproval}
              onCheckedChange={setRequiresApproval}
            />
            <Label htmlFor="requires-approval">Requires Approval</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">File *</Label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOCX, XLSX (MAX. 10MB)
                  </p>
                </div>
                <Input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.xlsx,.doc,.xls,.txt"
                />
              </label>
            </div>
            {selectedFile && (
              <div className="text-sm text-gray-500 mt-1">
                Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </div>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Upload location: {folderPath}
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!title || !category || !selectedFile || isCreating}
          >
            {isCreating ? 'Uploading...' : 'Upload Document'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
