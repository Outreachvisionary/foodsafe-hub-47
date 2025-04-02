
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck } from 'lucide-react';

const AuditManagement: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Audit Management</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Audits & Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-12 text-center">
            <div>
              <ClipboardCheck className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Audit Module Under Development</h3>
              <p className="text-muted-foreground">
                The audit management module is currently being developed. Check back soon for updates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditManagement;
