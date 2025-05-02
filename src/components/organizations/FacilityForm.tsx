
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Facility } from '@/types/facility';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const facilityFormSchema = z.object({
  name: z.string().min(2, { message: 'Facility name must be at least 2 characters' }),
  description: z.string().optional(),
  address: z.string().optional(),
  contact_email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']),
  organization_id: z.string().min(1, { message: 'Organization ID is required' }),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zipcode: z.string().optional(),
  facility_type: z.string().optional()
});

type FacilityFormValues = z.infer<typeof facilityFormSchema>;

export interface FacilityFormProps {
  onSubmit: (data: Partial<Facility>) => void;
  initialData?: Partial<Facility>;
  isLoading?: boolean;
  onCancel?: () => void;
  isNewFacility?: boolean;
  defaultValues?: Partial<Facility>;
  onSubmitSuccess?: (facility: Facility) => void;
}

export const FacilityForm: React.FC<FacilityFormProps> = ({
  onSubmit,
  initialData = {},
  isLoading = false,
  onCancel,
  isNewFacility = false,
  defaultValues
}) => {
  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: {
      name: initialData.name || '',
      description: initialData.description || '',
      address: initialData.address || '',
      contact_email: initialData.contact_email || '',
      contact_phone: initialData.contact_phone || '',
      status: (initialData.status as 'active' | 'inactive' | 'pending') || 'active',
      organization_id: initialData.organization_id || '',
      country: initialData.country || '',
      state: initialData.state || '',
      city: initialData.city || '',
      zipcode: initialData.zipcode || '',
      facility_type: initialData.facility_type || ''
    }
  });

  const handleSubmit = (data: FacilityFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input placeholder="Facility name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief description of the facility" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organization_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization ID*</FormLabel>
              <FormControl>
                <Input placeholder="Organization ID" {...field} disabled={!isNewFacility} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facility_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facility Type</FormLabel>
              <FormControl>
                <Input placeholder="Facility type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input placeholder="State/Province" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="zipcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Postal/Zip Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="contact@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Contact phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <div className="flex space-x-4">
                {["active", "inactive", "pending"].map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id={status} 
                      checked={field.value === status}
                      onChange={() => field.onChange(status)}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <label htmlFor={status} className="text-sm font-medium text-gray-700 capitalize">
                      {status}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isNewFacility ? 'Create Facility' : 'Update Facility'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FacilityForm;
