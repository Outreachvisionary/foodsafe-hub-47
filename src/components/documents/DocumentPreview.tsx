import React, { useState, useEffect } from 'react';
import { Document as PDFDocument, Page, pdfjs } from 'react-pdf';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types/document';

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentPreviewProps {
  document: Document;
  versionId?: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, versionId }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [previewType, setPreviewType] = useState<'pdf' | 'image' | 'text' | 'other'>('other');

  useEffect(() => {
    if (!document) return;

    const fetchFile = async () => {
      setLoading(true);
      try {
        // Determine which file path to use (current or specific version)
        const filePath = versionId 
          ? `${document.created_by}/${document.id}/${versionId}/${document.file_name}`
          : `${document.created_by}/${document.id}/${document.file_name}`;

        // Generate a signed URL for the file
        const { data, error } = await supabase
          .storage
          .from('documents')
          .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
        
        if (error) throw error;
        
        setFileUrl(data.signedUrl);

        // Set preview type based on file extension
        const fileExt = document.file_name.split('.').pop()?.toLowerCase();
        if (fileExt === 'pdf') {
          setPreviewType('pdf');
        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt || '')) {
          setPreviewType('image');
        } else if (['txt', 'md', 'csv', 'json'].includes(fileExt || '')) {
          setPreviewType('text');
        } else {
          setPreviewType('other');
        }
      } catch (error) {
        console.error('Error fetching file:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [document, versionId]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const handlePrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (numPages) {
      setPageNumber(prev => Math.min(prev + 1, numPages));
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleDownload = async () => {
    if (!fileUrl) return;
    
    try {
      // Create an anchor and trigger download
      const link = window.document.createElement('a');
      link.href = fileUrl;
      link.download = document.file_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8" />
        <span className="ml-2">Loading document preview...</span>
      </div>
    );
  }

  if (!fileUrl) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <Eye className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Preview Not Available</h3>
          <p className="text-muted-foreground text-center max-w-md mt-2">
            This document cannot be previewed. Try downloading it to view its contents.
          </p>
          <Button className="mt-4" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download File
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">{document.title}</h3>
          <p className="text-sm text-muted-foreground">
            {document.file_name} ({(document.file_size / 1024).toFixed(2)} KB)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm mx-1">{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="preview">
        <TabsList className="mb-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="border rounded-lg p-2">
          {previewType === 'pdf' ? (
            <div className="flex flex-col items-center">
              <PDFDocument
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<Spinner className="h-8 w-8" />}
                error={<div>Failed to load PDF</div>}
              >
                <Page 
                  pageNumber={pageNumber} 
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </PDFDocument>
              
              {numPages && numPages > 1 && (
                <div className="flex items-center justify-center mt-4 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={pageNumber <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm">
                    Page {pageNumber} of {numPages}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!numPages || pageNumber >= numPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : previewType === 'image' ? (
            <div className="flex justify-center">
              <img 
                src={fileUrl} 
                alt={document.title} 
                style={{ maxWidth: '100%', transform: `scale(${scale})` }}
                className="max-h-[70vh] object-contain"
              />
            </div>
          ) : previewType === 'text' ? (
            <iframe 
              src={fileUrl} 
              title={document.title}
              className="w-full h-[70vh] border-0"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <Eye className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Preview Not Available</h3>
              <p className="text-muted-foreground text-center max-w-md mt-2">
                This file type cannot be previewed in the browser.
              </p>
              <Button className="mt-4" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download File
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="properties">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">File Name</h4>
                  <p>{document.file_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Size</h4>
                  <p>{(document.file_size / 1024).toFixed(2)} KB</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                  <p>{document.file_type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Version</h4>
                  <p>{document.version}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Created By</h4>
                  <p>{document.created_by}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Last Modified</h4>
                  <p>{new Date(document.updated_at).toLocaleString()}</p>
                </div>
                {document.expiry_date && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Expires</h4>
                    <p>{new Date(document.expiry_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentPreview;