
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlignLeft,
  Calendar,
  File, 
  FilePlus, 
  Folder, 
  History, 
  Search, 
  SlidersHorizontal
} from 'lucide-react';
import { useDocuments } from '@/contexts/DocumentContext';
import UploadDocumentDialog from './UploadDocumentDialog';
import DocumentPreviewDialog from './DocumentPreviewDialog';
import DocumentBreadcrumb from './DocumentBreadcrumb';
import { Document } from '@/types/supabase';
import { formatDistanceToNow } from 'date-fns';

const DocumentRepository: React.FC = () => {
  const { documents, folders, loading, selectedFolder, setSelectedFolder, appDocuments } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Use appDocuments which have the correct type for the existing UI components
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
    if (selectedFolder) {
      return doc.folder_id === selectedFolder && matchesSearch;
    }
    
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Document Repository</h2>
          <p className="text-muted-foreground">
            Manage and organize all your compliance documents
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setShowUploadDialog(true)}>
          <FilePlus className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <DocumentBreadcrumb 
        folders={folders} 
        selectedFolder={selectedFolder} 
        onFolderClick={setSelectedFolder}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {folders.filter(folder => folder.parent_id === selectedFolder).map((folder) => (
          <Card key={folder.id} className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setSelectedFolder(folder.id)}>
            <CardContent className="flex items-center space-x-4 p-4">
              <Folder className="h-6 w-6 text-yellow-600" />
              <div>
                <CardTitle className="text-lg font-semibold">{folder.name}</CardTitle>
                <CardDescription className="text-gray-500">
                  {folder.document_count} Documents
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            <div>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                {selectedFolder 
                  ? `Documents in ${folders.find(f => f.id === selectedFolder)?.name || 'Selected Folder'}`
                  : 'All documents across your organization'
                }
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search documents..."
                  className="pl-8 w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-blue-500" />
                      {doc.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {doc.category_id ? 'Category' : 'Uncategorized'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {doc.status}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(doc.updated_at), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedDocument(doc);
                      setIsPreviewOpen(true);
                    }}>
                      Preview
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Document upload dialog */}
      <UploadDocumentDialog 
        open={showUploadDialog} 
        onOpenChange={setShowUploadDialog} 
        folders={folders}
      />

      {/* Document preview dialog */}
      <DocumentPreviewDialog 
        document={selectedDocument ? {
          id: selectedDocument.id,
          title: selectedDocument.title,
          description: selectedDocument.description,
          fileName: selectedDocument.file_name,
          fileSize: selectedDocument.file_size,
          fileType: selectedDocument.file_type,
          category: selectedDocument.category_id ? "Other" : "Other",
          status: selectedDocument.status,
          version: selectedDocument.version,
          createdBy: selectedDocument.created_by,
          createdAt: selectedDocument.created_at,
          updatedAt: selectedDocument.updated_at,
          expiryDate: selectedDocument.expiry_date,
        } : null} 
        open={isPreviewOpen} 
        onOpenChange={setIsPreviewOpen} 
      />
    </div>
  );
};

export default DocumentRepository;
