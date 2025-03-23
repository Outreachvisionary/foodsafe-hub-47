
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DocumentBreadcrumb from './DocumentBreadcrumb';
import { 
  Search, 
  FolderPlus, 
  Filter, 
  Download, 
  Eye, 
  FileEdit, 
  Trash2,
  FileText,
  FolderOpen,
  Clock
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Document, DocumentCategory, DocumentStatus, Folder } from '@/types/document';
import DocumentPreviewDialog from './DocumentPreviewDialog';

// Sample data - would be fetched from API in a real implementation
const sampleFolders: Folder[] = [
  {
    id: '1',
    name: 'HACCP Plans',
    path: '/HACCP Plans',
    createdBy: 'John Doe',
    createdAt: '2023-04-15',
    updatedAt: '2023-04-15',
    documentCount: 7
  },
  {
    id: '2',
    name: 'SOPs',
    path: '/SOPs',
    createdBy: 'Jane Smith',
    createdAt: '2023-03-10',
    updatedAt: '2023-05-20',
    documentCount: 12
  },
  {
    id: '3',
    name: 'Audit Reports',
    path: '/Audit Reports',
    createdBy: 'John Doe',
    createdAt: '2023-02-05',
    updatedAt: '2023-06-01',
    documentCount: 5
  },
  {
    id: '4',
    name: 'Supplier Documentation',
    path: '/Supplier Documentation',
    createdBy: 'Sarah Johnson',
    createdAt: '2023-01-22',
    updatedAt: '2023-05-15',
    documentCount: 9
  },
  {
    id: '5',
    name: 'Training Materials',
    path: '/Training Materials',
    createdBy: 'Mike Brown',
    createdAt: '2023-03-18',
    updatedAt: '2023-04-30',
    documentCount: 8
  }
];

const sampleDocuments: Document[] = [
  {
    id: '1',
    title: 'Raw Material Receiving SOP',
    fileName: 'raw_material_receiving_sop_v3.pdf',
    fileSize: 2456000,
    fileType: 'application/pdf',
    category: 'SOP',
    status: 'Published',
    version: 3,
    createdBy: 'John Doe',
    createdAt: '2023-04-15T10:30:00Z',
    updatedAt: '2023-06-20T14:15:00Z',
    expiryDate: '2024-06-20T14:15:00Z',
    linkedModule: 'haccp',
    tags: ['receiving', 'materials', 'procedures']
  },
  {
    id: '2',
    title: 'Allergen Control Program',
    fileName: 'allergen_control_program_v2.docx',
    fileSize: 1245000,
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'Policy',
    status: 'Published',
    version: 2,
    createdBy: 'Jane Smith',
    createdAt: '2023-03-10T09:45:00Z',
    updatedAt: '2023-05-22T11:30:00Z',
    expiryDate: '2024-05-22T11:30:00Z',
    linkedModule: 'haccp',
    tags: ['allergen', 'control', 'food safety']
  },
  {
    id: '3',
    title: 'Supplier Quality Audit Checklist',
    fileName: 'supplier_quality_audit_checklist_v1.xlsx',
    fileSize: 985000,
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    category: 'Form',
    status: 'Approved',
    version: 1,
    createdBy: 'Sarah Johnson',
    createdAt: '2023-05-05T13:20:00Z',
    updatedAt: '2023-05-05T13:20:00Z',
    expiryDate: '2024-05-05T13:20:00Z',
    linkedModule: 'suppliers',
    tags: ['supplier', 'audit', 'checklist']
  },
  {
    id: '4',
    title: 'Annual HACCP Review Report 2023',
    fileName: 'annual_haccp_review_2023_v1.pdf',
    fileSize: 4567000,
    fileType: 'application/pdf',
    category: 'Audit Report',
    status: 'Draft',
    version: 1,
    createdBy: 'Mike Brown',
    createdAt: '2023-06-18T16:45:00Z',
    updatedAt: '2023-06-18T16:45:00Z',
    linkedModule: 'haccp',
    tags: ['haccp', 'annual', 'review', 'report']
  },
  {
    id: '5',
    title: 'SQF Certificate - Main Facility',
    fileName: 'sqf_certificate_main_facility_2023.pdf',
    fileSize: 1123000,
    fileType: 'application/pdf',
    category: 'Certificate',
    status: 'Published',
    version: 1,
    createdBy: 'John Doe',
    createdAt: '2023-05-10T11:15:00Z',
    updatedAt: '2023-05-10T11:15:00Z',
    expiryDate: '2024-05-10T11:15:00Z',
    tags: ['sqf', 'certification', 'facility']
  }
];

const DocumentRepository = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const filteredDocuments = sampleDocuments.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ?? false);
      
    const matchesCategory = selectedCategory === 'all' ? true : doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' ? true : doc.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: DocumentStatus) => {
    switch(status) {
      case 'Published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case 'Approved':
        return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case 'Pending Approval':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
      case 'Draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'Expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case 'Archived':
        return <Badge className="bg-purple-100 text-purple-800">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const openPreview = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const handleFolderClick = (folder: Folder) => {
    setCurrentPath(folder.path);
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6">
        <DocumentBreadcrumb 
          path={currentPath} 
          onNavigate={(path) => setCurrentPath(path)} 
        />
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6 mt-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search documents by title, filename, or tags..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Document Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="SOP">SOPs</SelectItem>
                <SelectItem value="Policy">Policies</SelectItem>
                <SelectItem value="Form">Forms</SelectItem>
                <SelectItem value="Certificate">Certificates</SelectItem>
                <SelectItem value="Audit Report">Audit Reports</SelectItem>
                <SelectItem value="HACCP Plan">HACCP Plans</SelectItem>
                <SelectItem value="Training Material">Training Materials</SelectItem>
                <SelectItem value="Supplier Documentation">Supplier Docs</SelectItem>
                <SelectItem value="Risk Assessment">Risk Assessments</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden md:inline">More Filters</span>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-1">
              <FolderPlus className="h-4 w-4" />
              <span className="hidden md:inline">New Folder</span>
            </Button>
          </div>
        </div>
        
        {currentPath === '/' && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Folders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sampleFolders.map((folder) => (
                <Card 
                  key={folder.id} 
                  className="hover:shadow-md cursor-pointer transition-all"
                  onClick={() => handleFolderClick(folder)}
                >
                  <CardContent className="p-4 flex items-center space-x-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <FolderOpen className="h-8 w-8 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">{folder.name}</h4>
                      <p className="text-sm text-gray-500">{folder.documentCount} documents</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-medium mb-4">Documents</h3>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Document</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <div>
                            <div>{doc.title}</div>
                            <div className="text-xs text-gray-500">{doc.fileName} • {formatFileSize(doc.fileSize)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{doc.category}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell>v{doc.version}</TableCell>
                      <TableCell>{new Date(doc.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {doc.expiryDate ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span>{new Date(doc.expiryDate).toLocaleDateString()}</span>
                          </div>
                        ) : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => openPreview(doc)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No documents found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      
      <DocumentPreviewDialog 
        open={isPreviewOpen} 
        onOpenChange={setIsPreviewOpen}
        document={selectedDocument}
      />
    </Card>
  );
};

export default DocumentRepository;
