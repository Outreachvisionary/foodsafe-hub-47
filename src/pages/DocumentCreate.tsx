
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocument } from '@/contexts/DocumentContext';
import { DocumentCategory, DocumentStatus } from '@/types/document';
import { toast } from 'sonner';
import { FileText, Save, X, Upload } from 'lucide-react';

const DocumentCreate: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Other');
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tags, setTags] = useState('');
  const [creating, setCreating] = useState(false);
  
  const { createDocument } = useDocument();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Auto-fill title if not set
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreating(true);

    try {
      const initialStatus: DocumentStatus = requiresApproval ? 'Pending_Approval' : 'Draft';
      
      const newDocument = {
        title: title.trim(),
        description: description.trim(),
        file_name: selectedFile ? selectedFile.name : `${title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`,
        file_type: selectedFile ? selectedFile.type : 'text/plain',
        file_size: selectedFile ? selectedFile.size : 0,
        category: category,
        status: initialStatus,
        version: 1,
        created_by: 'current_user', // TODO: Get from auth context
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        approvers: requiresApproval ? ['approver1', 'approver2'] : [], // TODO: Get from form or default approvers
        file_path: '/',
      };

      await createDocument(newDocument);
      
      toast.success(requiresApproval 
        ? 'Document created and sent for approval' 
        : 'Document created successfully'
      );
      
      navigate('/documents');
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document');
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    navigate('/documents');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <FileText className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Create New Document</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter document title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter document description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as DocumentCategory)} required>
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

              <div className="space-y-2">
                <Label htmlFor="file">File (Optional)</Label>
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

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter tags separated by commas"
                />
                <p className="text-sm text-muted-foreground">
                  Separate multiple tags with commas
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="requires-approval"
                  checked={requiresApproval}
                  onCheckedChange={setRequiresApproval}
                />
                <Label htmlFor="requires-approval">Requires Approval</Label>
                <p className="text-sm text-muted-foreground ml-2">
                  Document will go through approval workflow before publication
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={creating || !title.trim() || !category}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {creating ? 'Creating...' : 'Create Document'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={creating}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentCreate;
