
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit, Trash2, UserPlus } from 'lucide-react';
import { EmployeeCertification, Certification } from '@/services/certificationService';

interface EmployeeCertificationsListProps {
  employeeCertifications: EmployeeCertification[];
  certifications: Certification[];
  isLoading: boolean;
  title?: string;
}

const EmployeeCertificationsList: React.FC<EmployeeCertificationsListProps> = ({
  employeeCertifications,
  certifications,
  isLoading,
  title = "Employee Certifications"
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCertifications = employeeCertifications.filter(cert =>
    cert.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certification_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string, expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (status === 'Expired' || daysUntilExpiry <= 0) {
      return 'bg-red-100 text-red-800';
    } else if (daysUntilExpiry <= 30) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (status === 'Active') {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading employee certifications...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employee certifications..."
                className="pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee Certification
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredCertifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No employee certifications found</p>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Certification</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertifications.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{cert.employee_name}</p>
                        {cert.department && (
                          <p className="text-sm text-muted-foreground">{cert.department}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{cert.certification_name}</p>
                        <p className="text-sm text-muted-foreground">{cert.issuing_body}</p>
                        {cert.certificate_number && (
                          <p className="text-xs text-muted-foreground">#{cert.certificate_number}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(cert.issued_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(cert.expiry_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(cert.status, cert.expiry_date)}>
                        {cert.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeCertificationsList;
