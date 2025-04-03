
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { getOrganizations } from '@/services/organizationService';
import { Organization } from '@/types/organization';
import { cn } from '@/lib/utils';

export interface OrganizationSelectorProps {
  value: string;
  onChange: (...event: any[]) => void;
  disabled?: boolean;
  className?: string;
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({ 
  value, 
  onChange,
  disabled = false,
  className
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setLoading(true);
        const data = await getOrganizations();
        // Ensure all organizations have required fields
        const validatedOrgs = data.map(org => ({
          ...org,
          id: org.id || '',
          status: org.status || 'active'
        }));
        setOrganizations(validatedOrgs);
      } catch (error) {
        console.error('Failed to load organizations:', error);
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
      disabled={disabled || loading}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder="Select Organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default OrganizationSelector;
