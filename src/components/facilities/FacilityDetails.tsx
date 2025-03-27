
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Edit, MapPin, Phone, Mail, Building2 } from 'lucide-react';
import { Facility } from '@/types/facility';

interface FacilityDetailsProps {
  facility: Facility;
  onUpdate: (updatedData: Partial<Facility>) => Promise<void>;
}

const FacilityDetails: React.FC<FacilityDetailsProps> = ({ facility, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: facility.name,
    description: facility.description || '',
    address: facility.address || '',
    facility_type: facility.facility_type || '',
    contact_email: facility.contact_email || '',
    contact_phone: facility.contact_phone || '',
  });

  const handleSave = async () => {
    try {
      await onUpdate({
        name: formData.name,
        description: formData.description || null,
        address: formData.address || null,
        facility_type: formData.facility_type || null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating facility:', error);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Facility Name</Label>
          <Input 
            id="name" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Textarea 
            id="address" 
            value={formData.address} 
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            rows={2}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="facilityType">Facility Type</Label>
          <Input 
            id="facilityType" 
            value={formData.facility_type} 
            onChange={(e) => setFormData({...formData, facility_type: e.target.value})}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input 
            id="contact_email" 
            type="email"
            value={formData.contact_email} 
            onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="contact_phone">Contact Phone</Label>
          <Input 
            id="contact_phone" 
            value={formData.contact_phone} 
            onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div>
        <Label>Description</Label>
        <p className="text-sm text-muted-foreground mt-1">
          {facility.description || 'No description provided'}
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <Label>Facility Details</Label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <Label className="text-xs">Address</Label>
              <p className="text-sm text-muted-foreground">
                {facility.address || 'Not specified'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <Label className="text-xs">Type</Label>
              <p className="text-sm text-muted-foreground">
                {facility.facility_type || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <Label>Contact Information</Label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="flex items-start space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <Label className="text-xs">Email</Label>
              <p className="text-sm text-muted-foreground">
                {facility.contact_email || 'Not specified'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <Label className="text-xs">Phone</Label>
              <p className="text-sm text-muted-foreground">
                {facility.contact_phone || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex justify-end">
        <Button onClick={() => setIsEditing(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Facility
        </Button>
      </div>
    </div>
  );
};

export default FacilityDetails;
