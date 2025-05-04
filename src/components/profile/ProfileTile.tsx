
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/user';

interface ProfileTileProps {
  user: User | null;
  showRole?: boolean;
  showDepartment?: boolean;
}

const ProfileTile: React.FC<ProfileTileProps> = ({ 
  user, 
  showRole = false, 
  showDepartment = false 
}) => {
  if (!user) {
    return (
      <Card className="w-full bg-muted/30">
        <CardContent className="flex items-center p-4">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="font-medium">No user data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get initials for avatar
  const initials = user.full_name || user.name
    ? (user.full_name || user.name)?.split(' ').map(n => n[0]).join('')
    : user.email?.charAt(0).toUpperCase() || 'U';

  // Support both full_name and name properties for user display
  const displayName = user.full_name || user.name || user.email || 'Unknown User';
  
  return (
    <Card className="w-full">
      <CardContent className="flex items-center p-4">
        <Avatar className="h-10 w-10 mr-4">
          <AvatarImage src={user.avatar_url || ''} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="font-medium">{displayName}</p>
          {showRole && user.role && (
            <p className="text-xs text-gray-500">{user.role}</p>
          )}
          {showDepartment && user.department && (
            <p className="text-xs text-gray-500">{user.department}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTile;
