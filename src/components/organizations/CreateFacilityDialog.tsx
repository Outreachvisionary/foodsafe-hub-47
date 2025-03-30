
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import FacilityForm from '@/components/facilities/FacilityForm';
import { Facility } from '@/types/facility';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreateFacilityDialogProps {
  organizationId: string;
  onFacilityCreated?: (facility: Facility) => void;
  trigger?: React.ReactNode;
}

const CreateFacilityDialog: React.FC<CreateFacilityDialogProps> = ({
  organizationId,
  onFacilityCreated,
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSuccess = (facility: Facility) => {
    console.log('Facility created successfully in dialog:', facility);
    if (onFacilityCreated) {
      onFacilityCreated(facility);
    }
    toast({
      title: 'Success',
      description: `Facility "${facility.name}" has been created.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Facility
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Facility</DialogTitle>
          <DialogDescription>
            Add a new facility to this organization.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 -mr-4">
          <FacilityForm 
            initialData={{ organization_id: organizationId }}
            onSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
            isDialog={true}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFacilityDialog;
