
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

// Create form schema using zod
const facilityFormSchema = z.object({
  name: z.string().min(2, {
    message: "Facility name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  facility_type: z.string().optional(),
  address: z.string().optional(),
  contact_email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]),
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

  // Initialize form with default values
  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: {
      name: '',
      description: '',
      facility_type: '',
      address: '',
      contact_email: '',
      contact_phone: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (!isNewFacility) {
      loadFacilityData();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadFacilityData = async () => {
    try {
      setLoading(true);
      // Mock data for now - would normally fetch from API
      const mockFacility: Facility = {
        id: id || 'new',
        organization_id: 'org123',
        name: 'Main Processing Facility',
        description: 'Our main food processing facility with 5 production lines',
        address: '123 Production Lane, Industry City, CA 90210',
        facility_type: 'Processing',
        status: 'active',
        contact_email: 'facility@example.com',
        contact_phone: '555-123-4567',
      };
      
      // Update form values
      form.reset({
        name: mockFacility.name,
        description: mockFacility.description || '',
        facility_type: mockFacility.facility_type || '',
        address: mockFacility.address || '',
        contact_email: mockFacility.contact_email || '',
        contact_phone: mockFacility.contact_phone || '',
        status: mockFacility.status as "active" | "inactive" | "pending",
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading facility data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load facility data',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const onSubmit = async (data: FacilityFormValues) => {
    try {
      setSaving(true);
      
      // Mock API call
      console.log('Saving facility data:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: isNewFacility ? 'Facility Created' : 'Facility Updated',
        description: `Successfully ${isNewFacility ? 'created' : 'updated'} ${data.name}`,
      });
      
      if (isNewFacility) {
        // Redirect to facilities list after creating a new facility
        navigate('/facilities');
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
                    name="facility_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facility Type</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g. Manufacturing, Processing, Storage" {...field} />
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
                  <CardTitle>Location & Contact Information</CardTitle>
                  <CardDescription>
                    Address and contact information for this facility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facility Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter complete address" {...field} />
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
    </AppLayout>
  );
};

export default FacilityManagement;
