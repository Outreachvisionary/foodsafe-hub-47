
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type OrganizationType = 
  | 'Food Manufacturer'
  | 'Distributor'
  | 'Restaurant'
  | 'Hotel'
  | 'Catering'
  | 'Retail'
  | 'Other';

interface OrganizationTypeSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
}

const OrganizationTypeSelector: React.FC<OrganizationTypeSelectorProps> = ({ 
  value, 
  onChange,
  onValueChange
}) => {
  const handleValueChange = (val: string) => {
    if (onChange) onChange(val);
    if (onValueChange) onValueChange(val);
  };

  const organizationTypes: OrganizationType[] = [
    'Food Manufacturer',
    'Distributor',
    'Restaurant',
    'Hotel',
    'Catering',
    'Retail',
    'Other'
  ];

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select organization type" />
      </SelectTrigger>
      <SelectContent>
        {organizationTypes.map((type) => (
          <SelectItem key={type} value={type}>
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default OrganizationTypeSelector;
