import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createDepartment, deleteDepartment, fetchDepartments, updateDepartment } from '@/services/departmentService';
import { Department } from '@/types/department';
import DashboardHeader from '@/components/DashboardHeader';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Department name must be at least 2 characters.",
  }),
  description: z.string().optional(),
})

const DepartmentManagement = () => {
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const loadDepartments = async () => {
    try {
      setLoading(true);
      // The modified line that was causing the error - remove the argument
      const departments = await fetchDepartments();
      setDepartmentList(departments);
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

  const handleCreateDepartment = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const newDepartment = await createDepartment(values);
      if (newDepartment) {
        setDepartmentList([...departmentList, newDepartment]);
        toast({
          title: 'Success',
          description: 'Department created successfully',
        });
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create department',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating department:', error);
      toast({
        title: 'Error',
        description: 'Failed to create department',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDepartment = async (id: string, values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const updatedDepartment = await updateDepartment(id, values);
      if (updatedDepartment) {
        setDepartmentList(departmentList.map(dept => dept.id === id ? updatedDepartment : dept));
        toast({
          title: 'Success',
          description: 'Department updated successfully',
        });
        setSelectedDepartment(null);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update department',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating department:', error);
      toast({
        title: 'Error',
        description: 'Failed to update department',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      setLoading(true);
      const success = await deleteDepartment(id);
      if (success) {
        setDepartmentList(departmentList.filter(dept => dept.id !== id));
        toast({
          title: 'Success',
          description: 'Department deleted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete department',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete department',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    form.setValue("name", department.name);
    form.setValue("description", department.description || "");
  };

  const handleCancelEdit = () => {
    setSelectedDepartment(null);
    form.reset();
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  return (
    <div className="container py-10">
      <DashboardHeader
        title="Department Management"
        subtitle="Manage departments within your organization"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDepartment ? "Edit Department" : "Create New Department"}
              </CardTitle>
              <CardDescription>
                {selectedDepartment
                  ? "Update the department details."
                  : "Add a new department to the organization."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(selectedDepartment ? (values) => handleUpdateDepartment(selectedDepartment.id, values) : handleCreateDepartment)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter department name" {...field} />
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
                          <Input placeholder="Enter department description" {...field} />
                        </FormControl>
                        <FormDescription>
                          Briefly describe the department's purpose.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    {selectedDepartment && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="mr-2"
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={loading}>
                      {loading ? "Submitting..." : selectedDepartment ? "Update Department" : "Create Department"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department List</CardTitle>
              <CardDescription>View and manage existing departments.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentList.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell>{department.name}</TableCell>
                      <TableCell>{department.description}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(department)}
                          disabled={loading}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={loading}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the department and remove its
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteDepartment(department.id)} disabled={loading}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>
                      Total {departmentList.length} Departments
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DepartmentManagement;
