
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDocument } from '@/contexts/DocumentContext';
import { Upload } from 'lucide-react';

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
  const [category, setCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const { createDocument } = useDocument();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    
    try {
      // Implementation would go here
      console.log('Uploading document', {
        title,
        description,
        category,
        file: selectedFile,
        folderPath
      });
      
      // Mock document creation
      const newDoc = {
        id: Date.now().toString(),
        title,
        description,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        file_type: selectedFile.type,
        category,
        status: 'Draft',
        version: 1,
        created_by: 'current_user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_locked: false,
        file_path: folderPath
      };
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setSelectedFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
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
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
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
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
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
                />
              </label>
            </div>
            {selectedFile && (
              <div className="text-sm text-gray-500 mt-1">
                Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!title || !category || !selectedFile || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
