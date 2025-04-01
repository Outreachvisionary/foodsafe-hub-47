
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, FileText, Download, ExternalLink } from 'lucide-react';
import { SupplierDocument } from '@/types/supplier';
import { useToast } from '@/hooks/use-toast';

interface DocumentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: SupplierDocument | null;
}

const DocumentViewDialog: React.FC<DocumentViewDialogProps> = ({
  open,
  onOpenChange,
  document
}) => {
  const { toast } = useToast();

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleView = () => {
    if (document.fileName) {
      window.open(document.fileName, '_blank');
    } else {
      toast({
        title: "Document Unavailable",
        description: "The document file is not available for viewing.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    if (document.fileName) {
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = document.fileName;
      link.download = document.name + '.' + document.fileName.split('.').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast({
        title: "Download Failed",
        description: "The document file is not available for download.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Document Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold">{document.name}</h3>
            <Badge className={getStatusColor(document.status)}>
              {document.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-gray-500">Document Type</p>
              <p className="font-medium">{document.type}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-gray-500">Supplier</p>
              <p className="font-medium">{document.supplier}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-gray-500">Upload Date</p>
              <p className="font-medium flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                {formatDate(document.uploadDate)}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-gray-500">Expiry Date</p>
              <p className="font-medium flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                {formatDate(document.expiryDate)}
              </p>
            </div>
            
            {document.standard && (
              <div className="col-span-2 space-y-1">
                <p className="text-gray-500">Standard</p>
                <p className="font-medium">{document.standard}</p>
              </div>
            )}
          </div>
          
          <div className="pt-4 flex flex-col space-y-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleView}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>View Document</span>
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              <span>Download Document</span>
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewDialog;
