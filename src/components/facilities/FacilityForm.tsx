import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from 'react-hook-form/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Facility } from '@/types/facility';
import { createFacility, updateFacility } from '@/services/facilityService';
import LocationForm, { LocationData } from '@/components/location/LocationForm';
import { validateZipcode } from '@/utils/locationUtils';
import OrganizationSelector from '@/components/organizations/OrganizationSelector';

// Create form schema using zod
const facilityFormSchema = z.object({
  name: z.string().min(2, {
    message: "Facility name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  address: z.string().optional(),
  contact_email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]),
  organization_id: z.string().min(1, { message: "Organization is required" }),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zipcode: z.string().optional(),
});

type FacilityFormValues = z.infer<typeof facilityFormSchema>;

interface FacilityFormProps {
  initialData?: Partial<Facility>;
  onSuccess?: (facility: Facility) => void;
  onCancel?: () => void;
  isDialog?: boolean;
}

const FacilityForm: React.FC<FacilityFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
  isDialog = false
}) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [locationData, setLocationData] = useState<LocationData>({});
  const [zipcodeValid, setZipcodeValid] = useState<boolean>(true);
  const isNewFacility = !initialData?.id;

  console.log('FacilityForm initialized with initialData:', initialData);

  // Initialize form with default values
  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      address: initialData?.address || '',
      contact_email: initialData?.contact_email || '',
      contact_phone: initialData?.contact_phone || '',
      status: (initialData?.status as "active" | "inactive" | "pending") || 'active',
      organization_id: initialData?.organization_id || '',
      country: initialData?.country || '',
      state: initialData?.state || '',
      city: initialData?.city || '',
      zipcode: initialData?.zipcode || '',
    },
  });

  // Set initial location data
  useEffect(() => {
    if (initialData) {
      console.log('Setting initial location data from facility:', initialData);
      setLocationData({
        address: initialData.address,
        country: initialData.country,
        countryCode: initialData.location_data?.countryCode || '',
        state: initialData.state,
        stateCode: initialData.location_data?.stateCode || '',
        city: initialData.city,
        zipcode: initialData.zipcode,
      });
    }
  }, [initialData]);

  // Update form when location data changes
  useEffect(() => {
    if (locationData) {
      console.log('Updating form with location data:', locationData);
      form.setValue('address', locationData.address || '');
      form.setValue('country', locationData.country || '');
      form.setValue('state', locationData.state || '');
      form.setValue('city', locationData.city || '');
      form.setValue('zipcode', locationData.zipcode || '');
      
      // Validate zipcode if country is selected
      if (locationData.countryCode && locationData.zipcode) {
        const isValid = validateZipcode(locationData.zipcode, locationData.countryCode);
        setZipcodeValid(isValid);
      }
    }
  }, [locationData, form]);

  const handleLocationChange = (data: LocationData) => {
    console.log('Location data changed:', data);
    setLocationData(data);
  };

  const onSubmit = async (data: FacilityFormValues) => {
    try {
      // Validate zipcode if country is selected
      if (locationData.countryCode && locationData.zipcode) {
        const isValid = validateZipcode(locationData.zipcode, locationData.countryCode);
        if (!isValid) {
          toast({
            title: 'Validation Error',
            description: 'Please enter a valid postal code for the selected country',
            variant: 'destructive',
          });
          return;
        }
      }
      
      setSaving(true);
      console.log('Submitting facility data:', data);
      
      // Process the facility data
      const facilityData: Partial<Facility> = {
        ...data,
        // Get the location fields from the form data or the location component
        address: data.address || locationData.address,
        country: data.country || locationData.country,
        state: data.state || locationData.state,
        city: data.city || locationData.city,
        zipcode: data.zipcode || locationData.zipcode,
        location_data: {
          countryCode: locationData.countryCode,
          stateCode: locationData.stateCode
        }
      };
      
      console.log('Final facility data being sent to API:', facilityData);
      let savedFacility: Facility;
      
      if (isNewFacility) {
        // Create new facility
        console.log('Creating new facility with data:', facilityData);
        savedFacility = await createFacility(facilityData);
        console.log('Facility created successfully:', savedFacility);
        toast({
          title: 'Facility Created',
          description: `Successfully created ${savedFacility.name}`,
        });
      } else if (initialData?.id) {
        // Update existing facility
        console.log('Updating facility with data:', facilityData);
        savedFacility = await updateFacility(initialData.id, facilityData);
        console.log('Facility updated successfully:', savedFacility);
        toast({
          title: 'Facility Updated',
          description: `Successfully updated ${savedFacility.name}`,
        });
      } else {
        throw new Error('Facility ID is required for updates');
      }
      
      if (onSuccess) {
        onSuccess(savedFacility);
      }
      
      setSaving(false);
    } catch (error) {
      console.error('Error saving facility:', error);
      toast({
        title: 'Error',
        description: 'Failed to save facility',
        variant: 'destructive',
      });
      setSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="organization_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization*</FormLabel>
                <FormControl>
                  <OrganizationSelector
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!isNewFacility || saving}
                  />
                </FormControl>
                <FormDescription>
                  The organization this facility belongs to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facility Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter facility name" {...field} />
                </FormControl>
                <FormDescription>
                  The name of your facility as it will appear in the system
                </FormDescription>
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
                  <Textarea placeholder="Brief description of the facility" {...field} value={field.value || ''} />
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
                <div className="flex space-x-4">
                  {["active", "inactive", "pending"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id={`status-${status}`} 
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
          
          <div className="pt-4">
            <h3 className="text-lg font-medium mb-2">Location Information</h3>
            <LocationForm
              initialData={locationData}
              onChange={handleLocationChange}
              showValidationErrors={true}
              disabled={saving}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="facility@example.com" {...field} />
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
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className={`flex ${isDialog ? 'justify-end' : ''} space-x-4`}>
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          
          <Button 
            type="submit"
            disabled={saving || !zipcodeValid}
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!saving && <Save className="mr-2 h-4 w-4" />}
            {isNewFacility ? 'Create Facility' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FacilityForm;
