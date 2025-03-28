
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentCategory, DocumentStatus, Document } from '@/types/database';
import { useDocuments } from '@/contexts/DocumentContext';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { FilePlus, Upload, Calendar, Tag, X } from 'lucide-react';
import enhancedDocumentService from '@/services/documentService';
import { useTranslation } from 'react-i18next';

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
  
  const isNewVersion = Boolean(existingDocument);
  const dialogTitle = isNewVersion 
    ? t('documents.uploadNewVersion') 
    : t('documents.uploadDocument');
  
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: existingDocument?.title || '',
    description: existingDocument?.description || '',
    category: (existingDocument?.category || 'SOP') as DocumentCategory,
    changeSummary: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [expiryDate, setExpiryDate] = useState<string>(
    existingDocument?.expiry_date 
      ? new Date(existingDocument.expiry_date).toISOString().split('T')[0] 
      : ''
  );
  const [tags, setTags] = useState<string[]>(existingDocument?.tags || []);
  const [tagInput, setTagInput] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

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
        title: t('common.error'),
        description: t('documents.noFileSelected'),
        variant: "destructive",
      });
      return;
    }

    if (!isNewVersion && !formData.title.trim()) {
      toast({
        title: t('common.error'),
        description: t('documents.titleRequired'),
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      if (isNewVersion && existingDocument) {
        // Upload new version for existing document
        const documentId = existingDocument.id;
        const storagePath = `${documentId}/${file.name}_v${existingDocument.version + 1}`;
        
        // Upload file to storage
        const fileUrl = await enhancedDocumentService.uploadToStorage(file, existingDocument, existingDocument.version + 1);
        
        // Create new version record
        const versionDetails = {
          file_name: file.name,
          file_path: storagePath,
          file_size: file.size,
          file_type: file.type,
          created_by: 'Current User', // In a real app, this would be the current user
          change_summary: formData.changeSummary,
          storage_path: storagePath
        };
        
        await enhancedDocumentService.createVersion(existingDocument, versionDetails);
        
        toast({
          title: t('documents.versionUploaded'),
          description: t('documents.newVersionUploadedDesc'),
        });
      } else {
        // Create new document
        const documentId = uuidv4();
        
        // Upload file to storage
        const fileUrl = await enhancedDocumentService.uploadToStorage(file, {
          id: documentId,
          title: formData.title,
          file_name: file.name
        } as Document);
        
        // Create new document with database property names
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
          created_by: 'Current User', // In a real app, this would be the current user
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          expiry_date: expiryDate ? new Date(expiryDate).toISOString() : undefined,
          tags: tags
        };

        // Add the document
        await addDocument(newDocument);
        
        // Create initial version record
        const versionDetails = {
          file_name: file.name,
          file_path: `${documentId}/${file.name}`,
          file_size: file.size,
          file_type: file.type,
          created_by: 'Current User', // In a real app, this would be the current user
          change_summary: 'Initial version',
          storage_path: `${documentId}/${file.name}`
        };
        
        await enhancedDocumentService.createVersion(newDocument, versionDetails);
        
        toast({
          title: t('documents.documentUploaded'),
          description: t('documents.documentUploadedDesc'),
        });
      }
      
      // Reset form and close dialog
      setFormData({
        title: '',
        description: '',
        category: 'SOP' as DocumentCategory,
        changeSummary: ''
      });
      setFile(null);
      setExpiryDate('');
      setTags([]);
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: t('common.error'),
        description: t('documents.uploadFailed'),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
              ? t('documents.uploadNewVersionDesc')
              : t('documents.uploadNewDocumentDesc')
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {!isNewVersion && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="title">{t('documents.documentTitle')}</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder={t('documents.enterDocumentTitle')}
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">{t('documents.description')}</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder={t('documents.enterDocumentDescription')}
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">{t('documents.category')}</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('documents.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOP">SOP</SelectItem>
                      <SelectItem value="Policy">Policy</SelectItem>
                      <SelectItem value="Form">Form</SelectItem>
                      <SelectItem value="Certificate">Certificate</SelectItem>
                      <SelectItem value="Audit Report">Audit Report</SelectItem>
                      <SelectItem value="HACCP Plan">HACCP Plan</SelectItem>
                      <SelectItem value="Training Material">Training Material</SelectItem>
                      <SelectItem value="Supplier Documentation">Supplier Documentation</SelectItem>
                      <SelectItem value="Risk Assessment">Risk Assessment</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">{t('documents.expiryDate')}</Label>
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
                <Label htmlFor="tags">{t('documents.tags')}</Label>
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
                    placeholder={t('documents.addTag')}
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
                    {t('documents.add')}
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {isNewVersion && (
            <div className="grid gap-2">
              <Label htmlFor="changeSummary">{t('documents.changeSummary')}</Label>
              <Textarea
                id="changeSummary"
                name="changeSummary"
                placeholder={t('documents.enterChangeSummary')}
                value={formData.changeSummary}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="file">{t('documents.file')}</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="flex-grow"
              />
            </div>
            {file && (
              <p className="text-sm text-gray-500">
                {t('documents.selected')}: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !file || (!isNewVersion && !formData.title.trim())}
              className="flex items-center"
            >
              {uploading ? 
                t('documents.uploading') : 
                <>
                  <FilePlus className="h-4 w-4 mr-1" />
                  {isNewVersion ? t('documents.uploadNewVersion') : t('documents.uploadDocument')}
                </>
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
