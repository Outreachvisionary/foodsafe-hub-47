
import { z } from "zod";

export const supplierSchema = z.object({
  // Supplier Information
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters" }),
  supplierType: z.enum([
    "Ingredient Supplier",
    "Packaging Supplier",
    "Service Provider",
    "Equipment Supplier",
    "Distributor",
    "Co-Manufacturer",
    "Laboratory/Testing"
  ]),
  category: z.enum([
    "Critical (Direct Food Contact)",
    "Major (Indirect Food Contact)",
    "Minor (Non-Food Contact)",
    "Service"
  ]),
  status: z.enum([
    "Approved",
    "Conditionally Approved",
    "Pending Approval",
    "Under Review",
    "Suspended",
    "Discontinued"
  ]),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  
  // Contact Information
  contactName: z.string().min(1, { message: "Contact name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  website: z.string().url({ message: "Invalid website URL" }).optional().or(z.literal("")),
  
  // Address Information
  streetAddress: z.string().min(1, { message: "Street address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State/province is required" }),
  postalCode: z.string().min(1, { message: "Postal code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  
  // Qualifications & Certifications
  approvalLevel: z.enum([
    "Tier 1 (Full Qualification)",
    "Tier 2 (Documented Assessment)",
    "Tier 3 (Basic Qualification)"
  ]),
  nextAuditDate: z.date().optional().nullable(),
  certifications: z.array(z.enum([
    "GFSI Recognized Certification",
    "HACCP Plan",
    "ISO 22000",
    "FSSC 22000",
    "BRCGS",
    "SQF",
    "IFS",
    "Organic Certification",
    "Kosher Certification",
    "Halal Certification"
  ])),
  hasFoodSafetyPlan: z.boolean().default(false),
  hasAllergenProgram: z.boolean().default(false),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
