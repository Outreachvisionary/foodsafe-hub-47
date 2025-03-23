
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StandardName } from '@/types/supplier';

interface StandardSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  includeAll?: boolean;
  standards?: StandardName[];
  className?: string;
  triggerClassName?: string;
}

const defaultStandards: StandardName[] = ['SQF', 'BRC GS2', 'ISO 22000', 'FSSC 22000', 'HACCP'];

const StandardSelect: React.FC<StandardSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select Standard",
  includeAll = true,
  standards = defaultStandards,
  className,
  triggerClassName,
}) => {
  return (
    <div className={className}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {includeAll && <SelectItem value="all">All Standards</SelectItem>}
          {standards.map((standard) => (
            <SelectItem key={standard} value={standard}>{standard}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StandardSelect;
