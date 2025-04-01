
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, FileText, Download } from 'lucide-react';
import { SupplierDocument } from '@/types/supplier';

interface DocumentViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: SupplierDocument | null;
}

const DocumentViewerDialog: React.FC<DocumentViewerDialogProps> = ({
  open,
  onOpenChange,
  document
}) => {
  if (!document) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Valid':
        return 'bg-green-100 text-green-800';
      case 'Expiring Soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Pending Review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleDownload = () => {
    if (document.file_path) {
      window.open(document.file_path, '_blank');
    } else if (document.fileName) {
      window.open(document.fileName, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Document Details</DialogTitle>
          <DialogDescription>
            View document information and details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{document.name}</h3>
            <Badge className={getStatusColor(document.status)}>
              {document.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-gray-500">Document Type:</div>
            <div>{document.type}</div>
            
            <div className="text-gray-500">Upload Date:</div>
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(document.upload_date || document.uploadDate)}
            </div>
            
            <div className="text-gray-500">Expiry Date:</div>
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(document.expiry_date || document.expiryDate)}
            </div>
            
            <div className="text-gray-500">Supplier:</div>
            <div>{document.supplier_id || document.supplier}</div>
            
            {document.standard && (
              <>
                <div className="text-gray-500">Standard:</div>
                <div>{document.standard}</div>
              </>
            )}
          </div>
          
          {(document.file_path || document.fileName) && (
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleDownload}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span className="flex-1 truncate">View Document</span>
                <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewerDialog;
