import React, { useState } from 'react';
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
  SelectValue,
} from '@/components/ui/select';
import { createFacility, updateFacility } from '@/services/facilityService';
import { useToast } from '@/components/ui/use-toast';
import { Facility } from '@/types/facility';
import { Loader2 } from 'lucide-react';

const facilityFormSchema = z.object({
  name: z.string().min(2, {
    message: "Facility name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  country: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']),
  organization_id: z.string(),
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  facility_type: z.string().optional(),
});

export type FacilityFormValues = z.infer<typeof facilityFormSchema>;

interface FacilityFormProps {
  defaultValues?: Partial<Facility>;
  onSubmitSuccess: (facility: Facility) => void;
  isNewFacility?: boolean;
  onCancel?: () => void;
}

const FacilityForm: React.FC<FacilityFormProps> = ({
  defaultValues,
  onSubmitSuccess,
  isNewFacility = false,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      address: defaultValues?.address || '',
      city: defaultValues?.city || '',
      state: defaultValues?.state || '',
      zipcode: defaultValues?.zipcode || '',
      country: defaultValues?.country || '',
      status: (defaultValues?.status as 'active' | 'inactive' | 'pending') || 'active',
      organization_id: defaultValues?.organization_id || '',
      contact_email: defaultValues?.contact_email || '',
      contact_phone: defaultValues?.contact_phone || '',
      facility_type: defaultValues?.facility_type || '',
    },
  });

  const onSubmit = async (values: FacilityFormValues) => {
    setIsSubmitting(true);
    try {
      let facility;

      if (isNewFacility) {
        facility = await createFacility(values as Facility);
        toast({
          title: "Success",
          description: "Facility created successfully",
        });
      } else {
        facility = await updateFacility(defaultValues?.id!, values);
        toast({
          title: "Success",
          description: "Facility updated successfully",
        });
      }

      onSubmitSuccess(facility);
    } catch (error) {
      console.error('Error saving facility:', error);
      toast({
        title: "Error",
        description: "Failed to save facility",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Input placeholder="E.g., Production, Warehouse" {...field} />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Textarea
                    placeholder="Brief description of the facility"
                    className="resize-none"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Street address" {...field} value={field.value || ''} />
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
                  <Input placeholder="City" {...field} value={field.value || ''} />
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
                  <Input placeholder="State or province" {...field} value={field.value || ''} />
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
                <FormLabel>Postal/Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="Postal or zip code" {...field} value={field.value || ''} />
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
                  <Input placeholder="Country" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Contact email address" 
                    {...field} 
                    value={field.value || ''} 
                  />
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
                  <Input 
                    placeholder="Contact phone number" 
                    {...field} 
                    value={field.value || ''} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="organization_id"
          render={({ field }) => (
            <input type="hidden" {...field} />
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isNewFacility ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              isNewFacility ? 'Create Facility' : 'Update Facility'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FacilityForm;
