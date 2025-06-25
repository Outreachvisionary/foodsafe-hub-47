
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { Certification } from '@/services/certificationService';
import { useCertifications } from '@/hooks/useCertifications';

interface CertificationListProps {
  certifications: Certification[];
  isLoading: boolean;
}

const CertificationList: React.FC<CertificationListProps> = ({
  certifications,
  isLoading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { deleteCertification } = useCertifications();

  const filteredCertifications = certifications.filter(cert =>
    cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuing_body.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="animate-pulse">Loading certifications...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Certification Types</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search certifications..."
                className="pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredCertifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No certifications found</p>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Issuing Body</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Validity Period</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertifications.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{cert.name}</p>
                        {cert.description && (
                          <p className="text-sm text-muted-foreground">{cert.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{cert.issuing_body}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{cert.category}</Badge>
                    </TableCell>
                    <TableCell>{cert.validity_period_months} months</TableCell>
                    <TableCell>
                      <Badge variant={cert.is_required ? "default" : "secondary"}>
                        {cert.is_required ? "Required" : "Optional"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => cert.id && deleteCertification(cert.id)}
                        >
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

export default CertificationList;
