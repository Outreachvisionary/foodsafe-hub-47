
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Calendar } from 'lucide-react';
import { getMockTrainingStatistics } from '@/services/mockDataService';
import { TrainingStatistics } from '@/types/training';

const ExpiringCertificationsCard = () => {
  const [stats, setStats] = useState<TrainingStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Use synchronous mock data
    const mockStats = getMockTrainingStatistics();
    setStats(mockStats);
    setLoading(false);
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  if (loading || !stats) {
    return <Card className="h-80 animate-pulse bg-muted"></Card>;
  }
  
  const expiringCerts = stats.expiringCertifications;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
          Expiring Certifications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {expiringCerts.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No certifications expiring soon
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {expiringCerts.map((cert, index) => (
              <li key={index} className="px-4 py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium">{cert.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {cert.employee}
                    </p>
                  </div>
                  <div className="flex items-center text-xs text-amber-600">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {formatDate(cert.expires)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiringCertificationsCard;
