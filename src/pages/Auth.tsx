
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useAuthForms } from '@/hooks/useAuthForms';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrandedButton } from '@/components/ui/branded-button';

// Auth Page
const Auth = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading: userLoading } = useAuthRedirect();
  const { loginForm, registerForm, onLogin, onRegister, isLoading } = useAuthForms();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>("login");

  // Parse URL params to determine initial tab
  useEffect(() => {
    if (userLoading) return; // Don't update tabs while checking auth state
    
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [location, userLoading]);

  // Show a full-page spinner while checking authentication
  if (userLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  // Handle form submissions
  const handleRegisterSubmit = async (values) => {
    const shouldSwitchToLogin = await onRegister(values);
    if (shouldSwitchToLogin) {
      setActiveTab('login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12 animate-fade-in">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Compliance Core</CardTitle>
          <CardDescription className="text-center">
            Food safety compliance management platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'login' | 'register')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="animate-fade-in">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <FormField control={loginForm.control} name="email" render={({
                  field
                }) => <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                  <FormField control={loginForm.control} name="password" render={({
                  field
                }) => <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                  <BrandedButton 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full" 
                    variant="primary"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </BrandedButton>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                <Link to="#" className="text-accent hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="register" className="animate-fade-in">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
                  <FormField control={registerForm.control} name="full_name" render={({
                  field
                }) => <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                  <FormField control={registerForm.control} name="email" render={({
                  field
                }) => <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                  <FormField control={registerForm.control} name="password" render={({
                  field
                }) => <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                  <FormField control={registerForm.control} name="confirm_password" render={({
                  field
                }) => <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                  <BrandedButton 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    variant="primary"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </BrandedButton>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Export the component with a Suspense wrapper to support lazy loading
export default Auth;
