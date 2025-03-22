
import React, { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Upload, 
  Download, 
  AlertTriangle, 
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

// Sample data for supplier documents
const sampleDocuments = [
  { 
    id: 1, 
    name: 'Food Safety Certificate', 
    supplier: 'Organic Farms Co.', 
    type: 'Certification',
    uploadDate: '2023-03-15',
    expiryDate: '2024-03-15',
    status: 'Valid',
    fileName: 'organic_farms_fssc22000.pdf'
  },
  { 
    id: 2, 
    name: 'Third-Party Audit Report', 
    supplier: 'Premium Packaging Inc.', 
    type: 'Audit',
    uploadDate: '2023-04-22',
    expiryDate: '2024-04-22',
    status: 'Valid',
    fileName: 'premium_packaging_audit_2023.pdf'
  },
  { 
    id: 3, 
    name: 'HACCP Plan', 
    supplier: 'Global Ingredients Ltd.', 
    type: 'Food Safety Plan',
    uploadDate: '2023-01-05',
    expiryDate: '2023-12-31',
    status: 'Expiring Soon',
    fileName: 'global_ingredients_haccp.pdf'
  },
  { 
    id: 4, 
    name: 'Quality Manual', 
    supplier: 'EcoClean Solutions', 
    type: 'Quality Document',
    uploadDate: '2023-05-12',
    expiryDate: '2024-05-12',
    status: 'Valid',
    fileName: 'ecoclean_quality_manual.pdf'
  },
  { 
    id: 5, 
    name: 'Temperature Control Records', 
    supplier: 'QuickShip Logistics', 
    type: 'Monitoring Records',
    uploadDate: '2023-06-28',
    expiryDate: '2023-10-15',
    status: 'Expired',
    fileName: 'quickship_temp_records.pdf'
  },
];

const SupplierDocuments: React.FC = () => {
  const [documents, setDocuments] = useState(sampleDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  
  // Filter documents based on search query and selected filters
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = selectedType ? doc.type === selectedType : true;
    const matchesStatus = selectedStatus ? doc.status === selectedStatus : true;
    
    return matchesSearch && matchesType && matchesStatus;
  });

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

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Supplier Documents
        </CardTitle>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <Button>
            <Upload className="mr-2 h-4 w-4" /> Upload Document
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="Certification">Certification</SelectItem>
                <SelectItem value="Audit">Audit</SelectItem>
                <SelectItem value="Food Safety Plan">Food Safety Plan</SelectItem>
                <SelectItem value="Quality Document">Quality Document</SelectItem>
                <SelectItem value="Monitoring Records">Monitoring Records</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="Valid">Valid</SelectItem>
                <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Pending Review">Pending Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{doc.supplier}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.uploadDate}</TableCell>
                  <TableCell>
                    {doc.status === 'Expired' ? (
                      <span className="text-red-600 font-medium">{doc.expiryDate}</span>
                    ) : doc.status === 'Expiring Soon' ? (
                      <span className="text-yellow-600 font-medium">{doc.expiryDate}</span>
                    ) : (
                      doc.expiryDate
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(doc.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {doc.status === 'Expired' && (
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Document Expiry Summary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Valid Documents</p>
                  <p className="text-2xl font-bold text-green-700">3</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500" />
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-50 border-yellow-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Expiring Soon</p>
                  <p className="text-2xl font-bold text-yellow-700">1</p>
                </div>
                <Clock className="h-10 w-10 text-yellow-500" />
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Expired Documents</p>
                  <p className="text-2xl font-bold text-red-700">1</p>
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
