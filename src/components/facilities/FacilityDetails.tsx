
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { EditIcon, MapPinIcon, PhoneIcon, MailIcon, Building2Icon, Globe, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Facility } from '@/types/facility';

interface FacilityDetailsProps {
  facility: Facility;
  onEdit?: () => void;
}

const FacilityDetails: React.FC<FacilityDetailsProps> = ({ facility, onEdit }) => {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'maintenance':
        return <Badge className="bg-amber-100 text-amber-800">Maintenance</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">{facility.name}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {getStatusBadge(facility.status)}
            {facility.facility_type && (
              <Badge variant="outline" className="text-gray-600">
                {facility.facility_type}
              </Badge>
            )}
          </div>
        </div>
        {onEdit && (
          <Button onClick={onEdit} variant="outline" size="sm">
            <EditIcon className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4 space-y-4">
            {facility.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{facility.description}</p>
                <Separator className="my-4" />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Facility Type</h3>
                <p className="mt-1 flex items-center gap-2">
                  <Building2Icon className="h-4 w-4 text-gray-400" />
                  {facility.facility_type || 'Not specified'}
                </p>
              </div>
              
              {facility.created_at && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Added On</h3>
                  <p className="mt-1">
                    {new Date(facility.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              {/* Additional details can be added here */}
            </div>
          </TabsContent>
          
          <TabsContent value="contact" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facility.contact_email && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 flex items-center gap-2">
                    <MailIcon className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${facility.contact_email}`} className="text-blue-600 hover:underline">
                      {facility.contact_email}
                    </a>
                  </p>
                </div>
              )}
              
              {facility.contact_phone && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1 flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-gray-400" />
                    <a href={`tel:${facility.contact_phone}`} className="text-blue-600 hover:underline">
                      {facility.contact_phone}
                    </a>
                  </p>
                </div>
              )}
            </div>
            
            {!facility.contact_email && !facility.contact_phone && (
              <p className="text-muted-foreground">No contact information available</p>
            )}
          </TabsContent>
          
          <TabsContent value="location" className="pt-4">
            <div className="space-y-3">
              {facility.address && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="mt-1 flex items-start gap-2">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span>
                      {facility.address}<br />
                      {facility.city && facility.state && (
                        <>
                          {facility.city}, {facility.state} {facility.zipcode || ''}
                        </>
                      )}
                    </span>
                  </p>
                </div>
              )}
              
              {facility.country && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Country</h3>
                  <p className="mt-1 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    {facility.country}
                  </p>
                </div>
              )}
              
              {!facility.address && !facility.city && !facility.country && (
                <p className="text-muted-foreground">No location information available</p>
              )}
              
              {/* Optional: Add a map component here if coordinates are available */}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FacilityDetails;
