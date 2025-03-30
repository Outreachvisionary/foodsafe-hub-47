
import React, { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Rename the component to better reflect its purpose
interface RichTextEditorProps {
  content: string;
  onChange?: (content: string) => void;
  documentId?: string;
  readOnly?: boolean;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  documentId,
  readOnly = false,
  height = 500,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const editorRef = useRef<any>(null);
  const { toast } = useToast();
  
  // Initialize editor session
  useEffect(() => {
    if (!documentId || readOnly || !supabase) return;
    
    // Only attempt to create a session if documentId is a valid UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(documentId)) {
      console.log('Invalid document ID format for editor session:', documentId);
      return;
    }
    
    const createSession = async () => {
      try {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No authenticated user found');
          return;
        }
        
        const { data, error } = await supabase
          .from('document_editor_sessions')
          .insert({
            document_id: documentId,
            user_id: user.id, // Include the user ID
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
    
    createSession();
    
    // Set up polling for active users
    const interval = setInterval(fetchActiveUsers, 30000);
    fetchActiveUsers();
    
    return () => {
      clearInterval(interval);
      closeSession();
    };
  }, [documentId, readOnly, content]);
  
  // Fetch active users
  const fetchActiveUsers = async () => {
    if (!documentId || !supabase || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(documentId)) return;
    
    try {
      const { data, error } = await supabase
        .from('document_editor_sessions')
        .select('user_id')
        .eq('document_id', documentId)
        .eq('is_active', true);
      
      if (error) throw error;
      
      if (data) {
        // Fetch user info for each active user
        const userIds = data.map(session => session.user_id);
        setActiveUsers(userIds);
        
        // If multiple users, show toast
        if (userIds.length > 1 && !readOnly) {
          toast({
            title: "Collaborative editing",
            description: `${userIds.length - 1} other ${userIds.length - 1 === 1 ? 'user is' : 'users are'} currently editing this document.`,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching active users:', error);
    }
  };
  
  // Close session when component unmounts
  const closeSession = async () => {
    if (!sessionId || !supabase) return;
    
    try {
      await supabase
        .from('document_editor_sessions')
        .update({
          is_active: false,
          last_activity: new Date().toISOString(),
          session_data: {
            last_content: editorInstance ? editorInstance.getData() : content
          }
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error closing session:', error);
    }
  };
  
  // Update session activity on content change
  const updateSessionActivity = async (newContent: string) => {
    if (!sessionId || !supabase) return;
    
    try {
      await supabase
        .from('document_editor_sessions')
        .update({
          last_activity: new Date().toISOString(),
          session_data: { last_content: newContent }
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };
  
  // Handle editor content change
  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    
    if (onChange) onChange(data);
    
    // Debounce updates to reduce database load
    const timeoutId = setTimeout(() => {
      updateSessionActivity(data);
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      <div style={{ height: `${height}px` }} className="overflow-auto border rounded-md">
        {content !== undefined && (
          <CKEditor
            editor={ClassicEditor}
            data={content || ''}
            onReady={(editor) => {
              console.log('Editor is ready to use!', editor);
              editorRef.current = editor;
              setEditorInstance(editor);
              setIsLoading(false);
              
              // Set read-only state after editor is ready
              if (readOnly) {
                editor.isReadOnly = true;
              }
            }}
            onChange={handleEditorChange}
            config={{
              toolbar: [
                'heading', '|', 
                'bold', 'italic', 'link', '|',
                'bulletedList', 'numberedList', '|',
                'blockQuote', 'insertTable', '|',
                'undo', 'redo'
              ],
              placeholder: 'Type your content here...'
            }}
          />
        )}
      </div>
      
      {activeUsers.length > 1 && !readOnly && (
        <div className="mt-2 p-2 bg-blue-50 text-blue-700 text-sm rounded">
          <span className="font-medium">Collaborative Mode:</span> {activeUsers.length - 1} other {activeUsers.length - 1 === 1 ? 'user is' : 'users are'} currently editing this document.
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
