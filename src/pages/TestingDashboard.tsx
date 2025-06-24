
import React from 'react';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import TestingLinks from '@/components/navigation/TestingLinks';
import SystemDiagnostics from '@/components/diagnostics/SystemDiagnostics';

const TestingDashboard: React.FC = () => {
  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Testing & Diagnostics</h1>
          <p className="text-muted-foreground">
            Comprehensive testing suite for database connections, system health, and backend-frontend integration
          </p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Use these tools to diagnose connection issues, verify system health, and test integration between components.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TestingLinks />
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Live System Diagnostics</CardTitle>
              </CardHeader>
              <CardContent>
                <SystemDiagnostics />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedSidebarLayout>
  );
};

export default TestingDashboard;
