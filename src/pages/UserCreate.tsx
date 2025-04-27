
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { User, Mail, Briefcase, Users, UserCog, ShieldCheck, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

// Define the form schema with zod
const formSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  position: z.string().min(2, { message: "Position is required" }),
  department: z.enum([
    'Quality Assurance',
    'Production',
    'Food Safety',
    'Maintenance',
    'Sanitation',
    'Human Resources',
    'Procurement',
    'Regulatory Affairs',
    'R&D',
    'Management'
  ]),

  // Access & Permissions
  systemRole: z.enum([
    'Administrator',
    'Manager',
    'Approver',
    'Editor',
    'Viewer'
  ]),
  accessLevel: z.enum([
    'Full Access',
    'Limited Access',
    'Minimal Access'
  ]),

  // Specific Permissions
  permissions: z.object({
    createDocuments: z.boolean().optional(),
    editDocuments: z.boolean().optional(),
    approveDocuments: z.boolean().optional(),
    createAudits: z.boolean().optional(),
    editAudits: z.boolean().optional(),
    createTasks: z.boolean().optional(),
    assignTasks: z.boolean().optional(),
    manageUsers: z.boolean().optional(),
    editSettings: z.boolean().optional(),
    accessReports: z.boolean().optional(),
  }),

  // Additional Options
  sendInvitation: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof formSchema>;

export default function UserCreate() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Define the default permission sets based on role
  const rolePermissionSets = {
    Administrator: {
      createDocuments: true,
      editDocuments: true,
      approveDocuments: true,
      createAudits: true,
      editAudits: true,
      createTasks: true,
      assignTasks: true,
      manageUsers: true,
      editSettings: true,
      accessReports: true,
    },
    Manager: {
      createDocuments: true,
      editDocuments: true,
      approveDocuments: true,
      createAudits: true,
      editAudits: true,
      createTasks: true,
      assignTasks: true,
      manageUsers: false,
      editSettings: false,
      accessReports: true,
    },
    Approver: {
      createDocuments: false,
      editDocuments: false,
      approveDocuments: true,
      createAudits: false,
      editAudits: false,
      createTasks: true,
      assignTasks: false,
      manageUsers: false,
      editSettings: false,
      accessReports: true,
    },
    Editor: {
      createDocuments: true,
      editDocuments: true,
      approveDocuments: false,
      createAudits: false,
      editAudits: false,
      createTasks: true,
      assignTasks: false,
      manageUsers: false,
      editSettings: false,
      accessReports: false,
    },
    Viewer: {
      createDocuments: false,
      editDocuments: false,
      approveDocuments: false,
      createAudits: false,
      editAudits: false,
      createTasks: false,
      assignTasks: false,
      manageUsers: false,
      editSettings: false,
      accessReports: false,
    }
  };
  
  // Define form with default values
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      position: '',
      department: 'Quality Assurance',
      systemRole: 'Viewer',
      accessLevel: 'Minimal Access',
      permissions: rolePermissionSets.Viewer,
      sendInvitation: true,
    },
  });

  // Watch the system role to update permissions
  const watchedRole = form.watch('systemRole');
  
  // Update permissions when role changes
  React.useEffect(() => {
    const newPermissions = rolePermissionSets[watchedRole as keyof typeof rolePermissionSets];
    Object.entries(newPermissions).forEach(([key, value]) => {
      form.setValue(`permissions.${key as keyof typeof newPermissions}`, value);
    });
  }, [watchedRole, form]);

  // Form submission handler
  async function onSubmit(data: UserFormValues) {
    try {
      // Show loading state
      setIsSubmitting(true);

      // Here we would typically integrate with API to create the user
      // This is a mock API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Display success notification
      toast({
        title: "User created successfully",
        description: `${data.firstName} ${data.lastName} has been added as a ${data.systemRole}`,
        variant: "success",
      });
      
      if (data.sendInvitation) {
        toast({
          title: "Invitation sent",
          description: `An email invitation has been sent to ${data.email}`,
          variant: "success",
        });
      }
      
      // Navigate to the users list
      navigate('/users');
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error creating user",
        description: "There was a problem creating the user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Add New User</h1>
          <p className="text-muted-foreground mt-1">Create a new user account and set permissions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/users')}>Cancel</Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormSection title="Personal Information" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Email Address */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter email address" 
                        type="email" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Position/Title */}
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Position/Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter position or title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Department */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                        <SelectItem value="Production">Production</SelectItem>
                        <SelectItem value="Food Safety">Food Safety</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Sanitation">Sanitation</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="Procurement">Procurement</SelectItem>
                        <SelectItem value="Regulatory Affairs">Regulatory Affairs</SelectItem>
                        <SelectItem value="R&D">R&D</SelectItem>
                        <SelectItem value="Management">Management</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>
          
          <FormSection title="Access & Permissions" icon={UserCog}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* System Role */}
              <FormField
                control={form.control}
                name="systemRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>System Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Administrator">Administrator</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Approver">Approver</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Defines the user's base permissions and capabilities
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Access Level */}
              <FormField
                control={form.control}
                name="accessLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Access Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select access level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Full Access">Full Access</SelectItem>
                        <SelectItem value="Limited Access">Limited Access</SelectItem>
                        <SelectItem value="Minimal Access">Minimal Access</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Determines which content and features the user can access
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Specific Permissions */}
            <div className="mt-6">
              <h3 className="text-md font-medium mb-3">Specific Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                {/* Document Permissions */}
                <FormField
                  control={form.control}
                  name="permissions.createDocuments"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Create documents</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.editDocuments"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Edit documents</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.approveDocuments"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Approve documents</FormLabel>
                    </FormItem>
                  )}
                />
                
                {/* Audit Permissions */}
                <FormField
                  control={form.control}
                  name="permissions.createAudits"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Create audits</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.editAudits"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Edit audits</FormLabel>
                    </FormItem>
                  )}
                />
                
                {/* Task Permissions */}
                <FormField
                  control={form.control}
                  name="permissions.createTasks"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Create tasks</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.assignTasks"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Assign tasks to others</FormLabel>
                    </FormItem>
                  )}
                />
                
                {/* Admin Permissions */}
                <FormField
                  control={form.control}
                  name="permissions.manageUsers"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Manage users</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.editSettings"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Edit system settings</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.accessReports"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Access reports and analytics</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </FormSection>
          
          <FormSection title="Additional Options" icon={ShieldCheck}>
            <div>
              {/* Send email invitation */}
              <FormField
                control={form.control}
                name="sendInvitation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal">Send email invitation</FormLabel>
                      <FormDescription>
                        An email will be sent to the user with instructions to set their password
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </FormSection>
          
          <div className="flex justify-between pt-6 border-t">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => navigate('/users')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating User..." : "Create User"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
