
import React from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (value: string) => void;
  documentId?: string;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content, 
  onChange, 
  documentId, 
  height = 300 
}) => {
  return (
    <div style={{ height: `${height}px` }} className="border rounded-md">
      <textarea
        className="w-full h-full p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter content here..."
      />
    </div>
  );
};

export default RichTextEditor;
