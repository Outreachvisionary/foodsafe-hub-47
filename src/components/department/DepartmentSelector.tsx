
import React, { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Department } from '@/types/department';
import { fetchDepartments } from '@/services/departmentService';
import { cn } from '@/lib/utils';

interface DepartmentSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  organizationId?: string;
  facilityId?: string;
  placeholder?: string;
  className?: string;
}

export const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  value,
  onChange,
  organizationId,
  facilityId,
  placeholder = "Select department...",
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDepartments = async () => {
      setLoading(true);
      try {
        const data = await fetchDepartments(organizationId, facilityId);
        setDepartments(data);
      } catch (error) {
        console.error('Failed to load departments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (organizationId || facilityId) {
      loadDepartments();
    }
  }, [organizationId, facilityId]);

  const selectedDepartment = departments.find(dept => dept.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={loading || (!organizationId && !facilityId)}
        >
          {loading ? (
            "Loading departments..."
          ) : value && selectedDepartment ? (
            selectedDepartment.name
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search departments..." />
          <CommandEmpty>No departments found.</CommandEmpty>
          <CommandGroup>
            {departments.map((department) => (
              <CommandItem
                key={department.id}
                value={department.id}
                onSelect={() => {
                  onChange(department.id === value ? "" : department.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === department.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {department.name}
                {department.description && (
                  <span className="ml-2 text-xs text-muted-foreground">{department.description}</span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// Also export as default for backward compatibility
export default DepartmentSelector;
