
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Ban, Clock, CheckCircle, Trash2, MoreHorizontal, AlertTriangle, FilePlus } from 'lucide-react';
import { NCStatus } from '@/types/non-conformance';

interface NCQuickActionsProps {
  id: string;
  currentStatus: NCStatus;
  onStatusChange: (newStatus: NCStatus) => void;
  onGenerateCapa?: () => void;
}

const NCQuickActions: React.FC<NCQuickActionsProps> = ({ 
  id, 
  currentStatus, 
  onStatusChange,
  onGenerateCapa
}) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4 mr-2" />
          Quick Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          disabled={currentStatus === 'On Hold'}
          onClick={() => onStatusChange('On Hold')}
          className="flex items-center"
        >
          <Ban className="h-4 w-4 mr-2 text-orange-500" />
          <span>Put On Hold</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          disabled={currentStatus === 'Under Review'}
          onClick={() => onStatusChange('Under Review')}
          className="flex items-center"
        >
          <Clock className="h-4 w-4 mr-2 text-blue-500" />
          <span>Move to Review</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          disabled={currentStatus === 'Released'}
          onClick={() => onStatusChange('Released')}
          className="flex items-center"
        >
          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
          <span>Release Item</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          disabled={currentStatus === 'Disposed'}
          onClick={() => onStatusChange('Disposed')}
          className="flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
          <span>Mark as Disposed</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Other Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => navigate(`/non-conformance/${id}/edit`)}
          className="flex items-center"
        >
          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
          <span>Edit Item</span>
        </DropdownMenuItem>
        
        {onGenerateCapa && (
          <DropdownMenuItem 
            onClick={onGenerateCapa}
            className="flex items-center"
          >
            <FilePlus className="h-4 w-4 mr-2 text-purple-500" />
            <span>Generate CAPA</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NCQuickActions;
