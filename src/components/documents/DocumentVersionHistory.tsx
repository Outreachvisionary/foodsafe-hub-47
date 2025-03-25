
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Document } from '@/types/database';
import { DocumentVersion } from '@/types/document';
import { formatDistanceToNow } from 'date-fns';
import { History, Download, RefreshCw, ArrowDown, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import enhancedDocumentService from '@/services/documentService';
import { useTranslation } from 'react-i18next';

interface DocumentVersionHistoryProps {
  document: Document;
  onRevertVersion?: (document: Document, version: DocumentVersion) => void;
}

const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({ 
  document,
  onRevertVersion
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    version: null as DocumentVersion | null
  });
  
  // For the purpose of this example, we'll load mock versions
  React.useEffect(() => {
    const loadVersions = async () => {
      setIsLoading(true);
      try {
        const fetchedVersions = await enhancedDocumentService.fetchVersions(document.id);
        setVersions(fetchedVersions);
      } catch (error) {
        console.error('Error loading versions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load document versions',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVersions();
  }, [document.id]);
  
  const handleDownloadVersion = async (version: DocumentVersion) => {
    try {
      // For this example, we'll just generate a mock download URL
      // In a real app, you would fetch the actual file from storage
      const mockDownloadUrl = `#download-${version.id}`;
      
      // Create a temporary anchor element to trigger download
      const link = window.document.createElement('a');
      link.href = mockDownloadUrl;
      link.download = `${document.title}_v${version.version_number}.${version.file_type}`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      toast({
        title: t('documents.downloadStarted'),
        description: t('documents.versionDownloading', { version: version.version_number }),
      });
    } catch (error) {
      console.error('Error downloading version:', error);
      toast({
        title: t('common.error'),
        description: t('documents.errorDownloadingVersion'),
        variant: 'destructive',
      });
    }
  };
  
  const openRevertConfirmation = (version: DocumentVersion) => {
    // Only show confirmation if this isn't already the current version
    if (document.current_version_id !== version.id) {
      setConfirmDialog({
        open: true,
        version
      });
    } else {
      toast({
        title: t('documents.currentVersion'),
        description: t('documents.alreadyCurrentVersion'),
      });
    }
  };
  
  const handleRevertVersion = async () => {
    if (!confirmDialog.version || !onRevertVersion) return;
    
    try {
      setIsLoading(true);
      const updatedDoc = await enhancedDocumentService.revertToVersion(document, confirmDialog.version.id);
      
      // Close the confirmation dialog
      setConfirmDialog({
        open: false,
        version: null
      });
      
      // Notify the parent component
      onRevertVersion(updatedDoc, confirmDialog.version);
      
      toast({
        title: t('documents.versionReverted'),
        description: t('documents.documentRevertedToVersion', { version: confirmDialog.version.version_number }),
      });
    } catch (error) {
      console.error('Error reverting version:', error);
      toast({
        title: t('common.error'),
        description: t('documents.errorRevertingVersion'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5" />
              {t('documents.versionHistory')}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            {t('common.loading')}...
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5" />
              {t('documents.versionHistory')}
            </div>
          </CardTitle>
          <CardDescription>
            {t('documents.previousVersionsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {versions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('documents.version')}</TableHead>
                  <TableHead>{t('documents.modifiedBy')}</TableHead>
                  <TableHead>{t('documents.dateModified')}</TableHead>
                  <TableHead>{t('documents.changeSummary')}</TableHead>
                  <TableHead>{t('documents.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((version) => (
                  <TableRow key={version.id} className={document.current_version_id === version.id ? 'bg-blue-50' : ''}>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-medium">v{version.version_number}</span>
                        {document.current_version_id === version.id && (
                          <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
                            {t('documents.current')}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{version.created_by}</TableCell>
                    <TableCell>
                      {version.created_at ? (
                        <span title={new Date(version.created_at).toLocaleString()}>
                          {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                        </span>
                      ) : (
                        t('common.unknown')
                      )}
                    </TableCell>
                    <TableCell>
                      {version.change_summary || version.change_notes || t('documents.noChangeDescription')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDownloadVersion(version)}
                          title={t('documents.download')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {onRevertVersion && (
                          <Button
                            variant="ghost" 
                            size="icon"
                            onClick={() => openRevertConfirmation(version)}
                            title={t('documents.revertToThisVersion')}
                            disabled={document.current_version_id === version.id}
                            className={document.current_version_id === version.id ? "opacity-50 cursor-not-allowed" : ""}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              {t('documents.noVersionsAvailable')}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('documents.confirmRevert')}</DialogTitle>
            <DialogDescription>
              {t('documents.revertVersionConfirmation', { 
                version: confirmDialog.version?.version_number,
                date: confirmDialog.version?.created_at 
                  ? new Date(confirmDialog.version.created_at).toLocaleString() 
                  : t('common.unknown')
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-amber-600 text-sm">
              {t('documents.revertWarning')}
            </p>
            
            {confirmDialog.version && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <div className="text-sm font-medium mb-1">{t('documents.changeSummary')}:</div>
                <div className="text-sm text-gray-600">
                  {confirmDialog.version.change_summary || confirmDialog.version.change_notes || t('documents.noChangeDescription')}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, version: null })}>
              {t('common.cancel')}
            </Button>
            <Button 
              variant="default" 
              onClick={handleRevertVersion}
              disabled={isLoading}
              className="gap-1"
            >
              <ArrowDown className="h-4 w-4" />
              {isLoading ? t('common.processing') : t('documents.revertToThisVersion')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentVersionHistory;
