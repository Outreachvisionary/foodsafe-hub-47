
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

// Sample data for supplier documents
const sampleDocuments: SupplierDocument[] = [
  { 
    id: "1", 
    name: 'Food Safety Certificate', 
    supplier: 'Organic Farms Co.', 
    type: 'Certification',
    uploadDate: '2023-03-15',
    expiryDate: '2024-03-15',
    status: 'Valid',
    fileName: 'organic_farms_fssc22000.pdf',
    standard: 'FSSC 22000'
  },
  { 
    id: "2", 
    name: 'Third-Party Audit Report', 
    supplier: 'Premium Packaging Inc.', 
    type: 'Audit',
    uploadDate: '2023-04-22',
    expiryDate: '2024-04-22',
    status: 'Valid',
    fileName: 'premium_packaging_audit_2023.pdf',
    standard: 'BRC GS2'
  },
  { 
    id: "3", 
    name: 'HACCP Plan', 
    supplier: 'Global Ingredients Ltd.', 
    type: 'Food Safety Plan',
    uploadDate: '2023-01-05',
    expiryDate: '2023-12-31',
    status: 'Expiring Soon',
    fileName: 'global_ingredients_haccp.pdf',
    standard: 'HACCP'
  },
  { 
    id: "4", 
    name: 'Quality Manual', 
    supplier: 'EcoClean Solutions', 
    type: 'Quality Document',
    uploadDate: '2023-05-12',
    expiryDate: '2024-05-12',
    status: 'Valid',
    fileName: 'ecoclean_quality_manual.pdf',
    standard: 'ISO 22000'
  },
  { 
    id: "5", 
    name: 'Temperature Control Records', 
    supplier: 'QuickShip Logistics', 
    type: 'Monitoring Records',
    uploadDate: '2023-06-28',
    expiryDate: '2023-10-15',
    status: 'Expired',
    fileName: 'quickship_temp_records.pdf',
    standard: 'HACCP'
  },
  { 
    id: "6", 
    name: 'SQFI Certificate', 
    supplier: 'Harvest Foods Inc.', 
    type: 'Certification',
    uploadDate: '2023-07-10',
    expiryDate: '2024-07-10',
    status: 'Valid',
    fileName: 'harvest_foods_sqf.pdf',
    standard: 'SQF'
  },
  { 
    id: "7", 
    name: 'Allergen Control Program', 
    supplier: 'Bakery Solutions', 
    type: 'Food Safety Plan',
    uploadDate: '2023-05-05',
    expiryDate: '2024-05-05',
    status: 'Valid',
    fileName: 'bakery_allergen_program.pdf',
    standard: 'BRC GS2'
  },
  { 
    id: "8", 
    name: 'Environmental Monitoring Results', 
    supplier: 'Fresh Produce Co.', 
    type: 'Test Results',
    uploadDate: '2023-09-01',
    expiryDate: '2024-03-01',
    status: 'Valid',
    fileName: 'fresh_produce_env_monitoring.pdf',
    standard: 'FSSC 22000'
  },
];

interface SupplierDocumentsProps {
  standard?: StandardName;
}

const SupplierDocuments: React.FC<SupplierDocumentsProps> = ({ standard = 'all' }) => {
  const [documents] = useState<SupplierDocument[]>(sampleDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDocStandard, setSelectedDocStandard] = useState<string>(standard);
  const [isUploading, setIsUploading] = useState(false);
  
  // Update the selected standard when the prop changes
  React.useEffect(() => {
    setSelectedDocStandard(standard);
  }, [standard]);
  
  // Filter documents based on search query and selected filters
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = selectedType === 'all' ? true : doc.type === selectedType;
    const matchesStatus = selectedStatus === 'all' ? true : doc.status === selectedStatus;
    const matchesStandard = selectedDocStandard === 'all' ? true : doc.standard === selectedDocStandard;
    
    return matchesSearch && matchesType && matchesStatus && matchesStandard;
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

  const handleUploadClick = () => {
    setIsUploading(true);
    // Simulate document upload process
    setTimeout(() => {
      setIsUploading(false);
    }, 1500);
  };

  // Count documents by status
  const validCount = documents.filter(doc => doc.status === 'Valid').length;
  const expiringCount = documents.filter(doc => doc.status === 'Expiring Soon').length;
  const expiredCount = documents.filter(doc => doc.status === 'Expired').length;

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Supplier Documents
        </CardTitle>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <Button onClick={handleUploadClick} disabled={isUploading}>
            {isUploading ? (
              <>Uploading...</>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Upload Document
              </>
            )}
          </Button>
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
              onValueChange={setSelectedDocStandard}
              placeholder="Filter by Standard"
              triggerClassName="w-[180px]"
            />
          </div>
        </div>
        
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
                    <TableCell>{doc.supplier}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-100">
                        {doc.standard}
                      </Badge>
                    </TableCell>
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
        
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Document Expiry Summary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Valid Documents</p>
                  <p className="text-2xl font-bold text-green-700">{validCount}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500" />
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-50 border-yellow-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Expiring Soon</p>
                  <p className="text-2xl font-bold text-yellow-700">{expiringCount}</p>
                </div>
                <Clock className="h-10 w-10 text-yellow-500" />
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Expired Documents</p>
                  <p className="text-2xl font-bold text-red-700">{expiredCount}</p>
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
