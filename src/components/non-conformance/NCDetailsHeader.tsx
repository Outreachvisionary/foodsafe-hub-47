
import React from 'react';
import { MoreHorizontal, Edit, FileText, Clock, User, Flag, Link as LinkIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { NCStatus } from '@/types/enums';
import NCStatusBadge from './NCStatusBadge';
import { NonConformance } from '@/types/non-conformance';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface NCDetailsHeaderProps {
  nonConformance: NonConformance;
}

const NCDetailsHeader: React.FC<NCDetailsHeaderProps> = ({ nonConformance }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
      <div className="flex items-center space-x-2">
        <h2 className="text-2xl font-bold">{nonConformance.title}</h2>
        <NCStatusBadge status={nonConformance.status} />
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open dropdown menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Clock className="mr-2 h-4 w-4" />
              Schedule Review
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Assign Task
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Flag className="mr-2 h-4 w-4" />
              Escalate Issue
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LinkIcon className="mr-2 h-4 w-4" />
              Link to Existing NC
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default NCDetailsHeader;
