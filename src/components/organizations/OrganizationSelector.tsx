
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getOrganizations } from '@/services/organizationService';
import { Organization } from '@/types/organization';
import { Loader2 } from 'lucide-react';

interface OrganizationSelectorProps {
  value: string;
  onChange: (organizationId: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({
  value, 
  onChange,
  label = "Organization",
  placeholder = "Select an organization",
  className = ""
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        setLoading(true);
        const data = await getOrganizations();
        
        // Ensure all organizations have required fields
        const validOrgs = data.map(org => ({
          ...org,
          id: org.id || '',
          name: org.name || '',
          status: org.status || 'active'
        }));
        
        setOrganizations(validOrgs);
      } catch (err) {
        console.error('Error fetching organizations:', err);
        setError('Failed to load organizations');
      } finally {
        setLoading(false);
      }
    };

    fetchOrgs();
  }, []);

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <div className="flex items-center justify-between w-full">
            <SelectValue placeholder={placeholder} />
            {loading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
          </div>
        </SelectTrigger>
        <SelectContent>
          {error ? (
            <div className="p-2 text-red-500 text-sm">{error}</div>
          ) : organizations.length === 0 && !loading ? (
            <div className="p-2 text-muted-foreground text-sm">No organizations available</div>
          ) : (
            organizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default OrganizationSelector;
