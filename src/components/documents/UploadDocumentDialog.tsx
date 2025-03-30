import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentCategory, DocumentStatus, Document } from '@/types/database';
import { useDocuments } from '@/contexts/DocumentContext';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { FilePlus, Upload, Calendar, Tag, X, AlertCircle, Loader2 } from 'lucide-react';
import documentService from '@/services/documentService';
import { useTranslation } from 'react-i18next';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useDocumentCategories } from '@/hooks/useDocumentReferences';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingDocument?: Document; // Optional for creating new versions
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({ 
  open, 
  onOpenChange,
  existingDocument 
}) => {
  const { t } = useTranslation();
  const { addDocument } = useDocuments();
  const { toast } = useToast();
  const { categories, loading: categoriesLoading } = useDocumentCategories();
  
  const isNewVersion = Boolean(existingDocument);
  const dialogTitle = isNewVersion 
    ? t('documents.uploadNewVersion', 'Upload New Version') 
    : t('documents.uploadDocument', 'Upload Document');
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: existingDocument?.title || '',
    description: existingDocument?.description || '',
    category: (existingDocument?.category || 'SOP') as DocumentCategory,
    changeSummary: ''
  });
  
  const { 
    file, 
    handleFileChange, 
    clearFile, 
    error: fileError 
  } = useFileUpload({
    maxSizeMB: 30, // 30MB maximum file size for documents
    allowedTypes: [
      'application/pdf', // PDFs
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PowerPoint
      'application/vnd.oasis.opendocument.text', // OpenDocument Text
      'application/vnd.oasis.opendocument.spreadsheet', // OpenDocument Spreadsheet
      'application/vnd.oasis.opendocument.presentation', // OpenDocument Presentation
      'application/rtf', // Rich Text Format
      'application/zip', 'application/x-zip-compressed', // Zip files
      'text/plain', 'text/csv', 'text/html', // Text files
      'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml' // Common image formats
    ]
  });
  
  const [expiryDate, setExpiryDate] = useState<string>(
    existingDocument?.expiry_date 
      ? new Date(existingDocument.expiry_date).toISOString().split('T')[0] 
      : ''
  );
  const [tags, setTags] = useState<string[]>(existingDocument?.tags || []);
  const [tagInput, setTagInput] = useState<string>('');

  useEffect(() => {
    if (open) {
      // Keep the existing state when dialog opens
    } else {
      // Clear form when dialog closes
      clearFile();
      setFormData({
        title: existingDocument?.title || '',
        description: existingDocument?.description || '',
        category: (existingDocument?.category || 'SOP') as DocumentCategory,
        changeSummary: ''
      });
      setExpiryDate(existingDocument?.expiry_date 
        ? new Date(existingDocument.expiry_date).toISOString().split('T')[0] 
        : '');
      setTags(existingDocument?.tags || []);
      setTagInput('');
      setUploadProgress(0);
    }
  }, [open, existingDocument, clearFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (value: DocumentCategory) => {
    setFormData({ ...formData, category: value });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: t('common.error', 'Error'),
        description: t('documents.noFileSelected', 'No file selected'),
        variant: "destructive",
      });
      return;
    }

    if (!isNewVersion && !formData.title.trim()) {
      toast({
        title: t('common.error', 'Error'),
        description: t('documents.titleRequired', 'Document title is required'),
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(10);

      if (isNewVersion && existingDocument) {
        const documentId = existingDocument.id;
        const storagePath = `documents/${documentId}/${file.name}_v${existingDocument.version + 1}`;
        
        setUploadProgress(20);
        
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev < 80) return prev + 5;
            return prev;
          });
        }, 500);
        
        await documentService.uploadFile(file, storagePath);
        clearInterval(progressInterval);
        setUploadProgress(90);
        
        const isOfficeDocument = isOfficeFileType(file.type);
        const versionDetails = {
          file_name: file.name,
          file_path: storagePath,
          file_size: file.size,
          file_type: file.type,
          created_by: 'Current User',
          change_summary: formData.changeSummary,
          storage_path: storagePath,
          is_binary_file: isOfficeDocument,
          editor_metadata: isOfficeDocument ? {
            document_type: getDocumentTypeFromMime(file.type),
            original_extension: file.name.split('.').pop()
          } : null
        };
        
        await documentService.createDocumentVersion({
          document_id: existingDocument.id,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          created_by: 'Current User',
          change_notes: formData.changeSummary,
          version: existingDocument.version + 1
        });
        
        setUploadProgress(100);
        
        toast({
          title: t('documents.versionUploaded', 'Version Uploaded'),
          description: t('documents.newVersionUploadedDesc', 'New document version has been uploaded successfully'),
        });
      } else {
        const isOfficeDocument = isOfficeFileType(file.type);
        const documentId = uuidv4();
        const storagePath = `documents/${documentId}/${file.name}`;
        
        setUploadProgress(20);
        
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev < 80) return prev + 5;
            return prev;
          });
        }, 500);
        
        await documentService.uploadFile(file, storagePath);
        clearInterval(progressInterval);
        setUploadProgress(90);
        
        const newDocument: Document = {
          id: documentId,
          title: formData.title,
          description: formData.description,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          category: formData.category,
          status: 'Draft' as DocumentStatus,
          version: 1,
          created_by: 'Current User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          expiry_date: expiryDate ? new Date(expiryDate).toISOString() : undefined,
          tags: tags
        };

        try {
          await addDocument(newDocument);
        
          await documentService.createDocumentVersion({
            document_id: documentId,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            created_by: 'Current User',
            change_notes: 'Initial version',
            version: 1
          });
          
          setUploadProgress(100);
          
          toast({
            title: t('documents.documentUploaded', 'Document Uploaded'),
            description: t('documents.documentUploadedDesc', 'Document has been uploaded successfully'),
          });
        } catch (addError) {
          console.error('Error adding document metadata:', addError);
          toast({
            title: t('common.error', 'Error'),
            description: t('documents.metadataUploadFailed', 'File uploaded but metadata could not be saved'),
            variant: "destructive",
          });
        }
      }
      
      clearFile();
      setFormData({
        title: '',
        description: '',
        category: 'SOP' as DocumentCategory,
        changeSummary: ''
      });
      setExpiryDate('');
      setTags([]);
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: t('common.error', 'Error'),
        description: t('documents.uploadFailed', 'Failed to upload document. Please try again.'),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const isOfficeFileType = (mimeType: string): boolean => {
    const officeTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.presentation',
      'application/rtf'
    ];
    return officeTypes.includes(mimeType);
  };

  const getDocumentTypeFromMime = (mimeType: string): string => {
    if (mimeType.includes('word') || mimeType === 'application/msword' || mimeType === 'application/rtf' ||
        mimeType === 'application/vnd.oasis.opendocument.text') {
      return 'word';
    } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return 'excel';
    } else if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
      return 'powerpoint';
    } else {
      return 'other';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            {dialogTitle}
          </DialogTitle>
          <DialogDescription>
            {isNewVersion 
              ? t('documents.uploadNewVersionDesc', 'Upload a new version of this document')
              : t('documents.uploadNewDocumentDesc', 'Upload a new document to the repository')
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {!isNewVersion && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="title">{t('documents.documentTitle', 'Document Title')}</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder={t('documents.enterDocumentTitle', 'Enter document title')}
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">{t('documents.description', 'Description')}</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder={t('documents.enterDocumentDescription', 'Enter document description')}
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">{t('documents.category', 'Category')}</Label>
                  {categoriesLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading categories...</span>
                    </div>
                  ) : (
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('documents.selectCategory', 'Select category')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">{t('documents.expiryDate', 'Expiry Date')}</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <Input
                      id="expiryDate"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="tags">{t('documents.tags', 'Tags')}</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <div key={tag} className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                      <span className="text-sm">{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <Input
                    id="tagInput"
                    placeholder={t('documents.addTag', 'Add tag')}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddTag}
                    className="ml-2 flex items-center"
                    disabled={!tagInput.trim()}
                  >
                    <Tag className="h-4 w-4 mr-1" />
                    {t('documents.add', 'Add')}
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {isNewVersion && (
            <div className="grid gap-2">
              <Label htmlFor="changeSummary">{t('documents.changeSummary', 'Change Summary')}</Label>
              <Textarea
                id="changeSummary"
                name="changeSummary"
                placeholder={t('documents.enterChangeSummary', 'Describe what changed in this version')}
                value={formData.changeSummary}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="file">{t('documents.file', 'File')}</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="flex-grow"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,.zip,.jpg,.jpeg,.png,.gif,.svg"
              />
            </div>
            {fileError && (
              <div className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {fileError}
              </div>
            )}
            {file && (
              <p className="text-sm text-gray-500">
                {t('documents.selected', 'Selected')}: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
            <p className="text-xs text-gray-500">
              Maximum file size: 30MB. Supported formats include PDF, Office documents, images, and text files.
            </p>
          </div>
          
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploading}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !file || (!isNewVersion && !formData.title.trim())}
              className="flex items-center"
            >
              {uploading ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('documents.uploading', 'Uploading...')}
                </span>
              ) : (
                <>
                  <FilePlus className="h-4 w-4 mr-1" />
                  {isNewVersion ? t('documents.uploadNewVersion', 'Upload New Version') : t('documents.uploadDocument', 'Upload Document')}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
