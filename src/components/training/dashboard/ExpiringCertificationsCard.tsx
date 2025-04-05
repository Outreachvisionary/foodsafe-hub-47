
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, AlertCircle, Calendar } from 'lucide-react';

interface ExpiringCertificationsCardProps {
  count: number;
}

const ExpiringCertificationsCard: React.FC<ExpiringCertificationsCardProps> = ({ count }) => {
  // Sample expiring certifications data - show only the next 3
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
    }
  ];
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center">
            <Award className="h-5 w-5 text-amber-500 mr-2" />
            Expiring Certifications
          </CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        <CardDescription>Certifications expiring in the next 45 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expiringCertifications.map((cert) => (
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
          
          {count > 3 && (
            <Button variant="outline" className="w-full">
              View all {count} expiring certifications
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpiringCertificationsCard;
