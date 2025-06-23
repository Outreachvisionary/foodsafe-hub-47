
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import TrainingDashboard from '@/components/training/TrainingDashboard';
import CreateTrainingSessionDialog from '@/components/training/CreateTrainingSessionDialog';

const Training = () => {
  const { user, loading } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading training...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleCreateSession = () => {
    setShowCreateDialog(true);
  };

  const handleViewSession = (sessionId: string) => {
    console.log('View training session:', sessionId);
    // TODO: Navigate to training session details page
  };

  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <TrainingDashboard
          onCreateSession={handleCreateSession}
          onViewSession={handleViewSession}
        />
        
        <CreateTrainingSessionDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>
    </ProtectedSidebarLayout>
  );
};

export default Training;
