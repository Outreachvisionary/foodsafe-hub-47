
import { z } from "zod";

export const auditSchema = z.object({
  // Basic Information
  name: z.string().min(3, { message: "Audit name must be at least 3 characters" }),
  auditType: z.enum([
    "Internal Audit",
    "External Audit",
    "Supplier Audit",
    "Regulatory Inspection",
    "Gap Assessment",
    "Compliance Audit",
    "Follow-up Audit"
  ]),
  standard: z.enum([
    "ISO 22000:2018",
    "FSSC 22000",
    "BRCGS Food Safety",
    "SQF Edition 9",
    "IFS Food",
    "HACCP",
    "GMP",
    "Regulatory Requirements",
    "Internal Standards"
  ]),
  
  // Scheduling Details
  auditDate: z.date({
    required_error: "Audit date is required",
  }).refine((date) => date >= new Date(), {
    message: "Audit date cannot be in the past",
  }),
  duration: z.number().positive({ message: "Duration must be a positive number" }),
  location: z.enum([
    "Main Production Facility",
    "Warehouse Facility",
    "Distribution Center",
    "Corporate Office",
    "Supplier Facility"
  ]),
  
  // Audit Team
  auditor: z.enum([
    "Internal - Quality Assurance Team",
    "Internal - Food Safety Team",
    "External - Certification Body",
    "External - Consultant",
    "Regulatory Authority"
  ]),
  
  // Scope & Priority
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  priorityLevel: z.enum(["Low", "Medium", "High", "Critical"]),
  departments: z.array(z.enum([
    "All Departments",
    "Production",
    "Quality Assurance",
    "Warehouse & Logistics",
    "Maintenance",
    "Sanitation",
    "Procurement",
    "Human Resources",
    "R&D"
  ])).nonempty({ message: "Please select at least one department" }),
  
  // Additional Options
  notifyParticipants: z.boolean().default(false),
  schedulePreAuditMeeting: z.boolean().default(false),
});

export type AuditFormValues = z.infer<typeof auditSchema>;
