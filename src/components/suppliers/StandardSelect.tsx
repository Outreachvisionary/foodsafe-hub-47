
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StandardName } from '@/types/supplier';

interface StandardSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  includeAll?: boolean;
  triggerClassName?: string;
  triggerProps?: React.ComponentPropsWithoutRef<typeof SelectTrigger>;
}

const StandardSelect: React.FC<StandardSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select Standard",
  includeAll = true,
  triggerClassName = "",
  triggerProps = {}
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={triggerClassName} {...triggerProps}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">All Standards</SelectItem>}
        <SelectItem value="SQF">SQF</SelectItem>
        <SelectItem value="BRC GS2">BRC GS2</SelectItem>
        <SelectItem value="ISO 22000">ISO 22000</SelectItem>
        <SelectItem value="FSSC 22000">FSSC 22000</SelectItem>
        <SelectItem value="HACCP">HACCP</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StandardSelect;
