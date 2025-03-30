
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, MapPin, Phone, Mail, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Facility } from '@/types/facility';

interface FacilityDetailsProps {
  facility: Facility;
  onEdit?: () => void;
}

const FacilityDetails: React.FC<FacilityDetailsProps> = ({ facility, onEdit }) => {
  const navigate = useNavigate();
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      navigate(`/facilities/${facility.id}`);
    }
  };
  
  const formatAddress = () => {
    const parts = [
      facility.address,
      facility.city,
      facility.state,
      facility.zipcode,
      facility.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{facility.name}</CardTitle>
          <div className="text-sm text-muted-foreground mt-1">
            <span className="inline-flex items-center">
              <Building className="mr-1 h-4 w-4" />
              {facility.facility_type || 'No type specified'}
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-1">Description</h3>
          <p className="text-sm text-muted-foreground">
            {facility.description || 'No description provided'}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-1">Status</h3>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            facility.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {facility.status}
          </span>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-1">Address</h3>
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {formatAddress() || 'No address provided'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Contact Email</h3>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {facility.contact_email || 'No email provided'}
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Contact Phone</h3>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {facility.contact_phone || 'No phone provided'}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-1">Type</h3>
          <span className="text-sm text-muted-foreground">
            {facility.facility_type || 'Not specified'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilityDetails;
