
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Profile: React.FC = () => {
  const { user } = useAuth();
  
  // Mock updateUser function
  const handleUpdateUser = () => {
    console.log('Update user functionality to be implemented');
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Email: {user?.email || 'Not available'}</p>
          <Button onClick={handleUpdateUser} className="mt-4">
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
