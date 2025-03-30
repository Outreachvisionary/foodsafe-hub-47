
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Factory } from 'lucide-react';
import { Facility } from '@/types/facility';
import { fetchFacilities, deleteFacility } from '@/services/facilityService';
import CreateFacilityDialog from './CreateFacilityDialog';
import { useToast } from '@/hooks/use-toast';

interface FacilitiesTabProps {
  organizationId: string;
}

const FacilitiesTab: React.FC<FacilitiesTabProps> = ({ organizationId }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadFacilities = async () => {
    try {
      setLoading(true);
      console.log('Loading facilities for organization ID:', organizationId);
      const data = await fetchFacilities(organizationId);
      console.log('Loaded facilities for organization:', data);
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

  useEffect(() => {
    if (organizationId) {
      loadFacilities();
    }
  }, [organizationId]);

  const handleFacilityCreated = (facility: Facility) => {
    console.log('Facility created, reloading facilities list');
    loadFacilities();
  };

  const handleDeleteFacility = async (id: string) => {
    if (confirm('Are you sure you want to delete this facility?')) {
      try {
        setDeleting(id);
        await deleteFacility(id);
        toast({
          title: 'Success',
          description: 'Facility has been deleted',
        });
        loadFacilities();
      } catch (error) {
        console.error('Error deleting facility:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete facility',
          variant: 'destructive',
        });
      } finally {
        setDeleting(null);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Facilities</CardTitle>
          <CardDescription>Manage facilities for this organization</CardDescription>
        </div>
        
        <CreateFacilityDialog 
          organizationId={organizationId} 
          onFacilityCreated={handleFacilityCreated}
        />
      </CardHeader>
      <CardContent>
        {loading ? (
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
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell className="font-medium">{facility.name}</TableCell>
                  <TableCell>{facility.facility_type || 'Not specified'}</TableCell>
                  <TableCell>
                    {[
                      facility.city, 
                      facility.state, 
                      facility.country
                    ].filter(Boolean).join(', ') || facility.address || 'Not specified'}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      facility.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {facility.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/facilities/${facility.id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteFacility(facility.id)}
                      disabled={deleting === facility.id}
                    >
                      {deleting === facility.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-red-700" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default FacilitiesTab;
