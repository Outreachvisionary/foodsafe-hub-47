
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Department } from '@/types/department';
import { fetchDepartments, deleteDepartment } from '@/services/departmentService';
import DepartmentForm from '@/components/department/DepartmentForm';
import OrganizationSelector from '@/components/organizations/OrganizationSelector';
import { FolderTree, Plus, Loader2, Edit, Trash } from 'lucide-react';

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (organizationId) {
      loadDepartments();
    } else {
      setDepartments([]);
      setLoading(false);
    }
  }, [organizationId]);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await fetchDepartments(organizationId);
      setDepartments(data);
    } catch (error) {
      console.error('Error loading departments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load departments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (department: Department) => {
    setDepartments([...departments, department]);
    setIsCreateDialogOpen(false);
  };

  const handleEditSuccess = (updatedDepartment: Department) => {
    setDepartments(departments.map(dept => 
      dept.id === updatedDepartment.id ? updatedDepartment : dept
    ));
    setIsEditDialogOpen(false);
  };

  const handleEdit = (department: Department) => {
    setCurrentDepartment(department);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }
    
    try {
      await deleteDepartment(id);
      setDepartments(departments.filter(dept => dept.id !== id));
      toast({
        title: 'Success',
        description: 'Department deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting department:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete department',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Department Management</h1>
        <p className="text-muted-foreground">Create and manage departments within your organization</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Organization</label>
            <div className="flex space-x-2">
              <div className="flex-grow">
                <OrganizationSelector
                  value={organizationId}
                  onChange={setOrganizationId}
                />
              </div>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                disabled={!organizationId}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
          <CardDescription>Manage departments and their structures</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading departments...</span>
            </div>
          ) : !organizationId ? (
            <div className="text-center py-8">
              <FolderTree className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="mt-2 text-muted-foreground">
                Please select an organization to view departments
              </p>
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-8">
              <FolderTree className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="mt-2 text-muted-foreground">
                No departments found. Create your first department to get started.
              </p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Department
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Parent Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>{department.description || 'N/A'}</TableCell>
                    <TableCell>{department.facility_id || 'N/A'}</TableCell>
                    <TableCell>{department.parent_department_id || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(department)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(department.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Department Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Department</DialogTitle>
            <DialogDescription>
              Add a new department to your organization
            </DialogDescription>
          </DialogHeader>
          <DepartmentForm 
            organizationId={organizationId}
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update department details
            </DialogDescription>
          </DialogHeader>
          {currentDepartment && (
            <DepartmentForm 
              department={currentDepartment}
              organizationId={organizationId}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentManagement;
