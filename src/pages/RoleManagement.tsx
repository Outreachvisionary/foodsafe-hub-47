
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash, Shield, Users, Check } from 'lucide-react';
import { 
  Dialog, 
  DialogClose,
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PermissionGuard from '@/components/auth/PermissionGuard';

// Mock data for roles
const mockRoles = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: [
      'user.create', 'user.read', 'user.update', 'user.delete',
      'role.create', 'role.read', 'role.update', 'role.delete',
      'org.create', 'org.read', 'org.update', 'org.delete',
    ],
    userCount: 3,
    isBuiltIn: true
  },
  {
    id: '2',
    name: 'Quality Manager',
    description: 'Manages quality processes and compliance',
    permissions: [
      'user.read',
      'role.read',
      'org.read',
      'doc.create', 'doc.read', 'doc.update',
      'audit.create', 'audit.read', 'audit.update',
    ],
    userCount: 5,
    isBuiltIn: false
  },
  {
    id: '3',
    name: 'Production Manager',
    description: 'Manages production processes',
    permissions: [
      'user.read',
      'org.read',
      'doc.read',
      'prod.create', 'prod.read', 'prod.update',
    ],
    userCount: 7,
    isBuiltIn: false
  },
  {
    id: '4',
    name: 'Line Worker',
    description: 'Basic access for production line workers',
    permissions: [
      'doc.read',
      'prod.read',
    ],
    userCount: 15,
    isBuiltIn: false
  }
];

// Mock permission groups
const permissionGroups = [
  {
    name: 'User Management',
    permissions: [
      { id: 'user.create', name: 'Create Users' },
      { id: 'user.read', name: 'View Users' },
      { id: 'user.update', name: 'Update Users' },
      { id: 'user.delete', name: 'Delete Users' },
    ]
  },
  {
    name: 'Role Management',
    permissions: [
      { id: 'role.create', name: 'Create Roles' },
      { id: 'role.read', name: 'View Roles' },
      { id: 'role.update', name: 'Update Roles' },
      { id: 'role.delete', name: 'Delete Roles' },
    ]
  },
  {
    name: 'Organization',
    permissions: [
      { id: 'org.create', name: 'Create Organizations' },
      { id: 'org.read', name: 'View Organizations' },
      { id: 'org.update', name: 'Update Organizations' },
      { id: 'org.delete', name: 'Delete Organizations' },
    ]
  },
  {
    name: 'Document Control',
    permissions: [
      { id: 'doc.create', name: 'Create Documents' },
      { id: 'doc.read', name: 'View Documents' },
      { id: 'doc.update', name: 'Update Documents' },
      { id: 'doc.delete', name: 'Delete Documents' },
      { id: 'doc.approve', name: 'Approve Documents' },
    ]
  },
  {
    name: 'Audits',
    permissions: [
      { id: 'audit.create', name: 'Create Audits' },
      { id: 'audit.read', name: 'View Audits' },
      { id: 'audit.update', name: 'Update Audits' },
      { id: 'audit.delete', name: 'Delete Audits' },
    ]
  },
  {
    name: 'Production',
    permissions: [
      { id: 'prod.create', name: 'Create Production Records' },
      { id: 'prod.read', name: 'View Production Records' },
      { id: 'prod.update', name: 'Update Production Records' },
      { id: 'prod.delete', name: 'Delete Production Records' },
    ]
  },
];

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const handleEditRole = (role: any) => {
    setEditingRole(role);
    setSelectedRolePermissions([...role.permissions]);
  };

  const handlePermissionChange = (permissionId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedRolePermissions([...selectedRolePermissions, permissionId]);
    } else {
      setSelectedRolePermissions(selectedRolePermissions.filter(id => id !== permissionId));
    }
  };

  const handleSaveRole = () => {
    if (!editingRole) return;

    const updatedRoles = roles.map(role => {
      if (role.id === editingRole.id) {
        return {
          ...role,
          permissions: selectedRolePermissions
        };
      }
      return role;
    });

    setRoles(updatedRoles);
    setEditingRole(null);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoleToDelete(roleId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRole = () => {
    if (!roleToDelete) return;
    
    setRoles(roles.filter(role => role.id !== roleToDelete));
    setShowDeleteConfirm(false);
    setRoleToDelete(null);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">Configure system roles and permissions</p>
        </div>
        
        <PermissionGuard permissions="role.create">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Define a new role with specific permissions
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Role Name</Label>
                    <Input id="name" placeholder="Enter role name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Enter role description" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                    {permissionGroups.map((group) => (
                      <div key={group.name} className="mb-4">
                        <h4 className="font-medium mb-2 text-sm">{group.name}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {group.permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <Checkbox id={permission.id} />
                              <label htmlFor={permission.id} className="text-sm">
                                {permission.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Create Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PermissionGuard>
      </div>
      
      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Users by Role
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>System Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">
                        {role.name}
                        {role.isBuiltIn && (
                          <Badge variant="secondary" className="ml-2">Built-in</Badge>
                        )}
                      </TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>{role.userCount}</TableCell>
                      <TableCell className="text-right">
                        <PermissionGuard permissions="role.update">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditRole(role)}
                                disabled={role.isBuiltIn}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Edit Role: {editingRole?.name}</DialogTitle>
                                <DialogDescription>
                                  Modify role permissions and details
                                </DialogDescription>
                              </DialogHeader>
                              
                              {editingRole && (
                                <div className="py-4 space-y-4">
                                  <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-name">Role Name</Label>
                                      <Input 
                                        id="edit-name" 
                                        defaultValue={editingRole.name}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-description">Description</Label>
                                      <Input 
                                        id="edit-description" 
                                        defaultValue={editingRole.description}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label>Permissions</Label>
                                    <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                                      {permissionGroups.map((group) => (
                                        <div key={group.name} className="mb-4">
                                          <h4 className="font-medium mb-2 text-sm">{group.name}</h4>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {group.permissions.map((permission) => (
                                              <div key={permission.id} className="flex items-center space-x-2">
                                                <Checkbox 
                                                  id={`edit-${permission.id}`}
                                                  checked={selectedRolePermissions.includes(permission.id)}
                                                  onCheckedChange={(checked) => 
                                                    handlePermissionChange(permission.id, checked === true)
                                                  }
                                                />
                                                <label htmlFor={`edit-${permission.id}`} className="text-sm">
                                                  {permission.name}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button onClick={handleSaveRole}>Save Changes</Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </PermissionGuard>
                        
                        <PermissionGuard permissions="role.delete">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRole(role.id)}
                            disabled={role.isBuiltIn}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </PermissionGuard>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users by Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>User role assignments will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteRole}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;
