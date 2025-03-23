
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Document } from '@/types/document';
import { 
  Download, 
  FileText, 
  History, 
  Calendar, 
  Tag, 
  User, 
  Link as LinkIcon,
  Clipboard,
  AlertTriangle
} from 'lucide-react';

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
}

const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({ 
  open, 
  onOpenChange,
  document 
}) => {
  if (!document) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getModuleDisplayName = (moduleRef: string) => {
    const moduleNames: Record<string, string> = {
      'haccp': 'HACCP Module',
      'training': 'Training Module',
      'audits': 'Audits Module',
      'suppliers': 'Supplier Management',
      'capa': 'CAPA Module',
      'traceability': 'Traceability Module',
      'none': 'None'
    };
    
    return moduleNames[moduleRef] || moduleRef;
  };

  const isDocumentExpiring = document.expiryDate && 
    new Date(document.expiryDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000; // 30 days

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document.title}
          </DialogTitle>
          <DialogDescription>
            {document.fileName} • v{document.version} • 
            <Badge className="ml-2" variant="outline">{document.category}</Badge>
            <Badge 
              className={`ml-2 ${document.status === 'Published' ? 'bg-green-100 text-green-800' : 
                document.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 
                'bg-blue-100 text-blue-800'}`}
              variant="outline"
            >
              {document.status}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[400px] border rounded-md bg-gray-50 flex items-center justify-center">
            <div className="text-center p-4">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Document Preview</h3>
              <p className="text-gray-500 mb-4">Preview not available for this document type</p>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download to View
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Document Details</h3>
              <Separator className="mb-3" />
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <User className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <div className="text-sm font-medium">Created By</div>
                    <div className="text-sm text-gray-500">{document.createdBy} on {formatDate(document.createdAt)}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <History className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <div className="text-sm font-medium">Last Updated</div>
                    <div className="text-sm text-gray-500">{formatDate(document.updatedAt)}</div>
                  </div>
                </div>
                
                {document.expiryDate && (
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                    <div>
                      <div className="text-sm font-medium">Expiry Date</div>
                      <div className="text-sm flex items-center">
                        {formatDate(document.expiryDate)}
                        {isDocumentExpiring && (
                          <span className="ml-2 flex items-center text-yellow-600">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Expiring soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {document.linkedModule && document.linkedModule !== 'none' && (
                  <div className="flex items-start">
                    <LinkIcon className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                    <div>
                      <div className="text-sm font-medium">Linked To</div>
                      <div className="text-sm text-gray-500">{getModuleDisplayName(document.linkedModule)}</div>
                    </div>
                  </div>
                )}
                
                {document.tags && document.tags.length > 0 && (
                  <div className="flex items-start">
                    <Tag className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                    <div>
                      <div className="text-sm font-medium">Tags</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {document.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Version History</h3>
              <Separator className="mb-3" />
              
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>v{document.version} (Current)</span>
                  <span className="text-gray-500">{formatDate(document.updatedAt)}</span>
                </div>
                {document.version > 1 && (
                  <>
                    <div className="flex justify-between">
                      <span>v{document.version - 1}</span>
                      <span className="text-gray-500">{formatDate(new Date(new Date(document.updatedAt).getTime() - 15 * 24 * 60 * 60 * 1000).toISOString())}</span>
                    </div>
                    {document.version > 2 && (
                      <div className="flex justify-between">
                        <span>v{document.version - 2}</span>
                        <span className="text-gray-500">{formatDate(new Date(new Date(document.updatedAt).getTime() - 45 * 24 * 60 * 60 * 1000).toISOString())}</span>
                      </div>
                    )}
                  </>
                )}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <History className="h-3 w-3 mr-1" />
                  View Full History
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2 flex-wrap">
          <Button variant="outline">
            <Clipboard className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
          <Button variant="outline">
            <History className="mr-2 h-4 w-4" />
            Version History
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Edit Document
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
