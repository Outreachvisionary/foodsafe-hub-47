
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getOrganization } from '@/services/organizationService';
import { Organization } from '@/types/organization';
import { Loader2 } from 'lucide-react';

const OrganizationDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getOrganization(id);
        setOrganization(data);
      } catch (error) {
        console.error('Failed to fetch organization:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-red-600">Organization Not Found</h2>
        <p className="text-gray-600 mt-2">The organization you're looking for doesn't exist or you don't have permission to view it.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{organization.name}</h1>
        <p className="text-muted-foreground">{organization.description || 'No description available'}</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">N/A</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Industry</h3>
                  <p>{organization.industry_type || 'Not specified'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Registration Number</h3>
                  <p>{organization.registration_number || 'Not specified'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tax ID</h3>
                  <p>{organization.tax_id || 'Not specified'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                  <p>{organization.website || 'Not specified'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Contact Email</h3>
                  <p>{organization.contact_email || 'Not specified'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Contact Phone</h3>
                  <p>{organization.contact_phone || 'Not specified'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                <p>
                  {organization.address ? (
                    <>
                      {organization.address},&nbsp;
                      {organization.city},&nbsp;
                      {organization.state},&nbsp;
                      {organization.zipcode},&nbsp;
                      {organization.country}
                    </>
                  ) : (
                    'No address provided'
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="facilities">
          <Card>
            <CardHeader>
              <CardTitle>Facilities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No facilities found for this organization.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Compliance data is not available yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Metrics data is not available yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationDashboard;
