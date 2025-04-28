
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, User } from 'lucide-react';
import { getMockTrainingStatistics } from '@/services/mockDataService';

interface ExpiringCertification {
  name: string;
  employee: string;
  expires: string;
}

const getDaysRemaining = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const ExpiringCertificationsCard = () => {
  const [expiringCerts, setExpiringCerts] = useState<ExpiringCertification[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Use synchronous mock data
    const mockStats = getMockTrainingStatistics();
    setExpiringCerts(mockStats.expiringCertifications);
    setLoading(false);
  }, []);

  if (loading) {
    return <Card className="w-full h-96 animate-pulse bg-muted"></Card>;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
            Expiring Certifications
          </div>
        </CardTitle>
        <Badge variant="outline">{expiringCerts.length}</Badge>
      </CardHeader>
      <CardContent>
        {expiringCerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Calendar className="w-8 h-8 mb-2" />
            <p>No certifications expiring soon</p>
          </div>
        ) : (
          <div className="space-y-4">
            {expiringCerts.map((cert, index) => {
              const daysRemaining = getDaysRemaining(cert.expires);
              const isUrgent = daysRemaining <= 7;
              
              return (
                <div key={index} className="flex justify-between items-center p-3 bg-background rounded border">
                  <div>
                    <h4 className="text-sm font-medium">{cert.name}</h4>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <User className="w-3 h-3 mr-1" /> {cert.employee}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant={isUrgent ? "destructive" : "outline"}>
                      {daysRemaining} days
                    </Badge>
                    <span className="text-xs text-muted-foreground mt-1">
                      Expires {new Date(cert.expires).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiringCertificationsCard;
