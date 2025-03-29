
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Building2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import OrganizationSelector from '@/components/organizations/OrganizationSelector';
import { Facility } from '@/types/facility';
import { fetchFacilities } from '@/services/facilityService';

const FacilitiesList = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all-facilities');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  
  // Filter to current organization by default
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | undefined>(
    user?.organization_id
  );

  useEffect(() => {
    if (user) {
      loadFacilities();
    }
  }, [user, selectedOrganizationId, selectedTab]);

  const loadFacilities = async () => {
    try {
      setLoading(true);
      
      const onlyAssigned = selectedTab === 'my-facilities';
      const facilitiesData = await fetchFacilities(
        selectedOrganizationId,
        onlyAssigned
      );
      
      setFacilities(facilitiesData);
    } catch (error) {
      console.error('Error loading facilities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load facilities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationChange = (orgId: string) => {
    setSelectedOrganizationId(orgId);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Facilities</h1>
          <Button onClick={() => navigate('/facilities/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Facility
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Facilities Management</CardTitle>
            <CardDescription>
              View and manage all facilities in your organization
            </CardDescription>
            
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Organization</label>
                  <OrganizationSelector 
                    value={selectedOrganizationId}
                    onChange={handleOrganizationChange}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="all-facilities" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all-facilities">All Facilities</TabsTrigger>
                {user?.assigned_facility_ids && user.assigned_facility_ids.length > 0 && (
                  <TabsTrigger value="my-facilities">My Facilities</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="all-facilities">
                {renderFacilitiesTable()}
              </TabsContent>
              
              <TabsContent value="my-facilities">
                {renderFacilitiesTable()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  function renderFacilitiesTable() {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (facilities.length === 0) {
      return (
        <div className="text-center py-8">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No facilities found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Get started by adding your first facility
          </p>
          <Button className="mt-4" onClick={() => navigate('/facilities/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Facility
          </Button>
        </div>
      );
    }

    return (
      <div className="rounded-md border">
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
                <TableCell>{facility.facility_type || 'N/A'}</TableCell>
                <TableCell>{facility.address || 'N/A'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    facility.status === 'active' ? 'bg-green-100 text-green-800' : 
                    facility.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {facility.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate(`/facilities/${facility.id}`)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
};

export default FacilitiesList;
