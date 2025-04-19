
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import { Facility } from '@/types/facility';

interface FacilityListProps {
  facilities: Facility[];
  onEdit: (facility: Facility) => void;
  onDelete: (facilityId: string) => void;
}

const FacilityList: React.FC<FacilityListProps> = ({ facilities, onEdit, onDelete }) => {
  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
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

  if (facilities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No facilities found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {facilities.map((facility) => (
          <TableRow key={facility.id}>
            <TableCell className="font-medium">{facility.name}</TableCell>
            <TableCell>
              {[
                facility.address,
                facility.city,
                facility.state,
                facility.zipcode,
                facility.country
              ]
                .filter(Boolean)
                .join(', ')}
            </TableCell>
            <TableCell>
              <Badge className={getBadgeVariant(facility.status)}>
                {facility.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(facility)}
                title="Edit facility"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(facility.id)}
                title="Delete facility"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FacilityList;
