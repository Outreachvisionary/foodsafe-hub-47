
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DocumentRepositoryView from '@/components/documents/DocumentRepositoryView';
import { DocumentProvider } from '@/contexts/DocumentContext';

const Documents = () => {
  const { user, loading } = useAuth();

  console.log('Documents page render:', { loading, hasUser: !!user });

  // Simple loading check with timeout fallback
  if (loading) {
    console.log('Documents: showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  // If no user after loading, redirect to auth
  if (!user) {
    console.log('Documents: no user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('Documents: rendering main content');

  return (
    <DocumentProvider>
      <div className="container mx-auto p-6 max-w-7xl">
        <DocumentRepositoryView />
      </div>
    </DocumentProvider>
  );
};

export default Documents;
