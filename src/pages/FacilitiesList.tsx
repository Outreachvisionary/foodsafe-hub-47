
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getFacilities } from '@/services/facilityService';
import { Facility } from '@/types/facility';
import { useToast } from '@/hooks/use-toast';

const FacilitiesList = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      setLoading(true);
      const data = await getFacilities();
      // Ensure all facilities have required fields
      const validatedData = data.map((facility: any) => ({
        ...facility,
        organization_id: facility.organization_id || '',
        created_at: facility.created_at || new Date().toISOString(),
        updated_at: facility.updated_at || new Date().toISOString()
      }));
      setFacilities(validatedData);
      setFilteredFacilities(validatedData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading facilities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load facilities',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFacilities(facilities);
      return;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = facilities.filter(facility => 
      facility.name.toLowerCase().includes(lowerCaseSearch) ||
      (facility.city && facility.city.toLowerCase().includes(lowerCaseSearch)) ||
      (facility.state && facility.state.toLowerCase().includes(lowerCaseSearch)) ||
      (facility.country && facility.country.toLowerCase().includes(lowerCaseSearch)) ||
      (facility.facility_type && facility.facility_type.toLowerCase().includes(lowerCaseSearch))
    );
    setFilteredFacilities(filtered);
  }, [searchTerm, facilities]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFacilityClick = (id: string) => {
    navigate(`/facilities/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">Facilities</h1>
            <p className="text-muted-foreground">Manage all your organization facilities</p>
          </div>
          <Button onClick={() => navigate('/facilities/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Facility
          </Button>
        </div>
      </div>
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">All Facilities</CardTitle>
              <CardDescription>
                {facilities.length} facilities found
              </CardDescription>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search facilities..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="text-muted-foreground">Loading facilities...</div>
              </div>
            ) : filteredFacilities.length === 0 ? (
              <div className="text-center py-8">
                <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No facilities found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first facility.'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => navigate('/facilities/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Facility
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Capacity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFacilities.map((facility) => (
                      <TableRow 
                        key={facility.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleFacilityClick(facility.id)}
                      >
                        <TableCell className="font-medium">{facility.name}</TableCell>
                        <TableCell className="capitalize">{facility.facility_type || 'N/A'}</TableCell>
                        <TableCell>
                          {facility.city && facility.state ? (
                            <span>{facility.city}, {facility.state}</span>
                          ) : (
                            facility.address || 'No location'
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            facility.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : facility.status === 'inactive'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {facility.status}
                          </span>
                        </TableCell>
                        <TableCell>N/A</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilitiesList;
