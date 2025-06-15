
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocument } from '@/contexts/DocumentContext';
import { useNavigate } from 'react-router-dom';
import { DocumentCategory, DocumentStatus } from '@/types/document';
import { toast } from 'sonner';
import { FileText, Save, X } from 'lucide-react';

const CreateDocumentForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Other');
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [creating, setCreating] = useState(false);
  
  const { createDocument } = useDocument();
  const navigate = useNavigate();

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
        file_name: `${title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`,
        file_type: 'text/plain',
        file_size: content.length,
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
                    <SelectItem value="Risk Assessment">Risk Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter document content"
                  rows={8}
                />
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

export default CreateDocumentForm;
