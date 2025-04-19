import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Facility } from '@/types/facility';
import { getFacilities, deleteFacility } from '@/services/facilityService';
import FacilityList from '@/components/facilities/FacilityList';
import FacilityAddDialog from '@/components/facilities/FacilityAddDialog';

const FacilitiesTab = ({ organizationId }: { organizationId: string }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const loadFacilities = async () => {
    if (!organizationId) return;
    
    try {
      setLoading(true);
      const facilitiesData = await getFacilities(organizationId);
      setFacilities(facilitiesData as any);
    } catch (error) {
      console.error('Error loading facilities:', error);
      toast.error('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, [organizationId]);

  const handleAddDialogOpen = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
  };

  const handleFacilityCreated = (newFacility: Facility) => {
    setFacilities([...facilities, newFacility]);
    setIsAddDialogOpen(false);
  };

  const handleFacilityUpdated = (updatedFacility: Facility) => {
    setFacilities(
      facilities.map((facility) =>
        facility.id === updatedFacility.id ? updatedFacility : facility
      )
    );
  };

  const handleFacilityDeleted = async (id: string) => {
    try {
      await deleteFacility(id);
      setFacilities(facilities.filter((facility) => facility.id !== id));
      toast.success('Facility deleted successfully');
    } catch (error) {
      console.error('Error deleting facility:', error);
      toast.error('Failed to delete facility');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Facilities</CardTitle>
        <Button onClick={handleAddDialogOpen} disabled={loading}>
          <Plus className="mr-2 h-4 w-4" />
          Add Facility
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading facilities...
          </div>
        ) : (
          <FacilityList
            facilities={facilities}
            onFacilityUpdated={handleFacilityUpdated}
            onFacilityDeleted={handleFacilityDeleted}
          />
        )}
      </CardContent>
      <FacilityAddDialog
        open={isAddDialogOpen}
        onOpenChange={handleAddDialogClose}
        onFacilityCreated={handleFacilityCreated}
        organizationId={organizationId}
      />
    </Card>
  );
};

export default FacilitiesTab;
