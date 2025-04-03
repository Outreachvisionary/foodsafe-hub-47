
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Pencil, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Department } from '@/types/department';
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment } from '@/services/departmentService';
import { fetchOrganizations } from '@/services/organizationService';
import { fetchFacilities } from '@/services/facilityService';
import OrganizationSelector from '@/components/organizations/OrganizationSelector';

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Department>>({
    name: '',
    description: '',
    organization_id: '',
    facility_id: undefined
  });
  const [hasOrganizations, setHasOrganizations] = useState(false);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | undefined>(undefined);
  const [facilities, setFacilities] = useState<{ id: string; name: string }[]>([]);
  const [isFacilitiesLoading, setIsFacilitiesLoading] = useState(false);
  
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    // Load organizations to check if they exist
    const checkOrganizations = async () => {
      try {
        const orgs = await fetchOrganizations();
        setHasOrganizations(orgs.length > 0);
        if (orgs.length > 0) {
          setSelectedOrganizationId(orgs[0].id);
          setFormData(prev => ({ ...prev, organization_id: orgs[0].id }));
        }
      } catch (err) {
        console.error('Error checking organizations:', err);
        setHasOrganizations(false);
      }
    };
    
    checkOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrganizationId) {
      loadFacilities();
      loadDepartments();
    }
  }, [selectedOrganizationId]);
  
  const loadFacilities = async () => {
    if (!selectedOrganizationId) return;
    
    setIsFacilitiesLoading(true);
    try {
      const data = await fetchFacilities(selectedOrganizationId);
      setFacilities(data.map(facility => ({
        id: facility.id,
        name: facility.name
      })));
    } catch (err) {
      console.error('Error loading facilities:', err);
      toast({
        title: 'Error',
        description: 'Failed to load facilities',
        variant: 'destructive',
      });
    } finally {
      setIsFacilitiesLoading(false);
    }
  };

  const loadDepartments = async () => {
    if (!selectedOrganizationId) return;
    
    setLoading(true);
    try {
      const data = await fetchDepartments(selectedOrganizationId);
      setDepartments(data);
    } catch (err) {
      console.error('Error loading departments:', err);
      toast({
        title: 'Error',
        description: 'Failed to load departments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async () => {
    try {
      if (!formData.name) {
        toast({
          title: 'Error',
          description: 'Department name is required',
          variant: 'destructive',
        });
        return;
      }
      
      if (!formData.organization_id) {
        toast({
          title: 'Error',
          description: 'Organization is required',
          variant: 'destructive',
        });
        return;
      }
      
      const newDepartment = await createDepartment(formData);
      setDepartments([...departments, newDepartment]);
      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        description: '',
        organization_id: selectedOrganizationId,
        facility_id: undefined
      });
      
      toast({
        title: 'Success',
        description: 'Department created successfully',
      });
    } catch (err) {
      console.error('Error creating department:', err);
      toast({
        title: 'Error',
        description: 'Failed to create department',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateDepartment = async () => {
    try {
      if (!selectedDepartment) return;
      
      if (!formData.name) {
        toast({
          title: 'Error',
          description: 'Department name is required',
          variant: 'destructive',
        });
        return;
      }
      
      const updatedDepartment = await updateDepartment(selectedDepartment.id, formData);
      
      setDepartments(departments.map(dept => 
        dept.id === updatedDepartment.id ? updatedDepartment : dept
      ));
      
      setIsEditDialogOpen(false);
      setSelectedDepartment(null);
      
      toast({
        title: 'Success',
        description: 'Department updated successfully',
      });
    } catch (err) {
      console.error('Error updating department:', err);
      toast({
        title: 'Error',
        description: 'Failed to update department',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      if (!selectedDepartment) return;
      
      await deleteDepartment(selectedDepartment.id);
      
      setDepartments(departments.filter(dept => dept.id !== selectedDepartment.id));
      setIsDeleteDialogOpen(false);
      setSelectedDepartment(null);
      
      toast({
        title: 'Success',
        description: 'Department deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting department:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete department',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
      organization_id: department.organization_id,
      facility_id: department.facility_id,
      parent_department_id: department.parent_department_id
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  };
  
  const handleOrganizationChange = (orgId: string) => {
    setSelectedOrganizationId(orgId);
    setFormData(prev => ({ ...prev, organization_id: orgId }));
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Department Management</h1>
        {hasOrganizations ? (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Department</DialogTitle>
                <DialogDescription>
                  Add a new department to your organization
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Organization</label>
                  <OrganizationSelector 
                    value={formData.organization_id}
                    onChange={(id) => setFormData(prev => ({ ...prev, organization_id: id }))}
                  />
                </div>
                {formData.organization_id && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter department name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter department description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Facility (Optional)</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        value={formData.facility_id || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          facility_id: e.target.value || undefined
                        }))}
                        disabled={isFacilitiesLoading || facilities.length === 0}
                      >
                        <option value="">No specific facility</option>
                        {facilities.map(facility => (
                          <option key={facility.id} value={facility.id}>
                            {facility.name}
                          </option>
                        ))}
                      </select>
                      {isFacilitiesLoading && <p className="text-sm text-muted-foreground mt-1">Loading facilities...</p>}
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateDepartment}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button onClick={() => {
            toast({
              title: 'Organization Required',
              description: 'Please create an organization first before adding departments',
              variant: 'destructive',
            });
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Create Department
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
          <CardDescription>Manage departments in your organization</CardDescription>
          
          {hasOrganizations && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Organization</label>
              <OrganizationSelector 
                value={selectedOrganizationId}
                onChange={handleOrganizationChange}
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!hasOrganizations ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Please create an organization first to manage departments
              </p>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No departments found. Create your first department.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">{department.name}</TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {department.description || 'No description'}
                      </TableCell>
                      <TableCell>
                        {facilities.find(f => f.id === department.facility_id)?.name || 'Not specified'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(department)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(department)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update department information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter department name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter department description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Facility (Optional)</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={formData.facility_id || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  facility_id: e.target.value || undefined
                }))}
                disabled={isFacilitiesLoading || facilities.length === 0}
              >
                <option value="">No specific facility</option>
                {facilities.map(facility => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDepartment}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the department "{selectedDepartment?.name}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDepartment}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentManagement;
