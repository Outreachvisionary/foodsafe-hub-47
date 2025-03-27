
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';
import { Organization } from '@/types/organization';

const OrganizationSelector: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, updateProfile } = useUser();

  useEffect(() => {
    if (user) {
      fetchOrganizations();
      if (user.organization_id) {
        setSelectedOrg(user.organization_id);
      }
    }
  }, [user]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      
      // Use rpc call to get organizations
      const { data, error } = await supabase
        .rpc('get_user_organizations');
      
      if (error) throw error;
      
      // Type assertion for TypeScript
      setOrganizations(data as Organization[]);
      
      // If user doesn't have an organization set yet but there's only one available, select it
      if (data.length === 1 && !selectedOrg) {
        setSelectedOrg(data[0].id);
        if (user) {
          await updateProfile({ organization_id: data[0].id } as any);
        }
      }
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

  const handleOrganizationChange = async (value: string) => {
    setSelectedOrg(value);
    if (user) {
      try {
        await updateProfile({ organization_id: value } as any);
        toast({
          title: 'Organization Updated',
          description: 'Your active organization has been changed',
        });
        
        // Reload the page to update all data based on new organization
        window.location.reload();
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
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (organizations.length === 0) {
    return null;
  }

  if (organizations.length === 1) {
    return (
      <div className="px-3 py-2 text-sm font-medium">
        {organizations[0].name}
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      <Select value={selectedOrg || undefined} onValueChange={handleOrganizationChange}>
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
    </div>
  );
};

export default OrganizationSelector;
