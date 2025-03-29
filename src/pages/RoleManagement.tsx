
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { usePermission } from '@/contexts/PermissionContext';
import { Role, PERMISSIONS, PERMISSION_CATEGORIES } from '@/types/role';
import { fetchRoles, createRole, updateRole } from '@/services/roleService';
import { Shield, PlusCircle, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().optional(),
  level: z.enum(['organization', 'facility', 'department']),
  permissions: z.record(z.boolean()).optional(),
});

const RoleManagement: React.FC = () => {
  const { user } = useUser();
  const { hasPermission } = usePermission();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (error) {
      console.error('Error loading roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load roles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const RoleForm = ({ role, onSuccess }: { role?: Role, onSuccess?: () => void }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = !!role;
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: role?.name || '',
        description: role?.description || '',
        level: role?.level || 'organization',
        permissions: role?.permissions || {},
      },
    });
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);
      try {
        if (isEditing && role) {
          await updateRole(role.id, values);
          toast({
            title: 'Role updated',
            description: 'Role has been updated successfully',
          });
        } else {
          await createRole(values);
          toast({
            title: 'Role created',
            description: 'New role has been created successfully',
          });
        }
        
        form.reset();
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Failed to save role:', error);
        toast({
          title: 'Error',
          description: `Failed to ${isEditing ? 'update' : 'create'} role. Please try again.`,
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
      }
    };
    
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter role name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe this role" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>Brief description of this role's purpose</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Level</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="organization">Organization</SelectItem>
                    <SelectItem value="facility">Facility</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Determines the scope of this role's permissions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Permissions</h3>
            <Tabs defaultValue={PERMISSION_CATEGORIES[0]}>
              <TabsList className="mb-2">
                {PERMISSION_CATEGORIES.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {PERMISSION_CATEGORIES.map(category => (
                <TabsContent key={category} value={category} className="space-y-4">
                  {Object.values(PERMISSIONS)
                    .filter(permission => permission.category === category)
                    .map(permission => (
                      <FormField
                        key={permission.key}
                        control={form.control}
                        name={`permissions.${permission.key}`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-medium">
                                {permission.name}
                              </FormLabel>
                              <FormDescription>
                                {permission.description}
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Role' : 'Create Role')}
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    loadRoles();
  };

  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setSelectedRole(null);
    loadRoles();
  };

  // Check if user has permission to manage roles
  const canManageRoles = hasPermission('roles:manage');

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Role Management</h1>
        
        {canManageRoles && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create Role</DialogTitle>
                <DialogDescription>
                  Define a new role with specific permissions.
                </DialogDescription>
              </DialogHeader>
              <RoleForm onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>
            Manage roles and their permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading roles...</p>
            </div>
          ) : roles.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No roles found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Permissions</TableHead>
                  {canManageRoles && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {role.name}
                    </TableCell>
                    <TableCell>{role.description || 'No description'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {role.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-md">
                        {Object.keys(role.permissions || {}).map((key) => (
                          <Badge key={key} variant="secondary" className="text-xs">
                            {key}
                          </Badge>
                        ))}
                        {Object.keys(role.permissions || {}).length === 0 && (
                          <span className="text-muted-foreground text-sm">No permissions</span>
                        )}
                      </div>
                    </TableCell>
                    {canManageRoles && (
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditClick(role)}
                        >
                          <Pencil className="h-4 w-4" />
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
      
      {/* Edit Role Dialog */}
      {selectedRole && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Update role information and permissions.
              </DialogDescription>
            </DialogHeader>
            <RoleForm 
              role={selectedRole}
              onSuccess={handleEditSuccess}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RoleManagement;
