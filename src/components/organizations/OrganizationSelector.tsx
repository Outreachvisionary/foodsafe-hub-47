
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';
import { Organization } from '@/types/organization';
import { fetchOrganizations } from '@/utils/supabaseHelpers';

interface OrganizationSelectorProps {
  value?: string | null;
  onChange?: (organizationId: string) => void;
  disabled?: boolean;
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, updateUser } = useUser();

  useEffect(() => {
    loadOrganizations();
  }, [user]);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const organizationsData = await fetchOrganizations();
      setOrganizations(organizationsData || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load organizations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationChange = async (organizationId: string) => {
    if (onChange) {
      onChange(organizationId);
    }

    // Update the user's organization_id in their profile if they're changing it
    if (user && organizationId !== user.organization_id) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ organization_id: organizationId })
          .eq('id', user.id);

        if (error) throw error;

        // Update local user state
        if (updateUser) {
          updateUser({
            ...user,
            organization_id: organizationId
          });
        }

        toast({
          title: 'Success',
          description: 'Organization updated',
        });
      } catch (error) {
        console.error('Error updating organization:', error);
        toast({
          title: 'Error',
          description: 'Failed to update organization',
          variant: 'destructive',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-10">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-2">
        No organizations available
      </div>
    );
  }

  return (
    <Select 
      value={value || user?.organization_id || undefined} 
      onValueChange={handleOrganizationChange}
      disabled={disabled || organizations.length === 0}
    >
      <SelectTrigger className="w-full">
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
