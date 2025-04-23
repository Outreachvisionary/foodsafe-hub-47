
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Document } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Calendar, 
  Tag, 
  FileText, 
  Edit, 
  Trash, 
  Lock, 
  Unlock,
  Clock,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface DocumentViewerProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (document: Document) => void;
  onDelete?: (document: Document) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('');

  useEffect(() => {
    if (open && document) {
      // Determine file type for proper preview
      const determineFileType = () => {
        const fileName = document.file_name?.toLowerCase() || '';
        const mimeType = document.file_type?.toLowerCase() || '';
        
        if (mimeType.includes('pdf') || fileName.endsWith('.pdf')) {
          return 'pdf';
        } else if (mimeType.includes('image') || 
                  ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].some(ext => fileName.endsWith(ext))) {
          return 'image';
        } else if (mimeType.includes('text') || 
                  ['.txt', '.md', '.csv'].some(ext => fileName.endsWith(ext))) {
          return 'text';
        } else {
          return 'other';
        }
      };
      
      setFileType(determineFileType());
      
      // Try to get the document URL for preview
      if (document.file_path) {
        setPreview(document.file_path);
      }
    }
  }, [open, document]);

  const handleDownload = async () => {
    try {
      // Create a download link and click it
      const link = document.file_path;
      const a = document.createElement('a');
      a.href = link;
      a.download = document.file_name || document.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: `Downloading ${document.title}`,
      });
    } catch (error: any) {
      console.error('Error downloading document:', error);
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download document.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'pending approval':
      case 'pending_approval':  
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved':
      case 'published':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'archived':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const renderPreview = () => {
    if (!preview) {
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-md border border-dashed border-gray-300">
          <FileText className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500">No preview available</p>
        </div>
      );
    }

    switch (fileType) {
      case 'pdf':
        return (
          <div className="h-[500px] w-full overflow-hidden rounded-md border border-gray-200">
            <iframe
              src={`${preview}#toolbar=0`}
              className="h-full w-full"
              title={document.title}
            />
          </div>
        );
      case 'image':
        return (
          <div className="flex items-center justify-center bg-gray-50 rounded-md p-4 border border-gray-200">
            <img
              src={preview}
              alt={document.title}
              className="max-h-[500px] max-w-full object-contain"
            />
          </div>
        );
      case 'text':
        return (
          <div className="h-[500px] w-full overflow-auto p-4 rounded-md bg-gray-50 border border-gray-200 font-mono text-sm">
            Loading text content...
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-md border border-dashed border-gray-300">
            <FileText className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500">Preview not available for this file type</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" /> Download to View
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{document.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Badge 
              className={cn("font-medium border", getStatusBadgeColor(document.status))}
            >
              {document.status}
            </Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{document.category}</span>
            {document.is_locked && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="flex items-center text-amber-600 text-sm">
                  <Lock className="h-3 w-3 mr-1" /> Locked
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {document.description && (
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <p className="text-sm text-blue-800">{document.description}</p>
            </div>
          )}
          
          {/* Document metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="flex items-start gap-2 text-sm">
              <User className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Created by</p>
                <p className="text-gray-600">{document.created_by || 'Unknown'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Created at</p>
                <p className="text-gray-600">
                  {document.created_at ? format(new Date(document.created_at), 'PPP') : 'Unknown'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Last updated</p>
                <p className="text-gray-600">
                  {document.updated_at ? format(new Date(document.updated_at), 'PPP') : 'Unknown'}
                </p>
              </div>
            </div>
            
            {document.expiry_date && (
              <div className="flex items-start gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Expiry date</p>
                  <p className="text-gray-600">
                    {format(new Date(document.expiry_date), 'PPP')}
                  </p>
                </div>
              </div>
            )}
            
            {document.tags && document.tags.length > 0 && (
              <div className="flex items-start gap-2 text-sm md:col-span-2">
                <Tag className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Tags</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {document.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Document preview */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Document Preview</p>
            {renderPreview()}
          </div>
        </div>

        <DialogFooter className="mt-6 flex gap-2 justify-between sm:justify-between">
          <div>
            {onDelete && (
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                  onOpenChange(false);
                  onDelete(document);
                }}
              >
                <Trash className="h-4 w-4 mr-2" /> Delete
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            {onEdit && (
              <Button 
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(document);
                }}
                disabled={document.is_locked}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            )}
            
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
