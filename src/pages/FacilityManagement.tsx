
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Facility } from '@/types/facility';
import { fetchFacilities } from '@/services/facilityService';
import OrganizationSelector from '@/components/organizations/OrganizationSelector';
import CreateFacilityDialog from '@/components/organizations/CreateFacilityDialog';
import { Building2, Plus, Loader2, Edit, MapPin } from 'lucide-react';

const FacilityManagement: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (organizationId) {
      loadFacilities();
    } else {
      setFacilities([]);
      setLoading(false);
    }
  }, [organizationId]);

  const loadFacilities = async () => {
    try {
      setLoading(true);
      const data = await fetchFacilities(organizationId);
      setFacilities(data);
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

  const handleFacilityCreated = (facility: Facility) => {
    loadFacilities();
  };

  const viewFacilityDetails = (facility: Facility) => {
    navigate(`/facilities/${facility.id}`);
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Facility Management</h1>
        <p className="text-muted-foreground">Create and manage facilities within your organization</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Organization</label>
            <div className="flex space-x-2">
              <div className="flex-grow">
                <OrganizationSelector
                  value={organizationId}
                  onChange={setOrganizationId}
                />
              </div>
              {organizationId && (
                <CreateFacilityDialog 
                  organizationId={organizationId}
                  onFacilityCreated={handleFacilityCreated}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Facilities</CardTitle>
          <CardDescription>Manage facilities and their information</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading facilities...</span>
            </div>
          ) : !organizationId ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="mt-2 text-muted-foreground">
                Please select an organization to view facilities
              </p>
            </div>
          ) : facilities.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="mt-2 text-muted-foreground">
                No facilities found. Create your first facility to get started.
              </p>
              <CreateFacilityDialog 
                organizationId={organizationId}
                onFacilityCreated={handleFacilityCreated}
                trigger={
                  <Button variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Facility
                  </Button>
                }
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Facility Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilities.map((facility) => (
                  <TableRow key={facility.id}>
                    <TableCell className="font-medium">{facility.name}</TableCell>
                    <TableCell>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                        <span>
                          {[
                            facility.city,
                            facility.state,
                            facility.country
                          ].filter(Boolean).join(', ') || 'Not specified'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{facility.facility_type || 'Not specified'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        facility.status === 'active' ? 'bg-green-100 text-green-800' : 
                        facility.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {facility.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {facility.contact_email || facility.contact_phone || 'Not specified'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => viewFacilityDetails(facility)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityManagement;
