
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { toast } from 'sonner';
import RoleSelector from '@/components/role/RoleSelector';
import DepartmentSelector from '@/components/department/DepartmentSelector';
import { PermissionProvider } from '@/contexts/PermissionContext';
import PermissionGuard from '@/components/auth/PermissionGuard';

interface DbProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  department?: string;
  department_id?: string;
  organization_id?: string;
  assigned_facility_ids?: string[];
  preferred_language?: string;
  status?: string;
  email?: string; // Added email field
  metadata?: Record<string, any>; // Added metadata field
}

interface ExtendedUserProfile extends UserProfile {
  email: string;
  metadata?: Record<string, any>;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<ExtendedUserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<ExtendedUserProfile | null>(null);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      const formattedUsers: ExtendedUserProfile[] = (data as DbProfile[]).map(user => ({
        id: user.id,
        email: user.email || '',
        full_name: user.full_name || '',
        avatar_url: user.avatar_url || '',
        role: user.role || '',
        department: user.department || '',
        department_id: user.department_id || '',
        organization_id: user.organization_id || '',
        assigned_facility_ids: user.assigned_facility_ids || [],
        preferred_language: user.preferred_language || '',
        status: user.status || '',
        metadata: user.metadata || {},
      }));
      
      setUsers(formattedUsers);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
      toast.error('Error loading users');
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUserProfile = async (id: string, updates: Partial<ExtendedUserProfile>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === id ? { ...user, ...updates } : user
      ));
      
      toast.success('User profile updated successfully');
      setDialogOpen(false);
    } catch (err: any) {
      console.error('Error updating user:', err);
      toast.error('Failed to update user profile');
    }
  };
  
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await updateUserProfile(userId, { status: newStatus });
    } catch (err) {
      console.error('Error changing status:', err);
    }
  };
  
  const openUserDialog = (user: ExtendedUserProfile) => {
    setCurrentUser(user);
    setDialogOpen(true);
  };
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <PermissionGuard permission="users.invite">
          <Button onClick={() => { /* Navigate to invitation page */ }}>
            Invite New User
          </Button>
        </PermissionGuard>
      </div>
      
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                Loading users...
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.avatar_url || ''} alt={user.full_name || 'User'} />
                      <AvatarFallback>{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.full_name || 'Unnamed User'}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.role || 'No role assigned'}</TableCell>
                <TableCell>{user.department || 'No department'}</TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === 'active' ? 'default' : 
                            user.status === 'pending' ? 'outline' : 'secondary'}
                  >
                    {user.status || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <PermissionGuard permission="users.edit">
                      <Button variant="outline" size="sm" onClick={() => openUserDialog(user)}>
                        Edit
                      </Button>
                    </PermissionGuard>
                    <PermissionGuard permission="users.status">
                      {user.status === 'active' ? (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleStatusChange(user.id, 'inactive')}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => handleStatusChange(user.id, 'active')}
                        >
                          Activate
                        </Button>
                      )}
                    </PermissionGuard>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {currentUser && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User: {currentUser.full_name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input 
                  value={currentUser.full_name || ''} 
                  onChange={(e) => setCurrentUser({...currentUser, full_name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <RoleSelector 
                  value={currentUser.role || ''}
                  onChange={(roleId) => setCurrentUser({...currentUser, role: roleId})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <DepartmentSelector 
                  value={currentUser.department_id || ''}
                  onChange={(deptId) => setCurrentUser({...currentUser, department_id: deptId})}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  if (currentUser.id) {
                    updateUserProfile(currentUser.id, {
                      full_name: currentUser.full_name,
                      role: currentUser.role,
                      department_id: currentUser.department_id
                    });
                  }
                }}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserManagement;
