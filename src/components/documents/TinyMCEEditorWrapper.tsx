import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CKEditorWrapperProps {
  content: string;
  onChange?: (content: string) => void;
  documentId?: string;
  readOnly?: boolean;
  height?: number;
}

const CKEditorWrapper: React.FC<CKEditorWrapperProps> = ({
  content,
  onChange,
  documentId,
  readOnly = false,
  height = 500,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [editorContent, setEditorContent] = useState(content);
  const { toast } = useToast();

  // Initialize editor session
  useEffect(() => {
    if (!documentId || readOnly) return;

    const createSession = async () => {
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
            session_data: { last_content: content },
          })
          .select('id')
          .single();

        if (error) throw error;
        if (data) setSessionId(data.id);
      } catch (error) {
        console.error('Error creating editor session:', error);
      }
    };

    createSession();

    // Set up polling for active users
    const interval = setInterval(fetchActiveUsers, 30000);
    fetchActiveUsers();

    setIsLoading(false);

    return () => {
      clearInterval(interval);
      closeSession();
    };
  }, [documentId, readOnly, content]);

  // Fetch active users
  const fetchActiveUsers = async () => {
    if (!documentId) return;

    try {
      const { data, error } = await supabase
        .from('document_editor_sessions')
        .select('user_id')
        .eq('document_id', documentId)
        .eq('is_active', true);

      if (error) throw error;

      if (data) {
        const userIds = data.map((session) => session.user_id);
        setActiveUsers(userIds);

        // Show toast if other users are editing
        if (userIds.length > 1 && !readOnly) {
          toast({
            title: "Collaborative editing",
            description: `${userIds.length - 1} other ${
              userIds.length - 1 === 1 ? 'user is' : 'users are'
            } currently editing this document.`,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching active users:', error);
    }
  };

  // Close session when component unmounts
  const closeSession = async () => {
    if (!sessionId) return;

    try {
      await supabase
        .from('document_editor_sessions')
        .update({
          is_active: false,
          last_activity: new Date().toISOString(),
          session_data: {
            last_content: editorContent,
          },
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error closing session:', error);
    }
  };

  // Handle editor content change
  const handleEditorChange = (_event: any, editor: any) => {
    const newContent = editor.getData();
    setEditorContent(newContent);
    if (onChange) onChange(newContent);

    // Debounce updates to reduce database load
    setTimeout(() => updateSessionActivity(newContent), 5000);
  };

  // Update session activity on content change
  const updateSessionActivity = async (newContent: string) => {
    if (!sessionId) return;

    try {
      await supabase
        .from('document_editor_sessions')
        .update({
          last_activity: new Date().toISOString(),
          session_data: { last_content: newContent },
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      <CKEditor
        editor={ClassicEditor}
        data={editorContent}
        onChange={handleEditorChange}
        config={{
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'blockQuote',
            'undo',
            'redo',
          ],
          readOnly,
          height,
        }}
      />

      {activeUsers.length > 1 && !readOnly && (
        <div className="mt-2 p-2 bg-blue-50 text-blue-700 text-sm rounded">
          <span className="font-medium">Collaborative Mode:</span> {activeUsers.length - 1} other{' '}
          {activeUsers.length - 1 === 1 ? 'user is' : 'users are'} currently editing this document.
        </div>
      )}
    </div>
  );
};

export default CKEditorWrapper;
