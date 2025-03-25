
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useDocuments } from '@/contexts/DocumentContext';
import { CalendarIcon, File, Loader2, Upload } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Document } from '@/types/supabase';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: { id: string; name: string }[];
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({ 
  open, 
  onOpenChange,
  folders 
}) => {
  const { categories, addDocument } = useDocuments();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [folder, setFolder] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      
      // If no title is set yet, use the file name as title (without extension)
      if (!title) {
        const fileName = file.name.split('.').slice(0, -1).join('.');
        setTitle(fileName);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !title || !category) return;

    setIsUploading(true);
    
    try {
      // In a real implementation, you would upload the file to storage
      // For now, we're just storing metadata
      const newDocument: Partial<Document> = {
        title,
        description,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        file_type: selectedFile.type,
        category_id: category,
        folder_id: folder || undefined,
        status: 'Draft',
        version: 1,
        created_by: 'Current User', // Replace with actual user when auth is implemented
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expiry_date: expiryDate ? expiryDate.toISOString() : undefined,
      };
      
      const result = await addDocument(newDocument);
      
      if (result) {
        // Reset form
        setTitle('');
        setDescription('');
        setCategory('');
        setFolder('');
        setExpiryDate(undefined);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Document</DialogTitle>
          <DialogDescription>
            Add a new document to your compliance repository.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="Enter document title"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Enter document description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="folder" className="text-right">
              Folder
            </Label>
            <Select value={folder} onValueChange={setFolder}>
              <SelectTrigger id="folder" className="col-span-3">
                <SelectValue placeholder="Select folder (optional)" />
              </SelectTrigger>
              <SelectContent>
                {folders.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiry-date" className="text-right">
              Expiry Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="expiry-date"
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !expiryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "PPP") : <span>Select expiry date (optional)</span>}
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              Document File
            </Label>
            <div className="col-span-3">
              <Input
                id="file"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile ? (
                <div className="flex items-center p-2 border rounded-md">
                  <File className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="flex-1 truncate">{selectedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={!selectedFile || !title || !category || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Document'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
