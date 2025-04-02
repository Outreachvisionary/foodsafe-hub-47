
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';

const resetPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address"
  })
});

const updatePasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters"
  }).regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter"
  }).regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter"
  }).regex(/[0-9]/, {
    message: "Password must contain at least one number"
  }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

export function useResetPasswordForm() {
  const { resetPassword, updatePassword, isLoading } = useAuth();
  const [isResetSent, setIsResetSent] = useState(false);
  
  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const updateForm = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const handleResetPassword = async (values: ResetPasswordFormValues) => {
    try {
      await resetPassword(values.email);
      setIsResetSent(true);
      return true;
    } catch (error) {
      console.error('Error in handleResetPassword:', error);
      return false;
    }
  };

  const handleUpdatePassword = async (values: UpdatePasswordFormValues) => {
    try {
      await updatePassword(values.password);
      return true;
    } catch (error) {
      console.error('Error in handleUpdatePassword:', error);
      return false;
    }
  };

  return {
    resetForm,
    updateForm,
    handleResetPassword,
    handleUpdatePassword,
    isLoading,
    isResetSent
  };
}
