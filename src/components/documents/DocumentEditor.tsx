import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  Save,
  History,
  Send,
  MessageSquare,
  User,
  Clock,
  FileText,
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
  const editorRef = useRef<any>(null);
  const { toast } = useToast();

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
            last_content: editorRef.current ? editorRef.current.getData() : content
          }
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  };

  const handleEditorChange = (_event: any, editor: any) => {
    const newContent = editor.getData();
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
      const updatedContent = editorRef.current ? editorRef.current.getData() : content;

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
      const updatedContent = editorRef.current ? editorRef.current.getData() : content;

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
            {!readOnly && (
              <>
                <Button
                  variant="outline"
                  onClick={handleSubmitForReview}
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send />}
                  Submit for Review
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save />}
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-grow overflow-hidden">
        <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Tabs */}
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Editor Tab */}
          <TabsContent value="edit" className="flex-grow overflow-auto">
            <CKEditor
              editor={ClassicEditor}
              data={content}
              onReady={(editor) => (editorRef.current = editor)}
              onChange={handleEditorChange}
              config={{
                toolbar: ['heading', '|', 'bold', 'italic', 'link', '|', 'undo', 'redo'],
                readOnly
              }}
            />
          </TabsContent>

          {/* Comments Tab */}
          {/* Add comments section here */}

          {/* History Tab */}
          {/* Add history section here */}
          
        </Tabs>
      </CardContent>

      {/* Footer */}
      <CardFooter>Last updated at {new Date().toLocaleString()}</CardFooter>
    </Card>
  );
};

export default DocumentEditor;
