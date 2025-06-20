
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Mail, Phone, Users, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface FacilityCardProps {
  facility: {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    country: string;
    contactEmail: string;
    contactPhone: string;
    status: string;
    employeeCount: number;
    activeStandards: number;
    complianceScore: number;
    lastAudit: string;
  };
}

const FacilityCard: React.FC<FacilityCardProps> = ({ facility }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{facility.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {facility.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 ml-2">
            {getStatusIcon(facility.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(facility.status)}>
              {facility.status}
            </Badge>
            <Badge variant="outline">
              {facility.activeStandards} standards
            </Badge>
            <Badge variant="secondary" className={getComplianceColor(facility.complianceScore)}>
              {facility.complianceScore}% compliance
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{facility.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{facility.contactEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{facility.contactPhone}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{facility.employeeCount} employees</span>
              </div>
              <span>Last audit: {facility.lastAudit}</span>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
            <Button size="sm" className="flex-1">
              Manage
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilityCard;
