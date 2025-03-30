
import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
  const [editorContent, setEditorContent] = useState(content);
  const editorRef = useRef<ReactQuill>(null);
  const { toast } = useToast();
  
  // Initialize editor session
  useEffect(() => {
    if (!documentId || readOnly) return;
    
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
            last_content: editorContent
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
  const handleEditorChange = (value: string) => {
    setEditorContent(value);
    if (onChange) onChange(value);
    
    // Debounce updates to reduce database load
    const timeoutId = setTimeout(() => {
      updateSessionActivity(value);
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  };

  // Quill editor modules and formats
  const modules = {
    toolbar: toolbar ? JSON.parse(toolbar) : [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'color', 'background',
    'align',
    'link', 'image'
  ];

  const editorStyle = {
    height: `${height}px`,
    width: '100%',
    marginBottom: '20px',
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      <ReactQuill
        ref={editorRef}
        theme="snow"
        value={editorContent}
        onChange={handleEditorChange}
        modules={modules}
        formats={formats}
        style={editorStyle}
        readOnly={readOnly}
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
