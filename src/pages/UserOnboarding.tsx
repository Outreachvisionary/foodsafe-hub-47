
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getInviteByToken, markInviteAsUsed } from '@/services/onboardingService';
import { assignRoleToUser } from '@/services/roleService';
import { OnboardingInvite } from '@/types/onboarding';
import { useUser } from '@/contexts/UserContext';
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
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }).optional(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const UserOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn } = useUser();
  const [invite, setInvite] = useState<OnboardingInvite | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
      return;
    }
    
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    
    if (!token) {
      toast({
        title: 'Invalid invitation',
        description: 'No invitation token provided',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    
    const fetchInvite = async () => {
      try {
        const inviteData = await getInviteByToken(token);
        if (!inviteData) {
          toast({
            title: 'Invalid or expired invitation',
            description: 'The invitation link is invalid or has expired',
            variant: 'destructive',
          });
          navigate('/auth');
          return;
        }
        
        setInvite(inviteData);
        form.setValue('email', inviteData.email);
      } catch (error) {
        console.error('Error fetching invitation:', error);
        toast({
          title: 'Error',
          description: 'Failed to load invitation details',
          variant: 'destructive',
        });
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvite();
  }, [user, location.search, navigate]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!invite) return;
    
    setIsSubmitting(true);
    try {
      // Sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: invite.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
        },
      });
      
      if (signUpError) throw signUpError;
      
      if (!signUpData.user) {
        throw new Error('Failed to create user account');
      }
      
      // Update the user's profile with organization and department
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: values.fullName,
          organization_id: invite.organization_id,
          department_id: invite.department_id,
        })
        .eq('id', signUpData.user.id);
      
      if (profileError) throw profileError;
      
      // If a role was specified in the invite, assign it to the user
      if (invite.role_id) {
        await assignRoleToUser(
          signUpData.user.id,
          invite.role_id,
          invite.organization_id,
          invite.facility_id,
          invite.department_id
        );
      }
      
      // Mark the invitation as used
      await markInviteAsUsed(invite.token);
      
      toast({
        title: 'Account created',
        description: 'Your account has been created successfully.',
      });
      
      // Sign in the user
      await signIn(invite.email, values.password);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during onboarding:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete the onboarding process. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md space-y-4 p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading invitation details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Registration</CardTitle>
            <CardDescription>
              You've been invited to join the organization.
              Complete your registration to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="Your email address"
                          {...field}
                          disabled={true}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the email address your invitation was sent to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Create a password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Must be at least 8 characters.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Confirm your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserOnboarding;
