import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, FileText } from 'lucide-react';
import { useDocument } from '@/contexts/DocumentContext';
import { toast } from 'sonner';
import { Document } from '@/types/document';
import { supabase } from '@/integrations/supabase/client';

interface DocumentEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string | null;
}

const DocumentEditModal: React.FC<DocumentEditModalProps> = ({
  open,
  onOpenChange,
  documentId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    file: null as File | null,
    changeNotes: ''
  });

  const { documents, updateDocument } = useDocument();

  // Load document data when modal opens
  useEffect(() => {
    if (documentId && open) {
      setLoading(true);
      const doc = documents.find(d => d.id === documentId);
      if (doc) {
        setDocument(doc);
        setFormData({
          title: doc.title,
          description: doc.description || '',
          category: doc.category,
          file: null,
          changeNotes: ''
        });
      }
      setLoading(false);
    }
  }, [documentId, open, documents]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!document) {
      toast.error('Document not found');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // If a new file is uploaded, handle file upload and version creation
      if (formData.file) {
        // Generate a new file path
        const fileName = formData.file.name;
        const filePath = `${userId}/${crypto.randomUUID()}/${fileName}`;
        
        // Upload the new file
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, formData.file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) throw uploadError;
        
        // Create a new version entry first
        const { error: versionError } = await supabase
          .from('document_versions')
          .insert({
            document_id: document.id,
            file_name: document.file_name,
            file_size: document.file_size,
            version: document.version,
            created_by: userId,
            change_notes: formData.changeNotes || 'Document updated'
          });
        
        if (versionError) throw versionError;
        
        // Update the document with new file information
        const { error: updateError } = await supabase
          .from('documents')
          .update({
            title: formData.title,
            description: formData.description,
            category: formData.category as any,
            file_name: fileName,
            file_type: formData.file.type,
            file_size: formData.file.size,
            file_path: filePath,
            version: document.version + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', document.id);
        
        if (updateError) throw updateError;
      } else {
        // Just update metadata without file change
        const { error: updateError } = await supabase
          .from('documents')
          .update({
            title: formData.title,
            description: formData.description,
            category: formData.category as any,
            updated_at: new Date().toISOString()
          })
          .eq('id', document.id);
        
        if (updateError) throw updateError;
      }
      
      // Refresh the document context
      window.location.reload();
      
      onOpenChange(false);
      toast.success('Document updated successfully');
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(`Failed to update document: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
          <DialogDescription>
            Update document details and metadata
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="ml-2">Loading document...</p>
          </div>
        ) : document ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOP">SOP</SelectItem>
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="Form">Form</SelectItem>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                  <SelectItem value="Audit Report">Audit Report</SelectItem>
                  <SelectItem value="HACCP Plan">HACCP Plan</SelectItem>
                  <SelectItem value="Training Material">Training Material</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file">New Version (Optional)</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {formData.file ? (
                      <>
                        <FileText className="w-8 h-8 mb-2 text-blue-500" />
                        <p className="text-sm text-gray-500 text-center">
                          {formData.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Click to upload a new version
                        </p>
                        <p className="text-xs text-gray-500">
                          Current: {document.file_name}
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                  />
                </label>
              </div>
            </div>

            {formData.file && (
              <div className="space-y-2">
                <Label htmlFor="changeNotes">Version Notes</Label>
                <Textarea
                  id="changeNotes"
                  value={formData.changeNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, changeNotes: e.target.value }))}
                  placeholder="Describe what changed in this version"
                  rows={2}
                />
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="text-center py-6">
            <p>Document not found</p>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="mt-4"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentEditModal;