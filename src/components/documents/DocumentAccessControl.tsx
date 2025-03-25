
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Shield, Trash2 } from 'lucide-react';
import { DocumentAccess } from '@/types/document';
import enhancedDocumentService from '@/services/documentService';
import { useTranslation } from 'react-i18next';

interface DocumentAccessControlProps {
  documentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentAccessControl: React.FC<DocumentAccessControlProps> = ({
  documentId,
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [accessList, setAccessList] = useState<DocumentAccess[]>([]);
  const [newAccess, setNewAccess] = useState({
    userId: '',
    permissionLevel: 'view' as string,
  });

  useEffect(() => {
    if (open && documentId) {
      loadAccessList();
    }
  }, [open, documentId]);

  const loadAccessList = async () => {
    if (!documentId) return;
    
    setLoading(true);
    try {
      const fetchedAccess = await enhancedDocumentService.fetchAccess(documentId);
      setAccessList(fetchedAccess);
    } catch (error) {
      console.error('Error loading document access:', error);
      toast({
        title: t('common.error'),
        description: t('documents.errorLoadingAccess'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccess = async () => {
    if (!newAccess.userId.trim()) {
      toast({
        title: t('common.error'),
        description: t('documents.userIdRequired'),
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const accessData: Partial<DocumentAccess> = {
        document_id: documentId,
        user_id: newAccess.userId,
        permission_level: newAccess.permissionLevel,
        granted_by: 'current-user', // This would be the actual user ID in a real app
      };
      
      const createdAccess = await enhancedDocumentService.grantAccess(accessData);
      setAccessList([...accessList, createdAccess]);
      
      setNewAccess({
        userId: '',
        permissionLevel: 'view',
      });
      
      toast({
        title: t('common.success'),
        description: t('documents.accessGranted'),
      });
    } catch (error) {
      console.error('Error granting access:', error);
      toast({
        title: t('common.error'),
        description: t('documents.errorGrantingAccess'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = async (accessId: string) => {
    try {
      setLoading(true);
      await enhancedDocumentService.revokeAccess(accessId);
      setAccessList(accessList.filter(access => access.id !== accessId));
      toast({
        title: t('common.success'),
        description: t('documents.accessRevoked'),
      });
    } catch (error) {
      console.error('Error revoking access:', error);
      toast({
        title: t('common.error'),
        description: t('documents.errorRevokingAccess'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPermissionLabel = (level: string) => {
    switch (level) {
      case 'view':
        return t('documents.permissionView');
      case 'edit':
        return t('documents.permissionEdit');
      case 'approve':
        return t('documents.permissionApprove');
      case 'admin':
        return t('documents.permissionAdmin');
      default:
        return level;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {t('documents.manageDocumentAccess')}
          </DialogTitle>
          <DialogDescription>
            {t('documents.manageAccessDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-auto py-4 flex-grow">
          <div className="bg-muted/40 p-4 rounded-md mb-4">
            <h3 className="text-sm font-medium mb-2">{t('documents.addNewAccess')}</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Input
                  placeholder={t('documents.enterUserId')}
                  value={newAccess.userId}
                  onChange={(e) => setNewAccess({ ...newAccess, userId: e.target.value })}
                />
              </div>
              <div>
                <Select
                  value={newAccess.permissionLevel}
                  onValueChange={(value) => setNewAccess({ ...newAccess, permissionLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('documents.selectPermission')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">{t('documents.permissionView')}</SelectItem>
                    <SelectItem value="edit">{t('documents.permissionEdit')}</SelectItem>
                    <SelectItem value="approve">{t('documents.permissionApprove')}</SelectItem>
                    <SelectItem value="admin">{t('documents.permissionAdmin')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <Button 
                onClick={handleAddAccess} 
                disabled={loading || !newAccess.userId.trim()}
                className="flex items-center gap-1"
              >
                <UserPlus className="h-4 w-4" />
                {t('documents.grantAccess')}
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">{t('documents.currentAccess')}</h3>
            {accessList.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('documents.user')}</TableHead>
                    <TableHead>{t('documents.permissionLevel')}</TableHead>
                    <TableHead>{t('documents.grantedBy')}</TableHead>
                    <TableHead>{t('documents.grantedDate')}</TableHead>
                    <TableHead className="text-right">{t('documents.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessList.map((access) => (
                    <TableRow key={access.id}>
                      <TableCell>{access.user_id}</TableCell>
                      <TableCell>{getPermissionLabel(access.permission_level)}</TableCell>
                      <TableCell>{access.granted_by}</TableCell>
                      <TableCell>
                        {access.granted_at ? new Date(access.granted_at).toLocaleString() : ''}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRevokeAccess(access.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                {loading ? t('common.loading') : t('documents.noAccessEntriesFound')}
              </Card>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentAccessControl;
