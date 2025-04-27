
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, Building2 } from 'lucide-react';
import { getFacilities } from '@/services/facilityService';
import { Facility } from '@/types/facility';

interface FacilitiesTabProps {
  organizationId: string;
}

const FacilitiesTab: React.FC<FacilitiesTabProps> = ({ organizationId }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        setLoading(true);
        
        // Get all facilities
        const allFacilities: any[] = await getFacilities();
        
        // Filter facilities by organization ID and ensure status property exists
        const orgFacilities = allFacilities
          .filter(facility => facility.organization_id === organizationId)
          .map(facility => ({
            ...facility,
            status: facility.status || 'active'
          })) as Facility[];
        
        setFacilities(orgFacilities);
      } catch (error) {
        console.error('Error loading facilities:', error);
      } finally {
        setLoading(false);
      }
    };

    if (organizationId) {
      loadFacilities();
    }
  }, [organizationId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Facilities</h3>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          Add Facility
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
              <span>Loading facilities...</span>
            </div>
          ) : facilities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center p-4">
              <Building2 className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-muted-foreground">No facilities found for this organization</p>
              <Button variant="link" size="sm" className="mt-2">
                <Plus className="h-4 w-4 mr-1" />
                Add your first facility
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
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
                      {[
                        facility.city,
                        facility.state,
                        facility.country
                      ].filter(Boolean).join(', ')}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          facility.status === 'active' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }
                      >
                        {facility.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{facility.contact_email || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
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

export default FacilitiesTab;
