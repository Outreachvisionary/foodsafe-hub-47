
import React, { useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  documentId: string;
  readOnly?: boolean;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  documentId,
  readOnly = false,
  height = 400,
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (newContent: string) => {
    onChange(newContent);
  };

  useEffect(() => {
    if (editorRef.current) {
      // You could save the editor instance or perform additional setup
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [documentId]);

  const uploadHandler = async (blobInfo: any, progress: (percent: number) => void) => {
    try {
      // Here you would implement file upload logic
      // using Supabase Storage or another service
      
      // For now, convert to base64 for demo purposes
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.readAsDataURL(blobInfo.blob());
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  return (
    <Editor
      apiKey="your-tinymce-api-key" // You should use an environment variable for this
      onInit={(evt, editor) => {
        editorRef.current = editor;
      }}
      initialValue={content}
      value={content}
      onEditorChange={handleEditorChange}
      init={{
        height,
        menubar: !readOnly,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar: readOnly 
          ? false 
          : 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        readonly: readOnly,
        branding: false,
        images_upload_handler: uploadHandler,
        automatic_uploads: true,
        file_picker_types: 'image',
        file_picker_callback: (callback, value, meta) => {
          // Here you would implement a file picker callback
          // This is just a placeholder
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          
          input.onchange = () => {
            const file = input.files?.[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = () => {
              const id = 'blobid' + (new Date()).getTime();
              const blobCache = editorRef.current.editorUpload.blobCache;
              const base64 = (reader.result as string).split(',')[1];
              const blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);
              
              callback(blobInfo.blobUri(), { title: file.name });
            };
            reader.readAsDataURL(file);
          };
          
          input.click();
        }
      }}
    />
  );
};

export default RichTextEditor;
