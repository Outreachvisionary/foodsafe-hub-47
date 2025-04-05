
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, AlertCircle, Calendar } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface ExpiringCertification {
  id: string;
  name: string;
  employee: string;
  expiryDate: string;
  daysLeft: number;
  auditRequired?: boolean;
}

interface ExpiringCertificationsCardProps {
  count: number;
  certifications?: ExpiringCertification[];
  onViewAll?: () => void;
  onScheduleAudit?: (certification: ExpiringCertification) => void;
}

const ExpiringCertificationsCard: React.FC<ExpiringCertificationsCardProps> = ({ 
  count, 
  certifications,
  onViewAll,
  onScheduleAudit
}) => {
  // Sample expiring certifications data - show only the next 3
  const expiringCertifications = certifications || [
    { 
      id: '1', 
      name: 'Food Safety Manager Certification', 
      employee: 'Robert Johnson',
      expiryDate: '2025-05-20', 
      daysLeft: 14,
      auditRequired: true
    },
    { 
      id: '2', 
      name: 'HACCP Certification', 
      employee: 'Maria Garcia',
      expiryDate: '2025-05-28', 
      daysLeft: 22,
      auditRequired: true
    },
    { 
      id: '3', 
      name: 'ISO 9001 Lead Auditor', 
      employee: 'John Smith',
      expiryDate: '2025-06-05', 
      daysLeft: 30,
      auditRequired: false
    }
  ];

  // Format date for display
  const formatExpiryDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch (error) {
      return dateStr; // Return original string if parsing fails
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center">
            <Award className="h-5 w-5 text-amber-500 mr-2" />
            Expiring Certifications
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onViewAll}>View All</Button>
        </div>
        <CardDescription>Certifications expiring in the next 45 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expiringCertifications.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No certifications expiring soon
            </div>
          ) : (
            expiringCertifications.slice(0, 3).map((cert) => (
              <div key={cert.id} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                {cert.daysLeft <= 14 ? (
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Calendar className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-grow">
                  <h4 className="text-sm font-medium">{cert.name}</h4>
                  <p className="text-xs text-muted-foreground">{cert.employee}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      Expires: {formatExpiryDate(cert.expiryDate)}
                    </span>
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-sm ${
                      cert.daysLeft <= 14 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {cert.daysLeft} days left
                    </span>
                  </div>
                </div>
                {cert.auditRequired && onScheduleAudit && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs mt-0.5"
                    onClick={() => onScheduleAudit(cert)}
                  >
                    Schedule Audit
                  </Button>
                )}
              </div>
            ))
          )}
          
          {count > 3 && (
            <Button variant="outline" className="w-full" onClick={onViewAll}>
              View all {count} expiring certifications
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpiringCertificationsCard;
