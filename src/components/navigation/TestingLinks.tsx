
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, TestTube, Activity, Settings } from 'lucide-react';

const TestingLinks: React.FC = () => {
  const testingPages = [
    {
      title: 'Database Connection Test',
      description: 'Test basic database connectivity and authentication',
      path: '/database-test',
      icon: Database,
      component: 'DatabaseConnectionTest'
    },
    {
      title: 'System Diagnostics',
      description: 'Comprehensive system health checks and diagnostics',
      path: '/diagnostics',
      icon: Activity,
      component: 'SystemDiagnostics'
    },
    {
      title: 'Backend-Frontend Tests',
      description: 'Integration tests between backend and frontend modules',
      path: '/backend-tests',
      icon: TestTube,
      component: 'BackendFrontendTests'
    },
    {
      title: 'Testing Verification',
      description: 'Comprehensive testing and verification suite',
      path: '/testing-verification',
      icon: Settings,
      component: 'TestingVerification'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Database & System Testing</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testingPages.map((test) => {
          const Icon = test.icon;
          return (
            <Card key={test.path} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-5 w-5" />
                  {test.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {test.description}
                </p>
                <Link to={test.path}>
                  <Button variant="outline" size="sm" className="w-full">
                    Run Test
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TestingLinks;
