
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface StatusSelectProps {
  status: "active" | "inactive" | "pending";
  onStatusChange: (status: "active" | "inactive" | "pending") => void;
  disabled?: boolean;
}

export const StatusSelect: React.FC<StatusSelectProps> = ({
  status,
  onStatusChange,
  disabled = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Select
      value={status}
      onValueChange={onStatusChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          <Badge className={`${getStatusColor(status)} capitalize`}>
            {status}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">
          <Badge className="bg-green-100 text-green-800">Active</Badge>
        </SelectItem>
        <SelectItem value="inactive">
          <Badge className="bg-red-100 text-red-800">Inactive</Badge>
        </SelectItem>
        <SelectItem value="pending">
          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
