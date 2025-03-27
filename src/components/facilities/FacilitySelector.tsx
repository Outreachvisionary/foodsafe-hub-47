
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';

interface Facility {
  id: string;
  name: string;
  facility_type: string | null;
  status: string;
}

interface FacilitySelectorProps {
  organizationId?: string | null;
  value?: string | null;
  onChange?: (facilityId: string) => void;
  disabled?: boolean;
}

const FacilitySelector: React.FC<FacilitySelectorProps> = ({
  organizationId,
  value,
  onChange,
  disabled = false
}) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();
  
  // Use the organization ID from props or fallback to the user's organization
  const activeOrgId = organizationId || user?.organization_id;

  useEffect(() => {
    if (activeOrgId) {
      fetchFacilities(activeOrgId);
    }
  }, [activeOrgId, user]);

  const fetchFacilities = async (orgId: string) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('facilities')
        .select('id, name, facility_type, status')
        .eq('organization_id', orgId)
        .eq('status', 'active');
      
      // If the user has assigned facilities, only show those
      if (user && user.assigned_facility_ids && user.assigned_facility_ids.length > 0 && !user.role?.includes('admin')) {
        query = query.in('id', user.assigned_facility_ids);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setFacilities(data as Facility[]);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load facilities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFacilityChange = (facilityId: string) => {
    if (onChange) {
      onChange(facilityId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-10">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (facilities.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-2">
        No facilities available
      </div>
    );
  }

  return (
    <Select 
      value={value || undefined} 
      onValueChange={handleFacilityChange}
      disabled={disabled || facilities.length === 0}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Facility" />
      </SelectTrigger>
      <SelectContent>
        {facilities.map((facility) => (
          <SelectItem key={facility.id} value={facility.id}>
            {facility.name}
            {facility.facility_type && <span className="text-muted-foreground ml-2">({facility.facility_type})</span>}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FacilitySelector;
