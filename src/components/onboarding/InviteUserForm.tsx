
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { createInvite } from '@/services/onboardingService';
import RoleSelector from '@/components/role/RoleSelector';
import DepartmentSelector from '@/components/department/DepartmentSelector';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  roleId: z.string({ required_error: 'Please select a role' }),
  departmentId: z.string().optional(),
});

interface InviteUserFormProps {
  organizationId: string;
  facilityId?: string;
  onSuccess?: () => void;
}

const InviteUserForm: React.FC<InviteUserFormProps> = ({ 
  organizationId, 
  facilityId,
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      roleId: '',
      departmentId: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await createInvite(
        values.email,
        organizationId,
        facilityId,
        values.departmentId || undefined,
        values.roleId
      );
      
      toast({
        title: 'Invitation sent',
        description: `An invitation has been sent to ${values.email}`,
      });
      
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to send invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to send invitation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite User</CardTitle>
        <CardDescription>
          Send an invitation to join your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the email address of the user you want to invite.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RoleSelector
                      selectedRoleId={field.value}
                      onRoleChange={field.onChange}
                      placeholder="Select a role"
                    />
                  </FormControl>
                  <FormDescription>
                    Assign a role to the user.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department (Optional)</FormLabel>
                  <FormControl>
                    <DepartmentSelector
                      value={field.value}
                      onChange={field.onChange}
                      organizationId={organizationId}
                      facilityId={facilityId}
                      placeholder="Select a department (optional)"
                    />
                  </FormControl>
                  <FormDescription>
                    Assign the user to a department.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InviteUserForm;
