
import React, { useState, useEffect } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/contexts/UserContext';
import { Building2, Plus, Trash2, Edit, Users, Factory } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Organization {
  id: string;
  name: string;
  description: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  logo_url: string | null;
  status: string;
  created_at: string;
}

interface Facility {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  facility_type: string | null;
  status: string;
  created_at: string;
}

const OrganizationManagement: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createFacilityDialogOpen, setCreateFacilityDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [facilityFormData, setFacilityFormData] = useState({
    name: '',
    description: '',
    address: '',
    facilityType: ''
  });
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchOrganizations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedOrg) {
      fetchFacilities(selectedOrg.id);
    }
  }, [selectedOrg]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      
      // Query depends on user role
      let query = supabase
        .from('organizations')
        .select('*')
        .order('name');
      
      // Regular users can only see their own organization
      if (user && !user.role?.includes('admin')) {
        query = query.eq('id', user.organization_id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setOrganizations(data as Organization[]);
      
      // Set the first organization as selected
      if (data.length > 0) {
        setSelectedOrg(data[0]);
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

  const fetchFacilities = async (organizationId: string) => {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name');
      
      if (error) throw error;
      
      setFacilities(data as Facility[]);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load facilities',
        variant: 'destructive',
      });
    }
  };

  const handleCreateOrganization = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .insert({
          name: formData.name,
          description: formData.description || null,
          contact_email: formData.contactEmail || null,
          contact_phone: formData.contactPhone || null
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Organization Created',
        description: 'The organization was created successfully'
      });
      
      setFormData({
        name: '',
        description: '',
        contactEmail: '',
        contactPhone: ''
      });
      
      setCreateDialogOpen(false);
      fetchOrganizations();
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: 'Error',
        description: 'Failed to create organization',
        variant: 'destructive',
      });
    }
  };

  const handleCreateFacility = async () => {
    if (!selectedOrg) return;
    
    try {
      const { data, error } = await supabase
        .from('facilities')
        .insert({
          name: facilityFormData.name,
          description: facilityFormData.description || null,
          address: facilityFormData.address || null,
          facility_type: facilityFormData.facilityType || null,
          organization_id: selectedOrg.id
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Facility Created',
        description: 'The facility was created successfully'
      });
      
      setFacilityFormData({
        name: '',
        description: '',
        address: '',
        facilityType: ''
      });
      
      setCreateFacilityDialogOpen(false);
      fetchFacilities(selectedOrg.id);
    } catch (error) {
      console.error('Error creating facility:', error);
      toast({
        title: 'Error',
        description: 'Failed to create facility',
        variant: 'destructive',
      });
    }
  };

  const handleSelectOrganization = (org: Organization) => {
    setSelectedOrg(org);
  };

  return (
    <SidebarLayout>
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Organization</DialogTitle>
                <DialogDescription>
                  Add a new organization to the system.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="ABC Foods Inc."
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Organic food producer"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input 
                    id="contactEmail" 
                    type="email"
                    value={formData.contactEmail} 
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    placeholder="contact@abcfoods.com"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input 
                    id="contactPhone" 
                    value={formData.contactPhone} 
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleCreateOrganization}
                  disabled={!formData.name}
                >
                  Create
                </Button>
              </DialogFooter>
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
                <p className="text-muted-foreground">No organizations found.</p>
              ) : (
                <ul className="space-y-2">
                  {organizations.map((org) => (
                    <li key={org.id}>
                      <Button 
                        variant={selectedOrg?.id === org.id ? "default" : "ghost"} 
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
            {selectedOrg ? (
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Organization Details</TabsTrigger>
                  <TabsTrigger value="facilities">Facilities</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedOrg.name}</CardTitle>
                      <CardDescription>Organization information and settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label>Description</Label>
                          <p className="text-muted-foreground">{selectedOrg.description || 'No description provided'}</p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <Label>Contact Information</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                              <Label className="text-sm">Email</Label>
                              <p className="text-muted-foreground">{selectedOrg.contact_email || 'Not specified'}</p>
                            </div>
                            <div>
                              <Label className="text-sm">Phone</Label>
                              <p className="text-muted-foreground">{selectedOrg.contact_phone || 'Not specified'}</p>
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
                        <CardDescription>Manage facilities for {selectedOrg.name}</CardDescription>
                      </div>
                      
                      <Dialog open={createFacilityDialogOpen} onOpenChange={setCreateFacilityDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Facility
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Facility</DialogTitle>
                            <DialogDescription>
                              Add a new facility to {selectedOrg.name}.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="facilityName">Facility Name</Label>
                              <Input 
                                id="facilityName" 
                                value={facilityFormData.name} 
                                onChange={(e) => setFacilityFormData({...facilityFormData, name: e.target.value})}
                                placeholder="Production Plant 1"
                              />
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="facilityDescription">Description</Label>
                              <Input 
                                id="facilityDescription" 
                                value={facilityFormData.description} 
                                onChange={(e) => setFacilityFormData({...facilityFormData, description: e.target.value})}
                                placeholder="Main production facility"
                              />
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="facilityAddress">Address</Label>
                              <Input 
                                id="facilityAddress" 
                                value={facilityFormData.address} 
                                onChange={(e) => setFacilityFormData({...facilityFormData, address: e.target.value})}
                                placeholder="123 Production Road, Industry City"
                              />
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="facilityType">Facility Type</Label>
                              <Input 
                                id="facilityType" 
                                value={facilityFormData.facilityType} 
                                onChange={(e) => setFacilityFormData({...facilityFormData, facilityType: e.target.value})}
                                placeholder="Production"
                              />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setCreateFacilityDialogOpen(false)}>Cancel</Button>
                            <Button 
                              onClick={handleCreateFacility}
                              disabled={!facilityFormData.name}
                            >
                              Add Facility
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent>
                      {facilities.length === 0 ? (
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
                      <CardDescription>Manage users for {selectedOrg.name}</CardDescription>
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
                  {organizations.length === 0 && (
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
    </SidebarLayout>
  );
};

export default OrganizationManagement;
