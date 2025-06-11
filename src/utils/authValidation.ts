
import { supabase } from '@/integrations/supabase/client';

/**
 * Validation utilities for authentication flows
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    // Note: This is a simple check and may not be 100% accurate due to Supabase limitations
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: 'dummy-password-for-check'
    });
    
    // If we get a specific error about wrong password, the email exists
    // If we get an error about user not found, the email doesn't exist
    return error?.message.includes('Invalid login credentials') === false;
  } catch (error) {
    // Default to false if we can't determine
    return false;
  }
};

export const getAuthErrorMessage = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  
  const message = error.message || error.toString();
  
  // Map common Supabase auth errors to user-friendly messages
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (message.includes('Email not confirmed')) {
    return 'Please check your email and click the confirmation link before signing in.';
  }
  
  if (message.includes('User already registered')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  
  if (message.includes('Signup is disabled')) {
    return 'New account registration is currently disabled.';
  }
  
  if (message.includes('Rate limit exceeded')) {
    return 'Too many attempts. Please wait a moment before trying again.';
  }
  
  if (message.includes('weak_password')) {
    return 'Password is too weak. Please choose a stronger password.';
  }
  
  // Return the original message if we don't have a specific mapping
  return message;
};

export default {
  validateEmail,
  validatePassword,
  checkEmailExists,
  getAuthErrorMessage,
};
