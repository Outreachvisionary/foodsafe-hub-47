import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';

// Login form schema
const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters"
  })
});

// Register form schema
const registerSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters"
  }).regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter"
  }).regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter"
  }).regex(/[0-9]/, {
    message: "Password must contain at least one number"
  }),
  full_name: z.string().min(2, {
    message: "Full name is required"
  }),
  confirm_password: z.string()
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"]
});

// Auth Page
const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user
  } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>("login");

  // Parse URL params to determine initial tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [location]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Get the return URL from the query string or default to dashboard
      const params = new URLSearchParams(location.search);
      const returnUrl = params.get('returnUrl') || '/dashboard';
      console.log('User is authenticated, redirecting to:', returnUrl);
      navigate(returnUrl);
    }
  }, [user, navigate, location.search]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      full_name: ""
    }
  });

  // Login handler
  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      console.log('Attempting login with:', values.email);
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });
      if (error) {
        console.error('Login error:', error.message);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('Login successful, user:', data.user);
        toast({
          title: "Login successful",
          description: "Welcome back!"
        });

        // Get return URL from the query string or use default
        const params = new URLSearchParams(location.search);
        const returnUrl = params.get('returnUrl') || '/dashboard';
        navigate(returnUrl);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const onRegister = async (values: z.infer<typeof registerSchema>) => {
    try {
      setIsLoading(true);
      console.log('Attempting registration with:', values.email);
      const {
        data,
        error
      } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name
          }
        }
      });
      if (error) {
        console.error('Registration error:', error.message);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive"
        });
      } else if (data.user) {
        console.log('Registration successful, user:', data.user);
        if (data.session) {
          // User is already confirmed and has a session
          toast({
            title: "Registration successful",
            description: "Your account has been created and you are now logged in!"
          });
          navigate('/dashboard');
        } else {
          // User needs to confirm their email
          toast({
            title: "Registration successful",
            description: "Please check your email for a confirmation link"
          });
          setActiveTab('login');
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
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
            
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <FormField control={loginForm.control} name="email" render={({
                  field
                }) => <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                  <FormField control={loginForm.control} name="password" render={({
                  field
                }) => <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                  <Button type="submit" disabled={isLoading} className="w-full bg-cc-tagline">
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                <Link to="#" className="text-blue-600 hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <FormField control={registerForm.control} name="full_name" render={({
                  field
                }) => <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                  <FormField control={registerForm.control} name="email" render={({
                  field
                }) => <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                  <FormField control={registerForm.control} name="password" render={({
                  field
                }) => <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                  <FormField control={registerForm.control} name="confirm_password" render={({
                  field
                }) => <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>;
};
export default Auth;