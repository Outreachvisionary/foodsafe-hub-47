
import React from 'react';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import BackendFrontendTests from '@/components/BackendFrontendTests';

const BackendTestsPage: React.FC = () => {
  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Backend-Frontend Integration Tests</h1>
          <p className="text-muted-foreground">
            Comprehensive tests for backend-frontend module integration and data flow
          </p>
        </div>

        <BackendFrontendTests />
      </div>
    </ProtectedSidebarLayout>
  );
};

export default BackendTestsPage;
