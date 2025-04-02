
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Organization } from '@/types/organization';
import { Facility } from '@/types/facility';
import { getOrganization } from '@/services/organizationService';
import { fetchFacilities } from '@/services/facilityService';
import { fetchDepartments } from '@/services/departmentService';
import { Building2, Users, Factory, FolderTree, BarChart3, AlertTriangle, Loader2, Settings, Plus } from 'lucide-react';

const OrganizationDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [departmentCount, setDepartmentCount] = useState(0);
  
  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        navigate('/organizations');
        return;
      }
      
      try {
        setLoading(true);
        
        // Load organization
        const org = await getOrganization(id);
        if (!org) {
          toast({
            title: 'Error',
            description: 'Organization not found',
            variant: 'destructive',
          });
          navigate('/organizations');
          return;
        }
        setOrganization(org);
        
        // Load facilities
        const facilitiesData = await fetchFacilities(id);
        setFacilities(facilitiesData);
        
        // Load departments
        const departmentsData = await fetchDepartments(id);
        setDepartmentCount(departmentsData.length);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, navigate, toast]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }
  
  if (!organization) {
    return null;
  }
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{organization.name}</h1>
          <p className="text-muted-foreground">Organization Dashboard</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/organization/settings/${id}`)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
      
      {/* Organization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Facilities</CardDescription>
            <CardTitle className="text-3xl">{facilities.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <Factory className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Departments</CardDescription>
            <CardTitle className="text-3xl">{departmentCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <FolderTree className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Compliance Status</CardDescription>
            <CardTitle className="text-3xl">85%</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart3 className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Open Issues</CardDescription>
            <CardTitle className="text-3xl">12</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertTriangle className="h-8 w-8 text-amber-500 opacity-80" />
          </CardContent>
        </Card>
      </div>
      
      {/* Facility Overview */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Facilities</CardTitle>
            <CardDescription>Overview of all facilities in {organization.name}</CardDescription>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/facilities')}
          >
            <Factory className="mr-2 h-4 w-4" />
            Manage
          </Button>
        </CardHeader>
        <CardContent>
          {facilities.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="mt-2 text-muted-foreground">
                No facilities found for this organization
              </p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => navigate('/facilities')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Facility
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facilities.map((facility) => (
                <Card key={facility.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{facility.name}</CardTitle>
                    <CardDescription>
                      {[facility.city, facility.state, facility.country].filter(Boolean).join(', ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      {facility.description || 'No description available'}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        facility.status === 'active' ? 'bg-green-100 text-green-800' : 
                        facility.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {facility.status}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate(`/facilities/${facility.id}`)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Activity & Departments Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="mt-2 text-muted-foreground">
                Activity tracking will be available soon
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Departments</CardTitle>
              <CardDescription>Organizational structure</CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/departments')}
            >
              <FolderTree className="mr-2 h-4 w-4" />
              Manage
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FolderTree className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="mt-2 text-muted-foreground">
                {departmentCount > 0 ? 
                  `${departmentCount} departments configured` : 
                  'No departments configured yet'}
              </p>
              {departmentCount === 0 && (
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => navigate('/departments')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Department
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationDashboard;
