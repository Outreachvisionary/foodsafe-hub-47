
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Trash2 } from 'lucide-react';
import { DocumentAccess } from '@/types/document';
import { useToast } from '@/hooks/use-toast';

interface DocumentAccessControlProps {
  documentId: string;
  currentUserId: string;
  onAccessUpdate?: (access: DocumentAccess[]) => void;
}

const DocumentAccessControl: React.FC<DocumentAccessControlProps> = ({
  documentId,
  currentUserId,
  onAccessUpdate
}) => {
  const { toast } = useToast();
  const [accessList, setAccessList] = useState<DocumentAccess[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newPermissionLevel, setNewPermissionLevel] = useState('read');
  const [isAdding, setIsAdding] = useState(false);

  // Mock access data for demo
  useEffect(() => {
    const mockAccess: DocumentAccess[] = [
      {
        id: '1',
        document_id: documentId,
        user_id: 'user1',
        user_role: 'Manager',
        permission_level: 'write',
        granted_by: currentUserId,
        granted_at: new Date().toISOString(),
      },
      {
        id: '2',
        document_id: documentId,
        user_id: 'user2',
        user_role: 'Quality Specialist',
        permission_level: 'read',
        granted_by: currentUserId,
        granted_at: new Date().toISOString(),
      }
    ];
    setAccessList(mockAccess);
  }, [documentId, currentUserId]);

  const handleAddAccess = async () => {
    if (!newUserEmail.trim()) return;

    setIsAdding(true);
    try {
      const newAccess: DocumentAccess = {
        id: Date.now().toString(),
        document_id: documentId,
        user_id: newUserEmail,
        permission_level: newPermissionLevel,
        granted_by: currentUserId,
        granted_at: new Date().toISOString(),
      };

      const updatedAccess = [...accessList, newAccess];
      setAccessList(updatedAccess);
      onAccessUpdate?.(updatedAccess);
      
      setNewUserEmail('');
      setNewPermissionLevel('read');
      
      toast({
        title: 'Access granted',
        description: `${newPermissionLevel} access granted to ${newUserEmail}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to grant access. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveAccess = async (accessId: string) => {
    try {
      const updatedAccess = accessList.filter(access => access.id !== accessId);
      setAccessList(updatedAccess);
      onAccessUpdate?.(updatedAccess);
      
      toast({
        title: 'Access removed',
        description: 'User access has been removed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove access. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getPermissionBadge = (level: string) => {
    switch (level) {
      case 'read':
        return <Badge variant="secondary">Read</Badge>;
      case 'write':
        return <Badge variant="default">Write</Badge>;
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Access Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new access */}
        <div className="space-y-3 p-3 border rounded-lg">
          <h4 className="font-medium text-sm">Grant Access</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label htmlFor="user-email" className="text-xs">User Email</Label>
              <Input
                id="user-email"
                placeholder="user@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="permission" className="text-xs">Permission</Label>
              <Select value={newPermissionLevel} onValueChange={setNewPermissionLevel}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read Only</SelectItem>
                  <SelectItem value="write">Read & Write</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAddAccess}
                disabled={!newUserEmail.trim() || isAdding}
                size="sm"
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {isAdding ? 'Adding...' : 'Grant'}
              </Button>
            </div>
          </div>
        </div>

        {/* Access list */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Current Access ({accessList.length})</h4>
          {accessList.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No access permissions set
            </div>
          ) : (
            <div className="space-y-2">
              {accessList.map((access) => (
                <div key={access.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-medium text-sm">{access.user_id}</p>
                      {access.user_role && (
                        <p className="text-xs text-muted-foreground">{access.user_role}</p>
                      )}
                    </div>
                    {getPermissionBadge(access.permission_level)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAccess(access.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentAccessControl;
