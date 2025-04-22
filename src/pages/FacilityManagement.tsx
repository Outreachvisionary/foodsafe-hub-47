import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { Facility } from '@/types/facility';
import { getFacilityById, createFacility, updateFacility } from '@/services/facilityService';
import LocationForm, { LocationData } from '@/components/location/LocationForm';
import { validateZipcode } from '@/utils/locationUtils';
import OrganizationSelector from '@/components/organizations/OrganizationSelector';

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

const FacilityManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const isNewFacility = id === 'new' || !id;
  const [locationData, setLocationData] = useState<LocationData>({});
  const [zipcodeValid, setZipcodeValid] = useState<boolean>(true);
  const [facility, setFacility] = useState<Facility | null>(null);
  const [error, setError] = useState<string | null>(null);

  console.log('FacilityManagement rendered, id:', id, 'isNewFacility:', isNewFacility);

  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      contact_email: '',
      contact_phone: '',
      status: 'active',
      organization_id: '',
      country: '',
      state: '',
      city: '',
      zipcode: '',
    },
  });

  useEffect(() => {
    const loadFacility = async () => {
      try {
        setLoading(true);
        if (!id) {
          setError('No facility ID provided');
          return;
        }
        
        const facilityData = await getFacilityById(id);
        setFacility(facilityData);
        
        // Load related data if necessary
      } catch (error) {
        console.error('Error loading facility:', error);
        setError('Failed to load facility details');
        toast.error('Error loading facility details');
      } finally {
        setLoading(false);
      }
    };
    
    loadFacility();
  }, [id]);

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
        const newFacilityData: Omit<Facility, 'id'> = {
          name: facilityData.name as string,
          organization_id: facilityData.organization_id as string,
          status: facilityData.status as 'active' | 'inactive' | 'pending',
          description: facilityData.description,
          address: facilityData.address,
          country: facilityData.country,
          state: facilityData.state,
          city: facilityData.city,
          zipcode: facilityData.zipcode,
          contact_email: facilityData.contact_email,
          contact_phone: facilityData.contact_phone,
          location_data: facilityData.location_data
        };
        savedFacility = await createFacility(newFacilityData);
        console.log('Facility created successfully:', savedFacility);
        toast({
          title: 'Facility Created',
          description: `Successfully created ${savedFacility.name}`,
        });
        navigate('/facilities');
      } else {
        // Update existing facility
        console.log('Updating facility with data:', facilityData);
        if (facilityData.status) {
          facilityData.status = facilityData.status as 'active' | 'inactive' | 'pending';
        }
        savedFacility = await updateFacility(id!, facilityData);
        console.log('Facility updated successfully:', savedFacility);
        toast({
          title: 'Facility Updated',
          description: `Successfully updated ${savedFacility.name}`,
        });
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

  if (loading) {
    return (
      <AppLayout title="Facility Management" showBackButton>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={isNewFacility ? "Add New Facility" : "Edit Facility"}
      subtitle={isNewFacility ? "Create a new facility in your organization" : "Update facility details"}
      showBackButton
      onBack={() => navigate('/facilities')}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Basic Information</TabsTrigger>
          <TabsTrigger value="location">Location & Contact</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Facility Details</CardTitle>
                  <CardDescription>
                    Enter basic information about the facility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                          <Input placeholder="Brief description of the facility" {...field} />
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
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="location">
              <Card>
                <CardHeader>
                  <CardTitle>Location Information</CardTitle>
                  <CardDescription>
                    Address and location details for this facility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <LocationForm
                    initialData={locationData}
                    onChange={handleLocationChange}
                    showValidationErrors={true}
                    disabled={saving}
                  />
                  
                  <Separator className="my-6" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Facility Settings</CardTitle>
                  <CardDescription>
                    Additional configuration options for this facility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 italic">
                    Additional settings will be available in future updates.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/facilities')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              
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
      </Tabs>
    </AppLayout>
  );
};

export default FacilityManagement;
