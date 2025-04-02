
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createOrganization } from '@/services/organizationService';
import { OrganizationInput, Organization } from '@/types/organization';

const OrganizationRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<OrganizationInput>({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    contact_email: '',
    contact_phone: '',
    status: 'active'
  });
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Organization name is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      const organization = await createOrganization(formData);
      toast({
        title: "Success",
        description: "Organization created successfully"
      });
      navigate(`/organization/dashboard/${organization.id}`);
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Register a New Organization</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Organization Name</label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter organization name" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact_email" className="text-sm font-medium">Contact Email</label>
              <Input 
                id="contact_email" 
                name="contact_email" 
                type="email" 
                value={formData.contact_email} 
                onChange={handleChange} 
                placeholder="Contact email address" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Describe your organization" 
              rows={3} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">Address</label>
              <Input 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                placeholder="Street address" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact_phone" className="text-sm font-medium">Contact Phone</label>
              <Input 
                id="contact_phone" 
                name="contact_phone" 
                value={formData.contact_phone} 
                onChange={handleChange} 
                placeholder="Contact phone number" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">City</label>
              <Input 
                id="city" 
                name="city" 
                value={formData.city} 
                onChange={handleChange} 
                placeholder="City" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium">State/Province</label>
              <Input 
                id="state" 
                name="state" 
                value={formData.state} 
                onChange={handleChange} 
                placeholder="State/Province" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium">Country</label>
              <Input 
                id="country" 
                name="country" 
                value={formData.country} 
                onChange={handleChange} 
                placeholder="Country" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="zipcode" className="text-sm font-medium">Postal Code</label>
              <Input 
                id="zipcode" 
                name="zipcode" 
                value={formData.zipcode} 
                onChange={handleChange} 
                placeholder="Postal code" 
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/organizations')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Organization'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default OrganizationRegistrationForm;
