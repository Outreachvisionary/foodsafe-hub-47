import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NCStatus } from '@/types/enums';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from '@/components/ui/badge';
import NCStatusBadge from './NCStatusBadge';

interface NCRecentItemProps {
  items: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
    assignedTo: string;
  }[];
}

const NCRecentItems: React.FC<NCRecentItemProps> = ({ items }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Non-Conformances</CardTitle>
        <CardDescription>Latest items requiring attention</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] w-full">
          <div className="p-4">
            {items.map((item) => (
              <div key={item.id} className="mb-4 last:mb-0 border rounded-md p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-gray-500">Created: {item.createdAt}</div>
                    <div className="text-sm text-gray-500">Assigned To: {item.assignedTo}</div>
                    <NCStatusBadge status={item.status as NCStatus} />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="text-center text-gray-500">No recent items</div>}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NCRecentItems;
