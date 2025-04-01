
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  ArrowUpRight, 
  ChevronDown, 
  ClipboardList, 
  Eye, 
  FileText, 
  Link, 
  MoreHorizontal, 
  Pencil, 
  Printer, 
  Trash2 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { deleteNonConformance } from '@/services/nonConformanceService';
import { NCStatus } from '@/types/non-conformance';

interface NCQuickActionsProps {
  id: string;
  status: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onCreateCAPA?: () => void;
  onStatusChange?: (newStatus: NCStatus) => Promise<void>;
}

const NCQuickActions: React.FC<NCQuickActionsProps> = ({
  id,
  status,
  onEdit,
  onDelete,
  onView,
  onCreateCAPA,
  onStatusChange
}) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showGenerateCAPADialog, setShowGenerateCAPADialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  
  const handleCreateCAPA = () => {
    console.log('Creating CAPA from NCQuickActions for NC:', id);
    setShowGenerateCAPADialog(false);
    
    if (onCreateCAPA) {
      onCreateCAPA();
    } else {
      // Default implementation if no custom handler provided
      try {
        // Navigate to the CAPA module with source information
        navigate(`/capa/new?source=nonconformance&sourceId=${id}`);
        toast.success("Redirecting to CAPA creation");
      } catch (error) {
        console.error('Error navigating to CAPA creation:', error);
        toast.error("Failed to navigate to CAPA creation");
      }
    }
  };
  
  const handleDelete = async () => {
    try {
      console.log('Deleting NC:', id);
      setIsDeleting(true);
      
      if (onDelete) {
        onDelete();
      } else {
        // Default implementation if no custom handler provided
        await deleteNonConformance(id);
        navigate('/non-conformance');
      }
      
      toast.success("Non-conformance deleted successfully");
    } catch (error) {
      console.error('Error deleting non-conformance:', error);
      toast.error("Failed to delete non-conformance");
    } finally {
      setShowDeleteDialog(false);
      setIsDeleting(false);
    }
  };
  
  const handleChangeStatus = async (newStatus: NCStatus) => {
    if (!onStatusChange) {
      console.error('No status change handler provided');
      toast.error("Status change functionality is not available");
      return;
    }
    
    try {
      console.log(`Changing status from ${status} to ${newStatus}`);
      setIsChangingStatus(true);
      
      // Add some defensive code here to prevent errors
      await onStatusChange(newStatus).catch(error => {
        console.error('Error in status change handler:', error);
        throw new Error('Status change failed in handler');
      });
      
      toast.success(`Status changed to ${newStatus}`);
    } catch (error) {
      console.error('Error changing status:', error);
      toast.error("Failed to change status. Please try again later.");
    } finally {
      setIsChangingStatus(false);
    }
  };
  
  const handleEdit = () => {
    console.log('Editing NC:', id);
    if (onEdit) {
      onEdit();
    } else {
      navigate(`/non-conformance/edit/${id}`);
    }
  };
  
  const handleView = () => {
    console.log('Viewing NC:', id);
    if (onView) {
      onView();
    } else {
      navigate(`/non-conformance/${id}`);
    }
  };
  
  // Define status transitions allowed
  const getAvailableStatusChanges = (): NCStatus[] => {
    switch (status as NCStatus) {
      case 'On Hold':
        return ['Under Review', 'Released', 'Disposed'];
      case 'Under Review':
        return ['On Hold', 'Released', 'Disposed', 'Approved', 'Rejected'];
      case 'Released':
        return ['On Hold', 'Closed'];
      case 'Disposed':
        return ['Closed'];
      case 'Approved':
        return ['Resolved', 'Closed'];
      case 'Rejected':
        return ['On Hold'];
      case 'Resolved':
        return ['Closed'];
      case 'Closed':
        return [];
      default:
        return [];
    }
  };
  
  // Log for debugging
  console.log('Quick actions for NC:', id, 'with status:', status);
  console.log('Available status changes:', getAvailableStatusChanges());
  
  return (
    <div className="flex justify-end items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleView}
              className="h-8 w-8"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Details</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {status !== 'Closed' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleEdit}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {onStatusChange && getAvailableStatusChanges().length > 0 && (
        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8"
                    disabled={isChangingStatus}
                  >
                    Change Status
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change Status</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Change status to:</DropdownMenuLabel>
            {getAvailableStatusChanges().map((newStatus) => (
              <DropdownMenuItem 
                key={newStatus} 
                onClick={() => handleChangeStatus(newStatus)}
                disabled={isChangingStatus}
              >
                {newStatus}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>More Options</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={() => {
            console.log('Show generate CAPA dialog');
            setShowGenerateCAPADialog(true);
          }}>
            <ClipboardList className="h-4 w-4 mr-2" />
            Generate CAPA
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate(`/documents?linkedTo=nonconformance&id=${id}`)}>
            <Link className="h-4 w-4 mr-2" />
            Link to Document
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <FileText className="h-4 w-4 mr-2" />
            Export to PDF
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => {
            console.log('Show delete dialog');
            setShowDeleteDialog(true);
          }} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={showGenerateCAPADialog} onOpenChange={setShowGenerateCAPADialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              Generate CAPA
            </DialogTitle>
            <DialogDescription>
              Do you want to generate a Corrective and Preventive Action (CAPA) for this non-conformance?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowGenerateCAPADialog(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleCreateCAPA}
            >
              Create CAPA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this non-conformance? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NCQuickActions;
