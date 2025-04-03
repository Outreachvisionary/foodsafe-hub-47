
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getOrganizationById, updateOrganization } from '@/services/organizationService';
import { Organization } from '@/types/organization';
import { Loader2 } from 'lucide-react';

const OrganizationSettings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!organization) return;
    
    const { name, value } = e.target;
    setOrganization(prev => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!organization || !id) return;
    
    try {
      setSaving(true);
      await updateOrganization(id, organization);
      toast({
        title: 'Success',
        description: 'Organization settings updated successfully',
      });
    } catch (error) {
      console.error('Error updating organization:', error);
      toast({
        title: 'Error',
        description: 'Failed to update organization settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
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
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">Organization Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The requested organization could not be found. It may have been deleted or you may not have permission to view it.
        </p>
        <Button onClick={() => navigate('/organizations')}>Go to Organizations</Button>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <p className="text-muted-foreground">Manage settings for {organization.name}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Organization Name</label>
                <Input 
                  id="name" 
                  name="name" 
                  value={organization.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact_email" className="text-sm font-medium">Contact Email</label>
                <Input 
                  id="contact_email" 
                  name="contact_email" 
                  type="email" 
                  value={organization.contact_email || ''} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="description" 
                name="description" 
                value={organization.description || ''} 
                onChange={handleChange} 
                rows={3} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">Address</label>
              <Input 
                id="address" 
                name="address" 
                value={organization.address || ''} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">City</label>
                <Input 
                  id="city" 
                  name="city" 
                  value={organization.city || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">State/Province</label>
                <Input 
                  id="state" 
                  name="state" 
                  value={organization.state || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">Country</label>
                <Input 
                  id="country" 
                  name="country" 
                  value={organization.country || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="zipcode" className="text-sm font-medium">Postal Code</label>
                <Input 
                  id="zipcode" 
                  name="zipcode" 
                  value={organization.zipcode || ''} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="contact_phone" className="text-sm font-medium">Contact Phone</label>
              <Input 
                id="contact_phone" 
                name="contact_phone" 
                value={organization.contact_phone || ''} 
                onChange={handleChange} 
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(`/organization/dashboard/${id}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OrganizationSettings;
