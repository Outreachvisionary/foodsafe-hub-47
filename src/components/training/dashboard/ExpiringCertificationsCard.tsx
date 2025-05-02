
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Certification } from '@/types/training';

interface ExpiringCertificationsCardProps {
  certifications: Certification[];
}

const ExpiringCertificationsCard: React.FC<ExpiringCertificationsCardProps> = ({ certifications }) => {
  // Filter certifications expiring within the next 30 days
  const expiringCertifications = certifications.filter(cert => {
    const expiryDate = new Date(cert.expiryDate);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  });

  // Sort by expiry date
  expiringCertifications.sort((a, b) => {
    const dateA = new Date(a.expiryDate);
    const dateB = new Date(b.expiryDate);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Expiring Certifications</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {expiringCertifications.length > 0 ? (
          <ul className="list-none p-0">
            {expiringCertifications.map(cert => (
              <li key={cert.id} className="py-2 border-b last:border-b-0">
                <div className="flex justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">Employee: {cert.employeeName}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No certifications expiring soon.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiringCertificationsCard;
