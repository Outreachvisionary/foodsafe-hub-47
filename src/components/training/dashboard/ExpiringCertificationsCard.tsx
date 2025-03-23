
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, AlertCircle, Calendar } from 'lucide-react';

interface ExpiringCertificationsCardProps {
  count: number;
}

const ExpiringCertificationsCard: React.FC<ExpiringCertificationsCardProps> = ({ count }) => {
  // Sample expiring certifications data
  const expiringCertifications = [
    { 
      id: '1', 
      name: 'Food Safety Manager Certification', 
      employee: 'Robert Johnson',
      expiryDate: 'May 20, 2023', 
      daysLeft: 14
    },
    { 
      id: '2', 
      name: 'HACCP Certification', 
      employee: 'Maria Garcia',
      expiryDate: 'May 28, 2023', 
      daysLeft: 22
    },
    { 
      id: '3', 
      name: 'ISO 9001 Lead Auditor', 
      employee: 'John Smith',
      expiryDate: 'Jun 5, 2023', 
      daysLeft: 30
    },
    { 
      id: '4', 
      name: 'GMP Certification', 
      employee: 'Susan Miller',
      expiryDate: 'Jun 12, 2023', 
      daysLeft: 37
    }
  ];
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Award className="h-5 w-5 text-amber-500 mr-2" />
          Expiring Certifications
        </CardTitle>
        <CardDescription>Certifications expiring in the next 45 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expiringCertifications.slice(0, 4).map((cert) => (
            <div key={cert.id} className="flex items-start space-x-3 border-b pb-3 last:border-0">
              {cert.daysLeft <= 14 ? (
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              ) : (
                <Calendar className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <h4 className="text-sm font-medium">{cert.name}</h4>
                <p className="text-xs text-muted-foreground">{cert.employee}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-muted-foreground">Expires: {cert.expiryDate}</span>
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-sm ${
                    cert.daysLeft <= 14 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {cert.daysLeft} days left
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {count > 4 && (
            <button className="text-sm text-blue-500 hover:text-blue-700 transition-colors w-full text-center">
              View all {count} expiring certifications
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpiringCertificationsCard;
