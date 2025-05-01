
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Facility } from '@/types/facility';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  MapPin, 
  Mail, 
  Phone, 
  CalendarClock, 
  ClipboardCheck,
  User,
  FileText,
  RefreshCw 
} from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FacilityDetailsProps {
  facility: Facility;
}

const FacilityOverview: React.FC<FacilityDetailsProps> = ({ facility }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facility Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Building className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium">Facility Name</div>
              <div>{facility.name}</div>
            </div>
          </div>

          {/* Only show facility_type if it exists */}
          {facility.facility_type && (
            <div className="flex items-start gap-3">
              <ClipboardCheck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Facility Type</div>
                <div>{facility.facility_type}</div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium">Address</div>
              <div>
                {facility.address || 'N/A'}
                {facility.city && `, ${facility.city}`}
                {facility.state && `, ${facility.state}`}
                {facility.zipcode && ` ${facility.zipcode}`}
                {facility.country && `, ${facility.country}`}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium">Contact Email</div>
              <div>{facility.contact_email || 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium">Contact Phone</div>
              <div>{facility.contact_phone || 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarClock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium">Created At</div>
              <div>{facility.created_at ? format(new Date(facility.created_at), 'PPP') : 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarClock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium">Last Updated</div>
              <div>{facility.updated_at ? format(new Date(facility.updated_at), 'PPP') : 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RefreshCw className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium">Status</div>
              <Badge 
                variant={facility.status === 'active' ? 'default' : 'secondary'}
                className="mt-1"
              >
                {facility.status || 'Unknown'}
              </Badge>
            </div>
          </div>
        </div>

        {facility.description && (
          <div className="mt-4">
            <div className="font-medium mb-1">Description</div>
            <div className="text-gray-600">{facility.description}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Add tabs for the facility details and related info
const FacilityDetails: React.FC<FacilityDetailsProps> = ({ facility }) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="compliance">Compliance</TabsTrigger>
        <TabsTrigger value="departments">Departments</TabsTrigger>
        <TabsTrigger value="staff">Staff</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-4">
        <FacilityOverview facility={facility} />
      </TabsContent>
      
      <TabsContent value="compliance" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Compliance information for this facility will appear here.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="departments" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Departments information for this facility will appear here.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="staff" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Staff information for this facility will appear here.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default FacilityDetails;
