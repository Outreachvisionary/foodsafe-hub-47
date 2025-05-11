
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash, CircleAlert, AlertTriangle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { deleteNonConformance } from '@/services/nonConformanceService';

interface NCQuickActionsProps {
  id: string;
  onEditClick?: () => void;
  onDeleteSuccess?: () => void;
}

const NCQuickActions: React.FC<NCQuickActionsProps> = ({
  id,
  onEditClick,
  onDeleteSuccess
}) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteNonConformance(id);
      toast.success('Non-conformance deleted successfully');
      
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('Error deleting non-conformance:', error);
      toast.error('Failed to delete non-conformance');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={onEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => navigate(`/non-conformance/generate-report/${id}`)}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => navigate(`/capa/new?source=nonconformance&sourceId=${id}`)}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Create CAPA
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-500 focus:text-red-500"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <CircleAlert className="h-5 w-5 mr-2 text-red-500" />
              Delete Non-Conformance
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this non-conformance record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NCQuickActions;
