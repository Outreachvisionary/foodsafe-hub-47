import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Mock user metadata access - replace with actual implementation
  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    // Since user_metadata might not be available, fall back to email
    return user.email?.split('@')[0] || 'User';
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {getUserDisplayName()}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Dashboard content will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
