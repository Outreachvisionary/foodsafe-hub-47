
import React from 'react';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import DatabaseConnectionTest from '@/components/DatabaseConnectionTest';
import AuthDebugger from '@/components/AuthDebugger';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DatabaseTestPage: React.FC = () => {
  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Database Connection Tests</h1>
          <p className="text-muted-foreground">
            Test database connectivity, authentication, and data access
          </p>
        </div>

        <Tabs defaultValue="connection" className="space-y-4">
          <TabsList>
            <TabsTrigger value="connection">Connection Test</TabsTrigger>
            <TabsTrigger value="auth">Auth Debugger</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection">
            <DatabaseConnectionTest />
          </TabsContent>
          
          <TabsContent value="auth">
            <AuthDebugger />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedSidebarLayout>
  );
};

export default DatabaseTestPage;
