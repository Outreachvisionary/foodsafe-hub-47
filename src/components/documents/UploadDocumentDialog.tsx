
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentCategory, DocumentStatus, Document } from '@/types/database';
import { useDocuments } from '@/contexts/DocumentContext';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { FilePlus, Upload, Calendar, Tag, X } from 'lucide-react';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({ open, onOpenChange }) => {
  const { addDocument } = useDocuments();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'SOP' as DocumentCategory,
  });
  const [file, setFile] = useState<File | null>(null);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (value: DocumentCategory) => {
    setFormData({ ...formData, category: value });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for the document",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // In a real implementation, you'd upload the file to a storage service
      // and then save the metadata to your database
      
      // Create new document with database property names
      const newDocument: Omit<Document, 'id'> = {
        title: formData.title,
        description: formData.description,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        category: formData.category,
        status: 'Draft' as DocumentStatus,
        version: 1,
        created_by: 'Current User', // In a real app, this would be the current user
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expiry_date: expiryDate ? new Date(expiryDate).toISOString() : undefined,
        tags: tags
      };

      // Add the document
      await addDocument(newDocument);
      
      // Reset form and close dialog
      setFormData({
        title: '',
        description: '',
        category: 'SOP' as DocumentCategory,
      });
      setFile(null);
      setExpiryDate('');
      setTags([]);
      onOpenChange(false);
      
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            Upload Document
          </DialogTitle>
          <DialogDescription>
            Upload a new document to the document management system.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter document title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter document description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
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
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <Input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <div key={tag} className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                  <span className="text-sm">{tag}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <Input
                id="tagInput"
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className="flex-grow"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddTag}
                className="ml-2 flex items-center"
                disabled={!tagInput.trim()}
              >
                <Tag className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="file">File</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="flex-grow"
              />
            </div>
            {file && (
              <p className="text-sm text-gray-500">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !file || !formData.title.trim()}
              className="flex items-center"
            >
              {uploading ? 
                "Uploading..." : 
                <>
                  <FilePlus className="h-4 w-4 mr-1" />
                  Upload Document
                </>
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
