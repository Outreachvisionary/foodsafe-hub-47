
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { Facility } from '@/types/facility';
import { createFacility, updateFacility } from '@/services/facilityService';
import { toast } from 'sonner';

// Create form schema using zod
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
  status: z.enum(["active", "inactive", "pending"]),
  organization_id: z.string().min(1, { message: "Organization is required" }),
});

type FacilityFormValues = z.infer<typeof facilityFormSchema>;

interface FacilityFormProps {
  defaultValues?: Partial<Facility>;
  onSubmitSuccess: (facility: Facility) => void;
  isNewFacility?: boolean;
}

const FacilityForm: React.FC<FacilityFormProps> = ({ 
  defaultValues, 
  onSubmitSuccess,
  isNewFacility = false
}) => {
  const [saving, setSaving] = React.useState(false);

  // Initialize form with default values
  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
      status: 'active',
      organization_id: '',
      ...defaultValues
    },
  });

  const onSubmit = async (data: FacilityFormValues) => {
    try {
      setSaving(true);
      
      // Ensure all required fields are present for a new facility
      const facilityData: any = {
        ...data,
        name: data.name,
        organization_id: data.organization_id,
        status: data.status
      };
      
      let savedFacility: Facility;
      
      if (isNewFacility) {
        savedFacility = await createFacility(facilityData as Omit<Facility, 'id'>);
        toast.success('Facility created successfully');
      } else {
        if (!defaultValues?.id) {
          throw new Error('Facility ID is required for updates');
        }
        savedFacility = await updateFacility(defaultValues.id, facilityData);
        toast.success('Facility updated successfully');
      }
      
      onSubmitSuccess(savedFacility);
    } catch (error) {
      console.error('Error saving facility:', error);
      toast.error('Failed to save facility');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Input placeholder="Brief description of the facility" {...field} />
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
                  <Input placeholder="Street address" {...field} />
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
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <FormLabel>Zip/Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Zip/Postal code" {...field} />
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
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {status}
                    </span>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!saving && <Save className="mr-2 h-4 w-4" />}
            {isNewFacility ? 'Create Facility' : 'Update Facility'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FacilityForm;
