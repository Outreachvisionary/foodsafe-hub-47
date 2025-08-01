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
      setLoading(true);
      try {
        if (!isNewFacility && id) {
          const facilityData = await getFacilityById(id);
          // Cast to ensure proper typing
          const typedFacility: Facility = {
            ...facilityData,
            id: facilityData.id || '',
            created_at: facilityData.created_at || new Date().toISOString(),
            updated_at: facilityData.updated_at || new Date().toISOString(),
            organization_id: facilityData.organization_id || ''
          };
          setFacility(typedFacility);
          
          // Populate form with facility data
          form.reset({
            name: facilityData.name || '',
            description: facilityData.description || '',
            address: facilityData.address || '',
            contact_email: facilityData.contact_email || '',
            contact_phone: facilityData.contact_phone || '',
            status: (facilityData.status as 'active' | 'inactive' | 'pending') || 'active',
            organization_id: facilityData.organization_id || '',
            country: facilityData.country || '',
            state: facilityData.state || '',
            city: facilityData.city || '',
            zipcode: facilityData.zipcode || '',
          });
          
          // Set location data
          setLocationData({
            address: facilityData.address,
            country: facilityData.country,
            state: facilityData.state,
            city: facilityData.city,
            zipcode: facilityData.zipcode,
          });
        }
      } catch (err) {
        console.error('Error fetching facility:', err);
        toast({
          title: "Error",
          description: "Failed to load facility details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadFacility();
  }, [id, isNewFacility, form, toast]);

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
      const facilityData = {
        ...data,
        // Get the location fields from the form data or the location component
        address: data.address || locationData.address,
        country: data.country || locationData.country,
        state: data.state || locationData.state,
        city: data.city || locationData.city,
        zipcode: data.zipcode || locationData.zipcode,
        organization_id: data.organization_id,
      };
      
      console.log('Final facility data being sent to API:', facilityData);
      
      if (isNewFacility) {
        // Create new facility
        console.log('Creating new facility with data:', facilityData);
        const savedFacility = await createFacility(facilityData);
        console.log('Facility created successfully:', savedFacility);
        toast({
          title: 'Facility Created',
          description: `Successfully created ${savedFacility.name}`,
        });
        navigate('/facilities');
      } else {
        // Update existing facility
        console.log('Updating facility with data:', facilityData);
        const savedFacility = await updateFacility(id!, facilityData);
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
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/facilities')} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Facility Management</h1>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate('/facilities')} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-1">
            {isNewFacility ? "Add New Facility" : "Edit Facility"}
          </h1>
          <p className="text-muted-foreground">
            {isNewFacility ? "Create a new facility in your organization" : "Update facility details"}
          </p>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Basic Information</TabsTrigger>
          <TabsTrigger value="location">Location & Contact</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the basic details for this facility.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facility Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter facility name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The official name of this facility.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Facility Type
                    </label>
                    <Input 
                      placeholder="e.g., Manufacturing, Warehouse, Office" 
                      defaultValue=""
                    />
                    <p className="text-sm text-muted-foreground">
                      The type or category of this facility.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of the facility" {...field} />
                        </FormControl>
                        <FormDescription>
                          A brief description of the facility and its purpose.
                        </FormDescription>
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
                          <Input placeholder="e.g., Active, Inactive, Under Construction" {...field} />
                        </FormControl>
                        <FormDescription>
                          Current operational status of the facility.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Capacity
                    </label>
                    <Input 
                      placeholder="e.g., 1000 units/day, 50 employees"
                      defaultValue=""
                    />
                    <p className="text-sm text-muted-foreground">
                      Maximum capacity or operational limit of the facility.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Organization</h3>
                    <p className="text-sm text-muted-foreground">
                      Organization selection will be configured during implementation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Location & Contact Information</CardTitle>
                  <CardDescription>
                    Provide the physical address and contact details for this facility.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Location form will be configured during implementation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <Separator />
            
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/facilities')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={saving}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!saving && <Save className="mr-2 h-4 w-4" />}
                {isNewFacility ? 'Create Facility' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default FacilityManagement;
