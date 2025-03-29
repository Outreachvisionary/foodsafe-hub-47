
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { giveUserDeveloperAccess, createQATechnicianRole } from '@/services/userService';
import { useUser } from '@/contexts/UserContext';
import { usePermission } from '@/contexts/PermissionContext';

interface AssignRoleButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const AssignRoleButton: React.FC<AssignRoleButtonProps> = ({ variant = 'default' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const { refreshPermissions } = usePermission();
  
  const handleAssignDeveloperRole = async () => {
    if (!user) {
      toast.error('You must be logged in to perform this action');
      return;
    }
    
    setIsLoading(true);
    try {
      // Create the QA Technician role (but don't assign it)
      await createQATechnicianRole();
      
      // Assign Developer role to current user
      const success = await giveUserDeveloperAccess(user.id);
      
      if (success) {
        toast.success('Developer role assigned successfully');
        // Refresh the user's permissions
        await refreshPermissions();
      } else {
        toast.error('Failed to assign Developer role');
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('An error occurred while updating roles');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant={variant}
      onClick={handleAssignDeveloperRole}
      disabled={isLoading}
    >
      {isLoading ? 'Updating...' : 'Give Developer Access'}
    </Button>
  );
};

export default AssignRoleButton;
