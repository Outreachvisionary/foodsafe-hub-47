import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchRoles } from '@/services/roleService';
import { fetchDepartments } from '@/services/departmentService';
import OrganizationSelector from '@/components/organizations/OrganizationSelector';
import { getOrganizations } from '@/services/organizationService';

interface UserManagementProps {}

const UserManagement: React.FC<UserManagementProps> = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | undefined>(undefined);
  const [organizations, setOrganizations] = useState<{ id: string; name: string }[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    loadOrganizations();
  }, []);
  
  useEffect(() => {
    if (selectedOrganizationId) {
      fetchUsers();
      loadRolesAndDepartments();
    }
  }, [selectedOrganizationId]);
  
  const loadOrganizations = async () => {
    try {
      const orgsData = await getOrganizations();
      setOrganizations(orgsData.map(org => ({ id: org.id, name: org.name })));
      
      if (orgsData.length > 0) {
        setSelectedOrganizationId(orgsData[0].id);
      }
    } catch (err) {
      console.error('Error loading organizations:', err);
      toast({
        title: 'Error',
        description: 'Failed to load organizations',
        variant: 'destructive'
      });
    }
  };
  
  const loadRolesAndDepartments = async () => {
    try {
      if (!selectedOrganizationId) return;
      
      const [rolesData, departmentsData] = await Promise.all([
        fetchRoles(),
        fetchDepartments(selectedOrganizationId)
      ]);
      
      setRoles(rolesData.map(role => ({ id: role.id, name: role.name })));
      setDepartments(departmentsData.map(dept => ({ id: dept.id, name: dept.name })));
    } catch (err) {
      console.error('Error loading roles or departments:', err);
      toast({
        title: 'Error',
        description: 'Failed to load roles or departments',
        variant: 'destructive'
      });
    }
  };
  
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching profiles...');
      let query = supabase.from('profiles').select('*');
      
      if (selectedOrganizationId) {
        query = query.eq('organization_id', selectedOrganizationId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('User profiles retrieved:', data);
      
      const formattedUsers = data.map(user => ({
        id: user.id,
        email: user.id.substring(0, 6) + '@example.com', // Fallback email based on ID
        full_name: user.full_name || '',
        avatar_url: user.avatar_url || '',
        role: user.role || '',
        department: user.department || '',
        department_id: user.department_id || '',
        organization_id: user.organization_id || '',
        assigned_facility_ids: user.assigned_facility_ids || [],
        preferred_language: user.preferred_language || '',
        status: user.status || '',
        metadata: {},
      }));
      
      setUsers(formattedUsers);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUserProfile = async (id: string, updates: Partial<UserProfile>) => {
    try {
      console.log('Updating user profile:', id, 'with data:', updates);
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      console.log('Updated profile:', data);
      
      setUsers(users.map(user => 
        user.id === id ? { ...user, ...updates } : user
      ));
      
      toast({
        title: 'Success',
        description: 'User profile updated successfully',
      });
      setDialogOpen(false);
    } catch (err: any) {
      console.error('Error updating user:', err);
      toast({
        title: 'Error',
        description: 'Failed to update user profile',
        variant: 'destructive',
      });
    }
  };
  
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await updateUserProfile(userId, { status: newStatus });
    } catch (err) {
      console.error('Error changing status:', err);
    }
  };
  
  const openUserDialog = (user: UserProfile) => {
    setCurrentUser(user);
    setDialogOpen(true);
  };
  
  const handleOrganizationChange = (orgId: string) => {
    setSelectedOrganizationId(orgId);
  };
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => {
          toast({
            title: 'Feature in development',
            description: 'User invitation functionality is coming soon.',
          });
        }}>
          Invite New User
        </Button>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Organization</label>
        <div className="max-w-md">
          <OrganizationSelector 
            value={selectedOrganizationId || ''}
            onChange={handleOrganizationChange}
          />
        </div>
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
                <TableCell>
                  {departments.find(d => d.id === user.department_id)?.name || user.department || 'No department'}
                </TableCell>
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
                    <Button variant="outline" size="sm" onClick={() => openUserDialog(user)}>
                      Edit
                    </Button>
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
                <label className="block text-sm font-medium mb-1">Organization</label>
                <OrganizationSelector 
                  value={currentUser.organization_id || selectedOrganizationId || ''}
                  onChange={(orgId) => {
                    setCurrentUser({...currentUser, organization_id: orgId});
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <Select 
                  value={currentUser.role || ''}
                  onValueChange={(roleId) => setCurrentUser({...currentUser, role: roleId})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <Select 
                  value={currentUser.department_id || ''}
                  onValueChange={(deptId) => setCurrentUser({...currentUser, department_id: deptId})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  if (currentUser.id) {
                    updateUserProfile(currentUser.id, {
                      full_name: currentUser.full_name,
                      role: currentUser.role,
                      department_id: currentUser.department_id,
                      organization_id: currentUser.organization_id
                    });
                  }
                }}>
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserManagement;
