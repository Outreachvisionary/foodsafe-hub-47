
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
};

export const useToast = () => {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    // Map our variants to sonner's variants
    const sonnerVariant = variant === "destructive" ? "error" : variant;
    
    sonnerToast[sonnerVariant === "default" ? "message" : sonnerVariant](
      title,
      {
        description,
      }
    );
  };

  return { toast };
};

export { toast as sonnerToast } from "sonner";
