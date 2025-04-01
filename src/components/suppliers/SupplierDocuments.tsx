
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, FileText, Search, Trash2, Filter, Plus, Eye } from 'lucide-react';
import { useSupplierDocuments } from '@/hooks/useSupplierDocuments';
import { useSuppliers } from '@/hooks/useSuppliers';
import { StandardName, SupplierDocument } from '@/types/supplier';
import { toast } from 'sonner';
import DocumentViewerDialog from './DocumentViewerDialog';

interface SupplierDocumentsProps {
  standard?: StandardName;
}

const SupplierDocuments: React.FC<SupplierDocumentsProps> = ({ standard }) => {
  const { documents, isLoading, error, statistics, uploadDocument, deleteDocument } = useSupplierDocuments(undefined, standard);
  const { suppliers } = useSuppliers();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<SupplierDocument | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // New document state
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: 'Certificate',
    expiryDate: '',
    supplierId: '',
    file: null as File | null,
    standard: standard || 'SQF' as StandardName
  });
  
  // Filter documents based on search query
  const filteredDocuments = documents.filter((doc) => {
    const searchTerms = searchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(searchTerms) ||
      doc.type.toLowerCase().includes(searchTerms) ||
      (doc.supplier && doc.supplier.toString().toLowerCase().includes(searchTerms))
    );
  });
  
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Valid':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Expiring Soon':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Expired':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'Pending Review':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewDocument({
        ...newDocument,
        file: e.target.files[0]
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDocument.file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!newDocument.supplierId) {
      toast.error('Please select a supplier');
      return;
    }
    
    try {
      await uploadDocument(
        {
          name: newDocument.name,
          type: newDocument.type,
          expiryDate: newDocument.expiryDate || undefined,
          standard: newDocument.standard,
          file: newDocument.file
        },
        newDocument.supplierId
      );
      
      // Reset form and close dialog
      setNewDocument({
        name: '',
        type: 'Certificate',
        expiryDate: '',
        supplierId: '',
        file: null,
        standard: standard || 'SQF' as StandardName
      });
      setIsUploadDialogOpen(false);
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };
  
  const handleDeleteDocument = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(id);
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const handleViewDocument = (document: SupplierDocument) => {
    setSelectedDocument(document);
    setIsViewDialogOpen(true);
  };
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p>Error loading documents: {error.message}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Supplier Documentation
          </CardTitle>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload New Document</DialogTitle>
                  <DialogDescription>
                    Upload a document for a supplier. Documents can be certificates, audit reports, or other compliance documents.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="docName" className="text-right">Name</label>
                      <Input
                        id="docName"
                        className="col-span-3"
                        value={newDocument.name}
                        onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="docType" className="text-right">Type</label>
                      <Select
                        value={newDocument.type}
                        onValueChange={(value) => setNewDocument({...newDocument, type: value})}
                      >
                        <SelectTrigger id="docType" className="col-span-3">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Certificate">Certificate</SelectItem>
                          <SelectItem value="Audit Report">Audit Report</SelectItem>
                          <SelectItem value="Compliance Document">Compliance Document</SelectItem>
                          <SelectItem value="Declaration">Declaration</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="supplier" className="text-right">Supplier</label>
                      <Select
                        value={newDocument.supplierId}
                        onValueChange={(value) => setNewDocument({...newDocument, supplierId: value})}
                      >
                        <SelectTrigger id="supplier" className="col-span-3">
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="expiryDate" className="text-right">Expiry Date</label>
                      <div className="col-span-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newDocument.expiryDate ? (
                                format(new Date(newDocument.expiryDate), 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newDocument.expiryDate ? new Date(newDocument.expiryDate) : undefined}
                              onSelect={(date) => setNewDocument({
                                ...newDocument,
                                expiryDate: date ? date.toISOString() : ''
                              })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="standard" className="text-right">Standard</label>
                      <Select
                        value={newDocument.standard}
                        onValueChange={(value: StandardName) => setNewDocument({...newDocument, standard: value})}
                      >
                        <SelectTrigger id="standard" className="col-span-3">
                          <SelectValue placeholder="Select standard" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SQF">SQF</SelectItem>
                          <SelectItem value="BRC GS2">BRC GS2</SelectItem>
                          <SelectItem value="ISO 22000">ISO 22000</SelectItem>
                          <SelectItem value="FSSC 22000">FSSC 22000</SelectItem>
                          <SelectItem value="HACCP">HACCP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="file" className="text-right">Document File</label>
                      <Input
                        id="file"
                        type="file"
                        className="col-span-3"
                        onChange={handleFileChange}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Upload</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-4 gap-3">
            <Card className="bg-green-50">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-green-600">{statistics.validCount}</span>
                <span className="text-sm text-green-600">Valid</span>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-yellow-600">{statistics.expiringCount}</span>
                <span className="text-sm text-yellow-600">Expiring Soon</span>
              </CardContent>
            </Card>
            <Card className="bg-red-50">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-red-600">{statistics.expiredCount}</span>
                <span className="text-sm text-red-600">Expired</span>
              </CardContent>
            </Card>
            <Card className="bg-blue-50">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">{statistics.pendingCount}</span>
                <span className="text-sm text-blue-600">Pending Review</span>
              </CardContent>
            </Card>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Standard</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">{document.name}</TableCell>
                      <TableCell>{document.type}</TableCell>
                      <TableCell>{document.supplier}</TableCell>
                      <TableCell>{document.standard || 'N/A'}</TableCell>
                      <TableCell>{new Date(document.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {document.expiryDate ? new Date(document.expiryDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeStyle(document.status)} variant="outline">
                          {document.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleViewDocument(document)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteDocument(document.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {searchQuery ? 'No documents match your search criteria' : 'No documents found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <DocumentViewerDialog 
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        document={selectedDocument}
      />
    </>
  );
};

export default SupplierDocuments;
