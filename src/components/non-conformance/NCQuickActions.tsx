
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
import { toast } from '@/components/ui/use-toast';
import { deleteNonConformance } from '@/services/nonConformanceService';
import CreateCAPADialog from '../capa/CreateCAPADialog';
import { NCStatus } from '@/types/non-conformance';
import { CAPASource } from '@/types/capa';

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
  
  const handleCreateCAPA = () => {
    setShowGenerateCAPADialog(false);
    
    if (onCreateCAPA) {
      onCreateCAPA();
    } else {
      // Default implementation if no custom handler provided
      navigate(`/capa/new?source=nonconformance&sourceId=${id}`);
    }
    
    toast.success("CAPA created successfully");
  };
  
  const handleDelete = async () => {
    try {
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
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      // Update the route format to match the one defined in App.tsx
      navigate(`/non-conformance/edit/${id}`);
    }
  };
  
  const handleView = () => {
    if (onView) {
      onView();
    } else {
      navigate(`/non-conformance/${id}`);
    }
  };
  
  const mockNCData = {
    id: id,
    title: "Non-conformance issue requiring corrective action",
    description: "This non-conformance was identified and requires a CAPA to prevent recurrence",
    source: 'nonconformance' as CAPASource,
    sourceId: id,
    date: new Date().toISOString().split('T')[0],
    severity: "major"
  };
  
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
          
          <DropdownMenuItem onClick={() => setShowGenerateCAPADialog(true)}>
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
          
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
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
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <CreateCAPADialog 
        open={showGenerateCAPADialog}
        onOpenChange={setShowGenerateCAPADialog}
        sourceData={mockNCData}
        onCAPACreated={handleCreateCAPA}
      />
    </div>
  );
};

export default NCQuickActions;
