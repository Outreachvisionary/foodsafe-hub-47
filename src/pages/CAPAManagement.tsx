
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

const CAPAManagement: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">CAPA Management</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Corrective & Preventive Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-12 text-center">
            <div>
              <RefreshCw className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">CAPA Module Under Development</h3>
              <p className="text-muted-foreground">
                The Corrective and Preventive Action (CAPA) management module is currently being developed. Check back soon for updates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CAPAManagement;
