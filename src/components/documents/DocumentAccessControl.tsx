
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash, UserPlus, Users } from 'lucide-react';
import { useDocumentService } from '@/hooks/useDocumentService';
import { DocumentAccess } from '@/types/document';

interface DocumentAccessControlProps {
  documentId: string;
}

const DocumentAccessControl: React.FC<DocumentAccessControlProps> = ({ documentId }) => {
  const [accessList, setAccessList] = useState<DocumentAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [newPermissionLevel, setNewPermissionLevel] = useState('view');
  
  const { toast } = useToast();
  const { fetchAccess, grantAccess, revokeAccess } = useDocumentService();
  
  useEffect(() => {
    fetchAccessList();
  }, [documentId]);
  
  const fetchAccessList = async () => {
    setIsLoading(true);
    try {
      const accessData = await fetchAccess(documentId);
      setAccessList(accessData);
    } catch (error) {
      console.error('Error fetching access list:', error);
      toast({
        title: 'Error',
        description: 'Failed to load access permissions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddAccess = async () => {
    if (!newUserId.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a user ID',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const newAccess = await grantAccess(
        documentId,
        newUserId,
        newPermissionLevel,
        'admin' // current user ID
      );
      
      if (newAccess) {
        setAccessList((prev) => [...prev, newAccess]);
        setIsAddDialogOpen(false);
        resetForm();
        
        toast({
          title: 'Access Granted',
          description: `Access has been granted to user ${newUserId}`,
        });
      }
    } catch (error) {
      console.error('Error granting access:', error);
      toast({
        title: 'Error',
        description: 'Failed to grant access',
        variant: 'destructive',
      });
    }
  };
  
  const handleRevokeAccess = async (accessId: string) => {
    try {
      await revokeAccess(accessId);
      
      setAccessList(prev => prev.filter(access => access.id !== accessId));
      
      toast({
        title: 'Access Revoked',
        description: 'Access has been revoked successfully',
      });
    } catch (error) {
      console.error('Error revoking access:', error);
      toast({
        title: 'Error',
        description: 'Failed to revoke access',
        variant: 'destructive',
      });
    }
  };
  
  const resetForm = () => {
    setNewUserId('');
    setNewUserRole('');
    setNewPermissionLevel('view');
  };
  
  const getPermissionColor = (permissionLevel: string) => {
    switch (permissionLevel) {
      case 'owner':
        return 'bg-primary/10 text-primary';
      case 'edit':
        return 'bg-accent/10 text-accent';
      case 'comment':
        return 'bg-amber-500/10 text-amber-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Document Access Control
        </CardTitle>
        <CardDescription>
          Manage who can access, edit, or comment on this document
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            {accessList.length} {accessList.length === 1 ? 'user' : 'users'} with access
          </div>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Grant Access
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading access list...</span>
          </div>
        ) : accessList.length === 0 ? (
          <div className="text-center py-6 border rounded-md">
            <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="font-medium">No custom access permissions</p>
            <p className="text-sm text-muted-foreground mb-4">
              Only document owners and administrators can access this document.
            </p>
            <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User Access
            </Button>
          </div>
        ) : (
          <div className="border rounded-md">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Permission</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Granted By</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accessList.map((access) => (
                  <tr key={access.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3">{access.user_id}</td>
                    <td className="px-4 py-3">{access.user_role || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getPermissionColor(access.permission_level)}`}>
                        {access.permission_level}
                      </span>
                    </td>
                    <td className="px-4 py-3">{access.granted_by}</td>
                    <td className="px-4 py-3">
                      {access.granted_at && new Date(access.granted_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRevokeAccess(access.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Grant Document Access</DialogTitle>
              <DialogDescription>
                Add a user to access this document with specific permissions.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">User ID</label>
                <Input 
                  placeholder="Enter user ID or email" 
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">User Role (Optional)</label>
                <Input 
                  placeholder="e.g., Quality Manager" 
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Permission Level</label>
                <Select 
                  value={newPermissionLevel} 
                  onValueChange={setNewPermissionLevel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select permission level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">View only</SelectItem>
                    <SelectItem value="comment">View and comment</SelectItem>
                    <SelectItem value="edit">Edit document</SelectItem>
                    <SelectItem value="owner">Full control (Owner)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAccess}>
                Grant Access
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DocumentAccessControl;
