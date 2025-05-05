
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { parseISO, isValid, differenceInDays } from 'date-fns';
import { Certification } from '@/types/training';

interface ExpiringCertificationsCardProps {
  certifications: Certification[];
}

const ExpiringCertificationsCard: React.FC<ExpiringCertificationsCardProps> = ({ certifications }) => {
  // Helper function to safely parse dates
  const safeParseDate = (dateString: string | null | undefined): Date | null => {
    if (!dateString) return null;
    try {
      const parsedDate = parseISO(dateString);
      return isValid(parsedDate) ? parsedDate : null;
    } catch (e) {
      console.error(`Invalid date: ${dateString}`, e);
      return null;
    }
  };
  
  // Filter certifications expiring within the next 30 days
  const expiringCertifications = certifications.filter(cert => {
    const expiryDate = safeParseDate(cert.expiryDate);
    if (!expiryDate) return false; // Skip invalid dates
    
    const now = new Date();
    const diffDays = differenceInDays(expiryDate, now);
    return diffDays >= 0 && diffDays <= 30;
  });

  // Sort by expiry date
  expiringCertifications.sort((a, b) => {
    const dateA = safeParseDate(a.expiryDate);
    const dateB = safeParseDate(b.expiryDate);
    
    // If either date is invalid, move it to the end
    if (!dateA) return 1;
    if (!dateB) return -1;
    
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
            {expiringCertifications.map(cert => {
              const expiryDate = safeParseDate(cert.expiryDate);
              
              return (
                <li key={cert.id} className="py-2 border-b last:border-b-0">
                  <div className="flex justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{cert.name || cert.certificationName}</p>
                      <p className="text-xs text-muted-foreground">Employee: {cert.employee_name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expires: {expiryDate ? expiryDate.toLocaleDateString() : 'Unknown date'}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No certifications expiring soon.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiringCertificationsCard;
