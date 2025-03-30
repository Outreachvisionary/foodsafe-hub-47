
import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TinyMCEEditorWrapperProps {
  content: string;
  onChange?: (content: string) => void;
  documentId?: string;
  readOnly?: boolean;
  height?: number;
  plugins?: string[];
  toolbar?: string;
}

const TinyMCEEditorWrapper: React.FC<TinyMCEEditorWrapperProps> = ({
  content,
  onChange,
  documentId,
  readOnly = false,
  height = 500,
  plugins,
  toolbar
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const editorRef = useRef<any>(null);
  const { toast } = useToast();
  
  // Initialize editor session
  useEffect(() => {
    if (!documentId || readOnly) return;
    
    const createSession = async () => {
      try {
        const { data, error } = await supabase
          .from('document_editor_sessions')
          .insert({
            document_id: documentId,
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
  }, [documentId, readOnly]);
  
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
    if (!sessionId) return;
    
    try {
      await supabase
        .from('document_editor_sessions')
        .update({
          is_active: false,
          last_activity: new Date().toISOString(),
          session_data: {
            last_content: editorRef.current ? editorRef.current.getContent() : content
          }
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error closing session:', error);
    }
  };
  
  // Update session activity on content change
  const updateSessionActivity = async (newContent: string) => {
    if (!sessionId) return;
    
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
  const handleEditorChange = (content: string) => {
    if (onChange) onChange(content);
    
    // Debounce updates to reduce database load
    const timeoutId = setTimeout(() => {
      updateSessionActivity(content);
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  };

  const defaultPlugins = [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
    'template'
  ];

  const defaultToolbar = 'undo redo | blocks | ' +
    'bold italic forecolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat | help';

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      <Editor
        apiKey="no-api-key" // You can use without an API key for testing or add your own
        onInit={(evt, editor) => {
          editorRef.current = editor;
          setIsLoading(false);
        }}
        initialValue={content}
        onEditorChange={handleEditorChange}
        disabled={readOnly}
        init={{
          height,
          menubar: true,
          plugins: plugins || defaultPlugins,
          toolbar: toolbar || defaultToolbar,
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          resize: false,
          branding: false,
          promotion: false,
          statusbar: true,
          readonly: readOnly
        }}
      />
      
      {activeUsers.length > 1 && !readOnly && (
        <div className="mt-2 p-2 bg-blue-50 text-blue-700 text-sm rounded">
          <span className="font-medium">Collaborative Mode:</span> {activeUsers.length - 1} other {activeUsers.length - 1 === 1 ? 'user is' : 'users are'} currently editing this document.
        </div>
      )}
    </div>
  );
};

export default TinyMCEEditorWrapper;
