
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { assignRoleToUser } from '@/services/roleService';
import { usePermission } from '@/contexts/PermissionContext';

interface AssignRoleButtonProps {
  userId: string;
  roleId: string;
  organizationId?: string;
  facilityId?: string;
  departmentId?: string;
  label?: string;
  onSuccess?: () => void;
}

const AssignRoleButton: React.FC<AssignRoleButtonProps> = ({
  userId,
  roleId,
  organizationId,
  facilityId,
  departmentId,
  label = "Assign Role",
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshPermissions } = usePermission();

  const handleAssignRole = async () => {
    setIsLoading(true);
    try {
      const success = await assignRoleToUser(userId, roleId, organizationId, facilityId, departmentId);
      
      if (success) {
        // Refresh permissions after role assignment
        await refreshPermissions();
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Error assigning role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleAssignRole} 
      disabled={isLoading}
      variant="outline"
      size="sm"
    >
      {isLoading ? 'Assigning...' : label}
    </Button>
  );
};

export default AssignRoleButton;
