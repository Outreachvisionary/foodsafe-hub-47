import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';

// DepartmentManagement component
const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    facility_id: '',
  });
  const [facilities, setFacilities] = useState([]);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [editedDepartment, setEditedDepartment] = useState({
    name: '',
    description: '',
    facility_id: '',
  });

  useEffect(() => {
    fetchDepartments();
    fetchFacilities();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    }
  };

  const fetchFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('id, name')
        .order('name', { ascending: true });
      if (error) throw error;
      setFacilities(data || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast.error('Failed to load facilities');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDepartment({ ...newDepartment, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewDepartment({ ...newDepartment, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const { name, description, facility_id } = newDepartment;
      if (!name || !description || !facility_id) {
        toast.error('Please fill all fields');
        return;
      }

      const { data, error } = await supabase
        .from('departments')
        .insert([newDepartment])
        .select()
        .single();

      if (error) throw error;

      setDepartments([...departments, data]);
      setNewDepartment({
        name: '',
        description: '',
        facility_id: '',
      });
      setIsDialogOpen(false);
      toast.success('Department created successfully');
    } catch (error) {
      console.error('Error creating department:', error);
      toast.error('Failed to create department');
    }
  };

  const startEditing = (department) => {
    setEditingDepartmentId(department.id);
    setEditedDepartment({
      name: department.name,
      description: department.description,
      facility_id: department.facility_id,
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedDepartment({ ...editedDepartment, [name]: value });
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setEditedDepartment({ ...editedDepartment, [name]: value });
  };

  const updateDepartment = async () => {
    try {
      const { error } = await supabase
        .from('departments')
        .update(editedDepartment)
        .eq('id', editingDepartmentId)
        .select()
        .single();

      if (error) throw error;

      setDepartments(
        departments.map((dept) =>
          dept.id === editingDepartmentId ? { ...dept, ...editedDepartment } : dept
        )
      );
      setEditingDepartmentId(null);
      toast.success('Department updated successfully');
    } catch (error) {
      console.error('Error updating department:', error);
      toast.error('Failed to update department');
    }
  };
  
  // Updated function to return a boolean for delete result
  const handleDeleteDepartment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Update the departments list after successful deletion
      setDepartments(departments.filter(dept => dept.id !== id));
      toast.success('Department deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Failed to delete department');
      return false;
    }
  };

  // This updated function will return the boolean from handleDeleteDepartment
  const confirmDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      return handleDeleteDepartment(id);
    }
    return false;
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Departments Management</CardTitle>
            <CardDescription>
              Manage departments within your organization
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Department</DialogTitle>
                <DialogDescription>
                  Add a new department to the system
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={newDepartment.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    type="text"
                    id="description"
                    name="description"
                    value={newDepartment.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="facility_id" className="text-right">
                    Facility
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('facility_id', value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a facility" />
                    </SelectTrigger>
                    <SelectContent>
                      {facilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSubmit}>
                  Create Department
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Departments List</CardTitle>
          <CardDescription>
            View and manage existing departments
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {departments.map((department) =>
                editingDepartmentId === department.id ? (
                  <TableRow key={department.id}>
                    <TableCell>
                      <Input
                        type="text"
                        name="name"
                        value={editedDepartment.name}
                        onChange={handleEditInputChange}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        name="description"
                        value={editedDepartment.description}
                        onChange={handleEditInputChange}
                      />
                    </TableCell>
                    <TableCell>
                      <Select onValueChange={(value) => handleEditSelectChange('facility_id', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a facility" />
                        </SelectTrigger>
                        <SelectContent>
                          {facilities.map((facility) => (
                            <SelectItem key={facility.id} value={facility.id}>
                              {facility.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={updateDepartment}>
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>{department.description}</TableCell>
                    <TableCell>
                      {
                        facilities.find(facility => facility.id === department.facility_id)?.name || 'N/A'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditing(department)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => confirmDelete(department.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentManagement;
