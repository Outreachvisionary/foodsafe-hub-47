import React, { useState, useEffect } from 'react';
import { fetchRoles, createRole, updateRole, deleteRole } from '@/services/roleService';
import { Role } from '@/types/role';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { RoleSelector } from '@/components/role/RoleSelector';
import { usePermission } from '@/contexts/PermissionContext';
import PermissionGuard from '@/components/auth/PermissionGuard';

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 'organization' as 'organization' | 'facility' | 'department',
    permissions: {} as Record<string, boolean>,
  });
  
  const { hasPermission } = usePermission();
  
  useEffect(() => {
    loadRoles();
  }, []);
  
  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (error) {
      console.error('Error loading roles:', error);
      toast.error('Failed to load roles');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateOrUpdate = async () => {
    if (!formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }
    
    try {
      if (editingRole) {
        const updated = await updateRole(editingRole.id, formData);
        setRoles(roles.map(role => role.id === updated.id ? updated : role));
        toast.success('Role updated successfully');
      } else {
        const created = await createRole({
          name: formData.name, // Now required
          description: formData.description || undefined,
          level: formData.level,
          permissions: formData.permissions,
        });
        setRoles([...roles, created]);
        toast.success('Role created successfully');
      }
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('Failed to save role');
    }
  };
  
  const handleDelete = async (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(roleId);
        setRoles(roles.filter(role => role.id !== roleId));
        toast.success('Role deleted successfully');
      } catch (error) {
        console.error('Error deleting role:', error);
        toast.error('Failed to delete role');
      }
    }
  };
  
  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      level: role.level || 'organization',
      permissions: role.permissions || {},
    });
    setDialogOpen(true);
  };
  
  const resetForm = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      description: '',
      level: 'organization',
      permissions: {},
    });
  };
  
  const togglePermission = (key: string) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [key]: !formData.permissions[key],
      },
    });
  };
  
  const permissionDefinitions = {
    'dashboard.view': 'View Dashboard',
    'documents.create': 'Create Documents',
    'documents.view': 'View Documents',
    'documents.edit': 'Edit Documents',
    'documents.delete': 'Delete Documents',
    'haccp.view': 'View HACCP',
    'training.view': 'View Training',
    'internal_audits.view': 'View Internal Audits',
    'supplier_management.view': 'View Supplier Management',
    'traceability.view': 'View Traceability',
    'capa.view': 'View CAPA',
    'complaint_management.view': 'View Complaint Management',
    'reports.view': 'View Reports',
    'standards.view': 'View Standards',
    'non_conformance.view': 'View Non-Conformance',
    'organization.view': 'View Organization',
    'facilities.view': 'View Facilities',
    'users.view': 'View Users',
    'users.create': 'Invite Users',
    'users.edit': 'Edit Users',
    'users.delete': 'Delete Users',
    'users.status': 'Change User Status',
    'roles.view': 'View Roles',
    'roles.create': 'Create Roles',
    'roles.edit': 'Edit Roles',
    'roles.delete': 'Delete Roles',
    'departments.view': 'View Departments',
    'departments.create': 'Create Departments',
    'departments.edit': 'Edit Departments',
    'departments.delete': 'Delete Departments',
  };
  
  const getPermissionDescription = (permissionKey: string) => {
    return permissionDefinitions[permissionKey] || permissionKey;
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Role Management</h1>
        <PermissionGuard permission="roles.create">
          <Button onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}>
            Create New Role
          </Button>
        </PermissionGuard>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="list">Roles List</TabsTrigger>
          <TabsTrigger value="permissions">Permissions Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading roles...
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No roles found. Create your first role to get started.
                  </TableCell>
                </TableRow>
              ) : (
                roles.map(role => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description || 'No description'}</TableCell>
                    <TableCell className="capitalize">{role.level || 'Organization'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <PermissionGuard permission="roles.update">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(role)}>
                            Edit
                          </Button>
                        </PermissionGuard>
                        <PermissionGuard permission="roles.delete">
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(role.id)}>
                            Delete
                          </Button>
                        </PermissionGuard>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="permissions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(permissionDefinitions).map(key => (
              <div key={key} className="flex items-center justify-between p-3 rounded-md shadow-sm border border-border">
                <label htmlFor={key} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed flex-grow">
                  {getPermissionDescription(key)}
                </label>
                <Switch 
                  id={key} 
                  checked={formData.permissions[key] || false}
                  onCheckedChange={() => togglePermission(key)}
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role Name</label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter role name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter role description"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Role Level</label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  type="button"
                  variant={formData.level === 'organization' ? 'default' : 'outline'}
                  onClick={() => setFormData({...formData, level: 'organization'})}
                  className="w-full"
                >
                  Organization
                </Button>
                <Button 
                  type="button"
                  variant={formData.level === 'facility' ? 'default' : 'outline'}
                  onClick={() => setFormData({...formData, level: 'facility'})}
                  className="w-full"
                >
                  Facility
                </Button>
                <Button 
                  type="button"
                  variant={formData.level === 'department' ? 'default' : 'outline'}
                  onClick={() => setFormData({...formData, level: 'department'})}
                  className="w-full"
                >
                  Department
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Permissions</label>
              <div className="space-y-3 max-h-[300px] overflow-y-auto p-2">
                {Object.keys(permissionDefinitions).map(key => (
                  <div key={key} className="flex items-center justify-between">
                    <label htmlFor={`permission-${key}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                      {getPermissionDescription(key)}
                    </label>
                    <Switch 
                      id={`permission-${key}`} 
                      checked={formData.permissions[key] || false}
                      onCheckedChange={() => togglePermission(key)}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrUpdate}>
                {editingRole ? 'Update Role' : 'Create Role'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;
