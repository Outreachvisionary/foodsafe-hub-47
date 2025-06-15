
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

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

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

export function useAuthForms() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      full_name: ""
    }
  });

  // Login handler
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting login with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) {
        console.error('Login error:', error.message);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      console.log('Login successful, user:', data.user);
      toast({
        title: "Login successful",
        description: "Welcome back!"
      });

      // Get return URL from the query string or use default
      const params = new URLSearchParams(location.search);
      const returnUrl = params.get('returnUrl') || '/dashboard';
      navigate(returnUrl);
      
      return { data };
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const signUp = async (email: string, password: string, options?: { data?: any }) => {
    try {
      setIsLoading(true);
      console.log('Attempting registration with:', email);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          ...options,
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        console.error('Registration error:', error.message);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      if (data.user) {
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
          // Clear form and reset to login tab
          registerForm.reset();
          return { data, switchToLogin: true };
        }
      }
      
      return { data };
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const onLogin = async (values: LoginFormValues) => {
    return await signIn(values.email, values.password);
  };

  const onRegister = async (values: RegisterFormValues) => {
    return await signUp(values.email, values.password, {
      data: {
        full_name: values.full_name
      }
    });
  };

  return {
    loginForm,
    registerForm,
    onLogin,
    onRegister,
    signIn,
    signUp,
    isLoading
  };
}
