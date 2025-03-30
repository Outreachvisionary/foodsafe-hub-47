
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Factory, AlertCircle } from 'lucide-react';
import { Facility } from '@/types/facility';
import { fetchFacilities, deleteFacility } from '@/services/facilityService';
import CreateFacilityDialog from './CreateFacilityDialog';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface FacilitiesTabProps {
  organizationId: string;
}

const FacilitiesTab: React.FC<FacilitiesTabProps> = ({ organizationId }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [facilityToDelete, setFacilityToDelete] = useState<Facility | null>(null);
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

  const confirmDeleteFacility = (facility: Facility) => {
    setFacilityToDelete(facility);
  };

  const handleDeleteFacility = async () => {
    if (!facilityToDelete) return;
    
    try {
      setDeleting(facilityToDelete.id);
      await deleteFacility(facilityToDelete.id);
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
      setFacilityToDelete(null);
    }
  };

  return (
    <>
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
            <div className="border rounded-md overflow-hidden">
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
                          facility.status === 'active' ? 'bg-green-100 text-green-800' : 
                          facility.status === 'inactive' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
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
                          onClick={() => confirmDeleteFacility(facility)}
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
            </div>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!facilityToDelete} onOpenChange={(open) => !open && setFacilityToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Facility</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex items-start space-x-2 mt-2 mb-2">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p>Are you sure you want to delete <strong>{facilityToDelete?.name}</strong>?</p>
                  <p className="mt-2">This action cannot be undone and all data associated with this facility will be permanently deleted.</p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteFacility}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FacilitiesTab;
