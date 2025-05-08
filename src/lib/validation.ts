
import { z } from "zod";
import { toast } from "sonner";

/**
 * Validates data using a Zod schema and shows error toasts if validation fails
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns An object with success status and validated data or errors
 */
export const validateFormData = <T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: boolean; data?: z.infer<T>; errors?: z.ZodError } => {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    console.error("Unexpected validation error:", error);
    return { success: false };
  }
};

/**
 * Shows error toasts for validation errors
 * @param errors Zod validation errors
 * @param options Configuration options
 */
export const showValidationErrors = (
  errors: z.ZodError,
  options: { title?: string; prefix?: string } = {}
): void => {
  const { title = "Validation Error", prefix = "" } = options;
  
  // Group errors by path
  const errorsByPath = errors.errors.reduce<Record<string, string[]>>(
    (acc, error) => {
      const path = error.path.join(".") || "general";
      if (!acc[path]) {
        acc[path] = [];
      }
      acc[path].push(error.message);
      return acc;
    },
    {}
  );
  
  // Display errors as toasts
  Object.entries(errorsByPath).forEach(([path, messages]) => {
    const fieldName = path === "general" 
      ? "" 
      : path.split(".").pop()?.replace(/([A-Z])/g, " $1").toLowerCase() || path;
    
    const errorMessage = messages.join(". ");
    toast.error(`${title}`, {
      description: `${prefix}${fieldName ? `${fieldName}: ` : ""}${errorMessage}`,
      duration: 5000,
    });
  });
};

/**
 * Validates form data and shows error toasts if validation fails
 * @param schema Zod schema to validate against
 * @param data Form data to validate
 * @returns Whether the validation was successful and the validated data if successful
 */
export const validateAndToast = <T extends z.ZodType>(
  schema: T,
  data: unknown,
  options: { title?: string; prefix?: string } = {}
): { success: boolean; data?: z.infer<T> } => {
  const result = validateFormData(schema, data);
  
  if (!result.success && result.errors) {
    showValidationErrors(result.errors, options);
  }
  
  return { success: result.success, data: result.data };
};

/**
 * Common validation schemas for reuse across the application
 */
export const ValidationSchemas = {
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number"),
  required: z.string().min(1, "This field is required"),
  numeric: z.number().or(z.string().regex(/^\d*\.?\d*$/).transform(Number)),
  positiveNumber: z.number().positive("Value must be positive").or(
    z.string().regex(/^\d*\.?\d*$/).transform(Number).refine(n => n > 0, "Value must be positive")
  ),
  dateString: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    "Invalid date format"
  ),
  futureDate: z.date().refine(
    (date) => date > new Date(),
    "Date must be in the future"
  ),
  uuid: z.string().uuid("Invalid ID format"),
};

