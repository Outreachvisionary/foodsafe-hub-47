
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getOrganizationById } from '@/services/organizationService';
import { Organization } from '@/types/organization';
import { Loader2, Building2, Users, LayoutDashboard } from 'lucide-react';

const OrganizationDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchOrganization = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getOrganizationById(id);
        
        // Ensure the organization has all required fields
        if (data && data.id && data.name) {
          setOrganization({
            ...data,
            status: data.status || 'active'
          });
        } else {
          throw new Error('Invalid organization data received');
        }
      } catch (error) {
        console.error('Error fetching organization:', error);
        toast({
          title: 'Error',
          description: 'Failed to load organization details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrganization();
  }, [id, toast]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading organization data...</span>
      </div>
    );
  }
  
  if (!organization) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Organization Not Found</h2>
          <p className="text-muted-foreground">
            The requested organization could not be found. It may have been deleted or you may not have permission to view it.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{organization.name}</h1>
        <p className="text-muted-foreground">{organization.description || 'No description provided'}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Building2 className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full mr-3" />
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-muted-foreground text-sm">Total Facilities</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-10 w-10 text-indigo-500 p-2 bg-indigo-500/10 rounded-full mr-3" />
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-muted-foreground text-sm">Total Departments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">FSMS Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <LayoutDashboard className="h-10 w-10 text-green-500 p-2 bg-green-500/10 rounded-full mr-3" />
              <div>
                <p className="text-2xl font-bold">--</p>
                <p className="text-muted-foreground text-sm">Coming Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Contact Information</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Email:</span> {organization.contact_email || 'Not specified'}</p>
                <p><span className="text-muted-foreground">Phone:</span> {organization.contact_phone || 'Not specified'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Location</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Address:</span> {organization.address || 'Not specified'}</p>
                <p><span className="text-muted-foreground">City:</span> {organization.city || 'Not specified'}</p>
                <p><span className="text-muted-foreground">State/Country:</span> {`${organization.state || ''} ${organization.country || ''}`.trim() || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationDashboard;
