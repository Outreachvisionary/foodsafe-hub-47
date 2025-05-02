
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import RoleSelector from '@/components/auth/RoleSelector';
import { User } from '@/types/user';
import { UserCircle2, Shield, Building, Mail } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.string().min(1, {
    message: "Please select a role.",
  }),
  organizationId: z.string().optional(),
  notificationsEnabled: z.boolean().default(true),
});

interface UserFormValues extends z.infer<typeof formSchema> {}

const UserCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "",
      organizationId: "",
      notificationsEnabled: true,
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("User created:", values);
      toast({
        title: "User Created",
        description: `Successfully created user: ${values.fullName}`,
      });
      navigate('/user-management');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DashboardHeader title="Add New User" subtitle="Create and configure a new user account" />
      
      <div className="container mx-auto py-6">
        <Card>
          <Tabs defaultValue="basic">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Information</CardTitle>
                <TabsList>
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="access">Access & Roles</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>
                Enter the details for the new user
              </CardDescription>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent>
                  <TabsContent value="basic" className="space-y-4">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                  <UserCircle2 className="h-4 w-4" />
                                </span>
                                <Input 
                                  placeholder="Enter full name" 
                                  className="rounded-l-none" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                  <Mail className="h-4 w-4" />
                                </span>
                                <Input 
                                  type="email" 
                                  placeholder="Enter email address" 
                                  className="rounded-l-none" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Organization Details */}
                    <FormField
                      control={form.control}
                      name="organizationId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization ID</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                <Building className="h-4 w-4" />
                              </span>
                              <Input 
                                placeholder="Enter organization ID" 
                                className="rounded-l-none" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            The unique identifier for the user's organization
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="access" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Role</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                <Shield className="h-4 w-4" />
                              </span>
                              <div className="flex-1">
                                <RoleSelector 
                                  value={field.value} 
                                  onChange={field.onChange}
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Determines the user's permissions and access level
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Add more access-related fields here if needed */}
                  </TabsContent>
                  
                  <TabsContent value="preferences" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="notificationsEnabled"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 text-primary"
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">Email Notifications</FormLabel>
                          </div>
                          <FormDescription className="ml-6">
                            Send email notifications for system events
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Add more preference-related fields here if needed */}
                  </TabsContent>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t p-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/user-management')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create User'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Tabs>
        </Card>
      </div>
    </>
  );
};

export default UserCreate;
