
import React from 'react';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResetPasswordForm } from '@/hooks/useResetPasswordForm';
import { Link } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const { resetForm, handleResetPassword, isLoading, isResetSent } = useResetPasswordForm();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isResetSent ? (
            <div className="text-center py-4">
              <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
                <p className="font-medium">Reset link sent!</p>
                <p className="text-sm mt-1">Please check your email for a password reset link.</p>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Didn't receive an email? Check your spam folder or 
                <button 
                  className="text-primary hover:underline ml-1"
                  onClick={() => resetForm.handleSubmit(handleResetPassword)()}
                  disabled={isLoading}
                >
                  try again
                </button>
              </p>
            </div>
          ) : (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
                <FormField
                  control={resetForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </Button>
              </form>
            </Form>
          )}
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

export default ResetPassword;
