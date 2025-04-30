
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document } from '@/types/document';
import { useDocumentService } from '@/hooks/useDocumentService';
import { formatBytes, formatDatetime } from '@/lib/utils';
import { Download, Eye, FileText, Calendar, Clock, Tag, FileType } from 'lucide-react';
import DocumentVersionHistory from './DocumentVersionHistory';
import DocumentAccessControl from './DocumentAccessControl';
import DocumentComments from './DocumentComments';

interface DocumentViewerProps {
  document: Document;
  onClose?: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose }) => {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [loading, setLoading] = useState(false);
  const { getDownloadUrl } = useDocumentService();

  useEffect(() => {
    const fetchDownloadUrl = async () => {
      if (document) {
        setLoading(true);
        try {
          const url = await getDownloadUrl(document.id, document.file_name);
          setDownloadUrl(url);
        } catch (error) {
          console.error('Error getting download URL:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDownloadUrl();
  }, [document, getDownloadUrl]);

  const renderPreview = () => {
    if (loading) {
      return <div className="flex justify-center items-center p-12">Loading preview...</div>;
    }

    if (!downloadUrl) {
      return <div className="flex justify-center items-center p-12">Preview not available</div>;
    }

    if (document.file_type.includes('pdf')) {
      return (
        <iframe 
          src={`${downloadUrl}#toolbar=0&navpanes=0`}
          className="w-full h-[600px] border-0" 
          title={document.file_name}
        />
      );
    } else if (document.file_type.includes('image')) {
      return (
        <div className="flex justify-center p-4">
          <img 
            src={downloadUrl} 
            alt={document.file_name} 
            className="max-w-full max-h-[600px] object-contain" 
          />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-md">
          <FileText className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Preview not available</h3>
          <p className="text-sm text-gray-500 mb-4">
            This file type cannot be previewed directly in the browser.
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.open(downloadUrl, '_blank')}
            disabled={!downloadUrl}
          >
            <Download className="mr-2 h-4 w-4" />
            Download to view
          </Button>
        </div>
      );
    }
  };

  const renderDocumentDetails = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Category</h3>
            <p>{document.category}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <Badge 
              variant={document.status === 'Published' || document.status === 'Approved' ? 'success' : 
                     document.status === 'Draft' ? 'secondary' : 
                     document.status === 'Rejected' ? 'destructive' : 'outline'}
            >
              {document.status}
            </Badge>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="text-sm">{document.description || 'No description provided'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">File Name</h3>
            <p className="text-sm">{document.file_name}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">File Type</h3>
            <p className="text-sm">{document.file_type}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">File Size</h3>
            <p className="text-sm">{formatBytes(document.file_size)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Version</h3>
            <p className="text-sm">{document.version}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Created At</h3>
            <p className="text-sm">{formatDatetime(document.created_at)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
            <p className="text-sm">{document.updated_at ? formatDatetime(document.updated_at) : formatDatetime(document.created_at)}</p>
          </div>
          
          {document.expiry_date && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Expiry Date</h3>
              <p className="text-sm">{formatDatetime(document.expiry_date)}</p>
            </div>
          )}
          
          {document.tags && document.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tags</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {document.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{document.title}</CardTitle>
            <CardDescription>
              Document ID: {document.id}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button 
              size="sm" 
              onClick={() => window.open(downloadUrl || '', '_blank')}
              disabled={!downloadUrl}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mx-6">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="versions">Version History</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>
        
        <CardContent className="p-0">
          <TabsContent value="preview" className="px-6 py-4">
            {renderPreview()}
          </TabsContent>
          
          <TabsContent value="details" className="px-6 py-4">
            {renderDocumentDetails()}
          </TabsContent>
          
          <TabsContent value="versions" className="px-6 py-4">
            <DocumentVersionHistory documentId={document.id} />
          </TabsContent>
          
          <TabsContent value="comments" className="px-6 py-4">
            <DocumentComments documentId={document.id} />
          </TabsContent>
          
          <TabsContent value="access" className="px-6 py-4">
            <DocumentAccessControl documentId={document.id} />
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="border-t p-6 flex justify-between">
        <div className="text-sm text-muted-foreground">
          Created by {document.created_by} • Version {document.version}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open(downloadUrl || '', '_blank')}
          disabled={!downloadUrl}
        >
          <Eye className="mr-2 h-4 w-4" />
          Open in new tab
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentViewer;
