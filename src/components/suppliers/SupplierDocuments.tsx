import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import StandardSelect from './StandardSelect';
import { 
  FileText, 
  Upload, 
  Download, 
  AlertTriangle, 
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SupplierDocument, StandardName } from '@/types/supplier';
import { useSupplierDocuments } from '@/hooks/useSupplierDocuments';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useSuppliers } from '@/hooks/useSuppliers';

interface SupplierDocumentsProps {
  standard?: StandardName;
}

const SupplierDocuments: React.FC<SupplierDocumentsProps> = ({ standard = 'all' }) => {
  const { documents, isLoading, error, statistics, uploadDocument, deleteDocument } = useSupplierDocuments(undefined, standard);
  const { suppliers } = useSuppliers();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDocStandard, setSelectedDocStandard] = useState<StandardName>(standard);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: 'Certification',
    supplier: '',
    expiryDate: '',
    standard: 'SQF' as StandardName
  });
  const [isUploading, setIsUploading] = useState(false);
  
  useEffect(() => {
    setSelectedDocStandard(standard);
  }, [standard]);
  
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.supplier.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = selectedType === 'all' ? true : doc.type === selectedType;
    const matchesStatus = selectedStatus === 'all' ? true : doc.status === selectedStatus;
    const matchesStandard = selectedDocStandard === 'all' ? true : doc.standard === selectedDocStandard;
    
    return matchesSearch && matchesType && matchesStatus && matchesStandard;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setUploadForm(prev => ({ ...prev, [name]: value }));
  };

  const handleStandardChange = (value: string) => {
    setSelectedDocStandard(value as StandardName);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      return;
    }
    
    if (!uploadForm.supplier) {
      return;
    }
    
    setIsUploading(true);
    
    try {
      await uploadDocument(
        {
          name: uploadForm.name,
          type: uploadForm.type,
          expiryDate: uploadForm.expiryDate || undefined,
          standard: uploadForm.standard,
          file: selectedFile
        },
        uploadForm.supplier
      );
      
      setUploadForm({
        name: '',
        type: 'Certification',
        supplier: '',
        expiryDate: '',
        standard: 'SQF' as StandardName
      });
      setSelectedFile(null);
      setIsUploadDialogOpen(false);
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'valid':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100" variant="outline">
            <CheckCircle className="h-3 w-3 mr-1" /> Valid
          </Badge>
        );
      case 'expiring soon':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100" variant="outline">
            <Clock className="h-3 w-3 mr-1" /> Expiring Soon
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100" variant="outline">
            <XCircle className="h-3 w-3 mr-1" /> Expired
          </Badge>
        );
      case 'pending review':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100" variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" /> Pending Review
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const getStandardSpecificDocuments = () => {
    switch(selectedDocStandard) {
      case 'SQF':
        return (
          <div className="space-y-2 bg-blue-50 p-4 rounded-md mb-4">
            <h3 className="font-medium text-blue-800 flex items-center">
              <FileCheck className="mr-2 h-4 w-4" />
              SQF-Specific Documents Required
            </h3>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>SQFI Certificate (Level 2 or 3)</li>
              <li>Food Defense Plan</li>
              <li>Mock Recall Records (last 6 months)</li>
            </ul>
          </div>
        );
      case 'BRC GS2':
        return (
          <div className="space-y-2 bg-blue-50 p-4 rounded-md mb-4">
            <h3 className="font-medium text-blue-800 flex items-center">
              <FileCheck className="mr-2 h-4 w-4" />
              BRC GS2-Specific Documents Required
            </h3>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>Allergen Control Procedures</li>
              <li>Food Fraud Mitigation Plan</li>
              <li>Site Security Procedures</li>
            </ul>
          </div>
        );
      case 'FSSC 22000':
        return (
          <div className="space-y-2 bg-blue-50 p-4 rounded-md mb-4">
            <h3 className="font-medium text-blue-800 flex items-center">
              <FileCheck className="mr-2 h-4 w-4" />
              FSSC 22000-Specific Documents Required
            </h3>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>Environmental Monitoring Program</li>
              <li>Food Defense Plan</li>
              <li>Food Fraud Vulnerability Assessment</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  if (error) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <FileText className="mr-2 h-5 w-5" />
            Error Loading Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error.message}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Supplier Documents
        </CardTitle>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" /> Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a new document for a supplier. Required documents vary by standard.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUploadSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Document Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={uploadForm.name}
                      onChange={handleUploadFormChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="supplier" className="text-right">Supplier</Label>
                    <Select 
                      name="supplier"
                      value={uploadForm.supplier} 
                      onValueChange={value => handleSelectChange('supplier', value)}
                    >
                      <SelectTrigger id="supplier" className="col-span-3">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map(supplier => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Document Type</Label>
                    <Select 
                      name="type"
                      value={uploadForm.type} 
                      onValueChange={value => handleSelectChange('type', value)}
                    >
                      <SelectTrigger id="type" className="col-span-3">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Certification">Certification</SelectItem>
                        <SelectItem value="Audit">Audit</SelectItem>
                        <SelectItem value="Food Safety Plan">Food Safety Plan</SelectItem>
                        <SelectItem value="Quality Document">Quality Document</SelectItem>
                        <SelectItem value="Monitoring Records">Monitoring Records</SelectItem>
                        <SelectItem value="Test Results">Test Results</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="standard" className="text-right">Standard</Label>
                    <StandardSelect
                      value={uploadForm.standard}
                      onValueChange={value => handleSelectChange('standard', value)}
                      includeAll={false}
                      triggerClassName="col-span-3"
                      triggerProps={{ id: "standard" }}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expiryDate" className="text-right">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      value={uploadForm.expiryDate}
                      onChange={handleUploadFormChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="file" className="text-right">File</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUploading || !selectedFile}>
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {getStandardSpecificDocuments()}
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Certification">Certification</SelectItem>
                <SelectItem value="Audit">Audit</SelectItem>
                <SelectItem value="Food Safety Plan">Food Safety Plan</SelectItem>
                <SelectItem value="Quality Document">Quality Document</SelectItem>
                <SelectItem value="Monitoring Records">Monitoring Records</SelectItem>
                <SelectItem value="Test Results">Test Results</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Valid">Valid</SelectItem>
                <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Pending Review">Pending Review</SelectItem>
              </SelectContent>
            </Select>
            
            <StandardSelect
              value={selectedDocStandard}
              onValueChange={handleStandardChange}
              placeholder="Filter by Standard"
              triggerClassName="w-[180px]"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Standard</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{typeof doc.supplier === 'string' ? doc.supplier : 'Unknown'}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-100">
                          {doc.standard}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {doc.expiryDate ? (
                          doc.status === 'Expired' ? (
                            <span className="text-red-600 font-medium">
                              {new Date(doc.expiryDate).toLocaleDateString()}
                            </span>
                          ) : doc.status === 'Expiring Soon' ? (
                            <span className="text-yellow-600 font-medium">
                              {new Date(doc.expiryDate).toLocaleDateString()}
                            </span>
                          ) : (
                            new Date(doc.expiryDate).toLocaleDateString()
                          )
                        ) : (
                          'No expiry'
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm" onClick={() => window.open(doc.fileName, '_blank')}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 border-red-200"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this document?')) {
                                deleteDocument(doc.id);
                              }
                            }}
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No documents found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Document Expiry Summary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Valid Documents</p>
                  <p className="text-2xl font-bold text-green-700">{statistics.validCount}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500" />
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-50 border-yellow-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Expiring Soon</p>
                  <p className="text-2xl font-bold text-yellow-700">{statistics.expiringCount}</p>
                </div>
                <Clock className="h-10 w-10 text-yellow-500" />
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Expired Documents</p>
                  <p className="text-2xl font-bold text-red-700">{statistics.expiredCount}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierDocuments;
