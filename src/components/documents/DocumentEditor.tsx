import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from './TinyMCEEditorWrapper';
import { 
  Save, 
  History, 
  Send, 
  MessageSquare, 
  User, 
  Clock, 
  FileText, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Document, DocumentStatus } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.description || '');
      
      if (!readOnly && document.id) {
        createEditorSession(document.id);
      }
    }
    
    return () => {
      if (sessionId) {
        closeEditorSession(sessionId);
      }
    };
  }, [document, readOnly]);

  const createEditorSession = async (documentId: string) => {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(documentId)) {
      console.log('Skipping editor session creation for invalid document ID:', documentId);
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        return;
      }
      
      const { data, error } = await supabase
        .from('document_editor_sessions')
        .insert({
          document_id: documentId,
          user_id: user.id,
          is_active: true,
          session_data: { last_content: content }
        })
        .select('id')
        .single();
      
      if (error) throw error;
      if (data) setSessionId(data.id);
    } catch (error) {
      console.error('Error creating editor session:', error);
    }
  };

  const closeEditorSession = async (id: string) => {
    try {
      await supabase
        .from('document_editor_sessions')
        .update({
          is_active: false,
          last_activity: new Date().toISOString()
        })
        .eq('id', id);
    } catch (error) {
      console.error('Error closing editor session:', error);
    }
  };

  const updateSessionActivity = async () => {
    if (!sessionId) return;
    
    try {
      await supabase
        .from('document_editor_sessions')
        .update({
          last_activity: new Date().toISOString(),
          session_data: {
            last_content: editorRef.current ? editorRef.current.getContent() : content
          }
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  };

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
    const timeoutId = setTimeout(() => {
      updateSessionActivity();
    }, 5000);
    return () => clearTimeout(timeoutId);
  };

  const handleSave = async () => {
    if (!document) return;
    setIsLoading(true);
    
    try {
      const updatedContent = editorRef.current ? editorRef.current.getContent() : content;
      
      const updatedDoc = {
        ...document,
        title,
        description: updatedContent,
        updated_at: new Date().toISOString()
      };
      
      onSave?.(updatedDoc);
      
      if (document.current_version_id) {
        await supabase
          .from('document_versions')
          .update({
            editor_metadata: {
              last_saved: new Date().toISOString(),
              editor: 'ckeditor'
            }
          })
          .eq('id', document.current_version_id);
      }
      
      toast({
        title: "Document saved",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: "Error saving document",
        description: "There was a problem saving your changes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForReview = () => {
    if (!document) return;
    setIsLoading(true);
    
    try {
      const updatedContent = editorRef.current ? editorRef.current.getContent() : content;
      
      const docForReview = {
        ...document,
        title,
        description: updatedContent,
        status: 'Pending Approval' as DocumentStatus,
        updated_at: new Date().toISOString()
      };
      
      onSubmitForReview?.(docForReview);
      
      toast({
        title: "Submitted for review",
        description: "Document has been submitted for review and approval.",
      });
    } catch (error) {
      console.error('Error submitting document for review:', error);
      toast({
        title: "Error submitting document",
        description: "There was a problem submitting your document for review.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
              <Button 
                variant="outline" 
                onClick={handleSubmitForReview} 
                className="flex items-center gap-1"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span>Submit for Review</span>
              </Button>
            )}
            {!readOnly && (
              <Button 
                onClick={handleSave} 
                className="flex items-center gap-1"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
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
            <RichTextEditor
              content={content}
              onChange={handleEditorChange}
              readOnly={readOnly}
              documentId={document.id}
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
            
            <div className="flex gap-2">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow"
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
                      <span>Updated {document.updated_at ? new Date(document.updated_at).toLocaleDateString() : 'Unknown'}</span>
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
          <span>Last edited by: {document.created_by}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Last updated: {document.updated_at ? new Date(document.updated_at).toLocaleString() : 'Unknown'}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentEditor;
