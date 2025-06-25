
import React, { useState, useEffect } from 'react';
import { fetchRoles } from '@/services/roleService';
import { Role } from '@/types/role';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface RoleSelectorProps {
  selectedRoleId?: string;
  value?: string;
  onRoleChange?: (roleId: string) => void;
  onChange?: (roleId: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRoleId,
  value,
  onRoleChange,
  onChange,
  label = "Role",
  placeholder = "Select a role",
  disabled = false
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoading(true);
        const rolesData = await fetchRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error loading roles:', error);
        toast.error('Failed to load roles');
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  const handleValueChange = (roleId: string) => {
    if (onRoleChange) onRoleChange(roleId);
    if (onChange) onChange(roleId);
  };

  const currentValue = selectedRoleId || value;

  return (
    <div className="space-y-2">
      <Label htmlFor="role-selector">{label}</Label>
      <Select
        disabled={disabled || loading}
        value={currentValue}
        onValueChange={handleValueChange}
      >
        <SelectTrigger id="role-selector">
          <SelectValue placeholder={loading ? "Loading roles..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              <div className="flex flex-col">
                <span className="font-medium">{role.name}</span>
                {role.description && (
                  <span className="text-xs text-muted-foreground">{role.description}</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSelector;
