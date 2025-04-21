
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
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
      setFacilities(data);
      setFilteredFacilities(data);
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
    <AppLayout
      title="Facilities"
      subtitle="Manage all your organization facilities"
      actions={
        <Button onClick={() => navigate('/facilities/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Facility
        </Button>
      }
    >
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Facilities Management</CardTitle>
          <CardDescription>
            View and manage all facilities across your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search facilities by name, location, or type..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : filteredFacilities.length === 0 ? (
              <div className="text-center py-12">
                <Building className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No facilities found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search term' : 'Add your first facility to get started'}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => navigate('/facilities/new')}
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Facility
                  </Button>
                )}
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
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
                        <TableCell>{facility.facility_type || 'Not specified'}</TableCell>
                        <TableCell>
                          {[
                            facility.city, 
                            facility.state, 
                            facility.country
                          ].filter(Boolean).join(', ') || 'Not specified'}
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
                        <TableCell>
                          {facility.contact_email || facility.contact_phone || 'Not specified'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default FacilitiesList;
