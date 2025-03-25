
import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Ban, Clock, ThumbsUp, Trash2, AlertTriangle, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { NCStatus } from '@/types/non-conformance';
import { useUser } from '@/contexts/UserContext';
import CreateCAPADialog from '@/components/capa/CreateCAPADialog';

interface NCQuickActionsProps {
  id: string;
  currentStatus: NCStatus;
  onStatusChange: (newStatus: NCStatus) => void;
  onGenerateCapa: () => void;
}

const NCQuickActions: React.FC<NCQuickActionsProps> = ({ 
  id, 
  currentStatus, 
  onStatusChange, 
  onGenerateCapa
}) => {
  const [comments, setComments] = useState('');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<NCStatus | null>(null);
  const [capaDialogOpen, setCapaDialogOpen] = useState(false);
  const { user } = useUser();

  const handleStatusChange = (status: NCStatus) => {
    setNewStatus(status);
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (newStatus) {
      onStatusChange(newStatus);
      setStatusDialogOpen(false);
      setComments('');
      setNewStatus(null);
    }
  };

  const getStatusButtonDetails = () => {
    switch (currentStatus) {
      case 'On Hold':
        return {
          icon: <Clock className="h-4 w-4 mr-2" />,
          text: 'Review',
          handler: () => handleStatusChange('Under Review'),
        };
      case 'Under Review':
        return {
          icon: <ThumbsUp className="h-4 w-4 mr-2" />,
          text: 'Release',
          handler: () => handleStatusChange('Released'),
        };
      case 'Released':
        return {
          icon: <Ban className="h-4 w-4 mr-2" />,
          text: 'Put on Hold Again',
          handler: () => handleStatusChange('On Hold'),
        };
      case 'Disposed':
        return {
          icon: <AlertTriangle className="h-4 w-4 mr-2" />,
          text: 'No Actions Available',
          handler: () => {},
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 mr-2" />,
          text: 'Review',
          handler: () => handleStatusChange('Under Review'),
        };
    }
  };

  const statusButton = getStatusButtonDetails();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Actions <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={statusButton.handler}>
              {statusButton.icon}
              <span>{statusButton.text}</span>
            </DropdownMenuItem>
            
            {(currentStatus === 'On Hold' || currentStatus === 'Under Review') && (
              <DropdownMenuItem onClick={() => handleStatusChange('Disposed')}>
                <Trash2 className="h-4 w-4 mr-2" />
                <span>Dispose</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => setCapaDialogOpen(true)}>
              <Zap className="h-4 w-4 mr-2" />
              <span>Generate CAPA</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus === 'Under Review' && 'Start Review Process'}
              {newStatus === 'Released' && 'Release Item'}
              {newStatus === 'Disposed' && 'Dispose Item'}
              {newStatus === 'On Hold' && 'Put Item On Hold'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              {newStatus === 'Under Review' && 'This will mark the item as being under review.'}
              {newStatus === 'Released' && 'This will release the item from hold status.'}
              {newStatus === 'Disposed' && 'This will mark the item as disposed. This action cannot be undone.'}
              {newStatus === 'On Hold' && 'This will put the item back on hold.'}
            </p>
            <Textarea
              placeholder="Add any comments about this status change (optional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStatusChange}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateCAPADialog
        open={capaDialogOpen}
        onOpenChange={setCapaDialogOpen}
        sourceData={{
          id: id,
          title: `CAPA for Non-Conformance ${id}`,
          description: 'Corrective and preventive action for a non-conformance issue',
          source: 'non_conformance',
          sourceId: id,
          date: new Date().toISOString(),
          severity: 'high',
        }}
        onCAPACreated={onGenerateCapa}
      />
    </>
  );
};

export default NCQuickActions;
