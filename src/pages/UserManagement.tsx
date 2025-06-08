
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  organization_id: string;
  created_at: string;
  updated_at: string;
  preferred_language: string;
  department_id: string;
  assigned_facility_ids: string[];
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<ProfileData[]>([
    {
      id: '1',
      full_name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      department: 'Quality',
      status: 'active' as const,
      organization_id: 'org-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      preferred_language: 'en',
      department_id: 'dept-1',
      assigned_facility_ids: []
    },
    {
      id: '2',
      full_name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Manager',
      department: 'Production',
      status: 'active' as const,
      organization_id: 'org-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      preferred_language: 'en',
      department_id: 'dept-2',
      assigned_facility_ids: []
    },
    {
      id: '3',
      full_name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'User',
      department: 'Operations',
      status: 'inactive' as const,
      organization_id: 'org-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      preferred_language: 'en',
      department_id: 'dept-3',
      assigned_facility_ids: []
    }
  ]);

  const handleStatusToggle = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            status: (user.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive',
            updated_at: new Date().toISOString()
          }
        : user
    ));
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <h3 className="font-medium">{user.full_name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">{user.role} - {user.department}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStatusToggle(user.id)}
                  >
                    Toggle Status
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
