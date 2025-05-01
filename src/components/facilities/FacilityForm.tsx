
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Facility } from '@/types/facility';

interface FacilityFormProps {
  initialData?: Partial<Facility>;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, { message: 'Facility name is required' }),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  country: z.string().optional(),
  contact_email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  facility_type: z.string().optional(),
});

const FacilityForm: React.FC<FacilityFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
}) => {
  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      zipcode: initialData?.zipcode || '',
      country: initialData?.country || '',
      contact_email: initialData?.contact_email || '',
      contact_phone: initialData?.contact_phone || '',
      status: initialData?.status || 'active',
      facility_type: initialData?.facility_type || '',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facility Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter facility name" {...field} />
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
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select facility type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="packaging">Packaging</SelectItem>
                      <SelectItem value="distribution">Distribution</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact email" {...field} />
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
                  <Input placeholder="Enter contact phone" {...field} />
                </FormControl>
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
                  <Input placeholder="Enter address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} />
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
                  <Input placeholder="Enter state or province" {...field} />
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
                <FormLabel>Zip/Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter zip or postal code" {...field} />
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
                  <Input placeholder="Enter country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter facility description" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Provide a brief description of this facility.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Facility' : 'Create Facility'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FacilityForm;
