
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Award, CheckCircle, Clock } from 'lucide-react';

const StandardsPage: React.FC = () => {
  const standards = [
    {
      id: 1,
      name: 'ISO 22000',
      description: 'Food Safety Management Systems',
      status: 'Active',
      compliance: 95,
      lastAudit: '2024-01-15',
      nextAudit: '2024-07-15'
    },
    {
      id: 2,
      name: 'HACCP',
      description: 'Hazard Analysis Critical Control Points',
      status: 'Active',
      compliance: 98,
      lastAudit: '2024-02-10',
      nextAudit: '2024-08-10'
    },
    {
      id: 3,
      name: 'SQF',
      description: 'Safe Quality Food',
      status: 'Active',
      compliance: 92,
      lastAudit: '2024-01-20',
      nextAudit: '2024-07-20'
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Standards Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage and monitor compliance with food safety standards
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {standards.map((standard) => (
          <Card key={standard.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {standard.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {standard.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {standard.status}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Compliance:</span>
                  <span className="text-sm font-bold text-green-600">
                    {standard.compliance}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last Audit:</span>
                  <span className="text-sm">{standard.lastAudit}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Next Audit:</span>
                  <span className="text-sm flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {standard.nextAudit}
                  </span>
                </div>
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StandardsPage;
