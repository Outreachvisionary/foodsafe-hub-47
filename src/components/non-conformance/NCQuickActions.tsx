
import React, { useState } from 'react';
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showGenerateCAPADialog, setShowGenerateCAPADialog] = useState(false);
  
  const handleCreateCAPA = () => {
    // Just close the dialog, the actual CAPA creation will be handled by the dialog component
    setShowGenerateCAPADialog(false);
    
    if (onCreateCAPA) {
      onCreateCAPA();
    }
    
    toast.success("CAPA created successfully");
  };
  
  const handleDelete = () => {
    setShowDeleteDialog(false);
    
    if (onDelete) {
      onDelete();
    }
    
    toast.success("Non-conformance deleted successfully");
  };
  
  // Mock NC data for CAPA creation
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
              onClick={onView}
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
                onClick={onEdit}
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
          
          <DropdownMenuItem>
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
      
      {/* Delete Confirmation Dialog */}
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
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Generate CAPA Dialog */}
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
