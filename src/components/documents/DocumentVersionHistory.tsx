
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { History, Download, RotateCcw, Eye } from 'lucide-react';
import { Document, DocumentVersion } from '@/types/document';
import enhancedDocumentService from '@/services/documentService';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';

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
  const [loading, setLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [confirmRevertOpen, setConfirmRevertOpen] = useState(false);
  const [diffViewOpen, setDiffViewOpen] = useState(false);

  useEffect(() => {
    if (document?.id) {
      loadVersions();
    }
  }, [document?.id]);

  const loadVersions = async () => {
    if (!document?.id) return;
    
    setLoading(true);
    try {
      const fetchedVersions = await enhancedDocumentService.fetchVersions(document.id);
      setVersions(fetchedVersions);
    } catch (error) {
      console.error('Error loading document versions:', error);
      toast({
        title: t('common.error'),
        description: t('documents.errorLoadingVersions'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (version: DocumentVersion) => {
    try {
      const downloadUrl = await enhancedDocumentService.getDownloadUrl(version.storage_path);
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = version.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: t('documents.downloadStarted'),
        description: t('documents.fileDownloading', { fileName: version.file_name }),
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

  const handleRevertConfirm = async () => {
    if (!selectedVersion) return;
    
    try {
      const updatedDoc = await enhancedDocumentService.revertToVersion(document, selectedVersion.id);
      
      toast({
        title: t('documents.versionReverted'),
        description: t('documents.documentRevertedToVersion', { version: selectedVersion.version_number }),
      });
      
      if (onRevertVersion) {
        onRevertVersion(updatedDoc, selectedVersion);
      }
      
      setConfirmRevertOpen(false);
      setSelectedVersion(null);
    } catch (error) {
      console.error('Error reverting version:', error);
      toast({
        title: t('common.error'),
        description: t('documents.errorRevertingVersion'),
        variant: 'destructive',
      });
    }
  };

  const showRevertConfirm = (version: DocumentVersion) => {
    setSelectedVersion(version);
    setConfirmRevertOpen(true);
  };

  const showVersionDiff = (version: DocumentVersion) => {
    setSelectedVersion(version);
    setDiffViewOpen(true);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center">
          <History className="mr-2 h-5 w-5 text-muted-foreground" />
          {t('documents.versionHistory')}
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadVersions}
          disabled={loading}
        >
          {loading ? t('common.loading') : t('common.refresh')}
        </Button>
      </CardHeader>
      <CardContent>
        {versions.length > 0 ? (
          <ScrollArea className="h-64">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('documents.version')}</TableHead>
                  <TableHead>{t('documents.modifiedBy')}</TableHead>
                  <TableHead>{t('documents.modifiedDate')}</TableHead>
                  <TableHead>{t('documents.changeNotes')}</TableHead>
                  <TableHead className="text-right">{t('documents.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((version) => (
                  <TableRow 
                    key={version.id}
                    className={document.current_version_id === version.id ? "bg-muted/50" : ""}
                  >
                    <TableCell className="font-medium">v{version.version_number}</TableCell>
                    <TableCell>{version.created_by}</TableCell>
                    <TableCell>
                      {version.created_at ? (
                        <span title={new Date(version.created_at).toLocaleString()}>
                          {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                        </span>
                      ) : t('common.unknown')}
                    </TableCell>
                    <TableCell>{version.change_summary || t('documents.noChangeNotes')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => showVersionDiff(version)}
                          title={t('documents.viewChanges')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(version)}
                          title={t('documents.downloadVersion')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {document.current_version_id !== version.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => showRevertConfirm(version)}
                            title={t('documents.revertToVersion')}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {loading ? t('common.loading') : t('documents.noVersionsFound')}
          </div>
        )}
      </CardContent>

      {/* Revert Confirmation Dialog */}
      <Dialog open={confirmRevertOpen} onOpenChange={setConfirmRevertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('documents.confirmRevert')}</DialogTitle>
            <DialogDescription>
              {t('documents.confirmRevertDescription', { 
                version: selectedVersion?.version_number,
                date: selectedVersion?.created_at ? new Date(selectedVersion.created_at).toLocaleString() : ''
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRevertOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="default" onClick={handleRevertConfirm}>
              {t('documents.revertToThisVersion')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version Diff View Dialog */}
      {selectedVersion && (
        <Dialog open={diffViewOpen} onOpenChange={setDiffViewOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {t('documents.comparingVersions', { 
                  current: document.version,
                  previous: selectedVersion.version_number
                })}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="mb-4 text-sm text-muted-foreground">
                {t('documents.versionDetails')}:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <div className="text-sm font-medium mb-2">v{selectedVersion.version_number}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('documents.createdBy')}: {selectedVersion.created_by}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('documents.date')}: {selectedVersion.created_at ? new Date(selectedVersion.created_at).toLocaleString() : ''}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {t('documents.changeNotes')}: {selectedVersion.change_summary || t('documents.noChangeNotes')}
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="text-sm font-medium mb-2">v{document.version} ({t('documents.current')})</div>
                  <div className="text-sm text-muted-foreground">
                    {t('documents.createdBy')}: {document.created_by}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('documents.date')}: {document.updated_at ? new Date(document.updated_at).toLocaleString() : ''}
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center text-muted-foreground text-sm">
                {t('documents.contentComparisonNotAvailable')}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDiffViewOpen(false)}>
                {t('common.close')}
              </Button>
              <Button variant="default" onClick={() => handleDownload(selectedVersion)}>
                <Download className="h-4 w-4 mr-2" />
                {t('documents.downloadThisVersion')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default DocumentVersionHistory;
