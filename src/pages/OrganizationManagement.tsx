import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/contexts/UserContext';
import { Building2, Plus, Trash2, Users, Factory, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Organization } from '@/types/organization';
import { Facility } from '@/types/facility';
import { fetchOrganizations, fetchFacilities } from '@/utils/supabaseHelpers';
import OrganizationTypeSelector, { OrganizationType } from '@/components/organizations/OrganizationTypeSelector';
import { useForm } from 'react-hook-form';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const organizationFormSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  description: z.string().optional(),
  contact_email: z.string().email("Invalid email address").optional().or(z.literal('')),
  contact_phone: z.string().optional(),
});

const facilityFormSchema = z.object({
  name: z.string().min(2, "Facility name must be at least 2 characters"),
  description: z.string().optional(),
  address: z.string().optional(),
  facility_type: z.string().optional(),
});

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;
type FacilityFormValues = z.infer<typeof facilityFormSchema>;

const OrganizationManagement: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [facilitiesLoading, setFacilitiesLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createFacilityDialogOpen, setCreateFacilityDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const orgForm = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: '',
      description: '',
      contact_email: '',
      contact_phone: '',
    }
  });

  const facilityForm = useForm<FacilityFormValues>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      facility_type: '',
    }
  });

  useEffect(() => {
    if (user) {
      fetchOrganizationData();
    }
  }, [user]);

  useEffect(() => {
    if (selectedOrganization) {
      fetchOrganizationFacilities(selectedOrganization.id);
    }
  }, [selectedOrganization]);

  const fetchOrganizationData = async () => {
    try {
      setLoading(true);
      
      const organizationsData = await fetchOrganizations();
      
      const mappedOrgs = organizationsData.map((org): Organization => ({
        id: org.id,
        name: org.name,
        description: org.description || null,
        contact_email: org.contact_email || null,
        contact_phone: org.contact_phone || null,
        logo_url: org.logo_url || null,
        status: org.status,
        created_at: org.created_at || new Date().toISOString(),
        org_type: org.org_type || null
      }));
      
      setOrganizations(mappedOrgs);
      
      if (mappedOrgs.length === 1) {
        setSelectedOrganization(mappedOrgs[0]);
        fetchOrganizationFacilities(mappedOrgs[0].id);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load organizations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationFacilities = async (orgId: string) => {
    try {
      setFacilitiesLoading(true);
      
      const facilitiesData = await fetchFacilities(orgId);
      
      const mappedFacilities = facilitiesData.map((facility): Facility => ({
        id: facility.id,
        name: facility.name,
        description: facility.description || null,
        address: facility.address || null,
        facility_type: facility.facility_type || null,
        status: facility.status,
        created_at: facility.created_at || new Date().toISOString(),
        organization_id: facility.organization_id
      }));
      
      setFacilities(mappedFacilities);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load facilities',
        variant: 'destructive',
      });
    } finally {
      setFacilitiesLoading(false);
    }
  };

  const handleCreateOrganization = async (values: OrganizationFormValues) => {
    try {
      setSubmitting(true);
      
      const { data, error } = await supabase
        .from('organizations')
        .insert({
          name: values.name,
          description: values.description || null,
          contact_email: values.contact_email || null,
          contact_phone: values.contact_phone || null,
          status: 'active'
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Organization created successfully!'
      });
      
      setCreateDialogOpen(false);
      orgForm.reset();
      fetchOrganizationData();
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: 'Error',
        description: 'Failed to create organization',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateFacility = async (values: FacilityFormValues) => {
    try {
      setSubmitting(true);
      
      if (!selectedOrganization) {
        toast({
          title: 'Error',
          description: 'Please select an organization first',
          variant: 'destructive',
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('facilities')
        .insert({
          name: values.name,
          description: values.description || null,
          address: values.address || null,
          facility_type: values.facility_type || null,
          organization_id: selectedOrganization.id,
          status: 'active'
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Facility created successfully!'
      });
      
      setCreateFacilityDialogOpen(false);
      facilityForm.reset();
      fetchOrganizationFacilities(selectedOrganization.id);
    } catch (error) {
      console.error('Error creating facility:', error);
      toast({
        title: 'Error',
        description: 'Failed to create facility',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectOrganization = (org: Organization) => {
    setSelectedOrganization(org);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organization Management</h1>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Organization</DialogTitle>
              <DialogDescription>
                Add a new organization to the system.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...orgForm}>
              <form onSubmit={orgForm.handleSubmit(handleCreateOrganization)} className="space-y-4 py-2">
                <FormField
                  control={orgForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC Foods Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={orgForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Organic food producer"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={orgForm.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="contact@abcfoods.com"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={orgForm.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+1 (555) 123-4567"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="pt-4">
                  <Button variant="outline" type="button" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            {organizations.length === 0 ? (
              loading ? (
                <div className="text-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading organizations...</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">No organizations found.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first organization
                  </Button>
                </div>
              )
            ) : (
              <ul className="space-y-2">
                {organizations.map((org) => (
                  <li key={org.id}>
                    <Button 
                      variant={selectedOrganization?.id === org.id ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => handleSelectOrganization(org)}
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      {org.name}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        
        <div className="md:col-span-3">
          {selectedOrganization ? (
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Organization Details</TabsTrigger>
                <TabsTrigger value="facilities">Facilities</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedOrganization.name}</CardTitle>
                    <CardDescription>Organization information and settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Description</Label>
                        <p className="text-muted-foreground">{selectedOrganization.description || 'No description provided'}</p>
                      </div>
                      
                      <div>
                        <Label>Organization Type</Label>
                        <p className="text-muted-foreground">{selectedOrganization.org_type || 'Not specified'}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label>Contact Information</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label className="text-sm">Email</Label>
                            <p className="text-muted-foreground">{selectedOrganization.contact_email || 'Not specified'}</p>
                          </div>
                          <div>
                            <Label className="text-sm">Phone</Label>
                            <p className="text-muted-foreground">{selectedOrganization.contact_phone || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-end">
                        <Button>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Organization
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="facilities">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Facilities</CardTitle>
                      <CardDescription>Manage facilities for {selectedOrganization.name}</CardDescription>
                    </div>
                    
                    <Dialog open={createFacilityDialogOpen} onOpenChange={setCreateFacilityDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Facility
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Add Facility</DialogTitle>
                          <DialogDescription>
                            Add a new facility to {selectedOrganization.name}.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...facilityForm}>
                          <form onSubmit={facilityForm.handleSubmit(handleCreateFacility)} className="space-y-4 py-2">
                            <FormField
                              control={facilityForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Facility Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Production Plant 1" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={facilityForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Main production facility"
                                      {...field}
                                      value={field.value || ''}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={facilityForm.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="123 Production Road, Industry City"
                                      {...field}
                                      value={field.value || ''}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={facilityForm.control}
                              name="facility_type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Facility Type</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Production"
                                      {...field}
                                      value={field.value || ''}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <DialogFooter className="pt-4">
                              <Button variant="outline" type="button" onClick={() => setCreateFacilityDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit" disabled={submitting}>
                                {submitting ? 'Adding...' : 'Add Facility'}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {facilitiesLoading ? (
                      <div className="text-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-2 text-sm text-muted-foreground">Loading facilities...</p>
                      </div>
                    ) : facilities.length === 0 ? (
                      <div className="text-center py-6">
                        <Factory className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                        <p className="mt-2 text-muted-foreground">No facilities found. Add your first facility.</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {facilities.map((facility) => (
                            <TableRow key={facility.id}>
                              <TableCell className="font-medium">{facility.name}</TableCell>
                              <TableCell>{facility.facility_type || 'Not specified'}</TableCell>
                              <TableCell>{facility.address || 'Not specified'}</TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  facility.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {facility.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>Manage users for {selectedOrganization.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                      <p className="mt-2 text-muted-foreground">User management will be implemented soon.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Building2 className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-4 text-lg text-muted-foreground">Select an organization to view details</p>
                {organizations.length === 0 && !loading && (
                  <Button variant="outline" className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first organization
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationManagement;
