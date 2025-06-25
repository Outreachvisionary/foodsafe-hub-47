
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { CertificationStats, EmployeeCertification } from '@/services/certificationService';

interface CertificationOverviewProps {
  stats: CertificationStats;
  recentCertifications: EmployeeCertification[];
  isLoading: boolean;
}

const CertificationOverview: React.FC<CertificationOverviewProps> = ({
  stats,
  recentCertifications,
  isLoading
}) => {
  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Expired':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Certifications</p>
                <p className="text-2xl font-bold">{stats.total_certifications}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">{stats.active_certifications}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold">{stats.expiring_soon}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold">{stats.expired_certifications}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Employee Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          {recentCertifications.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No recent certifications found
            </p>
          ) : (
            <div className="space-y-4">
              {recentCertifications.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(cert.status)}
                    <div>
                      <p className="font-medium">{cert.employee_name}</p>
                      <p className="text-sm text-muted-foreground">{cert.certification_name}</p>
                      <p className="text-xs text-muted-foreground">{cert.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(cert.status)}>
                      {cert.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      Expires: {new Date(cert.expiry_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificationOverview;
