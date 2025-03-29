
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { usePermission } from '@/contexts/PermissionContext';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { UserRole } from '@/types/role';
import { OnboardingInvite } from '@/types/onboarding';
import { deleteInvite, getOrganizationInvites } from '@/services/onboardingService';
import { getUserRoles, removeRoleFromUser } from '@/services/roleService';
import { fetchDepartments } from '@/services/departmentService';
import { Department } from '@/types/department';
import { Users, UserPlus, Shield, Building2, Trash2, Mail } from 'lucide-react';
import InviteUserForm from '@/components/onboarding/InviteUserForm';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const UserManagement: React.FC = () => {
  const { user } = useUser();
  const { hasPermission } = usePermission();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [invites, setInvites] = useState<OnboardingInvite[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [userRoles, setUserRoles] = useState<Record<string, UserRole[]>>({});
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>('');
  
  useEffect(() => {
    if (user?.organization_id) {
      setSelectedOrganizationId(user.organization_id);
      loadData(user.organization_id);
    }
  }, [user]);

  const loadData = async (organizationId: string) => {
    setLoading(true);
    try {
      // Load users for this organization
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .eq('organization_id', organizationId);
      
      if (usersError) throw usersError;
      setUsers(usersData as UserProfile[]);
      
      // Load pending invites
      const invitesData = await getOrganizationInvites(organizationId);
      setInvites(invitesData);
      
      // Load departments
      const departmentsData = await fetchDepartments(organizationId);
      setDepartments(departmentsData);
      
      // Load roles for each user
      const rolesMap: Record<string, UserRole[]> = {};
      for (const profile of usersData) {
        try {
          const userRolesData = await getUserRoles(profile.id);
          rolesMap[profile.id] = userRolesData;
        } catch (error) {
          console.error(`Error loading roles for user ${profile.id}:`, error);
        }
      }
      setUserRoles(rolesMap);
      
    } catch (error) {
      console.error('Error loading user management data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentName = (departmentId?: string): string => {
    if (!departmentId) return 'None';
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : 'Unknown';
  };

  const handleDeleteInvite = async (id: string) => {
    try {
      await deleteInvite(id);
      setInvites(invites.filter(invite => invite.id !== id));
      toast({
        title: 'Invite deleted',
        description: 'The invitation has been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting invite:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the invitation',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveRole = async (userRoleId: string, userId: string) => {
    try {
      await removeRoleFromUser(userRoleId);
      
      // Update the local state
      setUserRoles(prev => {
        const updated = { ...prev };
        if (updated[userId]) {
          updated[userId] = updated[userId].filter(role => role.id !== userRoleId);
        }
        return updated;
      });
      
      toast({
        title: 'Role removed',
        description: 'The role has been removed successfully',
      });
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove the role',
        variant: 'destructive',
      });
    }
  };

  const handleInviteSuccess = () => {
    setInviteDialogOpen(false);
    loadData(selectedOrganizationId);
  };

  // Check if user has permission to manage users
  const canManageUsers = hasPermission('users:manage', selectedOrganizationId);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        
        {canManageUsers && (
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Invite User</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your organization.
                </DialogDescription>
              </DialogHeader>
              <InviteUserForm 
                organizationId={selectedOrganizationId} 
                onSuccess={handleInviteSuccess}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="invites">
            <Mail className="mr-2 h-4 w-4" />
            Pending Invites
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage users and their roles in your organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No users found in this organization.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Status</TableHead>
                      {canManageUsers && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">
                          {profile.full_name || 'Unnamed User'}
                        </TableCell>
                        <TableCell>{profile.email}</TableCell>
                        <TableCell>{getDepartmentName(profile.department_id)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {userRoles[profile.id]?.map((role) => (
                              <Badge key={role.id} variant="secondary" className="flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                {role.role_name}
                                {canManageUsers && (
                                  <button 
                                    onClick={() => handleRemoveRole(role.id, profile.id)}
                                    className="ml-1 text-muted-foreground hover:text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </Badge>
                            ))}
                            {(!userRoles[profile.id] || userRoles[profile.id].length === 0) && (
                              <span className="text-muted-foreground text-sm">No roles assigned</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={profile.status === 'active' ? 'default' : 'outline'}>
                            {profile.status || 'active'}
                          </Badge>
                        </TableCell>
                        {canManageUsers && (
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">Manage</Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invites">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                View and manage pending user invitations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading invitations...</p>
                </div>
              ) : invites.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No pending invitations found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Invited By</TableHead>
                      <TableHead>Invited At</TableHead>
                      <TableHead>Expires At</TableHead>
                      {canManageUsers && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invites.map((invite) => (
                      <TableRow key={invite.id}>
                        <TableCell className="font-medium">{invite.email}</TableCell>
                        <TableCell>{getDepartmentName(invite.department_id)}</TableCell>
                        <TableCell>{invite.invited_by}</TableCell>
                        <TableCell>{new Date(invite.invited_at || '').toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(invite.expires_at).toLocaleDateString()}</TableCell>
                        {canManageUsers && (
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteInvite(invite.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
