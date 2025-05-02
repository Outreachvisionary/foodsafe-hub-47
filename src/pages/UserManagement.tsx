import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfile } from '@/types/profile';
import { getProfiles, updateProfile } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCircle2, Mail, Building, BadgeCheck } from 'lucide-react';

interface ProfileData extends UserProfile {
  id: string;
}

const UserManagement = () => {
  const [profilesData, setProfilesData] = useState<ProfileData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const profiles = await getProfiles();
        setProfilesData(profiles.map(profile => ({ ...profile, id: profile.user_id })));
      } catch (error) {
        console.error('Error fetching profiles:', error);
        toast({
          title: "Error",
          description: "Failed to load user profiles",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const filteredProfiles = profilesData.filter(profile => {
    const fullName = profile?.full_name || '';
    const email = profile?.email || '';
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (userId: string, status: string) => {
    setProfilesData(prev => prev.map(profile => {
      if (profile.id === userId) {
        return { ...profile, status };
      }
      return profile;
    }));

    // Here you would typically make an API call to update the user's status
    console.log(`User ${userId} status updated to ${status}`);
  };

  const handleRoleChange = (userId: string, role: string) => {
    setProfilesData(prev => prev.map(profile => {
      if (profile.id === userId) {
        return { ...profile, role };
      }
      return profile;
    }));

    // Here you would typically make an API call to update the user's role
    console.log(`User ${userId} role updated to ${role}`);
  };

  const handleDepartmentChange = (userId: string, department: string) => {
    setProfilesData(prev => prev.map(profile => {
      if (profile.id === userId) {
        return { ...profile, department };
      }
      return profile;
    }));
    
    // Here you would typically make an API call to update the user's department
    console.log(`User ${userId} department updated to ${department}`);
  };
  
  const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
    // If there's a department_id in the data, convert it to department
    if ('department_id' in data) {
      data.department = data.department_id as string;
      delete data.department_id;
    }
    
    try {
      await updateProfile(userId, data);
      toast({
        title: "Success",
        description: "User profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast({
        title: "Error",
        description: "Failed to update user profile",
        variant: "destructive",
      });
    }
  };

  const renderActiveUsers = () => {
    const activeUsers = filteredProfiles.filter(profile => profile.status === 'active');

    return activeUsers.map(profile => (
      <div key={profile.id} className="border rounded-md p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <UserCircle2 className="h-8 w-8 text-gray-500" />
            <div>
              <div className="font-semibold">{profile.full_name}</div>
              <div className="text-sm text-gray-500">{profile.email}</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <BadgeCheck className="h-5 w-5 text-green-500" />
            <Select
              value={profile.role || ''}
              onValueChange={(value) => handleRoleChange(profile.id, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="readonly">Read Only</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={profile.status || ''}
              onValueChange={(value) => handleStatusChange(profile.id, value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    ));
  };

  const renderInactiveUsers = () => {
    const inactiveUsers = filteredProfiles.filter(profile => profile.status === 'inactive');

    return inactiveUsers.map(profile => (
      <div key={profile.id} className="border rounded-md p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <UserCircle2 className="h-8 w-8 text-gray-500" />
            <div>
              <div className="font-semibold">{profile.full_name}</div>
              <div className="text-sm text-gray-500">{profile.email}</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <BadgeCheck className="h-5 w-5 text-red-500" />
            <Select
              value={profile.role || ''}
              onValueChange={(value) => handleRoleChange(profile.id, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="readonly">Read Only</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={profile.status || ''}
              onValueChange={(value) => handleStatusChange(profile.id, value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div>
        <DashboardHeader title="User Management" subtitle="Manage user accounts and roles" />
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader title="User Management" subtitle="Manage user accounts and roles" />
      
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>User Accounts</CardTitle>
            <Input
              type="search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="max-w-md"
            />
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                {renderActiveUsers()}
              </TabsContent>
              <TabsContent value="inactive">
                {renderInactiveUsers()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Button onClick={() => navigate('/user-create')} className="mt-4">
          Add New User
        </Button>
      </div>
    </>
  );
};

export default UserManagement;
