
import * as z from 'zod';
import { zipcodePatterns } from './locationUtils';

// Create a dynamic validator for zipcodes based on country
const createDynamicZipcodeValidator = () => {
  return z.object({
    zipcode: z.string().optional(),
    countryCode: z.string().optional(),
  }).refine(data => {
    // If no zipcode or no country, validation passes
    if (!data.zipcode || !data.countryCode) return true;
    
    // Get the pattern for the country or use default
    const pattern = zipcodePatterns[data.countryCode]?.pattern || zipcodePatterns.default.pattern;
    return pattern.test(data.zipcode);
  }, {
    message: "Invalid postal code format for selected country",
    path: ["zipcode"]
  });
};

// Basic location schema
export const locationSchema = z.object({
  address: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  state: z.string().optional(),
  stateCode: z.string().optional(),
  city: z.string().optional(),
  zipcode: z.string().optional(),
});

// Organization location schema
export const organizationLocationSchema = locationSchema.extend({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  description: z.string().optional(),
});

// Facility location schema
export const facilityLocationSchema = locationSchema.extend({
  name: z.string().min(2, "Facility name must be at least 2 characters"),
  organization_id: z.string().min(1, "Organization ID is required"),
  facility_type: z.string().optional(),
});

// Zipcode validator that can be used with any schema
export const zipcodeValidator = createDynamicZipcodeValidator();
