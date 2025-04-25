
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
};

export const useToast = () => {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    // Map our variants to sonner's variants
    const sonnerVariant = variant === "destructive" ? "error" : 
                         variant === "success" ? "success" : "default";
    
    sonnerToast[sonnerVariant === "default" ? "message" : sonnerVariant](
      title,
      {
        description,
      }
    );
  };

  return { toast };
};

// Export named toast function for direct use
export const toast = ({ title, description, variant = "default" }: ToastProps) => {
  const { toast: toastFn } = useToast();
  toastFn({ title, description, variant });
};

export { toast as sonnerToast } from "sonner";
