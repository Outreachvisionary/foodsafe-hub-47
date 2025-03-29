
import React, { useState, useEffect } from 'react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { fetchOrganizations } from '@/services/organizationService';
import { Organization } from '@/types/organization';

interface OrganizationSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchOrganizations();
        setOrganizations(data);
        
        // If there's only one organization and no value is selected, select it automatically
        if (data.length === 1 && !value) {
          onChange(data[0].id);
        }
      } catch (err) {
        console.error('Error loading organizations:', err);
        setError('Failed to load organizations');
      } finally {
        setLoading(false);
      }
    };

    loadOrganizations();
  }, []);

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || loading || organizations.length === 0}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select organization" />
      </SelectTrigger>
      <SelectContent>
        {error ? (
          <SelectItem value="error" disabled>{error}</SelectItem>
        ) : loading ? (
          <SelectItem value="loading" disabled>Loading...</SelectItem>
        ) : organizations.length === 0 ? (
          <SelectItem value="none" disabled>No organizations available</SelectItem>
        ) : (
          <SelectGroup>
            <SelectLabel>Organizations</SelectLabel>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
};

export default OrganizationSelector;
