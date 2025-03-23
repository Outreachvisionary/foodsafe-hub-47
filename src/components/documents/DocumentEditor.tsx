
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  History, 
  Send, 
  MessageSquare, 
  User, 
  Clock, 
  FileText, 
  CheckCircle
} from 'lucide-react';
import { Document, DocumentStatus } from '@/types/document';

interface DocumentEditorProps {
  document: Document | null;
  onSave?: (updatedDoc: Document) => void;
  onSubmitForReview?: (doc: Document) => void;
  readOnly?: boolean;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ 
  document, 
  onSave, 
  onSubmitForReview,
  readOnly = false
}) => {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('edit');
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      // In a real implementation, content would be fetched from the API
      setContent(document.description || 'Sample document content. This would be the full text of the document.');
    }
  }, [document]);

  const handleSave = () => {
    if (!document) return;
    
    const updatedDoc = {
      ...document,
      title,
      description: content,
      updatedAt: new Date().toISOString()
    };
    
    onSave?.(updatedDoc);
    
    toast({
      title: "Document saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleSubmitForReview = () => {
    if (!document) return;
    
    const docForReview = {
      ...document,
      title,
      description: content,
      status: 'Pending Approval' as DocumentStatus,
      updatedAt: new Date().toISOString()
    };
    
    onSubmitForReview?.(docForReview);
    
    toast({
      title: "Submitted for review",
      description: "Document has been submitted for review and approval.",
    });
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to the document.",
    });
    
    setComment('');
  };

  if (!document) {
    return <div>No document selected</div>;
  }

  return (
    <Card className="h-full flex flex-col animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">
            {readOnly ? (
              <div className="flex items-baseline gap-2">
                <span>{title}</span>
                <Badge className="ml-2" variant={document.status === 'Published' ? 'default' : 'outline'}>
                  {document.status}
                </Badge>
              </div>
            ) : (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-semibold"
                disabled={readOnly}
              />
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">v{document.version}</Badge>
            {document.status === 'Draft' && !readOnly && (
              <Button variant="outline" onClick={handleSubmitForReview} className="flex items-center gap-1">
                <Send className="h-4 w-4" />
                <span>Submit for Review</span>
              </Button>
            )}
            {!readOnly && (
              <Button onClick={handleSave} className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                <span>Save</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList>
            <TabsTrigger value="edit" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{readOnly ? 'View' : 'Edit'}</span>
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>Comments</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="flex-grow overflow-auto">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[500px] font-mono resize-none p-4"
              placeholder="Enter document content..."
              disabled={readOnly}
            />
          </TabsContent>
          
          <TabsContent value="comments" className="h-full flex flex-col">
            <div className="flex-grow overflow-auto border rounded-md p-4 mb-4">
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="bg-blue-100 rounded-full p-1">
                      <User className="h-4 w-4 text-blue-700" />
                    </div>
                    <span className="font-medium">Jane Smith</span>
                    <span className="text-gray-500 text-sm">• 2 days ago</span>
                  </div>
                  <p className="text-gray-700">Please update section 3.2 to include the new sanitation procedures.</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="bg-green-100 rounded-full p-1">
                      <User className="h-4 w-4 text-green-700" />
                    </div>
                    <span className="font-medium">John Doe</span>
                    <span className="text-gray-500 text-sm">• 1 day ago</span>
                  </div>
                  <p className="text-gray-700">Added the requested changes to section 3.2 and updated references.</p>
                </div>
              </div>
            </div>
            
            {/* Comment input */}
            <div className="flex gap-2">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="resize-none"
              />
              <Button onClick={handleAddComment} className="self-end">Add Comment</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="h-full overflow-auto">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Version 3 (Current)</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Updated {new Date(document.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge>Current</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-2">Updated procedures in section 4.1</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm">Restore</Button>
                </div>
              </div>
              
              <div className="border-b pb-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Version 2</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Updated 2023-09-15</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Added compliance references and updated formatting</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm">Restore</Button>
                  <Button variant="outline" size="sm">Compare with Current</Button>
                </div>
              </div>
              
              <div className="pb-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Version 1</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Created 2023-06-10</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Initial document creation</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm">Restore</Button>
                  <Button variant="outline" size="sm">Compare with Current</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between text-sm text-gray-500 pt-2 border-t">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          <span>Last edited by: {document.createdBy}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Last updated: {new Date(document.updatedAt).toLocaleString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentEditor;
