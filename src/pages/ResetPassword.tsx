
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) throw error;
      
      setResetSent(true);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your email for the password reset link',
      });
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast({
        title: 'Reset Failed',
        description: 'Failed to send reset email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const goBack = () => {
    navigate('/profile');
  };

  return (
    <div className="container max-w-md mx-auto py-10">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 flex items-center" 
        onClick={goBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Profile
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            {resetSent 
              ? 'Check your email for the password reset link' 
              : 'Enter your email to receive a password reset link'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleResetPassword}>
          <CardContent>
            {!resetSent && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            )}
            
            {resetSent && (
              <div className="bg-primary/10 p-4 rounded-md text-sm">
                <p>A password reset link has been sent to your email address. 
                Please check your inbox and follow the instructions to reset your password.</p>
                <p className="mt-2">Didn't receive an email? Check your spam folder or request another reset link.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {!resetSent ? (
              <Button type="submit" disabled={isLoading || !email}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            ) : (
              <Button 
                type="submit" 
                variant="outline" 
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Another Link'}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
