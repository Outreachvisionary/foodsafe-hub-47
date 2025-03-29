
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchUserProfile, updateUserProfile } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/user';

const Profile = () => {
  const { user, updateUser } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    department: '',
  });

  useEffect(() => {
    if (user?.id) {
      loadUserProfile(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        department: profile.department || '',
      });
    }
  }, [profile]);

  const loadUserProfile = async (userId: string) => {
    setIsLoading(true);
    try {
      const data = await fetchUserProfile(userId);
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const updatedProfile = await updateUserProfile(user.id, formData);
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        updateUser({ ...user, ...formData });
        
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
    }
    
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    
    return 'U';
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>View and update your profile information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
              <AvatarFallback className="text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center mb-4">
              <h2 className="text-xl font-medium">{profile?.full_name || 'User'}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-muted-foreground mt-1">{profile?.role || 'User'}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  placeholder="Your email"
                />
                <p className="text-sm text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Your department"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
