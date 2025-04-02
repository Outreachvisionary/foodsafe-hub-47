
import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Organization } from '@/types/organization';
import { getOrganizations } from '@/services/organizationService';
import { useNavigate } from 'react-router-dom';

interface OrganizationSwitcherProps {
  className?: string;
}

export function OrganizationSwitcher({ className }: OrganizationSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setLoading(true);
        const data = await getOrganizations();
        const typedOrgs: Organization[] = data.map(org => ({
          ...org,
          id: org.id,
          name: org.name,
          status: org.status || 'active'
        }));
        
        setOrganizations(typedOrgs);
        
        // Select the first organization by default if there's no selection
        if (typedOrgs.length > 0 && !selectedOrg) {
          setSelectedOrg(typedOrgs[0]);
        }
      } catch (error) {
        console.error('Error loading organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrganizations();
  }, []);

  const handleSelectOrganization = (organization: Organization) => {
    setSelectedOrg(organization);
    setOpen(false);
    navigate(`/organization/dashboard/${organization.id}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select organization"
          className={cn("w-[200px] justify-between", className)}
        >
          <div className="flex items-center">
            <Building2 className="mr-2 h-4 w-4" />
            {selectedOrg?.name || "Select organization"}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search organizations..." />
          <CommandEmpty>
            {loading ? 'Loading...' : 'No organizations found.'}
          </CommandEmpty>
          <CommandGroup>
            {organizations.map((org) => (
              <CommandItem
                key={org.id}
                value={org.id}
                onSelect={() => handleSelectOrganization(org)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedOrg?.id === org.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {org.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default OrganizationSwitcher;
