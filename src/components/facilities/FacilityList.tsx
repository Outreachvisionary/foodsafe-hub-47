
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Facility } from '@/types/facility';

interface FacilityListProps {
  facilities: Facility[];
  onFacilityUpdated: (facility: Facility) => void;
  onFacilityDeleted: (id: string) => void;
}

const FacilityList: React.FC<FacilityListProps> = ({ 
  facilities, 
  onFacilityUpdated, 
  onFacilityDeleted 
}) => {
  if (facilities.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No facilities found. Add your first facility to get started.
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
              {[facility.city, facility.state, facility.country]
                .filter(Boolean)
                .join(', ')}
            </TableCell>
            <TableCell>
              <Badge variant={facility.status === 'active' ? 'success' : 'secondary'}>
                {facility.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onFacilityUpdated(facility)}
                    className="flex items-center cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onFacilityDeleted(facility.id)}
                    className="flex items-center text-red-600 cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FacilityList;
