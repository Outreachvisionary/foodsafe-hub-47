
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import OrganizationTypeSelector from './OrganizationTypeSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { createOrganization } from '@/services/organizationService';
import { OrganizationInput, Organization } from '@/types/organization';
import { toast } from 'sonner';

interface OrganizationRegistrationFormProps {
  onOrganizationCreated?: (organization: Organization) => void;
}

const OrganizationRegistrationForm: React.FC<OrganizationRegistrationFormProps> = ({ 
  onOrganizationCreated 
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [organizationType, setOrganizationType] = useState("food-manufacturer");
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    
    const organizationData: OrganizationInput = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      country: formData.get('country') as string,
      zipcode: formData.get('zipcode') as string,
      contact_email: formData.get('contact_email') as string,
      contact_phone: formData.get('contact_phone') as string,
      industry_type: organizationType,
      status: 'active', // Set default status to active
    };
    
    try {
      const newOrganization = await createOrganization(organizationData);
      
      toast.success('Organization created successfully');
      
      if (onOrganizationCreated) {
        onOrganizationCreated(newOrganization);
      }
      
      // Redirect to the new organization's dashboard
      navigate(`/organization/dashboard/${newOrganization.id}`);
    } catch (error) {
      console.error('Error creating organization:', error);
      toast.error('Failed to create organization. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Register New Organization</CardTitle>
        <CardDescription>
          Create a new organization to manage facilities, users, and compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="organization-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Organization Name <span className="text-red-500">*</span></Label>
              <Input id="name" name="name" placeholder="Enter organization name" required />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Brief description of the organization"
              />
            </div>
            
            <div>
              <Label>Organization Type <span className="text-red-500">*</span></Label>
              <OrganizationTypeSelector 
                value={organizationType} 
                onValueChange={setOrganizationType} 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" placeholder="Street address" />
              </div>
              
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" placeholder="City" />
              </div>
              
              <div>
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" name="state" placeholder="State or province" />
              </div>
              
              <div>
                <Label htmlFor="zipcode">Postal / Zip Code</Label>
                <Input id="zipcode" name="zipcode" placeholder="Postal or zip code" />
              </div>
              
              <div>
                <Label htmlFor="country">Country</Label>
                <Select defaultValue="US" name="country">
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="MX">Mexico</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="NZ">New Zealand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_email">Contact Email <span className="text-red-500">*</span></Label>
                <Input 
                  id="contact_email" 
                  name="contact_email" 
                  type="email" 
                  placeholder="Primary contact email" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input 
                  id="contact_phone" 
                  name="contact_phone" 
                  placeholder="Contact phone number" 
                />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          form="organization-form" 
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Organization'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrganizationRegistrationForm;
