
import React from 'react';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import SystemDiagnostics from '@/components/diagnostics/SystemDiagnostics';

const SystemDiagnosticsPage: React.FC = () => {
  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">System Diagnostics</h1>
          <p className="text-muted-foreground">
            Real-time system health monitoring and diagnostic tools
          </p>
        </div>

        <SystemDiagnostics />
      </div>
    </ProtectedSidebarLayout>
  );
};

export default SystemDiagnosticsPage;
