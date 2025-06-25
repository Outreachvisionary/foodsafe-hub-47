
import React from 'react';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import DatabaseConnectionTest from '@/components/DatabaseConnectionTest';

const DatabaseConnectionTestPage: React.FC = () => {
  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Database Connection Test</h1>
          <p className="text-muted-foreground">
            Test database connectivity and authentication systems
          </p>
        </div>

        <DatabaseConnectionTest />
      </div>
    </ProtectedSidebarLayout>
  );
};

export default DatabaseConnectionTestPage;
