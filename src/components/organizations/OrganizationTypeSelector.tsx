
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
}

const OrganizationTypeSelector: React.FC<OrganizationTypeSelectorProps> = ({ value, onChange }) => {
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
    <Select value={value} onValueChange={onChange}>
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
