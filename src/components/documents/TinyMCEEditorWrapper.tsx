
import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Component renamed to better reflect its purpose
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
  // Initialize with empty string, not undefined
  const [editorData, setEditorData] = useState<string>(content || '');
  const editorRef = useRef<any>(null);
  const { toast } = useToast();

  // Debug function for tracking component lifecycle and data
  const debugLog = (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[RichTextEditor] ${message}`, data ? data : '');
    }
  };
  
  // Initialize editor data when content prop changes
  useEffect(() => {
    debugLog('Content prop changed', content);
    setEditorData(content || '');
  }, [content]);
  
  // Initialize editor session
  useEffect(() => {
    if (!documentId || readOnly || !supabase) {
      debugLog('Skipping session creation - conditions not met', { documentId, readOnly });
      return;
    }
    
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
        
        debugLog('Creating editor session', { document_id: documentId, user_id: user.id });
        
        const { data, error } = await supabase
          .from('document_editor_sessions')
          .insert({
            document_id: documentId,
            user_id: user.id, // Include the user ID
            is_active: true,
            session_data: { last_content: editorData }
          })
          .select('id')
          .single();
        
        if (error) {
          console.error('Error creating session:', error);
          throw error;
        }
        
        if (data) {
          debugLog('Session created successfully', data);
          setSessionId(data.id);
        }
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
    if (!documentId || !supabase || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(documentId)) {
      return;
    }
    
    try {
      debugLog('Fetching active users');
      
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
        
        debugLog('Active users fetched', userIds);
        
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
      debugLog('Closing editor session', sessionId);
      
      await supabase
        .from('document_editor_sessions')
        .update({
          is_active: false,
          last_activity: new Date().toISOString(),
          session_data: {
            last_content: editorRef.current ? editorRef.current.getContent() : editorData
          }
        })
        .eq('id', sessionId);
        
      debugLog('Session closed successfully');
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
  const handleEditorChange = (content: string) => {
    debugLog('Editor content changed', { contentLength: content?.length });
    setEditorData(content);
    
    if (onChange) onChange(content);
    
    // Debounce updates to reduce database load
    const timeoutId = setTimeout(() => {
      updateSessionActivity(content);
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  };

  // Handle successful initialization of TinyMCE
  const handleEditorInit = (evt: any, editor: any) => {
    debugLog('Editor initialized');
    editorRef.current = editor;
    setIsLoading(false);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      <div style={{ height: `${height}px` }} className="overflow-auto border rounded-md">
        <Editor
          apiKey="no-api-key" // Replace with your TinyMCE API key if you have one
          onInit={handleEditorInit}
          initialValue={editorData}
          value={editorData}
          onEditorChange={handleEditorChange}
          disabled={readOnly}
          init={{
            height,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            statusbar: false,
            branding: false,
            promotion: false
          }}
        />
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
