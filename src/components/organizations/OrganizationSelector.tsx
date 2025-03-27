
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';
import { fetchOrganizations } from '@/utils/supabaseHelpers';
import { Organization } from '@/types/organization';

interface OrganizationSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({ value, onChange }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<string | undefined>(value);
  const { user, updateUser } = useUser();

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    // If value prop changes, update internal state
    if (value !== undefined) {
      setSelectedOrg(value);
    }
  }, [value]);

  // Set initial selection to user's organization_id if available and no value is provided
  useEffect(() => {
    if (selectedOrg === undefined && user?.organization_id) {
      setSelectedOrg(user.organization_id);
    }
  }, [user, selectedOrg]);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const orgsData = await fetchOrganizations();
      setOrganizations(orgsData);
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationChange = (orgId: string) => {
    setSelectedOrg(orgId);
    
    // Update user context if this is the user's selected organization
    if (user) {
      // Using explicit Partial<UserProfile> with only organization_id
      updateUser({ organization_id: orgId });
    }
    
    // Call onChange prop if provided
    if (onChange) {
      onChange(orgId);
    }
  };

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading organizations..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={selectedOrg} onValueChange={handleOrganizationChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select an organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.length === 0 ? (
          <SelectItem value="none" disabled>No organizations available</SelectItem>
        ) : (
          organizations.map((org) => (
            <SelectItem key={org.id} value={org.id}>
              {org.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default OrganizationSelector;
