
import React, { useState, useEffect } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/contexts/UserContext';
import { Building2, Plus, Trash2, Edit, Users, Factory, Shield, Info } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Facility as FacilityType } from '@/types/facility';
import { RegulatoryStandard as RegulatoryStandardType, FacilityStandard as FacilityStandardType } from '@/types/regulatory';
import { 
  fetchFacilities, 
  fetchRegulatoryStandards, 
  fetchFacilityStandards 
} from '@/utils/supabaseHelpers';

interface FacilityState {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  facility_type: string | null;
  organization_id: string;
  status: string;
  metadata: Record<string, any> | null;
  created_at: string;
}

interface FacilityFormData {
  name: string;
  description: string;
  address: string;
  facilityType: string;
  status: string;
}

const FacilityManagement: React.FC = () => {
  const [facility, setFacility] = useState<FacilityState | null>(null);
  const [standards, setStandards] = useState<RegulatoryStandardType[]>([]);
  const [facilityStandards, setFacilityStandards] = useState<FacilityStandardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FacilityFormData>({
    name: '',
    description: '',
    address: '',
    facilityType: '',
    status: 'active'
  });
  
  const { toast } = useToast();
  const { user } = useUser();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchFacility(id);
      fetchFacilityStandardsData(id);
    }
    fetchStandards();
  }, [id]);

  const fetchFacility = async (facilityId: string) => {
    try {
      setLoading(true);
      
      const facilities = await fetchFacilities();
      const facilityData = facilities.find(f => f.id === facilityId);
      
      if (!facilityData) throw new Error('Facility not found');
      
      const facilityState: FacilityState = {
        id: facilityData.id,
        name: facilityData.name,
        description: facilityData.description || null,
        address: facilityData.address || null,
        facility_type: facilityData.facility_type || null,
        organization_id: facilityData.organization_id,
        status: facilityData.status,
        metadata: facilityData.metadata || null,
        created_at: facilityData.created_at || new Date().toISOString()
      };
      
      setFacility(facilityState);
      setFormData({
        name: facilityState.name,
        description: facilityState.description || '',
        address: facilityState.address || '',
        facilityType: facilityState.facility_type || '',
        status: facilityState.status
      });
    } catch (error) {
      console.error('Error fetching facility:', error);
      toast({
        title: 'Error',
        description: 'Failed to load facility details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStandards = async () => {
    try {
      const standardsData = await fetchRegulatoryStandards();
      setStandards(standardsData);
    } catch (error) {
      console.error('Error fetching standards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load standards',
        variant: 'destructive',
      });
    }
  };

  const fetchFacilityStandardsData = async (facilityId: string) => {
    try {
      const facilityStandardsData = await fetchFacilityStandards(facilityId);
      setFacilityStandards(facilityStandardsData);
    } catch (error) {
      console.error('Error fetching facility standards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load facility standards',
        variant: 'destructive',
      });
    }
  };

  const handleSaveFacility = async () => {
    if (!facility) return;
    
    try {
      const { error } = await supabase
        .from('facilities')
        .update({
          name: formData.name,
          description: formData.description || null,
          address: formData.address || null,
          facility_type: formData.facilityType || null,
          status: formData.status
        })
        .eq('id', facility.id);
      
      if (error) throw error;
      
      toast({
        title: 'Facility Updated',
        description: 'The facility was updated successfully'
      });
      
      setIsEditing(false);
      fetchFacility(facility.id);
    } catch (error) {
      console.error('Error updating facility:', error);
      toast({
        title: 'Error',
        description: 'Failed to update facility',
        variant: 'destructive',
      });
    }
  };

  const backToFacilitiesList = () => {
    navigate('/facilities');
  };

  const renderFacilityDetails = () => {
    if (isEditing) {
      return (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Facility Name</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Textarea 
              id="address" 
              value={formData.address} 
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              rows={2}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="facilityType">Facility Type</Label>
            <Input 
              id="facilityType" 
              value={formData.facilityType} 
              onChange={(e) => setFormData({...formData, facilityType: e.target.value})}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSaveFacility}>Save Changes</Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div>
          <Label>Description</Label>
          <p className="text-sm text-muted-foreground mt-1">{facility?.description || 'No description provided'}</p>
        </div>
        
        <Separator />
        
        <div>
          <Label>Facility Details</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label className="text-xs">Address</Label>
              <p className="text-sm text-muted-foreground">{facility?.address || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-xs">Type</Label>
              <p className="text-sm text-muted-foreground">{facility?.facility_type || 'Not specified'}</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-end">
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Facility
          </Button>
        </div>
      </div>
    );
  };

  if (loading && !facility) {
    return (
      <SidebarLayout>
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading facility details...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={backToFacilitiesList}>
              Back to Facilities
            </Button>
            <h1 className="text-3xl font-bold">{facility?.name}</h1>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              facility?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {facility?.status}
            </span>
          </div>
        </div>
        
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Facility Details</TabsTrigger>
            <TabsTrigger value="standards">Compliance Standards</TabsTrigger>
            <TabsTrigger value="users">Users & Permissions</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Facility Information</CardTitle>
                <CardDescription>
                  View and manage details for this facility
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderFacilityDetails()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="standards">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Compliance Standards</CardTitle>
                  <CardDescription>Manage standards and certifications for this facility</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Standard
                </Button>
              </CardHeader>
              <CardContent>
                {facilityStandards.length === 0 ? (
                  <div className="text-center py-6">
                    <Shield className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-2 text-muted-foreground">No compliance standards associated with this facility.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Standard</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Certificate Expiry</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {facilityStandards.map((standard) => (
                        <TableRow key={standard.id}>
                          <TableCell className="font-medium">
                            {standard.standard_name} ({standard.standard_code})
                          </TableCell>
                          <TableCell>{standard.standard_version || 'Latest'}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              standard.compliance_status === 'compliant' ? 'bg-green-100 text-green-800' : 
                              standard.compliance_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {standard.compliance_status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {standard.expiry_date ? 
                              new Date(standard.expiry_date).toLocaleDateString() : 
                              'Not certified'
                            }
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
                <CardTitle>Users & Permissions</CardTitle>
                <CardDescription>Manage users and access permissions for this facility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">User management will be implemented soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="equipment">
            <Card>
              <CardHeader>
                <CardTitle>Equipment</CardTitle>
                <CardDescription>Manage equipment associated with this facility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Factory className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">Equipment management will be implemented soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default FacilityManagement;
