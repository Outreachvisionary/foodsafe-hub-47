import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FolderIcon, FileText, Download, CheckCircle2, Clock, AlertTriangle, Tag, Edit, Eye, Trash2, Upload } from 'lucide-react';
import { useDocuments } from '@/contexts/DocumentContext';
import { Document, DocumentCategory } from '@/types/document';
import { documentWorkflowService } from '@/services/documentWorkflowService';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import DocumentPreviewDialog from './DocumentPreviewDialog';
import { useToast } from '@/hooks/use-toast';
import UploadDocumentDialog from './UploadDocumentDialog';
import { useTranslation } from 'react-i18next';

const DocumentRepository: React.FC = () => {
  const { documents, deleteDocument, setSelectedDocument } = useDocuments();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [showPreview, setShowPreview] = useState(false);
  const [docToPreview, setDocToPreview] = useState<Document | null>(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, document: null as Document | null });
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeDragFolder, setActiveDragFolder] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  
  const categories = Array.from(new Set(documents.map(doc => doc.category)));

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
    const matchesCategory = 
      filterCategory === 'all' || doc.category === filterCategory;
      
    const matchesStatus = 
      filterStatus === 'all' || doc.status === filterStatus;
      
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleFolderDragOver = (e: React.DragEvent<HTMLDivElement>, category: string) => {
    e.preventDefault();
    setActiveDragFolder(category);
  };

  const handleFolderDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActiveDragFolder(null);
  };

  const handleFolderDrop = (e: React.DragEvent<HTMLDivElement>, category: DocumentCategory) => {
    e.preventDefault();
    setActiveDragFolder(null);
    
    toast({
      title: "Documents moved",
      description: `Selected documents moved to ${category} folder.`,
    });
    
    setSelectedDocuments([]);
    setIsMultiSelectMode(false);
  };

  const handleDocumentSelect = (doc: Document, e: React.MouseEvent) => {
    if (!isMultiSelectMode) return;
    
    e.preventDefault();
    
    if (selectedDocuments.some(d => d.id === doc.id)) {
      setSelectedDocuments(selectedDocuments.filter(d => d.id === doc.id));
    } else {
      setSelectedDocuments([...selectedDocuments, doc]);
    }
  };

  const toggleMultiSelectMode = () => {
    if (isMultiSelectMode) {
      setSelectedDocuments([]);
    }
    setIsMultiSelectMode(!isMultiSelectMode);
  };

  const handleOpenDeleteDialog = (doc: Document) => {
    setDeleteDialog({ open: true, document: doc });
  };

  const handleDelete = () => {
    if (deleteDialog.document) {
      deleteDocument(deleteDialog.document.id);
      setDeleteDialog({ open: false, document: null });
    }
  };

  const handleEditDocument = (doc: Document) => {
    setSelectedDocument(doc);
    navigate('/documents', { state: { activeTab: 'edit' } });
  };

  const getStatusBadge = (doc: Document) => {
    switch (doc.status) {
      case 'Draft':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            {t('status.draft')}
          </Badge>
        );
      case 'Pending Approval':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {t('status.pendingApproval')}
          </Badge>
        );
      case 'Approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {t('status.approved')}
          </Badge>
        );
      case 'Published':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            {t('status.published')}
          </Badge>
        );
      case 'Archived':
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            {t('status.archived')}
          </Badge>
        );
      case 'Expired':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {t('status.expired')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{doc.status}</Badge>
        );
    }
  };

  const documentCountsByCategory: Record<DocumentCategory, number> = {} as Record<DocumentCategory, number>;
  
  documents.forEach(doc => {
    if (!documentCountsByCategory[doc.category]) {
      documentCountsByCategory[doc.category] = 0;
    }
    documentCountsByCategory[doc.category]++;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>{t('documents.repository')}</CardTitle>
              <CardDescription>
                {t('documents.subtitle')}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={isMultiSelectMode ? "secondary" : "outline"} 
                onClick={toggleMultiSelectMode}
              >
                {isMultiSelectMode ? t('buttons.cancelSelection') : t('buttons.selectMultiple')}
              </Button>
              <Button onClick={() => setIsUploadOpen(true)} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>{t('documents.uploadButton')}</span>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder={t('documents.search')}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder={t('documents.category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allCategories')}</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder={t('documents.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                    <SelectItem value="Draft">{t('status.draft')}</SelectItem>
                    <SelectItem value="Pending Approval">{t('status.pendingApproval')}</SelectItem>
                    <SelectItem value="Approved">{t('status.approved')}</SelectItem>
                    <SelectItem value="Published">{t('status.published')}</SelectItem>
                    <SelectItem value="Archived">{t('status.archived')}</SelectItem>
                    <SelectItem value="Expired">{t('status.expired')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isMultiSelectMode && selectedDocuments.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-md flex justify-between items-center">
                <span>{selectedDocuments.length} document(s) selected</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedDocuments([])}>
                    Clear Selection
                  </Button>
                  <Button size="sm">
                    Move to Folder
                  </Button>
                </div>
              </div>
            )}
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {isMultiSelectMode && <TableHead className="w-[30px]">{t('common.select')}</TableHead>}
                    <TableHead>{t('documents.document')}</TableHead>
                    <TableHead>{t('documents.category')}</TableHead>
                    <TableHead>{t('documents.status')}</TableHead>
                    <TableHead>{t('documents.lastUpdated')}</TableHead>
                    <TableHead>{t('documents.version')}</TableHead>
                    <TableHead>{t('documents.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <TableRow 
                        key={doc.id} 
                        className={`
                          ${selectedDocuments.some(d => d.id === doc.id) ? "bg-blue-50" : ""}
                          ${doc.is_locked ? "bg-amber-50/30" : ""}
                        `}
                        onClick={(e) => handleDocumentSelect(doc, e)}
                      >
                        {isMultiSelectMode && (
                          <TableCell>
                            <input 
                              type="checkbox" 
                              checked={selectedDocuments.some(d => d.id === doc.id)}
                              onChange={() => {}} 
                              className="rounded"
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-blue-500 mr-2" />
                            <div>
                              <div className="flex items-center">
                                {doc.title}
                                {doc.checkout_user_id && (
                                  <Badge variant="outline" className="ml-2 text-xs bg-amber-50 border-amber-200 text-amber-700">
                                    <Lock className="h-3 w-3 mr-1" />
                                    {doc.checkout_user_id === 'current-user-id' 
                                      ? t('documents.checkedOutByYou') 
                                      : t('documents.checkedOut')}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">{doc.file_name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-100">
                            {doc.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(doc)}
                        </TableCell>
                        <TableCell>
                          {new Date(doc.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>v{doc.version}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDocToPreview(doc);
                                setShowPreview(true);
                              }}
                              title={t('buttons.view')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditDocument(doc);
                              }}
                              title={t('buttons.edit')}
                              disabled={doc.is_locked && doc.checkout_user_id !== 'current-user-id'}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                              title={t('buttons.download')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDeleteDialog(doc);
                              }}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              title={t('buttons.delete')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isMultiSelectMode ? 7 : 6} className="text-center py-10 text-muted-foreground">
                        {t('documents.noDocumentsFound')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(documentCountsByCategory).map(([category, count]) => (
                  <div 
                    key={category} 
                    className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                      filterCategory === category ? 'bg-gray-100' : ''
                    } ${activeDragFolder === category ? 'bg-blue-100 border-2 border-blue-300' : ''}`}
                    onClick={() => setFilterCategory(category)}
                    onDragOver={(e) => handleFolderDragOver(e, category)}
                    onDragLeave={handleFolderDragLeave}
                    onDrop={(e) => handleFolderDrop(e, category as DocumentCategory)}
                  >
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{category}</span>
                    </div>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Folders</CardTitle>
              <CardDescription className="text-xs italic">
                Drag and drop documents to categorize
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div 
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                    activeDragFolder === 'SOP' ? 'bg-blue-100 border-2 border-blue-300' : ''
                  }`}
                  onDragOver={(e) => handleFolderDragOver(e, 'SOP')}
                  onDragLeave={handleFolderDragLeave}
                  onDrop={(e) => handleFolderDrop(e, 'SOP')}
                >
                  <div className="flex items-center">
                    <FolderIcon className="h-4 w-4 mr-2 text-amber-500" />
                    <span>SOPs</span>
                  </div>
                  <Badge variant="outline">
                    {documents.filter(doc => doc.category === 'SOP').length}
                  </Badge>
                </div>
                
                <div 
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                    activeDragFolder === 'HACCP Plan' ? 'bg-blue-100 border-2 border-blue-300' : ''
                  }`}
                  onDragOver={(e) => handleFolderDragOver(e, 'HACCP Plan')}
                  onDragLeave={handleFolderDragLeave}
                  onDrop={(e) => handleFolderDrop(e, 'HACCP Plan')}
                >
                  <div className="flex items-center">
                    <FolderIcon className="h-4 w-4 mr-2 text-amber-500" />
                    <span>HACCP Plans</span>
                  </div>
                  <Badge variant="outline">
                    {documents.filter(doc => doc.category === 'HACCP Plan').length}
                  </Badge>
                </div>
                
                <div 
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                    activeDragFolder === 'Certificate' ? 'bg-blue-100 border-2 border-blue-300' : ''
                  }`}
                  onDragOver={(e) => handleFolderDragOver(e, 'Certificate')}
                  onDragLeave={handleFolderDragLeave}
                  onDrop={(e) => handleFolderDrop(e, 'Certificate')}
                >
                  <div className="flex items-center">
                    <FolderIcon className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Certificates</span>
                  </div>
                  <Badge variant="outline">
                    {documents.filter(doc => doc.category === 'Certificate').length}
                  </Badge>
                </div>
                
                <div 
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                    activeDragFolder === 'Audit Report' ? 'bg-blue-100 border-2 border-blue-300' : ''
                  }`}
                  onDragOver={(e) => handleFolderDragOver(e, 'Audit Report')}
                  onDragLeave={handleFolderDragLeave}
                  onDrop={(e) => handleFolderDrop(e, 'Audit Report')}
                >
                  <div className="flex items-center">
                    <FolderIcon className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Audit Reports</span>
                  </div>
                  <Badge variant="outline">
                    {documents.filter(doc => doc.category === 'Audit Report').length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DocumentPreviewDialog 
        document={docToPreview} 
        open={showPreview} 
        onOpenChange={setShowPreview} 
        onDocumentUpdate={(updatedDoc) => {
          const updatedDocs = documents.map(d => 
            d.id === updatedDoc.id ? updatedDoc : d
          );
          console.log('Document updated:', updatedDoc);
        }}
      />

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('documents.deleteDocument')}</DialogTitle>
            <DialogDescription>
              {t('documents.deleteConfirmation', { title: deleteDialog.document?.title })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, document: null })}>
              {t('buttons.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t('buttons.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <UploadDocumentDialog 
        open={isUploadOpen} 
        onOpenChange={setIsUploadOpen} 
      />
    </div>
  );
};

export default DocumentRepository;
