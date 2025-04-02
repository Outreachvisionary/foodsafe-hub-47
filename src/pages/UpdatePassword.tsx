
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResetPasswordForm } from '@/hooks/useResetPasswordForm';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const UpdatePassword: React.FC = () => {
  const { updateForm, handleUpdatePassword, isLoading } = useResetPasswordForm();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we arrived here from a valid password reset link
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        toast({
          title: 'Invalid or expired session',
          description: 'Please request a new password reset link',
          variant: 'destructive',
        });
        navigate('/reset-password');
      }
    };
    
    checkSession();
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Set New Password</CardTitle>
          <CardDescription className="text-center">
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(handleUpdatePassword)} className="space-y-4">
              <FormField
                control={updateForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>
                      Password must be at least 8 characters with uppercase, lowercase, and numbers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <div className="text-sm text-gray-600">
            <Link to="/auth?mode=login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpdatePassword;
