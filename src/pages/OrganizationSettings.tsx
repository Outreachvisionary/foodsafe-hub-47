
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Organization } from '@/types/organization';
import { getOrganization } from '@/services/organizationService';
import { Loader2 } from 'lucide-react';

const OrganizationSettings: React.FC = () => {
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
        <h1 className="text-3xl font-bold">{organization.name} Settings</h1>
        <p className="text-muted-foreground">Manage organization settings and configurations</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Edit organization details and contact information</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Organization Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      defaultValue={organization.name}
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Industry</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      defaultValue={organization.industry_type || ''}
                      disabled
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    rows={3}
                    defaultValue={organization.description || ''}
                    disabled
                  />
                </div>
                
                <Button disabled>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Update organization contact details</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border rounded"
                      defaultValue={organization.contact_email || ''}
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      className="w-full p-2 border rounded"
                      defaultValue={organization.contact_phone || ''}
                      disabled
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <input
                    type="url"
                    className="w-full p-2 border rounded"
                    defaultValue={organization.website || ''}
                    disabled
                  />
                </div>
                
                <Button disabled>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Organization Branding</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Customize your organization's branding and visual identity</p>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">Drag and drop your logo here or click to upload</p>
                  <p className="text-xs text-muted-foreground mt-2">Recommended size: 256x256px (PNG or SVG)</p>
                  <Button className="mt-4" disabled>Upload Logo</Button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="h-10 w-10 border rounded cursor-pointer"
                      defaultValue="#3b82f6"
                      disabled
                    />
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      defaultValue="#3b82f6"
                      disabled
                    />
                  </div>
                </div>
                
                <Button disabled>Save Branding</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Manage user access and roles within your organization</p>
              
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">No users found in this organization</p>
                  <Button className="mt-4" disabled>Invite Users</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Connect third-party services and applications</p>
              
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">No integrations are available at this time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Manage your billing information and subscription details</p>
              
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">Billing functionality is not available at this time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationSettings;
