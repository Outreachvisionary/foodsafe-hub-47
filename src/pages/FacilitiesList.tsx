
import React, { useState, useEffect } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { Factory, Plus, Building2, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import OrganizationSelector from '@/components/organizations/OrganizationSelector';

interface Facility {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  facility_type: string | null;
  organization_id: string;
  status: string;
  created_at: string;
  organizations?: {
    name: string;
  }
}

const FacilitiesList: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.organization_id) {
        setSelectedOrgId(user.organization_id);
      }
      fetchFacilities();
    }
  }, [user]);

  useEffect(() => {
    if (facilities.length > 0) {
      filterFacilities();
    }
  }, [facilities, searchQuery, selectedOrgId]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('facilities')
        .select(`
          *,
          organizations (
            name
          )
        `)
        .eq('status', 'active');
      
      // If the user has restricted access, only show their assigned facilities
      if (user && user.assigned_facility_ids && user.assigned_facility_ids.length > 0 && !user.role?.includes('admin')) {
        query = query.in('id', user.assigned_facility_ids);
      }
      
      // If organization is selected, filter by it
      if (user?.organization_id && !user.role?.includes('admin')) {
        query = query.eq('organization_id', user.organization_id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setFacilities(data as Facility[]);
      setFilteredFacilities(data as Facility[]);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load facilities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterFacilities = () => {
    let result = [...facilities];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(facility => 
        facility.name.toLowerCase().includes(query) ||
        (facility.description && facility.description.toLowerCase().includes(query)) ||
        (facility.address && facility.address.toLowerCase().includes(query)) ||
        (facility.facility_type && facility.facility_type.toLowerCase().includes(query))
      );
    }
    
    // Filter by organization
    if (selectedOrgId) {
      result = result.filter(facility => facility.organization_id === selectedOrgId);
    }
    
    setFilteredFacilities(result);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOrganizationChange = (orgId: string) => {
    setSelectedOrgId(orgId);
  };

  const handleCreateFacility = () => {
    navigate('/facilities/new');
  };

  const viewFacility = (id: string) => {
    navigate(`/facilities/${id}`);
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Facilities</h1>
          
          <Button onClick={handleCreateFacility}>
            <Plus className="mr-2 h-4 w-4" />
            New Facility
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search facilities..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-8"
                />
              </div>
              
              {user?.role?.includes('admin') && (
                <div className="w-full md:w-64">
                  <OrganizationSelector />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>All Facilities</CardTitle>
            <CardDescription>
              Showing {filteredFacilities.length} of {facilities.length} facilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Loading facilities...</p>
              </div>
            ) : filteredFacilities.length === 0 ? (
              <div className="text-center py-6">
                <Factory className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-2 text-muted-foreground">No facilities found.</p>
                <Button variant="outline" className="mt-4" onClick={handleCreateFacility}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first facility
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Address</TableHead>
                    {user?.role?.includes('admin') && (
                      <TableHead>Organization</TableHead>
                    )}
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFacilities.map((facility) => (
                    <TableRow key={facility.id} className="cursor-pointer" onClick={() => viewFacility(facility.id)}>
                      <TableCell className="font-medium">{facility.name}</TableCell>
                      <TableCell>{facility.facility_type || 'Not specified'}</TableCell>
                      <TableCell>{facility.address || 'Not specified'}</TableCell>
                      {user?.role?.includes('admin') && (
                        <TableCell className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1 text-muted-foreground" />
                          {facility.organizations?.name || 'Unknown'}
                        </TableCell>
                      )}
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          facility.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {facility.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={(e) => {
                          e.stopPropagation();
                          viewFacility(facility.id);
                        }}>
                          View
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
    </SidebarLayout>
  );
};

export default FacilitiesList;
