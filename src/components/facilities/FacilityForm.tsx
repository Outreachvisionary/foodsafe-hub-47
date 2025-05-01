
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Facility } from '@/types/facility';

const facilitySchema = z.object({
  name: z.string().min(1, { message: 'Facility name is required' }),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  country: z.string().optional(),
  contact_email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  status: z.string().default('active'),
  facility_type: z.string().optional(),
});

interface FacilityFormProps {
  onSubmit: (data: Partial<Facility>) => void;
  initialData?: Partial<Facility>;
  isLoading?: boolean;
}

const FacilityForm: React.FC<FacilityFormProps> = ({ 
  onSubmit, 
  initialData = {}, 
  isLoading = false 
}) => {
  const form = useForm<z.infer<typeof facilitySchema>>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: initialData.name || '',
      description: initialData.description || '',
      address: initialData.address || '',
      city: initialData.city || '',
      state: initialData.state || '',
      zipcode: initialData.zipcode || '',
      country: initialData.country || '',
      contact_email: initialData.contact_email || '',
      contact_phone: initialData.contact_phone || '',
      status: initialData.status || 'active',
      facility_type: initialData.facility_type || '',
    },
  });

  const handleSubmit = (data: z.infer<typeof facilitySchema>) => {
    onSubmit(data);
  };

  const facilityTypes = [
    'Manufacturing', 
    'Processing', 
    'Warehouse', 
    'Distribution Center',
    'Cold Storage',
    'Corporate Office',
    'Research & Development',
    'Other'
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facility Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter facility name" {...field} />
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
          name="facility_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facility Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {facilityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Street address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                <FormLabel>ZIP/Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="ZIP/Postal code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  <Input placeholder="+1 (555) 123-4567" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Facility'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FacilityForm;
