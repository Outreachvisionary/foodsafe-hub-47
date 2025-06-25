
import React, { useState } from 'react';
import { createRole } from '@/services/roleService';
import { Role } from '@/types/role';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface CreateRoleFormProps {
  onRoleCreated?: (role: Role) => void;
}

const CreateRoleForm: React.FC<CreateRoleFormProps> = ({ onRoleCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 'organization' as 'organization' | 'facility' | 'department',
    permissions: {} as Record<string, boolean>
  });
  const [loading, setLoading] = useState(false);

  const permissionDefinitions = {
    'dashboard.view': 'View Dashboard',
    'documents.create': 'Create Documents',
    'documents.view': 'View Documents',
    'documents.edit': 'Edit Documents',
    'documents.delete': 'Delete Documents',
    'users.view': 'View Users',
    'users.create': 'Create Users',
    'users.edit': 'Edit Users',
    'users.delete': 'Delete Users',
    'roles.view': 'View Roles',
    'roles.create': 'Create Roles',
    'roles.edit': 'Edit Roles',
    'roles.delete': 'Delete Roles'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    setLoading(true);
    try {
      const newRole = await createRole(formData);
      toast.success('Role created successfully');
      onRoleCreated?.(newRole);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        level: 'organization',
        permissions: {}
      });
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (key: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key]
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Role</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter role name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter role description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="level">Role Level</Label>
            <Select
              value={formData.level}
              onValueChange={(value: 'organization' | 'facility' | 'department') => 
                setFormData(prev => ({ ...prev, level: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="facility">Facility</SelectItem>
                <SelectItem value="department">Department</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Permissions</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {Object.entries(permissionDefinitions).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between space-x-2">
                  <Label htmlFor={key} className="text-sm flex-1">
                    {label}
                  </Label>
                  <Switch
                    id={key}
                    checked={formData.permissions[key] || false}
                    onCheckedChange={() => togglePermission(key)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Role'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateRoleForm;
