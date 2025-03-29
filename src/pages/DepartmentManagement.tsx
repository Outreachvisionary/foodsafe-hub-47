
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import { usePermission } from '@/contexts/PermissionContext';
import { Department } from '@/types/department';
import { fetchDepartments, deleteDepartment } from '@/services/departmentService';
import { BuildingIcon, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import DepartmentForm from '@/components/department/DepartmentForm';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import OrganizationSelector from '@/components/organizations/OrganizationSelector';

const DepartmentManagement: React.FC = () => {
  const { user } = useUser();
  const { hasPermission } = usePermission();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>(user?.organization_id || '');
  
  useEffect(() => {
    if (user?.organization_id) {
      setSelectedOrganizationId(user.organization_id);
    }
  }, [user]);

  useEffect(() => {
    if (selectedOrganizationId) {
      loadDepartments(selectedOrganizationId);
    } else {
      setDepartments([]);
      setLoading(false);
    }
  }, [selectedOrganizationId]);

  const loadDepartments = async (organizationId: string) => {
    if (!organizationId) return;
    
    setLoading(true);
    try {
      const data = await fetchDepartments(organizationId);
      setDepartments(data);
    } catch (error) {
      console.error('Error loading departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (department: Department) => {
    setCreateDialogOpen(false);
    if (selectedOrganizationId) {
      loadDepartments(selectedOrganizationId);
    }
  };

  const handleEditClick = (department: Department) => {
    setSelectedDepartment(department);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = (department: Department) => {
    setEditDialogOpen(false);
    setSelectedDepartment(null);
    if (selectedOrganizationId) {
      loadDepartments(selectedOrganizationId);
    }
  };

  const handleDeleteClick = (department: Department) => {
    setDepartmentToDelete(department);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (departmentToDelete) {
      try {
        await deleteDepartment(departmentToDelete.id);
        setDepartments(departments.filter(d => d.id !== departmentToDelete.id));
        toast.success('Department has been deleted successfully');
      } catch (error) {
        console.error('Error deleting department:', error);
        toast.error('Failed to delete department');
      } finally {
        setDeleteDialogOpen(false);
        setDepartmentToDelete(null);
      }
    }
  };

  // Check if user has permission to manage departments
  const canManageDepartments = hasPermission('departments:manage', selectedOrganizationId);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Department Management</h1>
        
        {canManageDepartments && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Department</DialogTitle>
                <DialogDescription>
                  Add a new department to your organization.
                </DialogDescription>
              </DialogHeader>
              <DepartmentForm 
                organizationId={selectedOrganizationId}
                onSave={handleCreateSuccess}
                onCancel={() => setCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {/* Organization Selector */}
      {!user?.organization_id && (
        <div className="mb-6">
          <label htmlFor="organization-select" className="block text-sm font-medium text-foreground mb-2">
            Select Organization
          </label>
          <div className="max-w-md">
            <OrganizationSelector
              value={selectedOrganizationId}
              onChange={setSelectedOrganizationId}
            />
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
          <CardDescription>
            Manage departments in your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <LoadingSpinner className="mx-auto" />
              <p className="mt-2 text-sm text-muted-foreground">Loading departments...</p>
            </div>
          ) : !selectedOrganizationId ? (
            <div className="text-center py-12">
              <BuildingIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">Please select an organization to view departments.</p>
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-12">
              <BuildingIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No departments found in this organization.</p>
              {canManageDepartments && (
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create your first department
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Facility</TableHead>
                  {canManageDepartments && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">
                      {department.name}
                    </TableCell>
                    <TableCell>{department.description || 'No description'}</TableCell>
                    <TableCell>{department.facility_id ? 'Specific facility' : 'Organization-wide'}</TableCell>
                    {canManageDepartments && (
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditClick(department)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClick(department)}
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
      
      {selectedDepartment && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>
                Update department information.
              </DialogDescription>
            </DialogHeader>
            <DepartmentForm 
              department={selectedDepartment}
              organizationId={selectedDepartment.organization_id}
              facilityId={selectedDepartment.facility_id}
              onSave={handleEditSuccess}
              onCancel={() => setEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the department
              "{departmentToDelete?.name}" and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DepartmentManagement;
